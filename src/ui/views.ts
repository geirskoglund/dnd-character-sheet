import { abilities, type Character } from '../domain/model';
import { escapeHtml as esc } from './html';
import { abilityModifier, modifiers, signed } from '../domain/modifiers';
import { deriveStats } from '../domain/derived';
export function characterView(c: Character) {
  const stats = deriveStats(c), options = modifiers(c);
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
  ${c.species.traits.length ? `<section><h2>Artsegenskaper</h2><div class="pills">${c.species.traits.map((t, i) => `<button class="pill" data-trait="${i}">${esc(t.name)}</button>`).join('')}</div></section>` : ''}
  <section><h2>Utstyr</h2><div class="pills">${[...c.items].sort((a,b) => Number(b.equipped) - Number(a.equipped)).map(i => `<button class="pill" data-item="${i.id}" aria-pressed="${i.equipped}">${esc(i.name)} · ${i.equipped ? 'utstyrt' : 'eid'}</button>`).join('')}<button class="pill add" data-action="edit-equipment" aria-label="Legg til utstyr">+</button></div></section>
  <section><h2>Notater</h2><div class="pills">${c.notes.map(n => `<button class="pill" data-note="${n.id}">${esc(n.title)}</button>`).join('')}<button class="pill add" aria-label="Legg til notat" data-action="note">+</button></div></section>`;
}
export function combatView(c: Character, category: string) {
  const stats = deriveStats(c);
  return `<section aria-label="HP i Combat" class="combat-health"><button data-action="hp"><small>HP</small><strong>${c.hp.current} / ${c.hp.max}</strong></button><button data-action="temp-hp"><small>Temporary HP</small><strong>${c.hp.temp}</strong></button><div><small>AC</small><strong>${stats.ac}</strong></div><div><small>Initiative</small><strong>${signed(c.derivedOverrides.initiative ?? abilityModifier(c.abilityScores.DEX))}</strong></div></section>
    <section><div class="combat-tabs" role="group" aria-label="Handlingskategori">${['Action', 'Bonus', 'Reaction'].map(name => `<button aria-pressed="${category === name}" data-category="${name}">${name}</button>`).join('')}</div>
    <p class="empty muted">Ingen registrerte kampoppslag.</p></section>
    <section><h2>Andre egenskaper</h2><p class="muted">Ingen registrerte oppslag.</p></section>`;
}
