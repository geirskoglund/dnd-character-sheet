import {z} from 'zod';
import {characterSchema} from '../domain/model';
import {consumableCatalog,consumableCategories,newConsumable,setConsumableQuantity,type Consumable} from '../domain/consumables';
import type {EditorContext} from './record-editors';
import {viewDialog,editDialog} from './dialog';
import {wizardDialog,draftOptions} from './wizard';
import {field,numberField,textArea,select,str,num} from './record-fields';
import {icon,iconField,readIcon} from './icons';
import {escapeHtml as esc} from './html';
import {numberChangeDialog} from './number-change-dialog';

export function consumableWizard(ctx:EditorContext,done?:()=>void){
 const source=ctx.resumedDraft?characterSchema.shape.consumables.unwrap().element.extend({name:z.string().max(100)}).parse(ctx.resumedDraft.payload):newConsumable();
 const c=ctx.current();
 wizardDialog('Egen forbruksvare',[
  {id:'name',title:'Hva heter varen?',art:'equipment',html:field('Navn','name',source.name,'required maxlength="100"')},
  {id:'quantity',title:'Hvor mange har du?',art:'resource',html:numberField('Antall','quantity',source.quantity,'required min="0" max="9007199254740991"')},
  {id:'category',title:'Hvilken kategori passer?',art:'equipment',html:select('Kategori','category',source.category,Object.entries(consumableCategories).map(([value,c])=>({value,label:c.label})))},
  {id:'description',title:'Vil du beskrive varen?',art:'note',html:textArea('Beskrivelse (valgfritt)','description',source.description)},
  {id:'icon',title:'Vil du endre ikonet?',art:'equipment',html:iconField(source.iconKey)},
 ],async(form,completion)=>{
  const data=new FormData(form),row:Consumable={...source,name:str(data,'name'),quantity:num(data,'quantity'),category:str(data,'category') as Consumable['category'],description:str(data,'description'),iconKey:readIcon(data)};
  await ctx.save({...c,consumables:[...c.consumables,row]},'consumable',`${row.name} lagt til`,completion);done?.();
 },'Fullfør',draftOptions(ctx,'consumable','Egen forbruksvare',source));
}

/** Both entry points use the same character collection; this dialog survives nested editors. */
export function consumablesDialog(ctx:EditorContext){
 const opener=document.activeElement as HTMLElement|null;
 const d=document.createElement('dialog');d.className='consumables-dialog';d.dataset.size='large';d.setAttribute('aria-labelledby','consumables-title');
 d.innerHTML=`<div class="dialog-heading"><h2 id="consumables-title" tabindex="-1">Forbruk</h2><button type="button" data-close aria-label="Lukk Forbruk">${icon('close')}</button></div><div class="consumables-body"></div><p role="alert" class="consumables-error"></p><div class="dialog-actions"><button type="button" data-add-consumable aria-label="Legg til forbruksvare">Legg til</button><button type="button" data-undo>Angre</button></div>`;
 document.body.append(d);
 const scroll=window.scrollY,oldOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';
 const body=d.querySelector<HTMLElement>('.consumables-body')!,alert=d.querySelector<HTMLElement>('[role=alert]')!;
 let pending=false,clearGesture=()=>{};
 const close=()=>{if(pending)return;clearGesture();d.close();d.remove();document.documentElement.style.overflow=oldOverflow;opener?.focus({preventScroll:true});window.scrollTo(0,scroll);};
 d.oncancel=e=>{e.preventDefault();close();};d.querySelector<HTMLButtonElement>('[data-close]')!.onclick=close;
 d.querySelector<HTMLButtonElement>('[data-undo]')!.onclick=async()=>{
  if(pending)return;pending=true;body.inert=true;alert.textContent='';
  try{await ctx.undo?.();draw();}catch(error){alert.textContent=(error as Error).message;}finally{pending=false;body.inert=false;}
 };
 const save=async(c:ReturnType<EditorContext['current']>,row:Consumable,total:number)=>{
  if(total===row.quantity)return;
  await ctx.save(setConsumableQuantity(c,row.id,total),'consumable',`${row.name}: ${row.quantity} → ${total}`);draw();
 };
 const adjust=(row:Consumable,mode:'add'|'subtract'|'total')=>{
  const c=ctx.current();
  numberChangeDialog({name:row.name,title:`${mode==='total'?'Ny total':mode==='add'?'Legg til':'Trekk fra'} · ${row.name}`,original:row.quantity,mode:mode==='total'?'total':'relative',min:mode==='add'?row.quantity:0,max:mode==='subtract'?row.quantity:undefined,icon:row.iconKey??consumableCategories[row.category].icon,onConfirm:total=>save(c,row,total)});
 };
 function draw(){
  const position=body.scrollTop,focused=(document.activeElement as HTMLElement)?.dataset.control;clearGesture();
  body.innerHTML=Object.entries(consumableCategories).map(([category,meta])=>{
   const rows=ctx.current().consumables.filter(row=>row.category===category);
   return rows.length?`<section><h3>${icon(meta.icon)} ${meta.label}</h3>${rows.map(row=>`<div class="consumable-row" data-consumable="${row.id}"><button type="button" class="consumable-name" data-info="${row.id}">${icon(row.iconKey??meta.icon)}<span>${esc(row.name)}<small>${esc(row.unit)}</small></span></button><div class="consumable-counter"><button type="button" data-control="minus-${row.id}" data-direction="subtract" aria-label="Bruk én ${esc(row.name)}" ${row.quantity===0?'disabled':''}>−</button><button type="button" data-control="total-${row.id}" data-total aria-label="Ny total for ${esc(row.name)}: ${row.quantity}">${row.quantity}</button><button type="button" data-control="plus-${row.id}" data-direction="add" aria-label="Legg til én ${esc(row.name)}" ${row.quantity===Number.MAX_SAFE_INTEGER?'disabled':''}>+</button></div></div>`).join('')}</section>`:'';
  }).join('')||'<p>Ingen forbruksvarer ennå. Velg fra biblioteket eller opprett en egen vare.</p>';
  body.scrollTop=position;if(focused)body.querySelector<HTMLElement>(`[data-control="${focused}"]`)?.focus({preventScroll:true});
  const cleanups:(()=>void)[]=[];
  for(const element of body.querySelectorAll<HTMLElement>('[data-consumable]')){
   const row=ctx.current().consumables.find(r=>r.id===element.dataset.consumable)!;
   element.querySelector<HTMLButtonElement>('[data-total]')!.onclick=e=>{(e.currentTarget as HTMLElement).focus({preventScroll:true});adjust(row,'total');};
   element.querySelector<HTMLButtonElement>('[data-info]')!.onclick=()=>viewDialog(row.name,`<p>${row.quantity} ${esc(row.unit)}</p><p class="rule-text">${esc(row.description||'Ingen beskrivelse.')}</p>${row.catalogId?'<p class="muted">SRD 5.1 · CC BY 4.0 · 2014</p>':''}`,undefined,'large');
   element.querySelectorAll<HTMLButtonElement>('[data-direction]').forEach(button=>{
    let timer:ReturnType<typeof setTimeout>|undefined,start:{x:number;y:number}|undefined,suppress=false;
    const cancel=()=>{clearTimeout(timer);timer=undefined;start=undefined;};cleanups.push(cancel);
    button.onpointerdown=e=>{if(e.button!==0||pending)return;cancel();suppress=false;start={x:e.clientX,y:e.clientY};timer=setTimeout(()=>{cancel();suppress=true;button.focus({preventScroll:true});adjust(row,button.dataset.direction as 'add'|'subtract');},500);};
    const move=(e:PointerEvent)=>{if(start&&Math.hypot(e.clientX-start.x,e.clientY-start.y)>8){suppress=true;cancel();}};
    const scroll=()=>{if(start){suppress=true;cancel();}};
    body.addEventListener('scroll',scroll,{passive:true});window.addEventListener('pointermove',move,{passive:true});
    const up=()=>cancel(),abort=()=>{suppress=true;cancel();};window.addEventListener('pointerup',up);window.addEventListener('pointercancel',abort);window.addEventListener('blur',abort);
    cleanups.push(()=>{body.removeEventListener('scroll',scroll);window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',abort);window.removeEventListener('blur',abort);});
    button.oncontextmenu=e=>e.preventDefault();
    button.onclick=async()=>{
     cancel();if(suppress){suppress=false;return;}if(pending)return;
     pending=true;body.inert=true;alert.textContent='';const c=ctx.current(),total=row.quantity+(button.dataset.direction==='add'?1:-1);
     try{await save(c,row,total);}catch(error){alert.textContent=(error as Error).message;const retry=numberChangeDialog({name:row.name,title:`Ny total · ${row.name}`,mode:'total',original:row.quantity,min:0,onConfirm:value=>save(c,row,value),initialValue:total});retry.querySelector('.number-change-error')!.textContent=(error as Error).message;}finally{pending=false;body.inert=false;}
    };
   });
  }
  clearGesture=()=>cleanups.forEach(fn=>fn());
 }
 d.querySelector<HTMLButtonElement>('[data-add-consumable]')!.onclick=()=>{
  const picker=viewDialog('Legg til forbruksvare',`<label>Søk<input type="search" name="consumableSearch" placeholder="Søk i biblioteket"></label><div class="consumable-catalog"></div><button type="button" data-custom>Egen forbruksvare</button>`,undefined,'large');
  const list=picker.querySelector<HTMLElement>('.consumable-catalog')!,search=picker.querySelector<HTMLInputElement>('input')!;
  const filter=()=>{list.innerHTML=Object.entries(consumableCategories).map(([key,meta])=>`<section><h3>${meta.label}</h3>${consumableCatalog.filter(r=>r.category===key&&r.name.toLowerCase().includes(search.value.toLowerCase())).map(r=>`<button type="button" data-catalog="${r.catalogId}">${icon(r.iconKey)} ${esc(r.name)}</button>`).join('')}</section>`).join('');
   list.querySelectorAll<HTMLButtonElement>('[data-catalog]').forEach(b=>b.onclick=()=>{
    const source=newConsumable(b.dataset.catalog),c=ctx.current();
    editDialog(source.name,`<p class="rule-text">${esc(source.description)}</p>`+numberField(`Antall (${source.unit})`,'quantity',source.catalogId?.endsWith('healers-kit')?10:0,'required min="0" max="9007199254740991"'),async form=>{
     const row={...source,quantity:num(new FormData(form),'quantity')};await ctx.save({...c,consumables:[...c.consumables,row]},'consumable',`${row.name} lagt til`);draw();
    },'Legg til');
   });
  };search.oninput=filter;filter();picker.querySelector<HTMLButtonElement>('[data-custom]')!.onclick=()=>consumableWizard(ctx,draw);
 };
 draw();d.showModal();d.querySelector<HTMLElement>('h2')!.focus({preventScroll:true});return d;
}
