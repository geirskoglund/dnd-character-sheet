import {choices,type WizardStep} from './wizard';
import {diceArt} from './wizard-art';
import {field,numberField,str,num} from './record-fields';

/** Same illustrated dice and numeric editors as equipment, with a manual escape hatch. */
export function consumableDiceSteps(expression=''):WizardStep[]{
 const parsed=/^(\d+)d(4|6|8|10|12|20)([+-]\d+)?$/i.exec(expression.replace(/\s+/g,''));
 const match=parsed&&Number.isSafeInteger(Number(parsed[1]))&&Number(parsed[1])>=1&&Number.isSafeInteger(Number(parsed[3]??0))?parsed:null;
 const kind=expression?match?'d'+match[2]:'custom':'none';
 const value=(f:HTMLFormElement)=>str(new FormData(f),'diceKind');
 const standard=(f:HTMLFormElement)=>!['none','custom',''].includes(value(f));
 return [
  {id:'dice',title:'Hvilken terning brukes?',art:'potion',help:'Velg terningen du kaster fysisk, Annet for et spesielt uttrykk, eller Ingen terninger.',html:choices('diceKind',kind,[...['d4','d6','d8','d10','d12','d20'].map(value=>({value,label:value,art:diceArt(value)})),{value:'custom',label:'Annet'},{value:'none',label:'Ingen terninger'}])},
  {id:'dice-count',title:'Hvor mange terninger brukes?',art:'potion',help:'Antallet terninger som skal kastes, for eksempel to d6.',html:numberField('Antall terninger','diceCount',match?.[1]??1,'required min="1" max="9007199254740991"'),when:standard},
  {id:'dice-bonus',title:'Hvilken bonus legges til?',art:'potion',help:'Bruk0 uten bonus. Negative verdier kan også føres etter avtale med DM.',html:numberField('Bonus','diceBonus',Number(match?.[3]??0),'required min="-9007199254740991" max="9007199254740991"'),when:standard},
  {id:'dice-custom',title:'Hva er terninguttrykket?',art:'potion',help:'Bruk uttrykket fra varen eller avtalen med DM. Ingen digitale kast utføres.',html:field('Terninguttrykk','diceExpression',expression,'required maxlength="100"'),when:f=>value(f)==='custom'},
 ];
}
export function readConsumableDice(data:FormData):string|undefined{
 const kind=str(data,'diceKind');
 if(kind==='none'||!kind)return undefined;
 if(kind==='custom')return str(data,'diceExpression');
 const count=num(data,'diceCount'),bonus=num(data,'diceBonus');
 return `${count}${kind}${bonus>0?'+':''}${bonus?String(bonus):''}`;
}
