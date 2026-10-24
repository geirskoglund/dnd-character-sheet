import {expect,it} from 'vitest';
import {consumableCatalog,newConsumable,setConsumableQuantity} from '../src/domain/consumables';
import {createCharacter,characterSchema,copyCharacter} from '../src/domain/model';
import {CharacterRepository,openDatabase} from '../src/storage/database';
import {exportBackup,importBackup} from '../src/storage/backup';
it('ships 25 manual stocks with the correct units and healing expressions, without adding inventory',()=>{
 expect(consumableCatalog).toHaveLength(25);expect(new Set(consumableCatalog.map(r=>r.catalogId)).size).toBe(25);
 expect(createCharacter().consumables).toEqual([]);
 expect(consumableCatalog.filter(r=>r.category==='healing').map(r=>r.description.split(' HP.')[0])).toEqual(['2d4+2','4d4+4','8d4+8','10d4+20']);
 expect(consumableCatalog.find(r=>r.name.startsWith('Healer'))?.unit).toBe('bruk');
 expect(consumableCatalog.filter(r=>/Bearings|Caltrops/.test(r.name)).map(r=>r.unit)).toEqual(['poser','poser']);
});
it('reads older characters, keeps duplicates independent, and rejects invalid stock and duplicated IDs',()=>{
 const {consumables:_,...old}=createCharacter();expect(characterSchema.parse(old).consumables).toEqual([]);
 const c=createCharacter();c.consumables=[{...newConsumable(consumableCatalog[0].catalogId),quantity:18},{...newConsumable(consumableCatalog[0].catalogId),quantity:4,description:'DM arrows'}];
 const next=setConsumableQuantity(c,c.consumables[0].id,0);expect(next.consumables.map(r=>r.quantity)).toEqual([0,4]);expect(next.items).toEqual(c.items);expect(next.hp).toEqual(c.hp);
 for(const quantity of [-1,1.5,Infinity,Number.MAX_SAFE_INTEGER+1])expect(()=>setConsumableQuantity(c,c.consumables[0].id,quantity)).toThrow();
 expect(characterSchema.safeParse({...c,consumables:[c.consumables[0],c.consumables[0]]}).success).toBe(false);
 const copy=copyCharacter(c);expect(copy.consumables[0].id).not.toBe(c.consumables[0].id);expect(copy.consumables[0].catalogId).toBe(c.consumables[0].catalogId);
});
it('persists one adjustment, undoes it, rejects stale revisions and roundtrips independent stocks through backup',async()=>{
 const db=await openDatabase(crypto.randomUUID()),other=await openDatabase(crypto.randomUUID());
 try{
 const repo=new CharacterRepository(db),c=createCharacter();c.consumables=[{...newConsumable(consumableCatalog[0].catalogId),quantity:18},{...newConsumable(),name:'Arrows',quantity:2,description:'DM',iconKey:'magic'}];
 const saved=await repo.save(c);const changed=await repo.save(setConsumableQuantity(saved,c.consumables[0].id,13));
 expect(await repo.history(c.id)).toHaveLength(2);await expect(repo.save(setConsumableQuantity(saved,c.consumables[0].id,20))).rejects.toThrow('annen fane');
 const undo=await repo.undo(changed);expect(undo.consumables.map(r=>r.quantity)).toEqual([18,2]);
 await importBackup(other,await exportBackup(db,await repo.list()));expect((await new CharacterRepository(other).list())[0].consumables).toEqual(undo.consumables);
 }finally{db.close();other.close();}
});
