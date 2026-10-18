import type { Page } from '@playwright/test';
export async function openMenu(page: Page) {
  const menu = page.locator('details.app-menu');
  if (await menu.getAttribute('open') === null) await menu.locator('summary').click();
}
export async function menuAction(page: Page, name: string) {
  await openMenu(page);
  await page.getByRole('button', {name, exact:true}).click();
}
export async function createCharacter(page: Page, species = 'Elf') {
  await page.goto('./'); await menuAction(page, 'Ny karakter');
  await page.getByRole('textbox', {name:'Navn',exact:true}).fill('Alva');
  await page.getByRole('combobox', {name:'Art / species',exact:true}).selectOption({label:species});
  await page.getByRole('combobox', {name:'Klasse',exact:true}).selectOption({label:'Fighter'});
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
