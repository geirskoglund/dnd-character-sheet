import { escapeHtml as esc } from './html';

type CancelHandler = (() => void) | undefined;
const host = document.createElement('dialog');
host.setAttribute('aria-labelledby', 'dialog-title');
document.body.append(host);
let opener: HTMLElement | null = null;
let openerSelector = '';
let returnScroll = 0;
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
  const attributes = ['data-item', 'data-note', 'data-trait', 'data-modifier', 'data-action', 'data-page'];
  const attribute = attributes.find(name => opener?.hasAttribute(name));
  openerSelector = attribute ? `[${attribute}="${CSS.escape(opener!.getAttribute(attribute)!)}"]` : '';
  returnScroll = window.scrollY;
}
function restoreFocus() {
  const target = visible(opener) ? opener : openerSelector ? document.querySelector<HTMLElement>(openerSelector) : null;
  const collection = opener?.hasAttribute('data-item') ? '[data-action="edit-equipment"]' : opener?.hasAttribute('data-note') ? '[data-action="note"]' : '';
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
function open(title: string, html: string, footer: string, onCancel?: CancelHandler, initialFocus?: string) {
  if (!host.open) captureOpener();
  cancelHandler = onCancel;
  pending = false;
  host.innerHTML = `<form><h2 id="dialog-title" tabindex="-1">${esc(title)}</h2><div id="dialog-body">${html}</div><p id="dialog-error" role="alert"></p><div class="dialog-actions">${footer}</div></form>`;
  host.scrollTop = 0;
  if (!host.open) host.showModal();
  (initialFocus ? host.querySelector<HTMLElement>(initialFocus) : null)?.focus({preventScroll:true});
  if (!initialFocus) host.querySelector<HTMLElement>('#dialog-title')!.focus({preventScroll:true});
  return host;
}
/** Lookups and immediate-choice pickers have one dismissal action and never submit a form. */
export function viewDialog(title: string, html: string, initialFocus?: string) {
  const d = open(title, html, '<button type="button" id="close-dialog">Lukk</button>', undefined, initialFocus);
  d.querySelector('form')!.onsubmit = event => event.preventDefault();
  d.querySelector<HTMLButtonElement>('#close-dialog')!.onclick = () => d.close();
  return d;
}
/** Editors and destructive confirmations have distinct commit and discard actions. */
export function editDialog(title: string, html: string, onSubmit: (form: HTMLFormElement) => Promise<void>, submit = 'Lagre', onCancel?: CancelHandler) {
  const d = open(title, html, `<button type="button" id="cancel">Avbryt</button><button id="submit" type="submit">${esc(submit)}</button>`, onCancel);
  const form = d.querySelector('form')!;
  d.querySelector<HTMLButtonElement>('#cancel')!.onclick = () => { if (cancelHandler) cancelHandler(); else d.close(); };
  form.onsubmit = event => { event.preventDefault(); void commitDialog(() => onSubmit(form)); };

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
    form.removeAttribute('aria-busy');
  }
}
/** Keep the actual editor nodes so declining deletion restores unsaved fields and listeners. */
export function confirmDialog(title: string, html: string, onConfirm: () => Promise<void>, submit: string) {
  const previous = host.open ? [...host.childNodes] : null;
  const previousCancel = cancelHandler;
  const previousFocus = document.activeElement as HTMLElement | null;
  const previousScroll = host.scrollTop;
  const restore = previous ? () => {
    host.replaceChildren(...previous);
    cancelHandler = previousCancel;
    host.scrollTop = previousScroll;
    if (visible(previousFocus)) previousFocus.focus({preventScroll:true});
  } : undefined;
  return editDialog(title, html, onConfirm, submit, restore);
}
