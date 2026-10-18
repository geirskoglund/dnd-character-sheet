import { characterSchema, type Character } from './model';

/** Manual registration of one gained class level; never rolls dice or grants rules content. */
export function levelUpCharacter(source: Character, classId: string, maxHp: number, subclass?: string): Character {
  if (!Number.isInteger(maxHp) || maxHp < source.hp.max || maxHp < 1) throw new Error('Angi ny samlet maks HP, minst lik tidligere maks HP.');
  const draft = structuredClone(source);
  const cl = draft.classes.find(c => c.id === classId);
  if (!cl) throw new Error('Velg klassen som øker i nivå.');
  if (draft.level >= 20) throw new Error('Karakteren er allerede level 20.');
  cl.level += 1;
  if (subclass !== undefined) cl.subclass = subclass;
  draft.level += 1;
  draft.hp.max = maxHp;
  // Gaining a level does not imply a rest or erase current damage/temporary HP.
  return characterSchema.parse(draft);
}
