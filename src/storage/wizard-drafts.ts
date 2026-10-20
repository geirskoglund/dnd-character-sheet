import {draftPrefix,wizardDraftSchema,type WizardDraft,type DraftToken} from '../domain/wizard-draft';
import {request,completed} from './idb';
export async function checkDraft(store:IDBObjectStore,token:DraftToken){
 const row=await request(store.get(draftPrefix+token.id));
 if(!row||row.value?.revision!==token.revision)throw new Error('Utkastet er endret eller fjernet i en annen fane. Åpne det på nytt før du fortsetter.');
}
export class WizardDraftRepository{
 constructor(readonly db:IDBDatabase){}
 async list(){const rows=await request(this.db.transaction('settings').objectStore('settings').getAll());return rows.filter(r=>r.id.startsWith(draftPrefix)).map(row=>wizardDraftSchema.parse(row.value)).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));}
 async save(input:WizardDraft){
  const parsed=wizardDraftSchema.parse(input);
  if(JSON.stringify(parsed).length>2_000_000)throw new Error('Utkastet er for stort til å lagres. Forkort innholdet og prøv igjen.');
  const tx=this.db.transaction('settings','readwrite'),done=completed(tx),store=tx.objectStore('settings');
  try{
   if(parsed.revision)await checkDraft(store,parsed);else if(await request(store.get(draftPrefix+parsed.id)))throw new Error('Utkastet er allerede endret i en annen fane. Åpne det på nytt.');
   const next={...parsed,revision:parsed.revision+1,updatedAt:new Date().toISOString()};store.put({id:draftPrefix+next.id,value:next});await done;return next;
  }catch(error){try{tx.abort();}catch{}await done.catch(()=>{});throw error;}
 }
 async remove(token:DraftToken){
  const tx=this.db.transaction('settings','readwrite'),done=completed(tx),store=tx.objectStore('settings');
  try{await checkDraft(store,token);store.delete(draftPrefix+token.id);await done;}catch(error){try{tx.abort();}catch{}await done.catch(()=>{});throw error;}
 }
}
