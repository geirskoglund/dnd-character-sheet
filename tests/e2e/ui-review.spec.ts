import {test,expect,type Page} from '@playwright/test';
import {menuAction,fillField,choose,revealField,createCharacter,equipmentTab,closeEditor} from './helpers';
test.use({reducedMotion:'reduce'});
const caller=(p:Page)=>p.locator('dialog:not(.text-editor):not(.number-change-dialog)');
const next=(p:Page)=>caller(p).getByRole('button',{name:'Neste',exact:true});
const back=(p:Page)=>caller(p).getByRole('button',{name:'Tilbake',exact:true});

test('WP05/06: default None, answered Back, and resumed answers all have Next; new choices stay direct',async({page})=>{
 await page.goto('./');await menuAction(page,'Ny karakter');await fillField(page,'Navn','Jones');await next(page).click();
 await expect(caller(page).locator('[data-wizard-active] [aria-pressed=true]')).toHaveCount(0);await expect(next(page)).not.toBeVisible();
 await caller(page).getByRole('button',{name:'Dragonborn',exact:true}).click();await caller(page).getByRole('button',{name:'Rogue',exact:true}).click();
 await expect(page.locator('#wizard-question')).toContainText('subclass');await expect(caller(page).getByRole('button',{name:'Ingen / ikke valgt',exact:true})).toHaveAttribute('aria-pressed','true');await expect(next(page)).toBeEnabled();
 await next(page).click();await expect(page.locator('#wizard-question')).toContainText('klassenivå');await fillField(page,'Klassenivå','3');await back(page).click();await expect(next(page)).toBeEnabled();
 await caller(page).getByRole('button',{name:'Thief',exact:true}).click();await expect(page.locator('#wizard-question')).toContainText('klassenivå');await back(page).click();
 await expect(caller(page).getByRole('button',{name:'Thief',exact:true})).toHaveAttribute('aria-pressed','true');await expect(next(page)).toBeEnabled();
 await caller(page).getByRole('button',{name:'Lukk veiviseren',exact:true}).click();await expect(caller(page)).not.toBeVisible();await page.reload();await menuAction(page,'Jones Utkast · Fortsett');
 await expect(caller(page).getByRole('button',{name:'Thief',exact:true})).toHaveAttribute('aria-pressed','true');await expect(next(page)).toBeEnabled();await next(page).click();
 await back(page).click();await back(page).click();await expect(caller(page).getByRole('button',{name:'Rogue',exact:true})).toHaveAttribute('aria-pressed','true');await expect(next(page)).toBeVisible();
});

test('WP02/08: centered labelled Combat-style numbers, corner cue and compact class actions at different heights',async({page})=>{
 await createCharacter(page);await page.getByRole('button',{name:'Combat',exact:true}).click();
 const combat=await page.locator('.combat-health > button').first().evaluate(el=>({border:getComputedStyle(el).borderColor,radius:getComputedStyle(el).borderRadius}));
 await menuAction(page,'Rediger karakter');await revealField(page,'Klassenivå');
 for(const classes of [1,2]){
  if(classes===2){await caller(page).locator('#add-class').click();await choose(page,'Klasse',{label:'Rogue'},1);await next(page).click();}
  const value=caller(page).getByRole('spinbutton',{name:'Klassenivå',exact:true}).filter({visible:true}),pill=caller(page).locator('.number-pill').filter({visible:true});
  const heights:number[]=[];
  for(const width of [390,320])for(const height of [844,568])for(const font of ['100%','200%']){
   await page.setViewportSize({width,height});await page.evaluate(font=>document.documentElement.style.fontSize=font,font);
   const frame=await pill.evaluate(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect(),body=document.querySelector('#dialog-body')!.getBoundingClientRect();return {border:s.borderColor,radius:s.borderRadius,center:r.x+r.width/2,bodyCenter:body.x+body.width/2,corner:getComputedStyle(el,'::after').content,background:s.backgroundImage,height:r.height};});
   expect(frame.border).toBe(combat.border);expect(frame.radius).toBe(combat.radius);expect(Math.abs(frame.center-frame.bodyCenter)).toBeLessThan(2);expect(frame.corner).not.toBe('none');expect(frame.background).toBe('none');expect(Math.round(frame.height)).toBeGreaterThanOrEqual(112);
   await expect(pill.locator('small')).toHaveText('Klassenivå');
   const add=caller(page).locator('#add-class'),box=(await add.boundingBox())!;expect(box.height).toBeGreaterThanOrEqual(44);expect(box.height).toBeLessThan(font==='100%'?65:100);expect(box.width).toBeLessThan(width-50);if(font==='100%')heights.push(box.height);
   if(classes===2){const remove=caller(page).locator('[data-remove-class]').filter({visible:true});expect((await remove.boundingBox())!.height).toBeLessThan(100);}
  }
  expect(Math.max(...heights)-Math.min(...heights)).toBeLessThan(2);
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>document.documentElement.style.fontSize='100%');
  await pill.locator('small').click();await expect(page.locator('dialog.number-change-dialog')).toBeVisible();await page.locator('dialog.number-change-dialog').getByRole('button',{name:'Avbryt',exact:true}).click();await expect(value).toHaveValue('1');
 }
});

test('WP05/06 across equipment: existing dice, conditional answers and defaults can continue with Next',async({page})=>{
 await createCharacter(page);await equipmentTab(page);await page.getByRole('button',{name:'Legg til weapons',exact:true}).click();await page.getByRole('button',{name:'Tilpass Longsword',exact:true}).click();await next(page).click();
 await caller(page).getByRole('button',{name:'+ Legg til virkning',exact:true}).click();await caller(page).getByRole('button',{name:'Strength',exact:true}).click();
 await expect(caller(page).getByRole('button',{name:'Øk eller reduser med',exact:true})).toHaveAttribute('aria-pressed','true');await expect(next(page)).toBeEnabled();await next(page).click();await expect(page.locator('#wizard-question')).toHaveText('Hva er bidraget?');
 await caller(page).getByRole('button',{name:'Avbryt denne virkningen',exact:true}).click();await caller(page).getByRole('button',{name:'+ Legg til virkning',exact:true}).click();await caller(page).getByRole('button',{name:'Ekstraskade',exact:true}).click();await expect(next(page)).not.toBeVisible();
 await caller(page).getByRole('button',{name:'d6',exact:true}).click();await back(page).click();await expect(caller(page).getByRole('button',{name:'d6',exact:true})).toHaveAttribute('aria-pressed','true');await next(page).click();await expect(page.locator('#wizard-question')).toHaveText('Hvor mange d6?');
 await next(page).click();await caller(page).getByRole('button',{name:'Fire',exact:true}).click();await caller(page).getByRole('button',{name:'Ja',exact:true}).click();await fillField(page,'Betingelse','Mot udøde');await back(page).click();
 await expect(caller(page).getByRole('button',{name:'Ja',exact:true})).toHaveAttribute('aria-pressed','true');await next(page).click();await expect(caller(page).getByRole('textbox',{name:'Betingelse',exact:true})).toHaveValue('Mot udøde');
});

test('text options: title, manual expression and multiline note use their own limits, including paste and IME',async({page,context})=>{
 await createCharacter(page);await page.getByRole('button',{name:'Legg til notat',exact:true}).click();
 await caller(page).getByRole('textbox',{name:'Tittel',exact:true}).click();const editor=page.locator('dialog.text-editor');
 await expect(editor.locator('input')).toHaveAttribute('maxlength','100');await expect(editor.locator('textarea')).toHaveCount(0);
 await editor.locator('input').fill('A'.repeat(110));await expect(editor.locator('input')).toHaveValue('A'.repeat(100));await editor.getByRole('button',{name:'Avbryt',exact:true}).click();await expect(caller(page).getByRole('textbox',{name:'Tittel',exact:true})).toHaveValue('');
 await caller(page).getByRole('textbox',{name:'Tekst',exact:true}).click();await expect(editor.locator('textarea')).toHaveAttribute('maxlength','10000');
 const origin=new URL(page.url()).origin;await context.grantPermissions(['clipboard-read','clipboard-write'],{origin});const note=('Linje én\nLinje to\n'+'B'.repeat(10000));await page.evaluate(note=>navigator.clipboard.writeText(note),note);await editor.locator('textarea').press('ControlOrMeta+V');await expect(editor.locator('textarea')).toHaveValue(note.slice(0,10000));
 await editor.getByRole('button',{name:'OK',exact:true}).click();await expect(caller(page).getByRole('textbox',{name:'Tekst',exact:true})).toHaveValue(note.slice(0,10000));await closeEditor(page);
 await equipmentTab(page);await page.getByRole('button',{name:'Legg til weapons',exact:true}).click();await page.getByRole('button',{name:'Tilpass Longsword',exact:true}).click();await next(page).click();await caller(page).getByRole('button',{name:'Merknad og attunement',exact:true}).click();await caller(page).getByRole('button',{name:'Manuelle totaler (DM)',exact:true}).click();await caller(page).getByRole('button',{name:'Attack (manuell total)',exact:true}).click();
 await caller(page).getByRole('textbox',{name:'Attack (manuell total)',exact:true}).click();const input=editor.locator('input');await expect(input).toHaveAttribute('maxlength','1000');
 await page.evaluate(()=>navigator.clipboard.writeText('A\nB'+'C'.repeat(1100)));await input.press('ControlOrMeta+V');expect((await input.inputValue()).includes('\n')).toBe(false);expect((await input.inputValue()).length).toBe(1000);
 // A native composition can temporarily exceed a limit; constrain at compositionend, not mid-composition.
 await input.evaluate(el=>{el.dispatchEvent(new CompositionEvent('compositionstart'));el.value='字'.repeat(1005);el.dispatchEvent(new InputEvent('input',{isComposing:true,bubbles:true}));});await expect(input).toHaveValue('字'.repeat(1005));await input.dispatchEvent('compositionend');await expect(input).toHaveValue('字'.repeat(1000));
 await editor.getByRole('button',{name:'Avbryt tekstredigering',exact:true}).click();await expect(caller(page).getByRole('textbox',{name:'Attack (manuell total)',exact:true})).toHaveValue('');
 const legacy=caller(page).getByRole('textbox',{name:'Attack (manuell total)',exact:true});await legacy.evaluate(el=>el.value='K'.repeat(1005));await legacy.click();await expect(editor.locator('input')).toHaveValue('K'.repeat(1005));await editor.getByRole('button',{name:'OK',exact:true}).click();await expect(legacy).toHaveValue('K'.repeat(1005));
});
