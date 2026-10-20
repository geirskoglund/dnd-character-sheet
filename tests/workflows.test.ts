import {describe,it,expect} from 'vitest';
import {createCharacter,copyCharacter,characterSchema,type Character} from '../src/domain/model';
import {instantiateSpell,instantiateFeature,spellLibrary,featureLibrary} from '../src/domain/character-library';
import {slotProgression,maxSpellLevel,relevantSpellSources,assignSpell,featureEligibility,preparedSpellCandidates,preparationLimit,prepareSpells,spellUsable} from '../src/domain/magic';
import {withStandardResources,adjustPool,defaultHitRecovery,restResult} from '../src/domain/resource-setup';
import {instantiateEquipment} from '../src/domain/catalog';
import {deriveWeapon} from '../src/domain/equipment';
import {CharacterRepository,openDatabase} from '../src/storage/database';
function character(...entries:[string,number,string?][]):Character{
 const c=createCharacter('Arket');c.classes=entries.map(([name,level,subclass])=>({id:crypto.randomUUID(),name,level,subclass,definitionRef:{kind:'catalog',id:`srd51:class:${name.toLowerCase()}`}}));c.level=entries.reduce((n,r)=>n+r[1],0);c.hp={current:10,max:30,temp:5};return c;
}
const spell=(name:string)=>spellLibrary.find(s=>s.name===name)!;
const feature=(id:string)=>featureLibrary.find(f=>f.id===id)!;
const slots=(c:Character,system='Spellcasting')=>withStandardResources(c).resources.filter(p=>p.kind==='spellSlot'&&p.systemRef===system);
describe('2014 character context and finite sheet bookkeeping',()=>{
 it('Wizard3 has 4/2 slots and school does not exclude illusion or grant all other class spells',()=>{
  const c=character(['Wizard',3,'School of Evocation']);expect(slotProgression(c).slice(0,3)).toEqual([4,2,0]);
  expect(relevantSpellSources(c,spell('Invisibility'))).toHaveLength(1);expect(relevantSpellSources(c,spell('Fireball'))).toHaveLength(0);expect(relevantSpellSources(c,spell('Cure Wounds'))).toHaveLength(0);
  expect(relevantSpellSources(c,spell('Fire Bolt'))).toHaveLength(1);
 });
 it('multiclass slots do not raise spells selectable for each class',()=>{
  const c=character(['Wizard',1],['Cleric',4]);expect(slotProgression(c).slice(0,3)).toEqual([4,3,2]);expect(maxSpellLevel(c.classes[0])).toBe(1);expect(maxSpellLevel(c.classes[1])).toBe(2);
  expect(relevantSpellSources(c,spell('Invisibility'))).toHaveLength(0);expect(relevantSpellSources(c,spell('Aid'))[0].label).toBe('Cleric');
 });
 it('single half-caster uses its own table, while multiclass rounds each half-caster contribution down',()=>{
  expect(slotProgression(character(['Paladin',3])).slice(0,2)).toEqual([3,0]);
  expect(slotProgression(character(['Paladin',3],['Ranger',3])).slice(0,2)).toEqual([3,0]);
  expect(slotProgression(character(['Wizard',3],['Fighter',1])).slice(0,2)).toEqual([4,2]);
 });
 it('Pact Magic is independent of Spellcasting and uses its own recovery',()=>{
  const c=character(['Warlock',3],['Wizard',2]);expect(slots(c).map(p=>[p.spellLevel,p.max])).toEqual([[1,3]]);
  expect(slots(c,'Pact Magic').map(p=>[p.spellLevel,p.max,p.recharge.kind])).toEqual([[2,2,'shortRest']]);
 });
 it('Gnome Monk has only class Hit Dice, while Tiefling innate magic gives no slots',()=>{
  const c=character(['Monk',4]);c.species.name='Gnome';let next=withStandardResources(c);expect(next.resources.map(p=>[p.kind,p.max,p.die])).toEqual([['hitDie',4,'d8']]);
  c.species.name='Tiefling';c.species.catalogId='srd51:species:tiefling';expect(relevantSpellSources(c,spell('Hellish Rebuke'))[0].ability).toBe('CHA');expect(slots(c)).toHaveLength(0);
  c.level=2;c.classes[0].level=2;expect(relevantSpellSources(c,spell('Hellish Rebuke'))).toHaveLength(0);
 });
 it('explicit feature access survives ordinary class restrictions and keeps its own source/ability',()=>{
  const c=character(['Wizard',3]);c.features.push({...instantiateFeature('srd51:feat:grappler'),id:crypto.randomUUID(),name:'Avtalt magi',spellAccess:{classes:['Cleric'],spellIds:[],maxLevel:1,ability:'WIS'}});
  const sources=relevantSpellSources(c,spell('Cure Wounds'));expect(sources).toHaveLength(1);const s=assignSpell(c,instantiateSpell(spell('Cure Wounds').id),sources[0]);expect(s.casterClassRef).toBeUndefined();expect(s.accessSource?.id).toBe(c.features[0].id);expect(s.castingAbility).toBe('WIS');
 });
 it('features use actual class level and subclass; general Grappler uses STR, not class membership',()=>{
  const c=character(['Fighter',3,'Champion'],['Wizard',2,'School of Evocation']);
  expect(featureEligibility(c,feature('srd51:class:extra-attack-1')).eligible).toBe(false);
  expect(featureEligibility(c,feature('srd51:class:sculpt-spells')).eligible).toBe(true);
  c.classes[1].subclass='School of Necromancy';expect(featureEligibility(c,feature('srd51:class:sculpt-spells')).eligible).toBe(false);
  c.abilityScores.STR=12;expect(featureEligibility(c,feature('srd51:feat:grappler')).eligible).toBe(false);c.abilityScores.STR=13;expect(featureEligibility(c,feature('srd51:feat:grappler')).eligible).toBe(true);
 });
 it('unregistered spell prerequisite is visible as uncertain instead of discarding a possible choice',()=>{
  const c=character(['Warlock',2]);const result=featureEligibility(c,feature('srd51:class:eldritch-invocation-agonizing-blast'));expect(result.eligible).toBe(true);expect(result.note).toContain('bekreftes');
 });
 it('read projection is stable and does not mutate the stored sheet',()=>{
  const c=character(['Wizard',3]),raw=JSON.stringify(c);const a=withStandardResources(c),b=withStandardResources(c);expect(a).toEqual(b);expect(JSON.stringify(c)).toBe(raw);
 });
 it('level changes preserve spent slots and manual maximums, and legacy pools are not duplicated',()=>{
  let c=withStandardResources(character(['Wizard',2]));const one=c.resources.find(p=>p.kind==='spellSlot')!;one.current=1;c.classes[0].level=3;c.level=3;c=withStandardResources(c);expect(c.resources.find(p=>p.id===one.id)).toMatchObject({max:4,current:2});
  const pool=c.resources.find(p=>p.id===one.id)!;pool.max=9;pool.current=7;pool.manualMaximum=true;c.classes[0].level=4;c.level=4;c=withStandardResources(c);expect(c.resources.find(p=>p.id===one.id)).toMatchObject({max:9,current:7});
  const legacy=character(['Wizard',3]);legacy.resources=[{id:crypto.randomUUID(),ownerCharacterId:legacy.id,name:'Mine slots',kind:'spellSlot',spellLevel:1,systemRef:'Spellcasting',current:2,max:8,recharge:{kind:'longRest'}}];expect(slots(legacy).filter(p=>p.spellLevel===1)).toMatchObject([{max:8,current:2}]);
 });
 it('Pact pool changes level without duplication or refilling and obsolete automatic levels disappear',()=>{
  let c=withStandardResources(character(['Warlock',2]));const p=c.resources.find(p=>p.systemRef==='Pact Magic')!;p.current=1;c.classes[0].level=3;c.level=3;c=withStandardResources(c);
  expect(c.resources.filter(p=>p.systemRef==='Pact Magic')).toMatchObject([{id:p.id,spellLevel:2,current:1,max:2}]);
  let wizard=withStandardResources(character(['Wizard',3]));wizard.classes[0].level=1;wizard.level=1;wizard=withStandardResources(wizard);expect(wizard.resources.filter(p=>p.kind==='spellSlot')).toMatchObject([{spellLevel:1,max:2}]);
  wizard.classes[0].name='Monk';wizard.classes[0].definitionRef={kind:'catalog',id:'srd51:class:monk'};wizard=withStandardResources(wizard);expect(wizard.resources).toHaveLength(1);expect(wizard.resources[0]).toMatchObject({name:'Monk · d8',die:'d8'});
 });
 it('copy remaps sources and class identities without creating duplicate automatic pools',()=>{
  const c=withStandardResources(character(['Wizard',3],['Warlock',2]));const copied=withStandardResources(copyCharacter(c));expect(copied.resources).toHaveLength(c.resources.length);expect(copied.resources.every(p=>p.ownerCharacterId===copied.id)).toBe(true);expect(copied.resources.every(p=>!c.resources.some(old=>old.id===p.id))).toBe(true);
 });
 it('Wizard prepares only its own book; Cleric sees class list and free domain spells',()=>{
  const c=character(['Wizard',3,'School of Evocation']);c.abilityScores.INT=16;const source=relevantSpellSources(c,spell('Invisibility'))[0];c.spells.push(assignSpell(c,instantiateSpell(spell('Invisibility').id),source));expect(preparationLimit(c,c.classes[0])).toBe(6);const rows=preparedSpellCandidates(c,c.classes[0]);expect(rows.map(r=>r.name)).toEqual(['Invisibility']);
  const prepared=prepareSpells(c,c.classes[0],rows,new Set(rows.map(r=>r.id)));expect(spellUsable(prepared,prepared.spells[0])).toBe(true);expect(spellUsable(c,c.spells[0])).toBe(false);
  const cleric=character(['Cleric',3,'Life Domain']);const choices=preparedSpellCandidates(cleric,cleric.classes[0]);expect(choices.find(s=>s.name==='Spiritual Weapon')?.alwaysPrepared).toBe(true);expect(choices.find(s=>s.name==='Aid')?.alwaysPrepared).toBe(false);expect(choices.some(s=>s.spellLevel>2)).toBe(false);
  expect(preparationLimit(character(['Bard',3]),character(['Bard',3]).classes[0])).toBeNull();
 });
 it('Hit Dice spending changes only the count; class feature pools are sourced and conditional recovery is explicit',()=>{
  let c=character(['Monk',4]);c.features.push(instantiateFeature('srd51:class:ki'));c=withStandardResources(c);const die=c.resources.find(p=>p.kind==='hitDie')!,ki=c.resources.find(p=>p.name==='Ki')!;expect(ki.max).toBe(4);expect(c.features[0].resourceRefs).toContain(ki.id);
  const spent=adjustPool(c,die.id,-2);expect(spent.hp).toEqual(c.hp);expect(spent.resources.find(p=>p.id===die.id)?.current).toBe(2);ki.current=0;
  expect(restResult(c,'shortRest').resources.find(p=>p.id===ki.id)?.current).toBe(0);expect(restResult(c,'shortRest',{},new Set([ki.id])).resources.find(p=>p.id===ki.id)?.current).toBe(4);
 });
 it('registered resource features use their actual catalog IDs and share progression pools',()=>{
  for(const [name,level,id,max]of [['Fighter',17,'action-surge-2-uses',2],['Bard',5,'bardic-inspiration-d8',4],['Druid',4,'wild-shape-cr-1-2-or-below-no-flying-speed',2],['Barbarian',4,'rage',3],['Sorcerer',3,'font-of-magic',3],['Paladin',3,'lay-on-hands',15],['Fighter',1,'second-wind',1],['Wizard',3,'arcane-recovery',1]] as const){
   const c=character([name,level]);c.abilityScores.CHA=18;c.features.push(instantiateFeature('srd51:class:'+id));const next=withStandardResources(c),p=next.resources.find(p=>p.kind==='custom');expect(p?.max,id).toBe(max);expect(next.features[0].resourceRefs).toContain(p!.id);
  }
  const fighter=character(['Fighter',17]);fighter.features.push(instantiateFeature('srd51:class:action-surge-1-use'),instantiateFeature('srd51:class:action-surge-2-uses'));const next=withStandardResources(fighter);expect(next.resources.filter(p=>p.kind==='custom')).toHaveLength(1);expect(next.features[0].resourceRefs).toEqual(next.features[1].resourceRefs);
  let bard=character(['Bard',4]);bard.features.push(instantiateFeature('srd51:class:bardic-inspiration-d6'));bard=withStandardResources(bard);const insp=bard.resources.find(p=>p.kind==='custom')!;insp.current=0;expect(insp.recharge.kind).toBe('longRest');bard.classes[0].level=5;bard.level=5;bard=withStandardResources(bard);expect(bard.resources.find(p=>p.id===insp.id)).toMatchObject({current:0,recharge:{kind:'shortRest'}});bard.resources.find(p=>p.id===insp.id)!.recharge={kind:'manual'};bard.classes[0].level=6;bard.level=6;expect(withStandardResources(bard).resources.find(p=>p.id===insp.id)?.recharge.kind).toBe('manual');
 });
 it('long rest recovers half total Hit Dice, fills HP/slots, and preserves manual/special states',()=>{
  let c=withStandardResources(character(['Monk',4]));const die=c.resources[0];die.current=1;
  c.resources.push({id:crypto.randomUUID(),ownerCharacterId:c.id,name:'DM-beholdning',kind:'custom',max:3,current:0,recharge:{kind:'special',ruleText:'Ved daggry'}});c.conditions=['Poisoned'];c.exhaustionLevel=2;
  const after=restResult(c,'longRest',defaultHitRecovery(c));expect(after.resources[0].current).toBe(3);expect(after.hp).toEqual({current:30,max:30,temp:0});expect(after.resources[1].current).toBe(0);expect(after.conditions).toEqual(['Poisoned']);expect(after.exhaustionLevel).toBe(2);
  expect(()=>restResult(c,'longRest',{[die.id]:3})).toThrow();
  die.max=7;die.current=0;die.manualMaximum=true;expect(defaultHitRecovery(c)[die.id]).toBe(3);
  const druid=character(['Druid',20]);druid.features.push(instantiateFeature('srd51:class:wild-shape-cr-1-or-below'));expect(withStandardResources(druid).resources.filter(p=>p.kind==='custom')).toEqual([]);
 });
 it('mixed-class Hit Dice recovery requires an explicit distribution when the shortage exceeds the budget',()=>{
  const c=withStandardResources(character(['Wizard',1],['Cleric',4]));const dice=c.resources.filter(p=>p.kind==='hitDie');dice.forEach(p=>p.current=0);
  expect(Object.values(defaultHitRecovery(c))).toEqual([0,0]);const chosen={[dice[0].id]:1,[dice[1].id]:1};const next=restResult(c,'longRest',chosen);expect(next.resources.filter(p=>p.kind==='hitDie').map(p=>[p.die,p.current,p.max])).toEqual([['d6',1,1],['d8',1,4]]);
  expect(()=>restResult(c,'longRest',{[dice[0].id]:1,[dice[1].id]:2})).toThrow('For mange');expect(()=>restResult(c,'longRest',{[dice[0].id]:2})).toThrow('Kontroller');
 });
 it('extra damage conditions remain on their own components through save, backup, copy and atomic undo',async()=>{
  const db=await openDatabase('workflow-'+crypto.randomUUID()),repo=new CharacterRepository(db),c=character(['Fighter',3]);c.abilityScores.STR=16;const item=instantiateEquipment('srd51:equipment:longsword');item.extraDamage=[{id:crypto.randomUUID(),expression:'1d6',damageType:'Fire',condition:'Når sverdet brenner'},{id:crypto.randomUUID(),expression:'2',damageType:'Cold',condition:'Etter avtale med DM'}];item.userNote='Farens sverd';c.items=[item];
  expect(deriveWeapon(c,item).damage).toBe('1d8+3 slashing');const saved=await repo.save(c);const copy=copyCharacter(characterSchema.parse(JSON.parse(JSON.stringify(saved)))) ;expect(copy.items[0].extraDamage?.[0].condition).toBe(item.extraDamage[0].condition);expect(copy.items[0].extraDamage?.[0].id).not.toBe(item.extraDamage[0].id);
  const changed=structuredClone(saved);changed.items[0].extraDamage![0].condition='I mørke';const after=await repo.save(changed);await repo.undo(after);expect((await repo.list())[0].items[0].extraDamage).toEqual(item.extraDamage);db.close();
 });
});
