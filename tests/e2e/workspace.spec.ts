import {test,expect,type Page} from '@playwright/test';
import {createCharacter,menuAction,openMenu} from './helpers';
const dialog=(page:Page)=>page.getByRole('dialog');
async function save(page:Page) { await dialog(page).getByRole('button',{name:'Lagre',exact:true}).click(); await expect(dialog(page)).not.toBeVisible(); }
async function state(page:Page) {
  return page.evaluate(async()=>{
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open('dnd-character-companion');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
    try { return await new Promise<import('../../src/domain/model').Character>((resolve,reject)=>{const r=db.transaction('characters').objectStore('characters').getAll();r.onsuccess=()=>resolve(r.result[0]);r.onerror=()=>reject(r.error);}); } finally {db.close();}
  });
}
async function ownFeature(page:Page,name:string) {
  await page.getByRole('button',{name:'Legg til egenskap eller feat',exact:true}).click();
  await page.getByRole('button',{name:'Opprett egen egenskap / feat',exact:true}).click();
  await page.getByRole('textbox',{name:'Navn',exact:true}).fill(name);
}
async function newPool(page:Page,name:string,kind:'custom'|'hitDie'|'spellSlot',current:number,max:number,recharge:string) {
  const label=({custom:'ressurser',hitDie:'hit dice',spellSlot:'spell slots'})[kind];
  await page.getByRole('button',{name:`Legg til ${label}`,exact:true}).click();
  await page.getByRole('textbox',{name:'Navn',exact:true}).fill(name);
  await page.getByRole('spinbutton',{name:'Tilgjengelig',exact:true}).fill(String(current));
  await page.getByRole('spinbutton',{name:'Maks',exact:true}).fill(String(max));
  await page.getByRole('combobox',{name:'Gjenopprettes ved',exact:true}).selectOption(recharge);
}
async function pill(page:Page,collection:string,name:string) { await page.getByRole('region',{name:collection,exact:true}).getByRole('button',{name:new RegExp('^'+name)}).click(); }

test('dense pill collections, inline plus and the three prototype equipment groups',async({page})=>{
  await createCharacter(page);
  for (const name of ['Egen sans','Eget opphav']) {
    await page.getByRole('button',{name:'Legg til artsegenskap',exact:true}).click();
    await page.getByRole('textbox',{name:'Navn',exact:true}).fill(name);await save(page);
  }
  for (const [group,item] of [['Weapons','Dagger'],['Armor og skjold','Shield'],['Annet utstyr','Torch']]) {
    const region=page.getByRole('group',{name:group,exact:true});await region.getByRole('button',{name:`Legg til ${group.toLowerCase()}`,exact:true}).click();
    const expectedFilter=group==='Weapons'?'weapon':group==='Armor og skjold'?'armor':'other';
    await expect(page.getByRole('combobox',{name:'Kategori',exact:true})).toHaveValue(expectedFilter);
    await page.getByRole('button',{name:`Legg til ${item}`,exact:true}).click();await expect(dialog(page)).not.toBeVisible();
    await expect(region).toContainText(item);
  }
  const sections=await page.locator('main > section > h2').allTextContents();
  expect(sections.indexOf('Class Features & Feats')).toBeLessThan(sections.indexOf('Utstyr'));
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
  await page.getByRole('textbox',{name:'Beskrivelse',exact:true}).fill('Avtalt med DM.');
  await dialog(page).getByText('Handling',{exact:true}).click();
  await page.getByRole('checkbox',{name:'Har egen handling',exact:true}).check();
  await page.getByRole('combobox',{name:'Action economy',exact:true}).selectOption('reaction');
  await dialog(page).getByText('Begrenset ressurs',{exact:true}).click();
  await page.getByRole('checkbox',{name:'Har egen ressurs',exact:true}).check();
  await page.getByRole('spinbutton',{name:'Tilgjengelig',exact:true}).fill('2');
  await page.getByRole('spinbutton',{name:'Maks',exact:true}).fill('2');
  await dialog(page).getByText('Passiv skadeeffekt',{exact:true}).click();
  await page.getByRole('checkbox',{name:'Har egen skadeeffekt',exact:true}).check();
  await page.getByRole('spinbutton',{name:'Beløp (ved flat reduksjon)',exact:true}).fill('3');
  await page.getByRole('textbox',{name:'Skadetyper (kommadelt)',exact:true}).fill('Bludgeoning, Piercing, Slashing');
  await page.getByRole('textbox',{name:'Vilkår (valgfritt)',exact:true}).fill('Heavy armor; ikke-magisk angrep');await save(page);
  let c=await state(page);expect(c.features).toHaveLength(1);expect(c.actions).toHaveLength(1);expect(c.resources).toHaveLength(1);expect(c.effects[0].condition?.state).toBe('unknown');
  expect(c.features[0].actionRefs).toEqual([c.actions[0].id]);expect(c.actions[0].resourceRefs).toEqual([c.resources[0].id]);
  await page.getByRole('button',{name:'Combat',exact:true}).click();await page.getByRole('button',{name:'Reaction',exact:true}).click();
  await page.getByRole('region',{name:'Kampoppslag',exact:true}).getByRole('button',{name:/^Egen beskyttelse/}).click();
  await expect(dialog(page)).toContainText('Avtalt med DM.');await expect(dialog(page).getByRole('button',{name:'Lukk',exact:true})).toHaveCount(1);
  await expect(dialog(page).getByRole('button',{name:'Avbryt',exact:true})).toHaveCount(0);await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Character',exact:true}).click();await pill(page,'Class Features & Feats','Egen beskyttelse');
  await page.getByRole('textbox',{name:'Navn',exact:true}).fill('Endret beskyttelse');
  await page.getByRole('button',{name:'Fjern egenskap',exact:true}).click();await page.getByRole('button',{name:'Avbryt',exact:true}).click();
  await expect(page.getByRole('textbox',{name:'Navn',exact:true})).toHaveValue('Endret beskyttelse');await save(page);
  c=await state(page);expect(c.features[0].name).toBe('Endret beskyttelse');expect(c.actions[0].name).toBe('Endret beskyttelse');expect(c.resources).toHaveLength(1);
  await pill(page,'Class Features & Feats','Endret beskyttelse');await page.getByRole('button',{name:'Fjern egenskap',exact:true}).click();await dialog(page).getByRole('button',{name:'Fjern',exact:true}).click();
  await expect(dialog(page)).not.toBeVisible();expect((await state(page)).actions).toEqual([]);expect((await state(page)).effects).toEqual([]);
  await menuAction(page,'Angre siste endring');c=await state(page);expect(c.features).toHaveLength(1);expect(c.actions).toHaveLength(1);expect(c.resources).toHaveLength(1);
});

test('skills, expertise, saves, equipment proficiencies and manual modifiers are real editable data',async({page})=>{
  await createCharacter(page);
  await page.getByRole('button',{name:'Legg til proficiency',exact:true}).click();
  await page.getByRole('combobox',{name:'Skill',exact:true}).selectOption('Perception');
  await page.getByRole('combobox',{name:'Proficiency',exact:true}).selectOption('expertise');await save(page);
  await expect(page.locator('[data-modifier="0"]')).toContainText('Perception+4');
  await pill(page,'Proficiencies','Perception');await page.getByRole('spinbutton',{name:'Manuell total modifier (valgfritt)',exact:true}).fill('9');await save(page);
  await expect(page.locator('[data-modifier="0"]')).toContainText('Perception+9');
  await page.getByRole('button',{name:'Legg til proficiency',exact:true}).click();await page.getByRole('combobox',{name:'Type',exact:true}).selectOption('save');
  await page.getByRole('combobox',{name:'Ability',exact:true}).selectOption('CON');await save(page);
  await page.locator('[data-modifier="1"]').click();await page.getByRole('button',{name:'Constitution save +2',exact:true}).click();
  for(const [type,name] of [['tool','Thieves tools'],['armor','Heavy armor'],['weapon','Longsword'],['other','Egen trening']]) {
    await page.getByRole('button',{name:'Legg til proficiency',exact:true}).click();await page.getByRole('combobox',{name:'Type',exact:true}).selectOption(type);
    await page.getByRole('textbox',{name:'Navn',exact:true}).fill(name);await save(page);
  }
  await page.reload();await expect(page.locator('[data-modifier="0"]')).toContainText('Perception+9');expect((await state(page)).proficiencies).toHaveLength(4);
  await pill(page,'Proficiencies','Perception');await page.getByRole('button',{name:'Fjern proficiency',exact:true}).click();await dialog(page).getByRole('button',{name:'Fjern',exact:true}).click();
  await expect(page.locator('[data-modifier="0"]')).toContainText('Perception+0');
  await menuAction(page,'Angre siste endring');await expect(page.locator('[data-modifier="0"]')).toContainText('Perception+9');
});

test('languages, simultaneous damage defenses and condition immunity persist separately',async({page})=>{
  await createCharacter(page);
  await pill(page,'Languages','Common');await page.getByRole('textbox',{name:'Navn',exact:true}).fill('Undercommon');await save(page);
  await expect(page.getByRole('region',{name:'Languages',exact:true})).toContainText('Elvish');
  await page.getByRole('button',{name:'Legg til språk',exact:true}).click();await page.getByRole('textbox',{name:'Navn',exact:true}).fill('Draconic');await save(page);
  await pill(page,'Languages','Undercommon');await page.getByRole('button',{name:'Fjern språk',exact:true}).click();await dialog(page).getByRole('button',{name:'Fjern',exact:true}).click();
  for (const kind of ['resistance','vulnerability','immunity']) {
    await page.getByRole('button',{name:'Legg til skadeegenskap',exact:true}).click();
    await page.getByRole('combobox',{name:'Skadetype',exact:true}).fill('Fire');await page.getByRole('combobox',{name:'Egenskap',exact:true}).selectOption(kind);
    if(kind==='resistance') await page.getByRole('textbox',{name:'Vilkår (valgfritt)',exact:true}).fill('Når DM bekrefter');await save(page);
  }
  await page.getByRole('button',{name:'Legg til tilstandsimmunitet',exact:true}).click();await page.getByRole('combobox',{name:'Tilstand',exact:true}).fill('Poisoned');await save(page);
  await page.reload();const c=await state(page);expect(c.languages.map(row=>row.name).sort()).toEqual(['Draconic','Elvish']);expect(c.damageDefenses).toHaveLength(3);expect(c.conditionImmunities[0].conditionId).toBe('Poisoned');expect(c.species.languages).toEqual([]);
  await pill(page,'Skadeegenskaper','Fire Resistance');await page.getByRole('combobox',{name:'Vilkåret er',exact:true}).selectOption('true');await save(page);
  expect((await state(page)).damageDefenses[0].condition?.state).toBe('true');
});

test('offline spell and feat libraries, custom spells and separate Pact Magic and Spellcasting pools',async({page,context})=>{
  await createCharacter(page);await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>navigator.serviceWorker.controller!==null);
  await context.setOffline(true);await page.reload();
  await page.getByRole('button',{name:'Legg til cantrip',exact:true}).click();await page.getByRole('searchbox',{name:'Søk i SRD 5.1',exact:true}).fill('fire bolt');
  await page.getByRole('button',{name:'Legg til Fire Bolt',exact:true}).click();await expect(dialog(page)).not.toBeVisible();
  await expect(page.getByRole('region',{name:'Cantrips',exact:true})).toContainText('∞');
  await page.getByRole('button',{name:'Legg til spell',exact:true}).click();await page.getByRole('searchbox',{name:'Søk i SRD 5.1',exact:true}).fill('shield');
  await page.getByRole('button',{name:'Legg til Shield',exact:true}).click();await expect(dialog(page)).not.toBeVisible();
  await pill(page,'Spells','Shield');await page.getByRole('checkbox',{name:'I spellbook',exact:true}).check();await page.getByRole('checkbox',{name:'Prepared',exact:true}).check();await save(page);
  await page.getByRole('button',{name:'Legg til spell',exact:true}).click();await page.getByRole('button',{name:'Opprett egen spell',exact:true}).click();
  await page.getByRole('textbox',{name:'Navn',exact:true}).fill('DMs spell');await page.getByRole('textbox',{name:'Beskrivelse og upcasting',exact:true}).fill('Egen regeltekst');await save(page);
  await page.getByRole('button',{name:'Legg til egenskap eller feat',exact:true}).click();await page.getByRole('combobox',{name:'Type',exact:true}).selectOption('feat');await page.getByRole('button',{name:'Legg til Grappler',exact:true}).click();await expect(dialog(page)).not.toBeVisible();
  await newPool(page,'Wizard level 1','spellSlot',2,4,'longRest');await save(page);
  await newPool(page,'Warlock pact','spellSlot',1,2,'shortRest');await page.getByRole('spinbutton',{name:'Slot level',exact:true}).fill('2');await page.getByRole('textbox',{name:'Slot-system',exact:true}).fill('Pact Magic');await save(page);
  await pill(page,'Spell slots','Wizard level 1');await expect(page.getByRole('spinbutton',{name:'Tilgjengelig',exact:true})).toHaveCount(1);await page.getByRole('button',{name:'Bruk én',exact:true}).click();await save(page);
  expect((await state(page)).resources.map(row=>row.current)).toEqual([1,1]);
  await page.getByRole('button',{name:'Hvile',exact:true}).click();await page.getByRole('button',{name:'Bekreft hvile',exact:true}).click();await expect(dialog(page)).not.toBeVisible();
  expect((await state(page)).resources.map(row=>row.current)).toEqual([1,2]);
  await page.getByRole('button',{name:'Combat',exact:true}).click();await page.getByRole('button',{name:'Reaction',exact:true}).click();await page.getByRole('button',{name:'Shield Lvl 1',exact:true}).click();
  await expect(dialog(page)).toContainText('reaction');await expect(dialog(page).getByRole('button',{name:'Lukk',exact:true})).toHaveCount(1);
  await page.keyboard.press('Escape');await page.getByRole('button',{name:'Action',exact:true}).click();await expect(page.getByRole('button',{name:'Fire Bolt ∞',exact:true})).toBeVisible();
});

test('one physical Hit Die changes HP and count together, undo restores both; rests respect special resources',async({page})=>{
  await createCharacter(page);await newPool(page,'Fighter dice','hitDie',1,1,'longRest');await page.getByRole('combobox',{name:'Terning',exact:true}).selectOption('d10');await save(page);
  await newPool(page,'Spilledagsevne','custom',0,1,'special');await save(page);
  await page.getByRole('button',{name:'Combat',exact:true}).click();await page.locator('[data-action="hp"]').click();await page.getByRole('spinbutton',{name:'HP-endring i tall',exact:true}).fill('-8');await page.getByRole('button',{name:'Oppdater HP',exact:true}).click();
  await page.getByRole('button',{name:'Character',exact:true}).click();await pill(page,'Hit Dice','Fighter dice');await expect(page.getByRole('button',{name:'Lagre',exact:true})).toBeVisible();
  await page.getByRole('spinbutton',{name:'Terningresultat',exact:true}).fill('6');await page.getByRole('button',{name:'Registrer kast',exact:true}).click();await expect(dialog(page)).not.toBeVisible();
  let c=await state(page);expect(c.hp.current).toBe(10);expect(c.resources[0].current).toBe(0);
  await menuAction(page,'Angre siste endring');c=await state(page);expect(c.hp.current).toBe(4);expect(c.resources[0].current).toBe(1);
  await page.getByRole('button',{name:'Hvile',exact:true}).click();await page.getByRole('combobox',{name:'Hviletype',exact:true}).selectOption('longRest');await page.getByRole('button',{name:'Bekreft hvile',exact:true}).click();await expect(dialog(page)).not.toBeVisible();
  c=await state(page);expect(c.hp.current).toBe(12);expect(c.resources[1].current).toBe(0);
});

test('inspiration, death saves, conditions and exhaustion are persisted and independently editable',async({page})=>{
  await createCharacter(page);await pill(page,'Tilstander','Inspiration');await expect(page.getByRole('region',{name:'Tilstander',exact:true}).getByRole('button',{name:'Inspiration Ja',exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Inspiration Ja',exact:true})).toBeFocused();
  await pill(page,'Tilstander','Death saves');await page.getByRole('spinbutton',{name:'Vellykkede',exact:true}).fill('2');await page.getByRole('spinbutton',{name:'Mislykkede',exact:true}).fill('1');await save(page);
  await pill(page,'Tilstander','Conditions');await page.getByRole('checkbox',{name:'Poisoned',exact:true}).check();await page.getByRole('spinbutton',{name:'Exhaustion level',exact:true}).fill('2');await save(page);
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
  await pill(target,'Ressurser','Fysisk ressurs');await target.getByRole('button',{name:'Bruk én',exact:true}).click();await save(target);
  await openMenu(target);await target.getByRole('combobox',{name:'Bytt karakter',exact:true}).selectOption({label:'Alva'});await pill(target,'Ressurser','Fysisk ressurs');await expect(target.getByRole('spinbutton',{name:'Tilgjengelig',exact:true})).toHaveValue('1');await target.keyboard.press('Escape');
  await target.getByRole('button',{name:'Vis portrett',exact:true}).click();await target.getByRole('button',{name:'Fjern portrett',exact:true}).click();await dialog(target).getByRole('button',{name:'Fjern',exact:true}).click();await expect(dialog(target)).not.toBeVisible();
  await expect(target.getByRole('button',{name:'Vis portrett',exact:true})).toHaveCount(0);await menuAction(target,'Angre siste endring');await expect(target.getByRole('button',{name:'Vis portrett',exact:true})).toBeVisible();await other.close();
});

test('own actions link to pools without turn tracking; unchanged edits leave history intact',async({page})=>{
  await createCharacter(page);await newPool(page,'Egen bruk','custom',2,2,'manual');await save(page);
  await page.getByRole('button',{name:'Legg til egen handling',exact:true}).click();await page.getByRole('textbox',{name:'Navn',exact:true}).fill('Egen reaksjon');
  await page.getByRole('combobox',{name:'Action economy',exact:true}).selectOption('reaction');await page.getByRole('textbox',{name:'Regeltekst',exact:true}).fill('Rull fysisk.');await page.getByRole('checkbox',{name:'Egen bruk',exact:true}).check();await save(page);
  const before=(await state(page)).revision;
  await pill(page,'Egne handlinger','Egen reaksjon');await save(page);expect((await state(page)).revision).toBe(before);
  await pill(page,'Languages','Common');await save(page);expect((await state(page)).revision).toBe(before);
  await page.getByRole('button',{name:'Combat',exact:true}).click();await page.getByRole('button',{name:'Reaction',exact:true}).click();await page.getByRole('region',{name:'Kampoppslag',exact:true}).getByRole('button',{name:/^Egen reaksjon/}).click();
  await expect(dialog(page)).toContainText('Rull fysisk.');await expect(dialog(page).getByRole('button',{name:/^Egen bruk/})).toBeVisible();await dialog(page).getByRole('button',{name:/^Egen bruk/}).click();
  await page.getByRole('button',{name:'Bruk én',exact:true}).click();await save(page);expect((await state(page)).resources[0].current).toBe(1);
  await expect(page.locator('[data-lookup]')).toBeFocused();
  await expect(page.getByRole('button',{name:'Ferdig med tur',exact:true})).toHaveCount(0);
});

test('new structured editors retain entered values on storage error and support retry without duplication',async({page})=>{
  await createCharacter(page);await page.getByRole('button',{name:'Legg til språk',exact:true}).click();await page.getByRole('textbox',{name:'Navn',exact:true}).fill('Dwarvish');
  await page.evaluate(()=>{
    const original=IDBObjectStore.prototype.put;(window as unknown as {blockWrites:boolean}).blockWrites=true;
    IDBObjectStore.prototype.put=function(...args){if(this.name==='characters' && (window as unknown as {blockWrites:boolean}).blockWrites)throw new DOMException('Full lagring','QuotaExceededError');return original.apply(this,args);};
  });
  await dialog(page).getByRole('button',{name:'Lagre',exact:true}).click();await expect(dialog(page).getByRole('alert')).toContainText('Full lagring');await expect(page.getByRole('textbox',{name:'Navn',exact:true})).toHaveValue('Dwarvish');await expect(page.getByRole('textbox',{name:'Navn',exact:true})).toBeEditable();
  await page.evaluate(()=>(window as unknown as {blockWrites:boolean}).blockWrites=false);await save(page);expect((await state(page)).languages.filter(row=>row.name==='Dwarvish')).toHaveLength(1);
});
