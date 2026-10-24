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
