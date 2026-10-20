import {it,expect,describe} from 'vitest';
import {CharacterRepository,openDatabase} from '../src/storage/database';
import {WizardDraftRepository} from '../src/storage/wizard-drafts';
import {newWizardDraft,draftPrefix} from '../src/domain/wizard-draft';
import {createCharacter} from '../src/domain/model';
import {instantiateEquipment} from '../src/domain/catalog';
import {exportBackup,importBackup} from '../src/storage/backup';
import {moneyParts,moneyText,moneyFromText,moneyFromParts} from '../src/domain/money';
describe('wizard draft isolation and atomic completion',()=>{
 it('persists unfinished answers/position without creating an item or character history, and survives reopen',async()=>{
  const name='draft-'+crypto.randomUUID(),db=await openDatabase(name),repo=new CharacterRepository(db),store=new WizardDraftRepository(db),c=await repo.save(createCharacter('Nim'));
  const entry=await store.save({...newWizardDraft({kind:'equipment',characterId:c.id,label:'Flammetunge',payload:{source:instantiateEquipment('srd51:equipment:longsword')}}),step:'extra-condition',controls:[{name:'condition',index:0,value:'Når sverdet brenner'}]});
  expect((await repo.list())[0]).toEqual(c);expect(await repo.history(c.id)).toHaveLength(1);db.close();
  const reopened=await openDatabase(name),drafts=new WizardDraftRepository(reopened);expect(await drafts.list()).toEqual([entry]);await drafts.remove(entry);expect(await drafts.list()).toEqual([]);reopened.close();
 });
 it('rejects stale drafts across tabs and never resurrects a discarded draft',async()=>{
  const db=await openDatabase('draft-'+crypto.randomUUID()),store=new WizardDraftRepository(db),one=await store.save(newWizardDraft({kind:'equipment',label:'Sverd',payload:{}})),two=await store.save({...one,step:'type'});
  await expect(store.save({...one,step:'condition'})).rejects.toThrow('annen fane');await expect(store.remove(one)).rejects.toThrow('annen fane');expect(await store.list()).toEqual([two]);await store.remove(two);await expect(store.save(two)).rejects.toThrow('fjernet');db.close();
 });
 it('commits the item, event and draft deletion atomically; stale character or draft preserves all three',async()=>{
  const db=await openDatabase('draft-'+crypto.randomUUID()),repo=new CharacterRepository(db),store=new WizardDraftRepository(db),c=await repo.save(createCharacter('Nim')),item=instantiateEquipment('srd51:equipment:longsword'),draft=await store.save(newWizardDraft({kind:'equipment',characterId:c.id,label:item.name,payload:{item}}));
  const newer=await repo.save({...c,goldCp:100});await expect(repo.save({...c,items:[item]},'equipment','Nytt våpen',undefined,draft)).rejects.toThrow('annen fane');expect(await store.list()).toEqual([draft]);expect((await repo.list())[0].items).toEqual([]);
  const updatedDraft=await store.save({...draft,step:'done'});await expect(repo.save({...newer,items:[item]},'equipment','Nytt våpen',undefined,draft)).rejects.toThrow('annen fane');expect((await repo.list())[0].items).toEqual([]);
  const saved=await repo.save({...newer,items:[item]},'equipment','Nytt våpen',undefined,updatedDraft);expect(await store.list()).toEqual([]);expect(saved.items).toEqual([item]);expect(await repo.history(c.id)).toHaveLength(3);await repo.undo(saved);expect((await repo.list())[0].items).toEqual([]);
  const unchanged=(await repo.list())[0],history=await repo.history(c.id),noop=await store.save(newWizardDraft({kind:'equipment',characterId:c.id,label:'Uendret',payload:{}}));
  await repo.save(unchanged,'equipment','Uendret',undefined,noop);expect(await repo.history(c.id)).toEqual(history);expect(await store.list()).toEqual([]);db.close();
 });
 it('rolls back draft deletion and item/event on a write failure, then allows a single retry',async()=>{
  const db=await openDatabase('draft-'+crypto.randomUUID()),repo=new CharacterRepository(db),store=new WizardDraftRepository(db),c=await repo.save(createCharacter('Nim')),draft=await store.save(newWizardDraft({kind:'equipment',label:'Sverd',payload:{}})),original=IDBObjectStore.prototype.put;
  IDBObjectStore.prototype.put=function(...args){if(this.name==='characters')throw new DOMException('Full lagring','QuotaExceededError');return original.apply(this,args);};
  try{await expect(repo.save({...c,goldCp:1},'money','Endring',undefined,draft)).rejects.toThrow('Full lagring');}finally{IDBObjectStore.prototype.put=original;}
  expect(await store.list()).toEqual([draft]);expect((await repo.list())[0].goldCp).toBe(0);expect(await repo.history(c.id)).toHaveLength(1);await repo.save({...c,goldCp:1},'money','Endring',undefined,draft);expect(await store.list()).toEqual([]);db.close();
 });
 it('does not create orphan drafts or resurrect a character deleted in another tab',async()=>{
  const db=await openDatabase('draft-'+crypto.randomUUID()),repo=new CharacterRepository(db),store=new WizardDraftRepository(db),c=await repo.save(createCharacter('Nim'));
  const unsaved=newWizardDraft({kind:'equipment',characterId:c.id,label:'Sverd',payload:{}});
  const old=await store.save(unsaved);await repo.remove(c);
  await expect(store.save(old)).rejects.toThrow('fjernet');await expect(store.save(unsaved)).rejects.toThrow('fjernet');
  await expect(repo.save({...c,goldCp:1})).rejects.toThrow('fjernet');expect(await repo.list()).toEqual([]);expect(await store.list()).toEqual([]);db.close();
 });
 it('includes drafts in version2 backup/import and clears only owned drafts when a character is deleted',async()=>{
  const db=await openDatabase('draft-'+crypto.randomUUID()),repo=new CharacterRepository(db),store=new WizardDraftRepository(db),c=await repo.save(createCharacter('Nim')),owned=await store.save(newWizardDraft({kind:'equipment',characterId:c.id,label:'Sverd',payload:{}})),newChar=await store.save(newWizardDraft({kind:'character',label:'Ny karakter',payload:{}}));
  const backup=await exportBackup(db,[c]),target=await openDatabase('draft-'+crypto.randomUUID());await importBackup(target,backup);expect((await new WizardDraftRepository(target).list()).map(d=>d.id).sort()).toEqual([owned.id,newChar.id].sort());
  await repo.remove(c);expect((await store.list()).map(d=>d.id)).toEqual([newChar.id]);expect((await repo.history(c.id)).at(0)?.type).toBe('delete');target.close();db.close();
 });
});
describe('two independent money columns use integer copper',()=>{
 it('preserves decimal boundaries and exact input without floating point loss',()=>{
  expect(moneyFromParts(55,25)).toBe(5525);expect(moneyParts(5525)).toEqual({whole:55,fraction:25});expect(moneyText(5500)).toBe('55.00');expect(moneyFromText('55,25')).toBe(5525);expect(moneyFromText('0.01')).toBe(1);expect(moneyFromText('55')).toBe(5500);expect(moneyFromParts(55,99)).toBe(5599);expect(moneyFromText(moneyText(Number.MAX_SAFE_INTEGER))).toBe(Number.MAX_SAFE_INTEGER);
 });
 it('rejects negative/fractional column values, overflow and extra decimals',()=>{
  for(const [whole,fraction]of [[-1,0],[1,100],[1,-1],[1.5,0],[1,2.5],[Number.MAX_SAFE_INTEGER,0]])expect(()=>moneyFromParts(whole,fraction)).toThrow();for(const text of ['-1','1.001','abc','1e3',''])expect(()=>moneyFromText(text)).toThrow();
 });
});
