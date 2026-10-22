import {describe,it,expect} from 'vitest';
import {mkdtemp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {assemblePages,appPaths} from '../scripts/assemble-pages.mjs';

const sha='a'.repeat(40),metadata={version:1,production:{sha},preview:{sha,pr:61}};
async function fixture() {
  const dir=await mkdtemp(join(tmpdir(),'my-dnd-layout-'));
  for(const [target,path] of Object.entries(appPaths)) {
    const dest=join(dir,path);await mkdir(dest,{recursive:true});
    const name=target==='preview'?'My D&D Test':'My D&D';
    await writeFile(join(dest,'index.html'),'<div id="app"></div>');
    await writeFile(join(dest,'environment-layout.json'),JSON.stringify({version:2,channel:target==='preview'?'test':'production',sha}));
    await writeFile(join(dest,'manifest.webmanifest'),JSON.stringify({id:'./',scope:'./',start_url:'./',name,short_name:name,icons:[{src:'icon-maskable-512.png',purpose:'maskable'}]}));
    for(const file of ['icon-maskable-512.png','apple-touch-icon.png']) await writeFile(join(dest,file),Buffer.from('89504e470d0a1a0a','hex'));
  }
  return dir;
}
describe('sibling PWA publication',()=>{
  it('keeps both builds at their own paths and replaces both old entry points with migration pages/workers',async()=>{
    const dir=await fixture();
    try{
      await assemblePages(dir,metadata);
      expect(JSON.parse(await readFile(join(dir,'deployment.json'),'utf8'))).toMatchObject({...metadata,layout:2,paths:appPaths});
      for(const path of Object.values(appPaths)) expect(await readFile(join(dir,path,'index.html'),'utf8')).toContain('id="app"');
      for(const [path,target] of [['','my-dnd/app/'],['test/','../my-dnd/test-app/']]) {
        const html=await readFile(join(dir,path,'index.html'),'utf8'),sw=await readFile(join(dir,path,'sw.js'),'utf8');
        expect(html).toContain(`href="${target}"`);expect(html).toContain('Lokale karakterdata er ikke slettet');expect(html).not.toContain('id="app"');
        expect(sw).toContain('self.registration.unregister()');expect(sw).toContain('name.endsWith(scope)');
        expect(sw).not.toContain('clients.claim');expect(sw).not.toContain('indexedDB.deleteDatabase');
      }
    }finally{await rm(dir,{recursive:true,force:true});}
  });
  it.each(['wrong-channel','wrong-commit','wrong-name','parent-scope','missing-icon'])('refuses inconsistent app artifacts: %s',async problem=>{
    const dir=await fixture(),path=join(dir,appPaths.preview);
    try{
      if(problem==='wrong-channel'||problem==='wrong-commit')await writeFile(join(path,'environment-layout.json'),JSON.stringify({version:2,channel:problem==='wrong-channel'?'production':'test',sha:problem==='wrong-commit'?'b'.repeat(40):sha}));
      else if(problem==='missing-icon')await rm(join(path,'apple-touch-icon.png'));
      else {
        const file=join(path,'manifest.webmanifest'),manifest=JSON.parse(await readFile(file,'utf8'));
        if(problem==='wrong-name')manifest.name='My D&D';else manifest.scope='../../';
        await writeFile(file,JSON.stringify(manifest));
      }
      await expect(assemblePages(dir,metadata)).rejects.toThrow();
      await expect(readFile(join(dir,'deployment.json'))).rejects.toThrow();
    }finally{await rm(dir,{recursive:true,force:true});}
  });
});
