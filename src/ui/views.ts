import { abilities, type Character } from '../domain/model';
import { escapeHtml as esc, field } from './html';
export function characterView(c: Character) {
  return `<section aria-label="Karakterstatus" class="stats">
    <div><small>HP</small><strong>${c.hp.current} / ${c.hp.max}</strong></div>
    <div><small>Temporary HP</small><strong>${c.hp.temp}</strong></div>
    <div><small>AC</small><strong>${c.acOverride}</strong></div>
    <div><small>Initiative</small><strong>${c.derivedOverrides.initiative ?? Math.floor((c.abilityScores.DEX - 10) / 2)}</strong></div>
    <div><small>GP</small><strong>${(c.goldCp / 100).toFixed(2)}</strong></div>
  </section>
  <section><div class="section-heading"><h2>Denne karakteren</h2><button data-action="edit">Rediger karakter</button></div>
    <p>${esc(c.species || 'Species ikke registrert')} · Level ${c.level}</p>
    <p>${c.classes.length ? c.classes.map(cl => `${esc(cl.name)} ${cl.level}${cl.subclass ? ' · ' + esc(cl.subclass) : ''}`).join(' / ') : 'Klasse ikke registrert'}</p>
    <dl class="abilities">${abilities.map(a => `<div><dt>${a}</dt><dd>${c.abilityScores[a]}</dd></div>`).join('')}</dl>
  </section>
  <section><h2>Notater</h2><div class="pills">${c.notes.map(n => `<button class="pill" data-note="${n.id}">${esc(n.title)}</button>`).join('')}<button class="pill add" aria-label="Legg til notat" data-action="note">+</button></div></section>
  <section class="muted"><h2>Et grunnlag for eventyret</h2><p>Features, utstyr, spells og strukturerte egenskaper får egne redigeringsflater i neste fase. Ingen regler beregnes automatisk her.</p></section>`;
}
export function combatView(category: string) {
  return `<section><h2>Combat</h2><div class="combat-tabs" role="group" aria-label="Handlingskategori">
    ${['Action', 'Bonus', 'Reaction'].map(name => `<button aria-pressed="${category === name}" data-category="${name}">${name}</button>`).join('')}</div>
    <p class="empty">Ingen kampoppslag i fase 1. Karakterbaserte handlinger og regeloppslag kommer senere.</p>
    <h3>Andre egenskaper</h3><p>Ingen registrerte oppslag.</p></section>`;
}
export function characterForm(c: Character) {
  return `<p>Registrer en eksisterende karakter direkte. Level og verdier er manuelle; dette er ingen level-up-veiviser.</p>
    <div class="form-grid">${field('Navn', 'name', c.name, 'required maxlength="100" autocomplete="off"')}
    ${field('Species / race', 'species', c.species, 'maxlength="100"')}
    ${field('Level', 'level', c.level, 'type="number" min="1" max="20" required')}
    ${field('AC (manuell)', 'acOverride', c.acOverride, 'type="number" required')}
    ${field('HP nå', 'hpCurrent', c.hp.current, 'type="number" min="0" required')}
    ${field('HP maks', 'hpMax', c.hp.max, 'type="number" min="0" required')}
    ${field('Temporary HP', 'hpTemp', c.hp.temp, 'type="number" min="0" required')}
    ${field('Speed (ft)', 'speed', c.speed, 'type="number" min="0" required')}
    ${field('GP', 'gold', (c.goldCp / 100).toFixed(2), 'type="number" min="0" step="0.01" required')}</div>
    <fieldset><legend>Klassenivå</legend><p>Én rad per klasse. Summen må tilsvare karakterens level.</p>
    <div id="class-rows">${c.classes.map(cl => classRow(cl)).join('')}</div><button type="button" class="pill" id="add-class">+ Klasse</button></fieldset>
    <fieldset><legend>Ability scores</legend><div class="form-grid">${abilities.map(a => field(a, a, c.abilityScores[a], 'type="number" min="0" required')).join('')}</div></fieldset>`;
}
export function classRow(cl: Character['classes'][number] = { id: crypto.randomUUID(), name: '', subclass: '', level: 1 }) {
  return `<div class="class-row" data-class-id="${cl.id}">${field('Klasse', 'className', cl.name, 'required maxlength="100"')}${field('Subclass', 'subclass', cl.subclass ?? '', 'maxlength="100"')}${field('Klassenivå', 'classLevel', cl.level, 'type="number" min="1" max="20" required')}<button type="button" data-remove-class>Fjern klasse</button></div>`;
}
