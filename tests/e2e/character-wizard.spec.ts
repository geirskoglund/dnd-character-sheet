import {test,expect,type Page} from '@playwright/test';
import {menuAction,fillField,choose,revealField,finish,closeEditor,createCharacter,wheelEntry} from './helpers';
test.use({reducedMotion:'reduce'});
const next=(p:Page)=>p.locator('dialog #submit');
const question=(p:Page)=>p.locator('#wizard-question');
const active=(p:Page)=>p.locator('[data-wizard-active]');
async function state(p:Page){return p.evaluate(async()=>{const db=await new Promise<IDBDatabase>(resolve=>{const r=indexedDB.open('dnd-character-companion');r.onsuccess=()=>resolve(r.result);});const values=await new Promise<any[]>(resolve=>{const r=db.transaction('characters').objectStore('characters').getAll();r.onsuccess=()=>resolve(r.result);});db.close();return values;});}
async function begin(p:Page,name='Alva'){await p.goto('./');await menuAction(p,'Ny karakter');await fillField(p,'Navn',name);await choose(p,'Art / species',{label:'Elf'});}
test('AK01–18,23–25: seven screens, explicit class toggles, defaults, ability titles and single save',async({page})=>{
 await begin(page,'Alva <&>');
 await expect(question(page)).toHaveText('Hvilken eller hvilke klasser har Alva <&>?');await expect(next(page)).toBeVisible();await expect(next(page)).toBeDisabled();
 await page.getByRole('button',{name:'Fighter',exact:true}).click();await page.getByRole('button',{name:'Wizard',exact:true}).click();
 await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','3');
 await page.getByRole('button',{name:'Fighter',exact:true}).click();await page.getByRole('button',{name:'Wizard',exact:true}).click();await expect(next(page)).toBeDisabled();
 await page.getByRole('button',{name:'Fighter',exact:true}).click();await next(page).click();
 await expect(question(page)).toHaveText('Angi subklasser for Alva <&>.');await expect(active(page).getByRole('heading',{name:'Fighter',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Ingen / ikke valgt',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Champion',exact:true}).click();await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','4');await page.getByRole('button',{name:'Ingen / ikke valgt',exact:true}).click();await next(page).click();
 await expect(active(page).locator('.number-pill small')).toHaveText('Fighter');await expect(active(page).getByRole('spinbutton')).toHaveValue('1');await next(page).click();
 await expect(active(page).getByRole('spinbutton')).toHaveCount(6);
 for(const [abbr,name] of Object.entries({STR:'Strength',DEX:'Dexterity',CON:'Constitution',INT:'Intelligence',WIS:'Wisdom',CHA:'Charisma'})){
  const field=page.getByRole('spinbutton',{name:abbr,exact:true});await expect(field).toHaveValue('10');await field.click();await expect(page.locator('.number-change-dialog').getByRole('heading',{name:'Endre '+name,exact:true})).toBeVisible();await page.getByRole('button',{name:'Avbryt',exact:true}).click();
 }
 await next(page).click();await expect(question(page)).toHaveText('Legg inn maksimum helse (hit points) for Alva <&>.');await expect(active(page).getByRole('spinbutton')).toHaveValue('2');await expect(active(page).locator('p')).toHaveCount(0);await expect(next(page)).toHaveText('Lagre');await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuemax','7');
 await expect(page.locator('#add-class,[data-remove-class],[data-custom-species],[data-custom-class],[data-custom-subclass]')).toHaveCount(0);await next(page).click();
 await expect(page.getByRole('dialog')).not.toBeVisible();expect(await state(page)).toMatchObject([{name:'Alva <&>',level:1,hp:{max:2,current:2,temp:0},classes:[{name:'Fighter',level:1,subclass:''}]}]);await page.reload();await expect(page.locator('header')).toContainText('Alva <&>');
});
test('AK07,10–16,19–22: three stable classes, changed selection, draft/reload and updated name',async({page})=>{
 await begin(page);for(const label of ['Fighter','Rogue','Wizard'])await choose(page,'Klasse',{label});
 await choose(page,'Subclass (valgfritt)',{label:'Champion'});await choose(page,'Subclass (valgfritt)',{label:'Thief'},1);await choose(page,'Subclass (valgfritt)',{label:'School of Evocation'},2);
 for(const width of [390,320]){await page.setViewportSize({width,height:844});await page.screenshot({path:test.info().outputPath(`subclasses-${width}.png`)});}
 for(const [i,value]of ['11','3','10'].entries())await fillField(page,'Klassenivå',value,i);
 for(const width of [390,320])for(const font of ['100%','200%']){
  await page.setViewportSize({width,height:844});await page.evaluate(font=>document.documentElement.style.fontSize=font,font);
  const boxes=await active(page).locator('.number-pill').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width};}));expect(boxes[0].y).toBe(boxes[1].y);expect(boxes[2].y).toBeGreaterThan(boxes[0].y);expect(boxes[2].w).toBeCloseTo(boxes[0].w,0);
  await page.screenshot({path:test.info().outputPath(`levels-${width}-${font}.png`)});
 }
 await fillField(page,'STR','17');await fillField(page,'CHA','14');await fillField(page,'Maks HP fra karakterarket','73');
 await revealField(page,'Klasse');await page.getByRole('button',{name:'Rogue',exact:true}).click();await fillField(page,'Navn','Bryn');await revealField(page,'Klassenivå');
 await expect(question(page)).toHaveText('Velg hvilket nivå (level) Bryn er på, innenfor klassene sine.');await expect(active(page).getByRole('spinbutton').nth(0)).toHaveValue('11');await expect(active(page).getByRole('spinbutton').nth(1)).toHaveValue('10');
 await closeEditor(page);expect(await state(page)).toEqual([]);await page.reload();await menuAction(page,'Bryn Utkast · Fortsett');await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','5');
 await expect(active(page).getByRole('spinbutton').nth(0)).toHaveValue('11');await expect(active(page).getByRole('spinbutton').nth(1)).toHaveValue('10');
 await revealField(page,'Subclass (valgfritt)');await expect(active(page).getByRole('heading')).toHaveText(['Fighter','Wizard']);await expect(page.getByRole('button',{name:'Champion',exact:true})).toHaveAttribute('aria-pressed','true');await expect(page.getByRole('button',{name:'School of Evocation',exact:true})).toHaveAttribute('aria-pressed','true');
 await revealField(page,'STR');await expect(active(page).getByRole('spinbutton',{name:'STR',exact:true})).toHaveValue('17');
 for(const width of [390,320])for(const font of ['100%','200%']){
  await page.setViewportSize({width,height:844});await page.evaluate(font=>document.documentElement.style.fontSize=font,font);
  const boxes=await active(page).locator('.number-pill').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y};}));expect(boxes[0].y).toBe(boxes[2].y);expect(boxes[3].y).toBe(boxes[5].y);expect(boxes[3].y).toBeGreaterThan(boxes[0].y);expect(await page.getByRole('dialog').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  const labels=await active(page).locator('.number-pill small').evaluateAll(els=>els.map(el=>({width:el.clientWidth,scroll:el.scrollWidth,lines:el.getBoundingClientRect().height/parseFloat(getComputedStyle(el).fontSize)})));for(const label of labels){expect(label.scroll).toBeLessThanOrEqual(label.width);expect(label.lines).toBeLessThan(2);}
  await page.screenshot({path:test.info().outputPath(`abilities-${width}-${font}.png`)});
  if(font==='200%'){await active(page).getByRole('spinbutton',{name:'CHA',exact:true}).scrollIntoViewIfNeeded();await expect(active(page).getByRole('spinbutton',{name:'CHA',exact:true})).toBeInViewport();await expect(next(page)).toBeInViewport();await page.screenshot({path:test.info().outputPath(`abilities-${width}-large-scrolled.png`)});}
 }
 await finish(page);await expect(page.getByRole('dialog')).not.toBeVisible();expect(await state(page)).toMatchObject([{name:'Bryn',level:21,classes:[{name:'Fighter',level:11,subclass:'Champion'},{name:'Wizard',level:10,subclass:'School of Evocation'}],abilityScores:{STR:17,CHA:14},hp:{max:73}}]);
});
test('AK13,18,21–23: level21, editor cancel/OK, edit HP preservation, draft and backup roundtrip',async({page,browser})=>{
 await createCharacter(page);await page.getByRole('button',{name:'Combat',exact:true}).click();await page.locator('[data-action="hp"]').click();await wheelEntry(page,'Endring','-3');await page.getByRole('button',{name:'OK',exact:true}).click();await page.locator('[data-action="temp-hp"]').click();await wheelEntry(page,'Endring','4');await page.getByRole('button',{name:'OK',exact:true}).click();
 await menuAction(page,'Rediger karakter');await revealField(page,'Klasse');await page.getByRole('button',{name:'Fighter',exact:true}).click();await choose(page,'Klasse',{label:'Wizard'});await fillField(page,'Klassenivå','21');await closeEditor(page);await page.reload();await menuAction(page,'Alva Utkast · Fortsett');await expect(active(page).getByRole('spinbutton')).toHaveValue('21');await finish(page);await expect(page.getByRole('dialog')).not.toBeVisible();
 expect(await state(page)).toMatchObject([{level:21,hp:{max:12,current:9,temp:4}}]);
 await menuAction(page,'Rediger karakter');const field=await revealField(page,'Klassenivå');
 for(const action of ['Avbryt','Avbryt endring']){await field.click();await wheelEntry(page,'Endring','8');await page.getByRole('button',{name:action,exact:true}).click();await expect(field).toHaveValue('21');}
 await field.click();await wheelEntry(page,'Endring','-500');await page.getByRole('button',{name:'OK',exact:true}).click();await expect(field).toHaveValue('1');await fillField(page,'Klassenivå','21');
 await finish(page);await expect(page.getByRole('dialog')).not.toBeVisible();await page.reload();
 const pendingDownload=page.waitForEvent('download');await menuAction(page,'Eksporter backup');const download=await pendingDownload;const file=await download.path();
 const context=await browser.newContext(),target=await context.newPage();await target.goto('./');await menuAction(target,'Importer backup');await target.getByLabel('JSON-fil').setInputFiles(file!);await target.getByRole('button',{name:'Importer',exact:true}).click();await expect(target.locator('header')).toContainText('Wizard 21');expect(await state(target)).toMatchObject([{level:21,hp:{max:12,current:9,temp:4}}]);await target.getByRole('button',{name:'Magi',exact:true}).click();await target.getByRole('button',{name:'Combat',exact:true}).click();await context.close();
});

test('AK22: discarding a character draft has its own confirmation and keeps the saved character',async({page})=>{
 await createCharacter(page);await menuAction(page,'Rediger karakter');await fillField(page,'Navn','Uferdig');await closeEditor(page);await menuAction(page,'Uferdig Utkast · Fortsett');
 await page.getByRole('button',{name:'Forkast utkast',exact:true}).click();await page.getByRole('dialog').last().getByRole('button',{name:'Avbryt',exact:true}).click();await expect(page.getByRole('textbox',{name:'Navn',exact:true})).toHaveValue('Uferdig');
 await page.getByRole('button',{name:'Forkast utkast',exact:true}).click();await page.getByRole('dialog').last().getByRole('button',{name:'Forkast utkast',exact:true}).click();await page.reload();await expect(page.locator('header')).toContainText('Alva');expect(await state(page)).toMatchObject([{name:'Alva'}]);
});

test('existing answers outside the catalog remain data, with no custom creation branches',async({page})=>{
 await createCharacter(page);
 await page.evaluate(async()=>{
  const db=await new Promise<IDBDatabase>(resolve=>{const r=indexedDB.open('dnd-character-companion');r.onsuccess=()=>resolve(r.result);});
  await new Promise<void>(resolve=>{const tx=db.transaction('characters','readwrite'),store=tx.objectStore('characters'),r=store.getAll();r.onsuccess=()=>{const c=r.result[0];delete c.species.catalogId;c.species.name='Tidligere art';c.classes[0].name='Vokter';c.classes[0].definitionRef={kind:'custom',id:'stored-class'};c.classes[0].subclass='Tidligere orden';c.classes[0].level=7;c.level=7;store.put(c);};tx.oncomplete=()=>resolve();});db.close();
 });
 await page.reload();const before=await state(page);await menuAction(page,'Rediger karakter');await revealField(page,'Art / species');await expect(page.getByRole('button',{name:'Tidligere art',exact:true})).toHaveAttribute('aria-pressed','true');await revealField(page,'Klasse');await expect(page.getByRole('button',{name:'Vokter',exact:true})).toHaveAttribute('aria-pressed','true');await choose(page,'Subclass (valgfritt)',{label:'Tidligere orden'});await fillField(page,'Klassenivå','7');await expect(page.locator('[data-custom-species],[data-custom-class],[data-custom-subclass]')).toHaveCount(0);await finish(page);await expect(page.getByRole('dialog')).not.toBeVisible();expect((await state(page))[0].classes).toEqual(before[0].classes);expect((await state(page))[0].species).toEqual(before[0].species);
});
