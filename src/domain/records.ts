import { characterSchema, type Character } from './model';
import { hpAfterChange } from './derived';

export const damageTypes = ['Acid', 'Bludgeoning', 'Cold', 'Fire', 'Force', 'Lightning', 'Necrotic', 'Piercing', 'Poison', 'Psychic', 'Radiant', 'Slashing', 'Thunder'];
export const conditionNames = ['Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified', 'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious'];
export const normalizeSkill = (name: string) => name.split(':').at(-1)!.replaceAll('-', ' ').toLowerCase();
export type RecordCollection = 'features' | 'languages' | 'proficiencies' | 'damageDefenses' | 'conditionImmunities' | 'spells' | 'resources' | 'actions' | 'effects';
/** Remove owned children together and detach references to deleted records. Shared children survive. */
export function removeRecord(character: Character, collection: RecordCollection, id: string): Character {
  const c = structuredClone(character);
  const deleted = new Set([id]);
  c[collection] = c[collection].filter(row => row.id !== id) as never;
  if (collection === 'features') {
    for (const name of ['actions', 'resources', 'effects', 'activeStates'] as const) {
      c[name] = c[name].filter(row => {
        const shared = [...c.features, ...c.items, ...c.actions, ...c.effects].some(owner =>
          ('actionRefs' in owner && owner.actionRefs.includes(row.id)) || ('resourceRefs' in owner && owner.resourceRefs.includes(row.id)) || ('effectRefs' in owner && owner.effectRefs.includes(row.id)) || ('activeStateRef' in owner && owner.activeStateRef === row.id));
        if (row.sourceRef?.kind === 'feature' && row.sourceRef.id === id && !shared) { deleted.add(row.id); return false; }
        return true;
      }) as never;
    }
  }
  for (const owner of [...c.features, ...c.items]) {
    owner.resourceRefs = owner.resourceRefs.filter(ref => !deleted.has(ref));
    owner.effectRefs = owner.effectRefs.filter(ref => !deleted.has(ref));
    if ('actionRefs' in owner) owner.actionRefs = owner.actionRefs.filter(ref => !deleted.has(ref));
  }
  for (const action of c.actions) action.resourceRefs = action.resourceRefs.filter(ref => !deleted.has(ref));
  return characterSchema.parse(c);
}
/** Catalog languages become editable character instances only when a language change is committed. */
export function materializeLanguages(character: Character): Character {
  const c = structuredClone(character);
  for (const name of c.species.languages) {
    if (!c.languages.some(row => row.name.toLowerCase() === name.toLowerCase())) c.languages.push({id:crypto.randomUUID(), name,
      sourceRef:c.species.catalogId ? {kind:'catalog', id:c.species.catalogId} : undefined});
  }
  c.species.languages = [];
  return c;
}
export function useHitDie(character: Character, resourceId: string, rolled: number): Character {
  const c = structuredClone(character), pool = c.resources.find(row => row.id === resourceId);
  if (!pool || pool.kind !== 'hitDie' || !pool.die || pool.current < 1) throw new Error('Ingen tilgjengelig Hit Die i denne ressursen.');
  if (!Number.isInteger(rolled) || rolled < 1 || rolled > Number(pool.die.slice(1))) throw new Error('Angi resultatet fra én fysisk terning.');
  const healing = Math.max(0, rolled + Math.floor((c.abilityScores.CON - 10) / 2));
  pool.current--;
  c.hp = hpAfterChange(c.hp, healing);
  return characterSchema.parse(c);
}
export function restCharacter(character: Character, kind: 'shortRest' | 'longRest', recoverHitDice: Record<string, number> = {}): Character {
  const c = structuredClone(character);
  const recovered = Object.entries(recoverHitDice).reduce((sum, [id, amount]) => {
    const pool = c.resources.find(row => row.id === id);
    if (!pool || pool.kind !== 'hitDie' || !Number.isInteger(amount) || amount < 0 || pool.current + amount > pool.max) throw new Error('Kontroller antall Hit Dice som gjenopprettes.');
    return sum + amount;
  }, 0);
  if (kind === 'shortRest' && recovered) throw new Error('Hit Dice gjenopprettes ved Long Rest.');
  if (recovered > Math.max(1, Math.floor(c.level / 2))) throw new Error('Long Rest gjenoppretter høyst halvparten av totalt level i Hit Dice (minst én).');
  for (const pool of c.resources) {
    if (pool.kind === 'hitDie') pool.current += recoverHitDice[pool.id] ?? 0;
    else if (pool.recharge.kind === 'shortRest' || (kind === 'longRest' && pool.recharge.kind === 'longRest')) pool.current = pool.max;
  }
  if (kind === 'longRest') { c.hp.current = c.hp.max; c.hp.temp = 0; }
  return characterSchema.parse(c);
}
