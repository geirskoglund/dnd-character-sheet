import {wheelEntry} from './helpers';
import {test,expect,type Page} from '@playwright/test';
import {createCharacter,equipmentTab,menuAction,finish,fillField,choose,closeEditor,useEquipment,nextQuestion} from './helpers';
const d=(p:Page)=>p.getByRole('dialog');
const click=(p:Page,name:string)=>d(p).getByRole('button',{name,exact:true}).click();
async function variant(p:Page,name='Flammetunge'){
 await equipmentTab(p);await p.getByRole('button',{name:'Legg til weapons',exact:true}).click();await p.getByRole('searchbox').fill('Longsword');await click(p,'Tilpass Longsword');await fillField(p,'Navn på utstyr',name);await click(p,'Neste');await click(p,'+ Legg til virkning');await click(p,'Ekstraskade');
}
async function extra(p:Page,die='d6',count='1',type='Fire',condition=''){
 if(await d(p).getByRole('button',{name:'+ Legg til virkning',exact:true}).isVisible()){await click(p,'+ Legg til virkning');await click(p,'Ekstraskade');}await click(p,die);await fillField(p,'Antall terninger',count);await click(p,'Neste');await click(p,type);await click(p,condition?'Ja':'Nei');if(condition){await fillField(p,'Betingelse',condition);await click(p,'Neste');}
}
async function snapshot(p:Page){return p.evaluate(async()=>{const db=await new Promise<IDBDatabase>(resolve=>{const r=indexedDB.open('dnd-character-companion');r.onsuccess=()=>resolve(r.result);});try{const all=(store:string)=>new Promise<any[]>(resolve=>{const r=db.transaction(store).objectStore(store).getAll();r.onsuccess=()=>resolve(r.result);});const [characters,events,settings]=await Promise.all([all('characters'),all('events'),all('settings')]);return {characters,events,drafts:settings.filter(r=>r.id.startsWith('wizard-draft:')).map(r=>r.value)};}finally{db.close();}});}
async function closeWizard(p:Page){await click(p,'Lukk veiviseren');await expect(d(p)).not.toBeVisible();}
async function complete(p:Page){await click(p,'Lagre');if(await d(p).getByRole('button',{name:'Ikke i bruk',exact:true}).isVisible())await click(p,'Ikke i bruk');await expect(d(p)).not.toBeVisible();}

test.afterEach(async({page},info)=>{
 if(info.status===info.expectedStatus)return;
 console.log('::error title=Wizard diagnostic::'+JSON.stringify(info.annotations.filter(a=>a.type==='wizard-phase')));
 try{const state=await Promise.race([page.evaluate(()=>({question:document.querySelector('#wizard-question')?.textContent,error:document.querySelector('#dialog-error')?.textContent,busy:document.querySelector('dialog form')?.getAttribute('aria-busy'),buttons:[...document.querySelectorAll<HTMLButtonElement>('dialog button')].filter(b=>b.getClientRects().length).map(b=>({text:b.textContent,disabled:b.disabled}))})),new Promise(resolve=>setTimeout(()=>resolve('Diagnostic timed out'),1000))]);console.log('::error title=Wizard DOM::'+JSON.stringify(state));}catch{}
});

test('each weapon question has one decision, illustrated dice choices, explanations and graphical progress',async({page})=>{
 await createCharacter(page);await variant(page);await expect(page.locator('#wizard-question')).toHaveText('Hvilken terning gir ekstraskaden?');await expect(d(page).locator('select:visible,input:visible,textarea:visible')).toHaveCount(0);
 await expect(page.locator('#wizard-question')).toHaveText('Hvilken terning gir ekstraskaden?');for(const die of ['d4','d6','d8','d10','d12'])await expect(d(page).getByRole('button',{name:die,exact:true}).locator('.die-art')).toHaveCount(1);
 await expect(d(page).getByRole('progressbar')).toHaveAttribute('aria-valuenow',/\d+/);await expect(d(page)).not.toContainText(/Steg \d+ av/);await expect(d(page).locator('.wizard-art')).toBeVisible();
 await click(page,'d6');await expect(page.locator('#wizard-question')).toHaveText(/Hvor mange d(?:6|8|12)\?/);await fillField(page,'Antall terninger','2');await click(page,'Neste');await click(page,'Fire');await expect(page.locator('#wizard-help')).toContainText('akkurat denne virkningen');await expect(page.locator('#wizard-help')).not.toContainText('Constitution');await click(page,'Ja');await fillField(page,'Betingelse','Når sverdet brenner');await click(page,'Neste');
 await extra(page,'d4','1','Cold');await complete(page);const result=await snapshot(page);expect(result.characters[0].items[0].extraDamage).toMatchObject([{expression:'2d6',damageType:'Fire',condition:'Når sverdet brenner'},{expression:'1d4',damageType:'Cold'}]);expect(result.drafts).toEqual([]);
});
test('closing and offline reload retain answers and exact position; finish registers once and removes the draft',async({page,context})=>{
 await createCharacter(page);const before=await snapshot(page);await variant(page);await click(page,'d8');await fillField(page,'Antall terninger','3');const position=await d(page).getByRole('progressbar').getAttribute('aria-valuenow');await closeWizard(page);
 let state=await snapshot(page);expect(state.characters).toEqual(before.characters);expect(state.events).toEqual(before.events);expect(state.drafts).toHaveLength(1);await expect(page.getByRole('region',{name:'Utstyrsutkast'})).toContainText('Flammetunge');await expect(page.locator('[data-item]')).toHaveCount(0);
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>navigator.serviceWorker.controller!==null);await context.setOffline(true);await page.reload();await equipmentTab(page);await page.getByRole('region',{name:'Utstyrsutkast'}).getByRole('button').click();await expect(page.locator('#wizard-question')).toHaveText(/Hvor mange d(?:6|8|12)\?/);await expect(page.getByRole('spinbutton',{name:'Antall terninger',exact:true})).toHaveValue('3');await expect(d(page).getByRole('progressbar')).toHaveAttribute('aria-valuenow',position!);
 await click(page,'Neste');await click(page,'Fire');await click(page,'Nei');await complete(page);state=await snapshot(page);expect(state.characters[0].items).toHaveLength(1);expect(state.characters[0].items[0].extraDamage[0].expression).toBe('3d8');expect(state.drafts).toEqual([]);expect(state.events).toHaveLength(before.events.length+1);await menuAction(page,'Angre siste endring');expect((await snapshot(page)).characters[0].items).toEqual([]);
});
test('an unfinished edit never changes equipped weapon or Combat and can be discarded explicitly',async({page})=>{
 await createCharacter(page);await equipmentTab(page);await page.getByRole('button',{name:'Legg til weapons',exact:true}).click();await click(page,'Legg til Longsword');await useEquipment(page,'Longsword');const before=await snapshot(page);await page.getByRole('button',{name:'Longsword · i bruk',exact:true}).click();await click(page,'Rediger gjenstanden');await fillField(page,'Navn på utstyr','Uferdig sverd');await page.keyboard.press('Escape');await expect(d(page)).not.toBeVisible();
 expect((await snapshot(page)).characters).toEqual(before.characters);await page.getByRole('button',{name:'Combat',exact:true}).click();await expect(page.getByRole('button',{name:/^Longsword/})).toBeVisible();await expect(page.getByRole('main')).not.toContainText('Uferdig sverd');await equipmentTab(page);await page.getByRole('region',{name:'Utstyrsutkast'}).getByRole('button').click();await click(page,'Forkast utkast');await click(page,'Avbryt');await expect(page.getByRole('textbox',{name:'Navn på utstyr',exact:true})).toHaveValue('Uferdig sverd');await expect(d(page)).toHaveAttribute('data-wizard','true');await click(page,'Forkast utkast');await click(page,'Forkast utkast');await expect(d(page)).not.toBeVisible();expect((await snapshot(page)).characters).toEqual(before.characters);expect((await snapshot(page)).drafts).toEqual([]);
 await page.getByRole('button',{name:'Longsword · i bruk',exact:true}).click();await click(page,'Rediger gjenstanden');await finish(page);await expect(d(page)).not.toBeVisible();const unchanged=await snapshot(page);expect(unchanged.characters).toEqual(before.characters);expect(unchanged.events).toEqual(before.events);expect(unchanged.drafts).toEqual([]);
});
test('failed draft autosave is prominent, X stays open, and retry preserves the typed answer',async({page},info)=>{
 const phase=(name:string)=>info.annotations.push({type:'wizard-phase',description:name});
 phase('create character');await createCharacter(page);
 phase('start variant');await variant(page);
 phase('inject quota failure');await page.evaluate(()=>{const original=IDBObjectStore.prototype.put;(window as any).failDraft=true;IDBObjectStore.prototype.put=function(...args){if(this.name==='settings'&&(args[0] as any)?.id?.startsWith('wizard-draft:')&&(window as any).failDraft)throw new DOMException('Full lagring','QuotaExceededError');return original.apply(this,args);};});
 phase('extra damage choice');
 phase('custom expression choice');await click(page,'Annet');
 phase('type expression');await page.getByRole('textbox',{name:'Skadeuttrykk',exact:true}).fill('1d6+2');
 phase('expect autosave error');await expect(d(page).getByRole('alert')).toContainText('Utkastet kunne ikke lagres');
 phase('close with failed storage');await click(page,'Lukk veiviseren');
 phase('expect failed close settled');await expect(d(page).getByRole('alert')).toHaveText('Full lagring');await expect(d(page).locator('form')).not.toHaveAttribute('aria-busy','true');
 phase('expect retained editor');await expect(d(page)).toBeVisible();await expect(page.getByRole('textbox',{name:'Skadeuttrykk',exact:true})).toHaveValue('1d6+2');
 phase('recover storage');await page.evaluate(()=>(window as any).failDraft=false);
 phase('close with recovered storage');await closeWizard(page);
 phase('resume draft');await page.getByRole('region',{name:'Utstyrsutkast'}).getByRole('button').click();
 phase('expect restored expression');await expect(page.getByRole('textbox',{name:'Skadeuttrykk',exact:true})).toHaveValue('1d6+2');
});
test('failed final save retains both draft and original character, then retries without duplication',async({page})=>{
 await createCharacter(page);await variant(page);await extra(page);await page.evaluate(()=>{const original=IDBObjectStore.prototype.put;(window as any).failItem=true;IDBObjectStore.prototype.put=function(...args){if(this.name==='characters'&&(window as any).failItem)throw new DOMException('Full lagring','QuotaExceededError');return original.apply(this,args);};});
 await finish(page);await expect(d(page).getByRole('alert')).toContainText('Full lagring');expect((await snapshot(page)).characters[0].items).toEqual([]);expect((await snapshot(page)).drafts).toHaveLength(1);await page.evaluate(()=>(window as any).failItem=false);await finish(page);await expect(d(page)).not.toBeVisible();expect((await snapshot(page)).characters[0].items).toHaveLength(1);expect((await snapshot(page)).drafts).toEqual([]);
});
test('two independent money wheels share the selected row and preserve exact copper across input, save and undo',async({page})=>{
 await createCharacter(page);await page.locator('[data-action="money"]').click();const whole=page.getByRole('spinbutton',{name:'Tallhjul: Hele GP',exact:true}),fraction=page.getByRole('spinbutton',{name:'Tallhjul: Hundredeler',exact:true});await expect(whole).toBeVisible();await expect(fraction).toBeVisible();const boxes=await Promise.all([whole.boundingBox(),fraction.boundingBox()]);expect(boxes[0]!.y).toBe(boxes[1]!.y);await whole.focus();await page.keyboard.press('PageUp');await expect(whole).toHaveAttribute('aria-valuenow','10');await fraction.focus();await page.keyboard.press('End');await expect(fraction).toHaveAttribute('aria-valuenow','99');await page.keyboard.press('ArrowUp');await expect(fraction).toHaveAttribute('aria-valuenow','99');await expect(whole).toHaveAttribute('aria-valuenow','10');await fillField(page,'GP','55.25');await expect(whole).toHaveAttribute('aria-valuenow','55');await expect(fraction).toHaveAttribute('aria-valuenow','25');await finish(page);await expect(d(page)).not.toBeVisible();expect((await snapshot(page)).characters[0].goldCp).toBe(5525);await menuAction(page,'Angre siste endring');expect((await snapshot(page)).characters[0].goldCp).toBe(0);
});
test('only the two editable Combat health values have corner marks, matching their frame',async({page})=>{
 await createCharacter(page);await page.getByRole('button',{name:'Combat',exact:true}).click();const styles=await page.locator('.combat-health > *').evaluateAll(els=>els.map(el=>({corner:getComputedStyle(el,'::after').content,fill:getComputedStyle(el,'::after').backgroundColor,line:getComputedStyle(el).borderColor})));expect(styles.map(s=>s.corner!=='none')).toEqual([true,true,false,false]);expect(styles[0].fill).toBe(styles[0].line);await page.locator('[data-action="hp"]').click();await expect(d(page)).toContainText('Endre HP');await closeEditor(page);await page.getByRole('button',{name:'Character',exact:true}).click();expect(await page.locator('.stats > :first-child').evaluate(el=>getComputedStyle(el,'::after').content)).toBe('none');
});
test('partial character creation is kept in the menu and resumes its custom class after reload',async({page})=>{
 await page.goto('./');await menuAction(page,'Ny karakter');await fillField(page,'Navn','Mira');await choose(page,'Art / species',{label:'Elf'});await choose(page,'Klasse','custom');await fillField(page,'Egen klasse','Min klasse');await closeWizard(page);await expect(page.getByRole('heading',{name:'Ditt neste eventyr'})).toBeVisible();await page.reload();await menuAction(page,'Mira Utkast · Fortsett');await expect(page.locator('#wizard-question')).toHaveText('Hva heter klassen?');await expect(page.getByRole('textbox',{name:'Egen klasse',exact:true})).toHaveValue('Min klasse');await fillField(page,'Maks HP fra karakterarket','12');await finish(page);await expect(d(page)).not.toBeVisible();await expect(page.locator('header')).toContainText('Min klasse 1');expect((await snapshot(page)).drafts).toEqual([]);
});

test('two tabs cannot overwrite or resurrect the same draft',async({page,context})=>{
 await createCharacter(page);await variant(page);await closeWizard(page);
 const other=await context.newPage();await other.goto('./');await equipmentTab(other);await other.getByRole('region',{name:'Utstyrsutkast'}).getByRole('button').click();
 await page.getByRole('region',{name:'Utstyrsutkast'}).getByRole('button').click();
 await click(page,'d6');await fillField(page,'Antall terninger','2');
 await expect.poll(async()=>(await snapshot(page)).drafts[0].payload.work.pending?.count).toBe(2);
 await closeWizard(page);
 await click(other,'d6');await expect(d(other).getByRole('alert')).toContainText('annen fane');
 await click(other,'Lukk veiviseren');await expect(d(other)).toBeVisible();
 const saved=(await snapshot(page)).drafts[0];expect(saved.payload.work.question).toBe('count');
 await page.bringToFront();await page.getByRole('region',{name:'Utstyrsutkast'}).getByRole('button').click();await click(page,'Neste');await click(page,'Fire');await click(page,'Nei');await complete(page);
 await click(other,'Lukk veiviseren');await expect(d(other).getByRole('alert')).toContainText('annen fane');expect((await snapshot(page)).drafts).toEqual([]);expect((await snapshot(page)).characters[0].items).toHaveLength(1);
 await other.close({runBeforeUnload:false});
});

test('backup carries an unfinished weapon and restores the exact question without registering it',async({page,browser})=>{
 await createCharacter(page);await variant(page);await click(page,'d12');await fillField(page,'Antall terninger','4');await closeWizard(page);
 const download=page.waitForEvent('download');await menuAction(page,'Eksporter backup');const file=await(await download).path();
 const other=await browser.newContext({viewport:{width:390,height:844}}),target=await other.newPage();await target.goto('./');await menuAction(target,'Importer backup');await target.getByLabel('JSON-fil').setInputFiles(file!);await click(target,'Importer');await expect(d(target)).not.toBeVisible();
 await equipmentTab(target);await target.getByRole('region',{name:'Utstyrsutkast'}).getByRole('button').click();await expect(target.locator('#wizard-question')).toHaveText(/Hvor mange d(?:6|8|12)\?/);await expect(target.getByRole('spinbutton',{name:'Antall terninger',exact:true})).toHaveValue('4');expect((await snapshot(target)).characters[0].items).toEqual([]);
 await click(target,'Neste');await click(target,'Cold');await click(target,'Nei');await complete(target);expect((await snapshot(target)).characters[0].items[0].extraDamage[0].expression).toBe('4d12');await other.close();
});

test('a changed weapon is preserved when an older editing draft is resumed',async({page,context})=>{
 await createCharacter(page);await equipmentTab(page);await page.getByRole('button',{name:'Legg til weapons',exact:true}).click();await click(page,'Legg til Longsword');await page.getByRole('button',{name:'Longsword · eid',exact:true}).click();await click(page,'Rediger gjenstanden');await fillField(page,'Navn på utstyr','Utdatert');await closeWizard(page);
 const other=await context.newPage();await other.goto('./');await useEquipment(other,'Longsword');await other.close();await page.reload();await equipmentTab(page);await page.getByRole('region',{name:'Utstyrsutkast'}).getByRole('button').click();await finish(page);
 await expect(d(page).getByRole('alert')).toContainText('endret eller fjernet');expect((await snapshot(page)).characters[0].items[0]).toMatchObject({name:'Longsword',equipped:true});await click(page,'Forkast utkast');await click(page,'Forkast utkast');expect((await snapshot(page)).drafts).toEqual([]);
});

test('money wheels respond to touch at zero and invalid exact amounts explain the limit',async({page,context})=>{
 await createCharacter(page);await page.locator('[data-action="money"]').click();
 const whole=page.getByRole('spinbutton',{name:'Tallhjul: Hele GP',exact:true}),fraction=page.getByRole('spinbutton',{name:'Tallhjul: Hundredeler',exact:true}),client=await context.newCDPSession(page);
 await fraction.scrollIntoViewIfNeeded();const box=(await fraction.boundingBox())!,x=box.x+box.width/2,y=box.y+box.height/2;
 await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y:y-35}]});for(let i=1;i<=5;i++)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-35+i*8}]});await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await expect.poll(async()=>Number(await fraction.getAttribute('aria-valuenow'))).toBeGreaterThan(0);await expect(whole).toHaveAttribute('aria-valuenow','0');
 await wheelEntry(page,'Hundredeler','1.001');await expect(page.locator('.number-change-error')).toContainText('heltall');await page.getByRole('textbox',{name:'Hundredeler',exact:true}).fill('25');await d(page).getByRole('heading').click();await fillField(page,'GP','55.25');await finish(page);await expect(d(page)).not.toBeVisible();await page.reload();expect((await snapshot(page)).characters[0].goldCp).toBe(5525);
});

test('a draft of a projected legacy Hit Dice pool survives reload before its first character save',async({page})=>{
 await createCharacter(page);
 // Legacy fixture: the saved aggregate predates automatic resource setup.
 await page.evaluate(async()=>{const db=await new Promise<IDBDatabase>(resolve=>{const r=indexedDB.open('dnd-character-companion');r.onsuccess=()=>resolve(r.result);});await new Promise<void>(resolve=>{const tx=db.transaction('characters','readwrite'),store=tx.objectStore('characters'),r=store.getAll();r.onsuccess=()=>store.put({...r.result[0],resources:[]});tx.oncomplete=()=>resolve();});db.close();});
 await page.reload();await page.getByRole('button',{name:'Hvile',exact:true}).click();await click(page,'Fighter · d10 1 / 1');await click(page,'Tilpass');await fillField(page,'Maks','3');await closeWizard(page);expect((await snapshot(page)).characters[0].resources).toEqual([]);
 await page.reload();await page.locator('details.app-menu > summary').click();await page.locator('details.app-menu [data-draft]').click();await expect(page.getByRole('spinbutton',{name:'Maks',exact:true})).toHaveValue('3');await fillField(page,'Tilgjengelig','2');await finish(page);await expect(d(page)).not.toBeVisible();expect((await snapshot(page)).characters[0].resources).toEqual([expect.objectContaining({kind:'hitDie',max:3,current:2,manualMaximum:true})]);expect((await snapshot(page)).drafts).toEqual([]);
});
