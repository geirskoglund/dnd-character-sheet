import { characterSchema, type Character } from './model';
import { characterSchema as legacySchema } from './legacy-model';
import { speciesCatalog, classCatalog } from './catalog';
export function migrateCharacter(input: unknown): Character {
  if (!input || typeof input !== 'object' || !('schemaVersion' in input) || input.schemaVersion !== 1) return characterSchema.parse(input);
  const old = legacySchema.parse(input);
  const { species, speed, ...rest } = old;
  const known = speciesCatalog.find(s => s.name.toLowerCase() === species.toLowerCase());
  return characterSchema.parse({ ...rest, schemaVersion: 2,
    species: known ? structuredClone(known) : { name: species, walkingSpeed: null, ignoresHeavyArmorSpeedPenalty: false, traits: [], languages: [] },
    classes: old.classes.map(cl => {
      const knownClass = classCatalog.find(d => d.name.toLowerCase() === cl.name.toLowerCase());
      return knownClass && !cl.definitionRef ? { ...cl, definitionRef: { kind: 'catalog', id: knownClass.catalogId } } : cl;
    }),
    // v1 numbers were explicit user input. Keep them until the user removes the override.
    speedOverride: speed, unarmoredDefense: 'auto',
  });
}
