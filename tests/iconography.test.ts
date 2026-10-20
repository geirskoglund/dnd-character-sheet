import {afterEach,describe,expect,it} from 'vitest';
import {iconKeys,spellIcon,itemIcon,featureIcon,traitIcon,damageIcon} from '../src/domain/iconography';
import {icon} from '../src/ui/icons';
import {characterSchema,createCharacter,copyCharacter} from '../src/domain/model';
import {equipmentCatalog,instantiateEquipment,speciesCatalog} from '../src/domain/catalog';
import {spellLibrary,featureLibrary,instantiateSpell,instantiateFeature} from '../src/domain/character-library';
import {openDatabase,CharacterRepository} from '../src/storage/database';
import {exportBackup,importBackup} from '../src/storage/backup';
import {hpAfterChange,hpDeltaBounds,clampHpDelta} from '../src/domain/derived';

describe('visual categories with complete fallback coverage',()=>{
 it('uses actual weapon families and armor kinds, preserving a renamed catalog item',()=>{
  for(const [id,expected] of [['longsword','sword'],['crossbow,-light','crossbow'],['longbow','bow'],['dagger','dagger'],['leather','armor-light'],['half-plate','armor-medium'],['chain-mail','armor-heavy'],['shield','shield']] as const){
   const item=instantiateEquipment(`srd51:equipment:${id}`);item.name='Navnet fra DM';expect(itemIcon(item)).toBe(expected);
  }
 });
 it('uses damage and known spell effects without guessing mechanics from custom descriptions',()=>{
  for(const [id,expected] of [['acid-arrow','acid'],['fire-bolt','fire'],['ray-of-frost','cold'],['cure-wounds','healing'],['shield','protection'],['misty-step','teleport'],['minor-illusion','illusion'],['mage-hand','hand']] as const)expect(spellIcon(instantiateSpell(`srd51:spell:${id}`))).toBe(expected);
  expect(damageIcon('1d6 fire + 1d6 cold')).toBeUndefined();
  expect(spellIcon({damage:'Flammer som DM avgjør'})).toBe('magic');
  expect(spellIcon({damage:'1d6 Fire',iconKey:'moon'})).toBe('moon');
 });
 it('covers every existing catalog post and species trait with an available local SVG',()=>{
  const resolved=[...equipmentCatalog.map(row=>itemIcon(instantiateEquipment(row.catalogId))),...spellLibrary.map(row=>spellIcon(instantiateSpell(row.id))),...featureLibrary.map(row=>featureIcon(instantiateFeature(row.id))),...speciesCatalog.flatMap(row=>row.traits.map(traitIcon))];
  for(const key of [...resolved,...iconKeys]){expect(iconKeys).toContain(key);expect(icon(key)).toContain('<svg');expect(icon(key)).not.toContain('undefined');}
 });
 it('gives unknown and custom content a coherent family or neutral fallback',()=>{
  expect(traitIcon({name:'Ny egenskap fra DM'})).toBe('species');
  expect(featureIcon({name:'Min avtale',category:'custom'})).toBe('emblem');
  expect(featureIcon({name:'Ny feat',category:'feat'})).toBe('feat');
  expect(itemIcon({category:'magic'})).toBe('magic');
  expect(itemIcon({category:'equipment'})).toBe('equipment');
  expect(featureIcon({name:'Ny egenskap',category:'custom',iconKey:'healing'})).toBe('healing');
 });
 it('accepts old records without new fields and rejects untrusted icon markup',()=>{
  const c=createCharacter('Alva');c.items.push(instantiateEquipment('srd51:equipment:dagger'));
  expect(characterSchema.parse(c).items[0].iconKey).toBeUndefined();
  expect(characterSchema.safeParse({...c,items:[{...c.items[0],iconKey:'<svg onload=alert(1)>'}]}).success).toBe(false);
 });
});

describe('icon choice stays with the record through storage, backup, copy and undo',()=>{
 const databases:IDBDatabase[]=[];
 afterEach(async()=>{for(const db of databases){const name=db.name;db.close();await new Promise<void>((resolve,reject)=>{const r=indexedDB.deleteDatabase(name);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error);});}databases.length=0;});
 it('preserves optional choices without changing gameplay fields or overwriting automatic defaults',async()=>{
  const db=await openDatabase(`icons-${crypto.randomUUID()}`);databases.push(db);const repo=new CharacterRepository(db);
  const c=createCharacter('Alva');c.items=[{...instantiateEquipment('srd51:equipment:dagger'),iconKey:'moon'}];
  c.spells=[{...instantiateSpell('srd51:spell:light'),iconKey:'radiant'}];
  c.features=[{...instantiateFeature(featureLibrary[0].id),iconKey:'luck'}];
  const saved=await repo.save(c,'create','Opprettet');
  const copy=copyCharacter(saved);expect(copy.items[0].id).not.toBe(saved.items[0].id);expect(copy.items[0].iconKey).toBe('moon');
  expect(copy.spells[0].iconKey).toBe('radiant');expect(copy.features[0].iconKey).toBe('luck');
  const backup=await exportBackup(db,[saved]);const other=await openDatabase(`icons-${crypto.randomUUID()}`);databases.push(other);
  const [restored]=await importBackup(other,backup);expect(restored.items).toEqual(saved.items);expect(restored.spells).toEqual(saved.spells);
  const edited=await repo.save({...saved,items:[{...saved.items[0],iconKey:'fire'}]},'icon','Ikon endret');await repo.undo(edited);
  const after=(await repo.list())[0];expect(after.items[0].iconKey).toBe('moon');expect(after.items[0].weaponProfile).toEqual(c.items[0].weaponProfile);
 });
});

describe('bounded HP adjustments',()=>{
 it('includes temporary HP in the damage bound and clamps healing to missing regular HP',()=>{
  const hp={current:28,max:38,temp:5};expect(hpDeltaBounds(hp)).toEqual({min:-33,max:10});
  expect(hpAfterChange(hp,clampHpDelta(hp,-8))).toEqual({current:25,max:38,temp:0});
  expect(hpAfterChange(hp,clampHpDelta(hp,-1000))).toEqual({current:0,max:38,temp:0});
  expect(hpAfterChange(hp,clampHpDelta(hp,1000))).toEqual({current:38,max:38,temp:5});
 });
 it('handles zero HP with remaining temporary HP, full HP and a zero maximum',()=>{
  expect(hpDeltaBounds({current:0,max:12,temp:5})).toEqual({min:-5,max:12});
  expect(clampHpDelta({current:12,max:12,temp:0},3)).toBe(0);
  expect(clampHpDelta({current:0,max:0,temp:0},-3)).toBe(-0);
 });
});
