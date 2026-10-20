import type {EditorContext} from './record-editors';
import {preparationLimit,preparedSpellCandidates,prepareSpells} from '../domain/magic';
import {viewDialog,editDialog} from './dialog';
import {escapeHtml as esc} from './html';
export function preparationDialog(ctx:EditorContext){
 const c=ctx.current(),classes=c.classes.filter(cl=>preparationLimit(c,cl)!==null);
 if(!classes.length)return;
 if(classes.length===1){open(classes[0]);return;}
 const d=viewDialog('Hvilken klasse forbereder du?',`<div class="choice-list">${classes.map(cl=>`<button type="button" data-prepare-class="${cl.id}">${esc(cl.name)}</button>`).join('')}</div>`);
 d.querySelectorAll<HTMLButtonElement>('[data-prepare-class]').forEach(b=>b.onclick=()=>open(classes.find(cl=>cl.id===b.dataset.prepareClass)!));
 function open(cl:typeof classes[number]){
  const rows=preparedSpellCandidates(c,cl),limit=preparationLimit(c,cl)!;
  const d=editDialog(`Forbered spells · ${cl.name}`,`<label>Søk<input type="search" name="prepareSearch" autocomplete="off"></label><p id="prepare-count" aria-live="polite"></p><div class="prepare-list">${rows.map(row=>`<label data-prepare-name="${esc(row.name.toLowerCase())}"><input type="checkbox" name="prepared" value="${row.id}" ${(row.prepared||row.alwaysPrepared)?'checked':''} ${row.alwaysPrepared?'disabled':''}><span>${esc(row.name)}<small> · Nivå ${row.spellLevel}${row.alwaysPrepared?' · Alltid forberedt':''}</small></span></label>`).join('')}</div>${rows.length?'':'<p>Legg spells i spellbook først. Egne spells kan knyttes til klassen fra Tilpass.</p>'}`,async form=>{
   const selected=new Set(new FormData(form).getAll('prepared').map(String));
   await ctx.save(prepareSpells(c,cl,rows,selected),'prepared','Forberedte spells endret');
  },'Ferdig');
  const count=()=>{
   const n=d.querySelectorAll('input[name="prepared"]:checked:not(:disabled)').length;
   const label=d.querySelector('#prepare-count')!;label.textContent=`${n} av ${limit} valgt${n>limit?' · Over vanlig grense. Fullfør bare etter avtale med DM.':''}`;label.classList.toggle('warning',n>limit);
  };
  d.querySelectorAll('input[name="prepared"]').forEach(input=>input.addEventListener('change',count));
  d.querySelector<HTMLInputElement>('[name="prepareSearch"]')!.oninput=e=>{
   const query=(e.target as HTMLInputElement).value.toLowerCase();d.querySelectorAll<HTMLElement>('[data-prepare-name]').forEach(row=>row.hidden=!row.dataset.prepareName!.includes(query));
  };count();
 }
}
