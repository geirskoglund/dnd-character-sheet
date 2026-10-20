import {z} from 'zod';
import type {Character} from '../domain/model';
import {characterSchema} from '../domain/model';
import {type Item} from '../domain/catalog';
import {weaponProfile,deriveWeapon} from '../domain/equipment';
import {damageTypes} from '../domain/records';
import {wizardDialog,choices,yesNo,draftOptions,appendWizardSteps,type WizardStep} from './wizard';
import {diceArt} from './wizard-art';
import {damageIcon} from '../domain/iconography';
import {icon} from './icons';
import {field,escapeHtml as esc} from './html';
import type {EditorContext} from './record-editors';
export function extraDamageMarkup(item:Item){return item.extraDamage?.map(part=>`<div class="extra-damage"><strong>+ ${esc(part.expression)} ${esc(part.damageType.toLowerCase())}</strong>${part.condition?`<span> · ${esc(part.condition)}</span>`:''}</div>`).join('')??'';}
export const equipmentDraftPayload=z.object({source:characterSchema.shape.items.element,existing:z.boolean(),expected:characterSchema.shape.items.element.optional(),extraIds:z.array(z.uuid()).max(150)});
function diceParts(expression=''){const match=/^(\d+)d(4|6|8|10|12)$/i.exec(expression.trim());return match?{type:'d'+match[2],count:match[1]}:{type:'custom',count:'1'};}
const typeChoices=(name:string,selected:string)=>choices(name,selected,[...['d4','d6','d8','d10','d12'].map(value=>({value,label:value,art:diceArt(value)})),{value:'custom',label:'Annet',hint:'Eget skadeuttrykk'}]);
const damageChoices=(name:string,value:string)=>choices(name,value,[...damageTypes,...value&&!damageTypes.includes(value)?[value]:[]].map(value=>({value,label:value,art:icon(damageIcon(value)??'magic')})));
export function equipmentWizard(ctx:EditorContext,initial:Item,editing=false){
 const resumed=ctx.resumedDraft?equipmentDraftPayload.parse(ctx.resumedDraft.payload):undefined;
 const source=resumed?.source??initial,existing=resumed?.existing??editing,c=ctx.current(),profile=weaponProfile(source),weapon=source.category==='weapon';
 const oldParts=source.extraDamage??[],extraIds=resumed?.extraIds??[...oldParts.map(p=>p.id),crypto.randomUUID()];
 const expected=resumed?.expected??(existing?structuredClone(c.items.find(i=>i.id===source.id)):undefined);
 const persistence=draftOptions(ctx,'equipment',source.name||'Eget utstyr',{source,existing,expected,extraIds},existing?source.id:undefined);
 if(persistence)persistence.payload=()=>({source,existing,expected,extraIds});
 const value=(form:HTMLFormElement,name:string)=>String(new FormData(form).get(name)??'');
 const base=diceParts(profile?.dice);
 const diceSteps=(prefix:string,expression:string,when:(form:HTMLFormElement)=>boolean):WizardStep[]=>{
  const known=diceParts(expression);
  return [{id:prefix+'-die',title:'Hvilken terningtype vil du bruke?',help:'Velg typen terning du kaster ved bordet. Antallet velger du i neste spørsmål.',art:'resource',html:typeChoices(prefix+'Die',expression?known.type:''),when},
   {id:prefix+'-count',title:'Hvor mange terninger vil du bruke?',help:'To d6 betyr at du kaster to seksidede terninger og legger sammen resultatet.',art:'resource',html:field('Antall terninger',prefix+'Count',known.count,'type="number" min="1" max="100" required'),when:f=>when(f)&&value(f,prefix+'Die')!=='custom'},
   {id:prefix+'-custom',title:'Hva er skadeuttrykket?',help:'Bruk et terninguttrykk eller en fast verdi avtalt med DM, for eksempel 1d6+2 eller 3.',art:'resource',html:field('Skadeuttrykk',prefix+'Expression',expression,'required maxlength="100" placeholder="For eksempel 1d6+2"'),when:f=>when(f)&&value(f,prefix+'Die')==='custom'}];
 };
 function extraSteps(id:string,index:number):WizardStep[]{
  const part=oldParts.find(p=>p.id===id),prefix='extra-'+id,enabled=(f:HTMLFormElement)=>{
   if(part)return value(f,prefix+'Keep')==='yes';
   const previous=extraIds.slice(oldParts.length,index).every(key=>value(f,'extra-'+key+'Add')==='yes');return previous&&value(f,prefix+'Add')==='yes';
  },reachable=(f:HTMLFormElement)=>!!part||extraIds.slice(oldParts.length,index).every(key=>value(f,'extra-'+key+'Add')==='yes');
  return [{id:prefix+'-ask',title:part?'Vil du beholde denne ekstraskaden?':index===oldParts.length?'Vil du legge til ekstraskade?':'Vil du legge til enda en ekstraskade?',help:part?`${part.expression} ${part.damageType}${part.condition?' · '+part.condition:''}. Velg Ja for å beholde eller tilpasse den.`:'Ekstraskade kommer i tillegg til våpenets vanlige skade, for eksempel ildskade fra et magisk sverd.',art:'fire',html:yesNo(prefix+(part?'Keep':'Add'),part?'yes':''),when:reachable},
   ...diceSteps(prefix,part?.expression??'',enabled),
   {id:prefix+'-type',title:'Hvilken type skade gjør den?',help:'Skadetypen står i våpenets beskrivelse eller avtales med DM.',art:'fire',html:damageChoices(prefix+'Type',part?.damageType??''),when:enabled},
   {id:prefix+'-conditional',title:'Vil du legge til en betingelse?',help:'En betingelse beskriver når akkurat denne ekstraskaden gjelder. For eksempel «bare mot udøde» eller «mens sverdet brenner».',art:'note',html:yesNo(prefix+'Conditional',part?.condition?'yes':''),when:enabled},
   {id:prefix+'-condition',title:'Hva er betingelsen?',help:'Skriv kort når denne ekstraskaden gjelder. Spilleren og DM vurderer betingelsen ved bordet.',art:'note',html:`<label>Beskriv betingelsen<textarea name="${prefix}Condition" required maxlength="10000" rows="3" placeholder="For eksempel: Når sverdet brenner">${esc(part?.condition??'')}</textarea></label>`,when:f=>enabled(f)&&value(f,prefix+'Conditional')==='yes'}];
 }
 const readDice=(form:HTMLFormElement,prefix:string)=>value(form,prefix+'Die')==='custom'?value(form,prefix+'Expression').trim():`${Number(value(form,prefix+'Count'))}${value(form,prefix+'Die')}`;
 function read(form:HTMLFormElement){
  const item=structuredClone(source);item.name=value(form,'itemName').trim();const note=value(form,'userNote');if(note||source.userNote!==undefined)item.userNote=note;
  if(weapon&&value(form,'changeBase')==='yes')item.weaponProfile={category:'custom',kind:'melee',properties:[],...profile,dice:readDice(form,'base'),damageType:value(form,'baseType')};
  if(weapon){const parts=extraIds.flatMap(id=>{const part=oldParts.find(p=>p.id===id),p='extra-'+id;if(value(form,p+(part?'Keep':'Add'))!=='yes')return [];return [{id,expression:readDice(form,p),damageType:value(form,p+'Type'),...(value(form,p+'Conditional')==='yes'?{condition:value(form,p+'Condition').trim()}: {})}];});if(parts.length||source.extraDamage!==undefined)item.extraDamage=parts;}
  return item;
 }
 const d=wizardDialog(existing?'Rediger våpen':source.name?'Egen variant':'Eget utstyr',[
  {id:'item-name',title:weapon?'Hva heter våpenet?':'Hva heter gjenstanden?',help:source.name?'Grunnverdiene fra '+source.name+' følger med. Du kan gi din variant et eget navn.':'Bruk navnet du vil føre på karakterarket.',art:weapon?'sword':'equipment',html:field('Navn på utstyr','itemName',source.name,'required maxlength="100"')},
  {id:'item-note',title:'Vil du skrive en merknad?',help:'Valgfritt: opphav, utseende eller noe annet du vil huske. Du kan gå videre uten å skrive noe.',art:'note',html:`<label>Merknad (valgfritt)<textarea name="userNote" maxlength="10000" rows="3">${esc(source.userNote??'')}</textarea></label>`},
  {id:'base-change',title:'Vil du endre grunnskaden?',help:profile?`Våpenets grunnskade er ${profile.dice} ${profile.damageType}. Karakterens vanlige skadebonus regnes fortsatt ut fra arket.`:'Velg Ja hvis du vil angi terningene for våpenets vanlige skade.',art:'sword',html:yesNo('changeBase'),when:()=>weapon},
  ...diceSteps('base',profile?.dice??'',f=>weapon&&value(f,'changeBase')==='yes'),
  {id:'base-type',title:'Hvilken type grunnskade gjør våpenet?',art:'sword',html:damageChoices('baseType',profile?.damageType??''),when:(f:HTMLFormElement)=>weapon&&value(f,'changeBase')==='yes'},
  ...extraIds.flatMap((id,i)=>extraSteps(id,i).map(step=>({...step,when:(f:HTMLFormElement)=>weapon&&(step.when?.(f)??true)}))),
  {id:'complete',title:existing?'Endringene er klare':'Klart til å føres på arket',help:'Se over resultatet. Fullfør bekrefter registreringen. Du kan gå tilbake for å korrigere svar.',art:weapon?'sword':'equipment',html:'<div class="wizard-result" data-equipment-summary></div>'},
 ],async(form,completion)=>{
  const current=ctx.current();if(current.id!==c.id)throw new Error('Åpne utkastet fra karakteren det tilhører.');
  if(existing&&JSON.stringify(current.items.find(i=>i.id===source.id))!==JSON.stringify(expected))throw new Error('Gjenstanden er endret eller fjernet siden utkastet ble startet. Den lagrede versjonen er beholdt. Forkast utkastet og åpne gjenstanden på nytt for å redigere.');
  const item=read(form);if(item.extraDamage?.some(p=>!p.expression||!p.damageType))throw new Error('Fullfør opplysningene om ekstraskaden.');
  await ctx.save(characterSchema.parse({...current,items:existing?current.items.map(i=>i.id===item.id?item:i):[...current.items,item]}),'equipment',item.name+(existing?' tilpasset':' lagt til'),completion);
 },'Fullfør',persistence);
 const form=d.querySelector('form')!;
 const update=()=>{const item=read(form),derived=weapon?deriveWeapon(c,item):undefined;d.querySelector('[data-equipment-summary]')!.innerHTML=`<strong>${esc(item.name)}</strong>${derived?`<p>${esc(derived.attack)} · ${esc(derived.damage)}</p>`:''}${extraDamageMarkup(item)}${item.userNote?`<p>${esc(item.userNote)}</p>`:''}`;};
 // New damage rounds are inserted before the final review, while retaining every earlier answer.
 form.addEventListener('change',e=>{
  const input=e.target as HTMLInputElement,last=extraIds.at(-1)!;
  if(input.name==='extra-'+last+'Add'&&input.value==='yes'){
   const id=crypto.randomUUID();extraIds.push(id);appendWizardSteps(d,extraSteps(id,extraIds.length-1).map(step=>({...step,when:(f:HTMLFormElement)=>weapon&&(step.when?.(f)??true)})));
   const complete=d.querySelector<HTMLElement>('[data-question-id="complete"]')!;d.querySelector('#dialog-body')!.insertBefore(complete,d.querySelector('#discard-wizard'));
  }
  update();
 });form.addEventListener('input',update);update();
 return d;
}
