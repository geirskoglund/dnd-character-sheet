import {describe, expect, it, afterEach} from 'vitest';
import {characterSchema, createCharacter, copyCharacter, type Character} from '../src/domain/model';
import {equipmentCatalog, instantiateEquipment, type Item} from '../src/domain/catalog';
import {deriveWeapon, equipmentWarnings, offhandWeapons, weaponProfile} from '../src/domain/equipment';
import {deriveStats} from '../src/domain/derived';
import {modifiers} from '../src/domain/modifiers';
import {openDatabase, CharacterRepository} from '../src/storage/database';
import {exportBackup, importBackup} from '../src/storage/backup';
function character(name='fighter', level=3) {
 const c=createCharacter('Alva');c.level=level;c.abilityScores.STR=16;c.abilityScores.DEX=14;
 c.classes=[{id:crypto.randomUUID(),name,level,definitionRef:{kind:'catalog',id:`srd51:class:${name}`}}];return c;
}
function equip(c:Character,key:string) {const i=instantiateEquipment(`srd51:equipment:${key}`);c.items.push(i);return i;}
function style(c:Character,key:string) {c.features.push({id:crypto.randomUUID(),name:key,category:'class',sourceRef:{kind:'catalog',id:`srd51:class:fighter-fighting-style-${key}`},description:'',actionRefs:[],resourceRefs:[],effectRefs:[]});}
function cloak(c:Character) {const i=instantiateEquipment('srd51:magic-item:cloak-of-protection');i.attuned=true;c.items.push(i);return i;}
describe('2014 character-specific weapon values',()=>{
 it('proficient longsword: STR and proficiency, versatile grip, no proficiency on damage',()=>{
  const c=character(),i=equip(c,'longsword');expect(deriveWeapon(c,i)).toMatchObject({attack:'d20+5',damage:'1d8+3 slashing'});
  i.grip='two';expect(deriveWeapon(c,i).damage).toBe('1d10+3 slashing');
  equip(c,'shield');expect(equipmentWarnings(c).join()).toContain('Tohåndsvåpen');expect(deriveStats(c).ac).toBe(14);
 });
 it('uses total multiclass level for proficiency, not just Fighter level; honors override',()=>{
  const c=character('fighter',3);c.level=5;c.classes.push({id:crypto.randomUUID(),name:'Wizard',level:2,definitionRef:{kind:'catalog',id:'srd51:class:wizard'}});
  const i=equip(c,'longsword');expect(deriveWeapon(c,i).attack).toBe('d20+6');c.proficiencyBonusOverride=5;expect(deriveWeapon(c,i).attack).toBe('d20+8');
 });
 it('finesse chooses best ability including STR for ranged dart; thrown handaxe keeps STR',()=>{
  const c=character('rogue');c.abilityScores.DEX=18;
  const dagger=equip(c,'dagger');expect(deriveWeapon(c,dagger)).toMatchObject({attack:'d20+6',damage:'1d4+4 piercing'});
  dagger.attackMode='thrown';expect(deriveWeapon(c,dagger).range).toBe('20/60 ft');
  const axe=equip(c,'handaxe');axe.attackMode='thrown';expect(deriveWeapon(c,axe).damage).toBe('1d6+3 slashing');
  c.abilityScores.STR=20;expect(deriveWeapon(c,equip(c,'dart')).damage).toBe('1d4+5 piercing');
 });
 it('ranged uses DEX; proficiency can come from class, registered weapon/group or manual DM choice',()=>{
  const c=character('wizard'),i=equip(c,'longbow');expect(deriveWeapon(c,i)).toMatchObject({attack:'d20+2',damage:'1d8+2 piercing'});
  c.proficiencies.push({id:crypto.randomUUID(),category:'weapon',name:'Martial weapons'});expect(deriveWeapon(c,i).attack).toBe('d20+4');
  i.proficient=false;expect(deriveWeapon(c,i).attack).toBe('d20+2');i.proficient=true;i.attackAbility='INT';c.abilityScores.INT=18;expect(deriveWeapon(c,i).attack).toBe('d20+6');
 });
 it('Wizard and Druid do not acquire all simple or martial weapons from their name or level',()=>{
  const c=character('druid');expect(deriveWeapon(c,equip(c,'crossbow,-light')).attack).toBe('d20+2');
  expect(deriveWeapon(c,equip(c,'scimitar')).attack).toBe('d20+5');
  c.classes[0].definitionRef=undefined;c.classes[0].name='Fighter';expect(deriveWeapon(c,equip(c,'longsword')).attack).toBe('d20+3');
 });
 it('off-hand positive ability omitted, negative retained, style adds it; requires two light melee weapons',()=>{
  const c=character(),a=equip(c,'dagger'),b=equip(c,'shortsword');expect(offhandWeapons(c)).toHaveLength(2);
  expect(deriveWeapon(c,a,true).damage).toBe('1d4 piercing');style(c,'two-weapon-fighting');expect(deriveWeapon(c,a,true).damage).toBe('1d4+3 piercing');
  c.features=[];c.abilityScores.STR=6;c.abilityScores.DEX=8;expect(deriveWeapon(c,a,true).damage).toBe('1d4-1 piercing');
  b.equipped=false;expect(offhandWeapons(c)).toEqual([]);
 });
 it('flat magic attack and damage, attunement and manual totals stay distinct',()=>{
  const c=character(),i=equip(c,'longsword');i.bonuses={attack:1,damage:1};expect(deriveWeapon(c,i)).toMatchObject({attack:'d20+6',damage:'1d8+4 slashing'});
  i.requiresAttunement=true;expect(deriveWeapon(c,i).attack).toBe('d20+5');i.attuned=true;
  i.attack='d20+9 (DM)';i.damage='2d8+7 fire';expect(deriveWeapon(c,i)).toMatchObject({attack:'d20+9 (DM)',damage:'2d8+7 fire'});
 });
 it('old catalog instances get read-only profile fallback without losing name, notes or base text',()=>{
  const c=character(),i=equip(c,'longsword');delete i.weaponProfile;delete i.damage;i.name='Fars sverd';i.notes='Fra DM';const before=structuredClone(i);
  expect(deriveWeapon(c,i)).toMatchObject({attack:'d20+5',damage:'1d8+3 slashing'});expect(i).toEqual(before);
  i.damage='Egen skade';expect(deriveWeapon(c,i).damage).toBe('Egen skade');
 });
 it('does not invent damage for a net, preserves its special rules and lance rules',()=>{
  const c=character(),net=equip(c,'net');expect(deriveWeapon(c,net).damage).toBe('Ingen skade');expect(deriveWeapon(c,net).notes.join()).toContain('restrained');
  expect(deriveWeapon(c,equip(c,'lance')).notes.join()).toContain("aren't mounted");
 });
 it('all catalog weapons have valid structured profiles without implying proficiency for custom weapons',()=>{
  for(const row of equipmentCatalog.filter(i=>i.category==='weapon')) { const i=instantiateEquipment(row.catalogId);expect(weaponProfile(i)).toBeDefined();expect(characterSchema.safeParse({...character(),items:[i]}).success).toBe(true); }
 });
});
describe('registered features and conditions',()=>{
 it('Archery applies to ranged weapons, not thrown melee weapons; Dueling allows a shield, not two hands or another weapon',()=>{
  const c=character();style(c,'archery');const bow=equip(c,'longbow');expect(deriveWeapon(c,bow).attack).toBe('d20+6');bow.equipped=false;
  const axe=equip(c,'handaxe');axe.attackMode='thrown';expect(deriveWeapon(c,axe).attack).toBe('d20+5');axe.equipped=false;
  style(c,'dueling');const sword=equip(c,'longsword');equip(c,'shield');expect(deriveWeapon(c,sword).damage).toBe('1d8+5 slashing');
  sword.grip='two';expect(deriveWeapon(c,sword).damage).toBe('1d10+3 slashing');sword.grip='one';axe.equipped=true;expect(deriveWeapon(c,sword).damage).toBe('1d8+3 slashing');
 });
 it('Monk Martial Arts uses own class level, DEX and optional higher die only in eligible equipment',()=>{
  const c=character('monk',5);c.abilityScores.DEX=18;const i=equip(c,'sickle');expect(deriveWeapon(c,i)).toMatchObject({attack:'d20+7',damage:'1d6+4 slashing'});
  const shield=equip(c,'shield');expect(deriveWeapon(c,i)).toMatchObject({attack:'d20+6',damage:'1d4+3 slashing'});shield.equipped=false;
  const sword=equip(c,'longsword');expect(deriveWeapon(c,i).damage).toBe('1d4+3 slashing');sword.equipped=false;
  c.classes[0].level=1;c.level=5;c.classes.push({id:crypto.randomUUID(),name:'Fighter',level:4,definitionRef:{kind:'catalog',id:'srd51:class:fighter'}});expect(deriveWeapon(c,i).damage).toBe('1d4+4 slashing');
 });
 it('does not silently add situational Sneak Attack to ordinary weapon damage',()=>{
  const c=character('rogue',5),i=equip(c,'rapier');expect(deriveWeapon(c,i).damage).toBe('1d8+3 piercing');expect(deriveWeapon(c,i).notes.join()).toContain('+3d6');
 });
});
describe('combined armor and item effects',()=>{
 it('Chain Mail + shield + worn/attuned cloak =19 and saves+1; ordinary cloak has no bonus',()=>{
  const c=character();equip(c,'chain-mail');equip(c,'shield');const i=cloak(c);expect(deriveStats(c).ac).toBe(19);expect(deriveStats(c).acExplanation).toContain('Cloak of Protection 1');
  expect(modifiers(c).find(m=>m.ref==='DEX save')?.value).toBe(3);
  i.attuned=false;expect(deriveStats(c).ac).toBe(18);expect(modifiers(c).find(m=>m.ref==='DEX save')?.value).toBe(2);
  i.attuned=true;i.equipped=false;expect(deriveStats(c).ac).toBe(18);i.equipped=true;i.quantity=0;expect(deriveStats(c).ac).toBe(18);
  c.items.pop();c.items.push({id:crypto.randomUUID(),name:'Vanlig kappe',category:'equipment',quantity:1,equipped:true,effectRefs:[],resourceRefs:[]});expect(deriveStats(c).ac).toBe(18);
 });
 it('magic armor and shield bonuses counted once, single highest armor/shield, copies and quantity never stack',()=>{
  const c=character(),armor=equip(c,'chain-mail'),shield=equip(c,'shield');armor.bonuses={ac:1};shield.bonuses={ac:1};expect(deriveStats(c).ac).toBe(20);
  const i=cloak(c);i.quantity=10;cloak(c);expect(deriveStats(c).ac).toBe(21);expect(modifiers(c).find(m=>m.ref==='DEX save')?.value).toBe(3);
  equip(c,'leather').bonuses={ac:3};expect(deriveStats(c).ac).toBe(21);
 });
 it('Defense needs worn armor; manual AC and saving totals replace calculated totals',()=>{
  const c=character();style(c,'defense');expect(deriveStats(c).ac).toBe(12);equip(c,'leather');expect(deriveStats(c).ac).toBe(14);
  cloak(c);c.acOverride=22;c.saves.push({abilityId:'DEX',proficiencyLevel:'proficient',override:10});expect(deriveStats(c).ac).toBe(22);expect(modifiers(c).find(m=>m.ref==='DEX save')?.value).toBe(10);
 });
 it('attunement limit and incompatible hands warn, never reject saving',()=>{
  const c=character();for(let n=0;n<4;n++)cloak(c);equip(c,'greatsword');equip(c,'shield');expect(equipmentWarnings(c).join()).toContain('Mer enn tre');expect(characterSchema.safeParse(c).success).toBe(true);
 });
});
const dbs:IDBDatabase[]=[];afterEach(()=>{dbs.forEach(db=>db.close());dbs.length=0;});
it('equipment profiles, overrides, bonuses and attunement survive storage, undo, independent copy and backup import',async()=>{
 const repo=new CharacterRepository(await openDatabase(crypto.randomUUID()));dbs.push(repo.db);
 const source=character(),sword=equip(source,'longsword');sword.grip='two';sword.bonuses={attack:1,damage:2};sword.attack='d20+9';sword.damageOverride='1d8 Slashing';cloak(source);
 const saved=await repo.save(source);const edited=await repo.save({...saved,items:saved.items.map(i=>({...i,attuned:false}))});
 expect((await repo.undo(edited)).items).toEqual(saved.items);
 const copy=copyCharacter(saved);copy.items[0].bonuses!.damage=9;expect(saved.items[0].bonuses!.damage).toBe(2);expect(copy.items[0].id).not.toBe(sword.id);
 const target=new CharacterRepository(await openDatabase(crypto.randomUUID()));dbs.push(target.db);
 await importBackup(target.db,await exportBackup(repo.db,[saved]));expect((await target.list())[0].items).toEqual(saved.items);
});

it('2014 multiclass grants do not silently add Bard, Cleric, Rogue or Druid starting weapon proficiencies',()=>{
 const c=character('wizard',1);c.level=2;c.classes.push({id:crypto.randomUUID(),name:'Bard',level:1,definitionRef:{kind:'catalog',id:'srd51:class:bard'}});
 const rapier=equip(c,'rapier');expect(deriveWeapon(c,rapier).attack).toBe('d20+3');
 c.proficiencies.push({id:crypto.randomUUID(),category:'weapon',name:'Rapiers'});expect(deriveWeapon(c,rapier).attack).toBe('d20+5');
});
it('armor proficiency warnings respect starting versus multiclass grants and explicit sheet entries',()=>{
 const c=character('wizard',1);c.level=2;c.classes.push({id:crypto.randomUUID(),name:'Fighter',level:1,definitionRef:{kind:'catalog',id:'srd51:class:fighter'}});
 equip(c,'chain-mail');expect(equipmentWarnings(c).join()).toContain('ingen kjent armor proficiency');
 c.proficiencies.push({id:crypto.randomUUID(),category:'armor',name:'Heavy armor'});expect(equipmentWarnings(c).join()).not.toContain('ingen kjent armor proficiency');
 c.proficiencies=[];c.items=[];equip(c,'half-plate');expect(equipmentWarnings(c).join()).not.toContain('ingen kjent armor proficiency');
});
it('a deliberate one-handed override for a two-handed weapon warns and remains saveable',()=>{
 const c=character(),i=equip(c,'greatsword');i.grip='one';equip(c,'shield');expect(equipmentWarnings(c).join()).toContain('Avtal unntaket');expect(characterSchema.safeParse(c).success).toBe(true);
});

it('explicit damage total matching catalog base text is still a manual total, never gets an extra ability bonus',()=>{
 const c=character(),i=equip(c,'dagger');i.damageOverride='1d4 Piercing';expect(deriveWeapon(c,i).damage).toBe('1d4 Piercing');
 delete i.damageOverride;expect(deriveWeapon(c,i).damage).toBe('1d4+3 piercing');
});

it('unknown custom weapon categories do not silently grant proficiency from Fighter',()=>{
 const c=character(),i=equip(c,'longsword');i.weaponProfile!.category='custom';expect(deriveWeapon(c,i).attack).toBe('d20+3');i.proficient=true;expect(deriveWeapon(c,i).attack).toBe('d20+5');
});
it('different custom enchantments on ordinary catalog instances keep independent explicit bonuses',()=>{
 const c=character(),a=equip(c,'dagger'),b=equip(c,'dagger');a.bonuses={ac:1};b.bonuses={ac:2};a.name='DM blade A';b.name='DM blade B';expect(deriveStats(c).ac).toBe(15);expect(equipmentWarnings(c).join()).not.toContain('Like magiske');
});

it('legacy empty attack/damage fields mean automatic catalog values, without mutating those fields',()=>{
 const c=character(),i=equip(c,'dagger');i.attack='';i.damage='';const before=structuredClone(i);expect(deriveWeapon(c,i)).toMatchObject({attack:'d20+5',damage:'1d4+3 piercing'});expect(i).toEqual(before);
});
