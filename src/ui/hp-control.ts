import type {Character} from '../domain/model';
import {hpAfterChange} from '../domain/derived';
import {numberChangeDialog} from './number-change-dialog';
/** Damage remains a single existing domain operation including temporary HP absorption. */
export function changeHp(hp:Character['hp'],save:(delta:number)=>Promise<void>){
 const total=hp.current+hp.temp;
 return numberChangeDialog({name:'HP',icon:'healing',original:total,min:0,max:Math.max(total,hp.max+hp.temp),
  preview:delta=>{const after=hpAfterChange(hp,delta);return `HP ${hp.current} → ${after.current} / ${hp.max} · Temporary HP ${hp.temp} → ${after.temp}. Før/etter viser HP + Temporary HP. Skade bruker Temporary HP først.`;},
  onConfirm:async(_result,delta)=>{if(delta)await save(delta);}});
}
