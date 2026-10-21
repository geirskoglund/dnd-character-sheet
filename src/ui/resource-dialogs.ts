import {numberChangeDialog} from './number-change-dialog';
import type {Character} from '../domain/model';
import {characterSchema} from '../domain/model';
import {adjustPool,defaultHitRecovery,restResult,hitRecoveryBudget} from '../domain/resource-setup';
import {viewDialog,editDialog,commitDialog,confirmDialog} from './dialog';
import {wizardDialog,draftOptions} from './wizard';
import {field,select,escapeHtml as esc} from './html';
import type {EditorContext} from './record-editors';
const value=(form:HTMLFormElement,name:string)=>Number(new FormData(form).get(name));
const rechargeOptions=[{value:'manual',label:'Manuelt'},{value:'shortRest',label:'Kort hvile'},{value:'longRest',label:'Lang hvile'}];
export function resourceWizard(ctx:EditorContext,id?:string,kind:Character['resources'][number]['kind']='custom'){
 const resumed=ctx.resumedDraft?.payload as {pool:Character['resources'][number];existing:boolean;kind:typeof kind}|undefined;if(resumed){kind=resumed.kind;id=resumed.existing?resumed.pool.id:undefined;}
 const c=ctx.current(),source=c.resources.find(p=>p.id===id||resumed?.existing&&resumed.pool.automatic&&p.automatic?.key===resumed.pool.automatic.key&&p.classRef===resumed.pool.classRef);
 let pool=resumed?.pool??source??{id:crypto.randomUUID(),ownerCharacterId:c.id,kind,name:kind==='hitDie'?'Hit Dice':kind==='spellSlot'?'Spell slots':'',current:1,max:1,recharge:{kind:'manual' as const}};
 if(resumed?.existing&&source&&pool.id!==source.id){id=source.id;pool={...pool,id:source.id};}
 const persistence=draftOptions(ctx,'resource',pool.name||'Ny beholdning',{pool,existing:!!id,kind},id);
 if(persistence)persistence.payload=()=>({pool,existing:!!id,kind});
 const fingerprint=(value:Character['resources'][number]|undefined)=>value?JSON.stringify(characterSchema.shape.resources.element.parse(value)):undefined;
 const save=async(form:HTMLFormElement,completion?:import('../domain/wizard-draft').DraftToken)=>{
  const latest=ctx.current();if(latest.id!==c.id||id&&fingerprint(latest.resources.find(p=>p.id===id))!==fingerprint(pool))throw new Error('Beholdningen er endret eller fjernet siden utkastet ble startet. Forkast utkastet og åpne beholdningen på nytt.');
  const data=new FormData(form),max=Number(data.get('max')),current=Number(data.get('current'));
  if(!Number.isInteger(max)||!Number.isInteger(current)||max<0||current<0||current>max)throw new Error('Tilgjengelig må være mellom 0 og maks.');
  const next={...pool,name:String(data.get('poolName')).trim(),max,current,recharge:{...pool.recharge,kind:(source?.recharge.kind==='special'?'special':String(data.get('recharge'))) as typeof pool.recharge.kind}};
  if(source?.automatic)next.manualMaximum=source.manualMaximum||max!==source.automatic.max;
  if(kind==='spellSlot'){next.spellLevel=Number(data.get('spellLevel'));next.systemRef=String(data.get('system'));if(!source)next.recharge.kind=next.systemRef==='Pact Magic'?'shortRest':'longRest';}
  if(kind==='hitDie')next.die=String(data.get('die')) as 'd8';
  await ctx.save(characterSchema.parse({...latest,resources:id?latest.resources.map(p=>p.id===id?next:p):[...latest.resources,next]}),'resources',source?'Beholdning tilpasset':'Beholdning lagt til',completion);
 };
 const d=wizardDialog(source?'Tilpass beholdning':'Ny beholdning',[
  {title:'Hva heter beholdningen?',art:'resource',html:field('Navn','poolName',pool.name,'required maxlength="100"')+(kind==='spellSlot'?select('Slotnivå','spellLevel',String(pool.spellLevel??1),Array.from({length:9},(_,i)=>({value:String(i+1),label:`Nivå ${i+1}`})))+select('Slotsystem','system',pool.systemRef??'Spellcasting',[{value:'Spellcasting',label:'Spellcasting'},{value:'Pact Magic',label:'Pact Magic'},...(pool.systemRef&&!['Spellcasting','Pact Magic'].includes(pool.systemRef)?[{value:pool.systemRef,label:pool.systemRef}]:[])]):kind==='hitDie'?select('Terning','die',pool.die??'d8',['d6','d8','d10','d12'].map(value=>({value,label:value}))):'')},
  {title:'Hvor mange er tilgjengelige?',art:'resource',html:field('Maks','max',pool.max,'type="number" min="0" required')+field('Tilgjengelig','current',pool.current,`type="number" min="0" max="${pool.max}" required`)},
  {title:'Når fylles beholdningen opp?',help:'Velg når du vanligvis får tilbake brukt kapasitet. Særregler vurderer du sammen med DM.',art:'resource',html:select('Gjenopprettes ved','recharge',pool.recharge.kind,source?.recharge.kind==='special'?[...rechargeOptions,{value:'special',label:'Særregel (beholdes)'}]:rechargeOptions)+(pool.recharge.ruleText?`<p>${esc(pool.recharge.ruleText)}</p>`:''),when:()=>kind==='custom'},
 ],save,source?'Lagre':'Legg til',persistence);
 const form=d.querySelector('form')!,max=form.querySelector<HTMLInputElement>('[name="max"]')!,current=form.querySelector<HTMLInputElement>('[name="current"]')!;
 current.max=max.value;
 let touched=!!source;
 current.addEventListener('input',()=>{touched=true;});
 max.addEventListener('input',()=>{current.max=max.value;if(!touched)current.value=max.value;});
 if(source){
  const remove=document.createElement('button');remove.type='button';remove.className='danger';remove.textContent='Fjern beholdning';
  d.querySelector('#dialog-body')!.append(remove);
  remove.onclick=()=>confirmDialog('Fjern beholdning?','<p>Automatiske klassebeholdninger kan settes til maks 0 under Tilpass. Det bevarer den manuelle overstyringen.</p>',async()=>{
   const draft=structuredClone(c);if(source.automatic){const p=draft.resources.find(p=>p.id===source.id)!;p.max=0;p.current=0;p.manualMaximum=true;}else draft.resources=draft.resources.filter(p=>p.id!==source.id);
   const {flushWizard}=await import('./wizard');await ctx.save(draft,'resources','Beholdning fjernet',await flushWizard(d));
  },'Fjern');
 }
}
export function resourceDialog(ctx:EditorContext,id:string,onHp?:()=>void){
 const c=ctx.current(),pool=c.resources.find(p=>p.id===id);if(!pool)return;
 const d=viewDialog(pool.name,`<button type="button" class="resource-total number-value" id="pool-value" aria-label="Endre ${esc(pool.name)}">${pool.current} / ${pool.max}${pool.die?' '+esc(pool.die):''}</button><div class="resource-quick"><button type="button" data-adjust="-1" ${pool.current<=0?'disabled':''}>Bruk én</button><button type="button" data-adjust="1" ${pool.current>=pool.max?'disabled':''}>Gi tilbake én</button></div>${pool.recharge.ruleText?`<p class="muted">${esc(pool.recharge.ruleText)}</p>`:''}<div class="actions"><button type="button" id="pool-customize">Tilpass</button>${pool.kind==='hitDie'&&onHp?'<button type="button" id="pool-hp">Endre HP</button>':''}</div>`);
 d.querySelector<HTMLButtonElement>('#pool-value')!.onclick=()=>numberChangeDialog({name:pool.name,icon:'resource',original:pool.current,min:0,max:pool.max,onConfirm:async result=>{
  if(result!==pool.current)await ctx.save(adjustPool(c,id,result-pool.current),'resources',`${pool.name}: ${pool.current} → ${result}`);
  resourceDialog(ctx,id,onHp);
 }});
 d.querySelectorAll<HTMLButtonElement>('[data-adjust]').forEach(b=>b.onclick=()=>void commitDialog(()=>ctx.save(adjustPool(c,id,Number(b.dataset.adjust)),'resources',`${pool.name}: ${Number(b.dataset.adjust)<0?'én brukt':'én gitt tilbake'}`)));
 d.querySelector<HTMLButtonElement>('#pool-customize')!.onclick=()=>resourceWizard(ctx,id,pool.kind);
 const hp=d.querySelector<HTMLButtonElement>('#pool-hp');if(hp)hp.onclick=onHp!;
}
export function restDialog(ctx:EditorContext,onHp?:()=>void){
 const c=ctx.current();
 const choice=viewDialog('Hvile',`<div class="choice-list"><button type="button" data-rest="shortRest">Kort hvile</button><button type="button" data-rest="longRest">Lang hvile</button></div><h3>Hit Dice</h3><div class="pills">${c.resources.filter(p=>p.kind==='hitDie').map(p=>`<button class="pill" type="button" data-rest-die="${p.id}">${esc(p.name)}<small>${p.current} / ${p.max}</small></button>`).join('')}</div><details><summary>Manuelt Hit Dice-oppsett</summary><button type="button" id="manual-hit-die">Legg til beholdning</button></details>`);
 choice.querySelectorAll<HTMLButtonElement>('[data-rest-die]').forEach(b=>b.onclick=()=>resourceDialog(ctx,b.dataset.restDie!,onHp));
 choice.querySelector<HTMLButtonElement>('#manual-hit-die')!.onclick=()=>resourceWizard(ctx,undefined,'hitDie');
 choice.querySelectorAll<HTMLButtonElement>('[data-rest]').forEach(b=>b.onclick=()=>openRest(b.dataset.rest as 'longRest'|'shortRest'));
 function openRest(kind:'shortRest'|'longRest'){
  const recovery=kind==='longRest'?defaultHitRecovery(c):{},dice=c.resources.filter(p=>p.kind==='hitDie'&&p.current<p.max),budget=hitRecoveryBudget(c);
  const ambiguous=kind==='longRest'&&dice.length>1&&Object.values(recovery).every(n=>n===0);
  const conditional=c.resources.filter(p=>p.current<p.max&&p.recharge.ruleText&&(p.recharge.kind==='shortRest'||kind==='longRest'&&p.recharge.kind==='longRest'));
  const d=editDialog(kind==='longRest'?'Lang hvile':'Kort hvile',`${ambiguous?`<fieldset><legend>Hvilke Hit Dice får du tilbake?</legend><p>Velg inntil ${budget} terninger totalt.</p>${dice.map(p=>field(`${p.name} (${p.current}/${p.max})`,p.id,0,`type="number" min="0" max="${Math.min(budget,p.max-p.current)}" required`)).join('')}</fieldset>`:''}${conditional.map(p=>`<label class="check"><input type="checkbox" name="condition" value="${p.id}">${esc(p.name)}: ${esc(p.recharge.ruleText)}</label>`).join('')}<div id="rest-preview" aria-live="polite"></div><p class="muted">DM avgjør hvilen. Tilstander, exhaustion og øvrige særregler føres manuelt.</p>`,async form=>{
   const next=preview(form);await ctx.save(next,'rest',kind==='longRest'?'Lang hvile registrert':'Kort hvile registrert');
  },'Fullfør hvilen');
  d.dataset.size='compact';
  const form=d.querySelector('form')!;
  function preview(form:HTMLFormElement){
   const data=new FormData(form),selected=ambiguous?Object.fromEntries(dice.map(p=>[p.id,Number(data.get(p.id))])):recovery;
   return restResult(c,kind,selected,new Set(data.getAll('condition').map(String)));
  }
  const update=()=>{
   const submit=d.querySelector<HTMLButtonElement>('#submit')!;
   try{
    const next=preview(form),changes:string[]=[];
    if(next.hp.current!==c.hp.current)changes.push(`HP: ${c.hp.current} → ${next.hp.current}`);
    if(next.hp.temp!==c.hp.temp)changes.push(`Temporary HP: ${c.hp.temp} → ${next.hp.temp}`);
    next.resources.forEach(p=>{const old=c.resources.find(r=>r.id===p.id)!;if(p.current!==old.current)changes.push(`${p.name}: ${old.current} → ${p.current} / ${p.max}`);});
    d.querySelector('#rest-preview')!.innerHTML=changes.length?`<h3>Etter hvilen</h3><ul>${changes.map(line=>`<li>${esc(line)}</li>`).join('')}</ul>`:'<p>Ingen beholdninger endres med disse valgene.</p>';
    submit.disabled=false;
   }catch(error){d.querySelector('#rest-preview')!.textContent=(error as Error).message;submit.disabled=true;}
  };
  form.addEventListener('input',update);form.addEventListener('change',update);update();
 }
}
