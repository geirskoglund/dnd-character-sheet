import {describe,it,expect} from 'vitest';
import {characterSchema,createCharacter} from '../src/domain/model';
import {materializeLanguages,removeRecord,restCharacter,useHitDie} from '../src/domain/records';
import {featureLibrary,spellLibrary,instantiateFeature,instantiateSpell} from '../src/domain/character-library';
import {equipmentCatalog,instantiateEquipment} from '../src/domain/catalog';
function fixture() {
  const c=createCharacter('Bryn'); c.level=5;c.hp={current:4,max:40,temp:7};c.abilityScores.CON=14;
  c.resources=[
    {id:crypto.randomUUID(),ownerCharacterId:c.id,name:'Fighter Hit Dice',kind:'hitDie',die:'d10',current:3,max:5,recharge:{kind:'longRest'}},
    {id:crypto.randomUUID(),ownerCharacterId:c.id,name:'Pact Magic',kind:'spellSlot',spellLevel:2,systemRef:'Pact Magic',current:0,max:2,recharge:{kind:'shortRest'}},
    {id:crypto.randomUUID(),ownerCharacterId:c.id,name:'Spellcasting 1',kind:'spellSlot',spellLevel:1,systemRef:'Spellcasting',current:1,max:4,recharge:{kind:'longRest'}},
    {id:crypto.randomUUID(),ownerCharacterId:c.id,name:'Arcane Recovery',kind:'custom',current:0,max:1,recharge:{kind:'special',ruleText:'Once per adventuring day'}},
  ];return c;
}
describe('manual resources and rests, D&D 2014',()=>{
  it('spends one physical die with Constitution, caps HP, leaves temp unchanged',()=>{
    const c=fixture(),id=c.resources[0].id;
    const after=useHitDie(c,id,8);
    expect(after.hp).toEqual({current:14,max:40,temp:7});expect(after.resources[0].current).toBe(2);
    expect(c.resources[0].current).toBe(3);
    c.hp.current=39;expect(useHitDie(c,id,8).hp.current).toBe(40);
    c.abilityScores.CON=3;expect(useHitDie(c,id,1).hp.current).toBe(39);
    expect(()=>useHitDie(c,id,11)).toThrow('fysisk');
    expect(()=>useHitDie(c,id,0)).toThrow('fysisk');
    c.resources[0].current=0;expect(()=>useHitDie(c,id,4)).toThrow('Ingen tilgjengelig');
  });
  it('short rest restores only eligible pools, including Pact Magic without spending Hit Dice',()=>{
    const c=fixture(),after=restCharacter(c,'shortRest');
    expect(after.resources.map(row=>row.current)).toEqual([3,2,1,0]);expect(after.hp).toEqual(c.hp);
    expect(()=>restCharacter(c,'shortRest',{[c.resources[0].id]:1})).toThrow('Long Rest');
  });
  it('long rest restores both rest types, expires temp HP, allocates at most half-level Hit Dice',()=>{
    const c=fixture(),id=c.resources[0].id;
    const after=restCharacter(c,'longRest',{[id]:2});
    expect(after.hp).toEqual({current:40,max:40,temp:0});expect(after.resources.map(row=>row.current)).toEqual([5,2,4,0]);
    c.resources[0].current=0;expect(()=>restCharacter(c,'longRest',{[id]:3})).toThrow('halvparten');
    expect(()=>restCharacter(c,'longRest',{[id]:-1})).toThrow('antall');
    c.level=1;expect(restCharacter(c,'longRest',{[id]:1}).resources[0].current).toBe(1);
  });
});
it('materializes editable languages once without modifying the catalog snapshot or duplicating explicit languages',()=>{
  const c=createCharacter();c.species.languages=['Common','Elvish'];c.languages=[{id:crypto.randomUUID(),name:'Elvish'}];
  const after=materializeLanguages(c);expect(after.languages.map(row=>row.name)).toEqual(['Elvish','Common']);
  expect(after.species.languages).toEqual([]);expect(c.species.languages).toEqual(['Common','Elvish']);
  expect(materializeLanguages(after)).toEqual(after);
});
it('removes a feature and owned children together, preserves shared children and unrelated data',()=>{
  const c=fixture(),feature=instantiateFeature(featureLibrary[0].id),actionId=crypto.randomUUID();
  feature.resourceRefs=[c.resources[0].id];feature.actionRefs=[actionId];c.features=[feature];
  c.actions=[{id:actionId,name:'Own action',actionEconomy:'bonus',summary:'',detail:'',damageRolls:[],resourceRefs:[c.resources[0].id],sourceRef:{kind:'feature',id:feature.id}}];
  const after=removeRecord(c,'features',feature.id);expect(after.features).toEqual([]);expect(after.actions).toEqual([]);expect(after.resources).toEqual(c.resources);
  c.features.push({...instantiateFeature(featureLibrary[1].id),actionRefs:[actionId]});
  expect(removeRecord(c,'features',feature.id).actions).toHaveLength(1);
  expect(removeRecord(c,'resources',c.resources[0].id).actions[0].resourceRefs).toEqual([]);
});
it('instantiates every distributed catalog record as editable data with unique instance IDs',()=>{
  expect(spellLibrary).toHaveLength(319);expect(featureLibrary).toHaveLength(408);expect(equipmentCatalog).toHaveLength(239);
  const c=createCharacter();c.spells=spellLibrary.map(row=>instantiateSpell(row.id));c.features=featureLibrary.map(row=>instantiateFeature(row.id));c.items=equipmentCatalog.map(row=>instantiateEquipment(row.catalogId));
  expect(characterSchema.safeParse(c).success).toBe(true);
  expect(new Set(equipmentCatalog.map(row=>row.catalogId)).size).toBe(equipmentCatalog.length);
  const id=c.spells[0].definitionRef!.id;c.spells[0].name='Own name';expect(instantiateSpell(id).name).not.toBe('Own name');
});
it('retains an owned pool when a surviving shared action still uses it',()=>{
  const c=fixture(),feature=instantiateFeature(featureLibrary[0].id),other=instantiateFeature(featureLibrary[1].id);
  const pool=c.resources[1];pool.sourceRef={kind:'feature',id:feature.id};feature.resourceRefs=[pool.id];
  const action={id:crypto.randomUUID(),name:'Shared',actionEconomy:'reaction' as const,summary:'',detail:'',damageRolls:[],resourceRefs:[pool.id],sourceRef:{kind:'feature' as const,id:feature.id}};
  feature.actionRefs=[action.id];other.actionRefs=[action.id];c.features=[feature,other];c.actions=[action];
  const after=removeRecord(c,'features',feature.id);expect(after.resources.find(row=>row.id===pool.id)).toEqual(pool);expect(after.actions[0].resourceRefs).toEqual([pool.id]);
});
