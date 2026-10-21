import {icon} from './icons';

export type TextField = HTMLInputElement | HTMLTextAreaElement;

/** Readonly journal fields keep their original constraints in the caller. */
export function validField(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
  if(field.disabled)return true;
  const readonly = 'readOnly' in field && field.readOnly;
  if (readonly) field.readOnly = false;
  try {
    return field.checkValidity() && (!field.required || field.value.trim() !== '');
  } finally {
    if (readonly) field.readOnly = true;
  }
}

/** A separate top-layer editor keeps the caller's actual nodes, listeners and draft alive. */
export function editText(field: TextField) {
  if (field.disabled || field.closest('[inert]') || document.querySelector('.text-editor[open],.number-change-dialog[open]')) return;
  const opener = document.activeElement as HTMLElement | null;
  const returnScroll = window.scrollY;
  const label = field.getAttribute('aria-label') || field.labels?.[0]?.childNodes[0]?.textContent?.trim() || field.name;
  const d = document.createElement('dialog');
  d.className = 'text-editor';
  d.setAttribute('aria-labelledby', 'text-editor-title');
  d.innerHTML = `<form novalidate><div class="dialog-heading"><span class="text-title-icon" aria-hidden="true">${icon('note')}</span><h2 id="text-editor-title"></h2><button type="button" class="dialog-close" data-dismiss aria-label="Avbryt tekstredigering">${icon('close')}</button></div><div class="text-editor-body"></div><div class="dialog-actions"><button type="button" data-dismiss>Avbryt</button><button type="submit">OK</button></div></form>`;
  d.querySelector('h2')!.textContent = label;
  const input = document.createElement(field instanceof HTMLTextAreaElement ? 'textarea' : 'input');
  if (input instanceof HTMLInputElement) input.type = field instanceof HTMLInputElement ? field.type : 'text';
  input.value = field.value;
  input.setAttribute('aria-label', label);
  input.placeholder = field.placeholder || 'Skriv inn...';
  for (const attr of ['maxlength', 'minlength', 'pattern', 'autocomplete', 'spellcheck', 'autocapitalize', 'inputmode']) {
    if (field.hasAttribute(attr)) input.setAttribute(attr, field.getAttribute(attr)!);
  }
  if(field instanceof HTMLInputElement&&field.list&&input instanceof HTMLInputElement){
    const suggestions=field.list.cloneNode(true) as HTMLDataListElement;
    suggestions.id='text-editor-suggestions';input.setAttribute('list',suggestions.id);d.append(suggestions);
  }
  // OK edits the staged field, including clearing it. The caller validates before continuing/saving.
  d.querySelector('.text-editor-body')!.append(input);
  const locks: [CSSStyleDeclaration, string][] = [
    [document.body.style, 'position'], [document.body.style, 'top'], [document.body.style, 'left'],
    [document.body.style, 'right'], [document.body.style, 'overflow'],
    [document.documentElement.style, 'overflow'], [document.documentElement.style, 'overscroll-behavior'],
  ];
  const saved = locks.map(([style, property]) => ({style, property, value: style.getPropertyValue(property), priority: style.getPropertyPriority(property)}));
  document.body.style.position = 'fixed';
  document.body.style.top = `-${returnScroll}px`;
  document.body.style.left = '0'; document.body.style.right = '0'; document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden'; document.documentElement.style.overscrollBehavior = 'none';
  document.body.append(d);
  const viewport = window.visualViewport;
  const resize = () => {
    // Resize the frame only. Never recreate the editing control, move its caret or reset its scroll.
    d.style.height = `${viewport?.height ?? window.innerHeight}px`;
    d.style.top = `${viewport?.offsetTop ?? 0}px`;
  };
  viewport?.addEventListener('resize', resize);
  viewport?.addEventListener('scroll', resize);
  window.addEventListener('resize', resize);
  resize();
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    viewport?.removeEventListener('resize', resize);
    viewport?.removeEventListener('scroll', resize);
    window.removeEventListener('resize', resize);
    d.close(); d.remove();
    for (const {style, property, value, priority} of saved) {
      if (value) style.setProperty(property, value, priority); else style.removeProperty(property);
    }
    if (opener?.isConnected) opener.focus({preventScroll: true});
    window.scrollTo(0, returnScroll);
  };
  d.querySelectorAll<HTMLButtonElement>('button').forEach(button => {
    // Keep the keyboard/viewport stable until click; blur must not move a button between down and up.
    button.onpointerdown = event => event.preventDefault();
  });
  d.querySelectorAll<HTMLButtonElement>('[data-dismiss]').forEach(button => button.onclick = close);
  d.oncancel = event => {event.preventDefault(); close();};
  d.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !event.isComposing) {event.preventDefault(); event.stopPropagation(); close();}
  });
  d.querySelector('form')!.onsubmit = event => {
    event.preventDefault();
    const value = input.value;
    close();
    if (field.value !== value) {
      field.value = value;
      field.dispatchEvent(new Event('input', {bubbles: true}));
      field.dispatchEvent(new Event('change', {bubbles: true}));
    }
  };
  d.showModal();
  input.focus({preventScroll: true});
}

export function enhanceText(root: ParentNode) {
  root.querySelectorAll<TextField>('input:not([type]),input[type="text"],input[type="url"],input[type="email"],textarea').forEach(field => {
    if (field.dataset.textBound || field.readOnly || field.closest('.text-editor') || field.matches('[data-direct-text]')) return;
    field.dataset.textBound = 'true'; field.readOnly = true;
    if(field instanceof HTMLTextAreaElement){const preview=()=>field.rows=Math.min(4,Math.max(1,field.value.split('\n').length));preview();field.addEventListener('input',preview);}
    field.classList.add('text-value'); field.placeholder ||= 'Skriv inn...';
    field.setAttribute('aria-haspopup', 'dialog');
    field.addEventListener('click', () => editText(field));
    field.addEventListener('keydown', (event: Event) => {
      const key = event as KeyboardEvent;
      if (key.key === 'Enter' || key.key === ' ') {key.preventDefault(); editText(field);}
    });
  });
}
