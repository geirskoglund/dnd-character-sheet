import {test,expect} from '@playwright/test';
import {createCharacter,fillField,finish,menuAction,wheelEntry} from './helpers';

test('review: keypad replaces the wheels without moving the comparison or actions; pointer and keyboard work',async({page,context})=>{
 await createCharacter(page);await page.locator('[data-action="money"]').click();
 const d=page.locator('.number-change-dialog');
 await expect(d.locator('.change-wheel-label')).toHaveText(['GP','CP']);
 const before=await d.locator('.number-comparison,.dialog-actions').evaluateAll(els=>els.map(e=>e.getBoundingClientRect().y));
 await d.getByRole('button',{name:'Skriv inn GP',exact:true}).click();
 await expect(d.locator('.change-wheels')).toBeHidden();
 const input=d.getByRole('textbox',{name:'GP',exact:true});await expect(input).toHaveAttribute('aria-readonly','true');
 for(const digit of ['1','2'])await d.locator('.number-keypad').getByRole('button',{name:digit,exact:true}).click();
 await expect(input).toHaveText('12');
 await expect(d.locator('.number-after b')).toHaveText('12,00');
 const after=await d.locator('.number-comparison,.dialog-actions').evaluateAll(els=>els.map(e=>e.getBoundingClientRect().y));expect(after).toEqual(before);
 await d.getByRole('button',{name:'Tilbake til hjul',exact:true}).click();
 await expect(d.locator('.change-wheels')).toBeVisible();
 await d.getByRole('button',{name:'Skriv inn CP',exact:true}).click();
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.evaluate(()=>navigator.clipboard.writeText('-20'));
 await d.getByRole('textbox',{name:'CP',exact:true}).press('ControlOrMeta+A');await d.getByRole('textbox',{name:'CP',exact:true}).press('ControlOrMeta+V');
 await expect(d.getByRole('textbox',{name:'CP',exact:true})).toHaveText('-20');await finish(page);
 await page.locator('[data-action="money"]').click();await expect(d.locator('.number-before b')).toHaveText('11,80');
});

test('review: the band stays fixed between rows during native scrolling and on resize',async({page})=>{
 await createCharacter(page);await page.locator('[data-action="money"]').click();
 const d=page.locator('.number-change-dialog'),track=d.getByRole('spinbutton',{name:'Tallhjul: GP',exact:true});
 const band=d.locator('.wheel-band').first();const before=await band.boundingBox();
 await track.hover();await page.mouse.wheel(0,-95);
 await expect(track).not.toHaveAttribute('aria-valuenow','0');
 const after=await band.boundingBox();expect(after).toEqual(before);
 await expect.poll(async()=>Number(await track.getAttribute('aria-valuenow'))).toBeGreaterThan(0);
 const outline=await d.getByRole('heading').evaluate(el=>getComputedStyle(el).outlineStyle);expect(outline).toBe('none');
 const sizes=await d.locator('.number-before b,.number-after b,[data-wheel-value]').evaluateAll(els=>els.map(el=>parseFloat(getComputedStyle(el).fontSize)));
 expect(sizes[1]).toBeGreaterThan(sizes[0]);expect(sizes[1]).toBeGreaterThanOrEqual(sizes[2]);
});

test('review: Take damage is reduction-only; HP pill still heals, shows ordinary and temporary HP separately and undoes',async({page})=>{
 await createCharacter(page);await page.getByRole('button',{name:'Combat',exact:true}).click();
 await page.locator('[data-action="hp"]').click();await fillField(page,'HP-endring i tall','-5');await finish(page);
 await page.locator('[data-action="temp-hp"]').click();await fillField(page,'Temporary HP','3');await finish(page);
 await page.getByRole('button',{name:'Ta skade',exact:true}).click();
 const d=page.locator('.number-change-dialog');await expect(d.getByRole('heading',{name:'Ta skade',exact:true})).toBeVisible();
 await page.screenshot({path:test.info().outputPath('damage-390.png')});
 await expect(d.locator('.number-before b')).toHaveText('7');await expect(d.locator('.number-before [data-detail]')).toContainText('3 temp HP');
 const track=d.getByRole('spinbutton',{name:'Tallhjul: Endring',exact:true});await expect(track).toHaveAttribute('aria-valuemax','0');
 await wheelEntry(page,'Endring','100');await expect(track).toHaveAttribute('aria-valuenow','0');
 await wheelEntry(page,'Endring','-5');await expect(d.locator('.number-after b')).toHaveText('5');
 await expect(d.locator('.number-after [data-detail]')).toContainText('0 temp HP');await finish(page);
 await expect(page.locator('[data-action="hp"]')).toContainText('5 / 12');
 await menuAction(page,'Angre siste endring');await expect(page.locator('[data-action="hp"]')).toContainText('7 / 12');await expect(page.locator('[data-action="temp-hp"]')).toContainText('3');
 await page.locator('[data-action="hp"]').click();await expect(d.getByRole('heading',{name:'Endre HP',exact:true})).toBeVisible();await wheelEntry(page,'Endring','5');await finish(page);await expect(page.locator('[data-action="hp"]')).toContainText('12 / 12');
});

test('review: touches outside the wheel cannot move the full-screen dialog or background',async({page,context})=>{
 await createCharacter(page);await page.evaluate(async()=>{await document.fonts.ready;window.scrollTo(0,140);});await page.locator('[data-action="money"]').scrollIntoViewIfNeeded();const scroll=await page.evaluate(()=>scrollY);
 await page.locator('[data-action="money"]').click();const d=page.locator('.number-change-dialog'),before=await d.boundingBox();
 expect(await page.evaluate(()=>-parseFloat(document.body.style.top))).toBe(scroll);
 const client=await context.newCDPSession(page);
 for(const [x,y,dy] of [[8,450,-160],[380,250,130],[195,130,110],[195,600,-120]]){
  await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let i=1;i<=5;i++)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y+dy*i/5}]});
  await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  expect(await d.boundingBox()).toEqual(before);
 }
 await d.getByRole('button',{name:'Avbryt',exact:true}).click();expect(await page.evaluate(()=>scrollY)).toBe(scroll);
});

test('review: narrow mobile keypad stays visible without an OS keyboard and important values remain on one line',async({page})=>{
 await createCharacter(page);await page.locator('[data-action="money"]').click();const d=page.locator('.number-change-dialog');
 for(const width of [320,390])for(const height of [568,844]){
  await page.setViewportSize({width,height});
  await d.getByRole('button',{name:'Skriv inn GP',exact:true}).click();
  await expect(d.getByRole('textbox',{name:'GP',exact:true})).toBeInViewport();
  for(const label of ['1','0','Slett siffer'])await expect(d.locator('.number-keypad').getByRole('button',{name:label,exact:true})).toBeInViewport();
  await expect(d.getByRole('button',{name:'OK',exact:true})).toBeInViewport();
  expect(await d.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  if(width===390&&height===844)await page.screenshot({path:test.info().outputPath('keypad-390.png')});
  if(width===320&&height===568)await page.screenshot({path:test.info().outputPath('keypad-320.png')});
  await d.getByRole('button',{name:'Tilbake til hjul',exact:true}).click();
  if(width===390&&height===844)await page.screenshot({path:test.info().outputPath('money-390.png')});
 }
 await page.setViewportSize({width:320,height:568});await page.evaluate(()=>document.documentElement.style.fontSize='200%');
 await expect.poll(async()=>d.locator('.number-before b').evaluate(el=>{const s=getComputedStyle(el);return el.getBoundingClientRect().height<=parseFloat(s.lineHeight)+1;})).toBe(true);
 await page.screenshot({path:test.info().outputPath('money-320-text.png')});
 await d.getByRole('button',{name:'Skriv inn GP',exact:true}).click();const input=d.getByRole('textbox',{name:'GP',exact:true});
 expect(await input.evaluate(el=>el.clientHeight>=parseFloat(getComputedStyle(el).fontSize))).toBe(true);
 await input.pressSequentially('25');await input.scrollIntoViewIfNeeded();await expect(input).toBeInViewport();await page.screenshot({path:test.info().outputPath('keypad-320-text.png')});
 await input.press('ControlOrMeta+A');await input.pressSequentially('90071992547409');
 expect(await input.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
});
