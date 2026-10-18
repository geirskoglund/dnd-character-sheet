import { describe, expect, it } from 'vitest';
import { createCharacter, copyCharacter, type Character } from '../src/domain/model';
import { classCatalog, speciesCatalog, instantiateEquipment } from '../src/domain/catalog';
import { deriveStats, hpAfterChange } from '../src/domain/derived';
function character(species = 'Human') {
  const c = createCharacter('Alva');
  c.species = structuredClone(speciesCatalog.find(s => s.name === species)!);
  c.abilityScores = { STR: 10, DEX: 16, CON: 14, INT: 10, WIS: 16, CHA: 10 };
  return c;
}
function addClass(c: Character, name: string, level: number) {
  const definition = classCatalog.find(cl => cl.name === name)!;
  c.classes.push({ id: crypto.randomUUID(), name, level, definitionRef: { kind: 'catalog', id: definition.catalogId } });
  c.level = c.classes.reduce((n, cl) => n + cl.level, 0);
}
function equip(c: Character, key: string, equipped = true) {
  const item = instantiateEquipment(`srd51:equipment:${key}`, equipped); c.items.push(item); return item;
}
describe('2014 armor class', () => {
  it.each([
    ['leather', 14], ['studded-leather', 15], ['chain-shirt', 15], ['half-plate', 17], ['chain-mail', 16], ['plate', 18],
  ])('calculates %s using its own Dex rule', (key, ac) => {
    const c = character(); equip(c, key); expect(deriveStats(c).ac).toBe(ac);
  });
  it('uses negative Dex for light and medium armor, and none for heavy', () => {
    const c = character(); c.abilityScores.DEX = 6;
    equip(c, 'chain-shirt'); expect(deriveStats(c).ac).toBe(11);
    c.items = []; equip(c, 'plate'); expect(deriveStats(c).ac).toBe(18);
  });
  it('only counts equipped nonzero-quantity items and never stacks shields or armor formulas', () => {
    const c = character(); equip(c, 'plate', false); expect(deriveStats(c).ac).toBe(13);
    c.items[0].equipped = true; equip(c, 'leather'); equip(c, 'shield'); equip(c, 'shield');
    expect(deriveStats(c).ac).toBe(20);
    expect(deriveStats(c).warnings.join(' ')).toContain('stables ikke');
    c.items[0].quantity = 0; expect(deriveStats(c).ac).toBe(16);
  });
  it('allows a Barbarian shield, but armor disables Unarmored Defense', () => {
    const c = character(); addClass(c, 'Barbarian', 1);
    expect(deriveStats(c).ac).toBe(15);
    equip(c, 'shield'); expect(deriveStats(c).ac).toBe(17);
    equip(c, 'leather'); expect(deriveStats(c).ac).toBe(16);
  });
  it('disables Monk Unarmored Defense with a shield or armor', () => {
    const c = character(); addClass(c, 'Monk', 2); expect(deriveStats(c).ac).toBe(16);
    equip(c, 'shield'); expect(deriveStats(c).ac).toBe(15);
    c.items = []; equip(c, 'leather'); expect(deriveStats(c).ac).toBe(14);
  });
  it('requires choosing the acquired defense for Barbarian/Monk multiclass', () => {
    const c = character(); addClass(c, 'Barbarian', 1); addClass(c, 'Monk', 2);
    expect(deriveStats(c).ac).toBe(13);
    expect(deriveStats(c).warnings.join()).toContain('en andre Unarmored Defense');
    c.unarmoredDefense = 'barbarian'; expect(deriveStats(c).ac).toBe(15);
    c.unarmoredDefense = 'monk'; expect(deriveStats(c).ac).toBe(16);
  });
  it('warns about two-handed weapons with a shield without refusing the configuration', () => {
    const c = character(); equip(c, 'greatsword'); equip(c, 'shield');
    expect(deriveStats(c).warnings.join()).toContain('Tohåndsvåpen');
    expect(deriveStats(c).ac).toBe(15);
  });
});
describe('walking speed from species, class and armor', () => {
  it('does not invent a speed for an unspecified species', () => expect(deriveStats(createCharacter()).speed).toBeNull());
  it.each([['Human', 30], ['Dwarf', 25], ['Gnome', 25], ['Halfling', 25]])('%s has base speed %i', (species, speed) => expect(deriveStats(character(species)).speed).toBe(speed));
  it('applies a heavy-armor Strength penalty but honors Dwarven Speed', () => {
    const c = character(); equip(c, 'chain-mail'); expect(deriveStats(c).speed).toBe(20);
    c.abilityScores.STR = 13; expect(deriveStats(c).speed).toBe(30);
    const dwarf = character('Dwarf'); equip(dwarf, 'plate'); expect(deriveStats(dwarf).speed).toBe(25);
  });
  it('gives Barbarian Fast Movement at class level 5, unless wearing heavy armor', () => {
    const c = character(); addClass(c, 'Barbarian', 4); addClass(c, 'Fighter', 1); expect(deriveStats(c).speed).toBe(30);
    c.classes[0].level = 5; c.level = 6; expect(deriveStats(c).speed).toBe(40);
    equip(c, 'leather'); expect(deriveStats(c).speed).toBe(40);
    equip(c, 'plate'); expect(deriveStats(c).speed).toBe(20);
  });
  it.each([[1,30],[2,40],[5,40],[6,45],[10,50],[14,55],[18,60]])('Monk level %i has speed %i when unarmored', (level, speed) => {
    const c = character(); addClass(c, 'Monk', level); expect(deriveStats(c).speed).toBe(speed);
    equip(c, 'shield'); expect(deriveStats(c).speed).toBe(30);
  });
  it('honors explicit overrides and returns to derived values when cleared', () => {
    const c = character(); c.acOverride = 21; c.speedOverride = 45;
    expect(deriveStats(c)).toMatchObject({ ac: 21, speed: 45 });
    c.acOverride = c.speedOverride = null;
    expect(deriveStats(c)).toMatchObject({ ac: 13, speed: 30 });
    const copy = copyCharacter(c); copy.species.walkingSpeed = 50;
    expect(c.species.walkingSpeed).toBe(30);
  });
});
describe('HP changes during play', () => {
  it('takes temp HP first, floors damage at zero, and leaves temp HP alone when healing', () => {
    const hp = { current: 10, max: 20, temp: 5 };
    expect(hpAfterChange(hp, -3)).toEqual({ current: 10, max: 20, temp: 2 });
    expect(hpAfterChange(hp, -8)).toEqual({ current: 7, max: 20, temp: 0 });
    expect(hpAfterChange(hp, -99)).toEqual({ current: 0, max: 20, temp: 0 });
    expect(hpAfterChange(hp, 30)).toEqual({ current: 20, max: 20, temp: 5 });
    expect(hp).toEqual({ current: 10, max: 20, temp: 5 });
    expect(hpAfterChange({current:25,max:20,temp:5}, 2)).toEqual({current:25,max:20,temp:5});
  });
});
