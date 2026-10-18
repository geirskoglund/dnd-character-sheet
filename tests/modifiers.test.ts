import { expect, test } from 'vitest';
import { createCharacter } from '../src/domain/model';
import { modifiers } from '../src/domain/modifiers';
test('modifier reference uses final scores, proficiency/expertise and manual overrides', () => {
  const c = createCharacter(); c.level = 5; c.abilityScores.DEX=16;c.abilityScores.WIS=14;c.abilityScores.STR=8;
  c.skills=[{skillId:'Stealth',proficiencyLevel:'expertise'}, {skillId:'srd51:skill:perception',proficiencyLevel:'proficient'}];
  c.saves=[{abilityId:'DEX',proficiencyLevel:'proficient'}];
  const get=(ref:string)=>modifiers(c).find(m=>m.ref===ref)?.value;
  expect(get('STR')).toBe(-1);expect(get('Stealth')).toBe(9);expect(get('DEX save')).toBe(6);
  expect(get('Initiative')).toBe(3);expect(get('Passive Perception')).toBe(15);
  c.skills[0].override=12;c.saves[0].override=8;c.proficiencyBonusOverride=4;c.derivedOverrides.initiative=7;
  expect(get('Stealth')).toBe(12);expect(get('DEX save')).toBe(8);expect(get('Initiative')).toBe(7);
  expect(get('Passive Perception')).toBe(16);
});
