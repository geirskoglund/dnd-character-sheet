import {effectiveAbilities,itemAdjustment} from './item-effects';
import { itemBonuses } from './equipment';
import { abilities, type Character } from './model';

const abilityNames = {STR:'Strength', DEX:'Dexterity', CON:'Constitution', INT:'Intelligence', WIS:'Wisdom', CHA:'Charisma'};
export const skillAbilities = {
  Acrobatics:'DEX', 'Animal Handling':'WIS', Arcana:'INT', Athletics:'STR', Deception:'CHA', History:'INT',
  Insight:'WIS', Intimidation:'CHA', Investigation:'INT', Medicine:'WIS', Nature:'INT', Perception:'WIS',
  Performance:'CHA', Persuasion:'CHA', Religion:'INT', 'Sleight of Hand':'DEX', Stealth:'DEX', Survival:'WIS',
} as const;
export const abilityModifier = (score: number) => Math.floor((score - 10) / 2);
export const signed = (value: number) => `${value >= 0 ? '+' : ''}${value}`;
const normalize = (value: string) => value.split(':').at(-1)!.replaceAll('-', ' ').toLowerCase();
export function modifiers(c: Character) {
  const saveBonus = itemBonuses(c, 'saves').reduce((sum, entry) => sum + entry.amount, 0);
  const proficiency = c.proficiencyBonusOverride ?? Math.ceil(c.level / 4) + 1;
  const scores=effectiveAbilities(c);
  const base = (ability: typeof abilities[number]) => abilityModifier(scores[ability]);
  const bonus = (level?: string) => level === 'expertise' ? proficiency * 2 : level === 'proficient' ? proficiency : 0;
  const skills = Object.entries(skillAbilities).map(([name, ability]) => {
    const skill = c.skills.find(s => normalize(s.skillId) === normalize(name));
    return {ref:name, name, value:skill?.override ?? base(ability) + bonus(skill?.proficiencyLevel) + itemAdjustment(c,'skill',name)};
  });
  return [
    ...skills,
    ...abilities.map(a => ({ref:a, name:abilityNames[a], value:base(a)})),
    ...abilities.map(a => {
      const save = c.saves.find(s => s.abilityId === a);
      return {ref:`${a} save`, name:`${abilityNames[a]} save`, value:save?.override ?? base(a) + bonus(save?.proficiencyLevel) + saveBonus + itemAdjustment(c,'saves') + itemAdjustment(c,'save',a)};
    }),
    {ref:'Initiative', name:'Initiative', value:c.derivedOverrides.initiative ?? base('DEX') + itemAdjustment(c,'initiative')},
    {ref:'Passive Perception', name:'Passive Perception', value:c.derivedOverrides.passivePerception ?? 10 + skills.find(s=>s.ref === 'Perception')!.value},
  ].sort((a,b) => a.name.localeCompare(b.name, 'en'));
}
