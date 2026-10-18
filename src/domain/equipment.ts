import type { Character } from './model';
import { equipmentCatalog, type Item } from './catalog';

const mod = (n: number) => Math.floor((n - 10) / 2);
const sign = (n: number) => `${n >= 0 ? '+' : ''}${n}`;
export const inUse = (i: Item) => i.equipped && i.quantity > 0;
export const magicActive = (i: Item) => inUse(i) && (!i.requiresAttunement || !!i.attuned);
export function armorClass(c: Character, i: Item): number | null {
  const p = i.armorProfile;
  return p ? p.baseAc + (p.addDex ? Math.min(mod(c.abilityScores.DEX), p.dexCap ?? Infinity) : 0) + ((!i.requiresAttunement || i.attuned) ? i.bonuses?.ac ?? 0 : 0) : null;
}
export const classLevel = (c: Character, key: string) => c.classes.filter(cl => cl.definitionRef?.kind === 'catalog' && cl.definitionRef.id === `srd51:class:${key}`).reduce((n, cl) => n + cl.level, 0);
/** Safe read-only fallback for early catalog instances. Never replace the player's text or stored profile. */
export function weaponProfile(i: Item) {
  return i.weaponProfile ?? (i.definitionRef?.kind === 'catalog' ? equipmentCatalog.find(d => d.catalogId === i.definitionRef!.id)?.weaponProfile : undefined);
}
export function hands(i: Item) { return i.grip ? i.grip === 'two' ? 2 : 1 : i.handUsage === 'two' ? 2 : 1; }
export function hasStyle(c: Character, style: string) {
  return c.features.some(f => f.sourceRef?.kind === 'catalog' && [
    `srd51:class:fighter-fighting-style-${style}`, `srd51:class:ranger-fighting-style-${style}`, `srd51:class:fighting-style-${style}`,
  ].includes(f.sourceRef.id));
}
const normalize = (s: string) => s.toLowerCase().split(':').at(-1)!.replaceAll(/[^a-z0-9]/g, '').replaceAll('crossbows','crossbow').replace(/s$/, '').replace(/^(hand|light|heavy)crossbow$/, 'crossbow$1');
export function weaponProficiency(c: Character, item: Item) {
  if (item.proficient !== undefined) return { value: item.proficient, source: 'Manuelt valg' };
  const p = weaponProfile(item);
  const key = item.definitionRef?.kind === 'catalog' ? item.definitionRef.id.split(':').at(-1)! : item.name;
  const matches = c.proficiencies.filter(row => row.category === 'weapon' && [normalize(key), normalize(item.name), p?.category === 'simple' ? 'simpleweapon' : p?.category === 'martial' ? 'martialweapon' : ''].filter(Boolean).includes(normalize(row.referenceId ?? row.name)));
  if (matches.length) return { value: matches.some(row => row.level !== 'none'), source: 'Registrert proficiency' };
  const allMartial = ['barbarian', 'fighter', 'paladin', 'ranger'];
  const simple = ['bard', 'cleric', 'druid', 'monk', 'rogue', 'warlock'];
  const individual: Record<string, string[]> = {
    bard:['crossbow,-hand','longsword','rapier','shortsword'], rogue:['crossbow,-hand','longsword','rapier','shortsword'],
    monk:['shortsword'], druid:['club','dagger','dart','javelin','mace','quarterstaff','scimitar','sickle','sling','spear'],
    sorcerer:['dagger','dart','sling','quarterstaff','crossbow,-light'], wizard:['dagger','dart','sling','quarterstaff','crossbow,-light'],
  };
  const found = c.classes.find((cl, index) => {
    const name = cl.definitionRef?.kind === 'catalog' ? cl.definitionRef.id.replace('srd51:class:', '') : '';
    return p && ((allMartial.includes(name) && p.category !== 'custom') || (p.category === 'simple' && simple.includes(name) && name !== 'druid' && (index === 0 || ['monk','warlock'].includes(name))) || ((index === 0 || name === 'monk') && individual[name]?.includes(key)));
  });
  return { value: !!found, source: found ? `${found.name}: våpenproficiency${c.classes.length > 1 && c.classes[0] === found ? ' (første registrerte klasse)' : ''}` : 'Ingen kjent proficiency; kan overstyres' };
}
/** Only explicit, unconditional item bonuses. Complex prose is never interpreted. */
export function itemBonuses(c: Character, target: 'ac' | 'saves') {
  const seen = new Set<string>();
  return [...c.items].filter(magicActive).sort((a,b)=>(b.bonuses?.[target] ?? 0)-(a.bonuses?.[target] ?? 0)).filter(i => {
    const key = i.definitionRef?.kind === 'catalog' && i.definitionRef.id.startsWith('srd51:magic-item:') ? i.definitionRef.id : i.id;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  }).filter(i => !!i.bonuses?.[target]).map(i => ({ name:i.name, amount:i.bonuses![target]! }));
}
/** First recorded class supplies starting proficiencies; later classes use 2014 multiclass grants.
 * Explicit sheet entries and per-weapon overrides always take precedence. */
function armorProficient(c: Character, item: Item): boolean | null {
  const kind = item.category === 'shield' ? 'shield' : item.armorProfile?.kind;
  const entries = c.proficiencies.filter(p => p.category === 'armor' && [normalize(item.name), normalize(`${kind} armor`), kind === 'shield' ? 'shield' : 'allarmor'].includes(normalize(p.referenceId ?? p.name)));
  if (entries.length) return entries.some(p=>p.level !== 'none');
  if (!kind || kind === 'custom' || !c.classes.length) return null;
  const allowed: Record<string,string[]> = {barbarian:['light','medium','shield'],bard:['light'],cleric:['light','medium','shield'],druid:['light','medium','shield'],fighter:['light','medium','heavy','shield'],paladin:['light','medium','heavy','shield'],ranger:['light','medium','shield'],rogue:['light'],warlock:['light'],monk:[],wizard:[],sorcerer:[]};
  let unknown = false;
  for (const [index, cl] of c.classes.entries()) {
    const key = cl.definitionRef?.kind === 'catalog' ? cl.definitionRef.id.replace('srd51:class:','') : '';
    if (!(key in allowed)) {unknown=true;continue;}
    if (key === 'cleric' && cl.subclass === 'Life Domain' && kind === 'heavy') return true;
    const grants = index === 0 ? allowed[key] : key === 'barbarian' ? ['shield'] : ['fighter','paladin'].includes(key) ? ['light','medium','shield'] : allowed[key];
    if (grants.includes(kind)) return true;
  }
  return unknown ? null : false;
}
export function equipmentWarnings(c: Character) {
  const items = c.items.filter(inUse), warnings: string[] = [];
  for (const i of items.filter(i=>['armor','shield'].includes(i.category))) {
    if (armorProficient(c,i) === false) warnings.push(`${i.name}: ingen kjent armor proficiency. Uten proficiency får du disadvantage på STR-/DEX-baserte ability checks, saves og attack rolls, og kan ikke kaste spells. Registrer eventuell annen tilgang under Proficiencies.`);
  }
  for (const i of items.filter(i=>i.category === 'weapon')) {
    if (hands(i) === 1 && weaponProfile(i)?.properties.includes('two-handed')) warnings.push(`${i.name}: Two-Handed-våpen er registrert med én hånd. Avtal unntaket med DM.`);
  }
  const handheld = items.filter(i => i.category === 'weapon' || i.category === 'shield');
  if (handheld.reduce((n, i) => n + hands(i), 0) > 2) warnings.push('Utstyret krever mer enn to hender. Velg hva du bruker samtidig, eller avtal unntak med DM.');
  if (items.some(i => i.category === 'shield') && items.some(i => i.category === 'weapon' && hands(i) === 2)) warnings.push('Tohåndsvåpen og skjold krever samme hånd. Kontroller oppsettet med DM.');
  if (c.items.filter(i => i.requiresAttunement && i.attuned).length > 3) warnings.push('Mer enn tre gjenstander er attuned. Kontroller med DM.');
  for (const i of items) if (i.requiresAttunement && !i.attuned) warnings.push(`${i.name}: krever attunement; magiske bonuser er ikke medregnet.`);
  const ids = items.filter(i => i.definitionRef?.kind === 'catalog' && i.definitionRef.id.startsWith('srd51:magic-item:') && i.bonuses && Object.values(i.bonuses).some(Boolean)).map(i => i.definitionRef!.id);
  if (new Set(ids).size !== ids.length) warnings.push('Flere eksemplarer av samme gjenstand er i bruk. Like magiske effekter stables ikke.');
  return warnings;
}
export interface WeaponStats { attack: string; damage: string; explanation: string[]; notes: string[]; range: string; offhand: boolean }
export function deriveWeapon(c: Character, i: Item, offhand = false): WeaponStats {
  const p = weaponProfile(i), notes: string[] = [], explanation: string[] = [];
  const ability = i.attackAbility ?? (p?.kind === 'ranged' ? (p.properties.includes('finesse') && c.abilityScores.STR > c.abilityScores.DEX ? 'STR' : 'DEX') : p?.properties.includes('finesse') && c.abilityScores.DEX > c.abilityScores.STR ? 'DEX' : 'STR');
  const monk = classLevel(c, 'monk');
  const monkWeapon = (item: Item) => { const v = weaponProfile(item);return !!v && (item.definitionRef?.id === 'srd51:equipment:shortsword' || (v.kind === 'melee' && v.category === 'simple' && !v.properties.some(p => ['two-handed','heavy'].includes(p)))); };
  const martialArts = monk > 0 && monkWeapon(i) && !c.items.some(item => inUse(item) && (['armor','shield'].includes(item.category) || (item.category === 'weapon' && !monkWeapon(item))));
  const chosenAbility = !i.attackAbility && martialArts && c.abilityScores.DEX > c.abilityScores[ability] ? 'DEX' : ability;
  const abilityBonus = mod(c.abilityScores[chosenAbility]), prof = weaponProficiency(c, i), pb = c.proficiencyBonusOverride ?? Math.ceil(c.level / 4) + 1;
  const magic = !i.requiresAttunement || i.attuned;
  const attackBonus = magic ? i.bonuses?.attack ?? 0 : 0, damageBonus = magic ? i.bonuses?.damage ?? 0 : 0;
  const archery = p?.kind === 'ranged' && hasStyle(c, 'archery') ? 2 : 0;
  const dueling = p?.kind === 'melee' && hands(i) === 1 && !c.items.some(other => other.id !== i.id && inUse(other) && other.category === 'weapon') && hasStyle(c, 'dueling') ? 2 : 0;
  explanation.push(`${chosenAbility} ${sign(abilityBonus)}`, `Proficiency ${prof.value ? sign(pb) : '+0'} (${prof.source})`);
  if (attackBonus) explanation.push(`Gjenstand: attack ${sign(attackBonus)}`);
  if (damageBonus) explanation.push(`Gjenstand: damage ${sign(damageBonus)}`);
  if (archery) explanation.push('Archery: attack +2');
  if (dueling) explanation.push('Dueling: damage +2');
  if (martialArts) explanation.push(`Monk ${monk}: Martial Arts`);
  let dice = hands(i) === 2 && p?.twoHandedDice && i.attackMode !== 'thrown' ? p.twoHandedDice : p?.dice;
  const monkDie = monk >= 17 ? 10 : monk >= 11 ? 8 : monk >= 5 ? 6 : 4;
  if (martialArts && dice && /^1d\d+$/.test(dice) && Number(dice.slice(2)) < monkDie) dice = `1d${monkDie}`;
  const damageAbility = offhand && !hasStyle(c, 'two-weapon-fighting') ? Math.min(0, abilityBonus) : abilityBonus;
  if (offhand) explanation.push(hasStyle(c, 'two-weapon-fighting') ? 'Two-Weapon Fighting: ability med på skade' : 'Off-hand: positiv ability modifier er ikke med på skade');
  const bonus = damageAbility + damageBonus + dueling;
  // Nonempty free-text totals are authoritative; empty fields mean automatic values. Known catalog base text is not an override.
  const definition = i.definitionRef?.kind === 'catalog' ? equipmentCatalog.find(d => d.catalogId === i.definitionRef!.id) : undefined;
  const manualDamage = !!i.damageOverride?.trim() || (!!i.damage?.trim() && (!p || i.damage !== definition?.damage));
  const damage = manualDamage ? (i.damageOverride ?? i.damage) || 'Ingen skade angitt' : dice ? `${dice}${bonus ? sign(bonus) : ''} ${p?.damageType.toLowerCase() ?? ''}` : 'Ingen skade';
  if (i.attack?.trim()) explanation.push('Attack: manuell total; øvrige angrepsbonuser er erstattet');
  if (manualDamage) explanation.push('Damage: manuell total; øvrige skadebonuser er erstattet');
  if (!p) notes.push('Ukjent våpenprofil. Angi profil eller manuelle totaler.');
  if (p?.special) notes.push(p.special);
  if (p?.properties.includes('heavy')) notes.push('Heavy: Small creatures har disadvantage.');
  if (p?.properties.includes('loading')) notes.push('Loading: ett prosjektil per action, bonus action eller reaction, uansett antall angrep.');
  if (p?.properties.includes('ammunition')) notes.push('Ammunition: trenger ammunisjon og en fri hånd for å lade et enhåndsvåpen.');
  if (hasStyle(c, 'great-weapon-fighting') && p?.kind === 'melee' && hands(i) === 2) notes.push('Great Weapon Fighting: kast om 1 og 2 på våpenets skadeterninger; behold det nye kastet.');
  const sneak = classLevel(c,'rogue');
  if (sneak && (p?.kind === 'ranged' || p?.properties.includes('finesse'))) notes.push(`Sneak Attack: +${Math.ceil(sneak/2)}d6 én gang per tur når vilkårene er oppfylt; ikke inkludert i grunnskaden.`);
  if (!magic) notes.push('Magiske bonuser krever attunement og er ikke medregnet.');
  return {attack:i.attack?.trim() ? i.attack : (p ? `d20${sign(abilityBonus + (prof.value ? pb : 0) + attackBonus + archery)}` : 'Ikke angitt'), damage, explanation, notes,
    range:(i.attackMode === 'thrown' ? p?.thrownRange : p?.kind === 'melee' && p.properties.includes('reach') ? '10 ft' : p?.range) ?? '', offhand};
}
export function offhandWeapons(c: Character) {
  const weapons = c.items.filter(i => inUse(i) && i.category === 'weapon' && hands(i) === 1 && weaponProfile(i)?.kind === 'melee' && weaponProfile(i)?.properties.includes('light'));
  return weapons.length >= 2 ? weapons : [];
}
