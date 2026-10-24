import {test,expect,type Page} from '@playwright/test';
import {menuAction,openMenu,createCharacter,equipmentTab,wheelEntry,setNumberField} from './helpers';
async function fillField(page:Page,name:string,value:string){await page.locator('dialog[data-wizard=true]').getByLabel(name,{exact:true}).click();const editor=page.locator('.text-editor');await editor.locator('input,textarea').fill(value);await editor.getByRole('button',{name:'OK',exact:true}).click();}
const stock=(page:Page)=>page.locator('.consumables-dialog');
async function open(page:Page){await page.locator('[data-action="consumables"]').click();}
async function undoStock(page:Page){await stock(page).getByRole('button',{name:'OK',exact:true}).click();await menuAction(page,'Angre siste endring');await open(page);}
async function add(page:Page,name='Arrows',quantity='18'){
 await stock(page).getByRole('button',{name:'Legg til forbruksvare',exact:true}).click();
 await page.locator('[data-catalog]').filter({hasText:name}).filter({visible:true}).first().click();
 await setNumberField(page,page.getByRole('spinbutton',{name:/Antall/}),quantity);
 await page.locator('dialog[open] #submit').click();await expect(page.locator('dialog[open] #submit')).toHaveCount(0);
}
test('shared stock: short, long, total, zero, undo and offline persist without touching HP',async({page,context})=>{
 await createCharacter(page);await equipmentTab(page);await open(page);await expect(stock(page)).toContainText('Ingen forbruksvarer');await add(page);
 const count=stock(page).locator('[data-total]');await expect(count).toHaveText('18');
 await stock(page).getByRole('button',{name:'Bruk én Arrows',exact:true}).click();await expect(count).toHaveText('17');await stock(page).getByRole('button',{name:'OK',exact:true}).click();await expect(stock(page)).toHaveCount(0);await open(page);await expect(count).toHaveText('17');
 await undoStock(page);await expect(count).toHaveText('18');
 const minus=stock(page).getByRole('button',{name:'Bruk én Arrows',exact:true});const box=(await minus.boundingBox())!;
 await page.mouse.move(box.x+10,box.y+10);await page.mouse.down();await expect(page.locator('.number-change-dialog')).toBeVisible();await page.mouse.up();
 const d=page.locator('.number-change-dialog');await expect(d.locator('.number-before b')).toHaveText('18');await expect(d.locator('.number-after b')).toHaveText('18');
 await wheelEntry(page,'Endring','-5');await expect(d.locator('.number-after b')).toHaveText('13');await d.getByRole('button',{name:'OK',exact:true}).click();await expect(count).toHaveText('13');
 await count.click();await wheelEntry(page,'Ny total','20');await expect(d.locator('.number-before b')).toHaveText('13');await expect(d.locator('.number-after b')).toHaveText('20');await d.getByRole('button',{name:'OK',exact:true}).click();await expect(count).toHaveText('20');
 await count.click();await wheelEntry(page,'Ny total','-30');await expect(d.locator('.number-after b')).toHaveText('0');await d.getByRole('button',{name:'OK',exact:true}).click();await expect(minus).toBeDisabled();
 await stock(page).getByRole('button',{name:'Legg til én Arrows',exact:true}).click();await expect(count).toHaveText('1');
 await stock(page).getByRole('button',{name:'Lukk Forbruksvarer',exact:true}).click();await page.getByRole('button',{name:'Combat',exact:true}).click();await open(page);await expect(count).toHaveText('1');
 await stock(page).getByRole('button',{name:'Lukk Forbruksvarer',exact:true}).click();await page.reload();await context.setOffline(true);await page.getByRole('button',{name:'Combat',exact:true}).click();await open(page);await expect(count).toHaveText('1');await expect(stock(page).locator('[data-add-consumable]')).toHaveCount(0);await stock(page).getByRole('button',{name:'OK',exact:true}).click();await equipmentTab(page);await open(page);await add(page,'Torch','3');await expect(stock(page).locator('[data-consumable]')).toHaveCount(2);
});
test('custom wizard preserves draft, duplicate names and optional description/icon at narrow large text',async({page})=>{
 await createCharacter(page);await equipmentTab(page);await open(page);await add(page);
 await stock(page).getByRole('button',{name:'Legg til forbruksvare',exact:true}).click();await page.getByRole('button',{name:'Egen forbruksvare',exact:true}).click();
 await fillField(page,'Navn','Arrows');await page.locator('dialog[open] #submit').click();
 await page.getByRole('button',{name:'Lukk veiviseren',exact:true}).click();await stock(page).getByRole('button',{name:'Lukk Forbruksvarer',exact:true}).click();await page.reload();
 await openMenu(page);await page.locator('[data-draft]').click();
 await expect(page.locator('#wizard-question')).toHaveText('Hvor mange har du?');await setNumberField(page,page.getByRole('spinbutton',{name:'Antall',exact:true}),'7');await page.locator('dialog[open] #submit').click();
 await page.getByRole('button',{name:'Annet',exact:true}).click();await fillField(page,'Terninguttrykk (valgfritt)','2d6+1');await page.locator('dialog[open] #submit').click();await fillField(page,'Beskrivelse (valgfritt)','DM-piler');await page.locator('dialog[open] #submit').click();await page.locator('dialog[open]').getByText('Ikon (valgfritt)',{exact:true}).click();await page.locator('dialog[open]').getByRole('button',{name:'Magi',exact:true}).click();await page.locator('dialog[open] #submit').click();
 await equipmentTab(page);await open(page);await expect(stock(page).locator('[data-consumable]')).toHaveCount(2);await expect(stock(page).locator('[data-consumable]').last().locator('[data-icon=magic]')).toHaveCount(1);await expect(stock(page).locator('[data-consumable]').last()).toContainText('2d6+1');
 await page.setViewportSize({width:320,height:700});await page.evaluate(()=>document.documentElement.style.fontSize='200%');
 await expect(stock(page)).toBeVisible();expect(await stock(page).evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
 await page.screenshot({path:test.info().outputPath('review-stock-320-large.png')});
});
test('storage failure preserves the selected total, retry saves once, and pointer cancel/movement cancels long press',async({page})=>{
 await createCharacter(page);await equipmentTab(page);await open(page);await add(page);
 const plus=stock(page).getByRole('button',{name:'Legg til én Arrows',exact:true});
 await plus.dispatchEvent('pointerdown',{button:0,pointerId:1,clientX:10,clientY:10});await page.evaluate(()=>window.dispatchEvent(new PointerEvent('pointercancel',{pointerId:1})));await page.waitForTimeout(550);await expect(page.locator('.number-change-dialog')).toHaveCount(0);
 await plus.dispatchEvent('pointerdown',{button:0,pointerId:2,clientX:10,clientY:10});await page.evaluate(()=>window.dispatchEvent(new PointerEvent('pointermove',{pointerId:2,clientX:10,clientY:40})));await page.waitForTimeout(550);await expect(page.locator('.number-change-dialog')).toHaveCount(0);await plus.dispatchEvent('click');await expect(stock(page).locator('[data-total]')).toHaveText('18');
 await page.evaluate(()=>{const original=IDBObjectStore.prototype.put;(window as any).failStock=true;IDBObjectStore.prototype.put=function(...args){if(this.name==='characters'&&(window as any).failStock)throw Error('Full lagring');return original.apply(this,args);};});
 await stock(page).locator('[data-total]').click();await wheelEntry(page,'Ny total','20');const d=page.locator('.number-change-dialog');await d.getByRole('button',{name:'OK',exact:true}).click();await expect(d.getByRole('alert')).toHaveText('Full lagring');await expect(d).not.toHaveAttribute('aria-busy','true');await expect(d.locator('.number-after b')).toHaveText('20');
 await page.evaluate(()=>(window as any).failStock=false);await d.getByRole('button',{name:'OK',exact:true}).dblclick();await expect(stock(page).locator('[data-total]')).toHaveText('20');
 await undoStock(page);await expect(stock(page).locator('[data-total]')).toHaveText('18');
});

test('long plus is a zero-change shortcut, cancellation is safe and keyboard total needs no hold',async({page})=>{
 await createCharacter(page);await equipmentTab(page);await open(page);await add(page);
 const plus=stock(page).getByRole('button',{name:'Legg til én Arrows',exact:true}),box=(await plus.boundingBox())!;
 await page.mouse.move(box.x+10,box.y+10);await page.mouse.down();const d=page.locator('.number-change-dialog');await expect(d).toBeVisible();await page.mouse.up();
 await expect(d.locator('.number-after b')).toHaveText('18');await wheelEntry(page,'Endring','20');await expect(d.locator('.number-after b')).toHaveText('38');await d.getByRole('button',{name:'Avbryt',exact:true}).click();await expect(stock(page).locator('[data-total]')).toHaveText('18');
 await stock(page).locator('[data-total]').focus();await page.keyboard.press('Enter');await wheelEntry(page,'Ny total','38');await d.getByRole('button',{name:'OK',exact:true}).click();await expect(stock(page).locator('[data-total]')).toHaveText('38');
});

test('review: catalog excludes owned stocks, Combat only uses and reads, equipment removal warns only for positive stock',async({page})=>{
 await createCharacter(page);await equipmentTab(page);await expect(page.getByText('AC-grunnlag',{exact:true})).toHaveCount(0);
 await expect(page.locator('[data-action=consumables] [data-icon=potion]')).toHaveCount(1);await page.screenshot({path:test.info().outputPath('review-equipment-390.png')});
 await open(page);await add(page,'Potion of Supreme Healing','5');
 const row=stock(page).locator('[data-consumable]');await expect(row).toContainText('10d4+20');await expect(row).not.toContainText('flasker');await page.screenshot({path:test.info().outputPath('review-stock-390.png')});
 await stock(page).getByRole('button',{name:'Legg til forbruksvare',exact:true}).click();await expect(page.locator('[name=consumableSearch]')).toHaveCount(0);await expect(page.locator('[data-catalog]').filter({hasText:'Potion of Supreme Healing'})).toHaveCount(0);await page.locator('dialog[data-kind=view]').getByRole('button',{name:'Lukk',exact:true}).click();
 await stock(page).getByRole('button',{name:'OK',exact:true}).click();await page.getByRole('button',{name:'Combat',exact:true}).click();await open(page);
 await expect(stock(page).getByRole('heading',{name:'Forbruksvarer',exact:true})).toBeVisible();await expect(row).toContainText('10d4+20');await page.screenshot({path:test.info().outputPath('review-combat-stock-390.png')});await expect(stock(page).locator('[data-add-consumable]')).toHaveCount(0);await row.locator('[data-info]').click();
 const lookup=page.locator('dialog[data-kind=view]');await expect(lookup.getByRole('button',{name:'Fjern utstyr',exact:true})).toHaveCount(0);await expect(lookup).not.toContainText('Potions of Healing (table)');await expect(lookup).not.toContainText('| Potion');await expect(lookup).toContainText('You regain hit points');await page.screenshot({path:test.info().outputPath('review-combat-lookup-390.png')});await lookup.getByRole('button',{name:'OK',exact:true}).click();
 await stock(page).getByRole('button',{name:'OK',exact:true}).click();await equipmentTab(page);await open(page);await row.locator('[data-info]').click();await lookup.getByRole('button',{name:'Fjern utstyr',exact:true}).click();
 const confirm=page.locator('dialog[data-kind=confirm]');await expect(confirm).toContainText('Du har fortsatt');await expect(confirm).toContainText('5');await expect(confirm).toContainText('Potion of Supreme Healing');await page.screenshot({path:test.info().outputPath('review-remove-positive-390.png')});await confirm.getByRole('button',{name:'Avbryt',exact:true}).click();await expect(lookup.getByRole('button',{name:'OK',exact:true})).toBeVisible();await lookup.getByRole('button',{name:'OK',exact:true}).click();
 await row.locator('[data-total]').click();await wheelEntry(page,'Ny total','0');await page.locator('.number-change-dialog').getByRole('button',{name:'OK',exact:true}).click();await row.locator('[data-info]').click();await lookup.getByRole('button',{name:'Fjern utstyr',exact:true}).click();await expect(confirm).not.toContainText('Du har fortsatt');await page.evaluate(()=>{const original=IDBObjectStore.prototype.put;(window as any).failRemove=true;IDBObjectStore.prototype.put=function(...args){if(this.name==='characters'&&(window as any).failRemove)throw Error('Kunne ikke fjerne');return original.apply(this,args);};});await confirm.getByRole('button',{name:'Fjern utstyr',exact:true}).click();await expect(confirm.getByRole('alert')).toHaveText('Kunne ikke fjerne');await expect(confirm.locator('form')).not.toHaveAttribute('aria-busy','true');await expect(row).toHaveCount(1);await page.evaluate(()=>(window as any).failRemove=false);await confirm.getByRole('button',{name:'Fjern utstyr',exact:true}).click();await expect(row).toHaveCount(0);
 await undoStock(page);await expect(row).toHaveCount(1);await expect(row.locator('[data-total]')).toHaveText('0');
});


test('Combat hides zero stock only on a new opening, while equipment keeps it for refill',async({page})=>{
 await createCharacter(page);await equipmentTab(page);await open(page);await add(page,'Arrows','3');await add(page,'Torch','0');
 await expect(stock(page).locator('[data-consumable]')).toHaveCount(2);await stock(page).getByRole('button',{name:'OK',exact:true}).click();await page.getByRole('button',{name:'Combat',exact:true}).click();await open(page);
 const rows=stock(page).locator('[data-consumable]');await expect(rows).toHaveCount(1);await expect(rows).toContainText('Arrows');
 const minus=stock(page).getByRole('button',{name:'Bruk én Arrows',exact:true});await minus.click();await expect(rows.locator('[data-total]')).toHaveText('2');await minus.click();await expect(rows.locator('[data-total]')).toHaveText('1');await minus.click();await expect(rows.locator('[data-total]')).toHaveText('0');await expect(minus).toBeDisabled();await expect(rows).toHaveCount(1);
 await stock(page).getByRole('button',{name:'OK',exact:true}).click();await open(page);await expect(rows).toHaveCount(0);await stock(page).getByRole('button',{name:'OK',exact:true}).click();await equipmentTab(page);await open(page);await expect(rows).toHaveCount(2);
 await stock(page).getByRole('button',{name:'Legg til én Arrows',exact:true}).click();await expect(rows.first().locator('[data-total]')).toHaveText('1');await stock(page).getByRole('button',{name:'OK',exact:true}).click();await page.getByRole('button',{name:'Combat',exact:true}).click();await open(page);await expect(rows).toHaveCount(1);await expect(rows).toContainText('Arrows');
});
