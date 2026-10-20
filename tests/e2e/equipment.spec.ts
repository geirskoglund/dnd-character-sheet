import {fillField,choose,revealField,nextQuestion,addItemBonus,equipmentOverview} from './helpers';
import {characterStep,finish,useEquipment} from './helpers';
import {test,expect,type Page} from '@playwright/test';
import {createCharacter,menuAction,equipmentTab,itemDetails,expectCharacterStatus} from './helpers';
const dialog=(p:Page)=>p.getByRole('dialog');
async function save(p:Page) {await finish(p);await expect(dialog(p)).not.toBeVisible();}
async function setup(p:Page) {
 await createCharacter(p);await menuAction(p,'Rediger karakter');
 await characterStep(p,2);
 await fillField(p,'STR','16');await fillField(p,'DEX','16');await save(p);await equipmentTab(p);
}
async function add(p:Page,name:string,group='weapons') {
 await p.getByRole('button',{name:`Legg til ${group}`,exact:true}).click();
 await p.getByRole('searchbox',{name:'Søk i utstyr',exact:true}).fill(name);
 await p.getByRole('button',{name:`Legg til ${name}`,exact:true}).click();await expect(dialog(p)).not.toBeVisible();await useEquipment(p,name);
}
async function count(p:Page) {return p.evaluate(async()=>{
 const db=await new Promise<IDBDatabase>(resolve=>{const r=indexedDB.open('dnd-character-companion');r.onsuccess=()=>resolve(r.result);});
 try{return await new Promise<number>(resolve=>{const r=db.transaction('events').objectStore('events').count();r.onsuccess=()=>resolve(r.result);});}finally{db.close();}
});}
test('four tabs: direct catalog selection, useful weapon values, grip and Combat lookup without editing',async({page})=>{
 await setup(page);
 await expect(page.getByRole('navigation').getByRole('button')).toHaveCount(4);
 await add(page,'Longsword');await expect(page.locator('[data-item]')).toContainText('d20+5 · 1d8+3 slashing');
 const before=await count(page);await page.getByRole('button',{name:'Longsword · i bruk',exact:true}).click();
 await expect(dialog(page)).toContainText('Angrep: d20+5');await expect(dialog(page)).toContainText('Skade: 1d8+3 slashing');
 expect(await dialog(page).locator('input:visible,select:visible,textarea:visible').count()).toBe(0); // lookup has immediate hand controls
 await dialog(page).getByRole('button',{name:'Begge hender',exact:true}).click();await expect(dialog(page)).toContainText('1d10+3 slashing');await save(page);
 expect(await count(page)).toBe(before+1);
 await page.getByRole('button',{name:'Combat',exact:true}).click();await page.getByRole('button',{name:/^Longsword/}).click();
 await expect(dialog(page)).toContainText('1d10+3 slashing');await expect(dialog(page).getByRole('button')).toHaveCount(1);await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Character',exact:true}).click();await expect(page.locator('[data-item], [data-equipment-group]')).toHaveCount(0);
 await equipmentTab(page);await add(page,'Shield','armor og skjold');await expect(page.getByRole('main')).toContainText('Tohåndsvåpen og skjold');
 await page.getByRole('button',{name:'Longsword · i bruk',exact:true}).click();await dialog(page).getByRole('button',{name:'Ikke i bruk',exact:true}).click();await save(page);
 await page.getByRole('button',{name:'Combat',exact:true}).click();await expect(page.locator('[data-lookup^="weapon:"]')).toHaveCount(0);
});
test('armor + shield + attuned cloak: AC19, save bonus, switching and overrides remain understandable',async({page})=>{
 await setup(page);await add(page,'Chain Mail','armor og skjold');await add(page,'Shield','armor og skjold');await add(page,'Cloak of Protection','annet utstyr');
 await expectCharacterStatus(page,'AC18');await page.getByRole('button',{name:'Cloak of Protection · i bruk',exact:true}).click();
 await expect(page.getByRole('checkbox',{name:'Attuned',exact:true})).toBeVisible();await expect(dialog(page).getByRole('checkbox',{name:'Attuned',exact:true})).not.toBeChecked();
 await page.getByRole('checkbox',{name:'Attuned',exact:true}).check();await expect(dialog(page).locator('form')).not.toHaveAttribute('aria-busy','true');await save(page);
 await expectCharacterStatus(page,'AC19');await page.getByText('AC-grunnlag',{exact:true}).click();await expect(page.getByRole('main')).toContainText('Chain Mail: 16');await expect(page.getByRole('main')).toContainText('Shield 2 + Cloak of Protection 1 = 19');
 await page.getByRole('button',{name:'Character',exact:true}).click();await page.locator('[data-modifier="0"]').click();await expect(page.getByRole('button',{name:'Dexterity save +4',exact:true})).toBeVisible();await page.keyboard.press('Escape');
 await equipmentTab(page);await page.getByRole('button',{name:'Shield · i bruk',exact:true}).click();await itemDetails(page);await addItemBonus(page,'AC','1');await save(page);await expectCharacterStatus(page,'AC20');
 await menuAction(page,'Angre siste endring');await expectCharacterStatus(page,'AC19');
 await page.reload();await equipmentTab(page);await expect(page.getByRole('main')).toContainText('AC 19');
});
test('own equipment needs only a name; details and complex effects are optional, errors preserve the draft',async({page})=>{
 await setup(page);await page.getByRole('button',{name:'Legg til annet utstyr',exact:true}).click();await page.getByRole('button',{name:'Opprett eget utstyr',exact:true}).click();
 expect(await dialog(page).locator('input:visible,select:visible,textarea:visible').count()).toBe(1); // one question: name; optional note follows
 await fillField(page,'Navn på utstyr','Reisekappe');await save(page);
 await useEquipment(page,'Reisekappe');await expect(page.getByRole('button',{name:'Reisekappe · i bruk',exact:true})).toBeVisible();await expectCharacterStatus(page,'AC13');
 await page.getByRole('button',{name:'Reisekappe · i bruk',exact:true}).click();await itemDetails(page);await fillField(page,'Utstyrsnotat','Avtalt med DM: beskytter mot regn.');
 await fillField(page,'Antall','3');await save(page);
 await page.getByRole('button',{name:'Reisekappe · i bruk · ×3',exact:true}).click();await itemDetails(page);await expect(await revealField(page,'Utstyrsnotat')).toHaveValue('Avtalt med DM: beskytter mot regn.');await save(page);
});
test('magic weapon bonus and manual totals persist offline and unchanged save adds no history',async({page,context})=>{
 await setup(page);await add(page,'Longsword');await page.getByRole('button',{name:'Longsword · i bruk',exact:true}).click();await itemDetails(page);
 await addItemBonus(page,'Angrepsbonus','1');await addItemBonus(page,'Skadebonus','1');await save(page);
 await expect(page.locator('[data-item]')).toContainText('d20+6 · 1d8+4 slashing');
 const before=await count(page);await page.getByRole('button',{name:'Longsword · i bruk',exact:true}).click();await save(page);expect(await count(page)).toBe(before);
 await page.getByRole('button',{name:'Longsword · i bruk',exact:true}).click();await itemDetails(page);await equipmentOverview(page);
 await fillField(page,'Attack (manuell total)','d20+9 (DM)');await fillField(page,'Damage (manuell total)','2d8+7 fire');await save(page);
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>navigator.serviceWorker.controller!==null);await context.setOffline(true);await page.reload();
 await page.getByRole('button',{name:'Combat',exact:true}).click();await page.getByRole('button',{name:/^Longsword/}).click();await expect(dialog(page)).toContainText('d20+9 (DM)');await expect(dialog(page)).toContainText('2d8+7 fire');
});
test('off-hand uses two owned light melee weapon instances, no positive ability bonus and no action tracking',async({page})=>{
 await setup(page);await add(page,'Dagger');await add(page,'Shortsword');await page.getByRole('button',{name:'Combat',exact:true}).click();await page.getByRole('button',{name:'Bonus',exact:true}).click();
 await page.getByRole('button',{name:/^Dagger · Off-hand/}).click();await expect(dialog(page)).toContainText('Skade: 1d4 piercing');await expect(dialog(page)).toContainText('positiv ability modifier er ikke med');await expect(dialog(page).getByRole('button')).toHaveCount(1);await page.keyboard.press('Escape');
 await expect(page.getByRole('main').getByRole('button',{name:'Bruk',exact:true})).toHaveCount(0);
});
test('independent scroll positions and readable uniform equipment pills on small screens and large text',async({page})=>{
 await setup(page);for(const name of ['Longsword','Dagger','Greatsword','Rapier','Shortbow'])await add(page,name);
 for(const width of [320,390]){
  await page.setViewportSize({width,height:568});
  const rects=await page.getByRole('group',{name:'Weapons',exact:true}).locator('.pill').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {w:r.width,h:r.height};}));
  expect(Math.max(...rects.map(r=>r.w))-Math.min(...rects.map(r=>r.w))).toBeLessThan(1);expect(Math.max(...rects.map(r=>r.h))-Math.min(...rects.map(r=>r.h))).toBeLessThan(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.evaluate(()=>document.documentElement.style.fontSize='200%');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'Longsword · i bruk',exact:true}).click();expect(await dialog(page).evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);await itemDetails(page);await equipmentOverview(page);expect(await dialog(page).evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);await page.keyboard.press('Escape');await expect(dialog(page)).not.toBeVisible();
 await page.evaluate(()=>scrollTo(0,150));const equipment=await page.evaluate(()=>scrollY);await page.getByRole('button',{name:'Character',exact:true}).click();await page.evaluate(()=>scrollTo(0,400));const character=await page.evaluate(()=>scrollY);
 await page.getByRole('button',{name:'Combat',exact:true}).click();await equipmentTab(page);expect(await page.evaluate(()=>scrollY)).toBe(equipment);
 await page.getByRole('button',{name:'Character',exact:true}).click();expect(await page.evaluate(()=>scrollY)).toBe(character);
});
test('legacy weapon profile fallback leaves stored data unchanged and failed edits preserve all fields for retry',async({page})=>{
 await setup(page);await add(page,'Longsword');
 await page.evaluate(async()=>{
  const db=await new Promise<IDBDatabase>(resolve=>{const r=indexedDB.open('dnd-character-companion');r.onsuccess=()=>resolve(r.result);});
  await new Promise<void>(resolve=>{const tx=db.transaction('characters','readwrite'),store=tx.objectStore('characters'),r=store.getAll();r.onsuccess=()=>{const c=r.result[0];delete c.items[0].weaponProfile;delete c.items[0].damage;c.items[0].name='Arvesverd';store.put(c);};tx.oncomplete=()=>resolve();});db.close();
 });
 await page.reload();await equipmentTab(page);await expect(page.locator('[data-item]')).toContainText('d20+5 · 1d8+3 slashing');
 const before=await count(page);await page.getByRole('button',{name:'Arvesverd · i bruk',exact:true}).click();await save(page);expect(await count(page)).toBe(before);
 await page.getByRole('button',{name:'Arvesverd · i bruk',exact:true}).click();await itemDetails(page);await addItemBonus(page,'Angrepsbonus','2');
 await fillField(page,'Utstyrsnotat','Avtalt med DM');
 await page.evaluate(()=>{const original=IDBObjectStore.prototype.put;(window as unknown as {failSave:boolean}).failSave=true;IDBObjectStore.prototype.put=function(...args){if(this.name==='characters'&&(window as unknown as {failSave:boolean}).failSave)throw new DOMException('Lagringsplassen er full.','QuotaExceededError');return original.apply(this,args);};});
 await finish(page);await expect(dialog(page).getByRole('alert')).toContainText('full');
 await expect(page.getByRole('textbox',{name:'Merknad',exact:true})).toHaveValue('Avtalt med DM');
 expect(await count(page)).toBe(before);await page.evaluate(()=>(window as unknown as {failSave:boolean}).failSave=false);await save(page);expect(await count(page)).toBe(before+1);await expect(page.locator('[data-item]')).toContainText('d20+7');
});
