/** A finite, scroll-snapped numeric wheel. The input remains the authoritative value and keyboard fallback. */
export function enhanceNumbers(root:ParentNode,openName?:string){
 root.querySelectorAll<HTMLInputElement>('input[type="number"]:not([data-wheel-bound])').forEach(input=>{
  input.dataset.wheelBound='true';
  const label=input.closest('label')?.childNodes[0]?.textContent?.trim()||input.name;
  if(!input.hasAttribute('aria-label'))input.setAttribute('aria-label',label);
  const wrapper=document.createElement('div');wrapper.className='number-control';input.before(wrapper);wrapper.append(input);
  const toggle=document.createElement('button');toggle.type='button';toggle.className='wheel-toggle';toggle.textContent='↕';toggle.setAttribute('aria-label',`Tallhjul for ${label}`);toggle.setAttribute('aria-expanded','false');wrapper.append(toggle);
  const panel=document.createElement('div');panel.className='number-wheel';panel.hidden=true;panel.tabIndex=0;panel.setAttribute('role','spinbutton');panel.setAttribute('aria-label',`Tallhjul: ${label}`);wrapper.after(panel);
  let low=0,step=1,fromWheel=false,timer:ReturnType<typeof setTimeout>|undefined;
  const limits=()=>({min:input.min!==''?Number(input.min):-1_000_000_000,max:input.max!==''?Number(input.max):1_000_000_000,step:input.step&&input.step!=='any'?Number(input.step):1});
  const clamp=(n:number)=>{const l=limits();return Math.max(l.min,Math.min(l.max,n));};
  const round=(n:number)=>Number(n.toFixed(6));
  const value=()=>Number.isFinite(input.valueAsNumber)?clamp(input.valueAsNumber):clamp(0);
  const text=(n:number)=>input.dataset.signed!==undefined&&n>0?`+${n}`:String(n);
  const updateAria=()=>{const l=limits();panel.setAttribute('aria-valuenow',String(value()));panel.setAttribute('aria-valuetext',text(value()));if(input.min!=='')panel.setAttribute('aria-valuemin',input.min);if(input.max!=='')panel.setAttribute('aria-valuemax',input.max);};
  const draw=()=>{
   const l=limits(),current=value();step=l.step;low=round(Math.max(l.min,current-40*step));
   const high=round(Math.min(l.max,current+40*step)),length=Math.round((high-low)/step)+1;
   panel.replaceChildren();
   for(let i=0;i<length;i++){
    const n=round(low+i*step),row=document.createElement('div');row.className='wheel-row';row.textContent=text(n);row.dataset.value=String(n);row.setAttribute('aria-hidden','true');
    row.onclick=()=>{if(n===value()){input.focus();input.select();}else{set(n);draw();}};panel.append(row);
   }
   panel.scrollTop=Math.round((current-low)/step)*40;updateAria();
  };
  const set=(n:number)=>{const next=round(clamp(n));if(input.value!==String(next)){input.value=String(next);fromWheel=true;try{input.dispatchEvent(new Event('input',{bubbles:true}));}finally{fromWheel=false;}}updateAria();};
  panel.addEventListener('scroll',()=>{
   if(panel.hidden||!panel.isConnected)return;
   const index=Math.round(panel.scrollTop/40),row=panel.children[index] as HTMLElement|undefined;
   if(row)set(Number(row.dataset.value));
   clearTimeout(timer);timer=setTimeout(()=>{if(panel.isConnected&&!panel.hidden)draw();},180);
  },{passive:true});
  input.addEventListener('input',()=>{if(panel.hidden)return;if(!fromWheel)draw();else updateAria();});
  input.addEventListener('change',()=>{if(!panel.hidden)draw();});
  panel.onkeydown=e=>{
   const moves:Record<string,number>={ArrowUp:step,ArrowDown:-step,ArrowLeft:-step,ArrowRight:step,PageUp:10*step,PageDown:-10*step};
   if(e.key in moves||e.key==='Home'||e.key==='End'){
    e.preventDefault();const l=limits();set(e.key==='Home'?l.min:e.key==='End'?l.max:value()+moves[e.key]);draw();
   }else if(e.key==='Enter'){e.preventDefault();input.focus();input.select();}
  };
  toggle.onclick=()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden){draw();panel.focus({preventScroll:true});}};
  if(input.name===openName){panel.hidden=false;toggle.setAttribute('aria-expanded','true');draw();}
 });
}
