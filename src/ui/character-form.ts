import {enhanceNumbers} from './number-wheel';
import { abilities, type Character } from '../domain/model';
import { classCatalog, speciesCatalog } from '../domain/catalog';
import { field, select } from './html';

type ClassEntry = Character['classes'][number];
export function subclassFields(classId: string, subclass = '') {
  const known = classCatalog.find(c => c.catalogId === classId);
  const choices = known?.subclasses ?? [];
  const choice = choices.includes(subclass) ? subclass : subclass ? 'custom' : '';
  return `${select('Subclass (valgfritt)', 'subclassChoice', choice, [{value:'', label:'Ingen / ikke valgt'}, ...choices.map(name => ({value:name, label:name})), {value:'custom', label:'Opprett egen subclass'}])}
    <div data-custom-subclass ${choice === 'custom' ? '' : 'hidden'}>${field('Egen subclass', 'subclassName', choice === 'custom' ? subclass : '', 'maxlength="100"')}</div>`;
}
export function classRow(cl: ClassEntry = { id: crypto.randomUUID(), name: '', level: 1 }) {
  const choice = cl.definitionRef?.kind === 'catalog' && classCatalog.some(c => c.catalogId === cl.definitionRef?.id) ? cl.definitionRef.id : cl.name ? 'custom' : '';
  return `<div class="class-row" data-class-id="${cl.id}">${select('Klasse', 'classChoice', choice, [{value:'', label:'Velg klasse'}, ...classCatalog.map(c => ({value:c.catalogId, label:c.name})), {value:'custom', label:'Opprett egen klasse'}], 'required')}
    <div data-custom-class ${choice === 'custom' ? '' : 'hidden'}>${field('Egen klasse', 'className', cl.name, 'maxlength="100"')}</div>
    <div data-subclass-fields>${subclassFields(choice, cl.subclass)}</div>
    ${field('Klassenivå', 'classLevel', cl.level, 'type="number" min="1" max="20" required')}
    <button type="button" data-remove-class>Fjern klasse</button></div>`;
}
export function characterForm(c: Character, creating: boolean) {
  const choice = speciesCatalog.some(s => s.catalogId === c.species.catalogId) ? c.species.catalogId! : c.species.name ? 'custom' : '';
  return `<fieldset><legend tabindex="-1">Identitet</legend>${field('Navn', 'name', c.name, 'required maxlength="100" autocomplete="off" placeholder="Karakterens navn"')}
    ${select('Art / species', 'speciesChoice', choice, [{value:'', label:'Velg art'}, ...speciesCatalog.map(s => ({value:s.catalogId!, label:s.name})), {value:'custom', label:'Opprett egen art / underart'}], 'required')}
    <div data-custom-species ${choice === 'custom' ? '' : 'hidden'}>
      ${field('Navn på art / underart', 'speciesName', c.species.name, 'maxlength="100"')}
      ${field('Grunnfart for arten (ft)', 'speciesSpeed', c.species.walkingSpeed ?? '', 'type="number" min="0"')}
      <label class="check"><input type="checkbox" name="ignoreArmorPenalty" ${c.species.ignoresHeavyArmorSpeedPenalty ? 'checked' : ''}>Heavy armor reduserer ikke artens speed</label>
    </div></fieldset>
    <fieldset><legend tabindex="-1">Klasse og nivå</legend><div id="class-rows">${(c.classes.length ? c.classes : [undefined]).map(cl => classRow(cl)).join('')}</div><button type="button" id="add-class">+ Klasse</button><p id="total-level"></p></fieldset>
    <fieldset><legend tabindex="-1">Grunnverdier</legend><p>Angi endelige ability scores, inkludert bonuser.</p><div class="form-grid">${abilities.map(a => field(a, a, c.abilityScores[a], 'type="number" min="0" required')).join('')}</div>
    ${field('Maks HP fra karakterarket', 'hpMax', c.hp.max || '', 'type="number" min="1" required')}
    <p>På level 1: full Hit Die + Constitution modifier. Senere levels: fysisk kast eller fast verdi + Constitution modifier. Angi samlet maks HP her.</p>
    <p>${creating ? 'Karakteren starter med full HP. Utstyr legges til inne i appen.' : 'Nåværende HP og temporary HP beholdes. Skade og healing registreres i Combat.'}</p></fieldset>`;
}
export function readSubclass(root: ParentNode) {
  const choice = root.querySelector<HTMLSelectElement>('[name="subclassChoice"]')!.value;
  return choice === 'custom' ? root.querySelector<HTMLInputElement>('[name="subclassName"]')!.value.trim() : choice;
}
export function bindSubclass(root: ParentNode) {
  const custom = root.querySelector<HTMLSelectElement>('[name="subclassChoice"]')!.value === 'custom';
  root.querySelector<HTMLElement>('[data-custom-subclass]')!.hidden = !custom;
  root.querySelector<HTMLInputElement>('[name="subclassName"]')!.required = custom;
}
export function readCharacterForm(form: HTMLFormElement, source: Character, creating: boolean): Character {
  const draft = structuredClone(source), data = new FormData(form);
  const text = (key: string) => String(data.get(key) ?? '');
  const definition = speciesCatalog.find(s => s.catalogId === text('speciesChoice'));
  draft.name = text('name');
  draft.species = definition ? structuredClone(source.species.catalogId === definition.catalogId ? source.species : definition) : {...draft.species, catalogId:undefined, name:text('speciesName').trim(), walkingSpeed:text('speciesSpeed') === '' ? null : Number(data.get('speciesSpeed')), ignoresHeavyArmorSpeedPenalty:data.has('ignoreArmorPenalty')};
  if (!definition && (draft.species.name !== source.species.name || source.species.catalogId)) { draft.species.traits = []; draft.species.languages = []; }
  for (const a of abilities) draft.abilityScores[a] = Number(data.get(a));
  draft.classes = [...form.querySelectorAll<HTMLElement>('[data-class-id]')].map(row => {
    const value = (key: string) => row.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${key}"]`)!.value;
    const old = source.classes.find(cl => cl.id === row.dataset.classId);
    const known = classCatalog.find(cl => cl.catalogId === value('classChoice'));
    return {...old, id:row.dataset.classId!, name:known?.name ?? value('className').trim(), definitionRef:known ? {kind:'catalog' as const, id:known.catalogId} : old?.definitionRef?.kind === 'custom' && old.name === value('className').trim() ? old.definitionRef : undefined, ...(readSubclass(row) || old?.subclass !== undefined ? {subclass:readSubclass(row)} : {}), level:Number(value('classLevel'))};
  });
  draft.level = draft.classes.reduce((n, cl) => n + cl.level, 0);
  draft.hp.max = Number(data.get('hpMax'));
  if (creating) draft.hp = {max:draft.hp.max, current:draft.hp.max, temp:0};
  return draft;
}
export function bindCharacterForm(form: HTMLFormElement, source: Character, creating: boolean) {
  const previousClass=new WeakMap<HTMLSelectElement,string>();
  form.querySelectorAll<HTMLSelectElement>('[name="classChoice"]').forEach(select=>previousClass.set(select,select.value));
  const update = () => {
    const custom = form.querySelector<HTMLSelectElement>('[name="speciesChoice"]')!.value === 'custom';
    form.querySelector<HTMLElement>('[data-custom-species]')!.hidden = !custom;
    for (const key of ['speciesName', 'speciesSpeed']) form.querySelector<HTMLInputElement>(`[name="${key}"]`)!.required = custom;
    const rows = [...form.querySelectorAll<HTMLElement>('[data-class-id]')];
    rows.forEach(row => {
      row.querySelector<HTMLButtonElement>('[data-remove-class]')!.hidden = rows.length === 1;
      const customClass = row.querySelector<HTMLSelectElement>('[name="classChoice"]')!.value === 'custom';
      row.querySelector<HTMLElement>('[data-custom-class]')!.hidden = !customClass;
      row.querySelector<HTMLInputElement>('[name="className"]')!.required = customClass;
      bindSubclass(row);
    });
    form.querySelector('#total-level')!.textContent = `Totalt level: ${readCharacterForm(form, source, creating).level}`;
  };
  form.addEventListener('input', update);
  form.addEventListener('change', event => {
    const target = event.target as HTMLSelectElement;
    if (target.name === 'classChoice'&&previousClass.get(target)!==target.value) {target.closest('[data-class-id]')!.querySelector('[data-subclass-fields]')!.innerHTML = subclassFields(target.value);previousClass.set(target,target.value);}
    update();
  });
  form.querySelector<HTMLButtonElement>('#add-class')!.onclick = () => { form.querySelector('#class-rows')!.insertAdjacentHTML('beforeend', classRow()); enhanceNumbers(form);update(); form.querySelectorAll<HTMLElement>('[name="classChoice"]')[form.querySelectorAll('[data-class-id]').length - 1].focus(); };
  form.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    if (target.matches('[data-remove-class]')) { target.closest('[data-class-id]')!.remove(); update(); }
  });
  update();
}
