import type { ChangeEvent } from '../domain/model';
import {escapeHtml as esc} from './html';
const labels: Record<string,string> = {
  name:'Navn', level:'Nivå', hp:'HP', current:'Nåværende', max:'Maks', temp:'Temporary HP', goldCp:'GP',
  abilityScores:'Ability scores', species:'Art', walkingSpeed:'Grunnfart', classes:'Klasser', subclass:'Subclass',
  items:'Utstyr', quantity:'Antall', equipped:'Utstyrt', category:'Kategori', armorProfile:'Rustningsverdier',
  kind:'Type', baseAc:'Base AC', addDex:'Dexterity modifier', dexCap:'Maks Dexterity-bonus', strength:'Strength-krav',
  stealthDisadvantage:'Disadvantage på Stealth', acContribution:'AC-bonus', handUsage:'Håndbruk',
  notes:'Notater', title:'Tittel', body:'Tekst', attack:'Attack', damage:'Damage', favoriteModifierRefs:'Modifierfavoritter',
  acOverride:'Manuell AC', speedOverride:'Manuell speed', unarmoredDefense:'Unarmored Defense',
  derivedOverrides:'Overstyringer', traits:'Artsegenskaper', description:'Beskrivelse', languages:'Språk',
};
const metadata = new Set(['id','revision','createdAt','updatedAt','schemaVersion','definitionRef','sourceRef','catalogId']);
function text(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Ja' : 'Nei';
  if (Array.isArray(value)) return value.map(text).join(', ') || '—';
  if (typeof value === 'object') {
    return Object.entries(value).filter(([key])=>!metadata.has(key)).map(([key,v])=>`${labels[key] ?? key}: ${text(v)}`).join(' · ') || '—';
  }
  return String(value);
}
export function changedValues(event: ChangeEvent): {label:string; before:string; after:string}[] {
  const result: {label:string; before:string; after:string}[] = [];
  function walk(before: unknown, after: unknown, path: string[], key = '') {
    if (JSON.stringify(before) === JSON.stringify(after)) return;
    if (Array.isArray(before) && Array.isArray(after) && [...before,...after].every(v=>v && typeof v === 'object' && 'id' in v)) {
      const ids = new Set([...before,...after].map(v=>v.id));
      for (const id of ids) {
        const old = before.find(v=>v.id === id), next = after.find(v=>v.id === id);
        walk(old, next, [...path, next?.name ?? next?.title ?? old?.name ?? old?.title ?? 'Post']);
      }
    } else if (before && after && typeof before === 'object' && typeof after === 'object' && !Array.isArray(before) && !Array.isArray(after)) {
      const a = before as Record<string,unknown>, b = after as Record<string,unknown>;
      for (const property of new Set([...Object.keys(a),...Object.keys(b)])) {
        if (!metadata.has(property)) walk(a[property], b[property], [...path, labels[property] ?? property], property);
      }
    } else {
      const format = (value: unknown) => key === 'goldCp' && typeof value === 'number' ? (value / 100).toFixed(2) : text(value);
      result.push({label:path.join(' › ') || 'Karakter', before:format(before), after:format(after)});
    }
  }
  for (const change of event.changes) {
    if (!change.before || !change.after) {
      result.push({label:'Karakter', before:change.before?.name ?? '—', after:change.after?.name ?? '—'});
    } else walk(change.before, change.after, []);
  }
  return result;
}
export function historyView(events: ChangeEvent[]) {
  return events.length ? `<ol class="history">${events.map(event=>`<li><strong>${esc(event.description)}</strong><p class="muted">${esc(new Date(event.timestamp).toLocaleString('nb-NO'))}</p><details><summary>Vis endringer</summary>${changedValues(event).map(change=>`<div class="history-change"><strong>${esc(change.label)}</strong><p>${esc(change.before)} → ${esc(change.after)}</p></div>`).join('') || '<p>Ingen endrede verdier.</p>'}</details></li>`).join('')}</ol>` : '<p>Ingen registrerte endringer.</p>';
}
