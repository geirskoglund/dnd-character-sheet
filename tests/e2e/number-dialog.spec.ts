import {typeWheelText} from './helpers';
import {test,expect} from '@playwright/test';
import {createCharacter,menuAction,revealField} from './helpers';

test('P01–P08/P11–P15 K3–K9: nested edits keep the caller and commit on the first click',async({page})=>{
 await createCharacter(page);await menuAction(page,'Rediger karakter');
 const field=await revealField(page,'Maks HP fra karakterarket');
 await field.click();
 const d=page.locator('dialog.number-change-dialog');
 await expect(d.getByRole('heading',{name:'Endre Maks HP fra karakterarket',exact:true})).toBeVisible();
 await expect(d.locator('[data-wheel-value]').first()).toHaveText('0');
 await expect(page.locator('dialog[open]')).toHaveCount(2);
 await d.locator('[data-wheel-value]').first().click();
 await typeWheelText(page,'Endring','6');
 await d.getByRole('button',{name:'OK',exact:true}).click();
 await expect(d).toHaveCount(0);await expect(field).toHaveValue('18');
 await field.click();await expect(d.locator('[data-wheel-value]').first()).toHaveText('0');
 await d.locator('[data-wheel-value]').first().click();await typeWheelText(page,'Endring','-999');
 await d.getByRole('heading').click();await expect(d.locator('.number-after')).toContainText('1');
 await d.getByRole('button',{name:'Avbryt',exact:true}).click();await expect(field).toHaveValue('18');
 await field.click();await d.getByRole('button',{name:'Avbryt endring',exact:true}).click();await expect(field).toHaveValue('18');
});

test('P09/P10/P16: GP uses two signed delta wheels and exact CP storage',async({page})=>{
 await createCharacter(page);await page.locator('[data-action="money"]').click();
 const d=page.locator('dialog.number-change-dialog');
 async function enter(name:string,text:string){await d.getByRole('button',{name:`Skriv inn ${name}`,exact:true}).click();await typeWheelText(page,name,text);await d.getByRole('heading').click();}
 await enter('GP','10');await enter('CP','-20');
 await expect(d.locator('.number-after')).toContainText('9,80');
 await d.getByRole('button',{name:'OK',exact:true}).click();await expect(d).toHaveCount(0);
 await page.locator('[data-action="money"]').click();
 await expect(d.locator('.number-before')).toContainText('9,80');
 await enter('GP','-10');await expect(d.locator('.number-after')).toContainText('0,00');
 await d.getByRole('button',{name:'OK',exact:true}).click();
 await page.locator('[data-action="money"]').click();await expect(d.locator('.number-before')).toContainText('0,00');
});

test('P03/P07/P10 K4–K7: the same basis, no product maximum, valid signed entry and late scroll events',async({page})=>{
 await createCharacter(page);await menuAction(page,'Rediger karakter');
 const field=await revealField(page,'Maks HP fra karakterarket');
 await field.click();let d=page.locator('.number-change-dialog');
 await d.getByRole('button',{name:'Skriv inn Endring',exact:true}).click();
 await typeWheelText(page,'Endring','10');
 await d.getByRole('button',{name:'OK',exact:true}).click();await expect(field).toHaveValue('22');
 await field.click();await d.getByRole('button',{name:'Skriv inn Endring',exact:true}).click();
 const input=d.getByRole('textbox',{name:'Endring',exact:true});
 for(const invalid of ['1.5','1,5','1e3','-']){
  await typeWheelText(page,(await input.getAttribute('aria-label'))!,invalid);await d.getByRole('heading').click();await expect(d.getByRole('alert')).toContainText('heltall');await expect(input).toBeVisible();
 }
 await typeWheelText(page,(await input.getAttribute('aria-label'))!,'-1000');
 // A dispatched click has no browser focus/blur default action: this tests the explicit outside path.
 await d.locator('.number-help').dispatchEvent('click');await expect(input).toBeHidden();await expect(d.locator('.number-after b')).toHaveText('1');
 await d.getByRole('button',{name:'Skriv inn Endring',exact:true}).click();await typeWheelText(page,(await input.getAttribute('aria-label'))!,'+6');await d.getByRole('heading').click();
 await expect(d.locator('.number-before b')).toHaveText('22');await expect(d.locator('.number-after b')).toHaveText('28');
 await d.getByRole('spinbutton').evaluate(el=>{el.scrollTop+=44;el.dispatchEvent(new Event('scroll'));});
 await expect(d.locator('.number-after b')).toHaveText('28');
 await d.getByRole('button',{name:'Skriv inn Endring',exact:true}).click();await typeWheelText(page,(await input.getAttribute('aria-label'))!,'2000000000');
 await d.getByRole('button',{name:'OK',exact:true}).click();await expect(field).toHaveValue('2000000022');
 // The sheet still has the original confirmed HP; this only edited the unfinished form.
 await page.keyboard.press('Escape');
 await expect(page.locator('.stats')).toContainText('12 / 12');
});

test('P08/P16 K5/K8: explicit negative lower bound and upper bound are result limits',async({page})=>{
 await createCharacter(page);await menuAction(page,'Rediger karakter');
 const field=await revealField(page,'Klassenivå');await field.click();
 const d=page.locator('.number-change-dialog');
 await d.getByRole('button',{name:'Skriv inn Endring',exact:true}).click();
 await typeWheelText(page,'Endring','100');
 await d.getByRole('button',{name:'OK',exact:true}).click();await expect(field).toHaveValue('20');
 await field.click();await d.getByRole('button',{name:'Skriv inn Endring',exact:true}).click();await typeWheelText(page,'Endring','-500');
 await d.getByRole('button',{name:'Avbryt',exact:true}).click();await expect(field).toHaveValue('20');
 await field.click();await d.getByRole('button',{name:'Skriv inn Endring',exact:true}).click();await typeWheelText(page,'Endring','-500');
 await d.getByRole('button',{name:'Avbryt endring',exact:true}).click();await expect(field).toHaveValue('20');
});

test('P09/P10 K3/K4: both decimal wheels accept signed integers, endpoints and sign control',async({page})=>{
 await createCharacter(page);await page.locator('[data-action="money"]').click();
 const d=page.locator('.number-change-dialog');
 await d.getByRole('button',{name:'Skriv inn GP',exact:true}).click();await typeWheelText(page,'GP','10');await d.getByRole('heading').click();
 const fraction=d.getByRole('spinbutton',{name:'Tallhjul: CP',exact:true});
 await fraction.focus();await page.keyboard.press('Home');await expect(fraction).toHaveAttribute('aria-valuenow','-99');
 await page.keyboard.press('End');await expect(fraction).toHaveAttribute('aria-valuenow','99');
 await d.getByRole('button',{name:'Skriv inn CP',exact:true}).click();await typeWheelText(page,'CP','20');
 await d.getByRole('button',{name:'Bytt fortegn',exact:true}).click();await d.getByRole('heading').click();
 await expect(fraction).toHaveAttribute('aria-valuenow','-20');await expect(d.locator('.number-after b')).toHaveText('9,80');
 await d.getByRole('button',{name:'OK',exact:true}).click();
});

test('P08/P14/P15: signed optional overrides and their removal stay in the caller until Save',async({page})=>{
 await createCharacter(page);await menuAction(page,'Beregninger og overstyringer');
 const field=page.getByRole('spinbutton',{name:'Manuell Initiative (valgfritt)',exact:true});await field.click();
 const d=page.locator('.number-change-dialog');
 await expect(d.locator('[data-icon="emblem"]').filter({visible:true})).toHaveCount(1);
 await d.getByRole('button',{name:'Skriv inn Endring',exact:true}).click();await typeWheelText(page,'Endring','-5');
 await d.getByRole('button',{name:'OK',exact:true}).click();await expect(field).toHaveValue('-5');
 await page.getByRole('button',{name:'Fjern Manuell Initiative (valgfritt)',exact:true}).click();await expect(field).toHaveValue('');
 await page.keyboard.press('Escape');
});

test('P01/K6: integer and decimal controls fit narrow/large-text/short keyboard-sized viewports',async({page})=>{
 await createCharacter(page);await page.locator('[data-action="money"]').click();
 const d=page.locator('.number-change-dialog');
 for(const width of [320,390])for(const height of [568,350])for(const fontSize of ['100%','200%']){
  await page.setViewportSize({width,height});await page.evaluate(size=>document.documentElement.style.fontSize=size,fontSize);
  await expect(d.getByRole('button',{name:'OK',exact:true})).toBeInViewport();
  await expect.poll(async()=>{const boxes=await d.locator('[data-wheel-value]').evaluateAll(els=>els.map(e=>e.getBoundingClientRect().y));return Math.abs(boxes[0]-boxes[1]);}).toBeLessThanOrEqual(1);
  expect(await d.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  const box=await d.boundingBox();expect(box!.width).toBe(width);expect(Math.round(box!.height)).toBe(height);
  if(width===390&&height===568&&fontSize==='100%')await page.screenshot({path:test.info().outputPath('money-390.png')});
  if(width===320&&height===568&&fontSize==='200%')await page.screenshot({path:test.info().outputPath('money-320-large-text.png')});
  await d.getByRole('button',{name:'Skriv inn CP',exact:true}).click();
  const input=d.getByRole('textbox',{name:'CP',exact:true});await typeWheelText(page,(await input.getAttribute('aria-label'))!,'25');
  expect(await input.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
  await d.getByRole('button',{name:'Avbryt',exact:true}).click();
  await page.locator('[data-action="money"]').click();
 }
});

test('K1/K8: a native touch drag starts on the selected middle number, then typing freezes late momentum',async({page,context})=>{
 await createCharacter(page);await page.locator('[data-action="money"]').click();
 const d=page.locator('.number-change-dialog'),wheel=d.getByRole('spinbutton',{name:'Tallhjul: GP',exact:true});
 const client=await context.newCDPSession(page),box=(await d.getByRole('button',{name:'Skriv inn GP',exact:true}).boundingBox())!;
 const x=box.x+box.width/2,y=box.y+box.height/2;
 await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
 for(let i=1;i<=7;i++)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y+i*12}]});
 await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await expect.poll(async()=>Number(await wheel.getAttribute('aria-valuenow'))).toBeGreaterThan(0);
 await d.getByRole('button',{name:'Skriv inn GP',exact:true}).click();await typeWheelText(page,'GP','9');
 await d.getByRole('button',{name:'OK',exact:true}).click();await expect(d).toHaveCount(0);
 await page.locator('[data-action="money"]').click();await expect(d.locator('.number-before b')).toHaveText('9,00');
});

test('P15/P16 K9: resource lookup remains available and reflects the committed bounded count',async({page})=>{
 await createCharacter(page);await page.getByRole('button',{name:'Combat',exact:true}).click();
 await page.getByRole('button',{name:'Hvile',exact:true}).click();await page.getByRole('button',{name:/Fighter.*1 \/ 1/}).click();
 const lookup=page.locator('dialog:not(.number-change-dialog)');await lookup.locator('#pool-value').click();
 const d=page.locator('.number-change-dialog');await expect(page.locator('dialog[open]')).toHaveCount(2);
 await d.getByRole('button',{name:'Skriv inn Endring',exact:true}).click();await typeWheelText(page,'Endring','-50');
 await d.getByRole('button',{name:'OK',exact:true}).click();await expect(d).toHaveCount(0);
 await expect(lookup.locator('#pool-value')).toContainText('0 / 1');await expect(lookup.getByRole('button',{name:'Bruk én',exact:true})).toBeDisabled();
 await lookup.locator('#pool-value').click();await d.getByRole('button',{name:'Skriv inn Endring',exact:true}).click();await typeWheelText(page,'Endring','500');
 await d.getByRole('button',{name:'OK',exact:true}).click();await expect(lookup.locator('#pool-value')).toContainText('1 / 1');
});
