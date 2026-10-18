import { z } from 'zod';
import { characterSchema, type Character } from '../domain/model';
import { completed, request } from './database';

const portraitSchema = z.object({ id: z.uuid(), mimeType: z.enum(['image/png', 'image/jpeg', 'image/webp']),
  dataUrl: z.string().max(3_000_000).regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/) });
const backupSchema = z.object({ schemaVersion: z.literal(1), exportedAt: z.iso.datetime(),
  characters: z.array(characterSchema).min(1).max(100), portraitAssets: z.array(portraitSchema).max(100) }).strict();
export function parseBackup(raw: string) {
  if (raw.length > 20_000_000) throw new Error('Backup er for stor (maks 20 MB).');
  const result = backupSchema.safeParse(JSON.parse(raw));
  if (!result.success) throw new Error('Ugyldig backup eller ukjent skjemaversjon. Ingen data er importert.');
  const ids = result.data.characters.map(c => c.id);
  if (new Set(ids).size !== ids.length) throw new Error('Backup inneholder dupliserte karakter-ID-er.');
  const assetIds = new Set(result.data.portraitAssets.map(a => a.id));
  if (assetIds.size !== result.data.portraitAssets.length) throw new Error('Dupliserte portrett-ID-er.');
  for (const c of result.data.characters) {
    if (c.portraitAssetId && !assetIds.has(c.portraitAssetId)) throw new Error('Backup mangler portrett.');
  }
  return result.data;
}
export async function exportBackup(db: IDBDatabase, characters: Character[]) {
  const tx = db.transaction('assets');
  const assets = await request(tx.objectStore('assets').getAll());
  return JSON.stringify(backupSchema.parse({ schemaVersion: 1, exportedAt: new Date().toISOString(), characters,
    portraitAssets: assets.filter(a => characters.some(c => c.portraitAssetId === a.id)) }), null, 2);
}
/** All-or-nothing restore. Collisions are rejected, never overwritten. */
export async function importBackup(db: IDBDatabase, raw: string) {
  const backup = parseBackup(raw);
  const tx = db.transaction(['characters', 'assets', 'events'], 'readwrite');
  const done = completed(tx);
  try {
    for (const character of backup.characters) {
      if (await request(tx.objectStore('characters').get(character.id))) {
        throw new Error('En karakter med samme ID finnes allerede. Ingen data er importert.');
      }
      tx.objectStore('characters').add(character);
      tx.objectStore('events').add({ id: crypto.randomUUID(), characterId: character.id,
        timestamp: new Date().toISOString(), type: 'import', description: 'Karakter importert', version: 1,
        changes: [{ entityRef: character.id, path: '/', before: null, after: character }] });
    }
    for (const asset of backup.portraitAssets) {
      const existing = await request(tx.objectStore('assets').get(asset.id));
      if (existing && JSON.stringify(existing) !== JSON.stringify(asset)) throw new Error('Portrett-ID er allerede i bruk.');
      tx.objectStore('assets').put(asset);
    }
    await done;
  } catch (error) {
    try { tx.abort(); } catch { /* already completed */ }
    await done.catch(() => {});
    throw error;
  }
  return backup.characters;
}
