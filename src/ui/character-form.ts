import { abilities, type Character } from '../domain/model';
import { classCatalog, speciesCatalog } from '../domain/catalog';
import { escapeHtml as esc, field, select } from './html';

type ClassEntry = Character['classes'][number];
const classKey = (cl: ClassEntry) => cl.definitionRef?.kind === 'catalog' ? cl.definitionRef.id : cl.id;
const abilityNames = {STR:'Strength', DEX:'Dexterity', CON:'Constitution', INT:'Intelligence', WIS:'Wisdom', CHA:'Charisma'};
/** Existing non-catalog answers remain readable; new answers come from the catalog. */
export function subclassFields(classId: string, subclass = '', name = 'subclassChoice') {
  const choices = classCatalog.find(c => c.catalogId === classId)?.subclasses ?? [];
  return select('Subclass (valgfritt)', name, subclass, [{value:'', label:'Ingen / ikke valgt'}, ...[...new Set([...choices, ...(subclass ? [subclass] : [])])].map(value => ({value, label:value}))]);
}
export function readSubclass(root: ParentNode) {
  return root.querySelector<HTMLSelectElement>('[name="subclassChoice"]')!.value;
}
const step = (id:string, title:string, html:string, manual=false) => `<section data-question-id="${id}" data-question-title="${esc(title)}" data-question-help="" data-question-grouped ${manual?'data-manual-next':''}>${html}</section>`;
export function characterForm(c: Character) {
  const existing = c.classes.filter(cl => !classCatalog.some(known => known.catalogId === classKey(cl)));
  const options = [...classCatalog.map(cl => ({key:cl.catalogId, name:cl.name})), ...existing.map(cl => ({key:classKey(cl), name:cl.name}))];
  const knownSpecies = speciesCatalog.some(s => s.catalogId === c.species.catalogId);
  const species = [...speciesCatalog.map(s => ({value:s.catalogId!, label:s.name})), ...(c.species.name && !knownSpecies ? [{value:'existing', label:c.species.name}] : [])];
  return step('name', 'Hva heter karakteren?', field('Navn', 'name', c.name, 'required maxlength="100" autocomplete="off" placeholder="Karakterens navn"'))
    + step('species', '', select('Art / species', 'speciesChoice', knownSpecies ? c.species.catalogId! : c.species.name?'existing':'', [{value:'',label:'Velg art'}, ...species], 'required'))
    + step('classes', '', `<div class="wizard-options" data-choice-required data-class-selection><input type="hidden" name="classChoice" aria-label="Klasse" value="${esc(c.classes.length?JSON.stringify(c.classes.map(classKey)):'')}">${options.map(cl => `<button type="button" data-class-toggle="${esc(cl.key)}" aria-pressed="${c.classes.some(old => classKey(old)===cl.key)}">${esc(cl.name)}</button>`).join('')}</div>`, true)
    + step('subclasses', '', '<div data-subclass-rows></div>', true)
    + step('levels', '', '<div class="character-levels" data-level-rows></div>', true)
    + step('abilities', '', `<div class="character-abilities">${abilities.map(a => field(a, a, c.abilityScores[a], `type="number" min="0" step="1" required data-number-title="${abilityNames[a]}"`)).join('')}</div>`, true)
    + step('hp', '', field('Maks HP fra karakterarket', 'hpMax', c.hp.max, 'type="number" min="1" step="1" required data-number-caption="Maks HP"'), true);
}
function selectedKeys(form:HTMLFormElement):string[] {
  const value=form.querySelector<HTMLInputElement>('[name="classChoice"]')!.value;
  return value ? JSON.parse(value) as string[] : [];
}
export function readCharacterForm(form: HTMLFormElement, source: Character, creating: boolean): Character {
  const draft = structuredClone(source), data = new FormData(form);
  draft.name = String(data.get('name') ?? '');
  const species = speciesCatalog.find(s => s.catalogId === data.get('speciesChoice'));
  if(species) draft.species = structuredClone(source.species.catalogId===species.catalogId?source.species:species);
  for (const a of abilities) draft.abilityScores[a] = Number(data.get(a));
  draft.classes = selectedKeys(form).map(key => {
    const row=form.querySelector<HTMLElement>(`[data-class-key="${CSS.escape(key)}"]`)!;
    const old=source.classes.find(cl => classKey(cl)===key), known=classCatalog.find(cl => cl.catalogId===key);
    return {...old, id:row.dataset.classId!, name:known?.name??old!.name, definitionRef:known?{kind:'catalog' as const,id:key}:old?.definitionRef,
      subclass:String(data.get(`subclass:${key}`)??''), level:Number(data.get(`level:${key}`))};
  });
  draft.level = draft.classes.reduce((n, cl) => n + cl.level, 0);
  draft.hp.max = Number(data.get('hpMax'));
  if (creating) draft.hp = {max:draft.hp.max, current:draft.hp.max, temp:0};
  return draft;
}
export function bindCharacterForm(form: HTMLFormElement, source: Character) {
  const selection=form.querySelector<HTMLInputElement>('[name="classChoice"]')!;
  const subclasses=form.querySelector<HTMLElement>('[data-subclass-rows]')!, levels=form.querySelector<HTMLElement>('[data-level-rows]')!;
  const update=()=>{
    const keys=selectedKeys(form);
    // Keep the original nodes for retained classes: their values and editor bindings survive.
    for(const row of subclasses.querySelectorAll<HTMLElement>('[data-class-key]')) if(!keys.includes(row.dataset.classKey!)) row.remove();
    for(const row of levels.querySelectorAll<HTMLElement>('[data-level-key]')) if(!keys.includes(row.dataset.levelKey!)) row.remove();
    for(const key of keys){
      if(subclasses.querySelector(`[data-class-key="${CSS.escape(key)}"]`))continue;
      const old=source.classes.find(cl=>classKey(cl)===key), known=classCatalog.find(cl=>cl.catalogId===key), id=old?.id??crypto.randomUUID(), name=known?.name??old!.name;
      subclasses.insertAdjacentHTML('beforeend', `<div data-class-key="${esc(key)}" data-class-id="${id}"><h4>${esc(name)}</h4>${subclassFields(key,old?.subclass,`subclass:${key}`)}</div>`);
      levels.insertAdjacentHTML('beforeend', `<div data-level-key="${esc(key)}">${field('Klassenivå',`level:${key}`,old?.level??1,`type="number" min="1" step="1" required data-number-caption="${esc(name)}" data-number-title="${esc(name)}"`)}</div>`);
    }
    levels.classList.toggle('many-classes',keys.length>=3);
    form.querySelectorAll<HTMLButtonElement>('[data-class-toggle]').forEach(button=>button.setAttribute('aria-pressed',String(keys.includes(button.dataset.classToggle!))));
    const name=form.querySelector<HTMLInputElement>('[name="name"]')!.value;
    const titles:Record<string,string>={species:`Hvilken art er ${name}?`,classes:`Hvilken eller hvilke klasser har ${name}?`,subclasses:`Angi subklasser for ${name}.`,levels:`Velg hvilket nivå (level) ${name} er på, innenfor klassene sine.`,abilities:`Legg inn nivået for ${name}s egenskaper.`,hp:`Legg inn maksimum helse (hit points) for ${name}.`};
    for(const [id,title] of Object.entries(titles))form.querySelector<HTMLElement>(`[data-question-id="${id}"]`)!.dataset.questionTitle=title;
  };
  form.addEventListener('click',event=>{
    const button=(event.target as HTMLElement).closest<HTMLButtonElement>('[data-class-toggle]');if(!button)return;
    const keys=selectedKeys(form),key=button.dataset.classToggle!;
    selection.value=keys.includes(key)?(keys.length===1?'':JSON.stringify(keys.filter(k=>k!==key))):JSON.stringify([...keys,key]);
    selection.dispatchEvent(new Event('change',{bubbles:true}));
  });
  form.addEventListener('input',update);form.addEventListener('change',update);update();
}

/** Map unfinished pre-#61 questions onto the grouped flow. Class answers are already
 * stored by stable ID in the draft payload; repeated old controls must not replace them. */
export function groupedCharacterDraft(entry: import('../domain/wizard-draft').WizardDraft) {
  if(['name','species','classes','subclasses','levels','abilities','hp'].includes(entry.step)||!entry.step)return entry;
  const field=entry.step.split(':').at(-1)!;
  const step=field==='name'?'name':field.startsWith('species')||field==='ignoreArmorPenalty'?'species':field.startsWith('subclass')?'subclasses':field==='classLevel'?'levels':field.startsWith('class')?'classes':abilities.includes(field as typeof abilities[number])?'abilities':field==='hpMax'?'hp':'name';
  return {...entry,step,controls:entry.controls.filter(control=>!['classChoice','classLevel','subclassChoice'].includes(control.name))};
}
