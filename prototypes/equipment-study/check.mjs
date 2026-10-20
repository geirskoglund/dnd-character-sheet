// Run from the repository: node prototypes/equipment-study/check.mjs
// Uses the existing Playwright installation. HTML itself has no dependencies.
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';
const html=await readFile(new URL('./utstyrsverksted.html',import.meta.url),'utf8');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const errors=[],requests=[];
let count=0;
const imageDir=fileURLToPath(new URL('./screenshots/',import.meta.url));
await mkdir(imageDir,{recursive:true});
const button=(p,name)=>p.getByRole('button',{name,exact:typeof name==='string'});
const click=(p,name)=>button(p,name).click();
const dialog=p=>p.getByRole('dialog');
const next=p=>click(p,'Neste →');
const enter=async(p,label,value)=>{await p.getByLabel(label,{exact:true}).fill(String(value));await next(p);};
const addEffect=async(p,name)=>{await click(p,'+ Legg til virkning');await click(p,name);};
const keep=p=>expect(p.getByRole('heading',{name:'Hva gjør gjenstanden?',exact:true})).toBeVisible();
const finish=p=>click(p,'Legg til gjenstanden');
async function pageAt(width=1280,height=960){const c=await browser.newContext({viewport:{width,height}});await c.route('http://equipment-study.test/',r=>r.fulfill({body:html,contentType:'text/html'}));const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>requests.push(r.url()));await p.goto('http://equipment-study.test/');return p;}
const data=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('dnd-equipment-study-v1')));
async function check(name,fn){await fn();count++;console.log('PASS '+name);}
try{
const p=await pageAt();await p.screenshot({path:imageDir+'start-desktop.png'});
await check('Weapon: inherited base, conditional extra damage, quick use, reload',async()=>{
await click(p,/Et våpen med noe ekstra/);await enter(p,'Navn','Steam Hammer');await addEffect(p,'Ekstraskade');await click(p,'d4');await next(p);await click(p,'Fire');await click(p,'Ja');await enter(p,'Betingelse','Når hammeren damper');await keep(p);await finish(p);
await expect(dialog(p)).toContainText('+1d4 fire');await expect(dialog(p)).toContainText('Når hammeren damper');await expect(dialog(p)).toContainText('Warhammer');await expect(p.getByLabel('I bruk',{exact:true})).toBeVisible();
await p.getByLabel('I bruk',{exact:true}).check();await click(p,'To hender · 1d10');
await p.screenshot({path:imageDir+'weapon-desktop.png'});
await click(p,'Lukk');await p.reload();const saved=await data(p);assert.equal(saved.items[0].baseId,'warhammer');assert.equal(saved.items[0].grip,'two');assert.equal(saved.items[0].effects[0].condition,'Når hammeren damper');assert.equal(saved.items[0].equipped,true);
});
await check('Amulet: set Constitution, condition immunity, attunement on same item',async()=>{
await click(p,/En magisk amulett/);await enter(p,'Navn','Gravkammerets amulett');await addEffect(p,'Constitution');await click(p,'Sett til en verdi');await enter(p,'Verdi',19);await click(p,'Nei');await keep(p);await addEffect(p,'Immunity');await click(p,'En tilstand');await click(p,'Frightened');await click(p,'Nei');await keep(p);await click(p,'Merknad, antall og attunement');await click(p,'Krever attunement');await click(p,'Ja');await click(p,'Ferdig');await click(p,'Legg til gjenstanden');
await expect(dialog(p)).toContainText('Constitution · Settes til 19');await expect(dialog(p)).toContainText('Immunity · Frightened');await p.getByLabel('Attuned',{exact:true}).check();const saved=await data(p);assert.equal(saved.items[1].effects.length,2);assert.equal(saved.items[1].attuned,true);await click(p,'Lukk');
});
await check('Free-text ability: no spell link, max=available, bounded use, edit preserves spent uses',async()=>{
await click(p,/En evne med tre bruk/);await next(p);await expect(p.getByLabel('Navn',{exact:true})).toBeVisible();await enter(p,'Navn','Tåkeringen');await addEffect(p,'Egen evne');await enter(p,'Evne eller effekt','Kan bli usynlig i ett minutt');await click(p,'Ja');await enter(p,'Maks antall bruk',3);await click(p,'Long rest');await keep(p);await finish(p);
await expect(p.getByRole('status',{name:'Tilgjengelige bruk'})).toHaveText('3 / 3');
for(let i=0;i<3;i++)await click(p,'Bruk én: Kan bli usynlig i ett minutt');await expect(button(p,'Bruk én: Kan bli usynlig i ett minutt')).toBeDisabled();await click(p,'Gi tilbake én: Kan bli usynlig i ett minutt');await expect(p.getByRole('status',{name:'Tilgjengelige bruk'})).toHaveText('1 / 3');
await click(p,'Rediger gjenstanden');await next(p);await click(p,/Kan bli usynlig i ett minutt/);await next(p);await click(p,'Ja');await enter(p,'Maks antall bruk',5);await click(p,'Long rest');await keep(p);await click(p,'Fullfør endring');await expect(p.getByRole('status',{name:'Tilgjengelige bruk'})).toHaveText('3 / 5');await click(p,'Lukk');
});
await check('Draft: close/reload/resume answers and question; saved item unchanged until finish',async()=>{
await click(p,/Et våpen med noe ekstra/);await enter(p,'Navn','Uferdig sverd');await addEffect(p,'Ekstraskade');await click(p,'d6');await p.getByLabel('Antall terninger',{exact:true}).fill('2');await click(p,'Lukk');await p.reload();await click(p,'Fortsett');await expect(p.getByLabel('Antall terninger',{exact:true})).toHaveValue('2');await next(p);await click(p,'Cold');await click(p,'Nei');await keep(p);await finish(p);await click(p,'Rediger gjenstanden');await p.getByLabel('Navn',{exact:true}).fill('Skal ikke endres ennå');await click(p,'Lukk');assert.ok((await data(p)).items.some(i=>i.name==='Uferdig sverd'));assert.ok(!(await data(p)).items.some(i=>i.name==='Skal ikke endres ennå'));await click(p,'Fortsett');await expect(p.getByLabel('Navn',{exact:true})).toHaveValue('Skal ikke endres ennå');await click(p,'Lukk');p.once('dialog',d=>d.accept());await click(p,'Forkast utkast');
});
await check('Catalog: context, direct add, create-own last, label-free search, armor inheritance',async()=>{
await click(p,'Legg til armor og skjold');await expect(p.getByPlaceholder('Søk',{exact:true})).toBeVisible();await p.getByPlaceholder('Søk',{exact:true}).fill('Chain');await expect(button(p,/Chain Mail AC 16/)).toBeVisible();await expect(button(p,/Dagger/)).toHaveCount(0);await click(p,/Chain Mail AC 16/);await expect(dialog(p)).not.toBeVisible();assert.equal((await data(p)).items.at(-1).baseId,'chainmail');await click(p,'Legg til annet utstyr');const order=await p.locator('.dialog-body button').allTextContents();assert.match(order.at(-1),/Opprett eget/);await click(p,'Lukk');
});
await check('Details: expand marker, no triangle on close/choices, removal confirmation and undo',async()=>{
await p.locator('.item-card').filter({hasText:'Gravkammerets amulett'}).click();await expect(p.locator('summary')).toHaveText('Grunnlag fra Amulett');await p.locator('summary').click();await expect(dialog(p)).toContainText('Dette er vanlig utstyr.');const marker=await p.locator('summary').evaluate(e=>getComputedStyle(e,'::after').clipPath);assert.match(marker,/polygon/);const closeMarker=await button(p,'Lukk').evaluate(e=>getComputedStyle(e,'::after').content);assert.equal(closeMarker,'none');p.once('dialog',d=>d.dismiss());await click(p,'Fjern fra utstyrslisten');await expect(dialog(p)).toBeVisible();p.once('dialog',d=>d.accept());await click(p,'Fjern fra utstyrslisten');await expect(dialog(p)).not.toBeVisible();await click(p,'Angre fjerning');assert.ok((await data(p)).items.some(i=>i.name==='Gravkammerets amulett'));
});
await check('Back preserves answers, no condition branch and negative modifiers',async()=>{
await click(p,/En magisk amulett/);await next(p);await addEffect(p,'Speed');await click(p,'Øk eller reduser med');await p.getByLabel('Verdi',{exact:true}).fill('-5');await click(p,'← Tilbake');await click(p,'← Tilbake');await click(p,'Speed');await click(p,'Øk eller reduser med');await expect(p.getByLabel('Verdi',{exact:true})).toHaveValue('-5');await next(p);await click(p,'Ja');await p.getByLabel('Betingelse',{exact:true}).fill('Når det regner');await click(p,'← Tilbake');await click(p,'Ja');await expect(p.getByLabel('Betingelse',{exact:true})).toHaveValue('Når det regner');await click(p,'← Tilbake');await click(p,'Nei');await keep(p);assert.equal((await data(p)).draft.item.effects[0].amount,-5);assert.ok(!(await data(p)).draft.item.effects[0].condition);await click(p,'Lukk');p.once('dialog',d=>d.accept());await click(p,'Forkast utkast');
});
await check('Mobile/large text: real clicks through matrix and free ability, no horizontal overflow',async()=>{
for(const width of [320,390,768,1280])for(const scale of [1,2]){
const m=await pageAt(width,900);const layout=async()=>{const r=await m.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,body:[...document.querySelectorAll('.dialog-body,.dialog-head,.dialog-foot')].filter(e=>e.getBoundingClientRect().width>0).map(e=>({class:e.className,scroll:e.scrollWidth,width:e.clientWidth}))}));assert.ok(r.scroll<=width+1,JSON.stringify({scale,r}));for(const e of r.body)assert.ok(e.scroll<=e.width+1,JSON.stringify({scale,e}));};await m.evaluate(s=>document.documentElement.style.fontSize=`${s*16}px`,scale);await click(m,/En evne med tre bruk/);await layout();await enter(m,'Navn','Langt navn på en hjemmelaget magisk gjenstand');await layout();await click(m,'+ Legg til virkning');await layout();if(width===1280&&scale===1)await m.screenshot({path:imageDir+'matrix-desktop.png'});await click(m,'Egen evne');await layout();await enter(m,'Evne eller effekt','En beskrivelse som er lengre enn en vanlig overskrift og brytes over flere linjer.');await layout();await click(m,'Nei');await keep(m);await layout();await finish(m);await layout();
const overflow=await m.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,bad:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>({tag:e.tagName,cls:e.className,txt:e.textContent.slice(0,50),right:e.getBoundingClientRect().right}))}));assert.ok(overflow.scroll<=width+1,JSON.stringify({width,scale,overflow}));assert.ok(await m.locator('.dialog-body').evaluate(e=>e.scrollWidth<=e.clientWidth+1));const head=await m.locator('.dialog-head').boundingBox();assert.ok(head.y>=0);const bounds=await button(m,'Lukk').boundingBox();assert.ok(bounds.x+bounds.width<=width);
if(width===390&&scale===1)await m.screenshot({path:imageDir+'ability-mobile.png'});
await m.context().close();}
});
await check('Storage failure: conspicuous warning, in-memory work retained',async()=>{
const f=await pageAt();await f.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('Quota exceeded','QuotaExceededError');};});await click(f,/En magisk amulett/);await f.getByLabel('Navn',{exact:true}).fill('Behold dette');await expect(dialog(f).getByRole('alert')).toContainText('kunne ikke lagres');await next(f);await click(f,'Lukk');await expect(f.getByRole('alert').first()).toContainText('Svarene er fortsatt her');await click(f,'Fortsett');await click(f,'← Tilbake');await expect(f.getByLabel('Navn',{exact:true})).toHaveValue('Behold dette');await f.context().close();
});
await check('Corrupt stored sample data is not silently overwritten',async()=>{
const f=await pageAt();await f.evaluate(()=>localStorage.setItem('dnd-equipment-study-v1','not valid JSON'));await f.reload();await expect(f.getByRole('alert').first()).toContainText('ikke overskrevet');await click(f,/En magisk amulett/);await f.getByLabel('Navn',{exact:true}).fill('Test');assert.equal(await f.evaluate(()=>localStorage.getItem('dnd-equipment-study-v1')),'not valid JSON');await f.context().close();
});
await check('Offline document: no external requests, script errors or production dependencies',async()=>{assert.deepEqual(errors,[]);assert.ok(requests.every(r=>r==='http://equipment-study.test/'));assert.ok(!/<script[^>]+src=|<link[^>]+href=|fetch\(|navigator\.serviceWorker/.test(html));await p.context().setOffline(true);await click(p,/En magisk amulett/);await enter(p,'Navn','Offlineamulett');await addEffect(p,'Resistance');await click(p,'Fire');await click(p,'Nei');await keep(p);await finish(p);await expect(dialog(p)).toContainText('Resistance · Fire');});
await p.context().close();
console.log(`\n${count} scenario groups passed. Layout: 320/390/768/1280px × 100/200% text. No external requests.`);
}finally{await browser.close();}
