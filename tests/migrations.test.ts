import { afterEach, expect, it } from 'vitest';
import { createCharacter } from '../src/domain/model';
import { characterSchema as legacySchema } from '../src/domain/legacy-model';
import { migrateCharacter } from '../src/domain/migrations';
import { CharacterRepository, completed, openDatabase, request } from '../src/storage/database';
import { importBackup } from '../src/storage/backup';
const dbs: IDBDatabase[] = [];
afterEach(() => { dbs.forEach(db => db.close()); dbs.length = 0; });
function legacyCharacter() {
  const c = createCharacter('Eldre karakter');
  const { speedOverride, unarmoredDefense, consumables, ...rest } = c;
  return legacySchema.parse({ ...rest, schemaVersion: 1, species: 'Dwarf', speed: 35, acOverride: 19 });
}
it('preserves v1 values and IDs and does not mutate its source', () => {
  const old = legacyCharacter(); const snapshot = structuredClone(old);
  const next = migrateCharacter(old);
  expect(next.id).toBe(old.id); expect(next.species.name).toBe('Dwarf');
  expect(next.species.walkingSpeed).toBe(25); expect(next.speedOverride).toBe(35); expect(next.acOverride).toBe(19);
  expect(next.schemaVersion).toBe(2); expect(old).toEqual(snapshot);
  expect(migrateCharacter(next)).toEqual(next);
});
it('upgrades a v2 database with character and audit snapshots, preserving undo', async () => {
  const name = crypto.randomUUID(), old = legacyCharacter();
  const before = { ...old, name: 'Før endring', revision: 1 }; old.revision = 2;
  const req = indexedDB.open(name, 2);
  req.onupgradeneeded = () => {
    for (const store of ['characters','events','catalog','assets','settings']) req.result.createObjectStore(store, { keyPath: 'id' });
    req.transaction!.objectStore('events').createIndex('characterId', 'characterId');
  };
  const db = await request(req);
  const tx = db.transaction(['characters','events','settings'], 'readwrite'), done = completed(tx);
  tx.objectStore('characters').put(old);
  tx.objectStore('settings').put({ id: 'selectedCharacter', value: old.id });
  tx.objectStore('events').put({ id: crypto.randomUUID(), characterId: old.id, timestamp: old.updatedAt, type: 'edit', description: 'Name changed', version: 1,
    changes: [{ entityRef: old.id, path: '/', before, after: old }] });
  await done; db.close();
  const current = await openDatabase(name); dbs.push(current); const repo = new CharacterRepository(current);
  const [c] = await repo.list();
  expect(current.version).toBe(3); expect(c.speedOverride).toBe(35);
  expect(await repo.setting('selectedCharacter')).toBe(old.id);
  expect((await repo.history(c.id))[0].changes[0].before?.schemaVersion).toBe(2);
  expect((await repo.undo(c)).name).toBe('Før endring');
});
it('restores v1 backups without replacing their manual AC, speed or spell data', async () => {
  const db = await openDatabase(crypto.randomUUID()); dbs.push(db);
  const old = legacyCharacter();
  old.notes.push({id:crypto.randomUUID(),title:'Gammelt notat',body:'Bevares'});
  old.spells.push({id:crypto.randomUUID(),name:'Egen spell',spellLevel:0,castingTime:'1 action',actionEconomy:'action',range:'60 ft',duration:'Instantaneous',concentration:false,ritual:false,components:['V'],description:'Brukerens tekst',known:true,inSpellbook:false,prepared:true});
  await importBackup(db, JSON.stringify({ schemaVersion: 1, exportedAt: old.updatedAt, characters: [old], portraitAssets: [] }));
  const [c] = await new CharacterRepository(db).list();
  expect(c.acOverride).toBe(19); expect(c.speedOverride).toBe(35); expect(c.id).toBe(old.id);
  expect(c.spells).toEqual(old.spells); expect(c.notes).toEqual(old.notes);
});
it('aborts a failed upgrade without partially rewriting valid characters', async () => {
  const name = crypto.randomUUID(), old = legacyCharacter();
  const req = indexedDB.open(name, 2);
  req.onupgradeneeded = () => {
    for (const store of ['characters','events','catalog','assets','settings']) req.result.createObjectStore(store, {keyPath:'id'});
  };
  const db = await request(req);
  const tx = db.transaction('characters','readwrite'), done = completed(tx);
  tx.objectStore('characters').put(old);
  tx.objectStore('characters').put({...old,id:crypto.randomUUID(),schemaVersion:99});
  await done; db.close();
  await expect(openDatabase(name)).rejects.toThrow();
  const unchanged = await request(indexedDB.open(name, 2)); dbs.push(unchanged);
  expect(unchanged.version).toBe(2);
  expect(await request(unchanged.transaction('characters').objectStore('characters').get(old.id))).toEqual(old);
});
