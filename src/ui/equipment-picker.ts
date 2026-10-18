import { commitDialog } from './dialog';
import { equipmentCatalog, type Item } from '../domain/catalog';
import { equipmentCategories } from './equipment-form';
import { escapeHtml as esc, select } from './html';

export function equipmentPicker() {
  return `<label>Søk i utstyr<input type="search" name="equipmentSearch" placeholder="Rustning, skjold, våpen…" autocomplete="off"></label>
    ${select('Kategori', 'equipmentFilter', '', [{value:'',label:'Alt utstyr'}, ...equipmentCategories])}
    <button type="button" id="custom-equipment">Opprett eget utstyr</button>
    <p id="equipment-count" class="muted" role="status"></p><div id="equipment-results" class="choice-list"></div>`;
}
export function bindEquipmentPicker(d: HTMLDialogElement, add: (id: string) => Promise<void>, custom: () => void) {
  const search = d.querySelector<HTMLInputElement>('[name="equipmentSearch"]')!;
  const filter = d.querySelector<HTMLSelectElement>('[name="equipmentFilter"]')!;
  const results = d.querySelector<HTMLElement>('#equipment-results')!;
  const label = (category: Item['category']) => equipmentCategories.find(c => c.value === category)!.label;
  const draw = () => {
    const query = search.value.trim().toLocaleLowerCase('nb');
    const matches = equipmentCatalog.filter(item => (!filter.value || item.category === filter.value) && `${item.name} ${label(item.category)}`.toLocaleLowerCase('nb').includes(query));
    d.querySelector('#equipment-count')!.textContent = matches.length ? `${matches.length} treff` : 'Ingen treff. Endre søket eller opprett eget utstyr.';
    results.innerHTML = matches.map(item => `<button type="button" data-add-equipment="${item.catalogId}" aria-label="Legg til ${esc(item.name)}"><strong>${esc(item.name)}</strong><small>${esc(label(item.category))}</small></button>`).join('');
    results.querySelectorAll<HTMLButtonElement>('[data-add-equipment]').forEach(button => button.onclick = () => void commitDialog(() => add(button.dataset.addEquipment!)));

  };
  search.oninput = draw; filter.onchange = draw;
  d.querySelector<HTMLButtonElement>('#custom-equipment')!.onclick = custom;
  draw();
}
