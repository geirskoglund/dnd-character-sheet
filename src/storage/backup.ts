import {wizardDraftSchema,draftPrefix} from '../domain/wizard-draft';
import { z } from 'zod';
import { characterSchema, portraitSchema, type Character } from '../domain/model';
import { migrateCharacter } from '../domain/migrations';
import { characterSchema as legacySchema } from '../domain/legacy-model';
import { completed, request } from './database';

const backupSchema = z.object({ schemaVersion: z.literal(2), exportedAt: z.iso.datetime(),
  characters: z.array(characterSchema).min(1).max(100), portraitAssets: z.array(portraitSchema).max(100),wizardDrafts:z.array(wizardDraftSchema).max(200).optional() }).strict();
const legacyBackupSchema = backupSchema.extend({ schemaVersion: z.literal(1), characters: z.array(legacySchema).min(1).max(100) })
  .transform(backup => ({ ...backup, schemaVersion: 2 as const, characters: backup.characters.map(migrateCharacter) }));
const backupInputSchema = z.union([backupSchema, legacyBackupSchema]);
export function parseBackup(raw: string) {
  if (raw.length > 20_000_000) throw new Error('Backup er for stor (maks 20 MB).');
  const result = backupInputSchema.safeParse(JSON.parse(raw));
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
  const tx = db.transaction(['assets','settings']);
  const assets = await request(tx.objectStore('assets').getAll());
  const drafts=(await request(tx.objectStore('settings').getAll())).filter(row=>row.id.startsWith(draftPrefix)).map(row=>wizardDraftSchema.parse(row.value)).filter(d=>!d.characterId||characters.some(c=>c.id===d.characterId));
  return JSON.stringify(backupSchema.parse({ schemaVersion: 2, exportedAt: new Date().toISOString(), characters,
    ...(drafts.length?{wizardDrafts:drafts}:{}),portraitAssets: assets.filter(a => characters.some(c => c.portraitAssetId === a.id)||drafts.some(d=>d.kind==='character'&&(d.payload as {source?:Character})?.source?.portraitAssetId===a.id)) }), null, 2);
}
/** All-or-nothing restore. Collisions are rejected, never overwritten. */
export async function importBackup(db: IDBDatabase, raw: string) {
  const backup = parseBackup(raw);
  const tx = db.transaction(['characters', 'assets', 'events','settings'], 'readwrite');
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
    for(const draft of backup.wizardDrafts??[]){if(draft.characterId&&!backup.characters.some(c=>c.id===draft.characterId))throw new Error('Et utkast mangler tilhørende karakter.');const settings=tx.objectStore('settings');if(await request(settings.get(draftPrefix+draft.id)))throw new Error('Et utkast med samme ID finnes allerede. Ingen data er importert.');settings.add({id:draftPrefix+draft.id,value:draft});}
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
