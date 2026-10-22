import {test,expect,type Page} from '@playwright/test';
import {generateSW} from 'workbox-build';
import {createServer} from 'node:http';
import {execFileSync} from 'node:child_process';
import {cp,readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,extname} from 'node:path';
import {assemblePages,appPaths} from '../../scripts/assemble-pages.mjs';
import {createCharacter,menuAction,fillField,finish,closeEditor} from './helpers';

async function snapshot(page:Page) {
  return page.evaluate(async()=>{
    const result:Record<string,unknown>={};
    for(const name of ['dnd-character-companion','dnd-character-companion-test']) {
      const request=indexedDB.open(name);
      const db=await new Promise<IDBDatabase>((ok,no)=>{request.onsuccess=()=>ok(request.result);request.onerror=()=>no(request.error);});
      const data:Record<string,unknown>={};
      for(const store of ['characters','events','settings','assets']) {
        const request=db.transaction(store).objectStore(store).getAll();
        data[store]=await new Promise((ok,no)=>{request.onsuccess=()=>ok(request.result);request.onerror=()=>no(request.error);});
      }
      db.close();result[name]=data;
    }
    return result;
  });
}

test('retires real legacy Workbox scopes without losing data, editing state or either new offline app',async({page,context})=>{
  test.setTimeout(150_000);
  const temp=await mkdtemp(join(tmpdir(),'my-dnd-migration-'));
  const site=join(temp,'site'),legacyApp=join(temp,'old-app'),legacyTest=join(temp,'old-test');
  const previewDir=join(site,appPaths.preview),appDir=join(site,appPaths.production);
  execFileSync(process.execPath,['node_modules/vite/bin/vite.js','build','--outDir',previewDir],{
    env:{...process.env,VITE_APP_CHANNEL:'test',VITE_PREVIEW_PR:'61'},stdio:'pipe',
  });
  await cp(resolve('dist'),appDir,{recursive:true});
  await cp(appDir,legacyApp,{recursive:true});await cp(previewDir,legacyTest,{recursive:true});
  // Real generated workers reproduce the old root + nested test scopes and broad root fallback.
  for(const [directory,cacheId] of [[legacyApp,'my-dnd-production'],[legacyTest,'my-dnd-test']]) {
    await generateSW({swDest:join(directory,'sw.js'),globDirectory:directory,
      globPatterns:['**/*.{html,js,css,png,ttf,webmanifest,txt}'],globIgnores:['sw-messages.js','legacy-cleanup.js'],
      cacheId,cleanupOutdatedCaches:false,clientsClaim:true,navigateFallback:'index.html',navigateFallbackDenylist:[/\/test(?:\/|$)/]});
  }
  const {sha}=JSON.parse(await readFile(join(appDir,'environment-layout.json'),'utf8'));
  await assemblePages(site,{version:1,production:{sha},preview:{sha,pr:61}});
  let migrated=false;
  const prefix='/dnd-character-sheet/';
  const server=createServer(async(req,res)=>{
    try{
      const path=new URL(req.url!,'http://localhost').pathname;
      if(!path.startsWith(prefix)){res.writeHead(404).end();return;}
      let directory=site,relative=path.slice(prefix.length);
      if(!migrated){
        const test=relative.startsWith('test/');directory=test?legacyTest:legacyApp;
        if(test)relative=relative.slice('test/'.length);
      }
      if(!relative||relative.endsWith('/'))relative+='index.html';
      const file=resolve(directory,relative);
      if(!file.startsWith(directory+'/')){res.writeHead(404).end();return;}
      const mime:Record<string,string>={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webmanifest':'application/manifest+json','.json':'application/json','.ttf':'font/ttf'};
      res.setHeader('Content-Type',mime[extname(file)]??'text/plain');res.setHeader('Cache-Control','no-store');
      res.end(await readFile(file));
    }catch{res.writeHead(404).end();}
  });
  await new Promise<void>(ok=>server.listen(0,'127.0.0.1',ok));
  const root=`http://127.0.0.1:${(server.address() as {port:number}).port}${prefix}`;
  let oldTest:Page|undefined,app:Page|undefined,preview:Page|undefined;
  try{
    await createCharacter(page,'Human',root);
    await page.waitForFunction(()=>navigator.serviceWorker.controller!==null);
    oldTest=await context.newPage();await createCharacter(oldTest,'Human',root+'test/');
    await menuAction(oldTest,'Rediger karakter');await fillField(oldTest,'Navn','Test-Alva');await finish(oldTest);
    await menuAction(oldTest,'Ny karakter');await fillField(oldTest,'Navn','Bevart testutkast');await closeEditor(oldTest);
    await oldTest.waitForFunction(()=>navigator.serviceWorker.controller?.scriptURL.endsWith('/test/sw.js'));
    await page.evaluate(()=>localStorage.setItem('migration-sentinel','behold'));
    await menuAction(page,'Rediger karakter');await fillField(page,'Navn','Ulagret navn');
    await expect.poll(async()=>{
      const data=await snapshot(page);
      return JSON.stringify((data['dnd-character-companion'] as any).settings).includes('Ulagret navn');
    }).toBe(true);
    const before=await snapshot(page);
    migrated=true;
    await page.evaluate(async()=>{const reg=await navigator.serviceWorker.getRegistration(location.href);await reg!.update();});
    await expect.poll(()=>page.evaluate(async()=>!(await navigator.serviceWorker.getRegistrations()).some(reg=>reg.scope===new URL('./',location.href).href))).toBe(true);
    // The retirement worker activates automatically but never navigates an editing window.
    await expect(page.getByRole('textbox',{name:'Navn',exact:true})).toHaveValue('Ulagret navn');
    expect(await snapshot(page)).toEqual(before);
    await closeEditor(page); // character editor saves a draft without changing confirmed Alva

    app=await context.newPage();await app.goto(root+appPaths.production);
    await expect(app.getByRole('heading',{name:'Alva',exact:true})).toBeVisible();
    await app.waitForFunction(()=>navigator.serviceWorker.controller?.scriptURL.endsWith('/my-dnd/app/sw.js'));
    // Opening the new app also removes the other legacy registration, never the new one.
    await expect.poll(()=>app!.evaluate(async()=>(await navigator.serviceWorker.getRegistrations()).map(reg=>reg.scope))).toEqual([root+appPaths.production]);
    await expect(oldTest.getByRole('heading',{name:'Test-Alva',exact:true})).toBeVisible();
    preview=await context.newPage();await preview.goto(root+appPaths.preview);
    await expect(preview.getByRole('heading',{name:'Test-Alva',exact:true})).toBeVisible();
    await preview.waitForFunction(()=>navigator.serviceWorker.controller?.scriptURL.endsWith('/my-dnd/test-app/sw.js'));
    await menuAction(preview,'Bevart testutkast Utkast · Fortsett');
    await expect(preview.getByRole('textbox',{name:'Navn',exact:true})).toHaveValue('Bevart testutkast');await closeEditor(preview);
    expect(await app.evaluate(()=>localStorage.getItem('migration-sentinel'))).toBe('behold');

    for(const [old,target,name] of [[root,root+appPaths.production,'My D&D'],[root+'test/',root+appPaths.preview,'My D&D Test']]) {
      await page.goto(old);await expect(page.getByRole('heading',{name:name+' har flyttet',exact:true})).toBeVisible();
      await expect(page.locator('link[rel="manifest"]')).toHaveCount(0);
      await page.screenshot({path:`test-results/migration-${name==='My D&D'?'app':'test'}-mobile.png`,fullPage:true});
      await page.getByRole('link',{name:'Åpne '+name,exact:true}).click();await expect(page).toHaveURL(target);
    }
    const scopes=await app.evaluate(async()=>(await navigator.serviceWorker.getRegistrations()).map(reg=>reg.scope).sort());
    expect(scopes).toEqual([root+appPaths.production,root+appPaths.preview].sort());
    const cacheNames=await app.evaluate(()=>caches.keys());
    expect(cacheNames.some(name=>name.endsWith(root)||name.endsWith(root+'test/'))).toBe(false);
    expect(cacheNames.some(name=>name.endsWith(root+appPaths.production))).toBe(true);
    expect(cacheNames.some(name=>name.endsWith(root+appPaths.preview))).toBe(true);
    // Compare persistent rows after expected draft saves; migration itself did not mutate them.
    const after=await snapshot(app);
    expect((after['dnd-character-companion'] as any).characters).toEqual((before['dnd-character-companion'] as any).characters);
    expect((after['dnd-character-companion-test'] as any).characters).toEqual((before['dnd-character-companion-test'] as any).characters);
    await page.close();await oldTest.close();
    await context.setOffline(true);await app.reload();await preview.reload();
    await expect(app.getByRole('heading',{name:'Alva',exact:true})).toBeVisible();
    await expect(preview.getByRole('heading',{name:'Test-Alva',exact:true})).toBeVisible();
    await app.screenshot({path:'test-results/new-app-mobile.png',fullPage:true});
    await preview.screenshot({path:'test-results/new-test-app-mobile.png',fullPage:true});
  }finally{
    await context.setOffline(false);
    await Promise.all([page,oldTest,app,preview].filter(Boolean).map(p=>p!.close()));
    server.closeAllConnections();await new Promise<void>((ok,no)=>server.close(error=>error?no(error):ok()));
    await rm(temp,{recursive:true,force:true});
  }
});
