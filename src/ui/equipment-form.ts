import type { Character } from '../domain/model';
import { equipmentCatalog, instantiateEquipment } from '../domain/catalog';
import { deriveStats } from '../domain/derived';
import { escapeHtml as esc, field, select } from './html';

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
export function equipmentForm(c: Character) {
  return `<p>Bare utstyr markert «Utstyrt» brukes i beregningene.</p><div id="equipment-rows">${c.items.map(i => equipmentRow(i)).join('')}</div><button type="button" class="pill" id="add-equipment">+ Utstyr</button><div id="derived-preview" aria-live="polite"></div>`;
}
export function readEquipment(form: HTMLFormElement, source: Character): Character['items'] {
  return [...form.querySelectorAll<HTMLElement>('[data-item-id]')].map(row => {
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
}
export function bindEquipment(form: HTMLFormElement, source: Character) {
  const update = () => {
    const value = (root: ParentNode, key: string) => root.querySelector<HTMLSelectElement>(`[name="${key}"]`)!.value;
    form.querySelectorAll<HTMLElement>('[data-item-id]').forEach(row => {
      const custom = value(row, 'equipmentChoice') === 'custom';
      row.querySelector<HTMLElement>('[data-custom-item]')!.hidden = !custom;
      row.querySelector<HTMLInputElement>('[name="itemName"]')!.required = custom;
      row.querySelector<HTMLElement>('[data-custom-armor]')!.hidden = value(row, 'itemCategory') !== 'armor';
      row.querySelector<HTMLElement>('[data-custom-shield]')!.hidden = value(row, 'itemCategory') !== 'shield';
      row.querySelector<HTMLInputElement>('[name="baseAc"]')!.required = custom && value(row, 'itemCategory') === 'armor';
      row.querySelector<HTMLInputElement>('[name="shieldBonus"]')!.required = custom && value(row, 'itemCategory') === 'shield';
    });
    const stats = deriveStats({ ...source, items: readEquipment(form, source) });
    form.querySelector('#derived-preview')!.innerHTML = `<p>AC ${stats.ac} · Speed ${stats.speed ?? '—'} ft</p><p>${esc(stats.acExplanation)}</p><p>${esc(stats.speedExplanation)}</p>${stats.warnings.map(w => `<p class="warning">${esc(w)}</p>`).join('')}`;
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
  form.querySelector<HTMLButtonElement>('#add-equipment')!.onclick = () => { form.querySelector('#equipment-rows')!.insertAdjacentHTML('beforeend', equipmentRow()); update(); };
  form.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    if (target.matches('[data-remove-item]')) { target.closest('[data-item-id]')!.remove(); update(); }
  });
  update();
}
