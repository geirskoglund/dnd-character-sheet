import type { Character } from '../domain/model';
import type { Item } from '../domain/catalog';
import { deriveStats } from '../domain/derived';
import { escapeHtml as esc, field, select } from './html';

export const equipmentCategories = [
  {value:'weapon', label:'Våpen'}, {value:'armor', label:'Rustning'}, {value:'shield', label:'Skjold'},
  {value:'equipment', label:'Annet utstyr'}, {value:'magic', label:'Magisk utstyr'},
];
export function newEquipment(): Item {
  return {id:crypto.randomUUID(), name:'', category:'equipment', quantity:1, equipped:true, effectRefs:[], resourceRefs:[]};
}
export function equipmentForm(item: Item, creating = false) {
  const profile = item.armorProfile;
  return `${field('Navn på utstyr', 'itemName', item.name, 'required maxlength="100"')}
    <div class="form-grid">${select('Kategori', 'itemCategory', item.category, equipmentCategories)}${field('Antall', 'itemQuantity', item.quantity, 'type="number" min="0" required')}</div>
    <label class="check"><input type="checkbox" name="equipped" ${item.equipped ? 'checked' : ''}>Utstyrt</label>
    <details ${creating ? 'open' : ''}><summary>Utstyrsverdier</summary>
      <div data-armor-fields ${item.category === 'armor' ? '' : 'hidden'}>
        ${select('Rustningstype', 'armorKind', profile?.kind ?? 'custom', [{value:'light',label:'Light'}, {value:'medium',label:'Medium'}, {value:'heavy',label:'Heavy'}, {value:'custom',label:'Egen'}])}
        ${field('Base AC for rustningen', 'baseAc', profile?.baseAc ?? 10, 'type="number" min="0"')}
        <label class="check"><input type="checkbox" name="addDex" ${profile?.addDex !== false ? 'checked' : ''}>Legg til Dexterity modifier</label>
        ${field('Maks Dexterity-bonus (tomt = ingen grense)', 'dexCap', profile?.dexCap ?? '', 'type="number"')}
        ${field('Strength-krav', 'armorStrength', profile?.strength ?? 0, 'type="number" min="0"')}
        <label class="check"><input type="checkbox" name="armorStealth" ${profile?.stealthDisadvantage ? 'checked' : ''}>Disadvantage på Stealth</label>
      </div>
      <div data-shield-fields ${item.category === 'shield' ? '' : 'hidden'}>${field('Skjoldbonus til AC', 'shieldBonus', item.acContribution ?? 2, 'type="number" min="0"')}</div>
      ${select('Håndbruk', 'handUsage', item.handUsage ?? '', [{value:'',label:'Ikke relevant'}, {value:'one',label:'Én hånd'}, {value:'two',label:'To hender'}, {value:'versatile',label:'Versatile'}])}
      ${field('Attack (valgfritt)', 'attack', item.attack ?? '', 'maxlength="10000"')}
      ${field('Damage (valgfritt)', 'damage', item.damage ?? '', 'maxlength="10000"')}
    </details>
    <label>Utstyrsnotat<textarea name="itemNotes" maxlength="10000" rows="3">${esc(item.notes ?? '')}</textarea></label>
    <div id="derived-preview" class="muted" aria-live="polite"></div>
    ${creating ? '' : '<button type="button" class="danger" id="delete-item">Fjern fra karakteren</button>'}`;
}
export function readEquipment(form: HTMLFormElement, source: Item): Item {
  const data = new FormData(form), item = structuredClone(source);
  const text = (key: string) => String(data.get(key) ?? '');
  item.name = text('itemName').trim(); item.category = text('itemCategory') as Item['category'];
  item.quantity = Number(data.get('itemQuantity')); item.equipped = data.has('equipped');
  item.handUsage = text('handUsage') as Item['handUsage'] || undefined;
  // Preserve absent optional fields and source/effect/resource references on existing instances.
  for (const [field, key] of [['attack','attack'], ['damage','damage'], ['notes','itemNotes']] as const) {
    if (text(key) || source[field] !== undefined) item[field] = text(key);
  }
  if (item.category === 'armor') item.armorProfile = {
    kind:text('armorKind') as NonNullable<Item['armorProfile']>['kind'], baseAc:Number(data.get('baseAc')),
    addDex:data.has('addDex'), dexCap:text('dexCap') === '' ? null : Number(data.get('dexCap')),
    strength:Number(data.get('armorStrength')), stealthDisadvantage:data.has('armorStealth'),
  };
  else delete item.armorProfile;
  if (item.category === 'shield') item.acContribution = Number(data.get('shieldBonus'));
  else if (source.category === 'shield') delete item.acContribution;
  return item;
}
export function bindEquipment(form: HTMLFormElement, source: Item, character: Character) {
  const update = () => {
    const category = form.querySelector<HTMLSelectElement>('[name="itemCategory"]')!.value;
    form.querySelector<HTMLElement>('[data-armor-fields]')!.hidden = category !== 'armor';
    form.querySelector<HTMLElement>('[data-shield-fields]')!.hidden = category !== 'shield';
    form.querySelector<HTMLInputElement>('[name="baseAc"]')!.required = category === 'armor';
    form.querySelector<HTMLInputElement>('[name="shieldBonus"]')!.required = category === 'shield';
    const items = character.items.filter(i => i.id !== source.id).concat(readEquipment(form, source));
    const stats = deriveStats({...character, items});
    form.querySelector('#derived-preview')!.innerHTML = `<p>AC ${stats.ac} · Speed ${stats.speed ?? '—'} ft</p>${stats.warnings.map(w => `<p class="warning">${esc(w)}</p>`).join('')}`;
  };
  form.addEventListener('input', update);
  form.addEventListener('change', event => {
    const target = event.target as HTMLSelectElement;
    if (target.name === 'armorKind' && target.value !== 'custom') {
      form.querySelector<HTMLInputElement>('[name="addDex"]')!.checked = target.value !== 'heavy';
      form.querySelector<HTMLInputElement>('[name="dexCap"]')!.value = target.value === 'medium' ? '2' : '';
    }
    // Reveal relevant rules immediately when changing an item's category.
    if (target.name === 'itemCategory') form.querySelector('details')!.open = true;
    update();
  });
  update();
}
