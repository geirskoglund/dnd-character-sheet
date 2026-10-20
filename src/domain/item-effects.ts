import type {Character} from './model';
export type Item=Character['items'][number];
export type ItemModifier=NonNullable<Item['modifiers']>[number];
export const itemUsed=(i:Item)=>i.equipped&&i.quantity>0&&i.hand!=='none';
export const itemActive=(i:Item)=>itemUsed(i)&&(!i.requiresAttunement||!!i.attuned);
/** Unknown textual conditions remain lookup information, never silently applied. */
export function contributions(c:Character,target:ItemModifier['target'],subject?:string){
 return c.items.filter(itemActive).flatMap(item=>(item.modifiers??[]).filter(m=>m.target===target&&!m.condition&&(subject===undefined||m.subject===subject)).map(m=>({...m,source:item.id,name:item.name})));
}
export function itemAdjustment(c:Character,target:ItemModifier['target'],subject?:string){return contributions(c,target,subject).filter(m=>m.operation==='add').reduce((n,m)=>n+m.amount,0);}
export function effectiveAbilities(c:Character){
 const result={...c.abilityScores};
 for(const key of Object.keys(result) as (keyof typeof result)[]){const entries=contributions(c,'ability',key);result[key]=Math.max(0,c.abilityScores[key]+entries.filter(m=>m.operation==='add').reduce((n,m)=>n+m.amount,0),...entries.filter(m=>m.operation==='floor').map(m=>m.amount));}
 return result;
}
export const effectiveMaxHp=(c:Character)=>Math.max(0,c.hp.max+itemAdjustment(c,'maxHp'));
export function weaponHand(c:Character,item:Item):NonNullable<Item['hand']>{
 if(!itemUsed(item))return 'none';if(item.hand)return item.hand;
 const used=new Set<string>();
 for(const i of c.items.filter(i=>itemUsed(i)&&i.hand)){if(i.hand==='both'){used.add('left');used.add('right');}else used.add(i.hand!);}
 for(const i of c.items.filter(i=>itemUsed(i)&&i.category==='weapon'&&!i.hand)){
  const hand=i.grip==='two'||(!i.grip&&i.handUsage==='two')?'both':!used.has('right')?'right':!used.has('left')?'left':'right';
  if(i.id===item.id)return hand;if(hand==='both'){used.add('left');used.add('right');}else used.add(hand);
 }
 return 'none';
}
export const handLabels={none:'Ikke i bruk',left:'Venstre hånd',right:'Høyre hånd',both:'Begge hender'};
export function setHand(item:Item,hand:NonNullable<Item['hand']>){item.hand=hand;item.equipped=hand!=='none';if(hand!=='none'){item.grip=hand==='both'?'two':'one';}}
/** Copy the item and its private children. Shared external children stay references. */
export function copyEquipment(c:Character,id:string){
 const result=structuredClone(c),source=result.items.find(i=>i.id===id);if(!source)throw new Error('Gjenstanden finnes ikke lenger.');
 const item=structuredClone(source),map=new Map<string,string>([[item.id,crypto.randomUUID()]]);
 const children={resources:result.resources.filter(r=>r.sourceRef?.kind==='item'&&r.sourceRef.id===id),actions:result.actions.filter(r=>r.sourceRef?.kind==='item'&&r.sourceRef.id===id),effects:result.effects.filter(r=>r.sourceRef?.kind==='item'&&r.sourceRef.id===id),activeStates:result.activeStates.filter(r=>r.sourceRef?.kind==='item'&&r.sourceRef.id===id)};
 function collect(v:unknown){if(v&&typeof v==='object'){if('id'in v&&typeof v.id==='string'&&!('kind'in v&&Object.keys(v).every(k=>k==='kind'||k==='id')))map.set(v.id,map.get(v.id)??crypto.randomUUID());Object.values(v).forEach(collect);}}
 collect(item);Object.values(children).flat().forEach(collect);
 function remap(v:unknown):unknown{if(typeof v==='string')return map.get(v)??v;if(Array.isArray(v))return v.map(remap);if(v&&typeof v==='object'){if('kind'in v&&v.kind==='catalog')return v;return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,remap(x)]));}return v;}
 const copy=remap(item) as Item;copy.quantity=1;copy.equipped=false;if(copy.category==='weapon')copy.hand='none';if(copy.attuned!==undefined)copy.attuned=false;
 result.items.push(copy);for(const key of ['resources','actions','effects','activeStates'] as const)result[key]=[...result[key],...children[key].map(r=>remap(r))] as never;
 return result;
}
/** Keep the reference closure of shared children, including pools used by shared actions. */
export function removeEquipment(c:Character,id:string){
 const result=structuredClone(c);result.items=result.items.filter(i=>i.id!==id);
 const keys=['resources','actions','effects','activeStates'] as const;
 const owned=new Map(keys.flatMap(key=>result[key].filter(row=>row.sourceRef?.kind==='item'&&row.sourceRef.id===id).map(row=>[row.id,row] as const)));
 const references=(row:object)=>{
  const value=row as Record<string,unknown>;
  const ids=['resourceRefs','effectRefs','actionRefs'].flatMap(key=>Array.isArray(value[key])?value[key] as string[]:[]);
  if(typeof value.activeStateRef==='string')ids.push(value.activeStateRef);
  if(value.specialEffect&&typeof value.specialEffect==='object'&&'resourceId'in value.specialEffect&&typeof value.specialEffect.resourceId==='string')ids.push(value.specialEffect.resourceId);
  return ids;
 };
 const kept=new Set<string>(),pending=[...result.items,...result.features,...keys.flatMap(key=>result[key].filter(row=>!owned.has(row.id)))].flatMap(references);
 while(pending.length){const ref=pending.pop()!;if(kept.has(ref))continue;kept.add(ref);const child=owned.get(ref);if(child)pending.push(...references(child));}
 for(const key of keys)result[key]=result[key].filter(row=>!owned.has(row.id)||kept.has(row.id)) as never;
 return result;
}
