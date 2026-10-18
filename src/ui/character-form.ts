import { abilities, type Character } from '../domain/model';
import { classCatalog, equipmentCatalog, instantiateEquipment, speciesCatalog } from '../domain/catalog';
import { deriveStats } from '../domain/derived';
import { escapeHtml as esc, field, select } from './html';

export function classRow(cl: Character['classes'][number] = { id: crypto.randomUUID(), name: '', level: 1 }) {
  const choice = cl.definitionRef?.kind === 'catalog' && classCatalog.some(c => c.catalogId === cl.definitionRef?.id) ? cl.definitionRef.id : cl.name ? 'custom' : '';
  return `<div class="class-row" data-class-id="${cl.id}">${select('Klasse', 'classChoice', choice, [{ value: '', label: 'Velg klasse' }, ...classCatalog.map(c => ({ value: c.catalogId, label: c.name })), { value: 'custom', label: 'Opprett egen klasse' }], 'required')}
    <div data-custom-class ${choice === 'custom' ? '' : 'hidden'}>${field('Egen klasse', 'className', cl.name, 'maxlength="100"')}</div>
    ${field('Subclass (valgfritt)', 'subclass', cl.subclass ?? '', 'maxlength="100"')}
    ${field('Klassenivå', 'classLevel', cl.level, 'type="number" min="1" max="20" required')}
    <button type="button" data-remove-class>Fjern klasse</button></div>`;
}
export function equipmentRow(item?: Character['items'][number]) {
  const choice = item?.definitionRef?.kind === 'catalog' && equipmentCatalog.some(d => d.catalogId === item.definitionRef?.id) ? item.definitionRef.id : item ? 'custom' : '';
  const profile = item?.armorProfile;
  return `<div class="equipment-row" data-item-id="${item?.id ?? crypto.randomUUID()}">
    <label>Søk i utstyr<input type="search" data-equipment-search placeholder="Rustning, skjold, våpen…"></label>
    ${select('Utstyr', 'equipmentChoice', choice, [{ value: '', label: 'Velg utstyr' }, ...equipmentCatalog.map(d => ({ value: d.catalogId, label: `${d.name} · ${d.category}` })), { value: 'custom', label: 'Opprett eget utstyr' }], 'required')}
    <div data-custom-item ${choice === 'custom' ? '' : 'hidden'}>
      ${field('Navn på utstyr', 'itemName', item?.name ?? '', 'maxlength="100"')}
      ${select('Kategori', 'itemCategory', item?.category ?? 'equipment', ['armor','shield','weapon','equipment','magic'].map(v => ({ value: v, label: v })))}
      <div data-custom-armor ${item?.category === 'armor' ? '' : 'hidden'}>
        ${select('Rustningstype', 'armorKind', profile?.kind ?? 'custom', ['light','medium','heavy','custom'].map(v => ({ value: v, label: v })))}
        ${field('Base AC for rustningen', 'baseAc', profile?.baseAc ?? 10, 'type="number" min="0"')}
        <label class="check"><input type="checkbox" name="addDex" ${profile?.addDex !== false ? 'checked' : ''}>Legg til Dexterity modifier</label>
        ${field('Maks Dexterity-bonus (tomt = ingen grense)', 'dexCap', profile?.dexCap ?? '', 'type="number"')}
        ${field('Strength-krav', 'armorStrength', profile?.strength ?? 0, 'type="number" min="0"')}
        <label class="check"><input type="checkbox" name="armorStealth" ${profile?.stealthDisadvantage ? 'checked' : ''}>Disadvantage på Stealth</label>
      </div>
      <div data-custom-shield ${item?.category === 'shield' ? '' : 'hidden'}>${field('Skjoldbonus til AC', 'shieldBonus', item?.acContribution ?? 2, 'type="number" min="0"')}</div>
      ${select('Håndbruk', 'handUsage', item?.handUsage ?? '', [{value:'',label:'Ikke relevant'}, {value:'one',label:'Én hånd'}, {value:'two',label:'To hender'}, {value:'versatile',label:'Versatile'}])}
    </div>
    ${field('Antall', 'itemQuantity', item?.quantity ?? 1, 'type="number" min="0" required')}
    <label class="check"><input type="checkbox" name="equipped" ${item?.equipped !== false ? 'checked' : ''}>Utstyrt</label>
    <button type="button" data-remove-item>Fjern utstyr</button>
  </div>`;
}
export function characterForm(c: Character, creating: boolean) {
  const speciesChoice = speciesCatalog.some(s => s.catalogId === c.species.catalogId) ? c.species.catalogId! : c.species.name ? 'custom' : '';
  return `<p>Registrer karakterens nåværende klasse og nivå direkte. Beregnede verdier følger grunnlaget du registrerer.</p>
    <fieldset><legend>Identitet og art</legend>${field('Navn', 'name', c.name, 'required maxlength="100" autocomplete="off" placeholder="Karakterens navn"')}
    ${select('Art / species', 'speciesChoice', speciesChoice, [{ value: '', label: 'Velg art' }, ...speciesCatalog.map(s => ({ value: s.catalogId!, label: s.name })), { value: 'custom', label: 'Opprett egen art / underart' }], 'required')}
    <div data-custom-species ${speciesChoice === 'custom' ? '' : 'hidden'}>
      ${field('Navn på art / underart', 'speciesName', c.species.name, 'maxlength="100"')}
      ${field('Grunnfart for arten (ft)', 'speciesSpeed', c.species.walkingSpeed ?? '', 'type="number" min="0"')}
      <label class="check"><input type="checkbox" name="ignoreArmorPenalty" ${c.species.ignoresHeavyArmorSpeedPenalty ? 'checked' : ''}>Heavy armor reduserer ikke artens speed</label>
    </div><div id="species-info"></div></fieldset>
    <fieldset><legend>Klasse og nivå</legend><div id="class-rows">${(c.classes.length ? c.classes : [undefined]).map(cl => classRow(cl)).join('')}</div><button type="button" class="pill" id="add-class">+ Klasse</button><p id="total-level"></p>
    <p>Du trenger ikke registrere tidligere level-ups.</p></fieldset>
    <fieldset><legend>Ability scores og maksimal HP</legend><p>Bruk endelige ability scores fra karakterarket, inkludert artsbonuser og andre økninger. De legges ikke til på nytt.</p>
    <div class="form-grid">${abilities.map(a => field(a, a, c.abilityScores[a], 'type="number" min="0" required')).join('')}</div>
    ${field('Maks HP fra karakterarket', 'hpMax', c.hp.max || '', 'type="number" min="1" required')}
    <p>${creating ? 'Karakteren starter med full HP. Endringer under spill gjøres på karakterarket.' : 'Nåværende HP og temporary HP endres på karakterarket.'}</p></fieldset>
    <fieldset><legend>Utstyr</legend><p>Bare utstyr markert «Utstyrt» brukes i beregningene.</p><div id="equipment-rows">${c.items.map(i => equipmentRow(i)).join('')}</div><button type="button" class="pill" id="add-equipment">+ Utstyr</button></fieldset>
    <fieldset><legend>Verdier fra karaktergrunnlaget</legend><div id="derived-preview" aria-live="polite"></div></fieldset>
    ${!creating ? '<p>Avvik fra beregnede verdier håndteres under «Beregninger og overstyringer» på karakterarket.</p>' : ''}`;
}
export function readCharacterForm(form: HTMLFormElement, source: Character, creating: boolean): Character {
  const draft = structuredClone(source);
  const data = new FormData(form);
  const text = (key: string) => String(data.get(key) ?? '');
  const num = (key: string) => Number(data.get(key));
  draft.name = text('name');
  const choice = text('speciesChoice');
  const definition = speciesCatalog.find(s => s.catalogId === choice);
  draft.species = definition ? structuredClone(definition) : {
    ...draft.species, catalogId: undefined, name: text('speciesName').trim(),
    walkingSpeed: text('speciesSpeed') === '' ? null : num('speciesSpeed'), ignoresHeavyArmorSpeedPenalty: data.has('ignoreArmorPenalty'),
  };
  if (!definition && (draft.species.name !== source.species.name || source.species.catalogId)) { draft.species.traits = []; draft.species.languages = []; }
  for (const a of abilities) draft.abilityScores[a] = num(a);
  draft.classes = [...form.querySelectorAll<HTMLElement>('[data-class-id]')].map(row => {
    const value = (key: string) => row.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${key}"]`)!.value;
    const old = source.classes.find(cl => cl.id === row.dataset.classId);
    const known = classCatalog.find(cl => cl.catalogId === value('classChoice'));
    return { ...old, id: row.dataset.classId!, name: known?.name ?? value('className').trim(),
      definitionRef: known ? { kind: 'catalog' as const, id: known.catalogId } : old?.name === value('className').trim() ? old.definitionRef : undefined,
      subclass: value('subclass'), level: Number(value('classLevel')) };
  });
  draft.level = draft.classes.reduce((n, cl) => n + cl.level, 0);
  draft.hp.max = num('hpMax');
  if (creating) draft.hp = { max: draft.hp.max, current: draft.hp.max, temp: 0 };
  draft.items = [...form.querySelectorAll<HTMLElement>('[data-item-id]')].map(row => {
    const value = (key: string) => row.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${key}"]`)!.value;
    const checked = (key: string) => row.querySelector<HTMLInputElement>(`[name="${key}"]`)!.checked;
    const key = value('equipmentChoice');
    const old = source.items.find(i => i.id === row.dataset.itemId);
    const same = old && (key === old.definitionRef?.id || key === 'custom' && !equipmentCatalog.some(d => d.catalogId === old.definitionRef?.id));
    const item = same ? structuredClone(old) : key && key !== 'custom' ? instantiateEquipment(key) : {
      id: row.dataset.itemId!, name: '', category: 'equipment' as const, quantity: 1, equipped: true, effectRefs: [], resourceRefs: [],
    };
    item.id = row.dataset.itemId!; item.quantity = Number(value('itemQuantity')); item.equipped = checked('equipped');
    if (key === 'custom') {
      item.name = value('itemName').trim(); item.category = value('itemCategory') as typeof item.category;
      item.handUsage = value('handUsage') as typeof item.handUsage || undefined;
      if (item.category === 'armor') item.armorProfile = { kind: value('armorKind') as NonNullable<typeof item.armorProfile>['kind'],
        baseAc: Number(value('baseAc')), addDex: checked('addDex'), dexCap: value('dexCap') === '' ? null : Number(value('dexCap')),
        strength: Number(value('armorStrength')), stealthDisadvantage: checked('armorStealth') };
      else delete item.armorProfile;
      if (item.category === 'shield') item.acContribution = Number(value('shieldBonus'));
    }
    return item;
  });
  return draft;
}
export function previewHtml(c: Character) {
  const stats = deriveStats(c);
  return `<p><strong>AC ${stats.ac}</strong> · <strong>Speed ${stats.speed ?? '—'}${stats.speed !== null ? ' ft' : ''}</strong></p>
    <p>${esc(stats.acExplanation)}</p><p>${esc(stats.speedExplanation)}</p>${stats.warnings.map(w => `<p class="warning">${esc(w)}</p>`).join('')}`;
}
export function bindCharacterForm(form: HTMLFormElement, source: Character, creating: boolean) {
  const update = () => {
    const value = (root: ParentNode, key: string) => root.querySelector<HTMLSelectElement>(`[name="${key}"]`)!.value;
    const customSpecies = value(form, 'speciesChoice') === 'custom';
    form.querySelector<HTMLElement>('[data-custom-species]')!.hidden = !customSpecies;
    form.querySelector<HTMLInputElement>('[name="speciesName"]')!.required = customSpecies;
    form.querySelector<HTMLInputElement>('[name="speciesSpeed"]')!.required = customSpecies;
    form.querySelectorAll<HTMLElement>('[data-class-id]').forEach(row => {
      const custom = value(row, 'classChoice') === 'custom';
      row.querySelector<HTMLElement>('[data-custom-class]')!.hidden = !custom;
      row.querySelector<HTMLInputElement>('[name="className"]')!.required = custom;
    });
    form.querySelectorAll<HTMLElement>('[data-item-id]').forEach(row => {
      const custom = value(row, 'equipmentChoice') === 'custom';
      row.querySelector<HTMLElement>('[data-custom-item]')!.hidden = !custom;
      row.querySelector<HTMLInputElement>('[name="itemName"]')!.required = custom;
      row.querySelector<HTMLElement>('[data-custom-armor]')!.hidden = value(row, 'itemCategory') !== 'armor';
      row.querySelector<HTMLElement>('[data-custom-shield]')!.hidden = value(row, 'itemCategory') !== 'shield';
      row.querySelector<HTMLInputElement>('[name="baseAc"]')!.required = custom && value(row, 'itemCategory') === 'armor';
      row.querySelector<HTMLInputElement>('[name="shieldBonus"]')!.required = custom && value(row, 'itemCategory') === 'shield';
    });
    const draft = readCharacterForm(form, source, creating);
    form.querySelector('#total-level')!.textContent = `Totalt level: ${draft.level}`;
    form.querySelector('#species-info')!.textContent = draft.species.name ? `${draft.species.name}: grunnfart ${draft.species.walkingSpeed ?? 'ukjent'} ft. ${draft.species.traits.map(t => t.name).join(' · ')}` : '';
    form.querySelector('#derived-preview')!.innerHTML = previewHtml(draft);
  };
  form.addEventListener('input', event => {
    const target = event.target as HTMLInputElement;
    if (target.matches('[data-equipment-search]')) {
      const select = target.closest('[data-item-id]')!.querySelector<HTMLSelectElement>('[name="equipmentChoice"]')!;
      for (const option of select.options) option.hidden = !!option.value && option.value !== 'custom' && option.value !== select.value && !option.text.toLowerCase().includes(target.value.toLowerCase());
    }
    update();
  });
  form.addEventListener('change', event => {
    const target = event.target as HTMLSelectElement;
    if (target.name === 'armorKind' && target.value !== 'custom') {
      const row = target.closest('[data-item-id]')!;
      row.querySelector<HTMLInputElement>('[name="addDex"]')!.checked = target.value !== 'heavy';
      row.querySelector<HTMLInputElement>('[name="dexCap"]')!.value = target.value === 'medium' ? '2' : '';
    }
    update();
  });
  form.querySelector<HTMLButtonElement>('#add-class')!.onclick = () => { form.querySelector('#class-rows')!.insertAdjacentHTML('beforeend', classRow()); update(); };
  form.querySelector<HTMLButtonElement>('#add-equipment')!.onclick = () => { form.querySelector('#equipment-rows')!.insertAdjacentHTML('beforeend', equipmentRow()); update(); };
  form.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    if (target.matches('[data-remove-class], [data-remove-item]')) { target.closest('[data-class-id], [data-item-id]')!.remove(); update(); }
  });
  update();
}
