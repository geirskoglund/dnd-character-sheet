import type {Character} from '../domain/model';
import {characterSchema} from '../domain/model';
import {spellSources,assignSpell} from '../domain/magic';
import {withStandardResources} from '../domain/resource-setup';
import {wizardDialog,draftOptions,flushWizard} from './wizard';
import type {EditorContext} from './record-editors';
import {field,select,escapeHtml as esc} from './html';
export function guidedRecord(ctx:EditorContext,kind:'feature'|'spell'|'cantrip'|'species',base?:Character['features'][number]|Character['spells'][number],category:'class'|'feat'='feat',existing=false,advanced?:(draft:Character['features'][number]|Character['spells'][number],completion?:import('../domain/wizard-draft').DraftToken)=>void){
 const resumed=ctx.resumedDraft?.payload as {base?:typeof base;category?:typeof category;existing?:boolean;expected?:typeof base}|undefined;if(resumed){base=resumed.base;category=resumed.category??category;existing=resumed.existing??existing;}
 const expected=resumed?.expected??(existing?structuredClone(base):undefined);
 const persistence=draftOptions(ctx,kind,base?.name??'Egen oppføring',{base,category,existing,expected},existing?base?.id:undefined);
 const c=ctx.current(),spell=kind==='spell'||kind==='cantrip';
 const sources=spellSources(c);
 const d=wizardDialog(base?'Tilpass '+base.name:spell?'Egen '+kind:'Egen egenskap',[
  {title:'Hva vil du føre på arket?',art:spell?'wand':'feature',html:field('Navn','name',base?.name??'','required maxlength="100"')+(spell?kind==='cantrip'?'<input type="hidden" name="spellLevel" value="0">':field('Spellnivå','spellLevel',base&&'spellLevel'in base?base.spellLevel:1,'type="number" min="1" max="9" required'):select('Kategori','category',kind==='species'?'species':base&&'category'in base?base.category:category,[{value:'class',label:'Klasseegenskap'},{value:'feat',label:'Feat'},{value:'species',label:'Artsegenskap'},{value:'custom',label:'Egen egenskap'},{value:'item',label:'Utstyrsegenskap'}]))},
  {title:'Vil du legge til en beskrivelse?',art:spell?'wand':'feature',help:'Valgfritt: skriv regelteksten eller det du vil huske ved bordet. Spilleren og DM avgjør hvordan den gjelder.',html:`<label>Beskrivelse (valgfritt)<textarea name="description" maxlength="10000" rows="5">${esc(base?.description??'')}</textarea></label>`+(spell&&sources.length?select('Tilgang fra','source',base&&'casterClassRef'in base?(base.casterClassRef??base.accessSource?.id??''):sources.length===1?sources[0].id:'',[{value:'',label:'Annen kilde / DM'},...sources.map(s=>({value:s.id,label:s.label}))]):'')},
 ],async (form,completion)=>{
  const data=new FormData(form),name=String(data.get('name')).trim(),description=String(data.get('description'));
  if(!name)throw new Error('Angi et navn.');
  const latest=ctx.current();if(latest.id!==c.id)throw new Error('Åpne utkastet fra riktig karakter.');
  if(existing&&JSON.stringify((spell?latest.spells:latest.features).find(r=>r.id===base?.id))!==JSON.stringify(expected))throw new Error('Oppføringen er endret eller fjernet siden utkastet ble startet. Forkast utkastet og åpne oppføringen på nytt.');
  const draft=structuredClone(latest);
  if(spell){
   const template=base&&'spellLevel'in base?base:undefined;
   const source=sources.find(s=>s.id===data.get('source'));
   const row=assignSpell(c,{castingTime:'',actionEconomy:'action',range:'',duration:'',concentration:false,ritual:false,components:[],known:true,inSpellbook:false,prepared:false,...template,id:existing&&template?template.id:crypto.randomUUID(),name,description,spellLevel:Number(data.get('spellLevel'))},source);
   if(!source){delete row.casterClassRef;delete row.accessSource;delete row.castingAbility;row.sourceLabel='Manuell / DM';row.alwaysPrepared=false;}
   if(existing)draft.spells=draft.spells.map(s=>s.id===row.id?row:s);else draft.spells.push(row);
  }else{
   const template=base&&'category'in base?base:undefined;
   const row={...template,id:existing&&template?template.id:crypto.randomUUID(),name,description,category:String(data.get('category')) as 'feat',actionRefs:existing&&template?template.actionRefs:[],resourceRefs:existing&&template?template.resourceRefs:[],effectRefs:existing&&template?template.effectRefs:[]};
   if(existing)draft.features=draft.features.map(f=>f.id===row.id?row:f);else draft.features.push(row);
  }
  await ctx.save(characterSchema.parse(withStandardResources(draft)),spell?'spell':'feature',name+' lagt til',completion);
 },existing?'Lagre':'Legg til',persistence);
 if(advanced){const button=document.createElement('button');button.type='button';button.textContent='Flere detaljer';d.querySelector('#dialog-body')!.append(button);button.onclick=async()=>{const form=d.querySelector('form')!;if(form.getAttribute('aria-busy')==='true')return;form.setAttribute('aria-busy','true');button.disabled=true;let token;try{if(existing&&JSON.stringify((spell?ctx.current().spells:ctx.current().features).find(r=>r.id===base?.id))!==JSON.stringify(expected))throw new Error('Oppføringen er endret eller fjernet. Åpne den på nytt.');token=await flushWizard(d);}catch(error){d.querySelector('#dialog-error')!.textContent=(error as Error).message;form.removeAttribute('aria-busy');button.disabled=false;return;}const data=new FormData(d.querySelector('form')!);const partial={...base,name:String(data.get('name')).trim(),description:String(data.get('description')??'')};if(spell){Object.assign(partial,{spellLevel:Number(data.get('spellLevel'))});}else Object.assign(partial,{category:String(data.get('category'))});advanced(partial as Character['features'][number]|Character['spells'][number],token);};}
 return d;
}
