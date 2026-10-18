import { test, expect, type Page } from '@playwright/test';
async function openCharacter(page: Page, species = 'Human', className = 'Fighter', level = 5) {
  await page.goto('./'); await page.getByRole('button', {name:'Ny karakter',exact:true}).click();
  await page.getByRole('textbox', {name:'Navn',exact:true}).fill('Alva');
  await page.getByRole('combobox', {name:'Art / species',exact:true}).selectOption({label:species});
  await page.getByRole('combobox', {name:'Klasse',exact:true}).selectOption({label:className});
  await page.getByRole('spinbutton', {name:'Klassenivå',exact:true}).fill(String(level));
  await page.getByRole('spinbutton', {name:'Maks HP fra karakterarket',exact:true}).fill('42');
  await page.getByRole('spinbutton', {name:'DEX',exact:true}).fill('16');
  await page.getByRole('spinbutton', {name:'CON',exact:true}).fill('14');
  await page.getByRole('spinbutton', {name:'WIS',exact:true}).fill('16');
}
async function addEquipment(page: Page, name: string) {
  await page.getByRole('button', {name:'+ Utstyr',exact:true}).click();
  await page.getByRole('combobox', {name:'Utstyr',exact:true}).last().selectOption({label: name});
}
async function save(page: Page) {
  await page.getByRole('button', {name:'Lagre',exact:true}).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('heading', {name:'Alva',exact:true})).toBeVisible();
}
test('creation shows derived AC/speed, initializes HP, and separates owned and equipped gear', async ({page}) => {
  await openCharacter(page);
  await expect(page.locator('[name="acOverride"], [name="speed"], [name="hpCurrent"], [name="hpTemp"]')).toHaveCount(0);
  await addEquipment(page, 'Leather · armor');
  await addEquipment(page, 'Shield · shield');
  await expect(page.locator('#derived-preview')).toContainText('AC 16');
  await expect(page.locator('#derived-preview')).toContainText('Speed 30 ft');
  await save(page);
  await expect(page.locator('[data-action="hp"]')).toContainText('42 / 42');
  await expect(page.locator('[data-action="temp-hp"]')).toContainText('0');
  await page.getByRole('button', {name:'Shield · utstyrt',exact:true}).click();
  await expect(page.getByRole('button', {name:'Shield · eid',exact:true})).toBeVisible();
  await expect(page.getByLabel('Karakterstatus')).toContainText('AC14');
  await page.reload();
  await expect(page.getByRole('button', {name:'Shield · eid',exact:true})).toBeVisible();
  await page.getByRole('button', {name:'Rediger karakter'}).click();
  await page.getByRole('combobox', {name:'Art / species',exact:true}).selectOption({label:'Dwarf'});
  await addEquipment(page, 'Plate · armor');
  await expect(page.locator('#derived-preview')).toContainText('AC 18');
  await expect(page.locator('#derived-preview')).toContainText('Speed 25 ft');
  await expect(page.locator('#derived-preview')).toContainText('Flere rustninger');
  await save(page);
});
test('Monk AC and speed follow class level and shield use with visible explanations', async ({page}) => {
  await openCharacter(page,'Human','Monk',6);
  await expect(page.locator('#derived-preview')).toContainText('AC 16');
  await expect(page.locator('#derived-preview')).toContainText('Speed 45 ft');
  await expect(page.locator('#derived-preview')).toContainText('Unarmored Defense');
  await addEquipment(page,'Shield · shield');
  await expect(page.locator('#derived-preview')).toContainText('AC 15');
  await expect(page.locator('#derived-preview')).toContainText('Speed 30 ft');
  await save(page);
  await page.getByRole('button',{name:'Shield · utstyrt',exact:true}).click();
  await expect(page.getByRole('button',{name:'Shield · eid',exact:true})).toBeVisible();
  await expect(page.getByLabel('Karakterstatus')).toContainText('AC16');
  await expect(page.getByLabel('Karakterstatus')).toContainText('Speed45 ft');
});
test('custom species and custom armor remain editable and do not silently become SRD definitions', async ({page}) => {
  await openCharacter(page);
  await page.getByRole('combobox',{name:'Art / species',exact:true}).selectOption('custom');
  await page.getByRole('textbox',{name:'Navn på art / underart',exact:true}).fill('Min art');
  await page.getByRole('spinbutton',{name:'Grunnfart for arten (ft)',exact:true}).fill('35');
  await page.getByRole('button',{name:'+ Utstyr',exact:true}).click();
  await page.getByRole('combobox',{name:'Utstyr',exact:true}).selectOption('custom');
  await page.getByRole('textbox',{name:'Navn på utstyr',exact:true}).fill('Min rustning');
  await page.getByRole('combobox',{name:'Kategori',exact:true}).selectOption('armor');
  await page.getByRole('spinbutton',{name:'Base AC for rustningen',exact:true}).fill('15');
  await page.getByRole('spinbutton',{name:'Maks Dexterity-bonus (tomt = ingen grense)',exact:true}).fill('2');
  await expect(page.locator('#derived-preview')).toContainText('AC 17');
  await expect(page.locator('#derived-preview')).toContainText('Speed 35 ft');
  await save(page); await page.reload();
  await page.getByRole('button',{name:'Rediger karakter'}).click();
  await expect(page.getByRole('textbox',{name:'Navn på art / underart',exact:true})).toHaveValue('Min art');
  await expect(page.getByRole('textbox',{name:'Navn på utstyr',exact:true})).toHaveValue('Min rustning');
  await save(page);
});
test('HP changes preview before commit, damage uses temp HP first and undo is atomic', async ({page}) => {
  await openCharacter(page); await save(page);
  await page.locator('[data-action="temp-hp"]').click();
  await page.getByRole('spinbutton',{name:'Temporary HP',exact:true}).fill('5'); await save(page);
  await page.locator('[data-action="hp"]').click();
  await page.getByRole('slider',{name:'Endring i HP',exact:true}).fill('-8');
  await expect(page.locator('#hp-preview')).toContainText('HP 42 → 39');
  await expect(page.locator('#hp-preview')).toContainText('Temporary HP 5 → 0');
  await page.getByRole('button',{name:'Avbryt'}).click();
  await expect(page.locator('[data-action="hp"]')).toContainText('42 / 42');
  await page.locator('[data-action="hp"]').click();
  await page.getByRole('slider',{name:'Endring i HP',exact:true}).fill('-8');
  await page.getByRole('button',{name:'Oppdater HP',exact:true}).click();
  await expect(page.locator('[data-action="hp"]')).toContainText('39 / 42');
  await expect(page.locator('[data-action="temp-hp"]')).toContainText('0');
  await page.getByText('Karakteradministrasjon',{exact:true}).click();
  await page.getByRole('button',{name:'Angre siste endring'}).click();
  await expect(page.locator('[data-action="hp"]')).toContainText('42 / 42');
  await expect(page.locator('[data-action="temp-hp"]')).toContainText('5');
  await page.getByRole('button',{name:'Rediger karakter'}).click();
  await page.getByRole('spinbutton',{name:'Maks HP fra karakterarket',exact:true}).fill('50');
  await save(page);
  await expect(page.locator('[data-action="hp"]')).toContainText('42 / 50');
  await expect(page.locator('[data-action="temp-hp"]')).toContainText('5');
});
test('manual overrides can be removed to return to equipment-derived values', async ({page}) => {
  await openCharacter(page); await save(page);
  await page.getByRole('button',{name:'Beregninger og overstyringer',exact:true}).click();
  await page.getByRole('spinbutton',{name:'Manuell AC (valgfritt)',exact:true}).fill('21');
  await page.getByRole('spinbutton',{name:'Manuell speed (ft, valgfritt)',exact:true}).fill('50');
  await save(page);
  await expect(page.getByLabel('Karakterstatus')).toContainText('AC21');
  await expect(page.getByLabel('Karakterstatus')).toContainText('Speed50 ft');
  await page.getByRole('button',{name:'Beregninger og overstyringer',exact:true}).click();
  await page.getByRole('spinbutton',{name:'Manuell AC (valgfritt)',exact:true}).fill('');
  await page.getByRole('spinbutton',{name:'Manuell speed (ft, valgfritt)',exact:true}).fill('');
  await save(page);
  await expect(page.getByLabel('Karakterstatus')).toContainText('AC13');
  await expect(page.getByLabel('Karakterstatus')).toContainText('Speed30 ft');
});
