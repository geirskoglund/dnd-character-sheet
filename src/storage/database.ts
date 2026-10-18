import { migrateCharacter } from '../domain/migrations';
import { characterSchema, portraitSchema, type PortraitAsset, type Character, type ChangeEvent } from '../domain/model';

export const DB_NAME = 'dnd-character-companion';
export const DB_VERSION = 3;
export const request = <T>(req: IDBRequest<T>) => new Promise<T>((resolve, reject) => {
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});
export const completed = (tx: IDBTransaction) => new Promise<void>((resolve, reject) => {
  tx.oncomplete = () => resolve();
  tx.onabort = () => reject(tx.error ?? new Error('Lagringen ble avbrutt.'));
  tx.onerror = () => reject(tx.error);
});
export function openDatabase(name = DB_NAME): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(name, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      // v1: foundational stores. v2 adds an index without rewriting character data.
      for (const store of ['characters', 'catalog', 'assets', 'events', 'settings']) {
        if (!db.objectStoreNames.contains(store)) db.createObjectStore(store, { keyPath: 'id' });
      }
      const events = req.transaction!.objectStore('events');
      if (!events.indexNames.contains('characterId')) events.createIndex('characterId', 'characterId');
      // v3 migrates both aggregates and audit snapshots in the same upgrade transaction.
      for (const name of ['characters', 'events']) {
        const cursor = req.transaction!.objectStore(name).openCursor();
        cursor.onsuccess = () => {
          const row = cursor.result;
          if (!row) return;
          try {
            const value = row.value;
            if (name === 'characters') row.update(migrateCharacter(value));
            else {
              for (const change of value.changes ?? []) {
                if (change.before) change.before = migrateCharacter(change.before);
                if (change.after) change.after = migrateCharacter(change.after);
              }
              row.update(value);
            }
            row.continue();
          } catch { req.transaction!.abort(); }
        };
      }
    };
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('Lukk andre faner med appen og prøv igjen for å oppgradere databasen.'));
    req.onsuccess = () => {
      req.result.onversionchange = () => req.result.close();
      resolve(req.result);
    };
  });
}
export class CharacterRepository {
  constructor(readonly db: IDBDatabase) {}
  async list(): Promise<Character[]> {
    const tx = this.db.transaction('characters');
    const rows = await request(tx.objectStore('characters').getAll());
    return rows.map(row => characterSchema.parse(row)).sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
  }
  async portrait(id: string): Promise<PortraitAsset | undefined> {
    const asset = await request(this.db.transaction('assets').objectStore('assets').get(id));
    return asset ? portraitSchema.parse(asset) : undefined;
  }
  async setting<T>(id: string): Promise<T | undefined> {
    return (await request(this.db.transaction('settings').objectStore('settings').get(id)))?.value;
  }
  async setSetting(id: string, value: unknown) {
    const tx = this.db.transaction('settings', 'readwrite');
    const done = completed(tx);
    tx.objectStore('settings').put({ id, value });
    await done;
  }
  async history(characterId: string): Promise<ChangeEvent[]> {
    const rows: ChangeEvent[] = await request(this.db.transaction('events').objectStore('events').index('characterId').getAll(characterId));
    return rows.sort((a, b) => b.timestamp.localeCompare(a.timestamp) || (b.changes[0].after?.revision ?? 0) - (a.changes[0].after?.revision ?? 0));
  }
  async save(input: Character, type = 'edit', description = 'Karakter redigert', asset?: PortraitAsset): Promise<Character> {
    const parsed = characterSchema.parse(input);
    if (asset) {
      portraitSchema.parse(asset);
      if (parsed.portraitAssetId !== asset.id) throw new Error('Portrettet må tilhøre karakterens nye portrettreferanse.');
    }
    const tx = this.db.transaction(['characters', 'events', 'assets'], 'readwrite');
    const done = completed(tx);
    // Always consume a transaction rejection, including on validation/conflict exits.
    const chars = tx.objectStore('characters');
    try {
      const before: Character | undefined = await request(chars.get(parsed.id));
      if (before && before.revision !== parsed.revision) throw new Error('Karakteren er endret i en annen fane. Last siden på nytt før du lagrer.');
      if (before && JSON.stringify(before) === JSON.stringify(parsed)) { await done; return before; }
      const after = { ...parsed, revision: (before?.revision ?? 0) + 1, updatedAt: new Date().toISOString() };
      if (asset) {
        const existing = await request(tx.objectStore('assets').get(asset.id));
        if (existing && JSON.stringify(existing) !== JSON.stringify(asset)) throw new Error('Portrett-ID er allerede i bruk.');
        if (!existing) tx.objectStore('assets').add(asset);
      }
      chars.put(after);
      tx.objectStore('events').add(this.event(after.id, before ?? null, after, type, description));
      await done;
      return after;
    } catch (error) {
      try { tx.abort(); } catch { /* already completed */ }
      await done.catch(() => {});
      throw error;
    }
  }
  async remove(character: Character) {
    const tx = this.db.transaction(['characters', 'events'], 'readwrite');
    const done = completed(tx);
    try {
      const before: Character | undefined = await request(tx.objectStore('characters').get(character.id));
      if (!before || before.revision !== character.revision) throw new Error('Karakteren er endret. Last siden på nytt.');
      tx.objectStore('characters').delete(character.id);
      tx.objectStore('events').add(this.event(character.id, before, null, 'delete', 'Karakter slettet'));
      await done;
    } catch (error) {
      try { tx.abort(); } catch { /* already completed */ }
      await done.catch(() => {});
      throw error;
    }
  }
  async undo(character: Character) {
    const history = await this.history(character.id);
    const last = history[0];
    if (!last || last.type === 'undo' || !last.changes[0].before ||
      JSON.stringify(last.changes[0].after) !== JSON.stringify(character)) {
      throw new Error('Denne endringen kan ikke angres trygt. Korriger karakteren manuelt.');
    }
    return this.save({ ...last.changes[0].before, revision: character.revision }, 'undo', 'Siste endring angret');
  }
  private event(characterId: string, before: Character | null, after: Character | null, type: string, description: string): ChangeEvent {
    return { id: crypto.randomUUID(), characterId, timestamp: new Date().toISOString(), version: 1,
      type, description, changes: [{ entityRef: characterId, path: '/', before, after }] };
  }
}
