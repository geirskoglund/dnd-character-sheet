import {changeBounds,changeResult,normaliseChange,parseWheelInteger,type ChangeLimits} from '../domain/number-change';
import {escapeHtml as esc} from './html';
import {icon,type UIIcon} from './icons';
import {wizardArt} from './wizard-art';

export interface NumberChangeOptions extends ChangeLimits {
 name:string;original:number;icon?:UIIcon;decimal?:boolean;wholeLabel?:string;
 /** Optional domain breakdown; input and result are in integer storage units. */
 preview?:(delta:number,result:number)=>string;
 onConfirm:(result:number,delta:number)=>void|Promise<void>;
}
const RADIUS=60;
const signed=(n:number)=>n>0?`+${n}`:String(n).replace('-','−');
/** An independent native modal keeps the caller's nodes, listeners, scroll and draft alive. */
export function numberChangeDialog(options:NumberChangeOptions) {
 const opener=document.activeElement as HTMLElement|null;
 const action=opener?.getAttribute('data-action');
 const returnSelector=action?`[data-action="${CSS.escape(action)}"]`:opener?.id?`#${CSS.escape(opener.id)}`:'';
 const returnScroll=window.scrollY;
 const d=document.createElement('dialog');d.className='number-change-dialog';d.setAttribute('aria-labelledby','number-change-title');
 const scale=options.decimal?100:1;
 let whole=0,fraction=0,pending=false;
 const format=(value:number)=>options.decimal?`${value<0?'−':''}${Math.floor(Math.abs(value)/100)},${String(Math.abs(value)%100).padStart(2,'0')}`:String(value);
 d.innerHTML=`<form novalidate><div class="dialog-heading"><h2 id="number-change-title" tabindex="-1">Endre ${esc(options.name)}</h2><button type="button" class="dialog-close" data-dismiss aria-label="Avbryt endring">${icon('close')}</button></div><div class="number-change-body">${wizardArt(options.icon??'emblem')}<div class="number-comparison" aria-live="polite"><span class="number-before"><small>Før</small><b>${esc(format(options.original))}</b></span><span aria-hidden="true">→</span><span class="number-after"><small>Etter</small><b></b></span></div><div class="change-wheels"></div><p class="number-help">Sveip opp eller ned. Trykk på midttallet for å skrive.</p><p class="number-breakdown" aria-live="polite"></p><p class="number-change-error" role="alert"></p></div><div class="dialog-actions"><button type="button" data-dismiss>Avbryt</button><button type="submit">OK</button></div></form>`;
 document.body.append(d);
 const error=d.querySelector<HTMLElement>('.number-change-error')!,submit=d.querySelector<HTMLButtonElement>('[type=submit]')!;
 const delta=()=>Number(BigInt(whole)*BigInt(scale)+BigInt(fraction));
 const valid=()=>{const b=changeBounds(options.original,options);return delta()>=b.min&&delta()<=b.max&&Number.isSafeInteger(delta());};
 const update=()=>{
  const result=changeResult(options.original,delta());
  d.querySelector('.number-after b')!.textContent=format(result);
  d.querySelector('.number-breakdown')!.textContent=options.preview?.(delta(),result)??'';
  submit.disabled=pending||!valid();
 };
 type Wheel={draw:()=>void;flush:()=>boolean;stop:()=>void};
 const wheels:Wheel[]=[];
 const set=(which:'whole'|'fraction',next:number)=>{
  if(which==='fraction')fraction=Math.max(-99,Math.min(99,next));else whole=next;
  const candidate=BigInt(whole)*BigInt(scale)+BigInt(fraction);
  const bounded=BigInt(normaliseChange(options.original,candidate,options));
  if(bounded!==candidate){
   // Normalise the two wheels together at a result boundary, preserving exact CP.
   whole=Number(bounded/BigInt(scale));fraction=Number(bounded%BigInt(scale));
  }
  error.textContent='';update();
 };
 function wheel(which:'whole'|'fraction',label:string){
  const shell=document.createElement('div');shell.className='change-wheel';
  shell.innerHTML=`<span class="change-wheel-label">${esc(label)}</span><div class="change-wheel-track" role="spinbutton" tabindex="0" aria-label="Tallhjul: ${esc(label)}"></div><button type="button" class="wheel-value" data-wheel-value aria-label="Skriv inn ${esc(label)}">0</button><div class="wheel-entry" hidden><input type="text" inputmode="numeric" autocomplete="off" aria-label="${esc(label)}" spellcheck="false"><button type="button" class="wheel-sign" aria-label="Bytt fortegn for ${esc(label)}">±</button></div>`;
  d.querySelector('.change-wheels')!.append(shell);
  const track=shell.querySelector<HTMLElement>('.change-wheel-track')!,value=shell.querySelector<HTMLButtonElement>('.wheel-value')!,entry=shell.querySelector<HTMLElement>('.wheel-entry')!,input=entry.querySelector('input')!;
  let rowHeight=44,first=0,timer:ReturnType<typeof setTimeout>|undefined,gesturing=false,editing=false,touching=false;
  const current=()=>which==='whole'?whole:fraction;
  const bounds=()=>{
   if(which==='fraction')return {min:-99,max:99};
   const b=changeBounds(options.original,options);
   // Decimal boundaries may adjust the fractional wheel at the same time.
   return {min:Math.ceil((b.min-(options.decimal?99:0))/scale),max:Math.floor((b.max+(options.decimal?99:0))/scale)};
  };
  const stop=()=>{gesturing=false;clearTimeout(timer);track.scrollTo({top:track.scrollTop,behavior:'instant'});};
  const draw=()=>{
   const n=current(),b=bounds();first=Math.max(n,Math.min(b.max,n+RADIUS));
   const last=Math.min(n,Math.max(b.min,n-RADIUS));track.replaceChildren();
   for(let v=first;v>=last;v--){const row=document.createElement('div');row.className='change-wheel-row';row.dataset.value=String(v);row.textContent=signed(v);row.setAttribute('aria-hidden','true');
    row.onclick=()=>{if(v===current()){edit();return;}stop();set(which,v);wheels.forEach(w=>w.draw());};if(v===n){row.removeAttribute('aria-hidden');row.replaceChildren(value);}track.append(row);
   }
   rowHeight=(track.firstElementChild as HTMLElement).getBoundingClientRect().height;
   track.scrollTop=(first-n)*rowHeight;entry.style.top=`${track.offsetTop+2*rowHeight}px`;
   track.setAttribute('aria-valuenow',String(n));track.setAttribute('aria-valuetext',signed(n));
   if(which==='fraction'||options.min!==undefined||!options.allowNegative)track.setAttribute('aria-valuemin',String(b.min));
   if(which==='fraction'||options.max!==undefined)track.setAttribute('aria-valuemax',String(b.max));
   value.textContent=signed(n);value.style.fontSize=`${Math.max(1,Math.min(1.9,13/Math.max(1,signed(n).length)))}rem`;entry.style.fontSize=value.style.fontSize;
  };
  const flush=()=>{
   stop();if(!editing)return true;
   const parsed=parseWheelInteger(input.value);
   if(parsed===null){error.textContent='Skriv et heltall, med eventuelt + eller − foran. Komma og desimalpunkt kan ikke brukes i ett hjul.';input.setAttribute('aria-invalid','true');return false;}
   editing=false;input.removeAttribute('aria-invalid');entry.hidden=true;value.hidden=false;
   // Only physically representable storage integers are accepted.
   const safe=which==='fraction'?99:Number.MAX_SAFE_INTEGER;
   set(which,Math.max(-safe,Math.min(safe,parsed)));wheels.forEach(w=>w.draw());return true;
  };
  const edit=()=>{
   if(pending)return;
   for(const w of wheels)if(!w.flush())return;
   stop();editing=true;entry.hidden=false;value.hidden=true;input.value=String(current());input.focus({preventScroll:true});input.select();
  };
  value.onclick=e=>{e.stopPropagation();edit();};
  // The input never owns commit: blur validates synchronously, without replacing the action nodes.
  input.onblur=()=>{flush();};
  input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();if(flush())value.focus({preventScroll:true});}};
  shell.querySelector<HTMLButtonElement>('.wheel-sign')!.onpointerdown=e=>e.preventDefault();
  shell.querySelector<HTMLButtonElement>('.wheel-sign')!.onclick=()=>{input.value=input.value.startsWith('-')?input.value.slice(1):'-'+input.value.replace(/^\+/,'');input.focus({preventScroll:true});};
  for(const event of ['wheel','touchstart','pointerdown'])track.addEventListener(event,()=>{if(!pending&&!editing)gesturing=true;},{passive:true});
  const settle=()=>{if(!gesturing||editing||pending||touching)return;gesturing=false;wheels.forEach(w=>w.draw());};
  track.addEventListener('scroll',()=>{
   if(!gesturing||editing||pending)return;
   const row=track.children[Math.round(track.scrollTop/rowHeight)] as HTMLElement|undefined;if(row){set(which,Number(row.dataset.value));value.textContent=signed(current());for(const item of track.children){const r=item as HTMLElement;if(r.contains(value)){r.textContent=signed(Number(r.dataset.value));r.setAttribute('aria-hidden','true');}}const selected=[...track.children].find(r=>Number((r as HTMLElement).dataset.value)===current());selected?.removeAttribute('aria-hidden');selected?.replaceChildren(value);track.setAttribute('aria-valuenow',String(current()));}
   clearTimeout(timer);timer=setTimeout(settle,160);
  },{passive:true});
  track.addEventListener('touchstart',()=>{touching=true;},{passive:true});
  for(const event of ['touchend','touchcancel'])track.addEventListener(event,()=>{touching=false;clearTimeout(timer);timer=setTimeout(settle,160);},{passive:true});
  track.addEventListener('scrollend',settle);
  track.onkeydown=e=>{
   if(pending){e.preventDefault();return;}
   const moves:Record<string,number>={ArrowUp:1,ArrowDown:-1,ArrowLeft:-1,ArrowRight:1,PageUp:10,PageDown:-10};
   if(e.key in moves||e.key==='Home'||e.key==='End'){e.preventDefault();stop();const b=bounds();set(which,e.key==='Home'?b.min:e.key==='End'&&(which==='fraction'||options.max!==undefined)?b.max:e.key==='End'?current()+10:current()+moves[e.key]);wheels.forEach(w=>w.draw());}
   else if(e.key==='Enter'){e.preventDefault();edit();}
  };
  const observer=new ResizeObserver(()=>{if(!gesturing)draw();});observer.observe(track);observer.observe(shell);
  d.addEventListener('close',()=>observer.disconnect(),{once:true});
  const controller={draw,flush,stop};wheels.push(controller);return controller;
 }
 wheel('whole',options.decimal?(options.wholeLabel??'Heltall'):'Endring');if(options.decimal)wheel('fraction','Hundredeler');
 const dismiss=()=>{if(!pending){wheels.forEach(w=>w.stop());d.close();d.remove();const target=opener?.isConnected?opener:returnSelector?document.querySelector<HTMLElement>(returnSelector):null;
  (target??document.querySelector<HTMLElement>('dialog[open] h2'))?.focus({preventScroll:true});window.scrollTo(0,returnScroll);}};
 d.oncancel=e=>{e.preventDefault();dismiss();};
 d.querySelectorAll<HTMLButtonElement>('[data-dismiss]').forEach(button=>{
  button.onpointerdown=e=>e.preventDefault();button.onclick=dismiss;
 });
 submit.onpointerdown=e=>e.preventDefault();
 d.querySelector('form')!.onsubmit=async e=>{
  e.preventDefault();if(pending)return;
  for(const w of wheels)if(!w.flush())return;
  if(!valid())return;
  pending=true;update();d.setAttribute('aria-busy','true');d.querySelectorAll<HTMLButtonElement>('button').forEach(b=>b.disabled=true);
  try{await options.onConfirm(changeResult(options.original,delta()),delta());pending=false;dismiss();}
  catch(failure){error.textContent=failure instanceof Error?failure.message:'Kunne ikke lagre. Endringen er bevart.';}
  finally{pending=false;d.removeAttribute('aria-busy');d.querySelectorAll<HTMLButtonElement>('button').forEach(b=>b.disabled=false);update();}
 };
 d.showModal();wheels.forEach(w=>w.draw());update();d.querySelector<HTMLElement>('h2')!.focus({preventScroll:true});
 // Keep actions visible when the on-screen keyboard reduces the visual viewport.
 const fit=()=>{d.style.height=`${window.visualViewport?.height??innerHeight}px`;d.style.top=`${window.visualViewport?.offsetTop??0}px`;};
 window.visualViewport?.addEventListener('resize',fit);window.visualViewport?.addEventListener('scroll',fit);fit();
 d.addEventListener('close',()=>{window.visualViewport?.removeEventListener('resize',fit);window.visualViewport?.removeEventListener('scroll',fit);},{once:true});
 return d;
}
