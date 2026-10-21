import type {Character} from '../domain/model';
import {hpAfterChange} from '../domain/derived';
import {numberChangeDialog} from './number-change-dialog';
/** Manual corrections touch ordinary HP only; damage consumes temporary HP first. */
export function changeHp(hp:Character['hp'],save:(next:Character['hp'],delta:number)=>Promise<void>,options:{damageOnly?:boolean}={}){
 const damage=options.damageOnly??false;
 const after=(delta:number)=>damage?hpAfterChange(hp,delta):{...hp,current:Math.max(0,Math.min(hp.max,hp.current+delta))};
 const detail=(value:Character['hp'])=>`av ${hp.max} HP${damage?` · ${value.temp} temp HP`:''}`;
 return numberChangeDialog({name:'HP',title:damage?'Ta skade':'Endre HP',icon:'healing',original:damage?hp.current+hp.temp:hp.current,min:0,max:damage?hp.current+hp.temp:hp.max,
  comparison:delta=>({before:{value:String(hp.current),detail:detail(hp)},after:{value:String(after(delta).current),detail:detail(after(delta))}}),
  preview:delta=>`HP ${hp.current} → ${after(delta).current} / ${hp.max}. ${damage?`Temporary HP ${hp.temp} → ${after(delta).temp}. Skade bruker Temporary HP først.`:'Korrigerer bare vanlig HP. Temporary HP endres ikke.'}`,
  onConfirm:async(_result,delta)=>{if(delta)await save(after(delta),delta);}});
}
