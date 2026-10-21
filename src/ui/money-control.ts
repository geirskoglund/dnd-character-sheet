import {numberChangeDialog} from './number-change-dialog';
/** GP is a two-wheel view of exact integer CP storage. */
export function changeMoney(cp:number,save:(cp:number)=>Promise<void>){
 return numberChangeDialog({name:'beløp',icon:'coins',original:cp,decimal:true,wholeLabel:'Hele GP',min:0,onConfirm:async result=>{if(result!==cp)await save(result);}});
}
