import {closeEditor} from './helpers';
import {fillField,choose,revealField,nextQuestion} from './helpers';
import {finish,advancedRecord} from './helpers';
import {test,expect,type Page} from '@playwright/test';
import {createCharacter,menuAction,openMenu,equipmentTab} from './helpers';
const dialog=(page:Page)=>page.getByRole('dialog');
async function save(page:Page) { await finish(page); await expect(dialog(page)).not.toBeVisible(); }
async function state(page:Page) {
  return page.evaluate(async()=>{
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open('dnd-character-companion');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
    try { return await new Promise<import('../../src/domain/model').Character>((resolve,reject)=>{const r=db.transaction('characters').objectStore('characters').getAll();r.onsuccess=()=>resolve(r.result[0]);r.onerror=()=>reject(r.error);}); } finally {db.close();}
  });
}
async function ownFeature(page:Page,name:string) {
  await page.getByRole('button',{name:'Legg til egenskap eller feat',exact:true}).click();
  await page.getByRole('button',{name:'Opprett egen egenskap / feat',exact:true}).click();
  await fillField(page,'Navn',name);await page.getByRole('button',{name:'Flere detaljer',exact:true}).click();
}
async function newPool(page:Page,name:string,kind:'custom'|'hitDie'|'spellSlot',current:number,max:number,recharge:string) {
  if(kind==='custom')await page.getByRole('button',{name:'Legg til beholdninger',exact:true}).click();
  else if(kind==='spellSlot'){
   await page.getByRole('button',{name:'Magi',exact:true}).click();await page.getByText('Manuelt slotoppsett',{exact:true}).click();await page.getByRole('button',{name:'Legg til egen slotbeholdning',exact:true}).click();
  }else{await page.getByRole('button',{name:'Hvile',exact:true}).click();await page.getByText('Manuelt Hit Dice-oppsett',{exact:true}).click();await page.getByRole('button',{name:'Legg til beholdning',exact:true}).click();}
  await fillField(page,'Navn',name);
  if(kind==='spellSlot'){
   await choose(page,'Slotnivå',name.includes('pact')?'2':'1');
   await choose(page,'Slotsystem',name.includes('pact')?'Pact Magic':'Spellcasting');
  }
  await page.getByRole('button',{name:'Neste',exact:true}).click();
  await fillField(page,'Maks',String(max));
  await fillField(page,'Tilgjengelig',String(current));
  if(kind==='custom'){await page.getByRole('button',{name:'Neste',exact:true}).click();await choose(page,'Gjenopprettes ved',recharge==='special'?'manual':recharge);}

}
async function pill(page:Page,collection:string,name:string) { await page.getByRole('region',{name:collection==='Ressurser'?'Beholdninger':collection,exact:true}).getByRole('button',{name:new RegExp('^'+name)}).click();if(collection==='Class Features & Feats'||collection==='Spells')await advancedRecord(page); }

test('dense pill collections, inline plus and the three prototype equipment groups',async({page})=>{
  await createCharacter(page);
  for (const name of ['Egen sans','Eget opphav']) {
    await page.getByRole('button',{name:'Legg til artsegenskap',exact:true}).click();
    await fillField(page,'Navn',name);await save(page);
  }
  await equipmentTab(page);
  for (const [group,item] of [['Weapons','Dagger'],['Armor og skjold','Shield'],['Annet utstyr','Torch']]) {
    const region=page.getByRole('group',{name:group,exact:true});await region.getByRole('button',{name:`Legg til ${group.toLowerCase()}`,exact:true}).click();
    const expectedFilter=group==='Weapons'?'weapon':group==='Armor og skjold'?'armor':'other';
    await expect(page.getByRole('combobox',{name:'Kategori',exact:true})).toHaveCount(0);await expect(dialog(page).locator('[name="equipmentFilter"]')).toHaveValue(expectedFilter);
    await page.getByRole('button',{name:`Legg til ${item}`,exact:true}).click();await expect(dialog(page)).not.toBeVisible();
    await expect(region).toContainText(item);
  }
  await page.getByRole('button',{name:'Character',exact:true}).click();
  const sections=await page.locator('main > section > h2').allTextContents();
  expect(sections).toContain('Class Features & Feats');expect(sections).not.toContain('Utstyr');
  for(const [width,cols] of [[320,3],[360,4],[390,4],[768,4]]) {
    await page.setViewportSize({width,height:844});
    const cards=page.getByRole('region',{name:'Artsegenskaper',exact:true}).locator('.pills > button');
    const boxes=await cards.evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,border:getComputedStyle(el).borderRadius};}));
    expect(boxes.filter(r=>r.y===boxes[0].y)).toHaveLength(cols);
    expect(Math.max(...boxes.map(r=>r.w))-Math.min(...boxes.map(r=>r.w))).toBeLessThan(1);
    expect(Math.max(...boxes.map(r=>r.h))-Math.min(...boxes.map(r=>r.h))).toBeLessThan(1);
    expect(new Set(boxes.map(r=>r.border)).size).toBe(1);
    const content=await cards.allTextContents();expect(content.at(-1)).toBe('+');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.reload();expect((await state(page)).items.map(row=>row.category)).toEqual(['weapon','shield','equipment']);
});

test('feats own an action, limited pool and conditional effect; deletion and undo stay atomic',async({page})=>{
  await createCharacter(page);await ownFeature(page,'Egen beskyttelse');
  await fillField(page,'Beskrivelse','Avtalt med DM.');
  await dialog(page).getByText('Handling',{exact:true}).click();
  await page.getByRole('checkbox',{name:'Har egen handling',exact:true}).check();
  await choose(page,'Action economy','reaction');
  await dialog(page).getByText('Begrenset ressurs',{exact:true}).click();
  await page.getByRole('checkbox',{name:'Har egen ressurs',exact:true}).check();
  await fillField(page,'Tilgjengelig','2');
  await fillField(page,'Maks','2');
  await dialog(page).getByText('Passiv skadeeffekt',{exact:true}).click();
  await page.getByRole('checkbox',{name:'Har egen skadeeffekt',exact:true}).check();
  await fillField(page,'Beløp (ved flat reduksjon)','3');
  await fillField(page,'Skadetyper (kommadelt)','Bludgeoning, Piercing, Slashing');
  await fillField(page,'Vilkår (valgfritt)','Heavy armor; ikke-magisk angrep');await save(page);
  let c=await state(page);expect(c.features).toHaveLength(1);expect(c.actions).toHaveLength(1);expect(c.resources.filter(r=>r.kind==='custom')).toHaveLength(1);expect(c.effects[0].condition?.state).toBe('unknown');
  expect(c.features[0].actionRefs).toEqual([c.actions[0].id]);expect(c.actions[0].resourceRefs).toEqual([c.resources.find(r=>r.kind==='custom')!.id]);
  await page.getByRole('button',{name:'Combat',exact:true}).click();await page.getByRole('button',{name:'Reaction',exact:true}).click();
  await page.getByRole('region',{name:'Kampoppslag',exact:true}).getByRole('button',{name:/^Egen beskyttelse/}).click();
  await expect(dialog(page)).toContainText('Avtalt med DM.');await expect(dialog(page).getByRole('button',{name:'Lukk',exact:true})).toHaveCount(1);
  await expect(dialog(page).getByRole('button',{name:'Avbryt',exact:true})).toHaveCount(0);await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Character',exact:true}).click();await pill(page,'Class Features & Feats','Egen beskyttelse');
  await fillField(page,'Navn','Endret beskyttelse');
  await page.getByRole('button',{name:'Fjern egenskap',exact:true}).click();await closeEditor(page);
  await expect(page.getByRole('textbox',{name:'Navn',exact:true})).toHaveValue('Endret beskyttelse');await save(page);
  c=await state(page);expect(c.features[0].name).toBe('Endret beskyttelse');expect(c.actions[0].name).toBe('Endret beskyttelse');expect(c.resources.filter(r=>r.kind==='custom')).toHaveLength(1);
  await pill(page,'Class Features & Feats','Endret beskyttelse');await page.getByRole('button',{name:'Fjern egenskap',exact:true}).click();await dialog(page).getByRole('button',{name:'Fjern',exact:true}).click();
  await expect(dialog(page)).not.toBeVisible();expect((await state(page)).actions).toEqual([]);expect((await state(page)).effects).toEqual([]);
  await menuAction(page,'Angre siste endring');c=await state(page);expect(c.features).toHaveLength(1);expect(c.actions).toHaveLength(1);expect(c.resources.filter(r=>r.kind==='custom')).toHaveLength(1);
});

test('skills, expertise, saves, equipment proficiencies and manual modifiers are real editable data',async({page})=>{
  await createCharacter(page);
  await page.getByRole('button',{name:'Legg til proficiency',exact:true}).click();
  await choose(page,'Skill','Perception');
  await choose(page,'Proficiency','expertise');await save(page);
  await expect(page.locator('[data-modifier="0"]')).toContainText('Perception+4');
  await pill(page,'Proficiencies','Perception');await fillField(page,'Manuell total modifier (valgfritt)','9');await save(page);
  await expect(page.locator('[data-modifier="0"]')).toContainText('Perception+9');
  await page.getByRole('button',{name:'Legg til proficiency',exact:true}).click();await choose(page,'Type','save');
  await choose(page,'Ability','CON');await save(page);
  await page.locator('[data-modifier="1"]').click();await page.getByRole('button',{name:'Constitution save +2',exact:true}).click();
  for(const [type,name] of [['tool','Thieves tools'],['armor','Heavy armor'],['weapon','Longsword'],['other','Egen trening']]) {
    await page.getByRole('button',{name:'Legg til proficiency',exact:true}).click();await choose(page,'Type',type);
    await fillField(page,'Navn',name);await save(page);
  }
  await page.reload();await expect(page.locator('[data-modifier="0"]')).toContainText('Perception+9');expect((await state(page)).proficiencies).toHaveLength(4);
  await pill(page,'Proficiencies','Perception');await page.getByRole('button',{name:'Fjern proficiency',exact:true}).click();await dialog(page).getByRole('button',{name:'Fjern',exact:true}).click();
  await expect(page.locator('[data-modifier="0"]')).toContainText('Perception+0');
  await menuAction(page,'Angre siste endring');await expect(page.locator('[data-modifier="0"]')).toContainText('Perception+9');
});

test('languages, simultaneous damage defenses and condition immunity persist separately',async({page})=>{
  await createCharacter(page);
  await pill(page,'Languages','Common');await fillField(page,'Navn','Undercommon');await save(page);
  await expect(page.getByRole('region',{name:'Languages',exact:true})).toContainText('Elvish');
  await page.getByRole('button',{name:'Legg til språk',exact:true}).click();await fillField(page,'Navn','Draconic');await save(page);
  await pill(page,'Languages','Undercommon');await page.getByRole('button',{name:'Fjern språk',exact:true}).click();await dialog(page).getByRole('button',{name:'Fjern',exact:true}).click();
  for (const kind of ['resistance','vulnerability','immunity']) {
    await page.getByRole('button',{name:'Legg til skadeegenskap',exact:true}).click();
    await fillField(page,'Skadetype','Fire');await choose(page,'Egenskap',kind);
    if(kind==='resistance') await fillField(page,'Vilkår (valgfritt)','Når DM bekrefter');await save(page);
  }
  await page.getByRole('button',{name:'Legg til tilstandsimmunitet',exact:true}).click();await fillField(page,'Tilstand','Poisoned');await save(page);
  await page.reload();const c=await state(page);expect(c.languages.map(row=>row.name).sort()).toEqual(['Draconic','Elvish']);expect(c.damageDefenses).toHaveLength(3);expect(c.conditionImmunities[0].conditionId).toBe('Poisoned');expect(c.species.languages).toEqual([]);
  await pill(page,'Skadeegenskaper','Fire Resistance');await choose(page,'Vilkåret er','true');await save(page);
  expect((await state(page)).damageDefenses[0].condition?.state).toBe('true');
});

test('offline spell and feat libraries, custom spells and separate Pact Magic and Spellcasting pools',async({page,context})=>{
  await createCharacter(page);await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>navigator.serviceWorker.controller!==null);
  await context.setOffline(true);await page.reload();await page.getByRole('button',{name:'Magi',exact:true}).click();
  await page.getByRole('button',{name:'Legg til cantrip',exact:true}).click();await choose(page,'Klassefilter','all');await page.getByRole('searchbox',{name:'Søk i SRD 5.1',exact:true}).fill('fire bolt');
  await page.getByRole('button',{name:'Legg til Fire Bolt',exact:true}).click();await expect(dialog(page)).not.toBeVisible();
  await expect(page.getByRole('region',{name:'Cantrips',exact:true})).toContainText('∞');
  await page.getByRole('button',{name:'Legg til spell',exact:true}).click();await choose(page,'Klassefilter','all');await page.getByRole('searchbox',{name:'Søk i SRD 5.1',exact:true}).fill('shield');
  await page.getByRole('button',{name:'Legg til Shield',exact:true}).click();await expect(dialog(page)).not.toBeVisible();
  await pill(page,'Spells','Shield');await page.getByRole('checkbox',{name:'I spellbook',exact:true}).check();await page.getByRole('checkbox',{name:'Prepared',exact:true}).check();await save(page);
  await page.getByRole('button',{name:'Legg til spell',exact:true}).click();await page.getByRole('button',{name:'Opprett egen spell',exact:true}).click();
  await fillField(page,'Navn','DMs spell');await page.getByRole('button',{name:'Neste',exact:true}).click();await fillField(page,'Beskrivelse (valgfritt)','Egen regeltekst');await save(page);
  await page.getByRole('button',{name:'Character',exact:true}).click();await page.getByRole('button',{name:'Legg til egenskap eller feat',exact:true}).click();await page.getByRole('button',{name:'Feats',exact:true}).click();await page.getByRole('checkbox',{name:'Vis også høyere nivåer og andre forutsetninger',exact:true}).check();await page.getByRole('button',{name:'Legg til Grappler',exact:true}).click();await expect(dialog(page)).not.toBeVisible();
  await newPool(page,'Wizard level 1','spellSlot',2,4,'longRest');await save(page);
  await newPool(page,'Warlock pact','spellSlot',1,2,'shortRest');await save(page);
  await pill(page,'Spell slots','Wizard level 1');await expect(dialog(page)).toContainText('2 / 4');await page.getByRole('button',{name:'Bruk én',exact:true}).click();await expect(dialog(page)).not.toBeVisible();
  expect((await state(page)).resources.filter(r=>r.kind==='spellSlot').map(row=>row.current)).toEqual([1,1]);
  await page.getByRole('button',{name:'Hvile',exact:true}).click();await page.getByRole('button',{name:'Kort hvile',exact:true}).click();await page.getByRole('button',{name:'Fullfør hvilen',exact:true}).click();await expect(dialog(page)).not.toBeVisible();
  expect((await state(page)).resources.filter(r=>r.kind==='spellSlot').map(row=>row.current)).toEqual([1,2]);
  await page.getByRole('button',{name:'Combat',exact:true}).click();await page.getByRole('button',{name:'Reaction',exact:true}).click();await page.getByRole('button',{name:'Shield Lvl 1',exact:true}).click();
  await expect(dialog(page)).toContainText('reaction');await expect(dialog(page).getByRole('button',{name:'Lukk',exact:true})).toHaveCount(1);
  await page.keyboard.press('Escape');await page.getByRole('button',{name:'Action',exact:true}).click();await expect(page.getByRole('button',{name:'Fire Bolt ∞',exact:true})).toBeVisible();
});

test('Hit Dice count and one total HP change are separate manual entries; long rest restores within its budget',async({page})=>{
  await createCharacter(page);await newPool(page,'Spilledagsevne','custom',0,1,'manual');await save(page);
  await page.getByRole('button',{name:'Combat',exact:true}).click();await page.locator('[data-action="hp"]').click();await fillField(page,'HP-endring i tall','-8');await finish(page);
  await page.getByRole('button',{name:'Hvile',exact:true}).click();await page.getByRole('button',{name:/Fighter.*1 \/ 1/}).click();
  await expect(page.getByRole('spinbutton',{name:'Terningresultat',exact:true})).toHaveCount(0);
  await page.getByRole('button',{name:'Bruk én',exact:true}).click();await expect(dialog(page)).not.toBeVisible();
  let c=await state(page);expect(c.hp.current).toBe(4);expect(c.resources.find(p=>p.kind==='hitDie')!.current).toBe(0);
  await page.locator('[data-action="hp"]').click();await fillField(page,'HP-endring i tall','6');await finish(page);
  expect((await state(page)).hp.current).toBe(10);await menuAction(page,'Angre siste endring');expect((await state(page)).hp.current).toBe(4);
  await page.getByRole('button',{name:'Hvile',exact:true}).click();await page.getByRole('button',{name:'Lang hvile',exact:true}).click();await page.getByRole('button',{name:'Fullfør hvilen',exact:true}).click();await expect(dialog(page)).not.toBeVisible();
  c=await state(page);expect(c.hp.current).toBe(12);expect(c.resources.find(p=>p.kind==='hitDie')!.current).toBe(1);expect(c.resources.find(p=>p.name==='Spilledagsevne')!.current).toBe(0);
});

test('inspiration, death saves, conditions and exhaustion are persisted and independently editable',async({page})=>{
  await createCharacter(page);await pill(page,'Tilstander','Inspiration');await expect(page.getByRole('region',{name:'Tilstander',exact:true}).getByRole('button',{name:'Inspiration Ja',exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Inspiration Ja',exact:true})).toBeFocused();
  await pill(page,'Tilstander','Death saves');await fillField(page,'Vellykkede','2');await fillField(page,'Mislykkede','1');await save(page);
  await pill(page,'Tilstander','Conditions');await page.getByRole('checkbox',{name:'Poisoned',exact:true}).check();await fillField(page,'Exhaustion level','2');await save(page);
  await page.reload();const c=await state(page);expect(c.inspiration).toBe(true);expect(c.deathSaves).toEqual({successes:2,failures:1});expect(c.conditions).toEqual(['Poisoned']);expect(c.exhaustionLevel).toBe(2);
});

test('portrait upload, complete UI backup, import, copy independence and removing a portrait',async({page,browser})=>{
  await createCharacter(page);await ownFeature(page,'Min feat');await save(page);
  await newPool(page,'Fysisk ressurs','custom',1,3,'manual');await save(page);
  const image=await page.evaluate(()=>{const canvas=document.createElement('canvas');canvas.width=8;canvas.height=12;canvas.getContext('2d')!.fillRect(0,0,8,12);return canvas.toDataURL('image/png').split(',')[1];});
  const chooser=page.waitForEvent('filechooser');await menuAction(page,'Portrett');
  await (await chooser).setFiles({name:'portrait.png',mimeType:'image/png',buffer:Buffer.from(image,'base64')});
  await expect(page.getByRole('button',{name:'Vis portrett',exact:true})).toBeVisible();
  const original=await state(page);await openMenu(page);const download=page.waitForEvent('download');await page.getByRole('button',{name:'Eksporter backup',exact:true}).click();const path=await (await download).path();
  const other=await browser.newContext();const target=await other.newPage();await target.goto('./');await menuAction(target,'Importer backup');await target.getByLabel('JSON-fil').setInputFiles(path!);await target.getByRole('button',{name:'Importer',exact:true}).click();await expect(dialog(target)).not.toBeVisible();
  expect(await state(target)).toEqual(original);await expect(target.getByRole('button',{name:'Vis portrett',exact:true})).toBeVisible();
  await menuAction(target,'Kopier karakter');await expect(target.getByRole('heading',{name:'Alva (kopi)',exact:true})).toBeVisible();
  await pill(target,'Ressurser','Fysisk ressurs');await target.getByRole('button',{name:'Bruk én',exact:true}).click();await expect(dialog(target)).not.toBeVisible();
  await openMenu(target);await choose(target,'Bytt karakter',{label:'Alva'});await pill(target,'Ressurser','Fysisk ressurs');await expect(dialog(target)).toContainText('1 / 3');await target.keyboard.press('Escape');
  await target.getByRole('button',{name:'Vis portrett',exact:true}).click();await target.getByRole('button',{name:'Fjern portrett',exact:true}).click();await dialog(target).getByRole('button',{name:'Fjern',exact:true}).click();await expect(dialog(target)).not.toBeVisible();
  await expect(target.getByRole('button',{name:'Vis portrett',exact:true})).toHaveCount(0);await menuAction(target,'Angre siste endring');await expect(target.getByRole('button',{name:'Vis portrett',exact:true})).toBeVisible();await other.close();
});

test('own actions link to pools without turn tracking; unchanged edits leave history intact',async({page})=>{
  await createCharacter(page);await newPool(page,'Egen bruk','custom',2,2,'manual');await save(page);
  await page.getByRole('button',{name:'Legg til egen handling',exact:true}).click();await fillField(page,'Navn','Egen reaksjon');
  await choose(page,'Action economy','reaction');await fillField(page,'Regeltekst','Rull fysisk.');await page.getByRole('checkbox',{name:'Egen bruk',exact:true}).check();await save(page);
  const before=(await state(page)).revision;
  await pill(page,'Egne handlinger','Egen reaksjon');await save(page);expect((await state(page)).revision).toBe(before);
  await pill(page,'Languages','Common');await save(page);expect((await state(page)).revision).toBe(before);
  await page.getByRole('button',{name:'Combat',exact:true}).click();await page.getByRole('button',{name:'Reaction',exact:true}).click();await page.getByRole('region',{name:'Kampoppslag',exact:true}).getByRole('button',{name:/^Egen reaksjon/}).click();
  await expect(dialog(page)).toContainText('Rull fysisk.');await expect(dialog(page).getByRole('button',{name:/^Egen bruk/})).toBeVisible();await dialog(page).getByRole('button',{name:/^Egen bruk/}).click();
  await page.getByRole('button',{name:'Bruk én',exact:true}).click();await expect(dialog(page)).not.toBeVisible();expect((await state(page)).resources.find(p=>p.name==='Egen bruk')!.current).toBe(1);
  await expect(page.locator('[data-lookup]')).toBeFocused();
  await expect(page.getByRole('button',{name:'Ferdig med tur',exact:true})).toHaveCount(0);
});

test('new structured editors retain entered values on storage error and support retry without duplication',async({page})=>{
  await createCharacter(page);await page.getByRole('button',{name:'Legg til språk',exact:true}).click();await fillField(page,'Navn','Dwarvish');
  await page.evaluate(()=>{
    const original=IDBObjectStore.prototype.put;(window as unknown as {blockWrites:boolean}).blockWrites=true;
    IDBObjectStore.prototype.put=function(...args){if(this.name==='characters' && (window as unknown as {blockWrites:boolean}).blockWrites)throw new DOMException('Full lagring','QuotaExceededError');return original.apply(this,args);};
  });
  await finish(page);await expect(dialog(page).getByRole('alert')).toContainText('Full lagring');await expect(page.getByRole('textbox',{name:'Navn',exact:true})).toHaveValue('Dwarvish');await page.getByRole('textbox',{name:'Navn',exact:true}).click();await expect(page.locator('dialog.text-editor').getByRole('textbox',{name:'Navn',exact:true})).toBeEditable();await page.locator('dialog.text-editor').getByRole('button',{name:'Avbryt',exact:true}).click();
  await page.evaluate(()=>(window as unknown as {blockWrites:boolean}).blockWrites=false);await save(page);expect((await state(page)).languages.filter(row=>row.name==='Dwarvish')).toHaveLength(1);
});


test('removing a feature pool link preserves the pool used by another action',async({page})=>{
  await createCharacter(page);await ownFeature(page,'Delt ressurs');
  await dialog(page).getByText('Begrenset ressurs',{exact:true}).click();await page.getByRole('checkbox',{name:'Har egen ressurs',exact:true}).check();await save(page);
  await page.getByRole('button',{name:'Legg til egen handling',exact:true}).click();await fillField(page,'Navn','Annen handling');await page.getByRole('checkbox',{name:'Delt ressurs',exact:true}).check();await save(page);
  const original=await state(page),pool=original.resources.find(r=>r.kind==='custom')!;
  await pill(page,'Class Features & Feats','Delt ressurs');await page.getByRole('checkbox',{name:'Har egen ressurs',exact:true}).uncheck();await save(page);
  let after=await state(page);expect(after.features[0].resourceRefs).toEqual([]);expect(after.resources.filter(r=>r.kind==='custom')).toEqual([pool]);expect(after.actions[0].resourceRefs).toEqual([pool.id]);
  await pill(page,'Class Features & Feats','Delt ressurs');await page.getByRole('button',{name:'Fjern egenskap',exact:true}).click();await dialog(page).getByRole('button',{name:'Fjern',exact:true}).click();await expect(dialog(page)).not.toBeVisible();
  after=await state(page);expect(after.resources.filter(r=>r.kind==='custom')).toEqual([pool]);expect(after.actions[0].resourceRefs).toEqual([pool.id]);
});
