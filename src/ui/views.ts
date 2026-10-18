import { abilities, type Character } from '../domain/model';
import { escapeHtml as esc } from './html';
import { abilityModifier, modifiers, signed } from '../domain/modifiers';
import { deriveStats } from '../domain/derived';
const pill = (attributes: string, name: string, detail = '') => `<button class="pill" ${attributes}><span>${esc(name)}</span>${detail ? `<small>${esc(detail)}</small>` : ''}</button>`;
const add = (collection: string, label: string) => pill(`data-add="${collection}" aria-label="${esc(label)}"`, '+');
const record = (collection: string, id: string, name: string, detail = '') => pill(`data-record="${collection}:${esc(id)}"`, name, detail);
const section = (name: string, content: string, extra = '') => `<section aria-label="${esc(name)}"><h2>${esc(name)}</h2><div class="pills">${content}${extra}</div></section>`;
export function characterView(c: Character) {
  const stats = deriveStats(c), options = modifiers(c);
  const featureDetail=(row: Character['features'][number])=>row.resourceRefs.map(id=>c.resources.find(pool=>pool.id===id)).filter(pool=>!!pool).map(pool=>`${pool.current}/${pool.max}`).join(' · ') || (row.category==='feat'?'Feat':'');
  const baseLanguages = c.species.languages.filter(name => !c.languages.some(row => row.name.toLowerCase() === name.toLowerCase()));
  const resourceGroup = (kind: Character['resources'][number]['kind'], label: string) => section(label,c.resources.filter(pool=>pool.kind===kind).map(pool=>record('resource',pool.id,pool.name,`${pool.current} / ${pool.max}${pool.kind==='spellSlot' ? ` · lvl ${pool.spellLevel ?? '?'}` : pool.kind==='hitDie' ? ` · ${pool.die ?? '?'}` : ''}`)).join(''),add(`resource-${kind}`,`Legg til ${label.toLowerCase()}`));
  return `<section aria-label="Karakterstatus" class="stats">
    <div><small>HP</small><strong>${c.hp.current} / ${c.hp.max}</strong></div>
    <div><small>AC</small><strong>${stats.ac}</strong></div>
    <div><small>Initiative</small><strong>${signed(c.derivedOverrides.initiative ?? abilityModifier(c.abilityScores.DEX))}</strong></div>
    <button data-action="money"><small>GP</small><strong>${(c.goldCp / 100).toFixed(2)}</strong></button>
    <div><small>Speed</small><strong>${stats.speed ?? '—'} ft</strong></div>
  </section>
  ${stats.warnings.length ? `<p class="warning calculation-warning">${stats.warnings.map(esc).join('<br>')}</p>` : ''}
  <section aria-label="Modifierfavoritter" class="modifier-section"><h2>Modifiers</h2><div class="modifier-grid">${c.favoriteModifierRefs.map((ref, i) => {const mod = options.find(m => m.ref === ref); return `<button data-modifier="${i}"><span>${esc(mod?.name ?? ref)}</span><strong>${mod ? signed(mod.value) : '—'}</strong></button>`;}).join('')}</div></section>
  <section aria-label="Ability scores"><h2>Ability scores</h2><dl class="abilities">${abilities.map(a => `<div><dt>${a}</dt><dd>${c.abilityScores[a]}<small class="ability-mod">${signed(abilityModifier(c.abilityScores[a]))}</small></dd></div>`).join('')}</dl></section>
  ${section('Artsegenskaper',c.species.traits.map((t,i)=>pill(`data-trait="${i}"`,t.name)).join('') + c.features.filter(row=>row.category==='species').map(row=>record('feature',row.id,row.name)).join(''),add('species','Legg til artsegenskap'))}
  ${section('Class Features & Feats',c.features.filter(row=>row.category!=='species').map(row=>record('feature',row.id,row.name,featureDetail(row))).join(''),add('feature','Legg til egenskap eller feat'))}
  ${section('Cantrips',c.spells.filter(row=>row.spellLevel===0).map(row=>record('spell',row.id,row.name,'∞')).join(''),add('cantrip','Legg til cantrip'))}
  ${section('Spells',c.spells.filter(row=>row.spellLevel>0).sort((a,b)=>a.spellLevel-b.spellLevel || a.name.localeCompare(b.name)).map(row=>record('spell',row.id,row.name,`Lvl ${row.spellLevel}${row.prepared ? ' · prepared' : ''}`)).join(''),add('spell','Legg til spell'))}
  ${resourceGroup('spellSlot','Spell slots')}
  <section aria-label="Utstyr"><h2>Utstyr</h2>${([
    ['weapon','Weapons',['weapon']], ['armor','Armor og skjold',['armor','shield']], ['other','Annet utstyr',['equipment','magic']],
  ] as const).map(([group,label,categories])=>`<div class="equipment-group" role="group" aria-label="${label}"><h3>${label}</h3><div class="pills">${[...c.items].filter(item=>(categories as readonly string[]).includes(item.category)).sort((a,b)=>Number(b.equipped)-Number(a.equipped)).map(item=>pill(`data-item="${item.id}" aria-pressed="${item.equipped}"`,item.name,`· ${item.equipped?'utstyrt':'eid'}${item.quantity!==1?` · ×${item.quantity}`:''}`)).join('')}${pill(`data-equipment-group="${group}" aria-label="Legg til ${label.toLowerCase()}"`,'+')}</div></div>`).join('')}</section>
  ${resourceGroup('hitDie','Hit Dice')}
  ${resourceGroup('custom','Ressurser')}
  ${section('Egne handlinger',c.actions.filter(row=>!row.sourceRef).map(row=>record('action',row.id,row.name,({action:'Action',bonus:'Bonus',reaction:'Reaction',none:'Annen',passive:'Passiv'})[row.actionEconomy])).join(''),add('action','Legg til egen handling'))}
  ${section('Tilstander',pill(`data-record="inspiration" aria-pressed="${c.inspiration}"`,'Inspiration',c.inspiration?'Ja':'Nei') + record('deathSaves','', 'Death saves', `${c.deathSaves.successes} ✓ / ${c.deathSaves.failures} ✕`) + record('conditions','', 'Conditions', c.conditions.length?c.conditions.join(', '):'Ingen') + record('conditions','', 'Exhaustion', String(c.exhaustionLevel)),pill('data-record="rest"','Hvile'))}
  ${section('Languages',baseLanguages.map(name=>record('language',`base:${c.species.languages.indexOf(name)}`,name)).join('') + c.languages.map(row=>record('language',row.id,row.name)).join(''),add('language','Legg til språk'))}
  ${section('Proficiencies',c.skills.map(row=>record('proficiency',`skill:${row.skillId}`,row.skillId.split(':').at(-1)!.replaceAll('-',' '),row.proficiencyLevel==='expertise'?'Expertise':row.proficiencyLevel==='none'?'Manuell':'Skill')).join('') + c.saves.map(row=>record('proficiency',`save:${row.abilityId}`,`${row.abilityId} save`,row.proficiencyLevel==='expertise'?'Expertise':'Proficient')).join('') + c.proficiencies.map(row=>record('proficiency',row.id,row.name,({armor:'Armor',weapon:'Weapon',tool:'Tool',other:'Annet'})[row.category])).join(''),add('proficiency','Legg til proficiency'))}
  ${section('Skadeegenskaper',c.damageDefenses.map(row=>record('defense',row.id,row.damageType,`${({resistance:'Resistance',vulnerability:'Vulnerability',immunity:'Immunity'})[row.kind]}${row.condition?' · vilkår':''}`)).join(''),add('defense','Legg til skadeegenskap'))}
  ${section('Tilstandsimmuniteter',c.conditionImmunities.map(row=>record('immunity',row.id,row.conditionId)).join(''),add('immunity','Legg til tilstandsimmunitet'))}
  ${section('Notater',c.notes.map(n=>pill(`data-note="${n.id}"`,n.title)).join(''),pill('data-action="note" aria-label="Legg til notat"','+'))}`;
}
export function combatView(c: Character, category: string) {
  const stats = deriveStats(c);
  const economy = ({Action:'action',Bonus:'bonus',Reaction:'reaction'} as const)[category as 'Action'|'Bonus'|'Reaction'];
  const actionPills = (rows: Character['actions']) => rows.map(row=>pill(`data-lookup="action:${row.id}"`,row.name,row.resourceRefs.map(id=>c.resources.find(pool=>pool.id===id)).filter(pool=>!!pool).map(pool=>`${pool.name}: ${pool.current}/${pool.max}`).join(' · '))).join('');
  const actions=c.actions.filter(row=>row.actionEconomy===economy);
  const spells=c.spells.filter(row=>row.actionEconomy===economy && (row.spellLevel===0 || row.prepared || (row.known && !row.inSpellbook)));
  return `<section aria-label="HP i Combat" class="combat-health"><button data-action="hp"><small>HP</small><strong>${c.hp.current} / ${c.hp.max}</strong></button><button data-action="temp-hp"><small>Temporary HP</small><strong>${c.hp.temp}</strong></button><div><small>AC</small><strong>${stats.ac}</strong></div><div><small>Initiative</small><strong>${signed(c.derivedOverrides.initiative ?? abilityModifier(c.abilityScores.DEX))}</strong></div></section>
    <section aria-label="Kampoppslag"><div class="combat-tabs" role="group" aria-label="Handlingskategori">${['Action', 'Bonus', 'Reaction'].map(name => `<button aria-pressed="${category === name}" data-category="${name}">${name}</button>`).join('')}</div>
    ${actions.length || spells.length ? `<div class="pills combat-choices">${actionPills(actions)}${spells.map(row=>pill(`data-lookup="spell:${row.id}"`,row.name,row.spellLevel ? `Lvl ${row.spellLevel}` : '∞')).join('')}</div>` : '<p class="empty muted">Ingen registrerte oppslag i denne kategorien.</p>'}</section>
    ${section('Andre egenskaper',actionPills(c.actions.filter(row=>['none','passive'].includes(row.actionEconomy))),pill('data-record="rest"','Hvile'))}`;
}
