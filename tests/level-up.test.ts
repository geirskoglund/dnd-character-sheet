import { describe, expect, it } from 'vitest';
import { createCharacter } from '../src/domain/model';
import { levelUpCharacter } from '../src/domain/level-up';
function character() {
  const c = createCharacter();
  c.classes = [{id:crypto.randomUUID(), name:'Fighter', level:3}, {id:crypto.randomUUID(), name:'Wizard', level:2, subclass:'Min skole'}];
  c.level = 5; c.hp = {current:17,max:30,temp:5};
  return c;
}
describe('manual Level Up', () => {
  it('increments only chosen class, keeps damage/temp and does not mutate original', () => {
    const c = character(), result = levelUpCharacter(c,c.classes[1].id,36);
    expect(result.level).toBe(6); expect(result.classes.map(cl=>cl.level)).toEqual([3,3]);
    expect(result.hp).toEqual({current:17,max:36,temp:5});
    expect(result.classes[1].subclass).toBe('Min skole');
    expect(c.hp.max).toBe(30); expect(c.level).toBe(5);
  });
  it('accepts zero HP gain and a manually chosen subclass', () => {
    const c = character(), result = levelUpCharacter(c,c.classes[0].id,30,'Champion');
    expect(result.hp.max).toBe(30); expect(result.classes[0].subclass).toBe('Champion');
  });
  it('rejects invalid class, HP and a total above 20', () => {
    const c = character();
    for (const hp of [NaN,29,30.5,0]) expect(()=>levelUpCharacter(c,c.classes[0].id,hp)).toThrow();
    expect(()=>levelUpCharacter(c,crypto.randomUUID(),35)).toThrow('Velg klassen');
    c.classes[0].level=18;c.level=20;
    expect(()=>levelUpCharacter(c,c.classes[0].id,40)).toThrow('level 20');
  });
});
