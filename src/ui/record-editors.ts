import type {WizardDraft,DraftToken} from '../domain/wizard-draft';
import type {WizardDraftRepository} from '../storage/wizard-drafts';
import {classCatalog} from '../domain/catalog';
import {iconField,readIcon} from './icons';
import type {IconKey} from '../domain/iconography';
import { abilities, characterSchema, type Character } from '../domain/model';
import { materializeLanguages, normalizeSkill, removeRecord, damageTypes, conditionNames, type RecordCollection } from '../domain/records';
import { skillAbilities } from '../domain/modifiers';
import { editDialog, confirmDialog } from './dialog';
import { field, select, esc, textArea, check, numberField, options, economies, rechargeOptions, defenseOptions, conditionFields, readCondition, str, num, optionalNumber, optionalString, readRefs } from './record-fields';

export interface EditorContext { undo?:()=>Promise<void>; current: () => Character; save: (draft: Character, type: string, description: string,completion?:DraftToken) => Promise<void>; drafts?:WizardDraftRepository; draftChanged?:()=>Promise<void>; resumedDraft?:WizardDraft }
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
  const save = (c: Character, type: string, description: string,completion?:DraftToken) => ctx.save(characterSchema.parse(c), type, description,completion);
  function editor<K extends RecordCollection>(collection: K, source: Character[K][number], existing: boolean, title: string, html: string,
    read: (data: FormData, draft: Character) => Character[K][number], character = ctx.current(), operation?: () => {type:string;description:string},completion?:DraftToken) {
    const supportsIcon=['features','spells','actions'].includes(collection);
    const d = editDialog(title, html + (supportsIcon?iconField((source as {iconKey?:IconKey}).iconKey):'') + (existing ? `<button type="button" id="delete-record" class="danger">Fjern ${typeLabel[collection]}</button>` : ''), async form => {
      const draft = structuredClone(character), data=new FormData(form), row = read(data, draft);
      if(supportsIcon){const target=row as {iconKey?:IconKey};const chosen=readIcon(data);if(chosen)target.iconKey=chosen;else delete target.iconKey;}
      if (collection==='languages' && existing && 'name' in row && 'name' in source && row.name===source.name) return;
      draft[collection] = (existing ? draft[collection].map(item => item.id === source.id ? row : item) : [...draft[collection],row]) as never;
      const event=operation?.() ?? {type:collection,description:`${typeLabel[collection]} ${existing ? 'redigert' : 'lagt til'}`};
      await save(draft,event.type,event.description,completion);
    });
    const remove = d.querySelector<HTMLButtonElement>('#delete-record');
    if (remove) remove.onclick = () => confirmDialog(`Fjern ${typeLabel[collection]}?`, '<p>Endringen kan angres fra menyen.</p>', () => save(removeRecord(character, collection, source.id), collection, `${typeLabel[collection]} fjernet`,completion), 'Fjern');
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
  function feature(id?: string, category: Character['features'][number]['category'] = 'feat',prefill?:Character['features'][number],completion?:DraftToken) {
    const c = ctx.current();
    const source:Character['features'][number] = {id:uid(),name:'',category,description:'',actionRefs:[],resourceRefs:[],effectRefs:[],...(prefill ?? c.features.find(row => row.id === id))};
    const owned = <K extends 'actions'|'resources'|'effects'>(collection: K) => c[collection].find(row => row.sourceRef?.kind === 'feature' && row.sourceRef.id === source.id && (collection==='actions'?source.actionRefs:collection==='resources'?source.resourceRefs:source.effectRefs).includes(row.id)) as Character[K][number] | undefined;
    const action = owned('actions'), pool = owned('resources'), effect = owned('effects');
    const linkedPools = c.resources.filter(row => row.id !== pool?.id);
    const d = editor('features',source,!!id,id ? 'Rediger egenskap' : 'Ny egenskap / feat',
      requiredName(source.name) + select('Kategori','category',source.category,[{value:'feat',label:'Feat'}, {value:'class',label:'Klasseegenskap'}, {value:'species',label:'Artsegenskap'}, {value:'custom',label:'Egen egenskap'}, {value:'item',label:'Utstyrsegenskap'}]) + textArea('Beskrivelse','description',source.description) +
      `<details ${source.spellAccess?'open':''}><summary>Ekstra tilgang til magi</summary>${check('Gir tilgang til spells eller cantrips','hasSpellAccess',!!source.spellAccess).replace('name="hasSpellAccess"','name="hasSpellAccess" data-toggle="spellAccess"')}<fieldset data-fields="spellAccess"><legend>Avtalt tilgang</legend>${refs('Klasselister','accessClasses',classCatalog.map(cl=>({id:cl.name,name:cl.name})),source.spellAccess?.classes??[])}${numberField('Høyeste spellnivå (0 = bare cantrips)','accessMax',source.spellAccess?.maxLevel??0,'min="0" max="9" required')}${select('Spellcasting ability','accessAbility',source.spellAccess?.ability??'',[{value:'',label:'Ingen bestemt'},...abilities.map(value=>({value,label:value}))])}</fieldset></details>` +
      `<details ${action ? 'open' : ''}><summary>Handling</summary>${check('Har egen handling','hasAction',!!action).replace('name="hasAction"','name="hasAction" data-toggle="action"')}<fieldset data-fields="action"><legend>Handlingsoppslag</legend>${select('Action economy','economy',action?.actionEconomy ?? 'bonus',economies)}${field('Angrepskast (valgfritt)','attack',action?.attackRoll ?? '')}${field('Skade / terninguttrykk (valgfritt)','damage',action?.damageRolls.join('; ') ?? '')}${numberField('Save DC (valgfritt)','saveDC',action?.saveDC ?? '', 'min="0"')}${field('Rekkevidde (valgfritt)','actionRange',action?.range ?? '')}${textArea('Krav (valgfritt)','requirements',action?.requirements ?? '',2)}</fieldset></details>` +
      `<details ${pool || source.resourceRefs.length ? 'open' : ''}><summary>Begrenset ressurs</summary>${check('Har egen ressurs','hasPool',!!pool).replace('name="hasPool"','name="hasPool" data-toggle="pool"')}<fieldset data-fields="pool"><legend>Egen ressurs</legend><div class="form-grid">${numberField('Tilgjengelig','poolCurrent',pool?.current ?? 1,'min="0" required')}${numberField('Maks','poolMax',pool?.max ?? 1,'min="0" required')}</div>${select('Gjenopprettes ved','poolRecharge',pool?.recharge.kind ?? 'shortRest',rechargeOptions)}${textArea('Særregel (valgfritt)','poolRule',pool?.recharge.ruleText ?? '',2)}</fieldset>${refs('Knytt til eksisterende ressurser','resourceRefs',linkedPools,source.resourceRefs)}</details>` +
      `<details ${effect ? 'open' : ''}><summary>Passiv skadeeffekt</summary>${check('Har egen skadeeffekt','hasEffect',!!effect).replace('name="hasEffect"','name="hasEffect" data-toggle="effect"')}<fieldset data-fields="effect"><legend>Strukturert effekt</legend>${select('Effekt','operation',effect?.operation ?? 'flatReduction',[{value:'flatReduction',label:'Flat skadereduksjon'},...defenseOptions,{value:'manual',label:'Manuell effekt'}])}${numberField('Beløp (ved flat reduksjon)','amount',effect?.amount ?? 0,'min="0"')}${field('Skadetyper (kommadelt)','damageTypes',effect?.damageTypes.join(', ') ?? '')}${select('Omfang','scope',effect?.scope ?? 'component',[{value:'component',label:'Per skadepost'}, {value:'event',label:'Hele skadehendelsen'}])}${conditionFields(effect?.condition)}</fieldset></details>`,
      (data,draft) => {
        const row = {...source,name:str(data,'name'),category:str(data,'category') as typeof source.category,description:str(data,'description')};
        const sourceRef = {kind:'feature' as const,id:source.id};
        row.spellAccess=data.has('hasSpellAccess')?{classes:readRefs(data,'accessClasses'),spellIds:source.spellAccess?.spellIds??[],maxLevel:num(data,'accessMax'),ability:optionalString(data,'accessAbility') as typeof abilities[number]|undefined}:undefined;
        // Only our owned row is replaced; arbitrary imported/shared child records are retained.
        const replace = <K extends 'actions'|'resources'|'effects'>(collection: K, old: Character[K][number]|undefined, value?: Character[K][number]) => {
          const shared=old && [...draft.features.filter(owner=>owner.id!==source.id),...draft.items,...draft.actions.filter(action=>action.sourceRef?.kind!=='feature' || action.sourceRef.id!==source.id)].some(owner=>owner.resourceRefs.includes(old.id) || ('effectRefs' in owner && owner.effectRefs.includes(old.id)) || ('actionRefs' in owner && owner.actionRefs.includes(old.id)));
          draft[collection] = (old ? draft[collection].flatMap(child=>child.id!==old.id ? [child] : value ? [value] : shared ? [child] : []) : [...draft[collection],...(value ? [value] : [])]) as never;
        };
        const newPool = data.has('hasPool') ? {...pool,id:pool?.id ?? uid(),ownerCharacterId:c.id,name:row.name,current:num(data,'poolCurrent'),max:num(data,'poolMax'),manualMaximum:pool?.automatic?(pool.manualMaximum||num(data,'poolMax')!==pool.automatic.max):pool?.manualMaximum,kind:pool?.kind??'custom' as const,sourceRef,recharge:{kind:str(data,'poolRecharge') as 'shortRest',ruleText:optionalString(data,'poolRule')}} : undefined;
        if(pool?.automatic&&!newPool){const muted={...pool,max:0,current:0,manualMaximum:true};replace('resources',pool,muted);}else replace('resources',pool,newPool);
        row.resourceRefs = [...readRefs(data,'resourceRefs'),...(newPool ? [newPool.id] : [])];
        const newAction = data.has('hasAction') ? {...action,id:action?.id ?? uid(),name:row.name,sourceRef,actionEconomy:str(data,'economy') as 'action',summary:row.description,detail:row.description,attackRoll:optionalString(data,'attack'),damageRolls:str(data,'damage').split(';').map(s=>s.trim()).filter(Boolean),saveDC:optionalNumber(data,'saveDC'),range:optionalString(data,'actionRange'),requirements:optionalString(data,'requirements'),resourceRefs:[...row.resourceRefs]} : undefined;
        replace('actions',action,newAction);
        row.actionRefs = [...source.actionRefs.filter(ref=>ref!==action?.id),...(newAction ? [newAction.id] : [])];
        const newEffect = data.has('hasEffect') ? {...effect,id:effect?.id ?? uid(),sourceRef,target:'damage' as const,operation:str(data,'operation') as 'flatReduction',amount:num(data,'amount'),damageTypes:str(data,'damageTypes').split(',').map(s=>s.trim()).filter(Boolean),scope:str(data,'scope') as 'component',condition:readCondition(data),description:row.description} : undefined;
        replace('effects',effect,newEffect);
        row.effectRefs = [...source.effectRefs.filter(ref=>ref!==effect?.id),...(newEffect ? [newEffect.id] : [])];
        // Detach the removed private pool from any other references without removing shared pools.
        if (pool && !newPool && !draft.resources.some(resource=>resource.id===pool.id)) {
          for (const owner of [...draft.features,...draft.items,...draft.actions]) owner.resourceRefs = owner.resourceRefs.filter(ref=>ref!==pool.id);
        }
        return row;
      },c,undefined,completion);
    bindOptional(d);
  }
  function spell(id?: string, cantrip = false,prefill?:Character['spells'][number],completion?:DraftToken) {
    const c = ctx.current(), source:Character['spells'][number] = {id:uid(),name:'',spellLevel:cantrip ? 0 : 1,castingTime:'1 action',actionEconomy:'action',range:'',duration:'',concentration:false,ritual:false,components:[],description:'',known:true,inSpellbook:false,prepared:false,...(prefill ?? c.spells.find(row => row.id === id))};
    editor('spells',source,!!id,id ? 'Rediger spell' : cantrip ? 'Ny cantrip' : 'Ny spell',
      requiredName(source.name) + numberField('Spell level (0 = cantrip)','spellLevel',source.spellLevel,'min="0" max="9" required') + select('Knyttet til klasse','casterClass',source.casterClassRef ?? '',classOptions(c)) +
      `<div class="form-grid">${field('Casting time','castingTime',source.castingTime)}${select('Action economy','economy',source.actionEconomy,economies)}${field('Range','range',source.range)}${field('Duration','duration',source.duration)}</div>` +
      check('Concentration','concentration',source.concentration) + check('Ritual','ritual',source.ritual) + field('Components (kommadelt)','components',source.components.join(', ')) +
      `<div class="form-grid">${check('Known','known',source.known)}${check('I spellbook','inSpellbook',source.inSpellbook)}${check('Prepared','prepared',source.prepared)}</div>` +
      field('Slot-system (f.eks. Spellcasting / Pact Magic)','system',source.resourceSystemRef ?? '') + field('Attack (valgfritt)','attack',source.attack ?? '') + field('Save (valgfritt)','save',source.save ?? '') + field('Damage (valgfritt)','damage',source.damage ?? '') + textArea('Beskrivelse og upcasting','description',source.description,6),
      data => ({...source,name:str(data,'name'),spellLevel:num(data,'spellLevel'),castingTime:str(data,'castingTime'),actionEconomy:str(data,'economy') as 'action',range:str(data,'range'),duration:str(data,'duration'),concentration:data.has('concentration'),ritual:data.has('ritual'),components:str(data,'components').split(',').map(s=>s.trim()).filter(Boolean),description:str(data,'description'),known:data.has('known'),inSpellbook:data.has('inSpellbook'),prepared:data.has('prepared'),casterClassRef:optionalString(data,'casterClass'),resourceSystemRef:optionalString(data,'system'),attack:optionalString(data,'attack'),save:optionalString(data,'save'),damage:optionalString(data,'damage')}),c,undefined,completion);
  }
  function action(id?: string) {
    const c=ctx.current(), source=c.actions.find(row=>row.id===id) ?? {id:uid(),name:'',actionEconomy:'action' as const,summary:'',detail:'',damageRolls:[],resourceRefs:[]};
    editor('actions',source,!!id,id?'Rediger handling':'Ny handling',requiredName(source.name) + select('Action economy','economy',source.actionEconomy,economies) + textArea('Kort beskrivelse','summary',source.summary,2) + textArea('Regeltekst','detail',source.detail) + field('Angrepskast (valgfritt)','attack',source.attackRoll ?? '') + field('Skade / terninguttrykk (semikolondelt)','damage',source.damageRolls.join('; ')) + numberField('Save DC (valgfritt)','saveDC',source.saveDC ?? '','min="0"') + field('Rekkevidde (valgfritt)','range',source.range ?? '') + textArea('Krav (valgfritt)','requirements',source.requirements ?? '',2) + refs('Begrensede ressurser','resourceRefs',c.resources,source.resourceRefs),data=>({...source,name:str(data,'name'),actionEconomy:str(data,'economy') as 'action',summary:str(data,'summary'),detail:str(data,'detail'),attackRoll:optionalString(data,'attack'),damageRolls:str(data,'damage').split(';').map(s=>s.trim()).filter(Boolean),saveDC:optionalNumber(data,'saveDC'),range:optionalString(data,'range'),requirements:optionalString(data,'requirements'),resourceRefs:readRefs(data,'resourceRefs')}));
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
  return {language,proficiency,defense,immunity,feature,spell,action,conditions,deathSaves,
    inspiration: () => save({...ctx.current(),inspiration:!ctx.current().inspiration},'inspiration','Inspiration endret')};
}
