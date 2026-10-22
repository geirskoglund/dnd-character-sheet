import {it,expect} from 'vitest';
import {groupedCharacterDraft} from '../src/ui/character-form';
import {createCharacter,characterSchema} from '../src/domain/model';
import {withStandardResources} from '../src/domain/resource-setup';
import {instantiateFeature} from '../src/domain/character-library';
import {hasUnknownSlotProgression,spellSources,preparedSpellCandidates} from '../src/domain/magic';
import {CharacterRepository,openDatabase} from '../src/storage/database';
import {WizardDraftRepository} from '../src/storage/wizard-drafts';
import {newWizardDraft} from '../src/domain/wizard-draft';
import {exportBackup,importBackup} from '../src/storage/backup';
const character=(...rows:[string,number][])=>{
 const c=createCharacter('DM-avtale');c.classes=rows.map(([name,level])=>({id:crypto.randomUUID(),name,level,definitionRef:{kind:'catalog' as const,id:`srd51:class:${name.toLowerCase()}`}}));c.level=rows.reduce((sum,[,n])=>sum+n,0);return c;
};
it('accepts positive whole class levels without a game-rule maximum, and rejects invalid levels/sums',()=>{
 for(const c of [character(['Fighter',21]),character(['Wizard',21]),character(['Fighter',11],['Wizard',10])])expect(characterSchema.parse(c).level).toBe(21);
 for(const level of [0,-1,1.5,Infinity]){const c=character(['Fighter',level]);expect(characterSchema.safeParse(c).success).toBe(false);}
 const c=character(['Fighter',11],['Wizard',10]);c.level=20;expect(characterSchema.safeParse(c).success).toBe(false);
});
it('preserves slots, feature counts, manual overrides and spent values when progression has no table row',()=>{
 for(const name of ['Wizard','Warlock','Monk']){
  let c=character([name,20]);if(name==='Monk')c.features.push(instantiateFeature('srd51:class:ki'));c=withStandardResources(c);
  for(const pool of c.resources)if(pool.kind!=='hitDie')pool.current=1;
  for(const pool of c.resources)if(pool.kind==='spellSlot'){pool.current=1;pool.max=9;pool.manualMaximum=true;}
  const before=structuredClone(c.resources.filter(p=>p.kind!=='hitDie'));c.classes[0].level=21;c.level=21;
  c=withStandardResources(c);expect(c.resources.filter(p=>p.kind!=='hitDie')).toEqual(before);expect(c.resources.find(p=>p.kind==='hitDie')?.max).toBe(21);
  expect(()=>spellSources(c)).not.toThrow();expect(()=>preparedSpellCandidates(c,c.classes[0])).not.toThrow();
 }
 let c=withStandardResources(character(['Wizard',11],['Cleric',9]));const slots=structuredClone(c.resources.filter(p=>p.kind==='spellSlot'));c.classes[1].level=10;c.level=21;
 expect(hasUnknownSlotProgression(c)).toBe(true);expect(withStandardResources(c).resources.filter(p=>p.kind==='spellSlot')).toEqual(slots);
});
it('round-trips level21 and grouped draft through IndexedDB reopen and backup/import without resetting values',async()=>{
 const name='levels-'+crypto.randomUUID(),db=await openDatabase(name),repo=new CharacterRepository(db),drafts=new WizardDraftRepository(db);
 const c=await repo.save(withStandardResources(character(['Wizard',21])));
 const draft=await drafts.save({...newWizardDraft({kind:'character',label:c.name,characterId:c.id,payload:{source:c,creating:false,classes:c.classes}}),step:'levels',controls:[{name:'level:srd51:class:wizard',index:0,value:'21'}]});
 const backup=await exportBackup(db,[c]);db.close();const reopened=await openDatabase(name);expect(await new CharacterRepository(reopened).list()).toEqual([c]);expect(await new WizardDraftRepository(reopened).list()).toEqual([draft]);
 const target=await openDatabase('levels-'+crypto.randomUUID());await importBackup(target,backup);expect(await new CharacterRepository(target).list()).toEqual([c]);expect(await new WizardDraftRepository(target).list()).toEqual([draft]);reopened.close();target.close();
});

it('resumes pre-grouping character drafts using payload class identities and the equivalent screen',()=>{
 const source=character(['Fighter',11],['Wizard',10]);const entry={...newWizardDraft({kind:'character',label:source.name,payload:{source,creating:false,classes:source.classes}}),step:`1:${source.classes[1].id}:classLevel`,controls:[{name:'classChoice',index:0,value:'srd51:class:fighter'},{name:'classLevel',index:0,value:'11'},{name:'STR',index:0,value:'17'}]};
 const next=groupedCharacterDraft(entry);expect(next.step).toBe('levels');expect(next.payload).toEqual(entry.payload);expect(next.controls).toEqual([{name:'STR',index:0,value:'17'}]);expect(groupedCharacterDraft({...entry,step:'abilities'})).toEqual({...entry,step:'abilities'});
});
