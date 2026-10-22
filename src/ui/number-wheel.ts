import {enhanceText} from './text-editor';
import {numberChangeDialog} from './number-change-dialog';
/** Numeric form values open the same additive modal as values on the character sheet. */
export function enhanceNumbers(root:ParentNode){
 enhanceText(root);
 root.querySelectorAll<HTMLInputElement>('input[type="number"]:not([data-wheel-bound]):not([data-no-wheel])').forEach(input=>{
  input.dataset.wheelBound='true';
  const label=input.getAttribute('aria-label')||input.closest('label')?.childNodes[0]?.textContent?.trim()||input.name;
  input.setAttribute('aria-label',label);input.setAttribute('aria-haspopup','dialog');
  // Keep native numeric validation and FormData, but send actual user input through the modal.
  input.inputMode='none';input.classList.add('number-value');input.placeholder||='—';
  const pill=input.closest('label');
  if(pill){
   pill.classList.add('number-pill');
   const caption=document.createElement('small');caption.textContent=input.dataset.numberCaption??label;
   for(const node of [...pill.childNodes])if(node.nodeType===Node.TEXT_NODE)node.remove();
   pill.prepend(caption);
  }
  const open=()=>{
   if(input.disabled||input.closest('[inert]'))return;
   const original=Number.isFinite(input.valueAsNumber)?input.valueAsNumber:0;
   numberChangeDialog({name:input.dataset.numberTitle??label,original,min:input.min!==''?Number(input.min):undefined,max:input.max!==''?Number(input.max):undefined,allowNegative:input.dataset.allowNegative!==undefined,
    onConfirm:result=>{
     if(input.value===String(result))return;
     input.value=String(result);input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));
    }});
  };
  input.onclick=open;
  input.addEventListener('beforeinput',event=>{event.preventDefault();});
  input.onkeydown=event=>{if(event.key==='Tab'||event.key==='Escape')return;if(event.ctrlKey||event.metaKey)return;event.preventDefault();open();};
 });
}
