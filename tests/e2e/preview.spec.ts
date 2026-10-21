import {test, expect, type Page} from '@playwright/test';
import {createServer} from 'node:http';
import {execFileSync} from 'node:child_process';
import {readFile, mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve, extname, join} from 'node:path';
import {createHash} from 'node:crypto';
import {menuAction, fillField, choose, characterStep, finish, closeEditor} from './helpers';

test.use({actionTimeout:10000});

async function databaseSnapshot(page:Page, name:string) {
  return page.evaluate(async name=>{
    const req=indexedDB.open(name);
    const db=await new Promise<IDBDatabase>((ok,no)=>{req.onsuccess=()=>ok(req.result);req.onerror=()=>no(req.error);});
    const rows:Record<string,unknown[]>={};
    for(const store of ['characters','assets','events','settings']) {
      const req=db.transaction(store).objectStore(store).getAll();
      rows[store]=await new Promise<unknown[]>((ok,no)=>{req.onsuccess=()=>ok(req.result);req.onerror=()=>no(req.error);});
    }
    db.close();return rows;
  },name);
}

test('production and a fixed preview retain separate characters, portraits, drafts and offline caches across releases',async({page,context})=>{
  test.setTimeout(120_000);
  const temp=await mkdtemp(join(tmpdir(),'dnd-preview-'));
  let preview:Page|undefined;
  let productionRelease='A', previewRelease='A';
  for(const [release,pr] of [['A','55'],['B','56']]) {
    execFileSync(process.execPath,['node_modules/vite/bin/vite.js','build','--outDir',join(temp,release)],{
      env:{...process.env,VITE_APP_CHANNEL:'test',VITE_PREVIEW_PR:pr},stdio:'pipe',
    });
  }
  const originalIndex=await readFile('dist/index.html','utf8'),originalWorker=await readFile('dist/sw.js','utf8');
  const prefix='/dnd-character-sheet/';
  const server=createServer(async(req,res)=>{
    try {
      const path=decodeURIComponent(new URL(req.url!,'http://localhost').pathname);
      if(!path.startsWith(prefix)){res.writeHead(404).end();return;}
      const isPreview=path.startsWith(prefix+'test/');
      const relative=path.slice((prefix+(isPreview?'test/':'')).length)||'index.html';
      const directory=isPreview?join(temp,previewRelease):resolve('dist');
      const file=resolve(directory,relative);
      if(!file.startsWith(directory+'/')){res.writeHead(404).end();return;}
      const mime:Record<string,string>={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.ttf':'font/ttf','.webmanifest':'application/manifest+json'};
      res.setHeader('Content-Type',mime[extname(file)]??'application/octet-stream');
      res.setHeader('Cache-Control','no-store');
      const html=originalIndex.replace(/<title>.*?<\/title>/,`<title>Production ${productionRelease}</title>`);
      if(!isPreview&&relative==='index.html')res.end(html);
      else if(!isPreview&&relative==='sw.js') {
        const revision=createHash('sha256').update(html).digest('hex');
        res.end(originalWorker.replace(/(url:"index\.html",revision:")[^"]+("})/,`$1${revision}$2`));
      } else res.end(await readFile(file));
    }catch{res.writeHead(404).end();}
  });
  await new Promise<void>(ok=>server.listen(0,'127.0.0.1',ok));
  const url=`http://127.0.0.1:${(server.address() as {port:number}).port}${prefix}`;
  try {
    await page.goto(url);
    await menuAction(page,'Ny karakter');
    await fillField(page,'Navn','Produksjons-Alva');
    await choose(page,'Art / species',{label:'Human'});
    await characterStep(page,1);await choose(page,'Klasse',{label:'Fighter'});
    await characterStep(page,2);await fillField(page,'Maks HP fra karakterarket','12');await finish(page);
    await expect(page.getByRole('heading',{name:'Produksjons-Alva',exact:true})).toBeVisible();
    await page.waitForFunction(async()=>Boolean((await navigator.serviceWorker.getRegistration())?.active),null,{timeout:15000});
    await page.waitForFunction(()=>navigator.serviceWorker.controller!==null);
    await expect(page.getByLabel('Testversjon',{exact:true})).toHaveCount(0);

    const download=page.waitForEvent('download');await menuAction(page,'Eksporter backup');
    const backup=await(await download).path();
    preview=await context.newPage();await preview.goto(url+'test/');
    await expect(preview.getByLabel('Testversjon',{exact:true})).toContainText('PR #55');
    await expect(preview.getByRole('heading',{name:'Produksjons-Alva',exact:true})).toHaveCount(0);
    await preview.waitForFunction(async()=>Boolean((await navigator.serviceWorker.getRegistration())?.active),null,{timeout:15000});
    await preview.waitForFunction(()=>navigator.serviceWorker.controller?.scriptURL.includes('/test/sw.js'));
    await expect(preview.getByLabel('Appoppdatering')).not.toBeVisible();
    const manifest=await preview.evaluate(async()=>await(await fetch('./manifest.webmanifest')).json());
    expect(manifest).toMatchObject({id:'./',start_url:'./',scope:'./',name:'My D&D Test',short_name:'My D&D Test'});
    await menuAction(preview,'Importer backup');await preview.getByLabel('JSON-fil').setInputFiles(backup!);
    await preview.getByRole('dialog').getByRole('button',{name:'Importer',exact:true}).click();
    await expect(preview.getByRole('heading',{name:'Produksjons-Alva',exact:true})).toBeVisible();
    await menuAction(preview,'Rediger karakter');await fillField(preview,'Navn','Test-Alva');await finish(preview);
    await expect(preview.getByRole('heading',{name:'Test-Alva',exact:true})).toBeVisible();
    const image=await preview.evaluate(()=>{const c=document.createElement('canvas');c.width=8;c.height=12;c.getContext('2d')!.fillRect(0,0,8,12);return c.toDataURL('image/png').split(',')[1];});
    const chooser=preview.waitForEvent('filechooser');await menuAction(preview,'Portrett');
    await(await chooser).setFiles({name:'portrait.png',mimeType:'image/png',buffer:Buffer.from(image,'base64')});
    await expect(preview.getByRole('button',{name:'Vis portrett',exact:true})).toBeVisible();
    await menuAction(preview,'Ny karakter');await fillField(preview,'Navn','Uferdig testkarakter');await closeEditor(preview);
    const originalProduction=await databaseSnapshot(page,'dnd-character-companion');
    const originalTest=await databaseSnapshot(preview,'dnd-character-companion-test');
    expect(originalTest.assets).toHaveLength(1);expect(originalTest.events.length).toBeGreaterThan(1);
    expect(originalTest.settings.some((r:any)=>r.id.startsWith('wizard-draft:'))).toBe(true);
    await preview.screenshot({path:'test-results/preview-mobile.png',fullPage:true});

    // A root-worker activation must neither count the test tab nor delete its cache.
    productionRelease='B';await menuAction(page,'Se etter oppdatering');
    await expect(page.getByLabel('Appoppdatering')).toContainText('En ny versjon er klar');
    await page.getByRole('button',{name:'Oppdater appen',exact:true}).click();
    await expect(page).toHaveTitle('Production B');
    expect(await databaseSnapshot(page,'dnd-character-companion')).toEqual(originalProduction);

    previewRelease='B';await menuAction(preview,'Se etter oppdatering');
    await expect(preview.getByLabel('Appoppdatering')).toContainText('En ny versjon er klar');
    await preview.getByRole('button',{name:'Oppdater appen',exact:true}).click();
    await expect(preview.getByLabel('Testversjon',{exact:true})).toContainText('PR #56');
    expect(await databaseSnapshot(preview,'dnd-character-companion-test')).toEqual(originalTest);
    expect(await databaseSnapshot(page,'dnd-character-companion')).toEqual(originalProduction);
    const caches=await preview.evaluate(()=>window.caches.keys());
    expect(caches.some(c=>c.startsWith('my-dnd-production-precache-'))).toBe(true);
    expect(caches.some(c=>c.startsWith('my-dnd-test-precache-'))).toBe(true);

    await context.setOffline(true);
    await page.reload();await preview.reload();
    await expect(page.getByRole('heading',{name:'Produksjons-Alva',exact:true})).toBeVisible();
    await expect(preview.getByRole('heading',{name:'Test-Alva',exact:true})).toBeVisible();
    await expect(preview.getByRole('button',{name:'Vis portrett',exact:true})).toBeVisible();
    await expect(preview.getByLabel('Testversjon',{exact:true})).toContainText('PR #56');
    // Existing unfinished character remains resumable after replacing the test build.
    await menuAction(preview,'Om appen');await expect(preview.getByRole('dialog')).toContainText('PR #56');
    await closeEditor(preview);
    await menuAction(preview,'Uferdig testkarakter Utkast · Fortsett');
    await expect(preview.getByRole('textbox',{name:'Navn',exact:true})).toHaveValue('Uferdig testkarakter');
    await closeEditor(preview);
    for(const width of [320,390]) {
      await preview.setViewportSize({width,height:844});
      expect(await preview.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    }
  }finally {
    await context.setOffline(false);await preview?.close();await page.close();
    server.closeAllConnections();await new Promise<void>((ok,no)=>server.close(error=>error?no(error):ok()));
    await rm(temp,{recursive:true,force:true});
  }
});
