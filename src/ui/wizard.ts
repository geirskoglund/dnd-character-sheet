import {validField} from './text-editor';
import {editDialog,commitDialog,confirmDialog} from './dialog';
import {enhanceNumbers} from './number-wheel';
import {escapeHtml as esc} from './html';
import {wizardArt} from './wizard-art';
import type {UIIcon} from './icons';
import type {WizardDraft,DraftToken} from '../domain/wizard-draft';
import {newWizardDraft} from '../domain/wizard-draft';
import type {WizardDraftRepository} from '../storage/wizard-drafts';
import type {EditorContext} from './record-editors';
export interface WizardStep {id?:string;title:string;html:string;help?:string;art?:UIIcon;when?:(form:HTMLFormElement)=>boolean}
export interface WizardPersistence {store:WizardDraftRepository;entry:WizardDraft;changed?:()=>Promise<void>;payload?:(form:HTMLFormElement)=>unknown}
export function draftOptions(ctx:EditorContext,kind:WizardDraft['kind'],label:string,payload:unknown,editingId?:string):WizardPersistence|undefined{
 if(!ctx.drafts)return;
 return {store:ctx.drafts,entry:ctx.resumedDraft??newWizardDraft({kind,label,payload,characterId:ctx.current()?.id,editingId}),changed:ctx.draftChanged};
}
export function choices(name:string,value:string,options:{value:string;label:string;art?:string;hint?:string}[],required=true){
 return `<div class="wizard-options" data-choice-field="${esc(name)}" ${required?'data-choice-required':''}><input type="hidden" name="${esc(name)}" value="${esc(value)}">${options.map(o=>`<button type="button" data-wizard-choice="${esc(o.value)}" aria-label="${esc(o.label)}" aria-pressed="${o.value===value}">${o.art??''}<span>${esc(o.label)}</span>${o.hint?`<small>${esc(o.hint)}</small>`:''}</button>`).join('')}</div>`;
}
export const yesNo=(name:string,value='')=>choices(name,value,[{value:'yes',label:'Ja'},{value:'no',label:'Nei'}]);
export function wizardDialog(title:string,steps:WizardStep[],save:(form:HTMLFormElement,completion?:DraftToken)=>Promise<void>,label='Fullfør',persistence?:WizardPersistence){
 const d=editDialog(title,steps.map((s,i)=>`<div data-wizard-step="${i}" data-question-id="${esc(s.id??String(i))}" data-question-title="${esc(s.title)}" data-question-help="${esc(s.help??'')}" data-question-art="${s.art??'sword'}">${s.html}</div>`).join(''),async form=>{await save(form,await flushWizard(d));},label);
 bindWizard(d,steps.map((s,i)=>({element:d.querySelector<HTMLElement>(`[data-wizard-step="${i}"]`)!,when:s.when})),label,persistence);
 return d;
}
const controllers=new WeakMap<HTMLDialogElement,{flush:()=>Promise<DraftToken|undefined>;jump:(id:string)=>void;refresh:()=>void;append:(steps:WizardStep[])=>void}>();
export const flushWizard=(d:HTMLDialogElement)=>controllers.get(d)?.flush()??Promise.resolve(undefined);
export const appendWizardSteps=(d:HTMLDialogElement,steps:WizardStep[])=>controllers.get(d)?.append(steps);
export const refreshWizard=(d:HTMLDialogElement)=>controllers.get(d)?.refresh();
function controls(form:HTMLFormElement){
 const counts=new Map<string,number>();
 return [...form.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>('input[name],select[name],textarea[name]')].filter(el=>!el.name.startsWith('_')).map(el=>{const index=counts.get(el.name)??0;counts.set(el.name,index+1);return {name:el.name,index,value:el.value,...el instanceof HTMLInputElement&&['checkbox','radio'].includes(el.type)?{checked:el.checked}:{}};});
}
function restore(form:HTMLFormElement,draft:WizardDraft){for(const entry of draft.controls){const input=[...form.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>('[name]')].filter(el=>el.name===entry.name)[entry.index];if(!input)continue;input.value=entry.value;if(input instanceof HTMLInputElement&&entry.checked!==undefined)input.checked=entry.checked;}form.dispatchEvent(new Event('change',{bubbles:true}));}
const questionTitles:Record<string,string>={name:'Hva heter oppføringen?',speciesChoice:'Hvilken art tilhører karakteren?',speciesName:'Hva heter arten?',speciesSpeed:'Hva er artens grunnfart?',ignoreArmorPenalty:'Ignorerer arten fartsreduksjon fra tung rustning?',classChoice:'Hvilken klasse har karakteren?',className:'Hva heter klassen?',subclassChoice:'Hvilken subclass har karakteren?',subclassName:'Hva heter subclassen?',classLevel:'Hvilket klassenivå har karakteren?',hpMax:'Hva er karakterens maksimale HP?',poolName:'Hva heter beholdningen?',max:'Hvor mange kan du ha til sammen?',current:'Hvor mange har du tilgjengelig nå?',spellLevel:'Hvilket nivå vil du føre?',category:'Hva slags egenskap er dette?'};
/** Shared question frame. Older forms are projected one control at a time without losing their listeners. */
export function bindWizard(d:HTMLDialogElement,groups:{element:HTMLElement;when?:(form:HTMLFormElement)=>boolean}[],label='Lagre',persistence?:WizardPersistence){
 const form=d.querySelector('form')!,body=d.querySelector<HTMLElement>('#dialog-body')!,submit=d.querySelector<HTMLButtonElement>('#submit')!,nativeSubmit=form.onsubmit;
 form.noValidate=true;d.dataset.wizard='true';
 const header=document.createElement('div');header.className='wizard-intro';header.innerHTML='<div class="wizard-progress" role="progressbar" aria-label="Fremdrift"></div><div class="wizard-picture"></div><h3 id="wizard-question" tabindex="-1"></h3><p id="wizard-help"></p>';body.prepend(header);
 const back=document.createElement('button');back.type='button';back.id='wizard-back';back.textContent='Tilbake';submit.before(back);
 let restoring=false,pendingWrites=0;
 let current=persistence?.entry.step??'',entry=persistence?.entry,revision=entry?.revision??0,changed=false,writing:Promise<void>=Promise.resolve(),failure:unknown;
 const alert=d.querySelector<HTMLElement>('#dialog-error')!;
 const available=(el:HTMLElement)=>{for(let p:HTMLElement|null=el.parentElement;p&&p!==body;p=p.parentElement)if(p.hidden&&!p.hasAttribute('data-wizard-hidden'))return false;return true;};
 const questions=()=>groups.flatMap((group,gi)=>{
  if(group.when&&!group.when(form))return [];
  const labels=[...group.element.querySelectorAll<HTMLElement>('label')].filter(el=>!!el.querySelector('input,select,textarea')&&!el.closest('.number-wheel'));
  const split=!group.element.matches('[data-question-id]')||labels.length>1;
  const labelled=split?labels:[group.element];
  group.element.dataset.wizardSplit=String(split);
  return labelled.filter(available).map((element,li)=>{
   const field=element.querySelector<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>('input[name],select[name],textarea[name]');
   const cls=element.closest<HTMLElement>('[data-class-id]')?.dataset.classId??'';
   const id=element.dataset.questionId??`${gi}:${cls}:${field?.name??li}`;
   const title=element.dataset.questionTitle??(field?.name==='name'&&form.querySelector('#class-rows')?'Hva heter karakteren?':questionTitles[field?.name??''])??(field?.name&&['STR','DEX','CON','INT','WIS','CHA'].includes(field.name)?`Hva er ${field.name}?`:element.childNodes[0]?.textContent?.trim()||'Hva vil du føre på arket?');
   element.dataset.wizardKey=id;
   return {element,id,title,help:element.dataset.questionHelp??(field?.name==='hpMax'?'På første nivå: full Hit Die + CON-modifier. Senere: fysisk kast eller fast verdi + CON. Angi samlet maks HP fra arket.':field?.name&&['STR','DEX','CON','INT','WIS','CHA'].includes(field.name)?'Bruk den endelige verdien på karakterarket, inkludert bonuser.':''),art:(element.dataset.questionArt??group.element.dataset.questionArt) as UIIcon|undefined,group};
  });
 }).sort((a,b)=>a.element===b.element?0:a.element.compareDocumentPosition(b.element)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1);
 const snapshot=():WizardDraft=>({...entry!,revision,step:current,controls:controls(form),payload:persistence?.payload?.(form)??entry!.payload,label:(form.querySelector<HTMLInputElement>('[name="itemName"],[name="name"],[name="poolName"]')?.value.trim()||entry!.label).slice(0,100)});
 const persist=()=>{
  if(!persistence||!changed)return writing;
  const value=snapshot();
  pendingWrites++;writing=writing.then(async()=>{entry=await persistence.store.save({...value,revision});revision=entry.revision;failure=undefined;alert.textContent='';}).catch(error=>{failure=error;alert.textContent='Utkastet kunne ikke lagres. '+(error as Error).message;}).finally(()=>{pendingWrites--;});
  return writing;
 };
 const flush=async()=>{if(!persistence)return undefined;changed=true;await persist();if(failure)throw failure;return {id:entry!.id,revision};};
 const splitOptions=()=>{
  for(const q of questions()){
   const field=q.element.querySelector<HTMLSelectElement|HTMLInputElement>('select,input[type="checkbox"]');if(!field||q.element.querySelector('[data-choice-field]'))continue;
   const name=field.name,options=field instanceof HTMLSelectElement?[...field.options].filter(o=>o.value!==''||!field.required).map(o=>({value:o.value,label:o.textContent??o.value})):[{value:'yes',label:'Ja'},{value:'no',label:'Nei'}];
   const selected=field instanceof HTMLSelectElement?field.value:field.checked?'yes':'no';
   if(!field.hasAttribute('aria-label'))field.setAttribute('aria-label',field.closest('label')?.childNodes[0]?.textContent?.trim()||name);
   field.hidden=true;field.setAttribute('aria-hidden','true');field.tabIndex=-1;
   const holder=document.createElement('div');holder.innerHTML=choices('_'+name,selected,options);q.element.append(holder);
   holder.querySelector('input')!.remove();holder.querySelector<HTMLElement>('[data-choice-field]')!.dataset.nativeChoice=name;
   q.element.dataset.questionTitle=q.title;
  }
 };
 const draw=()=>{
  enhanceNumbers(form);splitOptions();const list=questions();if(!list.length)return;
  let at=list.findIndex(q=>q.id===current);if(at<0){at=0;current=list[0].id;}
  for(const group of groups){group.element.hidden=false;group.element.dataset.wizardHidden='';if(group.element.dataset.wizardSplit==='true')group.element.querySelectorAll<HTMLElement>('label').forEach(el=>{el.hidden=true;el.dataset.wizardHidden='';});}
  groups.forEach(group=>{if(group.element.dataset.wizardSplit!=='true')group.element.hidden=true;else{group.element.querySelectorAll<HTMLElement>('.class-row').forEach(row=>{row.hidden=true;row.dataset.wizardHidden='';});}});
  d.querySelectorAll('[data-wizard-active]').forEach(el=>el.removeAttribute('data-wizard-active'));
  const q=list[at];q.element.dataset.wizardActive='true';q.element.hidden=false;for(let p=q.element.parentElement;p&&p!==body;p=p.parentElement)if(p.hasAttribute('data-wizard-hidden'))p.hidden=false;
  for(const group of groups)if(!group.element.contains(q.element)&&group.element!==q.element)group.element.hidden=true;
  for(const group of groups)if(group.element.dataset.wizardSplit==='true'){group.element.querySelectorAll<HTMLElement>('legend, p').forEach(el=>el.hidden=true);group.element.querySelectorAll<HTMLButtonElement>('button[data-remove-class],#add-class').forEach(b=>b.hidden=!q.element.closest('[data-class-id]')||b.hasAttribute('data-remove-class')&&form.querySelectorAll('[data-class-id]').length<2);}
  const question=header.querySelector<HTMLElement>('#wizard-question')!;question.textContent=q.title;
  header.querySelector('#wizard-help')!.textContent=q.help;header.querySelector('.wizard-picture')!.innerHTML=wizardArt(q.art??(q.element.closest('[data-class-id]')?'feature':'note'));
  const progress=header.querySelector<HTMLElement>('.wizard-progress')!;progress.setAttribute('aria-valuemin','1');progress.setAttribute('aria-valuemax',String(list.length));progress.setAttribute('aria-valuenow',String(at+1));progress.setAttribute('aria-valuetext',`${at+1} av ${list.length}`);
  progress.innerHTML=list.map((_,i)=>`<span class="${i<at?'done':i===at?'current':''}"></span>`).join('');
  back.hidden=at===0;submit.textContent=at===list.length-1?label:'Neste';submit.hidden=!!q.element.querySelector('[data-choice-field]')&&at<list.length-1;
  q.element.querySelectorAll<HTMLButtonElement>('[data-wizard-choice]').forEach(button=>{
   const holder=button.closest<HTMLElement>('[data-choice-field]')!,field=holder.dataset.nativeChoice?q.element.querySelector<HTMLInputElement|HTMLSelectElement>(`[name="${CSS.escape(holder.dataset.nativeChoice)}"]`):holder.querySelector<HTMLInputElement>('input');
   const value=field instanceof HTMLInputElement&&field.type==='checkbox'?(field.checked?'yes':'no'):field?.value;
   button.setAttribute('aria-pressed',String(button.dataset.wizardChoice===value));
   button.onclick=()=>{
    if(!field)return;if(field instanceof HTMLInputElement&&field.type==='checkbox')field.checked=button.dataset.wizardChoice==='yes';else field.value=button.dataset.wizardChoice!;
    field.dispatchEvent(new Event('change',{bubbles:true}));goNext(true);
   };
  });
  updateValidity();body.scrollTop=0;
 };
 const updateValidity=()=>{
  const q=questions().find(q=>q.id===current);
  submit.disabled=!q||[...q.element.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>('input,select,textarea')].some(f=>!f.disabled&&f.type!=='hidden'&&!validField(f))||[...q.element.querySelectorAll<HTMLElement>('[data-choice-required]')].some(h=>!h.dataset.nativeChoice&&!h.querySelector<HTMLInputElement>('input')?.value);
 };
 const valid=()=>{
  const q=questions().find(q=>q.id===current);if(!q)return false;
  for(const holder of q.element.querySelectorAll<HTMLElement>('[data-choice-required]')){if(holder.dataset.nativeChoice)continue;const input=holder.querySelector<HTMLInputElement>('input');if(input&&!input.value){alert.textContent='Velg et svar for å fortsette.';return false;}}
  for(const field of q.element.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>('input,select,textarea')){if(field.disabled||field.type==='hidden')continue;if(!validField(field)){alert.textContent='Fyll ut en gyldig verdi for å fortsette.';field.focus({preventScroll:true});return false;}}
  return true;
 };
 function goNext(choice=false){
  if(!valid())return;const list=questions(),at=list.findIndex(q=>q.id===current);
  if(at<list.length-1){current=list[at+1].id;draw();changed=true;void persist();header.querySelector<HTMLElement>('#wizard-question')!.focus({preventScroll:true});}
  else if(!choice)nativeSubmit?.call(form,new SubmitEvent('submit',{cancelable:true}));
 }
 form.onsubmit=e=>{e.preventDefault();goNext();};
 form.addEventListener('click',e=>{const target=e.target as HTMLElement;if(target.closest('#add-class,[data-remove-class]')){queueMicrotask(()=>{if(target.closest('#add-class')){const last=form.querySelector<HTMLElement>('.class-row:last-child');if(last)current=`1:${last.dataset.classId}:classChoice`;}draw();changed=true;void persist();});}});
 form.addEventListener('input',()=>{if(form.getAttribute('aria-busy')==='true')return;updateValidity();changed=true;void persist();});
 form.addEventListener('change',event=>{if(form.getAttribute('aria-busy')==='true')return;updateValidity();const field=event.target;if(!(field instanceof HTMLInputElement)||['hidden','checkbox','radio'].includes(field.type))draw();if(restoring)return;changed=true;void persist();});
 back.onclick=()=>{const list=questions(),at=list.findIndex(q=>q.id===current);current=list[Math.max(0,at-1)].id;draw();changed=true;void persist();};
 if(persistence){
  const unload=(e:BeforeUnloadEvent)=>{if(d.open&&form.isConnected&&(pendingWrites>0||failure)){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',unload);d.addEventListener('close',()=>window.removeEventListener('beforeunload',unload),{once:true});
  if(entry!.controls.length){restoring=true;restore(form,entry!);restoring=false;}
  const close=d.querySelector<HTMLButtonElement>('#cancel')!;close.setAttribute('aria-label','Lukk veiviseren');close.title='Lukk veiviseren';
  close.onclick=()=>void commitDialog(async()=>{if(changed||entry!.revision)await flush();await persistence.changed?.();});
  setDialogDismiss(d,()=>close.click());
  const discard=document.createElement('button');discard.type='button';discard.id='discard-wizard';discard.textContent='Forkast utkast';discard.className='wizard-discard';body.append(discard);
  discard.onclick=()=>confirmDialog('Forkast utkastet?','<p>Den uferdige registreringen slettes. Ferdig registrert innhold beholdes.</p>',async()=>{await writing;if(entry!.revision)await persistence.store.remove({id:entry!.id,revision});await persistence.changed?.();},'Forkast utkast');
 }
 controllers.set(d,{flush,jump:id=>{current=id;draw();},refresh:draw,append:steps=>{for(const step of steps){const el=document.createElement('div');el.dataset.questionId=step.id!;el.dataset.questionTitle=step.title;el.dataset.questionHelp=step.help??'';el.dataset.questionArt=step.art??'sword';el.innerHTML=step.html;body.insertBefore(el,body.querySelector('#discard-wizard'));groups.push({element:el,when:step.when});}draw();}});draw();
}
// A single dismissal path makes X and Escape preserve the same draft.
import {setDialogDismiss} from './dialog';
