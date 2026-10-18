import { abilities, type Character } from '../domain/model';
import { equipmentCatalog, type Item } from '../domain/catalog';
import { deriveStats } from '../domain/derived';
import { deriveWeapon, weaponProfile } from '../domain/equipment';
import { escapeHtml as esc, field, select } from './html';

export const equipmentCategories = [
  {value:'weapon', label:'Våpen'}, {value:'armor', label:'Rustning'}, {value:'shield', label:'Skjold'},
  {value:'equipment', label:'Annet utstyr'}, {value:'magic', label:'Magisk utstyr'},
];
export function newEquipment(): Item {
  return {id:crypto.randomUUID(), name:'', category:'equipment', quantity:1, equipped:true, effectRefs:[], resourceRefs:[]};
}
export function weaponSummary(c: Character, item: Item, offhand = false) {
  const stats = deriveWeapon(c,item,offhand);
  return `<p class="weapon-values"><strong>Angrep: ${esc(stats.attack)}</strong><strong>Skade: ${esc(stats.damage)}</strong></p>
    ${stats.range ? `<p>Rekkevidde: ${esc(stats.range)}</p>` : ''}
    <details><summary>Beregningsgrunnlag</summary><ul>${stats.explanation.map(text=>`<li>${esc(text)}</li>`).join('')}</ul></details>
    ${stats.notes.map(text=>`<p class="muted">${esc(text)}</p>`).join('')}`;
}
export function equipmentForm(item: Item, creating = false) {
  const profile = item.armorProfile, weapon = weaponProfile(item);
  return `<div id="equipment-preview" aria-live="polite"></div>
    ${field('Navn på utstyr', 'itemName', item.name, 'required maxlength="100"')}
    <label class="check"><input type="checkbox" name="equipped" ${item.equipped ? 'checked' : ''}>I bruk</label>
    <div data-grip-fields ${item.category === 'weapon' ? '' : 'hidden'}>
      ${select('Brukes med', 'grip', item.grip ?? (item.handUsage === 'two' ? 'two' : 'one'), [{value:'one',label:'Én hånd'}, {value:'two',label:'To hender'}])}
      <div data-throw-fields ${weapon?.kind === 'melee' && weapon.properties.includes('thrown') ? '' : 'hidden'}>${select('Angrepsmåte', 'attackMode', item.attackMode ?? 'melee', [{value:'melee',label:'Melee'}, {value:'thrown',label:'Kastes'}])}</div>
    </div>
    <label class="check" data-attuned-fields ${item.requiresAttunement ? '' : 'hidden'}><input type="checkbox" name="attuned" ${item.attuned ? 'checked' : ''}>Attuned</label>
    <details id="item-details" ${creating && item.category === 'armor' ? 'open' : ''}><summary>Tilpass gjenstanden</summary>
      <div class="form-grid">${select('Kategori', 'itemCategory', item.category, equipmentCategories)}${field('Antall', 'itemQuantity', item.quantity, 'type="number" min="0" required')}</div>
      <label class="check"><input type="checkbox" name="requiresAttunement" ${item.requiresAttunement ? 'checked' : ''}>Krever attunement</label>
      <fieldset><legend>Bonuser når gjenstanden brukes</legend><p class="muted">Faste bonuser. Andre effekter beskrives i notatet. Magiske bonuser krever attunement når det er angitt.</p>
        <div class="form-grid">${field('AC-bonus', 'bonus-ac', item.bonuses?.ac ?? '', 'type="number" step="1"')}${field('Bonus til alle saving throws', 'bonus-saves', item.bonuses?.saves ?? '', 'type="number" step="1"')}</div>
        <div data-weapon-bonuses ${item.category === 'weapon' ? '' : 'hidden'} class="form-grid">${field('Angrepsbonus', 'bonus-attack', item.bonuses?.attack ?? '', 'type="number" step="1"')}${field('Skadebonus', 'bonus-damage', item.bonuses?.damage ?? '', 'type="number" step="1"')}</div>
      </fieldset>
      <details data-armor-fields ${item.category === 'armor' ? '' : 'hidden'} ${creating && item.category === 'armor' ? 'open' : ''}><summary>Rustningens regelverdier</summary>
        ${select('Rustningstype', 'armorKind', profile?.kind ?? 'custom', [{value:'light',label:'Light'}, {value:'medium',label:'Medium'}, {value:'heavy',label:'Heavy'}, {value:'custom',label:'Egen'}])}
        ${field('Base AC for rustningen', 'baseAc', profile?.baseAc ?? 10, 'type="number" min="0"')}
        <label class="check"><input type="checkbox" name="addDex" ${profile?.addDex !== false ? 'checked' : ''}>Legg til Dexterity modifier</label>
        ${field('Maks Dexterity-bonus (tomt = ingen grense)', 'dexCap', profile?.dexCap ?? '', 'type="number"')}
        ${field('Strength-krav', 'armorStrength', profile?.strength ?? 0, 'type="number" min="0"')}
        <label class="check"><input type="checkbox" name="armorStealth" ${profile?.stealthDisadvantage ? 'checked' : ''}>Disadvantage på Stealth</label>
      </details>
      <div data-shield-fields ${item.category === 'shield' ? '' : 'hidden'}>${field('Skjoldbonus til AC', 'shieldBonus', item.acContribution ?? 2, 'type="number" min="0"')}</div>
      <details data-weapon-fields ${item.category === 'weapon' ? '' : 'hidden'}><summary>Våpenets regelverdier og overstyringer</summary>
        ${select('Våpenkategori','weaponCategory',weapon?.category ?? 'custom',[{value:'simple',label:'Simple'},{value:'martial',label:'Martial'},{value:'custom',label:'Egen'}])}
        ${select('Våpentype','weaponKind',weapon?.kind ?? 'melee',[{value:'melee',label:'Melee'},{value:'ranged',label:'Ranged'}])}
        ${field('Grunnskade (terninger)','weaponDice',weapon?.dice ?? '', 'maxlength="10000"')}${field('Skadetype','weaponDamageType',weapon?.damageType ?? '', 'maxlength="10000"')}
        ${field('Grunnskade med to hender','twoHandedDice',weapon?.twoHandedDice ?? '', 'maxlength="10000"')}
        ${field('Våpenegenskaper (kommadelt)','weaponProperties',weapon?.properties.join(', ') ?? '', 'maxlength="10000"')}
        ${field('Rekkevidde','weaponRange',weapon?.range ?? '', 'maxlength="10000"')}${field('Kasterekkevidde','thrownRange',weapon?.thrownRange ?? '', 'maxlength="10000"')}
        ${select('Ability for angrep og skade','attackAbility',item.attackAbility ?? '',[{value:'',label:'Fra våpen og karakter'},...abilities.map(value=>({value,label:value}))])}
        ${select('Våpenproficiency','proficient',item.proficient === undefined ? '' : String(item.proficient),[{value:'',label:'Fra klasse og registrerte proficiencies'},{value:'true',label:'Ja (manuelt)'},{value:'false',label:'Nei (manuelt)'}])}
        ${field('Attack (manuell total)', 'attack', item.attack ?? '', 'maxlength="10000"')}
        ${field('Damage (manuell total)', 'damage', item.damageOverride ?? (item.damage !== undefined && item.damage !== weaponBaseText(item) ? item.damage : ''), 'maxlength="10000"')}
        <p class="muted">Manuelle totaler erstatter beregningen. La dem stå tomme for automatisk verdi.</p>
      </details>
      <label>Utstyrsnotat<textarea name="itemNotes" maxlength="10000" rows="3">${esc(item.notes ?? '')}</textarea></label>
    </details>
    <div id="derived-preview" class="muted" aria-live="polite"></div>
    ${creating ? '' : '<button type="button" class="danger" id="delete-item">Fjern fra karakteren</button>'}`;
}
// Catalog damage was formerly stored as a text field. Keep it unless the player changes it.
function weaponBaseText(i: Item) {
  return i.definitionRef?.kind === 'catalog' ? equipmentCatalog.find(d => d.catalogId === i.definitionRef!.id)?.damage : undefined;
}
export function readEquipment(form: HTMLFormElement, source: Item): Item {
  const data = new FormData(form), item = structuredClone(source);
  const text = (key: string) => String(data.get(key) ?? '');
  item.name = text('itemName').trim(); item.category = text('itemCategory') as Item['category'];
  item.quantity = Number(data.get('itemQuantity')); item.equipped = data.has('equipped');
  const setOptional = (key: 'requiresAttunement' | 'attuned', value: boolean) => { if (value || source[key] !== undefined) item[key] = value; };
  setOptional('requiresAttunement', data.has('requiresAttunement')); setOptional('attuned', data.has('attuned'));
  const bonuses = {...source.bonuses};
  for (const key of ['ac','saves','attack','damage'] as const) {
    if (text(`bonus-${key}`)) bonuses[key] = Number(text(`bonus-${key}`)); else delete bonuses[key];
  }
  if (Object.keys(bonuses).length || source.bonuses) item.bonuses = bonuses;
  if (text('itemNotes') || source.notes !== undefined) item.notes = text('itemNotes');
  if (item.category === 'weapon') {
    const p = weaponProfile(source);
    const grip = text('grip') as 'one'|'two';
    if (grip !== (source.handUsage === 'two' ? 'two' : 'one') || source.grip) item.grip = grip; else delete item.grip;
    if (text('attackMode') !== 'melee' || source.attackMode) item.attackMode = text('attackMode') as 'melee'|'thrown';
    if (text('attackAbility')) item.attackAbility = text('attackAbility') as NonNullable<Item['attackAbility']>; else delete item.attackAbility;
    if (text('proficient')) item.proficient = text('proficient') === 'true'; else delete item.proficient;
    const profile: NonNullable<Item['weaponProfile']> = {category:text('weaponCategory') as 'simple'|'martial'|'custom',kind:text('weaponKind') as 'melee'|'ranged',dice:text('weaponDice'),damageType:text('weaponDamageType'),properties:text('weaponProperties').split(',').map(v=>v.trim().toLowerCase()).filter(Boolean)};
    for (const key of ['twoHandedDice','range','thrownRange'] as const) { const value = text(key === 'range' ? 'weaponRange' : key); if (value || p?.[key] !== undefined) profile[key] = value; }
    if (p?.special !== undefined) profile.special = p.special;
    if (p || profile.dice || profile.damageType || profile.properties.length) {
      // Avoid turning read-only catalog fallback into a mutation on unchanged save.
      if (source.weaponProfile || Object.keys({...profile,...p}).some(key => JSON.stringify(profile[key as keyof typeof profile]) !== JSON.stringify(p?.[key as keyof typeof profile]))) item.weaponProfile = profile;
    }
    if (text('attack') || source.attack === '') item.attack = text('attack'); else delete item.attack;
    const originalDamage = source.damageOverride ?? (source.damage !== weaponBaseText(source) ? source.damage : undefined);
    if (text('damage') !== (originalDamage ?? '')) {
      if (text('damage')) item.damageOverride = text('damage'); else delete item.damageOverride;
      if (source.damage !== weaponBaseText(source)) delete item.damage;
    }
  }
  if (item.category === 'armor') item.armorProfile = {
    kind:text('armorKind') as NonNullable<Item['armorProfile']>['kind'], baseAc:Number(data.get('baseAc')),
    addDex:data.has('addDex'), dexCap:text('dexCap') === '' ? null : Number(data.get('dexCap')),
    strength:Number(data.get('armorStrength')), stealthDisadvantage:data.has('armorStealth'),
  };
  else if (source.category === 'armor') delete item.armorProfile;
  if (item.category === 'shield') item.acContribution = Number(data.get('shieldBonus'));
  else if (source.category === 'shield') delete item.acContribution;
  return item;
}
export function bindEquipment(form: HTMLFormElement, source: Item, character: Character) {
  const update = () => {
    const category = form.querySelector<HTMLSelectElement>('[name="itemCategory"]')!.value;
    for (const [selector,show] of [['armor-fields',category==='armor'],['shield-fields',category==='shield'],['weapon-fields',category==='weapon'],['grip-fields',category==='weapon'],['weapon-bonuses',category==='weapon'],['attuned-fields',form.querySelector<HTMLInputElement>('[name="requiresAttunement"]')!.checked]] as const) form.querySelector<HTMLElement>(`[data-${selector}]`)!.hidden = !show;
    const item = readEquipment(form, source);
    const c = {...character, items:character.items.filter(i => i.id !== source.id).concat(item)};
    const stats = deriveStats(c);
    const preview = form.querySelector('#equipment-preview')!;
    const expanded = preview.querySelector('details')?.open;
    const bonuses = item.bonuses ? Object.entries(item.bonuses).filter(([,value])=>value).map(([key,value])=>`${({ac:'AC',saves:'Saving throws',attack:'Attack',damage:'Damage'} as Record<string,string>)[key]} ${Number(value)>=0?'+':''}${value}`).join(' · ') : '';
    preview.innerHTML = category === 'weapon' ? weaponSummary(c,item) : item.armorProfile ? `<p><strong>${esc(item.name || 'Rustning')}: AC ${item.armorProfile.baseAc}${item.armorProfile.addDex ? ` + DEX${item.armorProfile.dexCap!==null ? ` (maks ${item.armorProfile.dexCap})` : ''}` : ' (uten DEX)'}</strong></p>` : '';
    if (category !== 'weapon' && bonuses) preview.insertAdjacentHTML('beforeend',`<p><strong>${esc(bonuses)}</strong></p>`);
    if (expanded) preview.querySelector('details')?.setAttribute('open','');
    const warnings = stats.warnings.filter(w => category !== 'weapon' || w.includes(item.name) || /hånd|hender/.test(w));
    form.querySelector('#derived-preview')!.innerHTML = `${category !== 'weapon' ? `<p>Samlet AC ${stats.ac} · Speed ${stats.speed ?? '—'} ft</p><p>${esc(stats.acExplanation)}</p>` : ''}${warnings.map(w => `<p class="warning">${esc(w)}</p>`).join('')}`;
  };
  form.addEventListener('input', update);
  form.addEventListener('change', event => {
    const target = event.target as HTMLSelectElement;
    if (target.name === 'armorKind' && target.value !== 'custom') {
      form.querySelector<HTMLInputElement>('[name="addDex"]')!.checked = target.value !== 'heavy';
      form.querySelector<HTMLInputElement>('[name="dexCap"]')!.value = target.value === 'medium' ? '2' : '';
    }
    if (target.name === 'itemCategory') {
      form.querySelector<HTMLDetailsElement>('#item-details')!.open = true;
      if (target.value === 'armor') form.querySelector<HTMLDetailsElement>('[data-armor-fields]')!.open = true;
    }
    update();
  });
  update();
}
