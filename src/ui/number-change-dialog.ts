import {changeBounds,changeResult,normaliseChange,parseWheelInteger,type ChangeLimits} from '../domain/number-change';
import {escapeHtml as esc} from './html';
import {icon,type UIIcon} from './icons';
import {wizardArt} from './wizard-art';

type ComparisonValue={value:string;detail?:string};
export interface NumberChangeOptions extends ChangeLimits {
 name:string;title?:string;original:number;icon?:UIIcon;decimal?:boolean;wholeLabel?:string;fractionLabel?:string;
 /** Domain values may have a separate presentation, e.g. ordinary and temporary HP. */
 comparison?:(delta:number)=>{before:ComparisonValue;after:ComparisonValue};
 preview?:(delta:number,result:number)=>string;
 onConfirm:(result:number,delta:number)=>void|Promise<void>;
}
type WheelKey='whole'|'fraction';
const RADIUS=60;
const signed=(n:number)=>n>0?`+${n}`:String(n).replace('-','−');

/** A modal owns its scroll lock; the caller's actual nodes and unfinished form remain alive. */
export function numberChangeDialog(options:NumberChangeOptions) {
 const opener=document.activeElement as HTMLElement|null;
 const action=opener?.getAttribute('data-action');
 const returnSelector=action?`[data-action="${CSS.escape(action)}"]`:opener?.id?`#${CSS.escape(opener.id)}`:'';
 const returnScroll=window.scrollY;
 const lockedStyles:[[CSSStyleDeclaration,string],...Array<[CSSStyleDeclaration,string]>]=[[document.body.style,'position'],[document.body.style,'top'],[document.body.style,'left'],[document.body.style,'right'],[document.body.style,'overflow'],[document.documentElement.style,'overflow'],[document.documentElement.style,'overscroll-behavior']];
 const savedStyles=lockedStyles.map(([style,property])=>({style,property,value:style.getPropertyValue(property),priority:style.getPropertyPriority(property)}));
 document.body.style.position='fixed';document.body.style.top=`-${returnScroll}px`;
 document.body.style.left='0';document.body.style.right='0';document.body.style.overflow='hidden';
 document.documentElement.style.overflow='hidden';document.documentElement.style.overscrollBehavior='none';
 const d=document.createElement('dialog');d.className='number-change-dialog';d.setAttribute('aria-labelledby','number-change-title');
 const scale=options.decimal?100:1;
 let whole=0,fraction=0,pending=false,editor:WheelKey|null=null;
 let draft='',replaceAll=false,entryStart={whole:0,fraction:0};
 const format=(value:number)=>options.decimal?`${value<0?'−':''}${Math.floor(Math.abs(value)/100)},${String(Math.abs(value)%100).padStart(2,'0')}`:String(value);
 const labels:Record<WheelKey,string>={whole:options.decimal?(options.wholeLabel??'Heltall'):'Endring',fraction:options.fractionLabel??'Hundredeler'};
 d.innerHTML=`<form novalidate><div class="dialog-heading"><span class="number-title-icon" aria-hidden="true">${icon(options.icon??'emblem')}</span><h2 id="number-change-title" tabindex="-1">${esc(options.title??`Endre ${options.name}`)}</h2><button type="button" class="dialog-close" data-dismiss aria-label="Avbryt endring">${icon('close')}</button></div><div class="number-change-body">${wizardArt(options.icon??'emblem')}<div class="number-comparison" aria-live="polite"><span class="number-before"><small>Før</small><b></b><span data-detail></span></span><span class="number-result-arrow" aria-hidden="true">→</span><span class="number-after"><small>Etter</small><b></b><span data-detail></span></span></div><div class="number-control-area"><div class="change-wheels"></div><section class="number-entry-panel" aria-label="Skriv tallet" hidden><div class="number-entry-toolbar"><button type="button" class="number-entry-back" aria-label="Tilbake til hjul">${icon('arrow')}</button><div class="number-entry-tabs" ${options.decimal?'':'hidden'}><button type="button" data-edit-wheel="whole">${esc(labels.whole)}</button><button type="button" data-edit-wheel="fraction">${esc(labels.fraction)}</button></div></div><div class="number-entry-value" role="textbox" aria-readonly="true" aria-multiline="false" tabindex="0"></div><div class="number-keypad" role="group" aria-label="Talltaster">${['1','2','3','4','5','6','7','8','9','±','0','⌫'].map(key=>`<button type="button" data-key="${key}" aria-label="${key==='±'?'Bytt fortegn':key==='⌫'?'Slett siffer':key}">${key}</button>`).join('')}</div></section></div><p class="number-help">Sveip opp eller ned. Trykk på midttallet for å skrive.</p><p class="number-breakdown" aria-live="polite"></p><p class="number-change-error" role="alert"></p></div><div class="dialog-actions"><button type="button" data-dismiss>Avbryt</button><button type="submit">OK</button></div></form>`;
 document.body.append(d);
 const error=d.querySelector<HTMLElement>('.number-change-error')!,submit=d.querySelector<HTMLButtonElement>('[type=submit]')!;
 const wheelArea=d.querySelector<HTMLElement>('.change-wheels')!,panel=d.querySelector<HTMLElement>('.number-entry-panel')!,entry=panel.querySelector<HTMLElement>('.number-entry-value')!;
 const delta=()=>Number(BigInt(whole)*BigInt(scale)+BigInt(fraction));
 const measure=document.createElement('canvas').getContext('2d')!;
 const fitComparison=()=>{
  if(!d.isConnected)return;
  d.querySelectorAll<HTMLElement>('.number-comparison b,.number-entry-value').forEach(value=>{
   value.style.fontSize='';const style=getComputedStyle(value);
   measure.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
   const width=measure.measureText(value.textContent??'').width,available=value.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight);
   if(width>available&&available>0)value.style.fontSize=`${Math.max(16,parseFloat(style.fontSize)*available/width*.98)}px`;
  });
 };
 const comparisonObserver=new ResizeObserver(fitComparison);comparisonObserver.observe(d.querySelector('.number-comparison')!);
 d.addEventListener('close',()=>comparisonObserver.disconnect(),{once:true});void document.fonts.ready.then(fitComparison);
 const current=(which:WheelKey)=>which==='whole'?whole:fraction;
 const valid=()=>{
  const b=changeBounds(options.original,options);
  return (!editor||draft===''||parseWheelInteger(draft)!==null)&&delta()>=b.min&&delta()<=b.max&&Number.isSafeInteger(delta());
 };
 const update=()=>{
  const result=changeResult(options.original,delta());
  const comparison=options.comparison?.(delta())??{before:{value:format(options.original)},after:{value:format(result)}};
  for(const side of ['before','after'] as const){
   d.querySelector(`.number-${side} b`)!.textContent=comparison[side].value;
   d.querySelector(`.number-${side} [data-detail]`)!.textContent=comparison[side].detail??'';
  }
  d.querySelector('.number-breakdown')!.textContent=options.preview?.(delta(),result)??'';
  d.querySelector('.number-help')!.textContent=editor===null?'Sveip opp eller ned. Trykk på midttallet for å skrive.':'Bruk talltastene, ± og slett. Pilen viser hjulet igjen.';
  submit.disabled=pending||!valid();fitComparison();
 };
 type Wheel={draw:()=>void;stop:()=>void;value:HTMLButtonElement};
 const wheels=new Map<WheelKey,Wheel>();
 const drawAll=()=>wheels.forEach(w=>w.draw());
 const set=(which:WheelKey,next:number)=>{
  if(which==='fraction')fraction=Math.max(-99,Math.min(99,next));else whole=next;
  const candidate=BigInt(whole)*BigInt(scale)+BigInt(fraction);
  const bounded=BigInt(normaliseChange(options.original,candidate,options));
  if(bounded!==candidate){whole=Number(bounded/BigInt(scale));fraction=Number(bounded%BigInt(scale));}
  error.textContent='';update();
 };
 const flush=()=>{
  wheels.forEach(w=>w.stop());
  if(editor===null)return true;
  const parsed=draft===''?null:parseWheelInteger(draft);
  if(draft!==''&&parsed===null){
   error.textContent='Skriv et heltall, med eventuelt + eller − foran. Komma og desimalpunkt kan ikke brukes i ett hjul.';
   entry.setAttribute('aria-invalid','true');return false;
  }
  if(parsed!==null)set(editor,parsed);entry.removeAttribute('aria-invalid');
  editor=null;panel.hidden=true;wheelArea.hidden=false;drawAll();update();return true;
 };
 const edit=(which:WheelKey)=>{
  if(pending)return;
  if(editor!==null&&!flush())return;
  wheels.forEach(w=>w.stop());editor=which;
  entryStart={whole,fraction};draft='';replaceAll=false;
  entry.setAttribute('aria-label',labels[which]);entry.textContent='';entry.removeAttribute('aria-invalid');
  panel.querySelectorAll<HTMLButtonElement>('[data-edit-wheel]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.editWheel===which)));
  wheelArea.hidden=true;panel.hidden=false;entry.focus({preventScroll:true});update();
 };
 function wheel(which:WheelKey){
  const label=labels[which],shell=document.createElement('div');shell.className='change-wheel';
  shell.innerHTML=`${options.decimal?`<span class="change-wheel-label">${esc(label)}</span>`:''}<div class="change-wheel-window"><div class="change-wheel-track" role="spinbutton" tabindex="0" aria-label="Tallhjul: ${esc(label)}"></div><span class="wheel-band" aria-hidden="true"></span></div>`;
  wheelArea.append(shell);
  const track=shell.querySelector<HTMLElement>('.change-wheel-track')!,value=document.createElement('button');
  value.type='button';value.className='wheel-value';value.dataset.wheelValue='';value.setAttribute('aria-label',`Skriv inn ${label}`);
  value.onclick=e=>{e.stopPropagation();edit(which);};
  let rowHeight=46,first=0,timer:ReturnType<typeof setTimeout>|undefined,gesturing=false,touching=false;
  const bounds=()=>{
   if(which==='fraction')return {min:-99,max:99};
   const b=changeBounds(options.original,options);
   return {min:Math.ceil((b.min-(options.decimal?99:0))/scale),max:Math.floor((b.max+(options.decimal?99:0))/scale)};
  };
  const stop=()=>{gesturing=false;clearTimeout(timer);track.scrollTo({top:track.scrollTop,behavior:'instant'});};
  const selectRow=()=>{
   const n=current(which);
   for(const item of track.children){const row=item as HTMLElement;
    if(row.contains(value)){row.textContent=signed(Number(row.dataset.value));row.setAttribute('aria-hidden','true');}
   }
   const selected=[...track.children].find(row=>Number((row as HTMLElement).dataset.value)===n);
   selected?.removeAttribute('aria-hidden');selected?.replaceChildren(value);
   value.textContent=signed(n);value.style.fontSize=`${Math.max(1,Math.min(2.1,13/Math.max(1,signed(n).length)))}rem`;
   track.setAttribute('aria-valuenow',String(n));track.setAttribute('aria-valuetext',signed(n));
  };
  const draw=()=>{
   if(!track.getClientRects().length)return;
   const n=current(which),b=bounds();first=Math.max(n,Math.min(b.max,n+RADIUS));
   const last=Math.min(n,Math.max(b.min,n-RADIUS));track.replaceChildren();
   for(let v=first;v>=last;v--){
    const row=document.createElement('div');row.className='change-wheel-row';row.dataset.value=String(v);row.textContent=signed(v);row.setAttribute('aria-hidden','true');
    row.onclick=()=>{if(v===current(which)){edit(which);return;}stop();set(which,v);drawAll();};track.append(row);
   }
   rowHeight=(track.firstElementChild as HTMLElement).getBoundingClientRect().height;
   track.scrollTop=(first-n)*rowHeight;selectRow();
   if(which==='fraction'||options.min!==undefined||!options.allowNegative)track.setAttribute('aria-valuemin',String(b.min));
   if(which==='fraction'||options.max!==undefined)track.setAttribute('aria-valuemax',String(b.max));
  };
  for(const event of ['wheel','touchstart','pointerdown'])track.addEventListener(event,()=>{if(!pending&&editor===null)gesturing=true;},{passive:true});
  const settle=()=>{if(!gesturing||editor!==null||pending||touching)return;gesturing=false;drawAll();};
  track.addEventListener('scroll',()=>{
   if(!gesturing||editor!==null||pending)return;
   const row=track.children[Math.round(track.scrollTop/rowHeight)] as HTMLElement|undefined;
   if(row){set(which,Number(row.dataset.value));selectRow();}
   clearTimeout(timer);timer=setTimeout(settle,160);
  },{passive:true});
  track.addEventListener('touchstart',()=>{touching=true;},{passive:true});
  for(const event of ['touchend','touchcancel'])track.addEventListener(event,()=>{touching=false;clearTimeout(timer);timer=setTimeout(settle,160);},{passive:true});
  track.addEventListener('scrollend',settle);
  track.onkeydown=e=>{
   if(pending){e.preventDefault();return;}
   const moves:Record<string,number>={ArrowUp:1,ArrowDown:-1,ArrowLeft:-1,ArrowRight:1,PageUp:10,PageDown:-10};
   if(e.key in moves||e.key==='Home'||e.key==='End'){
    e.preventDefault();stop();const b=bounds();
    set(which,e.key==='Home'?b.min:e.key==='End'&&(which==='fraction'||options.max!==undefined)?b.max:e.key==='End'?current(which)+10:current(which)+moves[e.key]);drawAll();
   }else if(e.key==='Enter'||e.key===' '){e.preventDefault();edit(which);}
  };
  const observer=new ResizeObserver(()=>{if(!gesturing&&editor===null)draw();});observer.observe(track);observer.observe(shell);
  d.addEventListener('close',()=>observer.disconnect(),{once:true});
  wheels.set(which,{draw,stop,value});
 }
 wheel('whole');if(options.decimal)wheel('fraction');

 /** A plain, non-selectable display avoids native selection handles and the OS keyboard. */
 const syncDraft=()=>{
  entry.textContent=draft;
  if(draft===''){
   ({whole,fraction}=entryStart);error.textContent='';entry.removeAttribute('aria-invalid');update();
  }else{
   const parsed=parseWheelInteger(draft);
   if(parsed!==null){entry.removeAttribute('aria-invalid');set(editor!,parsed);}else update();
  }
  entry.focus({preventScroll:true});
 };
 const type=(text:string,backspace=false)=>{
  if(pending||editor===null)return;
  const next=replaceAll?text:backspace?draft.slice(0,-1):draft+text;
  if(next.length>64)return;
  draft=next;replaceAll=false;syncDraft();
 };
 const toggleSign=()=>{
  if(pending||editor===null)return;
  draft=draft.startsWith('-')?draft.slice(1):'-'+draft.replace(/^\+/,'');replaceAll=false;syncDraft();
 };
 panel.querySelectorAll<HTMLButtonElement>('[data-key]').forEach(button=>{
  button.onpointerdown=e=>e.preventDefault();
  button.onclick=()=>button.dataset.key==='±'?toggleSign():type(button.dataset.key==='⌫'?'':button.dataset.key!,button.dataset.key==='⌫');
 });
 const back=panel.querySelector<HTMLButtonElement>('.number-entry-back')!;
 back.onpointerdown=e=>e.preventDefault();back.onclick=()=>{const active=editor;if(flush()&&active)wheels.get(active)!.value.focus({preventScroll:true});};
 panel.querySelectorAll<HTMLButtonElement>('[data-edit-wheel]').forEach(button=>{button.onpointerdown=e=>e.preventDefault();button.onclick=()=>edit(button.dataset.editWheel as WheelKey);});
 entry.onkeydown=e=>{
  if(pending){e.preventDefault();return;}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='a'){e.preventDefault();replaceAll=true;}
  else if(e.key==='Enter'){e.preventDefault();back.click();}
  else if(e.key==='Backspace'||e.key==='Delete'){e.preventDefault();type('',true);}
  else if(e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();type(e.key);}
 };
 entry.onpaste=e=>{e.preventDefault();type(e.clipboardData?.getData('text/plain')??'');};

 let unlocked=false;
 const unlock=()=>{
  if(unlocked)return;unlocked=true;
  savedStyles.forEach(({style,property,value,priority})=>{if(value)style.setProperty(property,value,priority);else style.removeProperty(property);});
  window.scrollTo(0,returnScroll);
 };
 const dismiss=()=>{
  if(pending)return;wheels.forEach(w=>w.stop());d.close();d.remove();unlock();
  const target=opener?.isConnected?opener:returnSelector?document.querySelector<HTMLElement>(returnSelector):null;
  (target??document.querySelector<HTMLElement>('dialog[open] h2'))?.focus({preventScroll:true});window.scrollTo(0,returnScroll);
 };
 d.oncancel=e=>{e.preventDefault();dismiss();};d.addEventListener('close',unlock,{once:true});
 d.querySelectorAll<HTMLButtonElement>('[data-dismiss]').forEach(button=>{button.onpointerdown=e=>e.preventDefault();button.onclick=dismiss;});
 submit.onpointerdown=e=>e.preventDefault();
 d.querySelector('form')!.onsubmit=async e=>{
  e.preventDefault();if(pending||!flush()||!valid())return;
  pending=true;update();d.setAttribute('aria-busy','true');d.querySelectorAll<HTMLButtonElement>('button').forEach(b=>b.disabled=true);
  try{await options.onConfirm(changeResult(options.original,delta()),delta());pending=false;dismiss();}
  catch(failure){error.textContent=failure instanceof Error?failure.message:'Kunne ikke lagre. Endringen er bevart.';}
  finally{pending=false;d.removeAttribute('aria-busy');d.querySelectorAll<HTMLButtonElement>('button').forEach(b=>b.disabled=false);update();}
 };
 d.addEventListener('click',event=>{
  if((event.target as HTMLElement).closest('.number-entry-panel,[data-dismiss],[type=submit]'))return;
  if(!flush())event.stopImmediatePropagation();
 },true);
 // Stop iOS rubber-banding at scroll boundaries; allow internal overflow and accessible pinch zoom.
 let touchX=0,touchY=0;
 d.addEventListener('touchstart',event=>{if(event.touches.length===1){touchX=event.touches[0].clientX;touchY=event.touches[0].clientY;}},{passive:true});
 d.addEventListener('touchmove',event=>{
  if(event.touches.length!==1)return;
  const point=event.touches[0],dy=point.clientY-touchY,dx=point.clientX-touchX;touchX=point.clientX;touchY=point.clientY;
  let canScroll=false,node=event.target instanceof HTMLElement?event.target:null;
  if(Math.abs(dy)>=Math.abs(dx))while(node&&node!==d){
   if(['auto','scroll'].includes(getComputedStyle(node).overflowY)&&node.scrollHeight>node.clientHeight+1&&
     (dy>0&&node.scrollTop>0||dy<0&&node.scrollTop+node.clientHeight<node.scrollHeight-1)){canScroll=true;break;}
   node=node.parentElement;
  }
  if(!canScroll&&event.cancelable)event.preventDefault();
 },{passive:false});
 d.showModal();drawAll();update();d.querySelector<HTMLElement>('h2')!.focus({preventScroll:true});
 return d;
}
