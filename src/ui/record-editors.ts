import { abilities, characterSchema, type Character } from '../domain/model';
import { materializeLanguages, normalizeSkill, removeRecord, damageTypes, conditionNames, restCharacter, useHitDie, type RecordCollection } from '../domain/records';
import { skillAbilities } from '../domain/modifiers';
import { editDialog, confirmDialog } from './dialog';
import { field, select, esc, textArea, check, numberField, options, economies, rechargeOptions, defenseOptions, conditionFields, readCondition, str, num, optionalNumber, optionalString, readRefs } from './record-fields';

export interface EditorContext { current: () => Character; save: (draft: Character, type: string, description: string) => Promise<void> }
const requiredName = (value: string) => field('Navn', 'name', value, 'required maxlength="100"');
const uid = () => crypto.randomUUID();
const typeLabel = {features:'egenskap', languages:'språk', proficiencies:'proficiency', damageDefenses:'skadeegenskap', conditionImmunities:'tilstandsimmunitet', spells:'spell', resources:'ressurs', actions:'handling', effects:'effekt'};
const classOptions = (c: Character) => [{value:'',label:'Ingen bestemt klasse'}, ...c.classes.map(row => ({value:row.id,label:row.name}))];
function refs(label: string, name: string, rows: {id:string;name:string}[], selected: string[]) {
  return rows.length ? `<fieldset><legend>${esc(label)}</legend>${rows.map(row => check(row.name, name, selected.includes(row.id)).replace(`name="${name}"`, `name="${name}" value="${row.id}"`)).join('')}</fieldset>` : '';
}
/** Bind subordinate fields to their opt-in toggle; hidden inputs cannot accidentally validate or save. */
function bindOptional(d: HTMLDialogElement) {
  d.querySelectorAll<HTMLInputElement>('[data-toggle]').forEach(toggle => {
    const group = d.querySelector<HTMLFieldSetElement>(`[data-fields="${toggle.dataset.toggle}"]`)!;
    const update = () => { group.hidden = !toggle.checked; group.disabled = !toggle.checked; };
    toggle.onchange = update; update();
  });
}
export function createRecordEditors(ctx: EditorContext) {
  const save = (c: Character, type: string, description: string) => ctx.save(characterSchema.parse(c), type, description);
  function editor<K extends RecordCollection>(collection: K, source: Character[K][number], existing: boolean, title: string, html: string,
    read: (data: FormData, draft: Character) => Character[K][number], character = ctx.current(), operation?: () => {type:string;description:string}) {
    const d = editDialog(title, html + (existing ? `<button type="button" id="delete-record" class="danger">Fjern ${typeLabel[collection]}</button>` : ''), async form => {
      const draft = structuredClone(character), row = read(new FormData(form), draft);
      if (collection==='languages' && existing && 'name' in row && 'name' in source && row.name===source.name) return;
      draft[collection] = (existing ? draft[collection].map(item => item.id === source.id ? row : item) : [...draft[collection],row]) as never;
      const event=operation?.() ?? {type:collection,description:`${typeLabel[collection]} ${existing ? 'redigert' : 'lagt til'}`};
      await save(draft,event.type,event.description);
    });
    const remove = d.querySelector<HTMLButtonElement>('#delete-record');
    if (remove) remove.onclick = () => confirmDialog(`Fjern ${typeLabel[collection]}?`, '<p>Endringen kan angres fra menyen.</p>', () => save(removeRecord(character, collection, source.id), collection, `${typeLabel[collection]} fjernet`), 'Fjern');
    return d;
  }
  function language(id?: string) {
    const c = materializeLanguages(ctx.current());
    // Base-language keys use their original index so the initial materialization can assign stable UUIDs.
    const name = id?.startsWith('base:') ? ctx.current().species.languages[Number(id.slice(5))] : undefined;
    const source = c.languages.find(row => row.id === id || (name !== undefined && row.name.toLowerCase() === name.toLowerCase())) ?? {id:uid(),name:''};
    editor('languages', source, !!id, id ? 'Rediger språk' : 'Nytt språk', requiredName(source.name), data => ({...source,name:str(data,'name')}), c);
  }
  function proficiency(id?: string) {
    const c = ctx.current();
    const skill = id?.startsWith('skill:') ? c.skills.find(row => normalizeSkill(row.skillId) === normalizeSkill(id.slice(6))) : undefined;
    const saving = id?.startsWith('save:') ? c.saves.find(row => row.abilityId === id.slice(5)) : undefined;
    const source = c.proficiencies.find(row => row.id === id);
    const category = skill ? 'skill' : saving ? 'save' : source?.category ?? 'skill';
    const levels = [{value:'none',label:'Ingen proficiency'}, {value:'proficient',label:'Proficient'}, {value:'expertise',label:'Expertise'}];
    const d = editDialog(id ? 'Rediger proficiency' : 'Ny proficiency',
      select('Type', 'category', category, [{value:'skill',label:'Skill'}, {value:'save',label:'Saving throw'}, {value:'weapon',label:'Våpen'}, {value:'armor',label:'Rustning'}, {value:'tool',label:'Verktøy'}, {value:'other',label:'Annet'}], id ? 'disabled' : '') +
      `<div data-proficiency-skill>${select('Skill', 'skill', skill?.skillId ? Object.keys(skillAbilities).find(name => normalizeSkill(name) === normalizeSkill(skill.skillId))! : 'Acrobatics', options(Object.keys(skillAbilities)), skill ? 'disabled' : '')}</div>` +
      `<div data-proficiency-save>${select('Ability', 'ability', saving?.abilityId ?? 'STR', options(abilities), saving ? 'disabled' : '')}</div>` +
      `<div data-proficiency-name>${requiredName(source?.name ?? '')}</div>` +
      select('Proficiency', 'proficiency', skill?.proficiencyLevel ?? saving?.proficiencyLevel ?? source?.level ?? 'proficient', levels) +
      `<div data-proficiency-override>${numberField('Manuell total modifier (valgfritt)', 'override', skill?.override ?? saving?.override ?? '', 'min="-100" max="100"')}</div>` +
      (id ? '<button type="button" id="delete-proficiency" class="danger">Fjern proficiency</button>' : ''), async form => {
        const data = new FormData(form), draft = structuredClone(c);
        const kind = id ? category : str(data,'category');
        const level = str(data,'proficiency') as 'none'|'proficient'|'expertise';
        if (kind === 'skill') {
          const key = skill?.skillId ?? str(data,'skill');
          const row = {skillId:key,proficiencyLevel:level,override:optionalNumber(data,'override')};
          draft.skills = draft.skills.some(old=>normalizeSkill(old.skillId)===normalizeSkill(key)) ? draft.skills.map(old=>normalizeSkill(old.skillId)===normalizeSkill(key)?row:old) : [...draft.skills,row];
        } else if (kind === 'save') {
          const key = saving?.abilityId ?? str(data,'ability') as typeof abilities[number];
          const row={abilityId:key,proficiencyLevel:level,override:optionalNumber(data,'override')};
          draft.saves = draft.saves.some(old=>old.abilityId===key) ? draft.saves.map(old=>old.abilityId===key?row:old) : [...draft.saves,row];
        } else {
          const row = {id:source?.id ?? uid(),category:kind as 'weapon'|'armor'|'tool'|'other',name:str(data,'name'),level};
          draft.proficiencies = source ? draft.proficiencies.map(old => old.id === source.id ? row : old) : [...draft.proficiencies,row];
        }
        await save(draft, 'proficiency', 'Proficiency oppdatert');
      });
    const type = d.querySelector<HTMLSelectElement>('[name="category"]')!;
    const show = () => {
      const kind = type.value;
      for (const group of ['skill','save','name','override']) {
        const element = d.querySelector<HTMLElement>(`[data-proficiency-${group}]`)!;
        element.hidden = group === 'override' ? !['skill','save'].includes(kind) : group === 'name' ? ['skill','save'].includes(kind) : group !== kind;
        element.querySelectorAll<HTMLInputElement|HTMLSelectElement>('input,select').forEach(input => input.disabled = element.hidden || (group === 'skill' && !!skill) || (group === 'save' && !!saving));
      }
    }; type.onchange = show; show();
    const remove = d.querySelector<HTMLButtonElement>('#delete-proficiency');
    if (remove) remove.onclick = () => confirmDialog('Fjern proficiency?', '<p>Den beregnede modifieren oppdateres også.</p>', async () => {
      const draft = structuredClone(c);
      if (skill) draft.skills = draft.skills.filter(row => row !== undefined && normalizeSkill(row.skillId) !== normalizeSkill(skill.skillId));
      else if (saving) draft.saves = draft.saves.filter(row => row.abilityId !== saving.abilityId);
      else draft.proficiencies = draft.proficiencies.filter(row => row.id !== id);
      await save(draft,'proficiency','Proficiency fjernet');
    }, 'Fjern');
  }
  function defense(id?: string) {
    const source = ctx.current().damageDefenses.find(row => row.id === id) ?? {id:uid(),damageType:'Fire',kind:'resistance' as const};
    editor('damageDefenses',source,!!id,id ? 'Rediger skadeegenskap' : 'Ny skadeegenskap',
      field('Skadetype', 'damageType', source.damageType, 'required list="damage-types"') + `<datalist id="damage-types">${damageTypes.map(name => `<option>${name}</option>`).join('')}</datalist>` + select('Egenskap', 'kind', source.kind, defenseOptions) + conditionFields(source.condition),
      data => ({...source,damageType:str(data,'damageType'),kind:str(data,'kind') as typeof source.kind,condition:readCondition(data)}));
  }
  function immunity(id?: string) {
    const source = ctx.current().conditionImmunities.find(row => row.id === id) ?? {id:uid(),conditionId:''};
    editor('conditionImmunities',source,!!id,id ? 'Rediger tilstandsimmunitet' : 'Ny tilstandsimmunitet',
      field('Tilstand', 'conditionId', source.conditionId, 'required list="condition-names"') + `<datalist id="condition-names">${conditionNames.map(name => `<option>${name}</option>`).join('')}</datalist>`,
      data => ({...source,conditionId:str(data,'conditionId')}));
  }
  function feature(id?: string, category: Character['features'][number]['category'] = 'feat') {
    const c = ctx.current();
    const source = c.features.find(row => row.id === id) ?? {id:uid(),name:'',category,description:'',actionRefs:[],resourceRefs:[],effectRefs:[]};
    const owned = <K extends 'actions'|'resources'|'effects'>(collection: K) => c[collection].find(row => row.sourceRef?.kind === 'feature' && row.sourceRef.id === source.id && (collection==='actions'?source.actionRefs:collection==='resources'?source.resourceRefs:source.effectRefs).includes(row.id)) as Character[K][number] | undefined;
    const action = owned('actions'), pool = owned('resources'), effect = owned('effects');
    const linkedPools = c.resources.filter(row => row.id !== pool?.id);
    const d = editor('features',source,!!id,id ? 'Rediger egenskap' : 'Ny egenskap / feat',
      requiredName(source.name) + select('Kategori','category',source.category,[{value:'feat',label:'Feat'}, {value:'class',label:'Klasseegenskap'}, {value:'species',label:'Artsegenskap'}, {value:'custom',label:'Egen egenskap'}, {value:'item',label:'Utstyrsegenskap'}]) + textArea('Beskrivelse','description',source.description) +
      `<details ${action ? 'open' : ''}><summary>Handling</summary>${check('Har egen handling','hasAction',!!action).replace('name="hasAction"','name="hasAction" data-toggle="action"')}<fieldset data-fields="action"><legend>Handlingsoppslag</legend>${select('Action economy','economy',action?.actionEconomy ?? 'bonus',economies)}${field('Angrepskast (valgfritt)','attack',action?.attackRoll ?? '')}${field('Skade / terninguttrykk (valgfritt)','damage',action?.damageRolls.join('; ') ?? '')}${numberField('Save DC (valgfritt)','saveDC',action?.saveDC ?? '', 'min="0"')}${field('Rekkevidde (valgfritt)','actionRange',action?.range ?? '')}${textArea('Krav (valgfritt)','requirements',action?.requirements ?? '',2)}</fieldset></details>` +
      `<details ${pool || source.resourceRefs.length ? 'open' : ''}><summary>Begrenset ressurs</summary>${check('Har egen ressurs','hasPool',!!pool).replace('name="hasPool"','name="hasPool" data-toggle="pool"')}<fieldset data-fields="pool"><legend>Egen ressurs</legend><div class="form-grid">${numberField('Tilgjengelig','poolCurrent',pool?.current ?? 1,'min="0" required')}${numberField('Maks','poolMax',pool?.max ?? 1,'min="0" required')}</div>${select('Gjenopprettes ved','poolRecharge',pool?.recharge.kind ?? 'shortRest',rechargeOptions)}${textArea('Særregel (valgfritt)','poolRule',pool?.recharge.ruleText ?? '',2)}</fieldset>${refs('Knytt til eksisterende ressurser','resourceRefs',linkedPools,source.resourceRefs)}</details>` +
      `<details ${effect ? 'open' : ''}><summary>Passiv skadeeffekt</summary>${check('Har egen skadeeffekt','hasEffect',!!effect).replace('name="hasEffect"','name="hasEffect" data-toggle="effect"')}<fieldset data-fields="effect"><legend>Strukturert effekt</legend>${select('Effekt','operation',effect?.operation ?? 'flatReduction',[{value:'flatReduction',label:'Flat skadereduksjon'},...defenseOptions,{value:'manual',label:'Manuell effekt'}])}${numberField('Beløp (ved flat reduksjon)','amount',effect?.amount ?? 0,'min="0"')}${field('Skadetyper (kommadelt)','damageTypes',effect?.damageTypes.join(', ') ?? '')}${select('Omfang','scope',effect?.scope ?? 'component',[{value:'component',label:'Per skadepost'}, {value:'event',label:'Hele skadehendelsen'}])}${conditionFields(effect?.condition)}</fieldset></details>`,
      (data,draft) => {
        const row = {...source,name:str(data,'name'),category:str(data,'category') as typeof source.category,description:str(data,'description')};
        const sourceRef = {kind:'feature' as const,id:source.id};
        // Only our owned row is replaced; arbitrary imported/shared child records are retained.
        const replace = <K extends 'actions'|'resources'|'effects'>(collection: K, old: Character[K][number]|undefined, value?: Character[K][number]) => {
          const shared=old && [...draft.features.filter(owner=>owner.id!==source.id),...draft.items].some(owner=>owner.resourceRefs.includes(old.id) || owner.effectRefs.includes(old.id) || ('actionRefs' in owner && owner.actionRefs.includes(old.id)));
          draft[collection] = (old ? draft[collection].flatMap(child=>child.id!==old.id ? [child] : value ? [value] : shared ? [child] : []) : [...draft[collection],...(value ? [value] : [])]) as never;
        };
        const newPool = data.has('hasPool') ? {...pool,id:pool?.id ?? uid(),ownerCharacterId:c.id,name:row.name,current:num(data,'poolCurrent'),max:num(data,'poolMax'),kind:'custom' as const,sourceRef,recharge:{kind:str(data,'poolRecharge') as 'shortRest',ruleText:optionalString(data,'poolRule')}} : undefined;
        replace('resources',pool,newPool);
        row.resourceRefs = [...readRefs(data,'resourceRefs'),...(newPool ? [newPool.id] : [])];
        const newAction = data.has('hasAction') ? {...action,id:action?.id ?? uid(),name:row.name,sourceRef,actionEconomy:str(data,'economy') as 'action',summary:row.description,detail:row.description,attackRoll:optionalString(data,'attack'),damageRolls:str(data,'damage').split(';').map(s=>s.trim()).filter(Boolean),saveDC:optionalNumber(data,'saveDC'),range:optionalString(data,'actionRange'),requirements:optionalString(data,'requirements'),resourceRefs:[...row.resourceRefs]} : undefined;
        replace('actions',action,newAction);
        row.actionRefs = [...source.actionRefs.filter(ref=>ref!==action?.id),...(newAction ? [newAction.id] : [])];
        const newEffect = data.has('hasEffect') ? {...effect,id:effect?.id ?? uid(),sourceRef,target:'damage' as const,operation:str(data,'operation') as 'flatReduction',amount:num(data,'amount'),damageTypes:str(data,'damageTypes').split(',').map(s=>s.trim()).filter(Boolean),scope:str(data,'scope') as 'component',condition:readCondition(data),description:row.description} : undefined;
        replace('effects',effect,newEffect);
        row.effectRefs = [...source.effectRefs.filter(ref=>ref!==effect?.id),...(newEffect ? [newEffect.id] : [])];
        // Detach the removed private pool from any other references without removing shared pools.
        if (pool && !newPool) {
          for (const owner of [...draft.features,...draft.items,...draft.actions]) owner.resourceRefs = owner.resourceRefs.filter(ref=>ref!==pool.id);
        }
        return row;
      });
    bindOptional(d);
  }
  function spell(id?: string, cantrip = false) {
    const c = ctx.current(), source = c.spells.find(row => row.id === id) ?? {id:uid(),name:'',spellLevel:cantrip ? 0 : 1,castingTime:'1 action',actionEconomy:'action' as const,range:'',duration:'',concentration:false,ritual:false,components:[],description:'',known:true,inSpellbook:false,prepared:false};
    editor('spells',source,!!id,id ? 'Rediger spell' : cantrip ? 'Ny cantrip' : 'Ny spell',
      requiredName(source.name) + numberField('Spell level (0 = cantrip)','spellLevel',source.spellLevel,'min="0" max="9" required') + select('Knyttet til klasse','casterClass',source.casterClassRef ?? '',classOptions(c)) +
      `<div class="form-grid">${field('Casting time','castingTime',source.castingTime)}${select('Action economy','economy',source.actionEconomy,economies)}${field('Range','range',source.range)}${field('Duration','duration',source.duration)}</div>` +
      check('Concentration','concentration',source.concentration) + check('Ritual','ritual',source.ritual) + field('Components (kommadelt)','components',source.components.join(', ')) +
      `<div class="form-grid">${check('Known','known',source.known)}${check('I spellbook','inSpellbook',source.inSpellbook)}${check('Prepared','prepared',source.prepared)}</div>` +
      field('Slot-system (f.eks. Spellcasting / Pact Magic)','system',source.resourceSystemRef ?? '') + field('Attack (valgfritt)','attack',source.attack ?? '') + field('Save (valgfritt)','save',source.save ?? '') + field('Damage (valgfritt)','damage',source.damage ?? '') + textArea('Beskrivelse og upcasting','description',source.description,6),
      data => ({...source,name:str(data,'name'),spellLevel:num(data,'spellLevel'),castingTime:str(data,'castingTime'),actionEconomy:str(data,'economy') as 'action',range:str(data,'range'),duration:str(data,'duration'),concentration:data.has('concentration'),ritual:data.has('ritual'),components:str(data,'components').split(',').map(s=>s.trim()).filter(Boolean),description:str(data,'description'),known:data.has('known'),inSpellbook:data.has('inSpellbook'),prepared:data.has('prepared'),casterClassRef:optionalString(data,'casterClass'),resourceSystemRef:optionalString(data,'system'),attack:optionalString(data,'attack'),save:optionalString(data,'save'),damage:optionalString(data,'damage')}));
  }
  function action(id?: string) {
    const c=ctx.current(), source=c.actions.find(row=>row.id===id) ?? {id:uid(),name:'',actionEconomy:'action' as const,summary:'',detail:'',damageRolls:[],resourceRefs:[]};
    editor('actions',source,!!id,id?'Rediger handling':'Ny handling',requiredName(source.name) + select('Action economy','economy',source.actionEconomy,economies) + textArea('Kort beskrivelse','summary',source.summary,2) + textArea('Regeltekst','detail',source.detail) + field('Angrepskast (valgfritt)','attack',source.attackRoll ?? '') + field('Skade / terninguttrykk (semikolondelt)','damage',source.damageRolls.join('; ')) + numberField('Save DC (valgfritt)','saveDC',source.saveDC ?? '','min="0"') + field('Rekkevidde (valgfritt)','range',source.range ?? '') + textArea('Krav (valgfritt)','requirements',source.requirements ?? '',2) + refs('Begrensede ressurser','resourceRefs',c.resources,source.resourceRefs),data=>({...source,name:str(data,'name'),actionEconomy:str(data,'economy') as 'action',summary:str(data,'summary'),detail:str(data,'detail'),attackRoll:optionalString(data,'attack'),damageRolls:str(data,'damage').split(';').map(s=>s.trim()).filter(Boolean),saveDC:optionalNumber(data,'saveDC'),range:optionalString(data,'range'),requirements:optionalString(data,'requirements'),resourceRefs:readRefs(data,'resourceRefs')}));
  }
  function resource(id?: string, kind: Character['resources'][number]['kind'] = 'custom') {
    const c = ctx.current(), source = c.resources.find(row => row.id === id) ?? {id:uid(),ownerCharacterId:c.id,name:'',kind,current:0,max:0,recharge:{kind:(kind==='custom'?'manual':'longRest') as 'manual'|'longRest'}};
    const read = (data: FormData): Character['resources'][number] => {
      const current = num(data,'current'), max = num(data,'max'), kind = str(data,'kind') as typeof source.kind;
      if (current > max) throw new Error('Tilgjengelig kan ikke være større enn maks.');
      return {...source,name:str(data,'name'),kind,current,max,recharge:{kind:str(data,'recharge') as 'manual',ruleText:optionalString(data,'rule')},classRef:optionalString(data,'classRef'),spellLevel:kind === 'spellSlot' ? num(data,'spellLevel') : undefined,systemRef:kind === 'spellSlot' ? str(data,'system') : undefined,die:kind === 'hitDie' ? str(data,'die') as 'd8' : undefined};
    };
    let usedDie=false;
    const d = editor('resources',source,!!id,id ? source.name : 'Ny ressurs',
      `<div class="form-grid">${numberField('Tilgjengelig','current',source.current,'min="0" required')}${numberField('Maks','max',source.max,'min="0" required')}</div><div class="actions"><button type="button" data-step="-1" aria-label="Bruk én">−1</button><button type="button" data-step="1" aria-label="Gjenopprett én">+1</button></div>` +
      (source.kind === 'hitDie' && id ? `<fieldset data-hit-die-use><legend>Bruk én fysisk Hit Die</legend><p>Kast én ${esc(source.die)} fysisk. Constitution modifier legges til; HP begrenses til maks. DM avgjør om Short Rest kan gjennomføres.</p>${numberField('Terningresultat','rolled','',`min="1" max="${Number(source.die?.slice(1))}"`)}<p id="hit-die-preview" role="status"></p></fieldset>` : '') +
      `<details ${id?'':'open'}><summary>Ressursoppsett</summary>` + requiredName(source.name) + select('Type','kind',source.kind,[{value:'custom',label:'Egen ressurs'}, {value:'spellSlot',label:'Spell slots / Pact Magic'}, {value:'hitDie',label:'Hit Dice'}]) +
      `<div data-resource-fields="spellSlot">${numberField('Slot level','spellLevel',source.spellLevel ?? 1,'min="1" max="9" required')}${field('Slot-system','system',source.systemRef ?? 'Spellcasting','required')}</div>` +
      `<div data-resource-fields="hitDie">${select('Terning','die',source.die ?? 'd8',options(['d6','d8','d10','d12']))}</div>` +
      select('Knyttet til klasse','classRef',source.classRef ?? '',classOptions(c)) + select('Gjenopprettes ved','recharge',source.recharge.kind,rechargeOptions) + textArea('Særregel (valgfritt)','rule',source.recharge.ruleText ?? '',2) + '</details>',(data,draft)=>{
        const pool=read(data);
        usedDie=!!id && pool.kind==='hitDie' && str(data,'rolled')!=='';
        if(!usedDie) return pool;
        draft.resources=draft.resources.map(row=>row.id===id?pool:row);
        const after=useHitDie(draft,id!,num(data,'rolled'));Object.assign(draft,after);
        return after.resources.find(row=>row.id===id)!;
      },c,()=>({type:usedDie?'hit-die':'resources',description:usedDie?'Én Hit Die brukt med healing':'Ressurs oppdatert'}));
    const form=d.querySelector('form')!, type = d.querySelector<HTMLSelectElement>('[name="kind"]')!;
    const roll=d.querySelector<HTMLInputElement>('[name="rolled"]'), spend=d.querySelector<HTMLButtonElement>('#submit');
    const preview=()=>{
      if (!roll || !spend) return;
      spend.textContent=roll.value && !roll.disabled ? 'Registrer kast' : 'Lagre';
      if(!roll.value || roll.disabled) {spend.disabled=false;d.querySelector('#hit-die-preview')!.textContent='';return;}
      spend.disabled=!roll.checkValidity() || num(new FormData(form),'current')<1;
      if (spend.disabled) {d.querySelector('#hit-die-preview')!.textContent='';return;}
      try {
        const draft=structuredClone(c), pool=read(new FormData(form));draft.resources=draft.resources.map(row=>row.id===id?pool:row);
        const after=useHitDie(draft,id!,Number(roll.value));
        d.querySelector('#hit-die-preview')!.textContent=`HP ${c.hp.current} → ${after.hp.current} / ${c.hp.max} · Hit Dice ${pool.current} → ${pool.current-1}`;
      } catch {spend.disabled=true;}
    };
    const show = () => {
      d.querySelectorAll<HTMLElement>('[data-resource-fields]').forEach(group=> { group.hidden = group.dataset.resourceFields !== type.value; group.querySelectorAll<HTMLInputElement|HTMLSelectElement>('input,select').forEach(input=>input.disabled=group.hidden); });
      const use=d.querySelector<HTMLElement>('[data-hit-die-use]');if(use) use.hidden=type.value!=='hitDie';
      if(roll){roll.disabled=type.value!=='hitDie';roll.max=d.querySelector<HTMLSelectElement>('[name="die"]')!.value.slice(1);}
      preview();
    };
    type.onchange = show; form.addEventListener('input',preview);d.querySelector<HTMLSelectElement>('[name="die"]')!.onchange=show;show();
    d.querySelectorAll<HTMLButtonElement>('[data-step]').forEach(button => button.onclick = () => {
      const current = d.querySelector<HTMLInputElement>('[name="current"]')!, max = d.querySelector<HTMLInputElement>('[name="max"]')!;
      current.value = String(Math.max(0, Math.min(Number(max.value),Number(current.value) + Number(button.dataset.step))));preview();
    });
  }

  function rest() {
    const c = ctx.current(), dice = c.resources.filter(row=>row.kind==='hitDie');
    const d = editDialog('Hvile', select('Hviletype','rest','shortRest',[{value:'shortRest',label:'Short Rest'}, {value:'longRest',label:'Long Rest'}]) +
      `<p>Gjenoppretter ressurser etter registrerte hvilevilkår. Manuelle ressurser og særregler endres ikke.</p><div data-long-rest hidden><p>Long Rest fyller HP og fjerner temporary HP. Velg Hit Dice å gjenopprette: høyst ${Math.max(1,Math.floor(c.level/2))} totalt.</p>${dice.map(pool=>numberField(`${pool.name} (${pool.current} / ${pool.max})`,pool.id,0,`min="0" max="${Math.max(0,pool.max-pool.current)}" required`)).join('')}</div><p>DM avgjør hvile. Hit Dice brukes fra egen pille. Tilstander og særregler vurderes manuelt.</p>`, async form => {
        const data = new FormData(form), kind = str(data,'rest') as 'shortRest'|'longRest';
        const recovery = kind === 'longRest' ? Object.fromEntries(dice.map(pool=>[pool.id,num(data,pool.id)])) : {};
        await save(restCharacter(c,kind,recovery),'rest',kind==='longRest' ? 'Long Rest registrert' : 'Short Rest registrert');
      }, 'Bekreft hvile');
    d.querySelector<HTMLSelectElement>('[name="rest"]')!.onchange = event => { d.querySelector<HTMLElement>('[data-long-rest]')!.hidden = (event.target as HTMLSelectElement).value !== 'longRest'; };
  }
  function conditions() {
    const c = ctx.current();
    const known = new Set(conditionNames.map(name=>name.toLowerCase()));
    editDialog('Tilstander og exhaustion', `<div class="condition-options">${conditionNames.map(name=>check(name,'conditions',c.conditions.some(value=>value.toLowerCase()===name.toLowerCase())).replace('name="conditions"',`name="conditions" value="${name}"`)).join('')}</div>` + field('Egne tilstander (kommadelt)','customConditions',c.conditions.filter(name=>!known.has(name.toLowerCase())).join(', ')) + numberField('Exhaustion level','exhaustion',c.exhaustionLevel,'min="0" max="6" required'), async form => {
      const data = new FormData(form);
      await save({...c,conditions:[...new Set([...readRefs(data,'conditions'),...str(data,'customConditions').split(',').map(s=>s.trim()).filter(Boolean)])],exhaustionLevel:num(data,'exhaustion')},'conditions','Tilstander oppdatert');
    });
  }
  function deathSaves() {
    const c = ctx.current();
    editDialog('Death saves', `<div class="form-grid">${numberField('Vellykkede','successes',c.deathSaves.successes,'min="0" max="3" required')}${numberField('Mislykkede','failures',c.deathSaves.failures,'min="0" max="3" required')}</div>`, async form => { const data=new FormData(form); await save({...c,deathSaves:{successes:num(data,'successes'),failures:num(data,'failures')}},'death-saves','Death saves oppdatert'); });
  }
  return {language,proficiency,defense,immunity,feature,spell,action,resource,rest,conditions,deathSaves,
    inspiration: () => save({...ctx.current(),inspiration:!ctx.current().inspiration},'inspiration','Inspiration endret')};
}
