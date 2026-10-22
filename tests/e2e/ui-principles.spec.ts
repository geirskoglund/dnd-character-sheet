import {test,expect,type Page} from '@playwright/test';
import {menuAction,createCharacter,fillField,choose,revealField,finish,equipmentTab,closeEditor} from './helpers';
test.use({hasTouch:true});
const editor=(p:Page)=>p.locator('dialog.text-editor');
const caller=(p:Page)=>p.locator('dialog:not(.text-editor):not(.number-change-dialog)');
async function enter(p:Page,text:string){await editor(p).locator('input,textarea').fill(text);}
async function dismiss(p:Page,name:string){await editor(p).getByRole('button',{name,exact:true}).click();await expect(editor(p)).toHaveCount(0);}

test('WP01 GP02–05/09: name validation, placeholder, staged OK and three discard paths',async({page})=>{
 await page.goto('./');await menuAction(page,'Ny karakter');
 const name=caller(page).getByRole('textbox',{name:'Navn',exact:true}),next=caller(page).getByRole('button',{name:'Neste',exact:true});
 await expect(name).toHaveAttribute('placeholder','Karakterens navn');await expect(next).toBeDisabled();
 for(const action of ['Avbryt','Avbryt tekstredigering','Escape']){
  await name.click();await expect(page.locator('dialog[open]')).toHaveCount(2);await enter(page,'Skal forkastes');
  if(action==='Escape'){await page.keyboard.press('Escape');await expect(editor(page)).toHaveCount(0);}else await dismiss(page,action);
  await expect(name).toHaveValue('');await expect(next).toBeDisabled();await expect(caller(page)).toBeVisible();
 }
 await name.click();await expect(editor(page).locator('input')).toHaveAttribute('maxlength','100');await enter(page,'Alva');await dismiss(page,'OK');await expect(next).toBeEnabled();
 await name.pressSequentially('lekkasje');await expect(name).toHaveValue('Alva');
 await fillField(page,'Navn','');await expect(next).toBeDisabled();await fillField(page,'Navn','   ');await expect(next).toBeDisabled();
 await fillField(page,'Navn','Alva');await next.click();
 await expect(caller(page).locator('[data-wizard-active] [aria-pressed=true]')).toHaveCount(0);
 await caller(page).getByRole('button',{name:'Elf',exact:true}).click();await expect(page.locator('#wizard-question')).toContainText('klasse');
 await caller(page).getByRole('button',{name:'Tilbake',exact:true}).click();await expect(caller(page).getByRole('button',{name:'Elf',exact:true})).toHaveAttribute('aria-pressed','true');
 await caller(page).getByRole('button',{name:'Elf',exact:true}).click();await caller(page).getByRole('button',{name:'Fighter',exact:true}).click();
 const level=await revealField(page,'Klassenivå');await level.click();await expect(page.locator('dialog.number-change-dialog')).toBeVisible();
 await page.locator('dialog.number-change-dialog').getByRole('button',{name:'Avbryt',exact:true}).click();await expect(level).toHaveValue('1');
 await expect(caller(page).getByRole('button',{name:/Fjern verdi/})).toHaveCount(0);
 const hp=await revealField(page,'Maks HP fra karakterarket');await expect(caller(page).locator('#submit')).toBeDisabled();await hp.click();await page.locator('dialog.number-change-dialog').getByRole('button',{name:'Avbryt',exact:true}).click();await expect(hp).toHaveValue('');await fillField(page,'Maks HP fra karakterarket','12');await expect(caller(page).locator('#submit')).toBeEnabled();
 await expect(level).toHaveClass(/number-value/);expect(await level.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('none');
});

test('GP01/04/05/09: long multiline notes preserve caller nodes, fields, storage, escaping and undo',async({page})=>{
 await createCharacter(page);await page.getByRole('button',{name:'Legg til notat',exact:true}).click();await fillField(page,'Tittel','Reisedagbok');
 const text=caller(page).getByRole('textbox',{name:'Tekst',exact:true});
 await text.evaluate(el=>(window as any).originalNoteField=el);
 const body='<img src=x onerror=alert(1)>\nAndre linje\n'+('Langt notat ved spillebordet. '.repeat(80));
 await text.click();await enter(page,body);await dismiss(page,'Avbryt');await expect(text).toHaveValue('');
 await text.click();await enter(page,body);await dismiss(page,'OK');await expect(text).toHaveValue(body);await expect(caller(page).getByRole('textbox',{name:'Tittel',exact:true})).toHaveValue('Reisedagbok');
 expect(await text.evaluate(el=>el===(window as any).originalNoteField)).toBe(true);await finish(page);await expect(caller(page)).not.toBeVisible();await page.reload();
 await page.getByRole('button',{name:'Reisedagbok',exact:true}).click();await expect(text).toHaveValue(body);await expect(page.locator('dialog img[src=x]')).toHaveCount(0);
 await text.click();await enter(page,'Endret');await dismiss(page,'OK');await finish(page);await menuAction(page,'Angre siste endring');
 await page.getByRole('button',{name:'Reisedagbok',exact:true}).click();await expect(text).toHaveValue(body);
});

test('GP05/06/09 WP01: unfinished equipment keeps answers, step and draft when text is discarded',async({page})=>{
 await createCharacter(page);await equipmentTab(page);await page.getByRole('button',{name:'Legg til weapons',exact:true}).click();await page.getByRole('button',{name:'Tilpass Longsword',exact:true}).click();
 await fillField(page,'Navn på utstyr','Solglimt');await caller(page).getByRole('button',{name:'Neste',exact:true}).click();
 await caller(page).getByRole('button',{name:'+ Legg til virkning',exact:true}).click();await caller(page).getByRole('button',{name:'Skadebonus',exact:true}).click();await fillField(page,'Skadebonus','3');await caller(page).getByRole('button',{name:'Neste',exact:true}).click();await caller(page).getByRole('button',{name:'Ja',exact:true}).click();
 const condition=caller(page).getByRole('textbox',{name:'Betingelse',exact:true});const question=await page.locator('#wizard-question').innerText();
 await expect(caller(page).getByRole('button',{name:'Neste',exact:true})).toBeDisabled();await condition.click();await enter(page,'Mot udøde');await dismiss(page,'OK');
 await condition.click();await enter(page,'Forkastet');await dismiss(page,'Avbryt tekstredigering');await expect(condition).toHaveValue('Mot udøde');await expect(page.locator('#wizard-question')).toHaveText(question);
 await caller(page).getByRole('button',{name:'Lukk veiviseren',exact:true}).click();await page.reload();await equipmentTab(page);await page.getByRole('region',{name:'Utstyrsutkast'}).getByRole('button').click();
 await expect(condition).toHaveValue('Mot udøde');await caller(page).getByRole('button',{name:'Neste',exact:true}).click();await finish(page);await expect(page.getByRole('button',{name:/^Solglimt ·/})).toBeVisible();
});

test('GP08: libraries and equipment search never autofocus and direct typing keeps focus',async({page})=>{
 await createCharacter(page);
 for(const kind of ['library','equipment'])for(let repeat=0;repeat<2;repeat++){
  if(kind==='equipment'){await equipmentTab(page);await page.getByRole('button',{name:'Legg til weapons',exact:true}).click();}
  else {await page.getByRole('button',{name:'Character',exact:true}).click();await page.getByRole('button',{name:'Legg til egenskap eller feat',exact:true}).click();}
  const search=caller(page).getByRole('searchbox');await expect(search).not.toBeFocused();await search.click();await search.pressSequentially(kind==='equipment'?'sword':'Wind');await expect(search).toBeFocused();await expect(editor(page)).toHaveCount(0);await closeEditor(page);
 }
});

test('GP01/07: editor frame follows viewport without losing caret, text or first-click actions',async({page})=>{
 await createCharacter(page);await page.getByRole('button',{name:'Legg til notat',exact:true}).click();
 const text=caller(page).getByRole('textbox',{name:'Tekst',exact:true});await text.click();await enter(page,'Linje én\n'+('Lange notater.\n'.repeat(100)));
 await editor(page).locator('textarea').evaluate(el=>{el.selectionStart=7;el.selectionEnd=7;el.scrollTop=120;});
 for(const width of [390,320])for(const font of ['100%','200%']){
  await page.setViewportSize({width,height:360});await page.evaluate(font=>document.documentElement.style.fontSize=font,font);
  const e=editor(page);await expect(e).toBeVisible();
  for(const action of ['OK','Avbryt','Avbryt tekstredigering']){
   const button=e.getByRole('button',{name:action,exact:true}),box=(await button.boundingBox())!;expect(box.y).toBeGreaterThanOrEqual(0);expect(box.y+box.height).toBeLessThanOrEqual(361);
   await button.focus();expect(await button.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('none');
  }
  expect(await e.locator('textarea').evaluate(el=>el.selectionStart)).toBe(7);expect(await e.locator('textarea').evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
  expect(await e.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
 }
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>document.documentElement.style.fontSize='100%');await dismiss(page,'OK');await expect(text).toHaveValue(/^Linje én\n/);
 await text.click();await enter(page,'Forkast');await editor(page).getByRole('button',{name:'Avbryt',exact:true}).tap();await expect(editor(page)).toHaveCount(0);await expect(text).toHaveValue(/^Linje én\n/);
});
