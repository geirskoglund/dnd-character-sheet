import {fillField,choose,revealField,nextQuestion} from './helpers';
import {test,expect,type Page} from '@playwright/test';
import {createCharacter,characterStep,finish,menuAction,equipmentTab,useEquipment} from './helpers';
const d=(p:Page)=>p.getByRole('dialog');
async function sheet(p:Page,name:string,level:number,subclass?:string){
 await createCharacter(p);await menuAction(p,'Rediger karakter');await characterStep(p,1);
 await choose(p,'Klasse',{label:name});await fillField(p,'Klassenivå',String(level));
 if(subclass)await choose(p,'Subclass (valgfritt)',{label:subclass});
 await characterStep(p,2);await fillField(p,'INT','16');await fillField(p,'WIS','16');await fillField(p,'STR','16');await finish(p);await expect(d(p)).not.toBeVisible();
}
async function magic(p:Page){await p.getByRole('button',{name:'Magi',exact:true}).click();}
async function pick(p:Page,kind:'spell'|'cantrip',name:string){
 await p.getByRole('button',{name:`Legg til ${kind}`,exact:true}).click();await p.getByRole('searchbox',{name:'Søk i SRD 5.1',exact:true}).fill(name);await p.getByRole('button',{name:`Legg til ${name}`,exact:true}).click();await expect(d(p)).not.toBeVisible();
}
async function state(p:Page){return p.evaluate(async()=>{
 const db=await new Promise<IDBDatabase>(resolve=>{const r=indexedDB.open('dnd-character-companion');r.onsuccess=()=>resolve(r.result);});
 try{return await new Promise<import('../../src/domain/model').Character>(resolve=>{const r=db.transaction('characters').objectStore('characters').getAll();r.onsuccess=()=>resolve(r.result[0]);});}finally{db.close();}
});}
test('Wizard3: context, book preparation, direct slot use, undo and manual maxima through level up',async({page})=>{
 await sheet(page,'Wizard',3,'School of Evocation');await magic(page);
 await expect(page.getByRole('region',{name:'Magi',exact:true})).toContainText('Spell attack +5 · Save DC 13');
 await expect(page.getByRole('region',{name:'Spell slots',exact:true})).toContainText('4 / 4');await expect(page.getByRole('region',{name:'Spell slots',exact:true})).toContainText('2 / 2');
 await page.getByRole('button',{name:'Legg til spell',exact:true}).click();
 const search=page.getByRole('searchbox',{name:'Søk i SRD 5.1',exact:true});await search.fill('Fireball');await expect(page.getByRole('button',{name:'Legg til Fireball',exact:true})).toHaveCount(0);
 await search.fill('Cure Wounds');await expect(page.getByRole('button',{name:'Legg til Cure Wounds',exact:true})).toHaveCount(0);
 await choose(page,'Klassefilter','all');await expect(page.getByRole('button',{name:'Legg til Cure Wounds',exact:true})).toBeVisible();await page.keyboard.press('Escape');
 await pick(page,'spell','Invisibility');await pick(page,'cantrip','Fire Bolt');
 await page.getByRole('button',{name:'Forbered spells',exact:true}).click();await expect(d(page)).toContainText('0 av 6 valgt');await expect(page.getByRole('checkbox')).toHaveCount(1);
 await page.getByRole('checkbox',{name:/Invisibility/}).check();await finish(page);await expect(d(page)).not.toBeVisible();
 await page.getByRole('region',{name:'Spell slots',exact:true}).getByRole('button',{name:/Spellcasting · nivå 1/}).click();await page.getByRole('button',{name:'Bruk én',exact:true}).click();await expect(d(page)).not.toBeVisible();
 expect((await state(page)).resources.find(p=>p.spellLevel===1)?.current).toBe(3);
 await menuAction(page,'Angre siste endring');expect((await state(page)).resources.find(p=>p.spellLevel===1)?.current).toBe(4);
 await page.getByRole('region',{name:'Spell slots',exact:true}).getByRole('button',{name:/Spellcasting · nivå 1/}).click();await page.getByRole('button',{name:'Tilpass',exact:true}).click();await page.getByRole('button',{name:'Neste',exact:true}).click();
 await fillField(page,'Maks','7');await fillField(page,'Tilgjengelig','5');await finish(page);await expect(d(page)).not.toBeVisible();
 await menuAction(page,'Level Up');await fillField(page,'Ny samlet maks HP','18');await finish(page);await expect(d(page)).not.toBeVisible();
 expect((await state(page)).resources.find(p=>p.spellLevel===1)).toMatchObject({max:7,current:5,manualMaximum:true});
 await page.getByRole('button',{name:'Combat',exact:true}).click();await expect(page.getByRole('button',{name:'Fire Bolt ∞',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Invisibility Lvl 2',exact:true})).toBeVisible();
});
test('Cleric Life preparation keeps free domain spells outside the limit and allows an explicit DM overage',async({page})=>{
 await sheet(page,'Cleric',3,'Life Domain');await magic(page);await page.getByRole('button',{name:'Forbered spells',exact:true}).click();
 await expect(d(page)).toContainText('0 av 6 valgt');await expect(page.getByRole('checkbox',{name:/Spiritual Weapon/})).toBeChecked();await expect(page.getByRole('checkbox',{name:/Spiritual Weapon/})).toBeDisabled();
 const optional=page.locator('input[name="prepared"]:not(:disabled)');for(let i=0;i<7;i++)await optional.nth(i).check();
 await expect(d(page)).toContainText('7 av 6 valgt · Over vanlig grense');await finish(page);await expect(d(page)).not.toBeVisible();
 const c=await state(page);expect(c.spells.filter(s=>s.prepared&&!s.alwaysPrepared)).toHaveLength(7);expect(c.spells.find(s=>s.name==='Spiritual Weapon')).toMatchObject({prepared:true,alwaysPrepared:true});
 await menuAction(page,'Angre siste endring');expect((await state(page)).spells).toEqual([]);
});
test('feature filters use own class level, preserve general feats, and order class options correctly',async({page})=>{
 await sheet(page,'Fighter',3,'Champion');await page.getByRole('button',{name:'Legg til egenskap eller feat',exact:true}).click();
 await expect(page.getByRole('combobox',{name:'Klassefilter',exact:true})).toHaveValue('mine');
 const options=await page.locator('[name="libraryClass"] option').allTextContents();expect(options.slice(0,3)).toEqual(['Mine klasser','Alle klasser','Fighter']);expect(options.slice(3)).toEqual([...options.slice(3)].sort((a,b)=>a.localeCompare(b)));
 const search=page.getByRole('searchbox',{name:'Søk i SRD 5.1',exact:true});await search.fill('Extra Attack');await expect(page.getByRole('button',{name:'Legg til Extra Attack',exact:true})).toHaveCount(0);
 await page.getByRole('checkbox',{name:'Vis også høyere nivåer og andre forutsetninger',exact:true}).check();await expect(d(page)).toContainText('Krever klassenivå 5');
 await page.getByRole('checkbox',{name:'Vis også høyere nivåer og andre forutsetninger',exact:true}).uncheck();await search.fill('Ki');await expect(page.getByRole('button',{name:'Legg til Ki',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Feats',exact:true}).click();await search.fill('Grappler');await page.getByRole('button',{name:'Legg til Grappler',exact:true}).click();await expect(d(page)).not.toBeVisible();
 expect((await state(page)).features[0].name).toBe('Grappler');
});
test('weapon variant branches only when needed, preserves back navigation, per-damage conditions and storage retry',async({page})=>{
 await sheet(page,'Fighter',3);await equipmentTab(page);await page.getByRole('button',{name:'Legg til weapons',exact:true}).click();await page.getByRole('searchbox',{name:'Søk i utstyr',exact:true}).fill('Longsword');
 await page.getByRole('button',{name:'Tilpass Longsword',exact:true}).click();
 expect(await d(page).locator('input:visible,select:visible,textarea:visible').count()).toBe(1);
 await fillField(page,'Navn på utstyr','Flammetunge');await page.getByRole('button',{name:'Neste',exact:true}).click();
 await page.getByRole('button',{name:'+ Legg til virkning',exact:true}).click();await page.getByRole('button',{name:'Ekstraskade',exact:true}).click();await page.getByRole('button',{name:'d6',exact:true}).click();await fillField(page,'Antall terninger','1');await nextQuestion(page);await page.getByRole('button',{name:'Fire',exact:true}).click();await page.getByRole('button',{name:'Ja',exact:true}).click();await fillField(page,'Betingelse','Når sverdet brenner');
 await page.getByRole('button',{name:'Tilbake',exact:true}).click();await page.getByRole('button',{name:'Ja',exact:true}).click();await expect(page.getByRole('textbox',{name:'Betingelse',exact:true})).toHaveValue('Når sverdet brenner');
 await page.evaluate(()=>{const original=IDBObjectStore.prototype.put;(window as any).failVariant=true;IDBObjectStore.prototype.put=function(...args){if(this.name==='characters'&&(window as any).failVariant)throw new DOMException('Full lagring','QuotaExceededError');return original.apply(this,args);};});
 await nextQuestion(page);await finish(page);await expect(d(page).getByRole('alert')).toContainText('Full lagring');await expect(d(page).locator('#wizard-question')).toHaveText('Vil du ta gjenstanden i bruk?');expect((await state(page)).items).toHaveLength(0);
 await page.evaluate(()=>(window as any).failVariant=false);await finish(page);await expect(d(page)).not.toBeVisible();await useEquipment(page,'Flammetunge');
 await expect(page.locator('[data-item]')).toContainText('1d8+3 slashing');await expect(page.locator('[data-item]')).toContainText('1d6 fire');await expect(page.locator('[data-item]')).toContainText('Når sverdet brenner');
 await page.getByRole('button',{name:'Combat',exact:true}).click();await page.getByRole('button',{name:/^Flammetunge/}).click();await expect(d(page)).toContainText('Når sverdet brenner');await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Character',exact:true}).click();await expect(page.getByRole('main')).not.toContainText('AC-grunnlag');await expect(page.locator('#status')).not.toContainText('lagret');
 const c=await state(page);expect(c.items).toHaveLength(1);expect(c.items[0].extraDamage?.[0]).toMatchObject({expression:'1d6',damageType:'Fire',condition:'Når sverdet brenner'});
});
test('HP reaches zero and can increase again with a real touch wheel; navigation and obvious buttons have no triangles',async({page,context})=>{
 await createCharacter(page);await page.getByRole('button',{name:'Combat',exact:true}).click();await page.locator('[data-action="hp"]').click();
 const amount=page.getByRole('spinbutton',{name:'HP-endring i tall',exact:true}),wheel=page.getByRole('spinbutton',{name:'Tallhjul: HP-endring i tall',exact:true});
 await amount.fill('-12');await expect(wheel).toHaveAttribute('aria-valuenow','-12');await finish(page);await expect(d(page)).not.toBeVisible();
 await page.locator('[data-action="hp"]').click();await expect(wheel).toHaveAttribute('aria-valuemin','0');
 await wheel.scrollIntoViewIfNeeded();const r=(await wheel.boundingBox())!,x=r.x+r.width/2,y=r.y+r.height/2;
 const client=await context.newCDPSession(page);await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y:y+35}]});
 for(let i=1;i<=5;i++)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y+35-i*8}]});
 await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect.poll(async()=>Number(await amount.inputValue())).toBeGreaterThan(0);
 await page.keyboard.press('Escape');expect((await state(page)).hp.current).toBe(0);
 const triangles=await page.locator('nav button, .app-menu summary, .combat-tabs button').evaluateAll(els=>els.map(el=>getComputedStyle(el,'::after').clipPath));expect(triangles.every(v=>v==='none')).toBe(true);
});
test('multiclass spell selection uses each class level and asks source only when ambiguous',async({page})=>{
 await sheet(page,'Wizard',1);await menuAction(page,'Rediger karakter');await characterStep(page,1);await page.getByRole('button',{name:'+ Klasse',exact:true}).click();
 await choose(page,'Klasse',{label:'Cleric'},1);await fillField(page,'Klassenivå','4',1);await finish(page);await expect(d(page)).not.toBeVisible();await magic(page);
 await expect(page.getByRole('region',{name:'Spell slots',exact:true})).toContainText('2 / 2');
 await page.getByRole('button',{name:'Legg til spell',exact:true}).click();const search=page.getByRole('searchbox',{name:'Søk i SRD 5.1',exact:true});await search.fill('Invisibility');await expect(page.getByRole('button',{name:'Legg til Invisibility',exact:true})).toHaveCount(0);
 await search.fill('Detect Magic');await page.getByRole('button',{name:'Legg til Detect Magic',exact:true}).click();await expect(d(page)).toContainText('Hvor kommer spellen fra?');await page.getByRole('button',{name:'Cleric',exact:true}).click();await expect(d(page)).not.toBeVisible();
 const c=await state(page);expect(c.spells[0]).toMatchObject({casterClassRef:c.classes[1].id,castingAbility:'WIS',sourceLabel:'Cleric'});
 const stored=JSON.stringify(c);await page.reload();await magic(page);await page.getByRole('button',{name:'Combat',exact:true}).click();expect(JSON.stringify(await state(page))).toBe(stored);
 for(const cls of ['Wizard','Cleric','Cleric','Cleric','Cleric']){await page.getByRole('button',{name:'Hvile',exact:true}).click();await page.getByRole('button',{name:new RegExp('^'+cls+' · d')}).click();await page.getByRole('button',{name:'Bruk én',exact:true}).click();await expect(d(page)).not.toBeVisible();}
 await page.getByRole('button',{name:'Hvile',exact:true}).click();await page.getByRole('button',{name:'Lang hvile',exact:true}).click();await expect(d(page)).toContainText('Velg inntil 2 terninger totalt.');await page.getByRole('spinbutton',{name:/Wizard · d6/}).fill('1');await page.getByRole('spinbutton',{name:/Cleric · d8/}).fill('2');await expect(page.getByRole('button',{name:'Fullfør hvilen',exact:true})).toBeDisabled();await page.getByRole('spinbutton',{name:/Cleric · d8/}).fill('1');await finish(page);await expect(d(page)).not.toBeVisible();expect((await state(page)).resources.filter(p=>p.kind==='hitDie').map(p=>[p.die,p.current])).toEqual([['d6',1],['d8',1]]);

});
test('Monk4 gets count-only Hit Dice and conditional Ki; long rest previews, retries and undoes atomically',async({page})=>{
 await sheet(page,'Monk',4,'Way of the Open Hand');await page.getByRole('button',{name:'Legg til egenskap eller feat',exact:true}).click();await page.getByRole('searchbox',{name:'Søk i SRD 5.1',exact:true}).fill('Ki');await page.getByRole('button',{name:'Legg til Ki',exact:true}).click();await expect(d(page)).not.toBeVisible();
 for(let i=0;i<3;i++){await page.getByRole('button',{name:'Hvile',exact:true}).click();await page.getByRole('button',{name:/Monk · d8/}).click();await page.getByRole('button',{name:'Bruk én',exact:true}).click();await expect(d(page)).not.toBeVisible();}
 await page.getByRole('region',{name:'Beholdninger',exact:true}).getByRole('button',{name:/^Ki/}).click();await page.getByRole('button',{name:'Bruk én',exact:true}).click();await expect(d(page)).not.toBeVisible();
 await page.getByRole('button',{name:'Legg til beholdninger',exact:true}).click();await fillField(page,'Navn','Amulett');await page.getByRole('button',{name:'Neste',exact:true}).click();await fillField(page,'Maks','3');await revealField(page,'Tilgjengelig');await expect(page.getByRole('spinbutton',{name:'Tilgjengelig',exact:true})).toHaveValue('3');await fillField(page,'Tilgjengelig','1');await finish(page);await expect(d(page)).not.toBeVisible();
 await page.getByRole('button',{name:'Combat',exact:true}).click();await page.locator('[data-action="hp"]').click();await fillField(page,'HP-endring i tall','-5');await finish(page);await expect(d(page)).not.toBeVisible();const before=await state(page);
 await page.getByRole('button',{name:'Hvile',exact:true}).click();await page.getByRole('button',{name:'Lang hvile',exact:true}).click();await expect(d(page)).toContainText('Monk · d8: 1 → 3 / 4');await expect(d(page)).toContainText('HP: 7 → 12');
 const ki=page.getByRole('checkbox',{name:/Ki: Minst 30/});await expect(ki).not.toBeChecked();await ki.check();await expect(d(page)).toContainText('Ki: 3 → 4 / 4');
 await page.evaluate(()=>{const original=IDBObjectStore.prototype.put;(window as any).failRest=true;IDBObjectStore.prototype.put=function(...args){if(this.name==='characters'&&(window as any).failRest)throw new DOMException('Full lagring','QuotaExceededError');return original.apply(this,args);};});
 await finish(page);await expect(d(page).getByRole('alert')).toContainText('Full lagring');await expect(ki).toBeChecked();expect(await state(page)).toEqual(before);
 await page.evaluate(()=>(window as any).failRest=false);await finish(page);await expect(d(page)).not.toBeVisible();let c=await state(page);expect(c.hp.current).toBe(12);expect(c.resources.find(r=>r.kind==='hitDie')?.current).toBe(3);expect(c.resources.find(r=>r.name==='Amulett')?.current).toBe(1);expect(c.resources.find(r=>r.name==='Ki')?.current).toBe(4);
 await menuAction(page,'Angre siste endring');c=await state(page);expect(c.hp).toEqual(before.hp);expect(c.resources).toEqual(before.resources);
});
test('a manually registered feature grants a class list without removing ordinary character choices',async({page})=>{
 await sheet(page,'Monk',4);await page.getByRole('button',{name:'Legg til egenskap eller feat',exact:true}).click();await page.getByRole('button',{name:'Opprett egen egenskap / feat',exact:true}).click();await fillField(page,'Navn','DMs gave');await page.getByRole('button',{name:'Flere detaljer',exact:true}).click();
 await page.getByText('Ekstra tilgang til magi',{exact:true}).click();await page.getByRole('checkbox',{name:'Gir tilgang til spells eller cantrips',exact:true}).check();await page.getByRole('checkbox',{name:'Cleric',exact:true}).check();await fillField(page,'Høyeste spellnivå (0 = bare cantrips)','1');await choose(page,'Spellcasting ability','WIS');await finish(page);await expect(d(page)).not.toBeVisible();await magic(page);await pick(page,'spell','Cure Wounds');
 expect((await state(page)).spells[0]).toMatchObject({sourceLabel:'DMs gave',castingAbility:'WIS'});expect((await state(page)).resources.some(r=>r.kind==='spellSlot')).toBe(false);
});
