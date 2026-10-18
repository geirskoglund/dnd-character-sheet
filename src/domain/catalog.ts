import equipment from '../data/srd-equipment.json';
import type { Character } from './model';

// Curated SRD 5.1 (2014) facts. Adapted summaries; attribution: public/SRD-LICENSE.txt.
export const speciesCatalog: Character['species'][] = [
  { name: 'Dragonborn', walkingSpeed: 30, ignoresHeavyArmorSpeedPenalty: false, languages: ['Common', 'Draconic'], traits: [{ name: 'Draconic Ancestry', description: 'Velg drageopphav for breath weapon og damage resistance. Registreres særskilt.' }] },
  { name: 'Dwarf', walkingSpeed: 25, ignoresHeavyArmorSpeedPenalty: true, languages: ['Common', 'Dwarvish'], traits: [{ name: 'Dwarven Speed', description: 'Heavy armor reduserer ikke walking speed.' }, { name: 'Darkvision', description: '60 ft.' }] },
  { name: 'Elf', walkingSpeed: 30, ignoresHeavyArmorSpeedPenalty: false, languages: ['Common', 'Elvish'], traits: [{ name: 'Darkvision', description: '60 ft.' }, { name: 'Fey Ancestry', description: 'Advantage mot charmed; magi kan ikke legge deg i søvn.' }] },
  { name: 'Gnome', walkingSpeed: 25, ignoresHeavyArmorSpeedPenalty: false, languages: ['Common', 'Gnomish'], traits: [{ name: 'Darkvision', description: '60 ft.' }, { name: 'Gnome Cunning', description: 'Advantage på Intelligence, Wisdom og Charisma saving throws mot magi.' }] },
  { name: 'Half-Elf', walkingSpeed: 30, ignoresHeavyArmorSpeedPenalty: false, languages: ['Common', 'Elvish'], traits: [{ name: 'Darkvision', description: '60 ft.' }, { name: 'Fey Ancestry', description: 'Advantage mot charmed; magi kan ikke legge deg i søvn.' }] },
  { name: 'Half-Orc', walkingSpeed: 30, ignoresHeavyArmorSpeedPenalty: false, languages: ['Common', 'Orc'], traits: [{ name: 'Darkvision', description: '60 ft.' }, { name: 'Relentless Endurance', description: 'Ved 0 HP uten å dø direkte: kan beholde 1 HP. Én gang mellom long rests; registrer bruken manuelt.' }] },
  { name: 'Halfling', walkingSpeed: 25, ignoresHeavyArmorSpeedPenalty: false, languages: ['Common', 'Halfling'], traits: [{ name: 'Lucky', description: 'Ved 1 på d20 for attack, ability check eller save: kast om, bruk det nye resultatet.' }] },
  { name: 'Human', walkingSpeed: 30, ignoresHeavyArmorSpeedPenalty: false, languages: ['Common'], traits: [{ name: 'Extra Language', description: 'Velg ett ekstra språk fra karakterarket ditt.' }] },
  { name: 'Tiefling', walkingSpeed: 30, ignoresHeavyArmorSpeedPenalty: false, languages: ['Common', 'Infernal'], traits: [{ name: 'Darkvision', description: '60 ft.' }, { name: 'Hellish Resistance', description: 'Resistance mot fire damage.' }] },
].map(s => ({ ...s, catalogId: `srd51:species:${s.name.toLowerCase()}` }));
// One SRD 5.1 subclass per class; other book/homebrew options stay user-entered.
export const classCatalog = [
  ['Barbarian', 'Path of the Berserker'], ['Bard', 'College of Lore'], ['Cleric', 'Life Domain'],
  ['Druid', 'Circle of the Land'], ['Fighter', 'Champion'], ['Monk', 'Way of the Open Hand'],
  ['Paladin', 'Oath of Devotion'], ['Ranger', 'Hunter'], ['Rogue', 'Thief'],
  ['Sorcerer', 'Draconic Bloodline'], ['Warlock', 'The Fiend'], ['Wizard', 'School of Evocation'],
].map(([name, subclass]) => ({name, catalogId:`srd51:class:${name.toLowerCase()}`, subclasses:[subclass]}));
export type Item = Character['items'][number];
type EquipmentDefinition = Omit<Item, 'id' | 'equipped' | 'quantity'> & { catalogId: string };
const armor = (name: string, kind: 'light' | 'medium' | 'heavy', baseAc: number, strength = 0, stealthDisadvantage = false): EquipmentDefinition => ({
  catalogId: `srd51:equipment:${name.toLowerCase().replaceAll(' ', '-')}`, name, category: 'armor', handUsage: undefined,
  armorProfile: { kind, baseAc, addDex: kind !== 'heavy', dexCap: kind === 'medium' ? 2 : null, strength, stealthDisadvantage }, effectRefs: [], resourceRefs: [],
});
const foundationEquipment: EquipmentDefinition[] = [
  armor('Padded', 'light', 11, 0, true), armor('Leather', 'light', 11), armor('Studded Leather', 'light', 12),
  armor('Hide', 'medium', 12), armor('Chain Shirt', 'medium', 13), armor('Scale Mail', 'medium', 14, 0, true),
  armor('Breastplate', 'medium', 14), armor('Half Plate', 'medium', 15, 0, true),
  armor('Ring Mail', 'heavy', 14, 0, true), armor('Chain Mail', 'heavy', 16, 13, true),
  armor('Splint', 'heavy', 17, 15, true), armor('Plate', 'heavy', 18, 15, true),
  { catalogId: 'srd51:equipment:shield', name: 'Shield', category: 'shield', acContribution: 2, handUsage: 'one', effectRefs: [], resourceRefs: [] },
  ...(['Longsword', 'Greatsword', 'Dagger', 'Longbow'] as const).map(name => ({
    catalogId: `srd51:equipment:${name.toLowerCase()}`, name, category: 'weapon' as const,
    handUsage: name === 'Longsword' ? 'versatile' as const : name === 'Dagger' ? 'one' as const : 'two' as const,
    effectRefs: [], resourceRefs: [],
  })),
];
export const equipmentCatalog: EquipmentDefinition[] = equipment.map(row => {
  const foundation = foundationEquipment.find(existing => existing.catalogId === row.catalogId);
  return {...row,...foundation,notes:row.notes,damage:row.damage} as EquipmentDefinition;
});
export function instantiateEquipment(catalogId: string, equipped = true): Item {
  const definition = equipmentCatalog.find(d => d.catalogId === catalogId);
  if (!definition) throw new Error('Ukjent utstyr.');
  const { catalogId: key, ...data } = structuredClone(definition);
  return { ...data, id: crypto.randomUUID(), quantity: 1, equipped, definitionRef: { kind: 'catalog', id: key } };
}
