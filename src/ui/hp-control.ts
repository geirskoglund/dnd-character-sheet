import type {Character} from '../domain/model';
import {hpAfterChange,hpDeltaBounds,clampHpDelta} from '../domain/derived';
import {icon} from './icons';

export function hpControl(hp:Character['hp']) {
  const {min,max}=hpDeltaBounds(hp), travel=Math.max(10,Math.min(50,Math.max(-min,max)));
  return `<div class="hp-current">${icon('healing')}<p><strong>${hp.current}</strong><span>/ ${hp.max} HP</span></p><small>Temporary HP <b>${hp.temp}</b></small></div>
    <p class="hp-instruction">Dra for å justere. Slipp for å gå tilbake til midten.</p>
    <div class="hp-slide-frame"><span class="hp-direction">−</span><span class="hp-neutral" aria-hidden="true"></span><input type="range" name="delta" aria-label="Endring i HP" min="-${travel}" max="${travel}" step="1" value="0"><span class="hp-direction">+</span></div>
    <div class="hp-scale-labels"><span>Skade</span><span>Healing</span></div>
    <div class="hp-exact"><button type="button" id="hp-minus" aria-label="Reduser endring med 1">−1</button><label>HP-endring i tall<input name="deltaAmount" type="number" min="${min}" max="${max}" value="0" step="1" inputmode="numeric" required></label><button type="button" id="hp-plus" aria-label="Øk endring med 1">+1</button></div>
    <div class="hp-result"><h3>Etter endringen</h3><p id="hp-preview" aria-live="polite"></p><p class="muted">Skade bruker temporary HP først. Healing endrer bare vanlig HP.</p></div>`;
}
/** The range holds displacement during a gesture; the amount holds the pending transaction. */
export function bindHpControl(d:HTMLDialogElement,hp:Character['hp']) {
  const slider=d.querySelector<HTMLInputElement>('[name="delta"]')!;
  const amount=d.querySelector<HTMLInputElement>('[name="deltaAmount"]')!;
  const minus=d.querySelector<HTMLButtonElement>('#hp-minus')!,plus=d.querySelector<HTMLButtonElement>('#hp-plus')!;
  const submit=d.querySelector<HTMLButtonElement>('#submit')!;
  const {min,max}=hpDeltaBounds(hp);
  let pending=0,base=0,dragging=false;
  const update=(value:number)=>{
    pending=clampHpDelta(hp,value);amount.value=String(pending);
    const after=hpAfterChange(hp,pending);
    d.querySelector('#hp-preview')!.textContent=`${pending>0?'+':''}${pending}: HP ${hp.current} → ${after.current} / ${after.max} · Temporary HP ${hp.temp} → ${after.temp}`;
    slider.setAttribute('aria-valuetext',`${pending>0?'+':''}${pending} HP valgt. Slipp for å sentrere grepet.`);
    submit.disabled=pending===0;minus.disabled=pending<=min;plus.disabled=pending>=max;
  };
  const reset=()=>{slider.value='0';dragging=false;base=pending;slider.setAttribute('aria-valuetext',`Nøytral midtposisjon. HP-endring ${pending>0?'+':''}${pending}.`);};
  slider.onpointerdown=()=>{base=pending;dragging=true;};
  slider.oninput=()=>{
    if(!dragging)base=pending;
    const offset=Number(slider.value),desired=base+offset;
    update(desired);
  };
  slider.onpointerup=reset;slider.onpointercancel=reset;slider.onchange=reset;slider.onblur=reset;
  slider.onkeydown=e=>{
    const steps:Record<string,number>={ArrowLeft:-1,ArrowDown:-1,ArrowRight:1,ArrowUp:1,PageDown:-10,PageUp:10};
    if(e.key in steps || e.key==='Home' || e.key==='End'){
      e.preventDefault();update(e.key==='Home'?min:e.key==='End'?max:pending+steps[e.key]);reset();
    }
  };
  amount.oninput=()=>{
    if(amount.value===''||!Number.isFinite(amount.valueAsNumber)||!Number.isInteger(amount.valueAsNumber)){submit.disabled=true;return;}
    update(amount.valueAsNumber);reset();
  };
  minus.onclick=()=>{update(pending-1);reset();};plus.onclick=()=>{update(pending+1);reset();};
  update(0);reset();
}
