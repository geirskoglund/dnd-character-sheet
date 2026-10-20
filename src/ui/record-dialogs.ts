import type {Character} from '../domain/model';
import type {EditorContext} from './record-editors';
import {viewDialog,confirmDialog} from './dialog';
import {removeRecord} from '../domain/records';
import {guidedRecord} from './guided-records';
import {escapeHtml as esc} from './html';
export function inspectRecord(ctx:EditorContext,kind:'spell'|'feature',id:string,advanced:(draft:Character['features'][number]|Character['spells'][number],completion?:import('../domain/wizard-draft').DraftToken)=>void){
 const c=ctx.current(),row=kind==='spell'?c.spells.find(s=>s.id===id):c.features.find(f=>f.id===id);if(!row)return;
 const meta='spellLevel'in row?`<p>${row.spellLevel?'Nivå '+row.spellLevel:'Cantrip ∞'} · ${esc(row.castingTime)} · ${esc(row.range)}</p><p>${esc(row.duration)}${row.concentration?' · Concentration':''}${row.ritual?' · Ritual':''}</p><p>${esc(row.components.join(', '))}</p><p>${esc([row.attack,row.save,row.damage].filter(Boolean).join(' · '))}</p>`:'';
 const d=viewDialog(row.name,`${meta}<p class="rule-text">${esc(row.description)}</p><div class="actions"><button type="button" id="customize-record">Tilpass</button><button type="button" id="remove-inspected" class="danger">Fjern</button></div>`,undefined,row.description.length>1500?'large':'compact');
 d.querySelector<HTMLButtonElement>('#customize-record')!.onclick=()=>guidedRecord(ctx,kind,row,'category'in row&&row.category==='class'?'class':'feat',true,advanced);
 d.querySelector<HTMLButtonElement>('#remove-inspected')!.onclick=()=>confirmDialog('Fjern '+row.name+'?',`<p>Endringen kan angres fra Meny.</p>`,()=>ctx.save(removeRecord(c,kind==='spell'?'spells':'features',row.id),kind,row.name+' fjernet'),'Fjern');
}
