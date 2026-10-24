import data from '../data/srd-consumables.json';
import {characterSchema,type Character} from './model';
import type {IconKey} from './iconography';
export type Consumable=Character['consumables'][number];
export const consumableCategories={ammunition:{label:'Ammunisjon',icon:'bow'},healing:{label:'Healing Potions',icon:'healing'},supplies:{label:'Forsyninger',icon:'equipment'},combat:{label:'Kampforbruk',icon:'tools'},other:{label:'Annet',icon:'note'}} as const;
export const consumableCatalog=data as (Omit<Consumable,'id'|'quantity'> & {sourceIndex:string;iconKey:IconKey})[];
export function newConsumable(catalogId?:string):Consumable {
 const definition=consumableCatalog.find(row=>row.catalogId===catalogId);
 return {id:crypto.randomUUID(),name:'',quantity:0,category:'other',unit:'stk.',description:'',...definition};
}
export function setConsumableQuantity(c:Character,id:string,quantity:number):Character {
 if(!Number.isSafeInteger(quantity)||quantity<0)throw Error('Antall må være et ikke-negativt heltall.');
 if(!c.consumables.some(row=>row.id===id))throw Error('Varen finnes ikke lenger.');
 return characterSchema.parse({...c,consumables:c.consumables.map(row=>row.id===id?{...row,quantity}:row)});
}

/** Presentation only: existing saved names, descriptions and IDs are never rewritten. */
export function consumableName(row:Pick<Consumable,'name'|'catalogId'>):string {
 return row.catalogId?row.name.replace(/\s*\((?:vial|flask|bag|uses|piece|sheet|ounce|1 day|waterskin-innhold)\)$/i,''):row.name;
}
export function consumableDice(row:Consumable):string {
 return row.diceExpression??consumableCatalog.find(r=>r.catalogId===row.catalogId)?.diceExpression??'';
}
export function consumableDescription(row:Consumable):string {
 if(!row.catalogId?.startsWith('srd51:consumable:potion-of-healing-'))return row.description;
 return row.description.split('Potions of Healing (table)')[0].replace("The number of hit points depends on the potion's rarity, as shown in the Potions of Healing table. ",'').trim();
}
const normal=(s:string)=>s.trim().replace(/\s+/g,' ').toLocaleLowerCase('nb');
function sameConsumable(a:Consumable,b:Consumable):boolean {
 return normal(consumableName(a))===normal(consumableName(b))&&
 ((!b.description.trim()&&!b.diceExpression?.trim())||normal(consumableDescription(a))===normal(consumableDescription(b))&&normal(consumableDice(a))===normal(consumableDice(b)));
}
export function availableConsumables(c:Character){
 return consumableCatalog.filter(def=>!c.consumables.some(row=>row.catalogId===def.catalogId||sameConsumable(row,{...def,id:'',quantity:0})||sameConsumable({...def,id:'',quantity:0},row)));
}
export function addConsumable(c:Character,row:Consumable):Character {
 if(c.consumables.some(existing=>sameConsumable(existing,row)))throw Error('Denne varen finnes allerede. Fyll på den eksisterende beholdningen, eller beskriv hva som skiller den nye varianten.');
 return characterSchema.parse({...c,consumables:[...c.consumables,row]});
}
export function removeConsumable(c:Character,id:string):Character {
 if(!c.consumables.some(row=>row.id===id))throw Error('Varen finnes ikke lenger.');
 return {...c,consumables:c.consumables.filter(row=>row.id!==id)};
}
