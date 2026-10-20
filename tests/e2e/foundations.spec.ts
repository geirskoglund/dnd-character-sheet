import {closeEditor} from './helpers';
import {fillField,choose,revealField,nextQuestion} from './helpers';
import {characterStep,finish,useEquipment} from './helpers';
import { test, expect, type Page } from '@playwright/test';
import { menuAction, equipmentTab, expectCharacterStatus, itemDetails } from './helpers';
async function openCharacter(page: Page, species = 'Human', className = 'Fighter', level = 5) {
  await page.goto('./'); await menuAction(page, 'Ny karakter');
  await expect(page.getByRole('textbox', {name:'Navn',exact:true})).toHaveValue('');
  await fillField(page,'Navn','Alva');
  await choose(page,'Art / species',{label:species});
  await characterStep(page,1);
  await choose(page,'Klasse',{label:className});
  await fillField(page,'Klassenivå',String(level));
  await characterStep(page,2);
  await fillField(page,'Maks HP fra karakterarket','42');
  for (const [name,value] of [['DEX','16'],['CON','14'],['WIS','16']]) await fillField(page,name,value);
  await characterStep(page,0);
}
async function addEquipment(page: Page, name: string) {
  if (!await page.getByRole('dialog').isVisible()) await equipment(page);
  await page.getByRole('button', {name:`Legg til ${name.split(' · ')[0]}`,exact:true}).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();await useEquipment(page,name.split(' · ')[0]);
}
async function save(page: Page) {
  await finish(page);
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('heading', {name:'Alva',exact:true})).toBeVisible();
}
async function equipment(page: Page) { await equipmentTab(page); await page.getByRole('button',{name:'Legg til armor og skjold',exact:true}).click(); }
test('minimal creation, five read-only status values, equipment edited inside app and uniform pills', async ({page}) => {
  await openCharacter(page);
  await expect(page.locator('#species-info, #derived-preview, #equipment-rows, [name="hpCurrent"], [name="hpTemp"], [name="acOverride"]')).toHaveCount(0);
  await expect(page.getByRole('dialog')).not.toContainText('grunnfart');
  await expect(page.getByRole('dialog')).not.toContainText('Darkvision');
  await save(page);
  await expect(page.getByRole('button',{name:'Rediger karakter',exact:true})).not.toBeVisible();
  await expect(page.getByRole('combobox',{name:'Bytt karakter',exact:true})).not.toBeVisible();
  await expect(page.locator('[data-action="hp"], [data-action="temp-hp"]')).toHaveCount(0);
  await expectCharacterStatus(page,'42 / 42');
  await expect(page.getByLabel('Karakterstatus').locator(':scope > *')).toHaveCount(5);
  await equipment(page); await addEquipment(page,'Leather · armor'); await addEquipment(page,'Shield · shield');
  await expectCharacterStatus(page,'AC16');
  await page.getByRole('button',{name:'Shield · i bruk',exact:true}).click();
  await page.getByRole('checkbox',{name:'I bruk',exact:true}).uncheck(); await save(page);
  await expectCharacterStatus(page,'AC14');
  await page.reload(); await equipmentTab(page); await expect(page.getByRole('button',{name:'Shield · eid',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Character',exact:true}).click();
  for (const title of ['Kort notat', 'En lang overskrift som skal kunne leses uten at pillene får forskjellig størrelse']) {
    await page.getByRole('button',{name:'Legg til notat',exact:true}).click();
    await fillField(page,'Tittel',title); await save(page);
  }
  for (const width of [320,360,390,768]) {
    await page.setViewportSize({width,height:844});
    const rects = await page.getByLabel('Karakterstatus').locator(':scope > *').evaluateAll(els => els.map(el => {const r=el.getBoundingClientRect();return {y:r.y,w:r.width,h:r.height};}));
    expect(new Set(rects.map(r=>r.y)).size).toBe(1);
    expect(Math.max(...rects.map(r=>r.w))-Math.min(...rects.map(r=>r.w))).toBeLessThan(1);
    const groups = await page.locator('.pills').evaluateAll(groups=>groups.map(group=>[...group.children].map(el=>{const r=el.getBoundingClientRect();return {w:r.width,h:r.height};})));
    for (const rects of groups) {
      expect(Math.max(...rects.map(r=>r.w))-Math.min(...rects.map(r=>r.w))).toBeLessThan(1);
      expect(Math.max(...rects.map(r=>r.h))-Math.min(...rects.map(r=>r.h))).toBeLessThan(1);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
});
test('subclass lists follow class, custom subclasses persist, core editing preserves equipment', async ({page}) => {
  await openCharacter(page);
  await characterStep(page,1);
  await choose(page,'Subclass (valgfritt)',{label:'Champion'});
  await characterStep(page,1);
  await choose(page,'Klasse',{label:'Wizard'});
  await expect(page.getByLabel('Subclass (valgfritt)',{exact:true})).toHaveValue('');
  await expect(page.locator('[name="subclassChoice"] option')).not.toContainText(['Champion']);
  await characterStep(page,1);
  await choose(page,'Subclass (valgfritt)','custom');
  await fillField(page,'Egen subclass','Min skole');
  await save(page); await equipment(page); await addEquipment(page,'Shield · shield');
  await menuAction(page,'Rediger karakter');
  await revealField(page,'Egen subclass');await expect(page.getByRole('textbox',{name:'Egen subclass',exact:true})).toHaveValue('Min skole');
  await characterStep(page,0);
  await choose(page,'Art / species',{label:'Dwarf'});
  await save(page); await page.reload(); await equipmentTab(page);
  await expect(page.locator('header')).toContainText('Min skole');
  await expect(page.getByRole('button',{name:'Shield · i bruk',exact:true})).toBeVisible();
  await expectCharacterStatus(page,'Speed25 ft');
});
test('Monk AC and speed follow class level and equipped shield', async ({page}) => {
  await openCharacter(page,'Human','Monk',6); await save(page);
  await expectCharacterStatus(page,'AC16');
  await expectCharacterStatus(page,'Speed45 ft');
  await equipment(page); await addEquipment(page,'Shield · shield');
  await expectCharacterStatus(page,'AC15');
  await expectCharacterStatus(page,'Speed30 ft');
  await page.getByRole('button',{name:'Shield · i bruk',exact:true}).click();
  await page.getByRole('checkbox',{name:'I bruk',exact:true}).uncheck(); await save(page);
  await expectCharacterStatus(page,'AC16');
  await expectCharacterStatus(page,'Speed45 ft');
});
test('custom species and custom armor remain editable separately', async ({page}) => {
  await openCharacter(page);
  await choose(page,'Art / species','custom');
  await fillField(page,'Navn på art / underart','Min art');
  await fillField(page,'Grunnfart for arten (ft)','35'); await save(page);
  await equipment(page); await page.getByRole('button',{name:'Opprett eget utstyr',exact:true}).click();
  await fillField(page,'Navn på utstyr','Min rustning');
  await finish(page);await expect(page.getByRole('dialog')).not.toBeVisible();
  await useEquipment(page,'Min rustning');await page.getByRole('button',{name:'Min rustning · i bruk',exact:true}).click();await itemDetails(page);await page.getByText('Rustningens regelverdier',{exact:true}).click();
  await fillField(page,'Base AC for rustningen','15');
  await fillField(page,'Maks Dexterity-bonus (tomt = ingen grense)','2');
  await expect(page.locator('#derived-preview')).toContainText('Samlet AC 17'); await save(page); await page.reload();
  await menuAction(page,'Rediger karakter');
  await revealField(page,'Navn på art / underart');await expect(page.getByRole('textbox',{name:'Navn på art / underart',exact:true})).toHaveValue('Min art'); await save(page);
  await equipmentTab(page); await page.getByRole('button',{name:'Min rustning · i bruk',exact:true}).click(); await expect(page.getByRole('textbox',{name:'Navn på utstyr',exact:true})).toHaveValue('Min rustning'); await save(page);
});
test('damage and temp HP only in Combat, preview/cancel and atomic undo', async ({page}) => {
  await openCharacter(page); await save(page);
  await page.getByRole('button',{name:'Combat',exact:true}).click();
  await page.locator('[data-action="temp-hp"]').click();
  await fillField(page,'Temporary HP','5'); await save(page);
  await page.locator('[data-action="hp"]').click();
  await fillField(page,'HP-endring i tall','-8');
  await expect(page.locator('#hp-preview')).toContainText('HP 42 → 39');
  await expect(page.locator('#hp-preview')).toContainText('Temporary HP 5 → 0');
  await closeEditor(page);
  await expect(page.locator('[data-action="hp"]')).toContainText('42 / 42');
  await page.locator('[data-action="hp"]').click();
  await fillField(page,'HP-endring i tall','-8');
  await page.getByRole('button',{name:'Oppdater HP',exact:true}).click();
  await expect(page.locator('[data-action="hp"]')).toContainText('39 / 42');
  await menuAction(page,'Angre siste endring');
  await expect(page.locator('[data-action="hp"]')).toContainText('42 / 42');
  await expect(page.locator('[data-action="temp-hp"]')).toContainText('5');
  await menuAction(page,'Rediger karakter');
  await characterStep(page,2);
  await fillField(page,'Maks HP fra karakterarket','50'); await save(page);
  await expect(page.locator('[data-action="hp"]')).toContainText('42 / 50');
  await expect(page.locator('[data-action="temp-hp"]')).toContainText('5');
  await page.getByRole('button',{name:'Character',exact:true}).click();
  await expectCharacterStatus(page,'42 / 50');
  await expect(page.getByRole('main')).not.toContainText('Temporary HP');
});
test('manual overrides can be removed through the menu', async ({page}) => {
  await openCharacter(page); await save(page);
  await menuAction(page,'Beregninger og overstyringer');
  await fillField(page,'Manuell AC (valgfritt)','21');
  await fillField(page,'Manuell speed (ft, valgfritt)','50'); await save(page);
  await expectCharacterStatus(page,'AC21');
  await expect(page.getByLabel('Karakterstatus')).toContainText('AC21');
  await expectCharacterStatus(page,'Speed50 ft');
  await menuAction(page,'Beregninger og overstyringer');
  await fillField(page,'Manuell AC (valgfritt)','');
  await fillField(page,'Manuell speed (ft, valgfritt)',''); await save(page);
  await expectCharacterStatus(page,'AC13');
  await expectCharacterStatus(page,'Speed30 ft');
});
test('Level Up requires manually entered HP, persists level/subclass, and undoes together', async ({page}) => {
  await openCharacter(page,'Human','Fighter',2); await save(page);
  await menuAction(page,'Level Up');
  await expect(page.getByRole('spinbutton',{name:'Ny samlet maks HP',exact:true})).toHaveValue('');
  await fillField(page,'Ny samlet maks HP','49');
  await choose(page,'Subclass (valgfritt)',{label:'Champion'});
  await closeEditor(page);
  await expect(page.locator('header')).toContainText('Fighter 2');
  await menuAction(page,'Level Up');
  await fillField(page,'Ny samlet maks HP','49');
  await choose(page,'Subclass (valgfritt)',{label:'Champion'});
  await page.getByRole('button',{name:'Bekreft Level Up',exact:true}).click();
  await expect(page.locator('header')).toContainText('Fighter 3 · Champion');
  await expectCharacterStatus(page,'42 / 49');
  await page.reload(); await expect(page.locator('header')).toContainText('Fighter 3 · Champion');
  await menuAction(page,'Endringslogg');
  await expect(page.getByRole('dialog')).toContainText('maks HP 42 → 49');
  await page.getByRole('button',{name:'Lukk',exact:true}).click();
  await menuAction(page,'Angre siste endring');
  await expect(page.locator('header')).toContainText('Fighter 2');
  await expect(page.locator('header')).not.toContainText('Champion');
  await expectCharacterStatus(page,'42 / 42');
});
test('cancelled forms leave no stale listeners or errors in the next dialog', async ({page}) => {
  const errors: string[] = []; page.on('pageerror', error=>errors.push(error.message));
  await openCharacter(page); await save(page);
  await menuAction(page,'Rediger karakter');
  await characterStep(page,1);
  await choose(page,'Klasse','custom');
  await fillField(page,'Egen klasse','Min klasse');
  await closeEditor(page);
  await equipment(page); await addEquipment(page,'Leather · armor');
  await menuAction(page,'Rediger karakter');
  await closeEditor(page);
  await page.getByRole('button',{name:'Combat',exact:true}).click();
  await page.locator('[data-action="hp"]').click();
  await fillField(page,'HP-endring i tall','-3');
  await closeEditor(page);
  await menuAction(page,'Rediger karakter');
  await characterStep(page,1);
  await choose(page,'Klasse','custom');
  await fillField(page,'Egen klasse','Fighter'); await save(page);
  await menuAction(page,'Rediger karakter');
  await characterStep(page,1);await expect(page.getByLabel('Klasse',{exact:true})).toHaveValue('custom');
  expect(errors).toEqual([]);
});
test('four modifier favorites show full names, can be changed and persist offline', async ({page,context}) => {
  await openCharacter(page); await save(page);
  await expect(page.locator('[data-modifier]')).toHaveCount(4);
  await expect(page.locator('[data-modifier="2"]')).toContainText('Stealth+3');
  await page.locator('[data-modifier="2"]').click();
  await page.getByRole('button',{name:'Animal Handling +3',exact:true}).click();
  await expect(page.locator('[data-modifier="2"]')).toContainText('Animal Handling+3');
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();
  await page.waitForFunction(()=>navigator.serviceWorker.controller !== null);
  await context.setOffline(true);await page.reload();
  await expect(page.locator('[data-modifier="2"]')).toContainText('Animal Handling+3');
  await page.setViewportSize({width:320,height:844});
  await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.locator('[data-modifier="2"]')).toContainText('Animal Handling');
});
