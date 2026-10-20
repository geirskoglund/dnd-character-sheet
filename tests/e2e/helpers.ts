import type { Page } from '@playwright/test';
export async function openMenu(page: Page) {
  const menu = page.locator('details.app-menu');
  if (await menu.getAttribute('open') === null) await menu.locator('summary').click();
}
export async function menuAction(page: Page, name: string) {
  await openMenu(page);
  await page.getByRole('button', {name, exact:true}).click();
  if(name==='Angre siste endring')await page.waitForFunction(()=>document.querySelector('#app')?.getAttribute('aria-busy')!=='true');
}
export async function createCharacter(page: Page, species = 'Elf') {
  await page.goto('./'); await menuAction(page, 'Ny karakter');
  await page.getByRole('textbox', {name:'Navn',exact:true}).fill('Alva');
  await page.getByRole('combobox', {name:'Art / species',exact:true}).selectOption({label:species});
  await characterStep(page,1);
  await page.getByRole('combobox', {name:'Klasse',exact:true}).selectOption({label:'Fighter'});
  await characterStep(page,2);
  await page.getByRole('spinbutton', {name:'Maks HP fra karakterarket',exact:true}).fill('12');
  await page.getByRole('button', {name:'Lagre',exact:true}).click();
  await page.getByRole('dialog').waitFor({state:'hidden'});
}

export async function equipmentTab(page: Page) { await page.getByRole('navigation').getByRole('button',{name:'Utstyr',exact:true}).click(); }
export async function expectCharacterStatus(page: Page, text: string) {
  const {expect} = await import('@playwright/test');
  const equipment = await page.locator('[data-page="equipment"]').getAttribute('aria-current');
  if (equipment) await page.getByRole('button',{name:'Character',exact:true}).click();
  await expect(page.getByLabel('Karakterstatus')).toContainText(text);
  if (equipment) await equipmentTab(page);
}
export async function itemDetails(page: Page) {
  await page.getByRole('dialog').getByText('Tilpass gjenstanden',{exact:true}).click();
}

export async function characterStep(page:Page,index:number){
 const groups=page.locator('#dialog-body > fieldset');
 for(let attempts=0;!await groups.nth(index).isVisible();attempts++){
  if(attempts>5)throw new Error('Karaktersteget kan ikke åpnes; kontroller valideringen.');
  const current=await groups.evaluateAll(els=>els.findIndex(el=>!(el as HTMLElement).hidden));
  await page.getByRole('dialog').getByRole('button',{name:current<index?'Neste':'Tilbake',exact:true}).click();
 }
}
export async function finish(page:Page){
 const d=page.getByRole('dialog');
 for(let attempts=0;await d.getByRole('button',{name:'Neste',exact:true}).isVisible();attempts++){if(attempts>10)throw new Error('Veiviseren kunne ikke fullføres.');await d.getByRole('button',{name:'Neste',exact:true}).click();}
 await d.locator('#submit').click();
}
export async function useEquipment(page:Page,name:string){
 await equipmentTab(page);
 await page.getByRole('button',{name:`${name} · eid`,exact:true}).click();
 await page.getByRole('checkbox',{name:'I bruk',exact:true}).check();await finish(page);
 await page.getByRole('dialog').waitFor({state:'hidden'});
}
export async function advancedRecord(page:Page){
 await page.getByRole('button',{name:'Tilpass',exact:true}).click();
 await page.getByRole('button',{name:'Flere detaljer',exact:true}).click();
}
