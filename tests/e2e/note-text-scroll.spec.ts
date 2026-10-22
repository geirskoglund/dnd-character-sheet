import {test,expect,type Locator} from '@playwright/test';
import {createCharacter,fillField,finish,closeEditor,equipmentTab,menuAction} from './helpers';

test.use({hasTouch:true});
const longText='Dette er en\ntekst som\ngodtar linjeskift\n\n\n'+
  Array.from({length:18},(_,i)=>`Avsnitt ${i+1}: Vi følger elven gjennom skogen og skriver ned det vi oppdager. `.repeat(2)).join('\n\n')+'\n\nSiste linje i notatet.';
async function fullText(field:Locator){
  await expect.poll(()=>field.evaluate(el=>el.scrollHeight-el.clientHeight)).toBeLessThanOrEqual(1);
  expect(await field.evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(1);
}

test('all note text scrolls in the caller between fixed heading and actions, including wrapped lines',async({page})=>{
  await createCharacter(page);await page.getByRole('button',{name:'Legg til notat',exact:true}).click();
  await fillField(page,'Tittel','Reisenotat');await fillField(page,'Tekst',longText);
  const d=page.locator('dialog:not(.text-editor)'),text=d.getByRole('textbox',{name:'Tekst',exact:true}),body=d.locator('#dialog-body');
  for(const width of [390,320])for(const font of ['100%','200%']){
    await page.setViewportSize({width,height:568});await page.evaluate(font=>document.documentElement.style.fontSize=font,font);
    await fullText(text);await expect(text).toHaveValue(longText);
    await body.evaluate(el=>el.scrollTop=0);
    const heading=await d.locator('.dialog-heading').boundingBox(),actions=await d.locator('.dialog-actions').boundingBox();
    expect(heading!.y).toBeGreaterThanOrEqual(0);expect(actions!.y+actions!.height).toBeLessThanOrEqual(569);
    expect(await body.evaluate(el=>el.scrollHeight>el.clientHeight)).toBe(true);
    await body.hover();await page.mouse.wheel(0,20000);
    await expect.poll(()=>body.evaluate(el=>el.scrollHeight-el.clientHeight-el.scrollTop)).toBeLessThanOrEqual(1);
    expect(await d.locator('.dialog-heading').boundingBox()).toEqual(heading);
    expect(await d.locator('.dialog-actions').boundingBox()).toEqual(actions);
    expect(await text.evaluate(el=>el.scrollTop)).toBe(0);
  }
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>document.documentElement.style.fontSize='100%');
  await finish(page);await expect(d).not.toBeVisible();await page.reload();await page.getByRole('button',{name:'Reisenotat',exact:true}).click();
  await expect(text).toHaveValue(longText);await fullText(text);
  await text.click();const editor=page.locator('.text-editor');await editor.locator('textarea').fill('Skal forkastes');
  await editor.getByRole('button',{name:'Avbryt',exact:true}).click();await expect(text).toHaveValue(longText);await fullText(text);
  await text.click();await editor.locator('textarea').fill('Kort tekst');await editor.getByRole('button',{name:'OK',exact:true}).click();
  await fullText(text);expect((await text.boundingBox())!.height).toBeLessThan(100);
});

test('multiline editor has one footer separator and full text also returns to a wizard question',async({page})=>{
  await createCharacter(page);await equipmentTab(page);await page.getByRole('button',{name:'Legg til weapons',exact:true}).click();
  await page.getByRole('button',{name:'Tilpass Longsword',exact:true}).click();await fillField(page,'Navn på utstyr','Solglimt');
  const d=page.locator('dialog:not(.text-editor)');await d.getByRole('button',{name:'Neste',exact:true}).click();
  await d.getByRole('button',{name:'+ Legg til virkning',exact:true}).click();await d.getByRole('button',{name:'Skadebonus',exact:true}).click();
  await fillField(page,'Skadebonus','3');await d.getByRole('button',{name:'Neste',exact:true}).click();await d.getByRole('button',{name:'Ja',exact:true}).click();
  const condition=d.getByRole('textbox',{name:'Betingelse',exact:true});await condition.click();const editor=page.locator('dialog.text-editor');
  const textarea=editor.locator('textarea');await textarea.fill(longText.slice(0,900));
  expect(await textarea.evaluate(el=>getComputedStyle(el).borderBottomWidth)).toBe('0px');
  expect(await editor.locator('.dialog-actions').evaluate(el=>getComputedStyle(el).borderTopWidth)).toBe('1px');
  await editor.getByRole('button',{name:'OK',exact:true}).click();await fullText(condition);
  await d.getByRole('button',{name:'Tilbake',exact:true}).click();await d.getByRole('button',{name:'Ja',exact:true}).click();
  await expect(condition).toHaveValue(longText.slice(0,900));await fullText(condition);await closeEditor(page);
});

test('a resumed description sizes to restored draft text',async({page})=>{
  await createCharacter(page);await page.getByRole('button',{name:'Legg til egenskap eller feat',exact:true}).click();
  await page.getByRole('button',{name:'Opprett egen egenskap / feat',exact:true}).click();
  await fillField(page,'Navn','Avtale med DM');await fillField(page,'Beskrivelse (valgfritt)',longText);
  await closeEditor(page);await page.reload();await menuAction(page,'Avtale med DM Utkast · Fortsett');
  const description=page.getByRole('textbox',{name:'Beskrivelse (valgfritt)',exact:true});
  await expect(description).toHaveValue(longText);await fullText(description);
});

test('opening a note from a scrolled page anchors the popup and locks the page through nested editing',async({page})=>{
  await createCharacter(page);await page.getByRole('button',{name:'Legg til notat',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Nytt notat',exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Slett notat',exact:true})).toHaveCount(0);
  await fillField(page,'Tittel','Nederst på siden');await fillField(page,'Tekst',longText);await finish(page);
  const d=page.locator('dialog:not(.text-editor)'),note=page.getByRole('button',{name:'Nederst på siden',exact:true});
  await expect(d).not.toBeVisible();await note.scrollIntoViewIfNeeded();const returnY=await page.evaluate(()=>scrollY);
  expect(returnY).toBeGreaterThan(300);await note.tap();
  await expect(d.getByRole('heading',{name:'Notat',exact:true})).toBeVisible();
  const lockedY=await page.evaluate(()=>scrollY),bounds=await d.boundingBox();
  expect(bounds!.y).toBe(0);expect(bounds!.height).toBe(844);
  const heading=d.locator('.dialog-heading'),footer=d.locator('.dialog-actions'),body=d.locator('#dialog-body');
  const background=await page.locator('.character-header').boundingBox();
  for(const target of [heading,footer]){
    await target.hover();await page.mouse.wheel(0,-2000);
    await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(lockedY);
    expect(await page.locator('.character-header').boundingBox()).toEqual(background);
  }
  expect(await d.evaluate(el=>getComputedStyle(el).position)).toBe('fixed');
  const remove=footer.getByRole('button',{name:'Slett notat',exact:true}),save=footer.getByRole('button',{name:'Lagre',exact:true});
  await expect(remove).toHaveText('');await expect(remove.locator('[data-icon="trash"]')).toHaveCount(1);
  for(const width of [390,320])for(const font of ['100%','200%']){
    await page.setViewportSize({width,height:568});await page.evaluate(font=>document.documentElement.style.fontSize=font,font);
    const before=(await remove.boundingBox())!,saveBox=(await save.boundingBox())!;
    expect(before.width).toBe(48);expect(before.height).toBe(48);
    expect(before.x+before.width).toBeLessThan(saveBox.x);expect(saveBox.width).toBeGreaterThan(before.width*2);
    expect(before.y).toBeGreaterThanOrEqual(0);expect(before.y+before.height).toBeLessThanOrEqual(568);
    await body.evaluate(el=>el.scrollTop=el.scrollHeight);
    expect(await remove.boundingBox()).toEqual(before);
  }
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>document.documentElement.style.fontSize='100%');
  // Both nested text dismissal and a declined deletion must keep the caller's lock.
  const text=d.getByRole('textbox',{name:'Tekst',exact:true});await text.click();
  await page.locator('.text-editor').getByRole('button',{name:'Avbryt',exact:true}).tap();
  expect(await page.evaluate(()=>document.body.style.position)).toBe('fixed');
  await body.evaluate(el=>el.scrollTop=el.scrollHeight);const scroll=await body.evaluate(el=>el.scrollTop);
  await d.getByRole('button',{name:'Slett notat',exact:true}).click();await d.getByRole('button',{name:'Avbryt',exact:true}).click();
  expect(await body.evaluate(el=>el.scrollTop)).toBe(scroll);
  expect(await page.evaluate(()=>document.body.style.position)).toBe('fixed');
  await d.getByRole('button',{name:'Avbryt',exact:true}).tap();await expect(d).not.toBeVisible();
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(returnY);await expect(note).toBeFocused();
  expect(await page.evaluate(()=>document.body.style.position)).toBe('');
  // Reopening can scroll the opener into view again after the viewport/font changes above.
  await note.evaluate(el=>el.addEventListener('pointerdown',()=>el.dataset.openScroll=String(window.scrollY),{once:true}));
  await note.tap();const saveReturnY=Number(await note.getAttribute('data-open-scroll'));
  await fillField(page,'Tekst',longText+'\nBekreftet.');await finish(page);await expect(d).not.toBeVisible();
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(saveReturnY);await expect(note).toBeFocused();
});
