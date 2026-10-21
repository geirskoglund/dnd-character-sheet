import {validField} from './text-editor';
import {z} from 'zod';
import {abilities,characterSchema,type Character} from '../domain/model';
import {equipmentCatalog,instantiateEquipment,type Item} from '../domain/catalog';
import {deriveWeapon,equipmentWarnings,weaponProfile} from '../domain/equipment';
import {copyEquipment,removeEquipment,setHand,weaponHand,handLabels,type ItemModifier} from '../domain/item-effects';
import {damageTypes,conditionNames} from '../domain/records';
import {skillAbilities} from '../domain/modifiers';
import {newWizardDraft,type WizardDraft,type DraftToken} from '../domain/wizard-draft';
import {viewDialog,confirmDialog,commitDialog,setDialogDismiss} from './dialog';
import {enhanceNumbers} from './number-wheel';
import {wizardArt,diceArt} from './wizard-art';
import {field,escapeHtml as esc} from './html';
import {activationLabels,effectCounter,extraDamageMarkup} from './equipment-markup';
import type {EditorContext} from './record-editors';
import {equipmentWizard as legacyWizard,equipmentDraftPayload as legacyPayload} from './legacy-equipment-wizard';
export {extraDamageMarkup} from './equipment-markup';
const itemSchema=characterSchema.shape.items.element,poolSchema=characterSchema.shape.resources.element;
type Pool=Character['resources'][number];
const pendingSchema=z.object({id:z.string(),kind:z.enum(['modifier','extra','protection','special','legacy']),target:z.string(),subject:z.string().optional(),operation:z.enum(['add','floor']).optional(),amount:z.union([z.number(),z.literal('')]).optional(),condition:z.string().optional(),conditional:z.boolean().optional(),die:z.string().optional(),count:z.union([z.number(),z.literal('')]).optional(),expression:z.string().optional(),damageType:z.string().optional(),protection:z.string().optional(),description:z.string().optional(),activation:z.enum(['action','bonus','reaction','passive','unknown']).optional(),limited:z.boolean().optional(),max:z.union([z.number(),z.literal('')]).optional(),recharge:z.string().optional()});
type Pending=z.infer<typeof pendingSchema>;
const workSchema=z.object({item:itemSchema,screen:z.string(),history:z.array(z.string()),pending:pendingSchema.optional(),question:z.string().optional(),trail:z.array(z.string()),pool:poolSchema.optional(),error:z.string().optional()});
type Work=z.infer<typeof workSchema>;
const newPayload=z.object({editorVersion:z.literal(2),source:itemSchema,existing:z.boolean(),expected:itemSchema.optional(),expectedPool:poolSchema.optional(),work:workSchema});
export const equipmentDraftPayload=z.union([newPayload,legacyPayload]);
const abilityNames={STR:'Strength',DEX:'Dexterity',CON:'Constitution',INT:'Intelligence',WIS:'Wisdom',CHA:'Charisma'};
const modifierChoices:[ItemModifier['target'],string][]=[['ac','AC'],['attack','Angrepsbonus'],['damage','Skadebonus'],['speed','Speed'],['initiative','Initiative'],['maxHp','Maks HP']];
const rechargeNames={shortRest:'Short rest',longRest:'Long rest',dawn:'Daggry',manual:'Manuelt'};
const uuid=()=>crypto.randomUUID();
export function equipmentWizard(ctx:EditorContext,initial:Item,editing=false){
 if(ctx.resumedDraft&&!newPayload.safeParse(ctx.resumedDraft.payload).success)return legacyWizard(ctx,initial,editing);
 const recovered=ctx.resumedDraft?newPayload.parse(ctx.resumedDraft.payload):undefined;
 const source=recovered?.source??structuredClone(initial),existing=recovered?.existing??editing,owner=ctx.current().id;
 const expected=recovered?.expected??(existing?structuredClone(ctx.current().items.find(i=>i.id===source.id)):undefined);
 const expectedPool=recovered?.expectedPool??structuredClone(ctx.current().resources.find(p=>p.id===source.specialEffect?.resourceId));
 let work:Work=recovered?.work??{item:structuredClone(source),screen:!existing&&source.category==='weapon'&&!weaponProfile(source)?'base':'name',history:[],trail:[],pool:structuredClone(expectedPool)};
 let entry:WizardDraft=ctx.resumedDraft??newWizardDraft({kind:'equipment',characterId:owner,editingId:existing?source.id:undefined,label:source.name||'Nytt utstyr',payload:{}});
 let writing:Promise<void>=Promise.resolve(),failure:unknown,writes=0;
 let d:HTMLDialogElement;
 const snapshot=()=>({...entry,label:(work.item.name||source.name||'Nytt utstyr').slice(0,100),step:work.screen,controls:[],payload:{editorVersion:2,source,existing,expected,expectedPool,work:structuredClone(work)}});
 const report=(error:unknown)=>{const alert=d?.querySelector<HTMLElement>('#dialog-error');if(alert)alert.textContent='Utkastet kunne ikke lagres. '+((error as Error).message||'Prøv igjen.');};
 const persist=()=>{if(!ctx.drafts)return writing;const value=snapshot();writes++;writing=writing.then(async()=>{entry=await ctx.drafts!.save({...value,revision:entry.revision});failure=undefined;}).catch(e=>{failure=e;report(e);}).finally(()=>writes--);return writing;};
 const flush=async():Promise<DraftToken|undefined>=>{if(!ctx.drafts)return;await persist();if(failure)throw failure;return {id:entry.id,revision:entry.revision};};
 const go=(screen:string)=>{work.history.push(work.screen);work.screen=screen;work.error='';void persist();draw();};
 const p=()=>work.pending!;
 const name=()=>work.item.name||source.name||'Gjenstand';
 const choices=(options:{label:string,value:string,hint?:string}[],action:string,selected?:string)=>`<div class="wizard-options">${options.map(o=>`<button type="button" data-eq="${action}" data-value="${esc(o.value)}" aria-label="${esc(o.label)}" aria-pressed="${o.value===selected}"><span>${esc(o.label)}</span>${o.hint?`<small>${esc(o.hint)}</small>`:''}</button>`).join('')}</div>`;
 const yesNo=(action:string,value?:boolean)=>choices([{label:'Ja',value:'yes'},{label:'Nei',value:'no'}],action,value===undefined?undefined:value?'yes':'no');
 const input=(label:string,key:string,value:unknown,type='text',extra='')=>field(label,key,String(value??''),`data-eq-field="${key}" type="${type}" ${extra}`);
 const text=(label:string,key:string,value:unknown,required=false)=>`<label>${esc(label)}<textarea name="${key}" data-eq-field="${key}" maxlength="10000" rows="4" ${required?'required':''}>${esc(value??'')}</textarea></label>`;
 const handOptions=()=>{const profile=weaponProfile(work.item);return profile?.properties.includes('two-handed')?['none','both']:profile?.twoHandedDice?['none','left','right','both']:['none','left','right'];};
 function frame(title:string,help:string,html:string,footer:string,art:'sword'|'equipment'|'note'|'magic'|'resource'='equipment'){
  const path=work.screen==='effect'?questionPath():['name','overview','use'],at=work.screen==='effect'?Math.max(0,path.indexOf(work.question!)):work.screen==='name'||work.screen==='base'?0:work.screen==='use'?2:1;
  d=viewDialog(existing?'Rediger gjenstanden':'Ny gjenstand',`<div class="wizard-intro"><div class="wizard-progress" role="progressbar" aria-label="Fremdrift" aria-valuemin="1" aria-valuemax="${path.length}" aria-valuenow="${at+1}">${path.map((_,i)=>`<span class="${i<at?'done':i===at?'current':''}"></span>`).join('')}</div>${wizardArt(art)}<h3 id="wizard-question" tabindex="-1">${esc(title)}</h3><p id="wizard-help">${esc(help)}</p></div>${work.error?`<p class="warning" role="alert">${esc(work.error)}</p>`:''}<div class="equipment-answer">${html}</div><button type="button" class="wizard-discard" data-eq="discard">Forkast utkast</button>`,undefined,'large');
  d.dataset.wizard='true';d.dataset.equipmentEditor=entry.id;d.classList.add('equipment-editor');
  const selected=d.querySelector<HTMLButtonElement>('.equipment-answer [data-eq][data-value][aria-pressed=true]');
  if(selected&&!footer.includes('data-eq="next"'))footer+='<button type="button" class="eq-primary" data-eq="continue">Neste</button>';
  d.querySelector('.dialog-actions')!.innerHTML=footer;d.querySelector('form')!.noValidate=true;
  d.querySelector('form')!.onsubmit=e=>{e.preventDefault();void act(d.querySelector<HTMLButtonElement>('.dialog-actions .eq-primary')?.dataset.eq||'save');};
  const close=()=>void commitDialog(async()=>{await flush();await ctx.draftChanged?.();});
  d.querySelector<HTMLButtonElement>('#close-dialog')!.setAttribute('aria-label','Lukk veiviseren');d.querySelector<HTMLButtonElement>('#close-dialog')!.onclick=close;setDialogDismiss(d,close);
  d.querySelectorAll<HTMLButtonElement>('[data-eq]').forEach(b=>b.onclick=()=>void act(b.dataset.eq!,b.dataset.value));
  d.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('[data-eq-field]').forEach(el=>el.addEventListener('input',()=>{updateNext();const value=el instanceof HTMLInputElement&&el.type==='number'?(el.value===''?'':Number(el.value)):el.value;assign(el.name,value);void persist();}));
  enhanceNumbers(d);updateNext();if(failure)report(failure);d.querySelector<HTMLElement>('#wizard-question')?.focus({preventScroll:true});
 }
 const back='<button type="button" data-eq="back">Tilbake</button>',save='<button type="button" data-eq="save">Lagre</button>';
 const next='<button type="button" class="eq-primary" data-eq="next">Neste</button>';
 function assign(key:string,value:string|number){if(key==='name')work.item.name=String(value);else if(key==='note')work.item.userNote=String(value);else if(key==='quantity')work.item.quantity=Number(value);else if(key==='manualAttack')work.item.attack=String(value);else if(key==='manualDamage')work.item.damageOverride=String(value);else if(key==='baseAc')work.item.armorProfile={kind:'custom',addDex:false,dexCap:null,strength:0,stealthDisadvantage:false,...work.item.armorProfile,baseAc:Number(value)};else (p() as Record<string,unknown>)[key]=value;}
 function updateNext(){const next=d.querySelector<HTMLButtonElement>('[data-eq=next]');if(next)next.disabled=[...d.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('[data-eq-field]')].some(el=>!validField(el));}
 function readVisible(){for(const el of d.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('[data-eq-field]')){if(!validField(el)){d.querySelector('#dialog-error')!.textContent='Fyll ut en gyldig verdi for å fortsette.';el.focus({preventScroll:true});return false;}assign(el.name,el instanceof HTMLInputElement&&el.type==='number'?Number(el.value):el.value.trim());}return true;}
 function label(e:Pending){if(e.kind==='extra')return `${e.expression||`${e.count??1}${e.die||'d4'}`} ${e.damageType||''}`;if(e.kind==='protection')return `${e.protection} · ${e.subject}`;if(e.kind==='special')return e.description||'Andre effekter';const title=e.target==='ability'?abilityNames[e.subject as keyof typeof abilityNames]:e.target==='skill'||e.target==='save'?e.subject:modifierChoices.find(([k])=>k===e.target)?.[1]||'Saving throws';return `${title}: ${e.operation==='floor'?'Minst ':Number(e.amount)>=0?'+':''}${e.amount??''}`;}
 function rows():Pending[]{const item=work.item;return [
  ...(item.modifiers??[]).map(m=>({...m,kind:'modifier' as const})),...(item.extraDamage??[]).map(e=>({...e,kind:'extra' as const,target:'extra'})),...(item.protections??[]).map(e=>({id:e.id,kind:'protection' as const,target:'protection',subject:e.subject,protection:e.kind,condition:e.condition})),
  ...Object.entries(item.bonuses??{}).filter(([,n])=>n!==undefined).map(([key,amount])=>({id:'legacy:'+key,kind:'legacy' as const,target:key,amount,operation:'add' as const})),
  ...item.specialEffect?[{...item.specialEffect,kind:'special' as const,target:'special',limited:!!item.specialEffect.resourceId,max:work.pool?.max,recharge:work.pool?.recharge.kind==='special'?'dawn':work.pool?.recharge.kind}]:[]];}
 function draw(){const item=work.item,profile=weaponProfile(item),foot=back+save;switch(work.screen){
 case 'base':frame('Hva er grunnvåpenet?','Velg grunnmodellen. Regelverdier og ikon følger med.',`<div class="choice-list">${equipmentCatalog.filter(i=>i.category==='weapon').map(i=>`<button type="button" data-eq="base" data-value="${i.catalogId}" aria-pressed="${work.item.definitionRef?.kind==='catalog'&&work.item.definitionRef.id===i.catalogId}">${esc(i.name)}</button>`).join('')}</div>`,save);break;
 case 'name':frame(item.category==='weapon'?'Hva heter våpenet?':'Hva heter gjenstanden?',source.name?'Grunnverdiene fra '+source.name+' følger med.':'Skriv navnet du vil føre på karakterarket.',input('Navn på utstyr','name',item.name,'text','required maxlength="100"'),save+next,item.category==='weapon'?'sword':'equipment');break;
 case 'overview':frame('Hva gjør gjenstanden?','Før bare det som gjelder. Du kan lagre uten ekstra virkninger.',`<div class="eq-effect-list">${rows().map(e=>`<button type="button" class="eq-effect-row" data-eq="edit-effect" data-value="${esc(e.id)}">${esc(label(e))}${e.condition?`<small>${esc(e.condition)}</small>`:''}</button>`).join('')}</div><button type="button" class="eq-add-effect" data-eq="matrix">+ Legg til virkning</button><div class="eq-secondary"><button type="button" class="eq-expand" data-eq="settings">Merknad og attunement</button>${item.category!=='weapon'?'<button type="button" data-eq="quantity">Antall</button>':''}</div>`,back+'<button type="button" class="eq-primary" data-eq="save">Lagre</button>');break;
 case 'matrix':frame('Hva påvirker den?','Velg virkningen. Du får bare spørsmål om det aktuelle området.',`<h4>Ability scores</h4>${choices(abilities.map(a=>({label:abilityNames[a],value:'ability:'+a})),'target')}<h4>Kamp og bevegelse</h4>${choices([...modifierChoices.map(([k,label])=>({label,value:k})),{label:'Ekstraskade',value:'extra'}],'target')}<h4>Ferdigheter og saves</h4>${choices([{label:'Skill',value:'skill'},{label:'Saving throw',value:'save'},{label:'Alle saving throws',value:'saves'}],'target')}<h4>Beskyttelse</h4>${choices(['resistance','immunity','vulnerability','conditionImmunity'].map(k=>({label:{resistance:'Resistance',immunity:'Immunity',vulnerability:'Vulnerability',conditionImmunity:'Tilstandsimmunitet'}[k]!,value:'protection:'+k})),'target')}<h4>Andre effekter</h4>${choices([{label:'+ Effekt',value:'special'}],'target')}`,foot);break;
 case 'settings':frame('Merknad og attunement','Valgfrie opplysninger om gjenstanden.',choices([{label:'Merknad',value:'note'},{label:'Krever attunement',value:'attunement'},...(item.category==='weapon'?[{label:'Manuelle totaler (DM)',value:'manual'}]:[]),...(item.category==='armor'&&!item.definitionRef?[{label:'Eget AC-grunnlag (DM)',value:'armor'}]:[])],'setting'),foot);break;
 case 'manual':frame('Hvilken total vil du overstyre?','Bare ved avtale med DM. Tom verdi bruker beregningen fra grunnvåpenet.',choices([{label:'Attack (manuell total)',value:'manualAttack'},{label:'Damage (manuell total)',value:'manualDamage'}],'setting'),foot);break;
 case 'manualAttack':case 'manualDamage':frame(work.screen==='manualAttack'?'Hva er den manuelle angrepstotalen?':'Hva er den manuelle skadetotalen?','Tom verdi bruker grunnvåpenets beregning. En oppgitt total erstatter den, inkludert andre bonuser.',input(work.screen==='manualAttack'?'Attack (manuell total)':'Damage (manuell total)',work.screen,work.screen==='manualAttack'?item.attack:item.damageOverride??(item.definitionRef?undefined:item.damage),'text','maxlength="1000"'),back+'<button type="button" class="eq-primary" data-eq="save">Lagre</button>');break;
 case 'armor':frame('Hva er rustningens AC-grunnlag?','Før grunnverdien dere har avtalt. Rustning fra katalogen trenger ikke dette.',input('AC-grunnverdi','baseAc',item.armorProfile?.baseAc??item.acContribution??10,'number','required min="0" max="100"'),back+next);break;
 case 'armorDex':frame('Skal Dexterity legges til?','Velg regelen dere har avtalt for denne egne rustningen.',choices([{label:'Nei',value:'none'},{label:'Ja, uten grense',value:'full'},{label:'Ja, høyst +2',value:'cap'}],'armor-dex',item.armorProfile?.addDex?item.armorProfile.dexCap===2?'cap':'full':'none'),foot);break;
 case 'note':frame('Hva vil du notere om gjenstanden?','Bakgrunnshistorie, opphav og utseende. Spillmessig tekst føres under Andre effekter.',text('Merknad','note',item.userNote),back+'<button type="button" class="eq-primary" data-eq="save">Lagre merknad</button>','note');break;
 case 'quantity':frame('Hvor mange har du?','Antall gjenstander. Våpen føres enkeltvis med Kopier.',input('Antall','quantity',item.quantity,'number','required min="0" max="999"'),back+'<button type="button" class="eq-primary" data-eq="save">Lagre antall</button>');break;
 case 'attunement':frame('Krever gjenstanden attunement?','Beskrivelsen eller DM avgjør om de magiske virkningene krever personlig tilknytning.',yesNo('attunement',item.requiresAttunement),foot);break;
 case 'use':frame('Vil du ta gjenstanden i bruk?',item.category==='weapon'?'Velg hånd. Svaret lagrer gjenstanden og lukker.':'Svaret lagrer gjenstanden og lukker.',item.category==='weapon'?choices(handOptions().map(k=>({label:handLabels[k as keyof typeof handLabels],value:k})),'use-hand',item.hand):yesNo('use',item.equipped),back,'equipment');break;
 case 'effect':drawQuestion();break;
 }}
 function begin(e:Pending){work.history.push(work.screen);work.screen='effect';work.trail=[];work.pending=structuredClone(e);work.question=first(e);work.error='';void persist();draw();}
 function first(e:Pending){return e.kind==='special'?'description':e.kind==='extra'?'die':e.kind==='protection'?'protection-type':e.target==='ability'?'operation':e.target==='save'?'save':e.target==='skill'?'skill':'amount';}
 function questionPath(){const e=p();return e.kind==='special'?['description','activation','limited',...(e.limited?['max','recharge']:[])]:e.kind==='extra'?['die',...(e.die==='custom'?['expression']:['count']),'damageType','conditional',...(e.conditional?['condition']:[])]:[first(e),...first(e)!=='amount'&&e.kind!=='protection'?['amount']:[],'conditional',...(e.conditional?['condition']:[])];}
 function qgo(q:string){work.trail.push(work.question!);work.question=q;work.error='';void persist();draw();}
 function drawQuestion(){const e=p();let title='',help='',html='',hasNext=false;
 switch(work.question){
 case 'operation':title=`Hvordan påvirkes ${abilityNames[e.subject as keyof typeof abilityNames]}?`;help='Velg et bidrag eller en minsteverdi. Grunnverdien beholdes.';html=choices([{label:'Øk eller reduser med',value:'add'},{label:'Hev til minst',value:'floor'}],'operation',e.operation);break;
 case 'amount':title=e.target==='damage'?'Hvor stor er skadebonusen?':e.operation==='floor'?`Hva skal ${abilityNames[e.subject as keyof typeof abilityNames]} minst være?`:'Hva er bidraget?';help=e.target==='attack'?'Legges til angrep med våpen. Et negativt tall reduserer bonusen.':e.target==='damage'?'Legges til våpenets skade. Et negativt tall reduserer skaden.':e.operation==='floor'?'En høyere verdi beholdes. Gjenstanden endrer ikke den lagrede grunnverdien.':`Legges til ${e.subject||modifierChoices.find(([k])=>k===e.target)?.[1]||'saving throws'}. Et negativt tall reduserer verdien.`;html=input(e.target==='damage'?'Skadebonus':'Verdi','amount',e.amount,'number',`required min="${e.operation==='floor'?1:-100}" max="999"`);hasNext=true;break;
 case 'skill':case 'save':title=work.question==='skill'?'Hvilken skill påvirkes?':'Hvilken saving throw påvirkes?';html=choices(work.question==='skill'?Object.keys(skillAbilities).map(k=>({value:k,label:k})):abilities.map(k=>({value:k,label:abilityNames[k]})),'subject',e.subject);break;
 case 'die':title='Hvilken terning gir ekstraskaden?';help='Velg terningen som kommer i tillegg til grunnskaden.';html=`<div class="wizard-options">${['d4','d6','d8','d10','d12','d20'].map(k=>`<button type="button" data-eq="die" data-value="${k}" aria-label="${k}" aria-pressed="${e.die===k}">${diceArt(k)}<span>${k}</span></button>`).join('')}<button type="button" data-eq="die" data-value="custom" aria-pressed="${e.die==='custom'}">Annet</button></div>`;break;
 case 'count':title=`Hvor mange ${e.die}?`;help='Antall terninger for denne ekstraskaden.';html=input('Antall terninger','count',e.count??1,'number','required min="1" max="100"');hasNext=true;break;
 case 'expression':title='Hva er skadeuttrykket?';help='Før uttrykket du og DM har avtalt for ekstraskaden.';html=input('Skadeuttrykk','expression',e.expression,'text','required maxlength="100"');hasNext=true;break;
 case 'damageType':title='Hvilken skadetype har ekstraskaden?';html=choices(damageTypes.map(k=>({label:k,value:k})),'damageType',e.damageType);break;
 case 'protection-type':title=e.protection==='conditionImmunity'?'Hvilken tilstand er du immun mot?':'Hvilken skadetype gjelder virkningen?';html=choices((e.protection==='conditionImmunity'?conditionNames:damageTypes).map(k=>({label:k,value:k})),'protection-type',e.subject);break;
 case 'conditional':title=e.kind==='extra'?'Gjelder ekstraskaden bare under en betingelse?':'Gjelder virkningen bare under en betingelse?';help='En betingelse beskriver når akkurat denne virkningen gjelder. Du og DM vurderer vilkåret ved bordet.';html=yesNo('conditional',e.conditional??(e.condition?true:rows().some(row=>row.id===e.id)?false:undefined));break;
 case 'condition':title='Når gjelder virkningen?';help='Teksten følger denne virkningen og tolkes ikke automatisk.';html=text('Betingelse','condition',e.condition,true);hasNext=true;break;
 case 'description':title='Hva gjør effekten?';help='Beskriv den spillmessige virkningen med egne ord. Ingen spellkobling kreves.';html=text('Effektbeskrivelse','description',e.description,true);hasNext=true;break;
 case 'activation':title='Hva kreves for å aktivere effekten?';help='Følg gjenstandens beskrivelse eller avklar med DM. Du kan velge Ikke avklart og endre senere.';html=choices(Object.entries(activationLabels).map(([value,label])=>({value,label})),'activation',e.activation);break;
 case 'limited':title='Har effekten et begrenset antall bruk?';html=yesNo('limited',e.limited);break;
 case 'max':title='Hvor mange bruk har effekten?';help=work.pool?'Brukt antall beholdes når maks endres.':'Tilgjengelig settes automatisk lik maks.';html=input('Maks antall bruk','max',e.max,'number','required min="1" max="999"');hasNext=true;break;
 case 'recharge':title='Når får du brukene tilbake?';html=choices(Object.entries(rechargeNames).map(([value,label])=>({value,label})),'recharge',e.recharge);break;
 }
 const cancel='<button type="button" data-eq="cancel-effect">Avbryt denne virkningen</button>';
 const remove=rows().some(r=>r.id===e.id)?'<button type="button" class="danger" data-eq="remove-effect">Fjern denne virkningen</button>':'';
 frame(title,help,html+`<div class="eq-secondary">${cancel}${remove}</div>`,back+save+(hasNext?next:''),e.kind==='extra'?'sword':e.kind==='special'?'magic':'equipment');
 }
 function missing(e:Pending):string|undefined{if(e.kind==='special'){if(!e.description?.trim())return 'description';if(e.limited){if(!Number.isInteger(e.max)||Number(e.max)<1)return 'max';if(!e.recharge)return 'recharge';}}else if(e.kind==='extra'){if(!e.die)return 'die';if(e.die==='custom'&&!e.expression)return 'expression';if(e.die!=='custom'&&(!Number.isInteger(e.count)||Number(e.count)<1))return 'count';if(!e.damageType)return 'damageType';}else if(e.kind==='protection'){if(!e.subject)return 'protection-type';}else{if(['save','skill'].includes(e.target)&&!e.subject)return e.target;if(!Number.isInteger(e.amount))return 'amount';}if(e.conditional&&!e.condition?.trim())return 'condition';}
 function applyPending(){if(!work.pending)return true;const e=p(),q=missing(e);if(q){work.screen='effect';work.question=q;work.error='Fullfør opplysningen nedenfor før du lagrer.';draw();return false;}
  const item=work.item,condition=e.conditional===false?undefined:e.condition?.trim()||undefined;
  if(e.kind==='special'){
   const effectId=item.specialEffect?.id??e.id;item.specialEffect={id:effectId,description:e.description!.trim(),activation:e.activation??'unknown'};
   if(e.limited){const old=work.pool,used=old?Math.max(0,old.max-old.current):0;work.pool={...old,id:old?.id??uuid(),ownerCharacterId:owner,kind:'custom',name:old&&old.name!==source.name?old.name:item.name,sourceRef:{kind:'item',id:item.id},max:Number(e.max),current:Math.max(0,Number(e.max)-used),recharge:e.recharge==='dawn'?{kind:'special',ruleText:'Daggry'}:{kind:e.recharge as 'shortRest'|'longRest'|'manual'}};item.specialEffect.resourceId=work.pool.id;if(!item.resourceRefs.includes(work.pool.id))item.resourceRefs.push(work.pool.id);}
   else{if(work.pool)item.resourceRefs=item.resourceRefs.filter(id=>id!==work.pool!.id);work.pool=undefined;}
  }else if(e.kind==='extra'){const row={id:e.id,expression:e.die==='custom'?e.expression!:String(e.count)+e.die,damageType:e.damageType!,...(condition?{condition}:{})};item.extraDamage=item.extraDamage?.some(x=>x.id===e.id)?item.extraDamage.map(x=>x.id===e.id?row:x):[...(item.extraDamage??[]),row];}
  else if(e.kind==='protection'){const row={id:e.id,kind:e.protection as NonNullable<Item['protections']>[number]['kind'],subject:e.subject!,...(condition?{condition}:{})};item.protections=item.protections?.some(x=>x.id===e.id)?item.protections.map(x=>x.id===e.id?row:x):[...(item.protections??[]),row];}
  else if(e.kind==='legacy'&&!condition){item.bonuses={...item.bonuses,[e.target]:Number(e.amount)};}
  else{if(e.kind==='legacy'){delete item.bonuses?.[e.target as keyof NonNullable<Item['bonuses']>];e.id=uuid();}const row:ItemModifier={id:e.id,target:e.target as ItemModifier['target'],operation:e.operation??'add',amount:Number(e.amount),...(e.subject?{subject:e.subject}:{}),...(condition?{condition}:{})};item.modifiers=item.modifiers?.some(x=>x.id===e.id)?item.modifiers.map(x=>x.id===e.id?row:x):[...(item.modifiers??[]),row];}
  work.pending=undefined;work.question=undefined;if(work.screen==='effect')work.screen='overview';return true;
 }
 function finishEffect(){if(!applyPending())return;work.screen='overview';void persist();draw();}
 function result(){const current=ctx.current();if(current.id!==owner)throw Error('Åpne utkastet fra riktig karakter.');if(existing&&JSON.stringify(current.items.find(i=>i.id===source.id))!==JSON.stringify(expected))throw Error('Gjenstanden er endret eller fjernet i en annen fane. Utkastet er beholdt.');if(JSON.stringify(current.resources.find(p=>p.id===expectedPool?.id))!==JSON.stringify(expectedPool))throw Error('Brukstelleren er endret siden redigeringen ble startet. Åpne gjenstanden på nytt.');
  let c=structuredClone(current);const item=structuredClone(work.item);if(item.category==='weapon'&&item.quantity>1)item.quantity=1;
  c.items=existing?c.items.map(i=>i.id===item.id?item:i):[...c.items,item];
  if(expectedPool&&!work.pool){const shared=[...c.items.filter(i=>i.id!==item.id),...c.features,...c.actions].some(i=>i.resourceRefs.includes(expectedPool.id));if(!shared)c.resources=c.resources.filter(p=>p.id!==expectedPool.id);}
  if(work.pool){const pool={...work.pool,name:work.pool.name===source.name?item.name:work.pool.name};c.resources=c.resources.some(p=>p.id===pool.id)?c.resources.map(p=>p.id===pool.id?pool:p):[...c.resources,pool];}
  if(existing&&source.category==='weapon'&&source.quantity>1)for(let n=1;n<source.quantity;n++)c=copyEquipment(c,item.id);
  return characterSchema.parse(c);
 }
 async function commit(){await commitDialog(async()=>{const c=result(),token=await flush();await ctx.save(c,'equipment',name()+(existing?' redigert':' lagt til'),token);});}
 function trySave(){if(!readVisible()||!applyPending())return;if(!work.item.name.trim()){work.screen='name';work.error='Skriv navnet på gjenstanden.';draw();return;}if(!existing&&work.item.category==='armor'&&!work.item.armorProfile&&!work.item.definitionRef){go('armor');return;}if(!existing&&work.item.category==='weapon'&&!weaponProfile(work.item)&&!work.item.attack&&!work.item.damageOverride){work.screen='base';draw();return;}if(!work.item.equipped||work.item.hand==='none'){go('use');return;}void commit();}
 async function act(action:string,value?:string){work.error='';
  if(action==='continue'){const selected=d.querySelector<HTMLButtonElement>('.equipment-answer [data-eq][data-value][aria-pressed=true]');if(selected)await act(selected.dataset.eq!,selected.dataset.value);return;}
  switch(action){
 case 'base':{const base=instantiateEquipment(value!,false);work.item={...base,id:work.item.id,name:work.item.name||base.name};work.screen='name';draw();break;}
 case 'next':if(!readVisible())return;if(work.screen==='name')go('overview');else if(work.screen==='armor')go('armorDex');else{const e=p(),q=work.question!;if(q==='amount')qgo('conditional');else if(q==='count'||q==='expression')qgo('damageType');else if(q==='condition')finishEffect();else if(q==='description')qgo('activation');else if(q==='max')qgo('recharge');}break;
 case 'back':if(work.screen==='effect'&&work.trail.length)work.question=work.trail.pop();else work.screen=work.history.pop()||'overview';draw();break;
 case 'matrix':go('matrix');break;
 case 'settings':go('settings');break;
 case 'quantity':go('quantity');break;
 case 'setting':go(value!);break;
 case 'armor-dex':if(work.item.armorProfile){work.item.armorProfile.addDex=value!=='none';work.item.armorProfile.dexCap=value==='cap'?2:null;}work.screen='overview';draw();break;
 case 'attunement':work.item.requiresAttunement=value==='yes';if(!work.item.requiresAttunement&&work.item.attuned!==undefined)work.item.attuned=false;work.screen='overview';draw();break;
 case 'target':{const [kind,subject]=value!.split(':');if(kind==='special'){const old=rows().find(e=>e.kind==='special');begin(old??{id:uuid(),kind:'special',target:'special',activation:'unknown'});}else if(kind==='extra')begin({id:uuid(),kind:'extra',target:'extra'});else if(kind==='protection')begin({id:uuid(),kind:'protection',target:kind,protection:subject});else begin({id:uuid(),kind:'modifier',target:kind,subject,operation:'add'});break;}
 case 'edit-effect':{const e=rows().find(e=>e.id===value)!;if(e.kind==='extra'){const match=/^(\d+)(d(?:4|6|8|10|12|20))$/i.exec(e.expression!);e.die=match?match[2]:'custom';e.count=match?Number(match[1]):1;}begin(e);break;}
 case 'operation':p().operation=value as 'add'|'floor';qgo('amount');break;
 case 'subject':p().subject=value;qgo('amount');break;
 case 'die':p().die=value;p().count??=1;qgo(value==='custom'?'expression':'count');break;
 case 'damageType':p().damageType=value;qgo('conditional');break;
 case 'protection-type':p().subject=value;qgo('conditional');break;
 case 'conditional':p().conditional=value==='yes';if(p().conditional)qgo('condition');else{delete p().condition;finishEffect();}break;
 case 'activation':p().activation=value as Pending['activation'];qgo('limited');break;
 case 'limited':p().limited=value==='yes';if(p().limited)qgo('max');else finishEffect();break;
 case 'recharge':p().recharge=value;finishEffect();break;
 case 'cancel-effect':work.pending=undefined;work.question=undefined;work.screen='overview';draw();break;
 case 'remove-effect':{const e=p();if(e.kind==='legacy')delete work.item.bonuses?.[e.target as keyof NonNullable<Item['bonuses']>];else if(e.kind==='special'){delete work.item.specialEffect;if(work.pool)work.item.resourceRefs=work.item.resourceRefs.filter(id=>id!==work.pool!.id);work.pool=undefined;}else if(e.kind==='extra')work.item.extraDamage=work.item.extraDamage?.filter(x=>x.id!==e.id);else if(e.kind==='protection')work.item.protections=work.item.protections?.filter(x=>x.id!==e.id);else work.item.modifiers=work.item.modifiers?.filter(x=>x.id!==e.id);work.pending=undefined;work.screen='overview';draw();break;}
 case 'save':trySave();return;
 case 'use-hand':setHand(work.item,value as NonNullable<Item['hand']>);{const warnings=equipmentWarnings({...ctx.current(),items:ctx.current().items.filter(i=>i.id!==work.item.id).concat(work.item)}).filter(s=>/hånd|hender/.test(s));if(warnings.length){confirmDialog('Kontroller håndbruken',warnings.map(w=>`<p>${esc(w)}</p>`).join(''),async()=>{await ctx.save(result(),'equipment',name()+' lagret med DM-unntak',await flush());},'Behold og lagre');return;}}await commit();return;
 case 'use':work.item.equipped=value==='yes';await commit();return;
 case 'discard':confirmDialog('Forkast utkastet?','<p>Lagrede gjenstander beholdes.</p>',async()=>{await writing;if(entry.revision)await ctx.drafts?.remove({id:entry.id,revision:entry.revision});await ctx.draftChanged?.();},'Forkast utkast');return;
 }void persist();}
 const unloading=(event:BeforeUnloadEvent)=>{if(writes||failure){event.preventDefault();event.returnValue='';}};window.addEventListener('beforeunload',unloading);
 draw();d!.addEventListener('close',()=>window.removeEventListener('beforeunload',unloading),{once:true});return d!;
}

/** Read/quick-use surface. Full editing always enters the same guided workspace. */
export function inspectEquipment(ctx:EditorContext,id:string){
 const c=ctx.current(),item=c.items.find(i=>i.id===id);if(!item)return;
 const weapon=item.category==='weapon',profile=weaponProfile(item),stats=weapon?deriveWeapon(c,item):undefined,hand=weaponHand(c,item);
 const hands=profile?.properties.includes('two-handed')?['none','both']:profile?.twoHandedDice?['none','left','right','both']:['none','left','right'];if(!hands.includes(hand))hands.push(hand);
 const modifiers=(item.modifiers??[]).filter(m=>!weapon||m.target!=='damage').map(m=>`<p>${esc(m.target==='ability'?abilityNames[m.subject as keyof typeof abilityNames]:m.subject||modifierChoices.find(([k])=>k===m.target)?.[1]||'Saving throws')}: <strong>${m.operation==='floor'?'Minst ':m.amount>=0?'+':''}${m.amount}</strong>${m.condition?' · '+esc(m.condition):''}</p>`).join('');
 const protections=(item.protections??[]).map(p=>`<p>${esc(p.kind==='conditionImmunity'?'Tilstandsimmunitet':p.kind)} · ${esc(p.subject)}${p.condition?' · '+esc(p.condition):''}</p>`).join('');
 const d=viewDialog(item.name,`${weapon?`<div class="eq-hands" role="group" aria-label="Håndbruk">${hands.map(h=>`<button type="button" data-hand="${h}" aria-pressed="${h===hand}">${handLabels[h as keyof typeof handLabels]}</button>`).join('')}</div>`:`<label class="check"><input type="checkbox" name="equipped" ${item.equipped?'checked':''}>I bruk</label>`}${item.requiresAttunement?`<label class="check"><input type="checkbox" name="attuned" ${item.attuned?'checked':''}>Attuned</label>`:''}
 ${profile?.thrownRange?`<div class="eq-hands" role="group" aria-label="Angrepsmåte"><button type="button" data-mode="melee" aria-pressed="${item.attackMode!=='thrown'}">Melee</button><button type="button" data-mode="thrown" aria-pressed="${item.attackMode==='thrown'}">Thrown</button></div>`:''}
 ${stats?`<div class="weapon-values"><strong>Angrep: ${esc(stats.attack)}</strong><strong>Skade: ${esc(stats.damage)}</strong></div>${extraDamageMarkup(item)}`:''}${modifiers}${protections}
 ${item.specialEffect?`<section><h3>Andre effekter</h3><p class="rule-text">${esc(item.specialEffect.description)}</p><small>${activationLabels[item.specialEffect.activation]}</small>${effectCounter(c,item)}</section>`:''}
 ${item.userNote?`<section><h3>Merknad om gjenstanden</h3><p class="rule-text">${esc(item.userNote)}</p></section>`:''}
 <details><summary>Beregningsgrunnlag</summary>${stats?`<ul>${stats.explanation.map(e=>`<li>${esc(e)}</li>`).join('')}</ul>${stats.notes.map(n=>`<p>${esc(n)}</p>`).join('')}`:''}${item.notes?`<p class="rule-text">${esc(item.notes)}</p>`:''}${item.armorProfile?`<p>AC ${item.armorProfile.baseAc}${item.armorProfile.addDex?' + DEX':''}</p>`:''}${equipmentWarnings(c).map(w=>`<p class="warning">${esc(w)}</p>`).join('')}</details>
 <div class="eq-secondary"><button type="button" id="edit-equipment" class="eq-expand">Rediger gjenstanden</button><button type="button" id="copy-equipment">Kopier</button></div><div class="eq-destructive"><button type="button" id="remove-equipment" class="danger">Fjern fra utstyrslisten</button></div>`,undefined,'large');
 const quick=async(next:Character,description:string)=>{if(await commitDialog(()=>ctx.save(characterSchema.parse(next),'equipment',description),false))inspectEquipment(ctx,id);};
 d.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach(el=>el.onchange=()=>{const next=structuredClone(ctx.current()),target=next.items.find(i=>i.id===id)!;target[el.name as 'equipped'|'attuned']=el.checked;void quick(next,item.name+' oppdatert');});
 d.querySelectorAll<HTMLButtonElement>('[data-hand]').forEach(b=>b.onclick=()=>{const next=structuredClone(ctx.current()),target=next.items.find(i=>i.id===id)!;setHand(target,b.dataset.hand as NonNullable<Item['hand']>);const warnings=equipmentWarnings(next).filter(w=>/hånd|hender/.test(w));if(warnings.length){confirmDialog('Kontroller håndbruken',warnings.map(w=>`<p>${esc(w)}</p>`).join(''),()=>ctx.save(next,'equipment',item.name+' håndbruk med DM-unntak'),'Behold oppsett');}else void quick(next,item.name+' håndbruk');});
 d.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(b=>b.onclick=()=>{const next=structuredClone(ctx.current());next.items.find(i=>i.id===id)!.attackMode=b.dataset.mode as 'melee'|'thrown';void quick(next,item.name+' angrepsmåte');});
 d.querySelector<HTMLButtonElement>('#edit-equipment')!.onclick=()=>equipmentWizard(ctx,ctx.current().items.find(i=>i.id===id)!,true);
 d.querySelector<HTMLButtonElement>('#copy-equipment')!.onclick=()=>void commitDialog(()=>ctx.save(characterSchema.parse(copyEquipment(ctx.current(),id)),'equipment',item.name+' kopiert'));
 d.querySelector<HTMLButtonElement>('#remove-equipment')!.onclick=()=>confirmDialog('Fjern fra utstyrslisten?',`<p>Fjerne «${esc(item.name)}»? For å legge den bort, velg Ikke i bruk. Fjerning kan angres fra menyen.</p>`,()=>ctx.save(removeEquipment(ctx.current(),id),'equipment',item.name+' fjernet'),'Fjern');
 d.querySelectorAll<HTMLButtonElement>('[data-item-counter]').forEach(b=>b.onclick=()=>{const next=structuredClone(ctx.current()),pool=next.resources.find(p=>p.id===b.dataset.pool)!;pool.current=Math.max(0,Math.min(pool.max,pool.current+Number(b.dataset.delta)));void quick(next,pool.name+' bruk endret');});
 return d;
}
