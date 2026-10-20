import {moneyParts,moneyText,moneyFromText,moneyFromParts} from '../domain/money';
import {field} from './html';
import {enhanceNumbers} from './number-wheel';
export function moneyControl(cp:number){const p=moneyParts(cp);return `<button type="button" class="money-total" id="money-exact" aria-label="Skriv inn GP-beløp">${moneyText(cp).replace('.',',')} <small>GP</small></button><label id="money-entry" hidden>GP<input type="number" name="gold" value="${moneyText(cp)}" step="0.01" min="0" required data-no-wheel></label><div class="money-wheels">${field('Hele GP','goldWhole',p.whole,`type="number" min="0" max="${Math.floor(Number.MAX_SAFE_INTEGER/100)}" step="1" data-wheel-edit="money"`)}${field('Desimaler','goldFraction',p.fraction,'type="number" min="0" max="99" step="1" data-zero-pad="2" data-wheel-edit="money"')}</div><p id="money-error" role="alert"></p><p class="money-help">Rull hele GP og desimaler hver for seg. Trykk på beløpet for å skrive direkte.</p>`;}
export function bindMoneyControl(d:HTMLDialogElement){
 const form=d.querySelector('form')!,whole=form.querySelector<HTMLInputElement>('[name="goldWhole"]')!,fraction=form.querySelector<HTMLInputElement>('[name="goldFraction"]')!,exact=form.querySelector<HTMLInputElement>('[name="gold"]')!,display=d.querySelector<HTMLButtonElement>('#money-exact')!,entry=d.querySelector<HTMLElement>('#money-entry')!,submit=d.querySelector<HTMLButtonElement>('#submit')!;
 whole.setAttribute('aria-label','Hele GP');fraction.setAttribute('aria-label','Desimaler');enhanceNumbers(d);
 const freeze=()=>{whole.dispatchEvent(new Event('wheel-freeze'));fraction.dispatchEvent(new Event('wheel-freeze'));};
 const keyboard=()=>{freeze();entry.hidden=false;exact.focus();exact.select();};display.onclick=keyboard;form.addEventListener('wheel-edit',keyboard);
 const error=d.querySelector<HTMLElement>('#money-error')!;
 const update=(fromText=false)=>{try{const cp=fromText?moneyFromText(exact.value):moneyFromParts(whole.valueAsNumber,fraction.valueAsNumber),p=moneyParts(cp);if(fromText){whole.value=String(p.whole);fraction.value=String(p.fraction);whole.dispatchEvent(new Event('change'));fraction.dispatchEvent(new Event('change'));}else exact.value=moneyText(cp);display.innerHTML=`${moneyText(cp).replace('.',',')} <small>GP</small>`;submit.disabled=false;error.textContent='';}catch{submit.disabled=true;error.textContent='Angi et beløp fra 0 GP med høyst to desimaler, innenfor støttet tallområde.';}};
 whole.addEventListener('input',()=>update());fraction.addEventListener('input',()=>update());exact.addEventListener('input',()=>{freeze();update(true);});
 for(const input of [whole,fraction])input.closest('label')!.querySelector<HTMLButtonElement>('.wheel-toggle')!.click();
}
