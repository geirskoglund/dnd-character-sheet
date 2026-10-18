import { abilities, type Character } from '../domain/model';
import { escapeHtml as esc } from './html';
import { deriveStats } from '../domain/derived';
export function characterView(c: Character) {
  const stats = deriveStats(c);
  return `<section aria-label="Karakterstatus" class="stats">
    <button data-action="hp"><small>HP</small><strong>${c.hp.current} / ${c.hp.max}</strong></button>
    <button data-action="temp-hp"><small>Temporary HP</small><strong>${c.hp.temp}</strong></button>
    <div><small>AC</small><strong>${stats.ac}</strong></div>
    <div><small>Initiative</small><strong>${c.derivedOverrides.initiative ?? Math.floor((c.abilityScores.DEX - 10) / 2)}</strong></div>
    <button data-action="money"><small>GP</small><strong>${(c.goldCp / 100).toFixed(2)}</strong></button><div><small>Speed</small><strong>${stats.speed ?? '—'} ft</strong></div>
  </section>
  <section><div class="section-heading"><h2>Denne karakteren</h2><button data-action="edit">Rediger karakter</button></div>
    <p>${esc(c.species.name || 'Art ikke registrert')} · Level ${c.level}</p>
    <p>${c.classes.length ? c.classes.map(cl => `${esc(cl.name)} ${cl.level}${cl.subclass ? ' · ' + esc(cl.subclass) : ''}`).join(' / ') : 'Klasse ikke registrert'}</p>
    <dl class="abilities">${abilities.map(a => `<div><dt>${a}</dt><dd>${c.abilityScores[a]}</dd></div>`).join('')}</dl>
  </section>
  <section><h2>Verdier og beregninger</h2><p>${esc(stats.acExplanation)}</p><p>${esc(stats.speedExplanation)}</p>${stats.warnings.map(w => `<p class="warning">${esc(w)}</p>`).join('')}<button data-action="overrides">Beregninger og overstyringer</button></section>
  <section><h2>Artsegenskaper</h2>${c.species.traits.map(t => `<details><summary>${esc(t.name)}</summary><p>${esc(t.description)}</p></details>`).join('') || '<p>Ingen artsoppslag registrert.</p>'}<p>Artens faste språk: ${esc(c.species.languages.join(', ') || 'ikke registrert')}. Ekstra valg føres fra karakterarket.</p></section>
  <section><h2>Utstyr</h2><div class="pills">${[...c.items].sort((a,b) => Number(b.equipped) - Number(a.equipped)).map(i => `<button class="pill" data-equip="${i.id}" aria-pressed="${i.equipped}">${esc(i.name)} · ${i.equipped ? 'utstyrt' : 'eid'}</button>`).join('')}<button class="pill add" data-action="edit-equipment" aria-label="Rediger utstyr">+</button></div></section>
  <section><h2>Notater</h2><div class="pills">${c.notes.map(n => `<button class="pill" data-note="${n.id}">${esc(n.title)}</button>`).join('')}<button class="pill add" aria-label="Legg til notat" data-action="note">+</button></div></section>
  <section class="muted"><h2>Et grunnlag for eventyret</h2><p>Rustning, skjold og utvalgte klasseegenskaper gir AC og speed. Øvrige features, spells og kampoppslag bygges videre senere.</p></section>`;
}
export function combatView(category: string) {
  return `<section><h2>Combat</h2><div class="combat-tabs" role="group" aria-label="Handlingskategori">
    ${['Action', 'Bonus', 'Reaction'].map(name => `<button aria-pressed="${category === name}" data-category="${name}">${name}</button>`).join('')}</div>
    <p class="empty">Ingen kampoppslag i fase 1. Karakterbaserte handlinger og regeloppslag kommer senere.</p>
    <h3>Andre egenskaper</h3><p>Ingen registrerte oppslag.</p></section>`;
}
