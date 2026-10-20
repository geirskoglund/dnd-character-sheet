import {closeEditor} from './helpers';
import {fillField,choose,revealField,nextQuestion} from './helpers';
import {finish,advancedRecord} from './helpers';
import {test,expect,type Page} from '@playwright/test';
import type {Character} from '../../src/domain/model';
import {createCharacter,menuAction,equipmentTab,itemDetails} from './helpers';

async function fixture(page:Page){
 await createCharacter(page);
 await page.evaluate(async()=>{
  const db=await new Promise<IDBDatabase>(resolve=>{const r=indexedDB.open('dnd-character-companion');r.onsuccess=()=>resolve(r.result);});
  const rows=await new Promise<Character[]>(resolve=>{const r=db.transaction('characters').objectStore('characters').getAll();r.onsuccess=()=>resolve(r.result);});
  const c=rows[0];c.name='Alva Nattvind';c.level=5;c.hp={current:28,max:38,temp:5};c.goldCp=4250;
  c.classes=[{...c.classes[0],name:'Rogue',level:5,subclass:'Thief',definitionRef:{kind:'catalog',id:'srd51:class:rogue'}}];
  c.abilityScores={STR:10,DEX:18,CON:14,INT:12,WIS:14,CHA:10};
  c.skills=[{skillId:'Stealth',proficiencyLevel:'expertise'},{skillId:'Perception',proficiencyLevel:'proficient'},{skillId:'Persuasion',proficiencyLevel:'proficient'}];
  c.saves=[{abilityId:'DEX',proficiencyLevel:'proficient'}];c.favoriteModifierRefs=['Perception','Stealth','DEX save','Persuasion'];
  c.items=[{id:crypto.randomUUID(),name:'Shortsword',category:'weapon',definitionRef:{kind:'catalog',id:'srd51:equipment:shortsword'},quantity:1,equipped:true,handUsage:'one',effectRefs:[],resourceRefs:[]},
   {id:crypto.randomUUID(),name:'Studded Leather',category:'armor',definitionRef:{kind:'catalog',id:'srd51:equipment:studded-leather'},quantity:1,equipped:true,effectRefs:[],resourceRefs:[],armorProfile:{kind:'light',baseAc:12,addDex:true,dexCap:null,strength:0,stealthDisadvantage:false}}];
  c.features=[{id:crypto.randomUUID(),name:'Sneak Attack',category:'class',sourceRef:{kind:'catalog',id:'srd51:class:sneak-attack'},description:'3d6 når vilkårene gjelder.',resourceRefs:[],actionRefs:[],effectRefs:[]},
   {id:crypto.randomUUID(),name:'Avtale med DM',category:'custom',description:'Manuelt innhold.',resourceRefs:[],actionRefs:[],effectRefs:[]}];
  c.notes=Array.from({length:7},(_,i)=>({id:crypto.randomUUID(),title:`Notat ${i+1} med en lang tittel for mobil`,body:'Lesbar tekst.'}));
  await new Promise<void>((resolve,reject)=>{const tx=db.transaction('characters','readwrite');tx.objectStore('characters').put(c);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});db.close();
 });
 await page.reload();
 // IndexedDB restoration renders the character after the document load event.
 // fonts.ready can resolve before that render requests either local font.
 await expect(page.getByRole('heading',{name:'Alva Nattvind',exact:true})).toBeVisible();
 const loaded=await page.evaluate(async()=>{
  const faces=await Promise.all([document.fonts.load('16px Journal'),document.fonts.load('16px Source')]);
  return faces.every(family=>family.length>0&&family.every(face=>face.status==='loaded'));
 });
 expect(loaded).toBe(true);
}
async function readState(page:Page){return page.evaluate(async()=>{
 const db=await new Promise<IDBDatabase>(resolve=>{const r=indexedDB.open('dnd-character-companion');r.onsuccess=()=>resolve(r.result);});
 try{return await new Promise<Character>(resolve=>{const r=db.transaction('characters').objectStore('characters').getAll();r.onsuccess=()=>resolve(r.result[0]);});}finally{db.close();}
});}

test('journal identity scrolls away, menu stays reachable, and all six coin labels share an arc',async({page})=>{
 await fixture(page);await page.evaluate(()=>document.fonts.ready);
 expect(await page.evaluate(()=>document.fonts.check('16px Journal')&&document.fonts.check('16px Source'))).toBe(true);
 await expect(page.locator('.character-header')).toContainText('Alva Nattvind');await expect(page.locator('.character-header')).toContainText('Elf · Rogue 5 · Thief');
 await expect(page.locator('.character-header')).not.toContainText('2014');await expect(page.locator('.portrait-placeholder')).toBeVisible();
 await expect(page.locator('.modifier-grid > button')).toContainText(['+5','+10','+7','+3']);
 const arcs=await page.locator('.ability-coin defs path').evaluateAll(els=>els.map(e=>e.getAttribute('d')));expect(arcs).toHaveLength(6);expect(new Set(arcs).size).toBe(1);
 await page.evaluate(()=>scrollTo(0,900));expect(await page.locator('.character-header').evaluate(el=>el.getBoundingClientRect().bottom)).toBeLessThan(0);
 const position=await page.evaluate(()=>scrollY);await menuAction(page,'Om appen');
 await expect(page.getByRole('dialog')).toContainText('D&D Character Companion');await expect(page.getByRole('dialog')).toContainText('2014');
 await page.getByRole('button',{name:'Lukk',exact:true}).click();expect(await page.evaluate(()=>scrollY)).toBe(position);
 await expect(page.locator('.app-menu > summary')).toBeFocused();
});

test('corner marks clickability without a different status surface and item status uses a separate label',async({page})=>{
 await fixture(page);
 const status=await page.getByLabel('Karakterstatus').locator(':scope > *').evaluateAll(els=>els.map(el=>({bg:getComputedStyle(el).backgroundColor,line:getComputedStyle(el).borderColor,corner:getComputedStyle(el,'::after').content})));
 expect(new Set(status.map(s=>s.bg)).size).toBe(1);expect(new Set(status.map(s=>s.line)).size).toBe(1);
 expect(status.map(s=>s.corner==='none')).toEqual([true,true,true,false,true]);
 await equipmentTab(page);const sword=page.getByRole('button',{name:'Shortsword · i bruk',exact:true});
 await expect(sword.locator('[data-icon="sword"]')).toHaveCount(1);await expect(sword.locator('.state-mark')).toHaveText('Høyre hånd');
 const chosen=await sword.evaluate(el=>({fill:getComputedStyle(el).backgroundColor,corner:getComputedStyle(el,'::after').backgroundColor,line:getComputedStyle(el).borderColor}));
 expect(chosen.fill).toBe('rgba(0, 0, 0, 0)');expect(chosen.corner).toBe(chosen.line);
});

test('the finite number wheel scrolls to a chosen change, keeps it until commit and supports undo',async({page})=>{
 await fixture(page);await page.getByRole('button',{name:'Combat',exact:true}).click();await page.locator('[data-action="hp"]').click();
 const wheel=page.getByRole('spinbutton',{name:'Tallhjul: HP-endring i tall',exact:true}),amount=page.getByRole('spinbutton',{name:'HP-endring i tall',exact:true});
 await wheel.hover();await page.mouse.wheel(0,-320);await expect(amount).toHaveValue('-8');
 await page.waitForTimeout(250);await expect(amount).toHaveValue('-8');
 await page.mouse.wheel(0,-320);await expect(amount).toHaveValue('-16');
 expect((await readState(page)).hp).toEqual({current:28,max:38,temp:5});
 await expect(page.locator('#hp-preview')).toContainText('HP 28 → 17');
 await finish(page);expect((await readState(page)).hp).toEqual({current:17,max:38,temp:0});
 await menuAction(page,'Angre siste endring');expect((await readState(page)).hp).toEqual({current:28,max:38,temp:5});
});

test('HP keyboard, exact entry, bounds and cancellation preserve the pending transaction',async({page})=>{
 await fixture(page);await page.getByRole('button',{name:'Combat',exact:true}).click();await page.locator('[data-action="hp"]').click();
 const slider=page.getByRole('spinbutton',{name:'Tallhjul: HP-endring i tall',exact:true}),amount=page.getByRole('spinbutton',{name:'HP-endring i tall',exact:true});
 await slider.focus();await page.keyboard.press('ArrowLeft');await expect(amount).toHaveValue('-1');await expect(slider).toHaveAttribute('aria-valuenow','-1');
 await page.keyboard.press('Home');await expect(amount).toHaveValue('-33');await expect(page.locator('#hp-preview')).toContainText('HP 28 → 0');await expect(page.getByRole('button',{name:'Reduser endring med 1',exact:true})).toBeDisabled();
 await page.keyboard.press('End');await expect(amount).toHaveValue('10');await expect(page.locator('#hp-preview')).toContainText('Temporary HP 5 → 5');
 await amount.fill('-1000');await expect(amount).toHaveValue('-33');await amount.fill('1000');await expect(amount).toHaveValue('10');
 await amount.fill('');await expect(page.getByRole('button',{name:'Oppdater HP',exact:true})).toBeDisabled();
 await page.keyboard.press('Escape');expect((await readState(page)).hp).toEqual({current:28,max:38,temp:5});
});

test('large editors keep close and save pinned while scrolling, short lookups have exactly one close',async({page})=>{
 await fixture(page);await menuAction(page,'Rediger karakter');
 for(const width of [320,390]){
  await page.setViewportSize({width,height:568});
  const before=await page.locator('#cancel, #submit').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().y));
  await page.locator('#dialog-body').evaluate(el=>el.scrollTop=el.scrollHeight);
  const after=await page.locator('#cancel, #submit').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().y));expect(after).toEqual(before);
  expect(await page.getByRole('dialog').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
 }
 await closeEditor(page);
 await page.getByRole('button',{name:'Darkvision',exact:true}).click();await expect(page.getByRole('dialog').getByRole('button')).toHaveCount(1);
 await expect(page.getByRole('button',{name:'Lukk',exact:true})).toBeVisible();
 await page.keyboard.press('Escape');await equipmentTab(page);
 await page.getByRole('button',{name:'Legg til weapons',exact:true}).click();await page.getByRole('searchbox',{name:'Søk i utstyr',exact:true}).fill('sword');
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();
 await expect(page.getByRole('button',{name:'Legg til weapons',exact:true})).toBeFocused();
});

test('own icon choices persist, automatic family fallback works, and fonts/icons survive offline reload',async({page,context})=>{
 await fixture(page);const custom=page.getByRole('region',{name:'Class Features & Feats',exact:true}).getByRole('button',{name:'Avtale med DM',exact:true});
 await expect(custom.locator('[data-icon="emblem"]')).toHaveCount(1);await custom.click();await advancedRecord(page);
 await page.getByText('Ikon (valgfritt)',{exact:true}).click();await choose(page,'Ikonvalg','healing');
 await finish(page);await expect(custom.locator('[data-icon="healing"]')).toHaveCount(1);
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>navigator.serviceWorker.controller!==null);
 await context.setOffline(true);await page.reload();await expect(page.getByRole('heading',{name:'Alva Nattvind',exact:true})).toBeVisible();await page.evaluate(()=>Promise.all([document.fonts.load('16px Journal'),document.fonts.load('16px Source')]));
 expect(await page.evaluate(()=>document.fonts.check('16px Journal')&&document.fonts.check('16px Source'))).toBe(true);
 await expect(custom.locator('[data-icon="healing"]')).toHaveCount(1);
 await equipmentTab(page);await page.getByRole('button',{name:'Shortsword · i bruk',exact:true}).click();await itemDetails(page);
 await expect(page.getByRole('dialog')).not.toContainText('Ikon (valgfritt)');await closeEditor(page);await expect(page.locator('[data-item]').first().locator('[data-icon="sword"]')).toHaveCount(1);
 await context.setOffline(false);
});

test('real touch swipe changes Combat category without opening the tapped lookup',async({page,context})=>{
 await fixture(page);await page.getByRole('button',{name:'Combat',exact:true}).click();
 const client=await context.newCDPSession(page);
 const swipe=async(dx:number,dy=0)=>{
  const r=(await page.getByRole('region',{name:'Kampoppslag',exact:true}).boundingBox())!;
  const x=dx<0?300:70,y=r.y+70;
  await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx,y:y+dy}]});
  await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 };
 await swipe(-180);await expect(page.locator('[data-category="Bonus"]')).toHaveAttribute('aria-pressed','true');await expect(page.getByRole('dialog')).not.toBeVisible();
 await swipe(-180);await expect(page.locator('[data-category="Reaction"]')).toHaveAttribute('aria-pressed','true');
 await swipe(180);await expect(page.locator('[data-category="Bonus"]')).toHaveAttribute('aria-pressed','true');
 await swipe(0,-80);await expect(page.locator('[data-category="Bonus"]')).toHaveAttribute('aria-pressed','true');
});

test('journal components remain readable without overflow at 320/390 pixels and enlarged text',async({page})=>{
 await fixture(page);
 for(const width of [320,390])for(const size of ['100%','200%']){
  await page.setViewportSize({width,height:568});await page.evaluate(value=>document.documentElement.style.fontSize=value,size);
  for(const tab of ['Character','Combat','Magi','Utstyr']){
   await page.getByRole('navigation').getByRole('button',{name:tab,exact:true}).click();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   const groups=await page.locator('.pills').evaluateAll(groups=>groups.map(g=>[...g.children].map(e=>{const r=e.getBoundingClientRect();return {w:r.width,h:r.height,clipped:e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+1};})));
   for(const boxes of groups){if(!boxes.length)continue;expect(boxes.some(b=>b.clipped)).toBe(false);expect(Math.max(...boxes.map(b=>b.w))-Math.min(...boxes.map(b=>b.w))).toBeLessThan(1);expect(Math.max(...boxes.map(b=>b.h))-Math.min(...boxes.map(b=>b.h))).toBeLessThan(1);}
  }
  await page.getByRole('button',{name:'Combat',exact:true}).click();await page.locator('[data-action="hp"]').click();
  expect(await page.getByRole('dialog').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  const wheel=page.getByRole('spinbutton',{name:'Tallhjul: HP-endring i tall',exact:true});
  expect(await wheel.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  await page.keyboard.press('Escape');
 }
});

test('HP save failure preserves the chosen amount and retry commits once; wheel selection stays visible',async({page})=>{
 await fixture(page);await page.getByRole('button',{name:'Combat',exact:true}).click();await page.locator('[data-action="hp"]').click();
 const slider=page.getByRole('spinbutton',{name:'Tallhjul: HP-endring i tall',exact:true}),amount=page.getByRole('spinbutton',{name:'HP-endring i tall',exact:true});
 await amount.fill('-8');await expect(slider).toHaveAttribute('aria-valuenow','-8');
 await page.evaluate(()=>{
  const original=IDBObjectStore.prototype.put;
  (window as unknown as {failHp:boolean}).failHp=true;
  IDBObjectStore.prototype.put=function(...args){if(this.name==='characters'&&(window as unknown as {failHp:boolean}).failHp)throw new DOMException('Full lagring','QuotaExceededError');return original.apply(this,args);};
 });
 await page.getByRole('button',{name:'Oppdater HP',exact:true}).click();await expect(page.getByRole('dialog').getByRole('alert')).toContainText('Full lagring');
 await expect(amount).toHaveValue('-8');await expect(slider).toHaveAttribute('aria-valuenow','-8');expect((await readState(page)).hp).toEqual({current:28,max:38,temp:5});
 await page.evaluate(()=>(window as unknown as {failHp:boolean}).failHp=false);
 await page.getByRole('button',{name:'Oppdater HP',exact:true}).click();expect((await readState(page)).hp).toEqual({current:25,max:38,temp:0});
 await menuAction(page,'Angre siste endring');expect((await readState(page)).hp).toEqual({current:28,max:38,temp:5});
});
