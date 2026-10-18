import { z } from 'zod';

const id = z.uuid();
const text = z.string().max(10000);
const count = z.number().int().nonnegative();
const ref = z.object({ kind: z.enum(['catalog', 'feature', 'spell', 'item', 'custom']), id: z.string().min(1) });
const condition = z.object({ description: text, state: z.enum(['true', 'false', 'unknown']) });
export const abilities = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const;
const economy = z.enum(['action', 'bonus', 'reaction', 'none', 'passive']);
const proficiency = z.enum(['none', 'proficient', 'expertise']);
const resource = z.object({
  id, ownerCharacterId: id, name: text, current: count, max: count, unit: text.optional(),
  kind: z.enum(['custom', 'spellSlot', 'hitDie']), spellLevel: count.optional(), systemRef: z.string().optional(),
  die: z.enum(['d6', 'd8', 'd10', 'd12']).optional(), classRef: id.optional(), sourceRef: ref.optional(),
  recharge: z.object({ kind: z.enum(['shortRest', 'longRest', 'manual', 'special']), ruleText: text.optional() }),
});
const action = z.object({ id, name: text, actionEconomy: economy, sourceRef: ref.optional(), summary: text,
  detail: text, attackRoll: text.optional(), damageRolls: z.array(text), saveDC: z.number().optional(),
  range: text.optional(), requirements: text.optional(), resourceRefs: z.array(id) });
const effect = z.object({ id, sourceRef: ref.optional(), target: z.enum(['damage', 'ac', 'speed', 'roll', 'other']),
  operation: z.enum(['flatReduction', 'resistance', 'vulnerability', 'immunity', 'bonus', 'override', 'manual']),
  amount: z.number().optional(), damageTypes: z.array(z.string()), condition: condition.optional(),
  scope: z.enum(['component', 'event']), description: text, activeStateRef: id.optional() });
export const characterSchema = z.object({
  schemaVersion: z.literal(1), id, revision: count, name: z.string().trim().min(1).max(100),
  createdAt: z.iso.datetime(), updatedAt: z.iso.datetime(),
  level: z.number().int().min(1).max(20),
  classes: z.array(z.object({ id, name: z.string().max(100), subclass: z.string().max(100).optional(),
    definitionRef: ref.optional(), level: z.number().int().min(1).max(20) })),
  species: z.string().max(100), backgroundNoteId: id.optional(), campaignId: id.optional(), portraitAssetId: id.optional(),
  abilityScores: z.object({ STR: count, DEX: count, CON: count, INT: count, WIS: count, CHA: count }),
  proficiencyBonusOverride: z.number().optional(), derivedOverrides: z.record(z.string(), z.number()),
  hp: z.object({ current: count, max: count, temp: count }), acOverride: z.number(), speed: count,
  inspiration: z.boolean(), deathSaves: z.object({ successes: count.max(3), failures: count.max(3) }),
  skills: z.array(z.object({ skillId: z.string(), proficiencyLevel: proficiency, override: z.number().optional() })),
  saves: z.array(z.object({ abilityId: z.enum(abilities), proficiencyLevel: proficiency, override: z.number().optional() })),
  languages: z.array(z.object({ id, name: text, sourceRef: ref.optional() })),
  proficiencies: z.array(z.object({ id, category: z.enum(['armor', 'weapon', 'tool', 'other']), name: text,
    referenceId: z.string().optional(), level: proficiency.optional() })),
  damageDefenses: z.array(z.object({ id, damageType: z.string(), kind: z.enum(['resistance', 'vulnerability', 'immunity']),
    sourceRef: ref.optional(), condition: condition.optional() })),
  conditionImmunities: z.array(z.object({ id, conditionId: z.string(), sourceRef: ref.optional() })),
  conditions: z.array(z.string()), exhaustionLevel: count.max(6), resources: z.array(resource),
  features: z.array(z.object({ id, name: text, category: z.enum(['class', 'species', 'feat', 'custom', 'item']),
    sourceRef: ref.optional(), description: text, actionRefs: z.array(id), resourceRefs: z.array(id),
    effectRefs: z.array(id), activeStateRef: id.optional() })),
  actions: z.array(action), effects: z.array(effect),
  spells: z.array(z.object({ id, definitionRef: ref.optional(), name: text, spellLevel: count.max(9),
    castingTime: text, actionEconomy: economy, range: text, duration: text, concentration: z.boolean(),
    ritual: z.boolean(), components: z.array(text), attack: text.optional(), save: text.optional(), damage: text.optional(),
    description: text, known: z.boolean(), inSpellbook: z.boolean(), prepared: z.boolean(),
    casterClassRef: id.optional(), resourceSystemRef: z.string().optional() })),
  items: z.array(z.object({ id, definitionRef: ref.optional(), name: text,
    category: z.enum(['weapon', 'armor', 'shield', 'equipment', 'magic']), quantity: count, equipped: z.boolean(),
    handUsage: z.enum(['one', 'two', 'versatile']).optional(), attack: text.optional(), damage: text.optional(),
    acContribution: z.number().optional(), effectRefs: z.array(id), resourceRefs: z.array(id), notes: text.optional() })),
  notes: z.array(z.object({ id, title: z.string().trim().min(1).max(100), body: text })),
  favoriteModifierRefs: z.array(z.string()).length(4), goldCp: count,
  activeStates: z.array(z.object({ id, sourceRef: ref.optional(), name: text, active: z.boolean() })),
}).strict().superRefine((character, ctx) => {
  if (character.classes.length && character.classes.reduce((sum, cl) => sum + cl.level, 0) !== character.level) {
    ctx.addIssue({ code: 'custom', path: ['classes'], message: 'Klassenivå må summere til karakterens level.' });
  }
  const collections = ['classes', 'languages', 'proficiencies', 'damageDefenses', 'conditionImmunities',
    'resources', 'features', 'actions', 'effects', 'spells', 'items', 'notes', 'activeStates'] as const;
  const ids = new Set([character.id]);
  for (const collection of collections) {
    for (const entity of character[collection]) {
      if (ids.has(entity.id)) ctx.addIssue({ code: 'custom', path: [collection], message: 'Duplisert instans-ID.' });
      ids.add(entity.id);
    }
  }
  for (const pool of character.resources) {
    if (pool.ownerCharacterId !== character.id) ctx.addIssue({ code: 'custom', path: ['resources'], message: 'Ressurs tilhører en annen karakter.' });
  }
  if (character.backgroundNoteId && !character.notes.some(note => note.id === character.backgroundNoteId)) {
    ctx.addIssue({ code: 'custom', path: ['backgroundNoteId'], message: 'Bakgrunnsnotatet finnes ikke.' });
  }
});
export type Character = z.infer<typeof characterSchema>;
export interface ChangeEvent {
  id: string; characterId: string; timestamp: string; version: 1; type: string; description: string;
  changes: { entityRef: string; path: string; before: Character | null; after: Character | null }[];
}
export interface CatalogEntry { id: string; origin: 'srd-5.1' | 'custom'; name: string; license: string; sourceUrl?: string; data: unknown }
export interface PortraitAsset { id: string; mimeType: 'image/png' | 'image/jpeg' | 'image/webp'; dataUrl: string }
export function createCharacter(name = 'Ny karakter'): Character {
  const now = new Date().toISOString();
  return characterSchema.parse({ schemaVersion: 1, id: crypto.randomUUID(), revision: 0, name,
    createdAt: now, updatedAt: now, level: 1, classes: [], species: '',
    abilityScores: Object.fromEntries(abilities.map(a => [a, 10])), derivedOverrides: {},
    hp: { current: 0, max: 0, temp: 0 }, acOverride: 10, speed: 30, inspiration: false,
    deathSaves: { successes: 0, failures: 0 }, skills: [], saves: [], languages: [], proficiencies: [],
    damageDefenses: [], conditionImmunities: [], conditions: [], exhaustionLevel: 0, resources: [],
    features: [], actions: [], effects: [], spells: [], items: [], notes: [],
    favoriteModifierRefs: ['Perception', 'Insight', 'Stealth', 'Initiative'], goldCp: 0, activeStates: [] });
}
/** Remap instance IDs and internal references together, leaving catalog references intact. */
export function copyCharacter(source: Character): Character {
  const copy = structuredClone(source);
  const ids = new Map<string, string>();
  function collect(value: unknown) {
    if (!value || typeof value !== 'object') return;
    if (!('kind' in value) && 'id' in value && typeof value.id === 'string') ids.set(value.id, crypto.randomUUID());
    Object.values(value).forEach(collect);
  }
  collect(copy);
  function remap(value: unknown): unknown {
    if (typeof value === 'string') return ids.get(value) ?? value;
    if (Array.isArray(value)) return value.map(remap);
    if (value && typeof value === 'object') {
      if ('kind' in value && value.kind === 'catalog') return value;
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, remap(v)]));
    }
    return value;
  }
  const result = remap(copy) as Character;
  result.name = `${source.name.slice(0, 92)} (kopi)`;
  result.revision = 0;
  result.createdAt = result.updatedAt = new Date().toISOString();
  return characterSchema.parse(result);
}
