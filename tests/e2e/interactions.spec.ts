import {closeEditor} from './helpers';
import {fillField,choose,revealField,nextQuestion} from './helpers';
import {finish,useEquipment} from './helpers';
import {test, expect, type Page} from '@playwright/test';
import {createCharacter, menuAction, equipmentTab, expectCharacterStatus, itemDetails} from './helpers';
const modal = (page: Page) => page.getByRole('dialog');
async function add(page: Page, name: string) {
  await equipmentTab(page); await page.getByRole('button', {name:'Legg til armor og skjold',exact:true}).click();
  await page.getByRole('button', {name:`Legg til ${name}`,exact:true}).click();
  await expect(modal(page)).not.toBeVisible();await useEquipment(page,name);
}
async function historyCount(page: Page) {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open('dnd-character-companion');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
    try { return await new Promise<number>((resolve,reject)=>{const r=db.transaction('events').objectStore('events').count();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);}); }
    finally { db.close(); }
  });
}
test('lookups have one Close button, support Escape, restore focus and never create history', async ({page}) => {
  await createCharacter(page); const count=await historyCount(page);
  const trait=page.getByRole('button', {name:'Darkvision',exact:true});
  await trait.click();
  await expect(modal(page)).toContainText('60 ft.');
  await expect(modal(page).getByRole('button')).toHaveCount(1);
  await expect(modal(page).getByRole('button',{name:'Lukk',exact:true})).toBeVisible();
  await page.keyboard.press('Escape'); await expect(trait).toBeFocused();
  await trait.click();await page.getByRole('button',{name:'Lukk',exact:true}).click();
  await expect(trait).toBeFocused();
  await menuAction(page,'Endringslogg');
  await expect(modal(page).getByRole('button')).toHaveCount(1);
  await page.getByRole('button',{name:'Lukk',exact:true}).click();
  await expect(page.locator('.app-menu > summary')).toBeFocused();
  await page.locator('[data-modifier="0"]').click();
  await expect(modal(page).getByRole('button',{name:'Avbryt',exact:true})).toHaveCount(0);
  await expect(modal(page).getByRole('button',{name:'Lagre',exact:true})).toHaveCount(0);
  await modal(page).getByRole('button',{name:'Perception +0',exact:true}).click();
  await expect(modal(page)).not.toBeVisible();
  expect(await historyCount(page)).toBe(count);
});
test('equipment plus opens searchable choices immediately and selection commits exactly once', async ({page,context}) => {
  await createCharacter(page);
  const count=await historyCount(page);
  await equipmentTab(page); await page.getByRole('button',{name:'Legg til armor og skjold',exact:true}).click();
  await expect(page.getByRole('searchbox',{name:'Søk i utstyr',exact:true})).toBeFocused();
  await expect(modal(page).getByRole('button',{name:'+ Utstyr',exact:true})).toHaveCount(0);
  await expect(modal(page).getByRole('button',{name:'Lagre',exact:true})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Legg til Shield',exact:true})).toBeVisible();
  await choose(page,'Kategori','weapon');
  await expect(page.getByRole('button',{name:'Legg til Shield',exact:true})).toHaveCount(0);
  await page.getByRole('searchbox',{name:'Søk i utstyr',exact:true}).fill('greatsword');
  await expect(page.locator('[data-add-equipment]')).toHaveCount(1);
  await page.getByRole('searchbox',{name:'Søk i utstyr',exact:true}).fill('ingen slike våpen');
  await expect(modal(page)).toContainText('Ingen treff');
  await expect(page.getByRole('button',{name:'Opprett eget utstyr',exact:true})).toBeVisible();
  await page.getByRole('searchbox',{name:'Søk i utstyr',exact:true}).fill('greatsword');
  await page.getByRole('button',{name:'Legg til Greatsword',exact:true}).dblclick();
  await expect(modal(page)).not.toBeVisible();
  await expect(page.getByRole('button',{name:'Greatsword · eid',exact:true})).toHaveCount(1);
  expect(await historyCount(page)).toBe(count+1);
  await expect(page.getByRole('button',{name:'Legg til armor og skjold',exact:true})).toBeFocused();
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();
  await page.waitForFunction(()=>navigator.serviceWorker.controller !== null);
  await context.setOffline(true);await page.reload();
  await useEquipment(page,'Greatsword');await add(page,'Shield');
  await expectCharacterStatus(page,'AC12');
  await expect(page.getByRole('main')).toContainText('Tohåndsvåpen og skjold');
});
test('single-item editing and deletion preserve other gear and restore the unsaved editor on cancel', async ({page}) => {
  await createCharacter(page);await add(page,'Leather');await add(page,'Shield');
  await page.getByRole('button',{name:'Shield · i bruk',exact:true}).click();
  await itemDetails(page);
  await expect(page.getByRole('spinbutton',{name:'Antall',exact:true})).toHaveCount(1);
  await fillField(page,'Antall','2');
  await fillField(page,'Utstyrsnotat','Fra DM');
  await page.getByRole('button',{name:'Fjern fra karakteren',exact:true}).click();
  await closeEditor(page);
  await expect(page.getByRole('spinbutton',{name:'Antall',exact:true})).toHaveValue('2');
  await expect(page.getByRole('textbox',{name:'Utstyrsnotat',exact:true})).toHaveValue('Fra DM');
  await page.getByRole('checkbox',{name:'I bruk',exact:true}).uncheck();
  await finish(page);
  await expect(page.getByRole('button',{name:/^Shield · eid/})).toBeFocused();
  await expect(page.getByRole('button',{name:'Leather · i bruk',exact:true})).toBeVisible();
  await page.getByRole('button',{name:/^Shield · eid/}).click();
  await page.getByRole('button',{name:'Fjern fra karakteren',exact:true}).click();
  await page.getByRole('button',{name:'Fjern utstyr',exact:true}).click();
  await expect(modal(page)).not.toBeVisible();
  await expect(page.getByRole('button',{name:/^Shield · eid/})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Legg til armor og skjold',exact:true})).toBeFocused();
  await expect(page.getByRole('button',{name:'Leather · i bruk',exact:true})).toBeVisible();
  await menuAction(page,'Angre siste endring');
  await expect(page.getByRole('button',{name:/^Shield · eid/})).toBeVisible();
});
test('declining note deletion keeps the edited text; unchanged saving leaves undo meaningful', async ({page}) => {
  await createCharacter(page);
  await page.getByRole('button',{name:'Legg til notat',exact:true}).click();
  await fillField(page,'Tittel','Min historie');
  await fillField(page,'Tekst','Original');
  await finish(page);
  await page.getByRole('button',{name:'Min historie',exact:true}).click();
  await fillField(page,'Tekst','Ny historie');
  await page.getByRole('button',{name:'Slett notat',exact:true}).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('textbox',{name:'Tekst',exact:true})).toHaveValue('Ny historie');
  await finish(page);
  const count=await historyCount(page);
  await page.getByRole('button',{name:'Min historie',exact:true}).click();
  await finish(page);
  expect(await historyCount(page)).toBe(count);
  await menuAction(page,'Angre siste endring');
  await page.getByRole('button',{name:'Min historie',exact:true}).click();
  await expect(page.getByRole('textbox',{name:'Tekst',exact:true})).toHaveValue('Original');
});
test('HP accepts exact numeric input and has no active commit for zero changes', async ({page}) => {
  await createCharacter(page);await page.getByRole('button',{name:'Combat',exact:true}).click();
  await page.locator('[data-action="hp"]').click();
  await expect(page.getByRole('button',{name:'Oppdater HP',exact:true})).toBeDisabled();
  await fillField(page,'HP-endring i tall','-7');
  await expect(page.locator('#hp-preview')).toContainText('HP 12 → 5');
  await expect(page.getByRole('spinbutton',{name:'Tallhjul: HP-endring i tall',exact:true})).toHaveAttribute('aria-valuenow','-7');
  await page.getByRole('button',{name:'Oppdater HP',exact:true}).click();
  await expect(page.locator('[data-action="hp"]')).toBeFocused();
  await expect(page.locator('[data-action="hp"]')).toContainText('5 / 12');
  await menuAction(page,'Endringslogg');
  const last = modal(page).locator('.history > li').first();
  await last.getByText('Vis endringer',{exact:true}).click();
  await expect(last).toContainText('HP › Nåværende');
  await expect(last).toContainText('12 → 5');
  await expect(last.locator('pre')).toHaveCount(0);
});
test('failed equipment addition keeps search, shows the error and can be retried once', async ({page}) => {
  await createCharacter(page);const count=await historyCount(page);
  await equipmentTab(page); await page.getByRole('button',{name:'Legg til armor og skjold',exact:true}).click();
  await page.getByRole('searchbox',{name:'Søk i utstyr',exact:true}).fill('shield');
  await page.evaluate(()=>{
    const original=IDBObjectStore.prototype.put;
    (window as unknown as {failSave:boolean}).failSave=true;
    IDBObjectStore.prototype.put=function(...args){
      if(this.name === 'characters' && (window as unknown as {failSave:boolean}).failSave) throw new DOMException('Lagringsplassen er full.', 'QuotaExceededError');
      return original.apply(this,args);
    };
  });
  await page.getByRole('button',{name:'Legg til Shield',exact:true}).click();
  await expect(modal(page).getByRole('alert')).toContainText('full');
  await expect(page.getByRole('searchbox',{name:'Søk i utstyr',exact:true})).toHaveValue('shield');
  await expect(page.getByRole('button',{name:'Legg til Shield',exact:true})).toBeEnabled();
  expect(await historyCount(page)).toBe(count);
  await page.evaluate(()=>(window as unknown as {failSave:boolean}).failSave=false);
  await page.getByRole('button',{name:'Legg til Shield',exact:true}).click();
  await expect(modal(page)).not.toBeVisible();
  expect(await historyCount(page)).toBe(count+1);
});
test('a pending save cannot be dismissed as though it were cancelled', async ({page}) => {
  await createCharacter(page);
  await equipmentTab(page); await page.getByRole('button',{name:'Legg til armor og skjold',exact:true}).click();
  await page.evaluate(()=>{
    const descriptor=Object.getOwnPropertyDescriptor(IDBTransaction.prototype,'oncomplete')!;
    Object.defineProperty(IDBTransaction.prototype,'oncomplete',{
      ...descriptor,
      set(this:IDBTransaction, handler:((this:IDBTransaction,event:Event)=>void)|null){
        const transaction=this;
        descriptor.set!.call(this, typeof handler === 'function' ? (event:Event)=>window.setTimeout(()=>handler.call(transaction,event),600) : handler);
      },
    });
  });
  await page.getByRole('button',{name:'Legg til Shield',exact:true}).click();
  await expect(modal(page).locator('form')).toHaveAttribute('aria-busy','true');
  await page.keyboard.press('Escape');
  await expect(modal(page)).toBeVisible();
  await expect(page.getByRole('button',{name:'Lukk',exact:true})).toBeDisabled();
  await expect(modal(page)).not.toBeVisible();
  await expect(page.getByRole('button',{name:'Shield · eid',exact:true})).toHaveCount(1);
});
test('long mobile workflows return to the edited pill and preserve scroll without overflow', async ({page}) => {
  await createCharacter(page);
  const titles=Array.from({length:6},(_,i)=>`Notat ${i+1} med en lang tittel som holder samme størrelse som resten av notatpillene`);
  for(const title of titles){
    await page.getByRole('button',{name:'Legg til notat',exact:true}).click();
    await fillField(page,'Tittel',title);
    await finish(page);await expect(modal(page)).not.toBeVisible();
  }
  await page.setViewportSize({width:320,height:568});
  await page.getByRole('button',{name:titles[3],exact:true}).click();
  const scroll=await page.evaluate(()=>scrollY);
  await fillField(page,'Tekst','Endret tekst');
  await finish(page);
  await expect(modal(page)).not.toBeVisible();
  await expect(page.getByRole('button',{name:titles[3],exact:true})).toBeFocused();
  expect(await page.evaluate(()=>scrollY)).toBe(scroll);
  for(const width of [320,360,390,768]){
    await page.setViewportSize({width,height:568});
    await equipmentTab(page); await page.getByRole('button',{name:'Legg til armor og skjold',exact:true}).click();
    expect(await modal(page).evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
    await page.getByRole('button',{name:'Opprett eget utstyr',exact:true}).click();
    expect(await modal(page).evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
    await closeEditor(page);
  }
});
