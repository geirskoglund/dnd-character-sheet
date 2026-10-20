import {iconLabels, type IconKey} from '../domain/iconography';
import {escapeHtml as esc} from './html';
// Original line drawings. Shared strokes and 24-unit geometry, stored with the app.
const paths = {
  emblem:'<path d="m12 2 8 5v10l-8 5-8-5V7zM12 6l4 6-4 6-4-6z"/>',
  feature:'<path d="M4 4h6l2 2 2-2h6v15h-6l-2 2-2-2H4zM12 6v15M7 8h2m6 0h2M7 12h2m6 0h2"/>',
  feat:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
  species:'<path d="M4 20C2 8 9 3 21 3c0 12-5 18-17 17ZM4 20 16 8M9 15v-5m0 5h5"/>',
  vision:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  mind:'<path d="M8 20v-4C1 12 5 3 12 3c6 0 8 4 7 8l3 3h-4v6h-6M12 6v7m-3-4 3 4 3-4"/>',
  moon:'<path d="M19 15A8 8 0 0 1 9 4 9 9 0 1 0 19 15Z"/><path d="m18 2 1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/>',
  luck:'<path d="M12 12C1-3-3 14 12 12Zm0 0C27 1 10-3 12 12Zm0 0c11 15 15-2 0 0Zm0 0C-3 23 14 27 12 12ZM12 12l-5 9"/>',
  movement:'<path d="m13 4 4 3-4 6 4 3 3 5M13 13l-5 2-4 6M3 9h6l3-3M2 5h5M1 13h5"/><circle cx="17" cy="3" r="2"/>',
  healing:'<path d="M12 21 3 12C-2 5 6 1 12 7c6-6 14-2 9 5zM12 9v7m-3-3h6"/>',
  protection:'<path d="M12 2 3 5v7c0 4 9 10 9 10s9-6 9-10V5zM8 11l3 3 5-6"/>',
  strength:'<path d="m5 14 2-6 4-3 3 2-2 3-2-1-1 4c7-7 12-1 11 4-5 5-12 5-17 0z"/>',
  magic:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>',
  speech:'<path d="M3 3h18v14H9l-6 4zM7 7h10M7 11h7"/>',
  hand:'<path d="M5 12V8a1.5 1.5 0 0 1 3 0v4-7a1.5 1.5 0 0 1 3 0v7-8a1.5 1.5 0 0 1 3 0v8-6a1.5 1.5 0 0 1 3 0v8l2-3c2-2 4 0 2 3l-4 7H9l-6-7c-1-2 0-4 2-2z"/>',
  tools:'<path d="m5 4 4-1 1 6-3 3-5-2 1-4 3 2 2-2zM9 10l11 10-2 2L8 12M19 3l2 2-9 9m-6 3-4 4"/>',
  note:'<path d="M5 2h10l5 5v15H5zM15 2v6h5M8 12h9M8 16h9M8 19h6"/>',
  resource:'<path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10M12 2v10"/>',
  condition:'<path d="M12 3 2 21h20zM12 9v5M12 17v1"/>',
  sword:'<path d="m16 2 5 1-1 5L9 19l-4-4zM3 13l8 8M7 17l-4 4M13 10l4-4"/>',
  axe:'<path d="M6 22 17 3M12 5c3-3 7-2 10 1-1 5-5 8-9 6l-4-2zM13 5l4 3"/>',
  bow:'<path d="M6 3c15 1 15 17 0 18l4-9zM3 12h18m-4-4 4 4-4 4"/>',
  crossbow:'<path d="M3 9c3-7 15-7 18 0L12 7zM12 3v19m-3-3 3 3 3-3M10 11h4v7h-4z"/>',
  dagger:'<path d="m14 3 5-1-1 5-7 8-3-3zM5 11l8 8M9 15l-5 6-2-2 5-6"/>',
  hammer:'<path d="m8 2 12 5-3 7-12-5zM9 11 4 21l3 1 5-10M8 4l10 4"/>',
  spear:'<path d="m18 2 4 0-1 5-5 4-3-3zM15 10 3 22M12 9l5 5"/>',
  whip:'<path d="m3 21 4-4 3 3-4 3zM8 18C21 20 25 9 16 7 6 5 13 1 21 3"/>',
  'armor-light':'<path d="m8 3 4 3 4-3 5 5-4 4v9H7v-9L3 8zM9 10l6 7m0-7-6 7"/>',
  'armor-medium':'<path d="m8 3 4 3 4-3 5 5-4 4v9H7v-9L3 8zM8 11h8M8 15h8M8 19h8M12 11v10"/>',
  'armor-heavy':'<path d="m8 3 4 3 4-3 5 5-4 4v9H7v-9L3 8zM8 3v5l4 3 4-3V3M8 16h8M12 11v10"/>',
  shield:'<path d="M12 2 3 5v7c0 4 9 10 9 10s9-6 9-10V5zM12 5v13M6 8h12"/>',
  equipment:'<path d="M7 7V5a5 5 0 0 1 10 0v2M4 7h16v14H4zM4 11h16M9 10v4h6v-4"/>',
  cloak:'<path d="M8 4c2-3 6-3 8 0l5 16c-5 3-13 3-18 0zM8 4c0 6 8 6 8 0M12 9v11"/>',
  ring:'<circle cx="12" cy="15" r="7"/><path d="m8 3 4-2 4 2-4 6zM8 15a4 4 0 0 1 4-4"/>',
  fire:'<path d="M13 2c2 7-4 6-2 11 1-2 3-3 5-4 7 9 1 14-4 13-9 1-12-8-5-14-1 6 2 5 3 2z"/>',
  cold:'<path d="M12 2v20M3 7l18 10M3 17 21 7M9 4l3 3 3-3M9 20l3-3 3 3M3 10l4-1-1-4M18 19l-1-4 4-1M3 14l4 1-1 4M18 5l-1 4 4 1"/>',
  acid:'<path d="m8 2 2 1v7L3 20h18l-7-10V3l2-1M7 15h10M8 18h1m5 0h2"/>',
  lightning:'<path d="m14 2-9 12h6l-1 8 9-13h-6z"/>',
  thunder:'<path d="m3 10 4 0 5-5v14l-5-5H3zM16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14"/>',
  poison:'<path d="M7 3h10v5l3 4v9H4v-9l3-4zM7 3v4h10M9 13l6 5m0-5-6 5"/>',
  necrotic:'<path d="M7 17C-1 8 7 1 12 2c6-1 13 6 5 15v5H7zM9 18v4m6-4v4"/><circle cx="8" cy="11" r="2"/><circle cx="16" cy="11" r="2"/><path d="m12 13-1 3h2z"/>',
  radiant:'<circle cx="12" cy="12" r="5"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
  force:'<path d="m12 2 9 10-9 10L3 12zM8 12l4-5 4 5-4 5zM1 6l3 2m16 8 3 2"/>',
  psychic:'<path d="M4 12c2-11 14-11 16 0-2 11-14 11-16 0zM8 12c1-5 7-5 8 0-1 5-7 5-8 0zM12 2v3m0 14v3"/>',
  piercing:'<path d="M3 21 20 4m-9 0h9v9M3 11v10h10M5 5l4 4"/>',
  slashing:'<path d="M4 20C17 20 19 9 20 3 13 11 7 8 4 20zM3 3l3 3m3-3 3 3"/>',
  bludgeoning:'<path d="m12 2 3 6 7-1-4 6 3 6-7-1-4 4-1-7-7-2 6-4z"/>',
  illusion:'<path d="M3 12c4-8 14-8 18 0-4 8-14 8-18 0zM5 3l14 18M11 9a3 3 0 0 1 4 4"/>',
  teleport:'<ellipse cx="6" cy="12" rx="3" ry="9"/><ellipse cx="18" cy="12" rx="3" ry="9"/><path d="M6 12h12m-4-4 4 4-4 4"/>',
  control:'<path d="M4 3h16v5H4zM4 16h16v5H4zM8 8v8m8-8v8M10 12h4"/>',
  light:'<path d="M8 16c-8-9 1-15 4-14 5-1 12 5 4 14v4H8zM9 23h6M8 16h8M12 5v6M4 3 2 1m18 2 2-2"/>',
  nature:'<path d="M12 2 5 11h4l-6 8h8v4h2v-4h8l-6-8h4z"/>',
  feather:'<path d="M4 21 19 4M7 18C0 8 17-2 21 3c5 6-5 18-14 15ZM10 14h7M14 10V5"/>',
  backpack:'<path d="M8 6V4a4 4 0 0 1 8 0v2M6 6h12l2 5v11H4V11zM8 14h8v6H8zM4 12h16M9 9h6"/>',
  crossedSwords:'<path d="m3 2 5 2 11 14-3 3L3 7zM21 2l-5 2L5 18l3 3L21 7zM2 18l5 5m15-5-5 5"/>',
  wand:'<path d="m4 21 11-14 3 3L7 24zM16 2v3m5-1-2 2m3 4h-3M10 4l2 2"/>',
  menu:'<path d="M5 6h14M5 12h14M5 18h14"/>', close:'<path d="m6 6 12 12M18 6 6 18"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',check:'<path d="m5 12 5 5L20 6"/>',
  arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',history:'<path d="M3 10a9 9 0 1 1 0 5M3 4v6h6M12 7v5l4 2"/>',
} satisfies Record<IconKey|string,string>;
export type UIIcon = keyof typeof paths;
export function icon(key:UIIcon, className='') {
  return `<svg class="icon ${esc(className)}" data-icon="${key}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths[key]}</svg>`;
}
export function sectionTitle(name:string, key:UIIcon='feature') {return `<h2>${icon(key)}<span>${esc(name)}</span></h2>`;}
export function iconField(selected?:IconKey) {
  return `<details class="icon-options"><summary>Ikon (valgfritt)</summary><label>Ikonvalg<select name="iconKey"><option value="">Automatisk fra kategori</option>${Object.entries(iconLabels).map(([key,label])=>`<option value="${key}" ${selected===key?'selected':''}>${esc(label)}</option>`).join('')}</select></label><p class="muted">Bare utseendet endres. Ukjent kategori får et felles reserveikon.</p></details>`;
}
export function readIcon(data:FormData):IconKey|undefined {const key=String(data.get('iconKey')??'');return key in iconLabels?key as IconKey:undefined;}
export function portraitPlaceholder() {
  return '<svg class="portrait-placeholder" viewBox="0 0 52 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"><path d="M8 49c2-8 9-9 12-13m12 0c3 4 10 5 12 13M17 24c0-14 18-14 18 0v5c0 7-4 11-9 11s-9-4-9-11zM14 29c-2-16 7-20 12-20s14 4 12 20M17 24c6 0 8-5 9-7 1 4 5 6 9 7M11 53h30M6 34c-2 9 1 15 7 19M46 34c2 9-1 15-7 19M6 39l4 1m-3 5 4 1M46 39l-4 1m3 5-4 1"/><path d="m26 3 1 2-1 2-1-2z" fill="currentColor"/></svg>';
}
