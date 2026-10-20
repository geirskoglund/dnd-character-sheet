import type {Character} from '../domain/model';
import {hpAfterChange,hpDeltaBounds,clampHpDelta} from '../domain/derived';
import {icon} from './icons';
import {enhanceNumbers} from './number-wheel';
export function hpControl(hp:Character['hp']){
 const {min,max}=hpDeltaBounds(hp);
 return `<div class="hp-current">${icon('healing')}<p><strong>${hp.current}</strong><span>/ ${hp.max} HP</span></p><small>Temporary HP <b>${hp.temp}</b></small></div><label>HP-endring i tall<input name="deltaAmount" aria-label="HP-endring i tall" type="number" min="${min}" max="${max}" value="0" step="1" data-signed required></label><div class="resource-quick"><button type="button" id="hp-minus" aria-label="Reduser endring med 1">−1</button><button type="button" id="hp-plus" aria-label="Øk endring med 1">+1</button></div><div class="hp-result"><h3>Etter endringen</h3><p id="hp-preview" aria-live="polite"></p><p class="muted">Skade bruker temporary HP først. Healing endrer vanlig HP.</p></div>`;
}
export function bindHpControl(d:HTMLDialogElement,hp:Character['hp']){
 const amount=d.querySelector<HTMLInputElement>('[name="deltaAmount"]')!,submit=d.querySelector<HTMLButtonElement>('#submit')!;
 const minus=d.querySelector<HTMLButtonElement>('#hp-minus')!,plus=d.querySelector<HTMLButtonElement>('#hp-plus')!;
 const update=()=>{
  if(amount.value===''||!Number.isInteger(amount.valueAsNumber)){submit.disabled=true;return;}
  const delta=clampHpDelta(hp,amount.valueAsNumber);amount.value=String(delta);
  const after=hpAfterChange(hp,delta);d.querySelector('#hp-preview')!.textContent=`${delta>0?'+':''}${delta}: HP ${hp.current} → ${after.current} / ${after.max} · Temporary HP ${hp.temp} → ${after.temp}`;
  const {min,max}=hpDeltaBounds(hp);minus.disabled=delta<=min;plus.disabled=delta>=max;submit.disabled=delta===0;
 };
 amount.addEventListener('input',update);
 const step=(n:number)=>{amount.value=String(clampHpDelta(hp,(Number(amount.value)||0)+n));amount.dispatchEvent(new Event('input',{bubbles:true}));amount.dispatchEvent(new Event('change',{bubbles:true}));};
 minus.onclick=()=>step(-1);plus.onclick=()=>step(1);
 update();
 const toggle=amount.closest('.number-control')?.querySelector<HTMLButtonElement>('.wheel-toggle');
 if(toggle)toggle.click();else enhanceNumbers(d,'deltaAmount');
}
