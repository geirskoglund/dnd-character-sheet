import { escapeHtml as esc } from './html';
import {icon} from './icons';
import {enhanceNumbers} from './number-wheel';

type CancelHandler = (() => void) | undefined;
const host = document.createElement('dialog');
host.setAttribute('aria-labelledby', 'dialog-title');
document.body.append(host);
let opener: HTMLElement | null = null;
let openerSelector = '';
let returnScroll = 0;
let collectionSelector = '';
let cancelHandler: CancelHandler;
let pending = false;

function visible(element: HTMLElement | null): element is HTMLElement {
  if (!element?.isConnected || !element.getClientRects().length) return false;
  const closed = element.closest('details:not([open])');
  return !closed || !!closed.querySelector(':scope > summary')?.contains(element);
}
function captureOpener() {
  const active = document.activeElement as HTMLElement | null;
  opener = active?.matches('button, summary, input, select, textarea, a[href], [tabindex]') ? active : null;
  const attributes = ['data-lookup', 'data-record', 'data-add', 'data-equipment-group', 'data-item', 'data-note', 'data-trait', 'data-modifier', 'data-action', 'data-page'];
  const attribute = attributes.find(name => opener?.hasAttribute(name));
  openerSelector = attribute ? `[${attribute}="${CSS.escape(opener!.getAttribute(attribute)!)}"]` : '';
  const equipmentGroup=opener?.closest('.equipment-group')?.querySelector<HTMLButtonElement>('[data-equipment-group]')?.dataset.equipmentGroup;
  const region=opener?.closest('section')?.querySelector<HTMLButtonElement>('[data-add]')?.dataset.add;
  collectionSelector=equipmentGroup ? `[data-equipment-group="${equipmentGroup}"]` : region ? `[data-add="${region}"]` : opener?.hasAttribute('data-note') ? '[data-action="note"]' : '';
  returnScroll = window.scrollY;
}
function restoreFocus() {
  const target = visible(opener) ? opener : openerSelector ? document.querySelector<HTMLElement>(openerSelector) : null;
  const collection = collectionSelector;
  const fallback = (collection ? document.querySelector<HTMLElement>(collection) : null) ?? document.querySelector<HTMLElement>('.app-menu > summary');
  (visible(target) ? target : fallback)?.focus({preventScroll:true});
  window.scrollTo(0, returnScroll);
}
host.onclose = () => { if (!host.open) restoreFocus(); };
host.oncancel = event => {
  event.preventDefault();
  if (pending) return;
  if (cancelHandler) cancelHandler(); else host.close();
};
// Native search fields otherwise consume the first Escape to clear their value.
host.addEventListener('keydown',event=>{
  if(event.key!=='Escape'||event.isComposing)return;
  event.preventDefault();event.stopPropagation();
  if(pending)return;
  if(cancelHandler)cancelHandler();else host.close();
},true);
function open(title: string, html: string, footer: string, onCancel?: CancelHandler, initialFocus?: string, kind: 'view'|'edit'|'confirm'='edit', size: 'compact'|'large'='large') {
  if (!host.open) captureOpener();
  delete host.dataset.wizard;
  cancelHandler = onCancel;
  pending = false;
  host.dataset.kind=kind;host.dataset.size=size;
  const close=kind==='confirm'?'':`<button type="button" id="${kind==='view'?'close-dialog':'cancel'}" class="dialog-close" aria-label="${kind==='view'?'Lukk':'Avbryt'}" title="${kind==='view'?'Lukk':'Avbryt'}">${icon('close')}</button>`;
  host.innerHTML = `<form><div class="dialog-heading"><h2 id="dialog-title" tabindex="-1">${esc(title)}</h2>${close}</div><div id="dialog-body">${html}</div><p id="dialog-error" role="alert"></p><div class="dialog-actions">${footer}</div></form>`;
  host.scrollTop = 0;
  if (!host.open) host.showModal();
  (initialFocus ? host.querySelector<HTMLElement>(initialFocus) : null)?.focus({preventScroll:true});
  if (!initialFocus) host.querySelector<HTMLElement>('#dialog-title')!.focus({preventScroll:true});
  return host;
}
/** Lookups and immediate-choice pickers have one dismissal action and never submit a form. */
export function viewDialog(title: string, html: string, initialFocus?: string, size: 'compact'|'large'='compact') {
  const d = open(title, html, '', undefined, initialFocus, 'view', size);
  d.querySelector('form')!.onsubmit = event => event.preventDefault();
  d.querySelector<HTMLButtonElement>('#close-dialog')!.onclick = () => d.close();
  return d;
}
/** Editors and destructive confirmations have distinct commit and discard actions. */
export function editDialog(title: string, html: string, onSubmit: (form: HTMLFormElement) => Promise<void>, submit = 'Lagre', onCancel?: CancelHandler, confirmation=false) {
  const d = open(title, html, `${confirmation?'<button type="button" id="cancel">Avbryt</button>':''}<button id="submit" type="submit">${esc(submit)}</button>`, onCancel, undefined, confirmation?'confirm':'edit', confirmation?'compact':'large');
  const form = d.querySelector('form')!;
  d.querySelector<HTMLButtonElement>('#cancel')!.onclick = () => { if (cancelHandler) cancelHandler(); else d.close(); };
  form.onsubmit = event => { event.preventDefault(); void commitDialog(() => onSubmit(form)); };

  enhanceNumbers(d);
  return d;
}
/** Keep a commit visible and non-dismissible until storage confirms or reports failure. */
export async function commitDialog(action: () => Promise<void>) {
  if (pending || !host.open) return;
  pending = true;
  const form = host.querySelector('form')!;
  const buttons = [...form.querySelectorAll('button')].map(button => ({button, disabled:button.disabled}));
  buttons.forEach(({button}) => button.disabled = true);
  form.setAttribute('aria-busy', 'true');
  const body=form.querySelector<HTMLElement>('#dialog-body')!;body.inert=true;
  const primary = form.querySelector<HTMLButtonElement>('#submit');
  const label = primary?.textContent;
  if (primary) primary.textContent = 'Lagrer …';
  try { await action(); host.close(); }
  catch (error) {
    const alert = form.querySelector<HTMLElement>('#dialog-error')!;
    alert.textContent = error instanceof Error ? error.message : 'Kunne ikke lagre. Endringene er ikke bekreftet.';
    alert.setAttribute('tabindex', '-1'); alert.focus();
  } finally {
    pending = false;
    buttons.forEach(({button, disabled}) => button.disabled = disabled);
    if (primary) primary.textContent = label!;
    body.inert=false;
    form.removeAttribute('aria-busy');
  }
}
/** Keep the actual editor nodes so declining deletion restores unsaved fields and listeners. */
export function confirmDialog(title: string, html: string, onConfirm: () => Promise<void>, submit: string) {
  const previous = host.open ? [...host.childNodes] : null;
  const previousCancel = cancelHandler;
  const previousFocus = document.activeElement as HTMLElement | null;
  const previousScroll = host.querySelector('#dialog-body')?.scrollTop ?? 0;
  const kind=host.dataset.kind,size=host.dataset.size,wizard=host.dataset.wizard;
  const restore = previous ? () => {
    host.replaceChildren(...previous);
    cancelHandler = previousCancel;
    host.dataset.kind=kind;host.dataset.size=size;if(wizard)host.dataset.wizard=wizard;else delete host.dataset.wizard;
    host.querySelector('#dialog-body')!.scrollTop=previousScroll;
    if (visible(previousFocus)) previousFocus.focus({preventScroll:true});
  } : undefined;
  return editDialog(title, html, onConfirm, submit, restore, true);
}

export function setDialogDismiss(d:HTMLDialogElement,handler:()=>void){if(d===host)cancelHandler=()=>{handler();};}
