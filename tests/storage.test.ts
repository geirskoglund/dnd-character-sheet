import { afterEach, describe, expect, it } from 'vitest';
import { createCharacter, copyCharacter, characterSchema } from '../src/domain/model';
import { CharacterRepository, completed, openDatabase, request } from '../src/storage/database';
import { exportBackup, importBackup, parseBackup } from '../src/storage/backup';
const dbs: IDBDatabase[] = [];
async function setup() {
  const db = await openDatabase(crypto.randomUUID()); dbs.push(db);
  return new CharacterRepository(db);
}
afterEach(() => { dbs.forEach(db => db.close()); dbs.length = 0; });
describe('character aggregate and persistence', () => {
  it('creates independent structured defaults and rejects invalid character values', () => {
    const a = createCharacter('A'), b = createCharacter('B');
    a.languages.push({ id: crypto.randomUUID(), name: 'Elvish' });
    expect(b.languages).toEqual([]);
    expect(a.id).not.toBe(b.id);
    expect(characterSchema.safeParse({ ...a, goldCp: 1.1 }).success).toBe(false);
    expect(characterSchema.safeParse({ ...a, level: 21 }).success).toBe(false);
    expect(characterSchema.safeParse({ ...a, name: ' ' }).success).toBe(false);
    expect(characterSchema.safeParse({ ...a, damageDefenses: ['fire'] }).success).toBe(false);
  });
  it('persists characters and selected identity across database reopen', async () => {
    const repo = await setup(); const name = repo.db.name;
    const c = await repo.save(createCharacter('Alva'));
    await repo.setSetting('selectedCharacter', c.id); repo.db.close();
    const reopened = new CharacterRepository(await openDatabase(name)); dbs.push(reopened.db);
    expect(await reopened.list()).toEqual([c]);
    expect(await reopened.setting('selectedCharacter')).toBe(c.id);
  });
  it('records whole confirmed changes and safely undoes the latest edit', async () => {
    const repo = await setup();
    let c = await repo.save(createCharacter('Alva'));
    c = await repo.save({ ...c, hp: { current: 8, max: 12, temp: 3 } });
    const h = await repo.history(c.id);
    expect(h).toHaveLength(2);
    expect(h[0].changes[0].before?.hp.current).toBe(0);
    expect(h[0].changes[0].after?.hp).toEqual({ current: 8, max: 12, temp: 3 });
    const undone = await repo.undo(c);
    expect(undone.hp).toEqual({ current: 0, max: 0, temp: 0 });
    await expect(repo.undo(undone)).rejects.toThrow('kan ikke angres');
  });
  it('rejects stale edits and stale deletes without partial audit events', async () => {
    const repo = await setup(); const original = await repo.save(createCharacter());
    const updated = await repo.save({ ...original, name: 'Ny' });
    await expect(repo.save({ ...original, name: 'Gammel' })).rejects.toThrow('annen fane');
    await expect(repo.remove(original)).rejects.toThrow('endret');
    expect(await repo.list()).toEqual([updated]);
    expect(await repo.history(original.id)).toHaveLength(2);
  });
  it('copies instance IDs and references without aliasing source or catalog', () => {
    const c = createCharacter('Alva');
    const featureId = crypto.randomUUID(), actionId = crypto.randomUUID(), poolId = crypto.randomUUID();
    c.features.push({ id: featureId, name: 'Own feature', category: 'custom', sourceRef: { kind: 'catalog', id: 'srd:test' }, description: '', actionRefs: [actionId], resourceRefs: [poolId], effectRefs: [] });
    c.actions.push({ id: actionId, name: 'Own action', sourceRef: { kind: 'feature', id: featureId }, actionEconomy: 'bonus', summary: '', detail: '', damageRolls: [], resourceRefs: [poolId] });
    c.resources.push({ id: poolId, ownerCharacterId: c.id, name: 'Uses', current: 1, max: 1, kind: 'custom', recharge: { kind: 'manual' } });
    const copy = copyCharacter(c);
    expect(copy.id).not.toBe(c.id);
    expect(copy.features[0].id).not.toBe(featureId);
    expect(copy.features[0].actionRefs).toEqual([copy.actions[0].id]);
    expect(copy.actions[0].sourceRef?.id).toBe(copy.features[0].id);
    expect(copy.resources[0].ownerCharacterId).toBe(copy.id);
    expect(copy.features[0].sourceRef?.id).toBe('srd:test');
    copy.resources[0].current = 0;
    expect(c.resources[0].current).toBe(1);
  });
  it('deletes only the chosen character and preserves audit history', async () => {
    const repo = await setup();
    const a = await repo.save(createCharacter('A')), b = await repo.save(createCharacter('B'));
    await repo.remove(a);
    expect(await repo.list()).toEqual([b]);
    expect((await repo.history(a.id)).some(e => e.type === 'delete')).toBe(true);
  });
  it('upgrades a v1 database without losing characters and indexes existing events', async () => {
    const name = crypto.randomUUID(), c = createCharacter('Before upgrade');
    const oldRequest = indexedDB.open(name, 1);
    oldRequest.onupgradeneeded = () => {
      for (const store of ['characters', 'catalog', 'assets', 'events', 'settings']) oldRequest.result.createObjectStore(store, { keyPath: 'id' });
    };
    const old = await request(oldRequest);
    const tx = old.transaction(['characters', 'events'], 'readwrite'); const done = completed(tx);
    tx.objectStore('characters').put(c);
    tx.objectStore('events').put({ id: crypto.randomUUID(), characterId: c.id, timestamp: new Date().toISOString(), type: 'create', changes: [] });
    await done; old.close();
    const db = await openDatabase(name); dbs.push(db);
    const repo = new CharacterRepository(db);
    expect(db.version).toBe(2);
    expect(await repo.list()).toEqual([c]);
    expect(await repo.history(c.id)).toHaveLength(1);
  });
});
describe('versioned backup', () => {
  it('round-trips complete structured data and portrait into an empty database', async () => {
    const repo = await setup(), target = await setup();
    const c = createCharacter('Alva'); c.notes.push({ id: crypto.randomUUID(), title: 'Bakgrunn', body: '<a>Historie</a>' });
    c.portraitAssetId = crypto.randomUUID(); c.goldCp = 12345;
    c.damageDefenses.push({ id: crypto.randomUUID(), damageType: 'fire', kind: 'resistance', condition: { description: 'DM confirms', state: 'unknown' } });
    const asset = { id: c.portraitAssetId, mimeType: 'image/png', dataUrl: 'data:image/png;base64,aGVsbG8=' };
    const tx = repo.db.transaction('assets', 'readwrite'); const done = completed(tx); tx.objectStore('assets').put(asset); await done;
    const saved = await repo.save(c);
    const raw = await exportBackup(repo.db, [saved]);
    await importBackup(target.db, raw);
    expect(await target.list()).toEqual([saved]);
    expect(parseBackup(await exportBackup(target.db, await target.list())).portraitAssets).toEqual([asset]);
    expect((await target.history(saved.id))[0].type).toBe('import');
  });
  it('rolls back an entire import when a later character collides', async () => {
    const repo = await setup(), existing = await repo.save(createCharacter('Existing')), fresh = createCharacter('Fresh');
    const raw = JSON.stringify({ schemaVersion: 1, exportedAt: new Date().toISOString(), characters: [fresh, existing], portraitAssets: [] });
    await expect(importBackup(repo.db, raw)).rejects.toThrow('samme ID');
    expect(await repo.list()).toEqual([existing]);
    expect(await repo.history(fresh.id)).toEqual([]);
  });
  it('rejects malformed, unsupported and incomplete backups before writing', async () => {
    const repo = await setup();
    await expect(importBackup(repo.db, '{bad')).rejects.toThrow();
    await expect(importBackup(repo.db, JSON.stringify({ schemaVersion: 9 }))).rejects.toThrow('skjemaversjon');
    const c = createCharacter(); c.portraitAssetId = crypto.randomUUID();
    await expect(importBackup(repo.db, JSON.stringify({ schemaVersion: 1, exportedAt: new Date().toISOString(), characters: [c], portraitAssets: [] }))).rejects.toThrow('portrett');
    expect(await repo.list()).toEqual([]);
  });
});

describe('aggregate invariants', () => {
  it('rejects inconsistent class levels and foreign-owned resources', () => {
    const c = createCharacter();
    c.classes = [{ id: crypto.randomUUID(), name: 'Fighter', level: 5 }];
    expect(characterSchema.safeParse(c).success).toBe(false);
    c.level = 5;
    expect(characterSchema.safeParse(c).success).toBe(true);
    c.resources.push({ id: crypto.randomUUID(), ownerCharacterId: crypto.randomUUID(), name: 'Slots', kind: 'spellSlot', current: 1, max: 1, recharge: { kind: 'manual' } });
    expect(characterSchema.safeParse(c).success).toBe(false);
  });
  it('rejects duplicate instance IDs and dangling background notes', () => {
    const c = createCharacter();
    c.notes = [{ id: c.id, title: 'Duplicate', body: '' }];
    expect(characterSchema.safeParse(c).success).toBe(false);
    c.notes = []; c.backgroundNoteId = crypto.randomUUID();
    expect(characterSchema.safeParse(c).success).toBe(false);
  });
});
