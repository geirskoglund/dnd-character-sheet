import {effectiveAbilities,effectiveMaxHp,itemAdjustment,itemActive} from '../domain/item-effects';
import {itemCombatEffects,itemHandLabel} from './equipment-markup';
import {extraDamageMarkup} from './equipment-wizard';
import {spellSources,preparationLimit,spellUsable} from '../domain/magic';
import {icon, sectionTitle, type UIIcon} from './icons';
import {traitIcon, featureIcon, spellIcon, itemIcon, damageIcon} from '../domain/iconography';
import { abilities, type Character } from '../domain/model';
import { escapeHtml as esc } from './html';
import { abilityModifier, modifiers, signed } from '../domain/modifiers';
import { deriveStats } from '../domain/derived';
import { armorClass, deriveWeapon, inUse, offhandWeapons } from '../domain/equipment';
const pill = (attributes: string, name: string, detail = '', glyph: UIIcon = 'emblem', state = '') => `<button class="pill ${name==='+'?'add-pill':''}" ${attributes}>${name==='+'?'':icon(glyph)}<span class="pill-name">${esc(name)}</span>${detail ? `<small>${esc(detail)}</small>` : ''}${state?`<small class="state-mark">${icon('check')}${esc(state)}</small>`:''}</button>`;
const add = (collection: string, label: string) => pill(`data-add="${collection}" aria-label="${esc(label)}"`, '+');
const families:Record<string,UIIcon>={feature:'feature',spell:'magic',resource:'resource',language:'speech',proficiency:'tools',defense:'protection',immunity:'protection',action:'feature',rest:'moon',conditions:'condition',deathSaves:'healing'};
const record = (collection: string, id: string, name: string, detail = '', glyph: UIIcon = families[collection] ?? 'emblem', state = '') => pill(`data-record="${collection}:${esc(id)}"`, name, detail, glyph, state);
const sections:Record<string,UIIcon>={'Artsegenskaper':'species','Class Features & Feats':'feat','Cantrips':'magic','Spells':'feature','Spell slots':'resource','Hit Dice':'resource','Ressurser':'resource','Languages':'speech','Proficiencies':'tools','Skadeegenskaper':'protection','Tilstandsimmuniteter':'protection','Notater':'note','Tilstander':'condition','Egne handlinger':'feature','Andre egenskaper':'magic'};
const section = (name: string, content: string, extra = '') => `<section aria-label="${esc(name)}">${sectionTitle(name,sections[name] ?? 'feature')}<div class="pills">${content}${extra}</div></section>`;
function abilityCoins(c:Character){const scores=effectiveAbilities(c);return `<dl class="abilities">${abilities.map(a=>`<div class="ability-coin"><dt class="sr-only">${a}</dt><dd><svg viewBox="0 0 80 80" aria-hidden="true"><defs><path id="ability-${a}" d="M17 43 A23 23 0 0 1 63 43"/></defs><circle class="coin-face" cx="40" cy="40" r="38"/><circle class="coin-ring" cx="40" cy="40" r="34.5"/><path class="coin-tick" d="M5 40h4m62 0h4"/><text class="coin-label" text-anchor="middle"><textPath href="#ability-${a}" startOffset="50%" textLength="27" lengthAdjust="spacing">${a}</textPath></text><text class="coin-score" x="40" y="48" text-anchor="middle">${scores[a]}</text><text class="coin-mod" x="40" y="65" text-anchor="middle">${signed(abilityModifier(scores[a]))}</text></svg><span class="sr-only">${scores[a]}, modifier ${signed(abilityModifier(scores[a]))}</span></dd></div>`).join('')}</dl>`;}
export function characterView(c: Character) {
  const stats = deriveStats(c), options = modifiers(c);
  const featureDetail=(row: Character['features'][number])=>row.resourceRefs.map(id=>c.resources.find(pool=>pool.id===id)).filter(pool=>!!pool).map(pool=>`${pool.current}/${pool.max}`).join(' · ') || (row.category==='feat'?'Feat':'');
  const baseLanguages = c.species.languages.filter(name => !c.languages.some(row => row.name.toLowerCase() === name.toLowerCase()));

  return `<section aria-label="Karakterstatus" class="stats">
    <div><small>HP</small><strong>${c.hp.current} <em>/ ${effectiveMaxHp(c)}</em></strong></div>
    <div><small>AC</small><strong>${stats.ac}</strong></div>
    <div><small>Initiative</small><strong>${signed(c.derivedOverrides.initiative ?? abilityModifier(effectiveAbilities(c).DEX)+itemAdjustment(c,'initiative'))}</strong></div>
    <button data-action="money"><small>GP</small><strong>${(c.goldCp / 100).toFixed(2)}</strong></button>
    <div><small>Speed</small><strong>${stats.speed ?? '—'} ft</strong></div>
  </section>
  <section aria-label="Modifierfavoritter" class="modifier-section">${sectionTitle('Modifiers','feather')}<div class="modifier-grid">${c.favoriteModifierRefs.map((ref, i) => {const mod = options.find(m => m.ref === ref); return `<button data-modifier="${i}"><span>${esc(mod?.name ?? ref)}</span><strong>${mod ? signed(mod.value) : '—'}</strong></button>`;}).join('')}</div></section>
  <section aria-label="Ability scores">${sectionTitle('Ability scores','magic')}${abilityCoins(c)}</section>
  ${section('Artsegenskaper',c.species.traits.map((t,i)=>pill(`data-trait="${i}"`,t.name,'',traitIcon(t))).join('') + c.features.filter(row=>row.category==='species').map(row=>record('feature',row.id,row.name,'',featureIcon(row))).join(''),add('species','Legg til artsegenskap'))}
  ${section('Class Features & Feats',c.features.filter(row=>row.category!=='species').map(row=>record('feature',row.id,row.name,featureDetail(row),featureIcon(row))).join(''),add('feature','Legg til egenskap eller feat'))}
  ${resourceGroup(c,'custom','Beholdninger',true)}
  ${section('Egne handlinger',c.actions.filter(row=>!row.sourceRef).map(row=>record('action',row.id,row.name,({action:'Action',bonus:'Bonus',reaction:'Reaction',none:'Annen',passive:'Passiv'})[row.actionEconomy],row.iconKey ?? 'feature')).join(''),add('action','Legg til egen handling'))}
  ${section('Tilstander',pill(`data-record="inspiration" aria-pressed="${c.inspiration}"`,'Inspiration',c.inspiration?'Ja':'Nei','luck') + record('deathSaves','', 'Death saves', `${c.deathSaves.successes} ✓ / ${c.deathSaves.failures} ✕`) + record('conditions','', 'Conditions', c.conditions.length?c.conditions.join(', '):'Ingen') + record('conditions','', 'Exhaustion', String(c.exhaustionLevel)),pill('data-record="rest"','Hvile','','moon'))}
  ${section('Languages',baseLanguages.map(name=>record('language',`base:${c.species.languages.indexOf(name)}`,name)).join('') + c.languages.map(row=>record('language',row.id,row.name)).join(''),add('language','Legg til språk'))}
  ${section('Proficiencies',c.skills.map(row=>record('proficiency',`skill:${row.skillId}`,row.skillId.split(':').at(-1)!.replaceAll('-',' '),row.proficiencyLevel==='expertise'?'Expertise':row.proficiencyLevel==='none'?'Manuell':'Skill')).join('') + c.saves.map(row=>record('proficiency',`save:${row.abilityId}`,`${row.abilityId} save`,row.proficiencyLevel==='expertise'?'Expertise':'Proficient')).join('') + c.proficiencies.map(row=>record('proficiency',row.id,row.name,({armor:'Armor',weapon:'Weapon',tool:'Tool',other:'Annet'})[row.category])).join(''),add('proficiency','Legg til proficiency'))}
  ${section('Skadeegenskaper',c.items.filter(itemActive).flatMap(i=>(i.protections??[]).filter(p=>p.kind!=='conditionImmunity').map(p=>pill(`data-item="${i.id}"`,p.subject,p.kind+' · '+i.name+(p.condition?' · vilkår':''),'protection'))).join('') + c.damageDefenses.map(row=>record('defense',row.id,row.damageType,`${({resistance:'Resistance',vulnerability:'Vulnerability',immunity:'Immunity'})[row.kind]}${row.condition?' · vilkår':''}`,damageIcon(row.damageType) ?? 'protection')).join(''),add('defense','Legg til skadeegenskap'))}
  ${section('Tilstandsimmuniteter',c.items.filter(itemActive).flatMap(i=>(i.protections??[]).filter(p=>p.kind==='conditionImmunity').map(p=>pill(`data-item="${i.id}"`,p.subject,i.name+(p.condition?' · vilkår':''),'protection'))).join('') + c.conditionImmunities.map(row=>record('immunity',row.id,row.conditionId)).join(''),add('immunity','Legg til tilstandsimmunitet'))}
  ${section('Notater',c.notes.map(n=>pill(`data-note="${n.id}"`,n.title,'','note')).join(''),pill('data-action="note" aria-label="Legg til notat"','+'))}`;
}
export function equipmentView(c: Character) {
  const stats = deriveStats(c);
  return `<section aria-label="Utstyrsoversikt">${sectionTitle('Utstyr','equipment')}
    ${stats.warnings.map(w=>`<p class="warning">${esc(w)}</p>`).join('')}</section>
    <section class="consumables-section"><h2><button class="consumables-entry" data-action="consumables">${icon('potion')}<span>Forbruksvarer</span><small>${c.consumables.length} varer</small></button></h2></section>
    ${([
      ['weapon','Weapons',['weapon']], ['armor','Armor og skjold',['armor','shield']], ['other','Annet utstyr',['equipment','magic']],
    ] as const).map(([group,label,categories])=>`<section class="equipment-group" data-equipment-kind="${group}" role="group" aria-label="${label}">${sectionTitle(label,group==='weapon'?'sword':group==='armor'?'shield':'equipment')}<div class="pills">${[...c.items].filter(item=>(categories as readonly string[]).includes(item.category)).sort((a,b)=>Number(inUse(b))-Number(inUse(a))).map(item=>{
      const weapon = item.category === 'weapon' ? deriveWeapon(c,item) : undefined;
      const armorValue = armorClass(c,item);
      const detail = weapon ? `${weapon.attack} · ${weapon.damage}` : item.armorProfile ? `AC ${armorValue}` : item.category === 'shield' ? `AC +${(item.acContribution ?? 2) + ((!item.requiresAttunement || item.attuned) ? item.bonuses?.ac ?? 0 : 0)}` : item.requiresAttunement ? item.attuned ? 'Attuned' : 'Krever attunement' : '';
      return pill(`data-item="${item.id}" aria-label="${esc(item.name)} · ${inUse(item)?'i bruk':'eid'}${item.quantity!==1?` · ×${item.quantity}`:''}" aria-pressed="${inUse(item)}"`,item.name,`${detail}${!inUse(item)?`${detail?' · ':''}I sekken`:''}`,itemIcon(item),inUse(item)?itemHandLabel(c,item):'').replace('</button>',extraDamageMarkup(item)+'</button>');
    }).join('')}${pill(`data-equipment-group="${group}" aria-label="Legg til ${label.toLowerCase()}"`,'+')}</div></section>`).join('')}`;
}
export function combatView(c: Character, category: string) {
  const stats = deriveStats(c);
  const economy = ({Action:'action',Bonus:'bonus',Reaction:'reaction'} as const)[category as 'Action'|'Bonus'|'Reaction'];
  const actionPills = (rows: Character['actions']) => rows.map(row=>pill(`data-lookup="action:${row.id}"`,row.name,row.resourceRefs.map(id=>c.resources.find(pool=>pool.id===id)).filter(pool=>!!pool).map(pool=>`${pool.name}: ${pool.current}/${pool.max}`).join(' · '),row.iconKey ?? (row.sourceRef?.kind==='feature' ? featureIcon(c.features.find(f=>f.id===row.sourceRef!.id) ?? {name:row.name,category:'custom'}) : 'feature'))).join('');
  const weapons = economy === 'action' ? c.items.filter(i=>inUse(i) && i.category==='weapon') : economy === 'bonus' ? offhandWeapons(c) : [];
  const weaponCards=weapons.map(item=>{
    const value=deriveWeapon(c,item,economy==='bonus');
    return `<button class="weapon-attack" data-lookup="${economy==='bonus'?'offhand':'weapon'}:${item.id}" aria-label="${esc(item.name)}${economy==='bonus'?' · Off-hand':''} · ${esc(value.attack)} · ${esc(value.damage)}"><span class="weapon-name">${icon(itemIcon(item))}<span>${esc(item.name)}${economy==='bonus'?' · Off-hand':''}</span></span><small class="weapon-hand">${esc(itemHandLabel(c,item))}</small><span class="weapon-rolls"><span><small>Angrep</small><strong>${esc(value.attack)}</strong></span><span><small>Skade</small><strong>${esc(value.damage)}</strong></span></span>${extraDamageMarkup(item)}</button>`;
  }).join('');
  const actions=c.actions.filter(row=>row.actionEconomy===economy);
  const others=c.actions.filter(row=>['none','passive'].includes(row.actionEconomy));
  const spells=c.spells.filter(row=>row.actionEconomy===economy && spellUsable(c,row));
  return `<section aria-label="HP i Combat" class="combat-health"><button data-action="hp"><small>HP</small><strong>${c.hp.current} / ${effectiveMaxHp(c)}</strong></button><button data-action="temp-hp"><small>Temporary HP</small><strong>${c.hp.temp}</strong></button><div><small>AC</small><strong>${stats.ac}</strong></div><div><small>Initiative</small><strong>${signed(c.derivedOverrides.initiative ?? abilityModifier(effectiveAbilities(c).DEX)+itemAdjustment(c,'initiative'))}</strong></div></section>
    ${resourceGroup(c,'spellSlot','Spell slots')}<section aria-label="Kampoppslag"><div class="combat-tabs" role="group" aria-label="Handlingskategori">${['Action', 'Bonus', 'Reaction'].map(name => `<button aria-pressed="${category === name}" data-category="${name}">${name}</button>`).join('')}</div>
    ${weapons.length?`<div class="combat-attacks">${weaponCards}</div>`:''}${itemCombatEffects(c,economy)}${actions.length || spells.length ? `<div class="pills combat-choices">${actionPills(actions)}${spells.map(row=>pill(`data-lookup="spell:${row.id}"`,row.name,row.spellLevel ? `Lvl ${row.spellLevel}` : '∞',spellIcon(row))).join('')}</div>` : weapons.length||itemCombatEffects(c,economy)?'':'<p class="empty muted">Ingen registrerte oppslag i denne kategorien.</p>'}</section>
    ${others.length||itemCombatEffects(c,'other')?section('Andre egenskaper',actionPills(others))+itemCombatEffects(c,'other'):''}<div class="combat-tools"><button data-action="consumables">${icon('potion')}<span>Forbruksvarer</span></button><button data-action="hp-change">${icon('healing')}<span>Ta skade</span></button><button data-record="rest">${icon('moon')}<span>Hvile</span></button></div>`;
}

export function resourceGroup(c:Character,kind:Character['resources'][number]['kind'],label:string,allowAdd=false){
 const rows=c.resources.filter(pool=>pool.kind===kind);if(!rows.length&&!allowAdd)return '';
 return section(label,rows.map(pool=>record('resource',pool.id,pool.name,`${pool.current} / ${pool.max}${pool.die?' · '+pool.die:''}`)).join(''),allowAdd?add(`resource-${kind}`,`Legg til ${label.toLowerCase()}`):'');
}
export function magicView(c:Character){
 const sources=spellSources(c),pb=c.proficiencyBonusOverride??Math.ceil(c.level/4)+1;
 const casting=sources.filter(s=>s.ability).map(s=>`<div><strong>${esc(s.label)}</strong><span>Spell attack ${signed(pb+abilityModifier(effectiveAbilities(c)[s.ability!]))} · Save DC ${8+pb+abilityModifier(effectiveAbilities(c)[s.ability!])}</span></div>`).join('');
 return `<section aria-label="Magi">${sectionTitle('Magi','magic')}<div class="casting-values">${casting}</div><div class="magic-tools">${c.classes.some(cl=>preparationLimit(c,cl)!==null)?'<button data-action="prepare">Forbered spells</button>':''}<button data-record="rest">Hvile</button></div></section>
 ${section('Cantrips',c.spells.filter(row=>row.spellLevel===0).map(row=>record('spell',row.id,row.name,'∞'+(row.sourceLabel?' · '+row.sourceLabel:''),spellIcon(row))).join(''),add('cantrip','Legg til cantrip'))}
 ${section('Spells',c.spells.filter(row=>row.spellLevel>0).sort((a,b)=>a.spellLevel-b.spellLevel||a.name.localeCompare(b.name)).map(row=>record('spell',row.id,row.name,`Lvl ${row.spellLevel}${row.inSpellbook?' · Spellbook':''}${row.sourceLabel?' · '+row.sourceLabel:''}`,spellIcon(row),row.alwaysPrepared?'Alltid forberedt':row.prepared?'Forberedt':'')).join(''),add('spell','Legg til spell'))}
 ${resourceGroup(c,'spellSlot','Spell slots')}
 <details><summary>Manuelt slotoppsett</summary><button data-add="resource-spellSlot">Legg til egen slotbeholdning</button></details>`;
}
