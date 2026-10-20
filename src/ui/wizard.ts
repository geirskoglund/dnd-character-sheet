import {editDialog} from './dialog';
import {enhanceNumbers} from './number-wheel';
import {escapeHtml as esc} from './html';
export interface WizardStep {title:string;html:string;when?:(form:HTMLFormElement)=>boolean}
export function wizardDialog(title:string,steps:WizardStep[],save:(form:HTMLFormElement)=>Promise<void>,label='Legg til'){
 const d=editDialog(title,steps.map((s,i)=>`<div data-wizard-step="${i}"><h3 tabindex="-1">${esc(s.title)}</h3>${s.html}</div>`).join(''),save,label);
 bindWizard(d,steps.map((s,i)=>({element:d.querySelector<HTMLElement>(`[data-wizard-step="${i}"]`)!,when:s.when})),label);
 return d;
}
export function bindWizard(d:HTMLDialogElement,steps:{element:HTMLElement;when?:(form:HTMLFormElement)=>boolean}[],label='Lagre'){
 const form=d.querySelector('form')!,submit=d.querySelector<HTMLButtonElement>('#submit')!,nativeSubmit=form.onsubmit;
 form.noValidate=true;
 const back=document.createElement('button');back.type='button';back.id='wizard-back';back.textContent='Tilbake';submit.before(back);
 let current=0;
 const active=()=>steps.map((s,i)=>({s,i})).filter(({s})=>!s.when||s.when(form)).map(({i})=>i);
 const navigation=()=>{const visible=active();back.hidden=current===visible[0];submit.textContent=current===visible.at(-1)?label:'Neste';};
 const draw=()=>{
  const visible=active();if(!visible.includes(current))current=visible[0];
  steps.forEach((s,i)=>{s.element.hidden=i!==current;});
  navigation();
  enhanceNumbers(steps[current].element);
  d.querySelector('#dialog-body')!.scrollTop=0;
 };
 const valid=()=>{
  const controls=steps[current].element.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>('input,select,textarea');
  for(const control of controls){if(control.disabled||!control.getClientRects().length)continue;if(!control.checkValidity()){control.reportValidity();return false;}}
  return true;
 };
 form.onsubmit=e=>{
  e.preventDefault();if(!valid())return;
  const visible=active(),index=visible.indexOf(current);
  if(index<visible.length-1){current=visible[index+1];draw();steps[current].element.querySelector<HTMLElement>('h3,legend')?.focus({preventScroll:true});}
  else nativeSubmit?.call(form,e);
 };
 form.addEventListener('change',navigation);
 back.onclick=()=>{const visible=active();current=visible[Math.max(0,visible.indexOf(current)-1)];draw();};
 draw();
}
