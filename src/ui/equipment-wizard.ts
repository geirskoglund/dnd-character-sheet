import type {Character} from '../domain/model';
import {characterSchema} from '../domain/model';
import {type Item} from '../domain/catalog';
import {weaponProfile} from '../domain/equipment';
import {damageTypes} from '../domain/records';
import {wizardDialog} from './wizard';
import {field,select,escapeHtml as esc} from './html';
import type {EditorContext} from './record-editors';
const yesNo=[{value:'no',label:'Nei'},{value:'yes',label:'Ja'}];
export function extraDamageMarkup(item:Item){return item.extraDamage?.map(part=>`<div class="extra-damage"><strong>+ ${esc(part.expression)} ${esc(part.damageType.toLowerCase())}</strong>${part.condition?`<span> · ${esc(part.condition)}</span>`:''}</div>`).join('')??'';}
export function equipmentWizard(ctx:EditorContext,source:Item,existing=false){
 const c=ctx.current(),profile=weaponProfile(source),weapon=source.category==='weapon';
 const ids=(source.extraDamage?.length?source.extraDamage:[{id:crypto.randomUUID(),expression:'',damageType:'',condition:undefined}]).map(part=>part.id);
 const damageOptions=(value='')=>[{value:'',label:'Velg skadetype'},...damageTypes.map(value=>({value,label:value})),...value&&!damageTypes.includes(value)?[{value,label:value}]:[]];
 function row(id:string){const part=source.extraDamage?.find(p=>p.id===id);return `<fieldset class="extra-damage-row" data-extra-row="${id}"><legend>Ekstraskade</legend>${field('Skadeuttrykk','extraExpression-'+id,part?.expression??'','required maxlength="100" placeholder="Eksempel: 1d6"')}${select('Skadetype','extraType-'+id,part?.damageType??'',damageOptions(part?.damageType),'required')}${select('Gjelder ekstraskaden bare under en betingelse?','extraConditional-'+id,part?.condition?'yes':'no',yesNo)}<label data-extra-condition="${id}" ${part?.condition?'':'hidden'}>Beskriv betingelsen<textarea name="extraCondition-${id}" ${part?.condition?'required':''} maxlength="10000">${esc(part?.condition??'')}</textarea></label><button type="button" data-remove-extra="${id}">Fjern denne ekstraskaden</button></fieldset>`;}
 const d=wizardDialog(existing?'Tilpass '+source.name:source.name?'Tilpass '+source.name:'Eget utstyr',[
  {title:'Hva vil du føre på arket?',html:field('Navn på utstyr','itemName',source.name,'required maxlength="100"')+`<label>Merknad (valgfritt)<textarea name="userNote" maxlength="10000" rows="3">${esc(source.userNote??'')}</textarea></label>`},
  {title:'Vil du endre spillverdier?',html:weapon?`<label class="check"><input type="checkbox" name="changeBase">Endre grunnskade</label>${select('Har våpenet ekstra skade?','hasExtra',source.extraDamage?.length?'yes':'no',yesNo)}`:'<p>Grunnverdiene følger gjenstanden. Flere endringer er tilgjengelige fra Tilpass etter registrering.</p>',when:()=>weapon},
  {title:'Hva er grunnskaden?',html:field('Grunnskade (terninger)','weaponDice',profile?.dice??'','required maxlength="100"')+select('Skadetype','weaponDamageType',profile?.damageType??'',damageOptions(profile?.damageType),'required'),when:form=>weapon&&(form.elements.namedItem('changeBase') as HTMLInputElement).checked},
  {title:'Hvilken ekstra skade har våpenet?',html:`<div id="extra-damage-rows">${ids.map(row).join('')}</div><button type="button" id="add-extra">Legg til en ekstraskade til</button>`,when:form=>weapon&&new FormData(form).get('hasExtra')==='yes'},
 ],async form=>{
  const data=new FormData(form),item=structuredClone(source);item.name=String(data.get('itemName')).trim();item.userNote=String(data.get('userNote'));
  if(data.has('changeBase'))item.weaponProfile={category:'custom',kind:'melee',properties:[],...profile,dice:String(data.get('weaponDice')),damageType:String(data.get('weaponDamageType'))};
  if(weapon){
   if(data.get('hasExtra')==='yes'&&!ids.length)throw new Error('Legg til ekstraskaden eller velg Nei.');
   if(data.get('hasExtra')==='yes')item.extraDamage=ids.map(id=>({id,expression:String(data.get('extraExpression-'+id)).trim(),damageType:String(data.get('extraType-'+id)),...(data.get('extraConditional-'+id)==='yes'?{condition:String(data.get('extraCondition-'+id)).trim()}: {})}));
   else if(source.extraDamage)item.extraDamage=[];
  }
  await ctx.save(characterSchema.parse({...c,items:existing?c.items.map(i=>i.id===item.id?item:i):[...c.items,item]}),'equipment',item.name+(existing?' tilpasset':' lagt til'));
 },existing?'Lagre':'Legg til');
 function bindRows(){
  d.querySelectorAll<HTMLSelectElement>('[name^="extraConditional-"]').forEach(input=>input.onchange=()=>{const id=input.name.slice('extraConditional-'.length),group=d.querySelector<HTMLElement>(`[data-extra-condition="${id}"]`)!;group.hidden=input.value!=='yes';group.querySelector('textarea')!.required=input.value==='yes';});
  d.querySelectorAll<HTMLButtonElement>('[data-remove-extra]').forEach(b=>b.onclick=()=>{const i=ids.indexOf(b.dataset.removeExtra!);if(i>=0)ids.splice(i,1);b.closest('[data-extra-row]')!.remove();});
 }
 d.querySelector<HTMLButtonElement>('#add-extra')!.onclick=()=>{const id=crypto.randomUUID();ids.push(id);d.querySelector('#extra-damage-rows')!.insertAdjacentHTML('beforeend',row(id));bindRows();};bindRows();
}
