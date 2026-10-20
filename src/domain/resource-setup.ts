import {effectiveAbilities,effectiveMaxHp} from './item-effects';
import type {Character} from './model';
import {classFacts,classKey,levelFacts,slotProgression} from './magic';
import {abilityModifier} from './modifiers';
type Pool=Character['resources'][number];
const projectionIds=new Map<string,string>();
function poolId(character:string,key:string){const seed=`${character}:${key}`;if(!projectionIds.has(seed))projectionIds.set(seed,crypto.randomUUID());return projectionIds.get(seed)!;}
/** Read projection: stable within this session, persisted by the next real character command.
 * Existing manual pools are authoritative. No write or audit event occurs merely by opening a tab. */
export function withStandardResources(source:Character):Character {
 const c=structuredClone(source),desired=new Set<string>();
 const add=(key:string,spec:Omit<Pool,'id'|'ownerCharacterId'|'current'|'automatic'>)=>{
  if(spec.max<=0)return;
  const identity=`${key}:${spec.classRef??''}`;desired.add(identity);
  const auto=c.resources.find(p=>p.automatic?.key===key&&p.classRef===spec.classRef);
  if(auto){
   const spent=Math.max(0,auto.max-auto.current);
   if(!auto.manualMaximum&&auto.max===auto.automatic!.max){auto.max=spec.max;auto.current=Math.max(0,Math.min(spec.max,spec.max-spent));}
   auto.spellLevel=spec.spellLevel;auto.die=spec.die;
   if(!auto.automatic!.recharge||JSON.stringify(auto.recharge)===JSON.stringify(auto.automatic!.recharge))auto.recharge=structuredClone(spec.recharge);
   if(auto.name===auto.automatic!.name||!auto.automatic!.name)auto.name=spec.name;
   if(spec.sourceRef&&!c.features.some(f=>f.id===auto.sourceRef?.id))auto.sourceRef=spec.sourceRef;
   auto.automatic={key,max:spec.max,name:spec.name,recharge:structuredClone(spec.recharge)};return;
  }
  const manual=c.resources.find(p=>!p.automatic&&p.kind===spec.kind&&(spec.kind==='spellSlot'?p.spellLevel===spec.spellLevel&&(p.systemRef??'Spellcasting').toLowerCase()===(spec.systemRef??'Spellcasting').toLowerCase():spec.kind==='hitDie'?p.die===spec.die&&(!p.classRef||p.classRef===spec.classRef):p.sourceRef?.id===spec.sourceRef?.id||p.name.toLowerCase()===spec.name.toLowerCase()));
  if(manual)return;
  c.resources.push({...spec,id:poolId(c.id,identity),ownerCharacterId:c.id,current:spec.max,automatic:{key,max:spec.max,name:spec.name,recharge:structuredClone(spec.recharge)}});
 };
 slotProgression(c).forEach((max,i)=>add(`spellcasting:${i+1}`,{kind:'spellSlot',name:`Spellcasting · nivå ${i+1}`,spellLevel:i+1,systemRef:'Spellcasting',max,recharge:{kind:'longRest'}}));
 for(const cl of c.classes){
  const facts=classFacts(cl);if(!facts)continue;
  add('hitDice',{kind:'hitDie',name:`${cl.name} · ${facts.die}`,die:facts.die as Pool['die'],classRef:cl.id,max:cl.level,recharge:{kind:'manual'}});
  if(classKey(cl)==='warlock')levelFacts(cl)?.slots.forEach((max,i)=>add('pact',{kind:'spellSlot',name:`Pact Magic · nivå ${i+1}`,spellLevel:i+1,systemRef:'Pact Magic',classRef:cl.id,max,recharge:{kind:'shortRest'}}));
 }
 for(const f of c.features){
  const raw=f.sourceRef?.kind==='catalog'?f.sourceRef.id.replace('srd51:class:',''):'';
  const key=raw.startsWith('wild-shape-')?'wild-shape':raw.startsWith('bardic-inspiration-')?'bardic-inspiration':raw.startsWith('action-surge-')?'action-surge':raw;
  const cl=c.classes.find(cl=>({'ki':'monk','rage':'barbarian','second-wind':'fighter','action-surge':'fighter','bardic-inspiration':'bard','font-of-magic':'sorcerer','lay-on-hands':'paladin','wild-shape':'druid','arcane-recovery':'wizard'} as Record<string,string>)[key]===classKey(cl));
  if(!cl)continue;
  let max=0,recharge:Pool['recharge']={kind:'longRest'};
  if(key==='ki'&&cl.level>=2){max=cl.level;recharge={kind:'shortRest',ruleText:'Minst 30 minutter av hvilen brukt til meditasjon.'};}
  if(key==='rage')max=cl.level>=20?999:cl.level>=17?6:cl.level>=12?5:cl.level>=6?4:cl.level>=3?3:2;
  if(key==='second-wind'){max=1;recharge={kind:'shortRest'};}
  if(key.startsWith('action-surge')){max=cl.level>=17?2:cl.level>=2?1:0;recharge={kind:'shortRest'};}
  if(key==='bardic-inspiration'){max=Math.max(1,abilityModifier(effectiveAbilities(c).CHA));recharge={kind:cl.level>=5?'shortRest':'longRest'};}
  if(key==='font-of-magic'&&cl.level>=2)max=cl.level;
  if(key==='lay-on-hands')max=5*cl.level;
  if(key==='wild-shape'&&cl.level>=2){max=2;recharge={kind:'shortRest'};}
  if(key==='arcane-recovery'){max=1;recharge={kind:'special',ruleText:'Én gang per spilledag etter kort hvile; velg slotnivåer manuelt.'};}
  if((key==='rage'||key==='wild-shape')&&cl.level>=20)continue; // unlimited, not an invented finite count
  add(`feature:${key.startsWith('action-surge')?'action-surge':key}`,{kind:'custom',name:({'font-of-magic':'Sorcery Points','wild-shape':'Wild Shape','bardic-inspiration':'Bardic Inspiration','action-surge':'Action Surge'} as Record<string,string>)[key]??f.name,max,classRef:cl.id,sourceRef:{kind:'feature',id:f.id},recharge});
  const pool=c.resources.find(p=>p.automatic?.key===`feature:${key.startsWith('action-surge')?'action-surge':key}`&&p.classRef===cl.id)||c.resources.find(p=>p.sourceRef?.kind==='feature'&&p.sourceRef.id===f.id);
  if(pool&&!f.resourceRefs.includes(pool.id))f.resourceRefs.push(pool.id);
 }
 // Remove obsolete generated counts on class/level changes; explicit overrides remain paper-sheet entries.
 c.resources=c.resources.filter(p=>!p.automatic||p.manualMaximum||desired.has(`${p.automatic.key}:${p.classRef??''}`));
 const ids=new Set(c.resources.map(p=>p.id));
 for(const f of c.features)f.resourceRefs=f.resourceRefs.filter(id=>ids.has(id));
 return c;
}
export function adjustPool(c:Character,id:string,delta:number){
 const draft=structuredClone(c),pool=draft.resources.find(p=>p.id===id);
 if(!pool)throw new Error('Beholdningen finnes ikke.');
 pool.current=Math.max(0,Math.min(pool.max,pool.current+delta));return draft;
}
export const hitRecoveryBudget=(c:Character)=>Math.max(1,Math.floor(c.resources.filter(p=>p.kind==='hitDie').reduce((n,p)=>n+p.max,0)/2));
export function defaultHitRecovery(c:Character){
 const dice=c.resources.filter(p=>p.kind==='hitDie'&&p.current<p.max),budget=hitRecoveryBudget(c);
 if(dice.length===1)return {[dice[0].id]:Math.min(budget,dice[0].max-dice[0].current)};
 if(dice.reduce((n,p)=>n+p.max-p.current,0)<=budget)return Object.fromEntries(dice.map(p=>[p.id,p.max-p.current]));
 return Object.fromEntries(dice.map(p=>[p.id,0]));
}
export function restResult(c:Character,kind:'shortRest'|'longRest',recovery:Record<string,number>={},confirmed=new Set<string>()){
 const draft=structuredClone(c);let total=0;
 for(const [id,n]of Object.entries(recovery)){
  const p=draft.resources.find(p=>p.id===id);
  if(!p||p.kind!=='hitDie'||!Number.isInteger(n)||n<0||n>Math.max(0,p.max-p.current))throw new Error('Kontroller antall Hit Dice som gjenopprettes.');
  total+=n;
 }
 if(total>(kind==='longRest'?hitRecoveryBudget(c):0))throw new Error('For mange Hit Dice valgt.');
 for(const p of draft.resources){
  if(p.kind==='hitDie'){p.current+=recovery[p.id]??0;continue;}
  const applies=p.recharge.kind==='shortRest'||kind==='longRest'&&p.recharge.kind==='longRest';
  if(applies&&(!p.recharge.ruleText||confirmed.has(p.id)))p.current=p.max;
 }
 if(kind==='longRest'){draft.hp.current=effectiveMaxHp(draft);draft.hp.temp=0;}
 return draft;
}
