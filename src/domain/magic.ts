import context from '../data/srd-context.json';
import {classCatalog} from './catalog';
import {spellLibrary,instantiateSpell,featureLibrary} from './character-library';
import type {Character} from './model';
import {abilityModifier} from './modifiers';
export const normal=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
export const classKey=(cl:Character['classes'][number])=>context.classes.find(r=>`srd51:class:${r.id}`===cl.definitionRef?.id || normal(r.name)===normal(cl.name))?.id ?? '';
export const classFacts=(cl:Character['classes'][number])=>context.classes.find(r=>r.id===classKey(cl));
export const levelFacts=(cl:Character['classes'][number])=>context.levels.find(r=>r.class===classKey(cl)&&r.level===cl.level);
export function subclassFacts(cl:Character['classes'][number]) {
 const known=classCatalog.find(r=>r.catalogId===`srd51:class:${classKey(cl)}`);
 return context.subclasses.find(r=>r.class===classKey(cl)&&(normal(cl.subclass??'')===normal(known?.subclasses[0]??'') || normal(cl.subclass??'').endsWith(normal(r.name))));
}
export function maxSpellLevel(cl:Character['classes'][number]) {return (levelFacts(cl)?.slots??[]).reduce((max,n,i)=>n?i+1:max,0);}
export function slotProgression(c:Character) {
 const spellcasters=c.classes.filter(cl=>classKey(cl)!=='warlock'&&maxSpellLevel(cl)>0);
 let slots:number[]=[];
 if(spellcasters.length===1)slots=[...levelFacts(spellcasters[0])!.slots];
 else if(spellcasters.length>1){
  const level=spellcasters.reduce((n,cl)=>n+(['paladin','ranger'].includes(classKey(cl))?Math.floor(cl.level/2):cl.level),0);
  slots=[...(context.levels.find(r=>r.class==='wizard'&&r.level===Math.min(20,level))?.slots??[])];
 }
 return slots;
}
export function subclassSpells(c:Character,cl:Character['classes'][number]) {
 return (subclassFacts(cl)?.spells??[]).filter(s=>s.level<=cl.level&&s.features.every(id=>c.features.some(f=>f.sourceRef?.id===id)));
}
export function preparationLimit(c:Character,cl:Character['classes'][number]) {
 const key=classKey(cl),ability=classFacts(cl)?.ability as keyof Character['abilityScores'];
 if(!['wizard','cleric','druid','paladin'].includes(key)||!maxSpellLevel(cl))return null;
 return Math.max(1,(key==='paladin'?Math.floor(cl.level/2):cl.level)+abilityModifier(c.abilityScores[ability]));
}
export interface SpellSource {id:string;label:string;classRef?:string;ref?:{kind:'feature'|'catalog';id:string};ability?:typeof import('./model').abilities[number];system?:string;maxLevel:number;cantrip:boolean;classes:string[];spellIds:string[];book?:boolean;alwaysIds?:string[]}
export function spellSources(c:Character):SpellSource[] {
 const sources:SpellSource[]=c.classes.filter(cl=>maxSpellLevel(cl)>0||(levelFacts(cl)?.cantrips??0)>0).map(cl=>({id:cl.id,label:cl.name,classRef:cl.id,ability:classFacts(cl)?.ability as SpellSource['ability'],system:classKey(cl)==='warlock'?'Pact Magic':'Spellcasting',maxLevel:maxSpellLevel(cl),cantrip:(levelFacts(cl)?.cantrips??0)>0,classes:[cl.name],spellIds:subclassSpells(c,cl).map(s=>s.id),alwaysIds:classKey(cl)==='warlock'?[]:subclassSpells(c,cl).map(s=>s.id),book:classKey(cl)==='wizard'}));
 for(const f of c.features){
  const bard=c.classes.find(cl=>classKey(cl)==='bard'),warlock=c.classes.find(cl=>classKey(cl)==='warlock');
  const access=f.spellAccess??(f.sourceRef?.id.includes('magical-secrets')&&bard?{classes:context.classes.map(cl=>cl.name),spellIds:[],maxLevel:maxSpellLevel(bard),ability:'CHA' as const}:f.sourceRef?.id==='srd51:class:pact-of-the-tome'&&warlock?{classes:context.classes.map(cl=>cl.name),spellIds:[],maxLevel:0,ability:'CHA' as const}:undefined);
  if(access)sources.push({id:f.id,label:f.name,ref:{kind:'feature',id:f.id},ability:access.ability,maxLevel:access.maxLevel,cantrip:true,classes:access.classes,spellIds:access.spellIds});
 }
 if(c.species.catalogId==='srd51:species:tiefling'||normal(c.species.name)==='tiefling')sources.push({id:'tiefling',label:'Tiefling',ref:{kind:'catalog',id:'srd51:species:tiefling'},ability:'CHA',maxLevel:2,cantrip:true,classes:[],spellIds:['srd51:spell:thaumaturgy',...(c.level>=3?['srd51:spell:hellish-rebuke']:[]),...(c.level>=5?['srd51:spell:darkness']:[])]});
 return sources;
}
export function sourceAllows(source:SpellSource,row:typeof spellLibrary[number]) {return source.spellIds.includes(row.id)||((row.level===0?source.cantrip:row.level<=source.maxLevel)&&source.classes.some(name=>row.classes.some(cl=>normal(cl)===normal(name))));}
export const relevantSpellSources=(c:Character,row:typeof spellLibrary[number])=>spellSources(c).filter(source=>sourceAllows(source,row));
export function assignSpell(c:Character,spell:Character['spells'][number],source?:SpellSource) {
 const result={...spell};
 if(!source)return result;
 result.casterClassRef=source.classRef;result.accessSource=source.ref;result.sourceLabel=source.label;result.castingAbility=source.ability;result.resourceSystemRef=source.system;
 result.inSpellbook=!!source.book&&spell.spellLevel>0;
 result.alwaysPrepared=spell.alwaysPrepared||(source.alwaysIds?.includes(spell.definitionRef?.id??'')??false);
 result.prepared=result.alwaysPrepared || result.prepared;
 return result;
}
export function featureEligibility(c:Character,row:typeof featureLibrary[number]):{eligible:boolean;note:string} {
 const meta=context.features.find(f=>f.id===row.id),unknown:string[]=[];
 if(row.classes.length){
  const owners=c.classes.filter(cl=>row.classes.some(name=>normal(name)===normal(cl.name)));
  if(!owners.length)return {eligible:false,note:'Annen klasse'};
  if(!owners.some(cl=>cl.level>=row.level))return {eligible:false,note:`Krever klassenivå ${row.level}`};
  if(meta?.subclass&&!owners.some(cl=>subclassFacts(cl)?.id===meta.subclass))return {eligible:false,note:'Annen subclass'};
 }
 for(const raw of meta?.prerequisites??[]){
  const p=raw as {ability_score?:{name:string};minimum_score?:number;type?:string;spell?:string;feature?:string;level?:number};
  if(p.ability_score&&p.minimum_score!==undefined&&c.abilityScores[p.ability_score.name as keyof Character['abilityScores']]<p.minimum_score)return {eligible:false,note:`Krever ${p.ability_score.name} ${p.minimum_score}`};
  if(p.type==='level'&&p.level!==undefined&&!c.classes.some(cl=>row.classes.includes(cl.name)&&cl.level>=p.level!))return {eligible:false,note:`Krever klassenivå ${p.level}`};
  if(p.type==='spell'&&!c.spells.some(s=>s.definitionRef?.id===`srd51:spell:${p.spell?.split('/').at(-1)}`))unknown.push('Spellforutsetning må bekreftes');
  else if(p.type==='feature'&&!c.features.some(f=>f.sourceRef?.id===`srd51:class:${p.feature?.split('/').at(-1)}`))unknown.push('Egenskapsforutsetning må bekreftes');
  else if(p.type&&!['spell','feature','level'].includes(p.type))unknown.push('Forutsetning må bekreftes');
 }
 return {eligible:true,note:unknown.join(' · ')};
}
export function preparedSpellCandidates(c:Character,cl:Character['classes'][number]) {
 const source=spellSources(c).find(s=>s.classRef===cl.id);
 if(!source)return [];
 const always=new Set(source.alwaysIds);
 const rows=classKey(cl)==='wizard'?spellLibrary.filter(row=>c.spells.some(s=>s.definitionRef?.id===row.id&&s.inSpellbook&&(s.casterClassRef===cl.id||!s.casterClassRef))):spellLibrary.filter(row=>sourceAllows(source,row));
 const stored=c.spells.filter(s=>s.spellLevel>0&&s.casterClassRef===cl.id);
 const candidates=rows.filter(row=>row.level>0&&row.level<=maxSpellLevel(cl)).map(row=>{
  const existing=c.spells.find(s=>s.definitionRef?.id===row.id&&((s.casterClassRef===cl.id)||(!s.casterClassRef&&source.book)));
  return existing?{...existing,alwaysPrepared:always.has(row.id)||existing.alwaysPrepared}:assignSpell(c,instantiateSpell(row.id),source);
 });
 for(const s of stored)if(!candidates.some(r=>r.id===s.id))candidates.push(s);
 return candidates.sort((a,b)=>a.spellLevel-b.spellLevel||a.name.localeCompare(b.name));
}
export function prepareSpells(c:Character,cl:Character['classes'][number],rows:Character['spells'],selected:Set<string>) {
 const result=structuredClone(c),source=spellSources(c).find(s=>s.classRef===cl.id);
 for(const row of rows){
  const existing=result.spells.find(s=>s.id===row.id);
  if(!existing&&!selected.has(row.id)&&!row.alwaysPrepared)continue;
  const next={...assignSpell(c,row,source),prepared:!!row.alwaysPrepared||selected.has(row.id)};
  if(existing)Object.assign(existing,next);else result.spells.push(next);
 }
 return result;
}

export function spellUsable(c:Character,spell:Character['spells'][number]){
 if(spell.spellLevel===0)return spell.known||spell.prepared;
 if(spell.prepared||spell.alwaysPrepared)return true;
 const cl=c.classes.find(cl=>cl.id===spell.casterClassRef);
 if(cl&&preparationLimit(c,cl)!==null)return false;
 return spell.known&&!spell.inSpellbook;
}
