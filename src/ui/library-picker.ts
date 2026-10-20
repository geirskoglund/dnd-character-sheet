import {icon} from './icons';
import {spellIcon,featureIcon} from '../domain/iconography';
import {featureLibrary,spellLibrary,instantiateFeature,instantiateSpell} from '../domain/character-library';
import {classCatalog} from '../domain/catalog';
import {featureEligibility,relevantSpellSources,sourceAllows,spellSources,assignSpell,type SpellSource} from '../domain/magic';
import {withStandardResources} from '../domain/resource-setup';
import type {Character} from '../domain/model';
import {viewDialog,commitDialog} from './dialog';
import {escapeHtml as esc,select} from './html';
import type {EditorContext} from './record-editors';
export type LibraryKind='feature'|'spell'|'cantrip';
export function libraryPicker(ctx:EditorContext,kind:LibraryKind,custom:(base?:Character['spells'][number]|Character['features'][number],category?:'class'|'feat')=>void){
 const c=ctx.current(),spell=kind!=='feature',own=new Set(c.classes.map(cl=>cl.name));let category:'class'|'feat'='class';
 const ordered=[...classCatalog].sort((a,b)=>Number(own.has(b.name))-Number(own.has(a.name))||a.name.localeCompare(b.name));
 const d=viewDialog(spell?kind==='cantrip'?'Legg til cantrip':'Legg til spell':'Legg til egenskap eller feat',`<label>Søk i SRD 5.1<input type="search" name="librarySearch" autocomplete="off"></label>${!spell?'<div class="filter-type"><button type="button" data-library-kind="class" aria-pressed="true">Egenskaper</button><button type="button" data-library-kind="feat" aria-pressed="false">Feats</button></div>':''}${select('Klassefilter','libraryClass','mine',[{value:'mine',label:'Mine klasser'},{value:'all',label:'Alle klasser'},...ordered.map(cl=>({value:cl.name,label:cl.name}))])}${spell&&kind==='spell'?select('Spellnivå','libraryLevel','',[{value:'',label:'Alle tilgjengelige nivåer'},...Array.from({length:9},(_,i)=>({value:String(i+1),label:`Nivå ${i+1}`}))]):''}<label class="check"><input type="checkbox" name="libraryOverride">Vis også høyere nivåer og andre forutsetninger</label><button type="button" id="library-custom">Opprett egen ${spell?kind==='cantrip'?'cantrip':'spell':'egenskap / feat'}</button><p class="muted" id="library-count" role="status"></p><div id="library-results" class="choice-list"></div>`,'[name="librarySearch"]','large');
 function draw(){
  const query=d.querySelector<HTMLInputElement>('[name="librarySearch"]')!.value.toLowerCase().trim(),scope=d.querySelector<HTMLSelectElement>('[name="libraryClass"]')!.value,override=d.querySelector<HTMLInputElement>('[name="libraryOverride"]')!.checked;
  const selectedLevel=d.querySelector<HTMLSelectElement>('[name="libraryLevel"]')?.value;
  const matches=(spell?spellLibrary:featureLibrary).filter(row=>{
   if(!row.name.toLowerCase().includes(query))return false;
   if(spell){
    const s=row as typeof spellLibrary[number];if(kind==='cantrip'?s.level!==0:s.level===0)return false;
    if(selectedLevel&&s.level!==Number(selectedLevel))return false;
    if(scope==='all')return true;
    if(scope==='mine')return override?spellSources(c).some(source=>sourceAllows({...source,maxLevel:9},s)):relevantSpellSources(c,s).length>0;
    return (s.classes.includes(scope)||spellSources(c).some(source=>source.label===scope&&source.spellIds.includes(s.id)))&&(override||!own.has(scope)||spellSources(c).some(source=>source.label===scope&&sourceAllows(source,s)));
   }
   const f=row as typeof featureLibrary[number];if(f.kind!==category)return false;
   if(scope!=='mine'&&scope!=='all'&&f.classes.length&&!f.classes.includes(scope))return false;
   if(scope==='mine'&&f.classes.length&&!f.classes.some(name=>own.has(name)))return false;
   if(scope==='all'||override||scope!=='mine'&&!own.has(scope))return true;
   return featureEligibility(c,f).eligible;
  }).sort((a,b)=>a.name.localeCompare(b.name));
  d.querySelector('#library-count')!.textContent=matches.length?`${matches.length} treff · SRD 5.1`:'Ingen treff. Velg Alle klasser, overstyr filtrene eller opprett egen.';
  const results=d.querySelector('#library-results')!;
  results.innerHTML=matches.map(row=>{
   const existing=spell?c.spells.some(s=>s.definitionRef?.id===row.id):c.features.some(f=>f.sourceRef?.id===row.id);
   const note=spell?'':featureEligibility(c,row as typeof featureLibrary[number]).note;
   const glyph=spell?spellIcon({definitionRef:{kind:'catalog',id:row.id},damage:'damage'in row?row.damage:undefined}):featureIcon({name:row.name,category:'kind'in row?row.kind as 'class'|'feat':'custom',sourceRef:{kind:'catalog',id:row.id}});
   return `<div class="choice-row"><button type="button" data-library-id="${row.id}" aria-label="Legg til ${esc(row.name)}" ${!spell&&existing?'disabled':''}>${icon(glyph)}<strong>${esc(row.name)}</strong><small>${existing?'Registrert · ':''}${spell?row.level?`Nivå ${row.level}`:'Cantrip':'kind'in row&&row.kind==='feat'?'Feat':`${esc(row.classes.join(', '))} · nivå ${row.level}`}${note?' · '+esc(note):''}</small></button><button type="button" class="customize-choice" data-library-customize="${row.id}" aria-label="Tilpass ${esc(row.name)}">Tilpass</button></div>`;
  }).join('');
  results.querySelectorAll<HTMLButtonElement>('[data-library-customize]').forEach(b=>b.onclick=()=>custom(spell?instantiateSpell(b.dataset.libraryCustomize!):instantiateFeature(b.dataset.libraryCustomize!),category));
  results.querySelectorAll<HTMLButtonElement>('[data-library-id]').forEach(b=>b.onclick=()=>{
   const id=b.dataset.libraryId!;
   if(!spell){void commitDialog(()=>ctx.save(withStandardResources({...c,features:[...c.features,instantiateFeature(id)]}),'feature','Egenskap lagt til'));return;}
   const row=spellLibrary.find(s=>s.id===id)!,sources=relevantSpellSources(c,row);
   const add=(source?:SpellSource)=>commitDialog(async()=>{
    if(c.spells.some(s=>s.definitionRef?.id===id&&s.casterClassRef===source?.classRef&&s.accessSource?.id===source?.ref?.id))return;
    const instance=assignSpell(c,instantiateSpell(id),source);if(!source)instance.sourceLabel='Manuell / DM';
    await ctx.save({...c,spells:[...c.spells,instance]},'spell','Spell lagt til');
   });
   if(sources.length<2){void add(sources[0]);return;}
   const choose=viewDialog('Hvor kommer spellen fra?',`<div class="choice-list">${sources.map((s,i)=>`<button type="button" data-spell-source="${i}">${esc(s.label)}</button>`).join('')}</div>`);
   choose.querySelectorAll<HTMLButtonElement>('[data-spell-source]').forEach(b=>b.onclick=()=>void add(sources[Number(b.dataset.spellSource)]));
  });
 }
 d.querySelector<HTMLInputElement>('[name="librarySearch"]')!.oninput=draw;
 d.querySelectorAll<HTMLSelectElement>('select').forEach(el=>el.onchange=draw);
 d.querySelector<HTMLInputElement>('[name="libraryOverride"]')!.onchange=draw;
 d.querySelectorAll<HTMLButtonElement>('[data-library-kind]').forEach(b=>b.onclick=()=>{category=b.dataset.libraryKind as typeof category;d.querySelectorAll<HTMLButtonElement>('[data-library-kind]').forEach(other=>other.setAttribute('aria-pressed',String(other===b)));draw();});
 d.querySelector<HTMLButtonElement>('#library-custom')!.onclick=()=>custom(undefined,category);draw();
}
