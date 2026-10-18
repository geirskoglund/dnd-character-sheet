import features from '../data/srd-features.json';
import spells from '../data/srd-spells.json';
import type {Character} from './model';
export const featureLibrary = features;
export const spellLibrary = spells;
export function instantiateFeature(id: string): Character['features'][number] {
  const row = featureLibrary.find(row=>row.id===id);
  if (!row) throw new Error('Ukjent katalogegenskap.');
  return {id:crypto.randomUUID(),sourceRef:{kind:'catalog',id:row.id},name:row.name,category:row.kind as 'class'|'feat',description:row.description,actionRefs:[],resourceRefs:[],effectRefs:[]};
}
export function instantiateSpell(id: string): Character['spells'][number] {
  const row = spellLibrary.find(row=>row.id===id);
  if (!row) throw new Error('Ukjent spell.');
  return {id:crypto.randomUUID(),definitionRef:{kind:'catalog',id:row.id},name:row.name,spellLevel:row.level,castingTime:row.castingTime,actionEconomy:row.economy as 'action',range:row.range,duration:row.duration,concentration:row.concentration,ritual:row.ritual,components:[...row.components],attack:row.attack || undefined,save:row.save || undefined,damage:row.damage || undefined,description:row.description,known:true,inSpellbook:false,prepared:false};
}
