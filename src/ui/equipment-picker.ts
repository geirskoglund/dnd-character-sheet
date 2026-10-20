import {icon} from './icons';
import {itemIcon} from '../domain/iconography';
import { commitDialog } from './dialog';
import { equipmentCatalog, type Item } from '../domain/catalog';
import { equipmentCategories } from './equipment-form';
import { escapeHtml as esc, select } from './html';

export function equipmentPicker(group = '') {
  return `<label>Søk i utstyr<input type="search" name="equipmentSearch" placeholder="Rustning, skjold, våpen…" autocomplete="off"></label>
    ${select('Kategori', 'equipmentFilter', group, [{value:'',label:'Alt utstyr'}, {value:'other',label:'Annet utstyr'}, {value:'armor',label:'Armor og skjold'}, ...equipmentCategories.filter(category=>category.value!=='armor')])}
    <button type="button" id="custom-equipment">Opprett eget utstyr</button>
    <p id="equipment-count" class="muted" role="status"></p><div id="equipment-results" class="choice-list"></div>`;
}
export function bindEquipmentPicker(d: HTMLDialogElement, add: (id: string) => Promise<void>, custom: (catalogId?:string) => void) {
  const search = d.querySelector<HTMLInputElement>('[name="equipmentSearch"]')!;
  const filter = d.querySelector<HTMLSelectElement>('[name="equipmentFilter"]')!;
  const results = d.querySelector<HTMLElement>('#equipment-results')!;
  const label = (category: Item['category']) => equipmentCategories.find(c => c.value === category)!.label;
  const draw = () => {
    const query = search.value.trim().toLocaleLowerCase('nb');
    const matches = equipmentCatalog.filter(item => (!filter.value || (filter.value === 'armor' ? ['armor','shield'].includes(item.category) : filter.value === 'other' ? ['equipment','magic'].includes(item.category) : item.category === filter.value)) && `${item.name} ${label(item.category)}`.toLocaleLowerCase('nb').includes(query));
    d.querySelector('#equipment-count')!.textContent = matches.length ? `${matches.length} treff` : 'Ingen treff. Endre søket eller opprett eget utstyr.';
    results.innerHTML = matches.map(item => `<div class="choice-row"><button type="button" data-add-equipment="${item.catalogId}" aria-label="Legg til ${esc(item.name)}">${icon(itemIcon({...item,definitionRef:{kind:'catalog',id:item.catalogId}}))}<strong>${esc(item.name)}</strong><small>${esc(label(item.category))}</small></button><button type="button" class="customize-choice" data-customize-equipment="${item.catalogId}" aria-label="Tilpass ${esc(item.name)}">Tilpass</button></div>`).join('');
    results.querySelectorAll<HTMLButtonElement>('[data-add-equipment]').forEach(button => button.onclick = () => void commitDialog(() => add(button.dataset.addEquipment!)));
    results.querySelectorAll<HTMLButtonElement>('[data-customize-equipment]').forEach(button=>button.onclick=()=>custom(button.dataset.customizeEquipment));
  };
  search.oninput = draw; filter.onchange = draw;
  d.querySelector<HTMLButtonElement>('#custom-equipment')!.onclick = () => custom();
  draw();
}
