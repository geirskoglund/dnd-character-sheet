import {featureLibrary,spellLibrary,instantiateFeature,instantiateSpell} from '../domain/character-library';
import {classCatalog} from '../domain/catalog';
import type {Character} from '../domain/model';
import {viewDialog,commitDialog} from './dialog';
import {escapeHtml as esc,select} from './html';
import type {EditorContext} from './record-editors';
export function libraryPicker(ctx: EditorContext, kind: 'feature'|'spell'|'cantrip', custom: () => void) {
  const spell = kind !== 'feature', title=spell ? kind==='cantrip' ? 'Legg til cantrip' : 'Legg til spell' : 'Legg til egenskap eller feat';
  const c=ctx.current();
  const d=viewDialog(title,`<label>Søk i SRD 5.1<input type="search" name="librarySearch" autocomplete="off"></label>${select('Klassefilter','libraryClass','',[{value:'',label:'Alle klasser'},...classCatalog.map(cl=>({value:cl.name,label:cl.name}))])}${spell ? select('Spell level','libraryLevel',kind==='cantrip'?'0':'',[{value:'',label:'Alle nivåer'},...Array.from({length:10},(_,i)=>({value:String(i),label:i?`Level ${i}`:'Cantrip'}))]) : select('Type','libraryKind','',[{value:'',label:'Egenskaper og feats'}, {value:'class',label:'Klasseegenskaper'}, {value:'feat',label:'Feats'}])}<button type="button" id="library-custom">Opprett egen ${spell?'spell':'egenskap / feat'}</button><p class="muted" id="library-count" role="status"></p><div id="library-results" class="choice-list"></div>`, '[name="librarySearch"]');
  const draw=()=>{
    const query=d.querySelector<HTMLInputElement>('[name="librarySearch"]')!.value.toLowerCase().trim();
    const cl=d.querySelector<HTMLSelectElement>('[name="libraryClass"]')!.value;
    const level=d.querySelector<HTMLSelectElement>('[name="libraryLevel"]')?.value;
    const category=d.querySelector<HTMLSelectElement>('[name="libraryKind"]')?.value;
    const matches=(spell ? spellLibrary : featureLibrary).filter(row=>row.name.toLowerCase().includes(query) && (!cl || row.classes.includes(cl)) && (!spell || level==='' || row.level===Number(level)) && (!category || ('kind' in row && row.kind===category))).sort((a,b)=>a.name.localeCompare(b.name));
    d.querySelector('#library-count')!.textContent=matches.length?`${matches.length} treff · SRD 5.1`:'Ingen treff. Opprett egen eller endre filtrene.';
    d.querySelector('#library-results')!.innerHTML=matches.map(row=>`<button type="button" data-library-id="${row.id}" aria-label="Legg til ${esc(row.name)}"><strong>${esc(row.name)}</strong><small>${spell ? row.level ? `Lvl ${row.level}` : '∞' : 'kind' in row && row.kind==='feat'?'Feat':`${esc(row.classes.join(', '))} ${row.level}`}</small></button>`).join('');
    d.querySelectorAll<HTMLButtonElement>('[data-library-id]').forEach(button=>button.onclick=()=>void commitDialog(async()=>{
      const id=button.dataset.libraryId!;
      const draft: Character=spell ? {...c,spells:[...c.spells,instantiateSpell(id)]} : {...c,features:[...c.features,instantiateFeature(id)]};
      await ctx.save(draft,spell?'spell':'feature',spell?'Spell lagt til fra SRD':'Egenskap lagt til fra SRD');
    }));
  };
  d.querySelector<HTMLInputElement>('[name="librarySearch"]')!.oninput=draw;
  d.querySelectorAll<HTMLSelectElement>('select').forEach(select=>select.onchange=draw);
  d.querySelector<HTMLButtonElement>('#library-custom')!.onclick=custom;draw();
}
