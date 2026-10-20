import type {Character} from './model';

/** Visual vocabulary only: these choices never assign rules or character eligibility. */
export const iconLabels = {
  emblem:'Nøytralt emblem', feature:'Egenskap', feat:'Feat', species:'Art', vision:'Syn', mind:'Sinn',
  moon:'Måne / hvile', luck:'Flaks', movement:'Bevegelse', healing:'Healing', protection:'Beskyttelse',
  hand:'Manipulasjon / nytte', strength:'Styrke', magic:'Magi', speech:'Språk', tools:'Verktøy', note:'Notat', resource:'Ressurs', condition:'Tilstand',
  sword:'Sverd', axe:'Øks', bow:'Bue', crossbow:'Armbrøst', dagger:'Dolk', hammer:'Hammer', spear:'Spyd', whip:'Pisk',
  'armor-light':'Lett rustning', 'armor-medium':'Middels rustning', 'armor-heavy':'Tung rustning', shield:'Skjold',
  equipment:'Utstyr', cloak:'Kappe', ring:'Ring', fire:'Ild', cold:'Kulde', acid:'Syre', lightning:'Lyn',
  thunder:'Torden', poison:'Gift', necrotic:'Nekrotisk', radiant:'Strålende', force:'Kraft', psychic:'Psykisk',
  piercing:'Piercing', slashing:'Slashing', bludgeoning:'Bludgeoning', illusion:'Illusjon', teleport:'Teleportering',
  control:'Kontroll', light:'Lys', nature:'Natur',
} as const;
export type IconKey = keyof typeof iconLabels;
export const iconKeys = Object.keys(iconLabels) as [IconKey, ...IconKey[]];
const damageIcons = Object.fromEntries(['fire','cold','acid','lightning','thunder','poison','necrotic','radiant','force','psychic','piercing','slashing','bludgeoning'].map(k=>[k,k])) as Record<string,IconKey>;
export function damageIcon(text: string): IconKey | undefined {
  const types = Object.keys(damageIcons).filter(k=>new RegExp(`\\b${k}\\b`,'i').test(text));
  return types.length === 1 ? damageIcons[types[0]] : undefined;
}
const spellGroups: Partial<Record<IconKey,string[]>> = {
  healing:['cure-wounds','healing-word','mass-cure-wounds','mass-healing-word','heal','mass-heal','regenerate','spare-the-dying','revivify','raise-dead','resurrection','true-resurrection'],
  protection:['shield','shield-of-faith','mage-armor','protection-from-evil-and-good','protection-from-energy','death-ward','stoneskin','sanctuary','counterspell','dispel-magic','resistance'],
  teleport:['misty-step','dimension-door','teleport','teleportation-circle','plane-shift','word-of-recall','gate','transport-via-plants'],
  movement:['fly','levitate','jump','longstrider','expeditious-retreat','haste','feather-fall','spider-climb','water-walk'],
  illusion:['minor-illusion','silent-image','major-image','disguise-self','mirror-image','invisibility','greater-invisibility','blur','hallucinatory-terrain','programmed-illusion'],
  control:['hold-person','hold-monster','entangle','web','slow','command','suggestion','mass-suggestion','dominate-person','dominate-monster','sleep','charm-person','hypnotic-pattern'],
  light:['light','dancing-lights','daylight','faerie-fire','sunbeam','sunburst'],
  vision:['detect-magic','detect-evil-and-good','detect-poison-and-disease','identify','true-seeing','see-invisibility','scrying','clairvoyance','darkvision'],
  speech:['comprehend-languages','tongues','sending','message','speak-with-animals','speak-with-plants','speak-with-dead'],
  hand:['mage-hand','mending','prestidigitation','unseen-servant','arcane-lock','knock'],
  nature:['druidcraft','plant-growth','animal-friendship','find-familiar','conjure-animals','barkskin','shillelagh'],
};
export function spellIcon(row: Pick<Character['spells'][number],'definitionRef'|'damage'|'iconKey'>): IconKey {
  if(row.iconKey) return row.iconKey;
  const damage = damageIcon(row.damage ?? '');
  if(damage) return damage;
  const id=row.definitionRef?.kind==='catalog' ? row.definitionRef.id.replace(/^srd51:spell:/,'') : '';
  return (Object.entries(spellGroups).find(([,ids])=>ids!.includes(id))?.[0] as IconKey|undefined) ?? 'magic';
}
const traitIcons: Record<string,IconKey> = {
  'darkvision':'vision','fey ancestry':'mind','trance':'moon','dwarven speed':'movement','draconic ancestry':'nature',
  'gnome cunning':'mind','relentless endurance':'strength','lucky':'luck','extra language':'speech','hellish resistance':'fire',
};
export function traitIcon(row:{name:string;iconKey?:IconKey}):IconKey {return row.iconKey ?? traitIcons[row.name.toLowerCase()] ?? 'species';}
export function featureIcon(row:Pick<Character['features'][number],'name'|'category'|'sourceRef'|'iconKey'>): IconKey {
  if(row.iconKey) return row.iconKey;
  if(row.category==='species') return traitIcon(row);
  const id=row.sourceRef?.kind==='catalog'?row.sourceRef.id.replace(/^srd51:(class|feat):/,''):'';
  if(/^(sneak-attack|extra-attack|improved-critical|brutal-critical|fighting-style|martial-arts|multiattack)/.test(id)) return 'sword';
  if(/^(rage|reckless-attack|action-surge|indomitable|relentless)/.test(id)) return 'strength';
  if(/^(cunning-action|fast-hands|unarmored-movement|evasion|step-of-the-wind)/.test(id)) return 'movement';
  if(/^(uncanny-dodge|unarmored-defense|deflect-missiles|danger-sense|divine-health|aura-of-protection)/.test(id)) return 'protection';
  if(/^(second-wind|lay-on-hands|wholeness-of-body|healing|preserve-life)/.test(id)) return 'healing';
  if(/^(spellcasting|pact-magic|arcane|mystic|eldritch)/.test(id)) return 'magic';
  if(/^(wild-shape|natural|favored-enemy|primeval)/.test(id)) return 'nature';
  return row.category==='feat'?'feat':row.category==='custom'?'emblem':'feature';
}
const weaponFamilies: Partial<Record<IconKey,string[]>> = {
  sword:['longsword','shortsword','greatsword','scimitar','rapier'], dagger:['dagger'],
  bow:['shortbow','longbow'], crossbow:['crossbow-light','crossbow-heavy','crossbow-hand'],
  axe:['handaxe','battleaxe','greataxe','halberd'], hammer:['club','greatclub','mace','maul','warhammer','light-hammer','flail','morningstar'],
  spear:['spear','javelin','lance','pike','quarterstaff','trident','glaive'], whip:['whip'],
};
export function itemIcon(row:Pick<Character['items'][number],'category'|'definitionRef'|'armorProfile'|'iconKey'|'weaponProfile'>):IconKey {
  if(row.iconKey) return row.iconKey;
  const id=row.definitionRef?.kind==='catalog'?row.definitionRef.id.replace(/^srd51:(equipment|magic-item):/,'').replaceAll(',',''):'';
  if(row.category==='weapon') return (Object.entries(weaponFamilies).find(([,ids])=>ids!.includes(id))?.[0] as IconKey|undefined) ?? (row.weaponProfile?.kind==='ranged'?'bow':'sword');
  if(row.category==='armor'){
    const kind=row.armorProfile?.kind;
    if(kind && kind!=='custom')return `armor-${kind}`;
    if(['leather','studded-leather','padded'].includes(id))return 'armor-light';
    if(['chain-mail','ring-mail','plate','splint'].includes(id))return 'armor-heavy';
    return 'armor-medium';
  }
  if(row.category==='shield') return 'shield';
  if(id==='cloak-of-protection') return 'cloak';
  if(id==='ring-of-protection') return 'ring';
  if(/(tools|kit|supplies|instrument|hammer|crowbar|pick|miner's|shovel)/.test(id)) return 'tools';
  if(/(book|paper|parchment|ink|map|scroll)/.test(id)) return 'note';
  if(/(torch|lantern|lamp|candle)/.test(id)) return 'light';
  if(/(potion|healer)/.test(id)) return 'healing';
  return row.category==='magic'?'magic':'equipment';
}
