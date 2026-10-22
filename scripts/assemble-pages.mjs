import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {retireLegacyApps} from '../src/pwa/legacy-cleanup.js';

export const appPaths = {production:'my-dnd/app/', preview:'my-dnd/test-app/'};

export function transitionPage(target, relativeRoot) {
  const test = target.includes('test-app');
  const name = test ? 'My D&amp;D Test' : 'My D&amp;D';
  return `<!doctype html><html lang="nb"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${name} har flyttet</title>
<meta name="robots" content="noindex"><style>body{margin:0;padding:24px;background:#f4ecd8;color:#302920;font:18px/1.6 system-ui}main{max-width:36em;margin:6vh auto}h1{font:36px Georgia,serif}a,button{display:inline-block;padding:12px 20px;border-radius:8px;font:inherit}a{background:#8b2c34;color:#fff}button{background:transparent;border:1px solid #8d795e;color:inherit}p{overflow-wrap:anywhere}</style>
<main><h1>${name} har flyttet</h1><p>Bruk den nye adressen og installer appen derfra.</p><p><a id="open-app" href="${target}">Åpne ${name}</a></p><p>Lokale karakterdata er ikke slettet. App og testapp har fortsatt hver sine data. En ny telefoninstallasjon kan ha et eget lagringsområde.</p><p id="migration-status" role="status"></p></main>
<script type="module">const ready=(${retireLegacyApps.toString()})(new URL('${relativeRoot}',location.href)).catch(()=>{document.querySelector('#migration-status').textContent='Kunne ikke avslutte det gamle offline-oppsettet. Lukk gamle appvinduer og åpne denne adressen igjen mens du er på nett.'});document.querySelector('#open-app').addEventListener('click',async event=>{event.preventDefault();await ready;location.assign(event.currentTarget?.href||document.querySelector('#open-app').href)});</script></html>`;
}

export function retirementWorker(page) {
  return `// Retirement worker for this legacy scope only. No database deletion or forced navigation.
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const scope=self.registration.scope;
  for(const name of await caches.keys()) {
    if(/^(?:my-dnd-production|my-dnd-test|workbox)-precache-/.test(name)&&name.endsWith(scope)) await caches.delete(name);
  }
  await self.registration.unregister();
})()));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url),scope=new URL(self.registration.scope);
  if(event.request.mode==='navigate'&&(url.pathname===scope.pathname||url.pathname===scope.pathname+'index.html')) {
    event.respondWith(Promise.resolve(new Response(${JSON.stringify(page)},{headers:{'Content-Type':'text/html; charset=utf-8'}})));
  }
});`;
}

/** Both app builds already exist at their final paths. Never execute their JS here. */
export async function assemblePages(directory, metadata) {
  for (const [target,path] of Object.entries(appPaths)) {
    const dir=join(directory,path), name=target==='preview'?'My D&D Test':'My D&D';
    const layout=JSON.parse(await readFile(join(dir,'environment-layout.json'),'utf8'));
    const manifest=JSON.parse(await readFile(join(dir,'manifest.webmanifest'),'utf8'));
    if(layout.version!==2 || layout.channel!==(target==='preview'?'test':'production') || layout.sha!==metadata[target]?.sha || manifest.name!==name ||
      manifest.short_name!==name || manifest.id!=='./' || manifest.scope!=='./' || manifest.start_url!=='./' ||
      !manifest.icons.some(icon=>icon.purpose==='maskable')) {
      throw new Error('Bygget mangler nye PWA-miljøer. Velg en validert PR med oppdatert master, eller preview=master.');
    }
    for (const icon of [...manifest.icons.map(icon=>icon.src),'apple-touch-icon.png']) {
      if(!/^[a-z0-9-]+\.png$/.test(icon)) throw new Error('Ugyldig ikonsti.');
      const png=await readFile(join(dir,icon));
      if(png.subarray(0,8).toString('hex')!=='89504e470d0a1a0a') throw new Error('Mangler gyldig PNG-ikon.');
    }
  }
  const entries=[['',appPaths.production,'./'],['test/','../'+appPaths.preview,'../']];
  for(const [path,target,root] of entries) {
    const dir=join(directory,path);await mkdir(dir,{recursive:true});
    const html=transitionPage(target,root);
    await writeFile(join(dir,'index.html'),html);
    await writeFile(join(dir,'sw.js'),retirementWorker(html));
  }
  await writeFile(join(directory,'deployment.json'),JSON.stringify({...metadata,layout:2,paths:appPaths},null,2));
}

if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  await assemblePages(resolve(process.argv[2]||'site'),JSON.parse(process.env.DEPLOYMENT_METADATA));
}
