import type {Character} from '../domain/model';
import {hpAfterChange} from '../domain/derived';
import {numberChangeDialog} from './number-change-dialog';
/** Damage remains a single existing domain operation including temporary HP absorption. */
export function changeHp(hp:Character['hp'],save:(delta:number)=>Promise<void>,options:{damageOnly?:boolean}={}){
 const total=hp.current+hp.temp;
 return numberChangeDialog({name:'HP',title:options.damageOnly?'Ta skade':'Endre HP',icon:'healing',original:total,min:0,max:options.damageOnly?total:Math.max(total,hp.max+hp.temp),
  comparison:delta=>{const after=hpAfterChange(hp,delta);return {before:{value:String(hp.current),detail:`av ${hp.max} HP · ${hp.temp} temp HP`},after:{value:String(after.current),detail:`av ${hp.max} HP · ${after.temp} temp HP`}};},
  preview:delta=>{const after=hpAfterChange(hp,delta);return `HP ${hp.current} → ${after.current} / ${hp.max} · Temporary HP ${hp.temp} → ${after.temp}. Skade bruker Temporary HP først.`;},
  onConfirm:async(_result,delta)=>{if(delta)await save(delta);}});
}
