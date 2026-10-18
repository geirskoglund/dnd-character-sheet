import { registerSW } from 'virtual:pwa-register';
import { abilities, characterSchema, copyCharacter, createCharacter, type Character } from './domain/model';
import { CharacterRepository, openDatabase } from './storage/database';
import { exportBackup, importBackup } from './storage/backup';
import { characterForm, characterView, classRow, combatView } from './ui/views';
import { escapeHtml as esc, field } from './ui/html';
import './style.css';

const root = document.querySelector<HTMLDivElement>('#app')!;
let repo: CharacterRepository;
let characters: Character[] = [];
let selected: string | undefined;
let page: 'character' | 'combat' = 'character';
let category = 'Action';
const scroll = { character: 0, combat: 0 };
let busy = false;
let message = '';
const current = () => characters.find(c => c.id === selected);
function tell(text: string) {
  message = text;
  const status = document.querySelector('#status');
  if (status) status.textContent = text;
}
function render() {
  const c = current();
  root.innerHTML = `<a href="#content" class="skip-link">Til innhold</a><div class="shell">
    <header><p class="eyebrow">D&D · 5e 2014</p><h1>${esc(c?.name ?? 'Ditt neste eventyr')}</h1>
    <div class="management"><label>Karakter<select id="character-select"><option value="">Velg karakter</option>${characters.map(ch => `<option value="${ch.id}" ${selected === ch.id ? 'selected' : ''}>${esc(ch.name)}</option>`).join('')}</select></label>
    <button data-action="create">Ny karakter</button></div>
    <details><summary>Karakteradministrasjon</summary><div class="actions">${c ? '<button data-action="copy">Kopier karakter</button><button data-action="delete">Slett karakter</button>' : ''}<button data-action="export" ${characters.length ? '' : 'disabled'}>Eksporter backup</button><button data-action="import">Importer backup</button>${c ? '<button data-action="history">Endringslogg</button><button data-action="undo">Angre siste endring</button>' : ''}</div></details></header>
    <p id="status" role="status" aria-live="polite">${esc(message)}</p>
    <main id="content" tabindex="-1">${c ? page === 'character' ? characterView(c) : combatView(category) : '<section class="empty"><h2>Et ark som er ditt</h2><p>Opprett en karakter og før inn verdiene fra karakterarket ditt. Data lagres lokalt på denne enheten.</p><button data-action="create">Opprett første karakter</button></section>'}</main>
    <footer>Lokalt lagret · Ingen konto eller synkronisering. Ta JSON-backup før du rydder nettleserdata.</footer></div>
    <nav aria-label="Hovednavigasjon">${['character', 'combat'].map(tab => `<button data-page="${tab}" ${page === tab ? 'aria-current="page"' : ''}>${tab === 'character' ? 'Character' : 'Combat'}</button>`).join('')}</nav>
    <dialog aria-labelledby="dialog-title"><form><h2 id="dialog-title" tabindex="-1"></h2><div id="dialog-body"></div><p id="dialog-error" role="alert"></p><div class="dialog-actions"><button type="button" id="cancel">Avbryt</button><button id="submit" type="submit">Lagre</button></div></form></dialog>`;
  root.querySelectorAll<HTMLButtonElement>('[data-page]').forEach(button => button.onclick = () => {
    scroll[page] = window.scrollY;
    page = button.dataset.page as typeof page;
    render();
    window.scrollTo(0, scroll[page]);
    document.querySelector<HTMLElement>(`[data-page="${page}"]`)?.focus({ preventScroll: true });
  });
  root.querySelectorAll<HTMLButtonElement>('[data-category]').forEach(button => button.onclick = () => {
    category = button.dataset.category!; render();
    document.querySelector<HTMLElement>(`[data-category="${category}"]`)?.focus();
  });
  root.querySelector<HTMLSelectElement>('#character-select')!.onchange = event => void run(async () => {
    selected = (event.target as HTMLSelectElement).value || undefined;
    await repo.setSetting('selectedCharacter', selected); render();
  });
  root.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(button => button.onclick = () => void run(() => action(button.dataset.action!)));
  root.querySelectorAll<HTMLButtonElement>('[data-note]').forEach(button => button.onclick = () => editNote(button.dataset.note));
}
async function refresh() {
  characters = await repo.list();
  if (!current()) selected = characters[0]?.id;
  await repo.setSetting('selectedCharacter', selected);
  render();
}
async function run(fn: () => Promise<void>) {
  if (busy) return;
  busy = true;
  try { await fn(); } catch (error) { tell(error instanceof Error ? error.message : 'Operasjonen mislyktes. Prøv igjen og ta backup.'); }
  finally { busy = false; }
}
function dialog(title: string, html: string, onSubmit: (form: HTMLFormElement) => Promise<void>, submit = 'Lagre') {
  const d = root.querySelector('dialog')!;
  const form = d.querySelector('form')!;
  d.querySelector('#dialog-title')!.textContent = title;
  d.querySelector('#dialog-body')!.innerHTML = html;
  d.querySelector('#submit')!.textContent = submit;
  d.querySelector<HTMLButtonElement>('#cancel')!.onclick = () => d.close();
  form.onsubmit = async event => {
    event.preventDefault();
    const button = d.querySelector<HTMLButtonElement>('#submit')!;
    button.disabled = true;
    try {
      await onSubmit(form);
      d.close();
      if (!d.isConnected) document.querySelector<HTMLElement>('#content')?.focus({ preventScroll: true });
    }
    catch (error) { d.querySelector('#dialog-error')!.textContent = error instanceof Error ? error.message : 'Kunne ikke lagre. Ingen endringer er bekreftet.'; }
    finally { button.disabled = false; }
  };
  d.showModal();
  d.querySelector<HTMLElement>('#dialog-title')!.focus();
  return d;
}
function editCharacter(source?: Character) {
  const draft = source ? structuredClone(source) : { ...createCharacter(), name: '' };
  const d = dialog(source ? 'Rediger karakter' : 'Ny karakter', characterForm(draft), async form => {
    const data = new FormData(form);
    const num = (key: string) => Number(data.get(key));
    draft.name = String(data.get('name'));
    draft.species = String(data.get('species'));
    draft.level = num('level'); draft.acOverride = num('acOverride'); draft.speed = num('speed');
    draft.hp = { current: num('hpCurrent'), max: num('hpMax'), temp: num('hpTemp') };
    draft.goldCp = Math.round(num('gold') * 100);
    for (const ability of abilities) draft.abilityScores[ability] = num(ability);
    draft.classes = [...form.querySelectorAll<HTMLElement>('[data-class-id]')].map(row => {
      const old = draft.classes.find(cl => cl.id === row.dataset.classId);
      const value = (name: string) => row.querySelector<HTMLInputElement>(`[name="${name}"]`)!.value;
      return { ...old, id: row.dataset.classId!, name: value('className').trim(), subclass: value('subclass'), level: Number(value('classLevel')) };
    });
    if (draft.classes.length && draft.classes.reduce((sum, cl) => sum + cl.level, 0) !== draft.level) throw new Error('Summen av klassenivå må være lik karakterens level.');
    const valid = characterSchema.safeParse(draft);
    if (!valid.success) throw new Error('Kontroller navn og tallfelter. Navn er påkrevd, og antall må være hele, gyldige tall.');
    const saved = await repo.save(valid.data, source ? 'edit' : 'create', source ? 'Karakter redigert' : 'Karakter opprettet');
    selected = saved.id;
    message = 'Karakter lagret på denne enheten.';
    await refresh();
  });
  const rows = d.querySelector('#class-rows')!;
  d.querySelector<HTMLButtonElement>('#add-class')!.onclick = () => {
    rows.insertAdjacentHTML('beforeend', classRow());
    rows.lastElementChild?.querySelector<HTMLInputElement>('input')?.focus();
  };
  rows.addEventListener('click', event => {
    if ((event.target as HTMLElement).matches('[data-remove-class]')) (event.target as HTMLElement).closest('.class-row')!.remove();
  });
}
function editNote(id?: string) {
  const draft = structuredClone(current()!);
  const note = draft.notes.find(n => n.id === id) ?? { id: crypto.randomUUID(), title: '', body: '' };
  const d = dialog(id ? 'Rediger notat' : 'Nytt notat', `${field('Tittel', 'title', note.title, 'required maxlength="100"')}<label>Tekst<textarea name="body" maxlength="10000" rows="8">${esc(note.body)}</textarea></label>${id ? '<button type="button" id="delete-note">Slett notat</button>' : ''}`, async form => {
    const data = new FormData(form);
    note.title = String(data.get('title')).trim(); note.body = String(data.get('body'));
    if (!id) draft.notes.push(note);
    await repo.save(draft, 'note', id ? 'Notat redigert' : 'Notat lagt til');
    message = 'Notat lagret.'; await refresh();
  });
  const remove = d.querySelector<HTMLButtonElement>('#delete-note');
  if (remove) remove.onclick = () => {
    d.close();
    dialog('Slett notat?', `<p>Vil du slette «${esc(note.title)}»?</p>`, async () => {
      draft.notes = draft.notes.filter(n => n.id !== id);
      if (draft.backgroundNoteId === id) delete draft.backgroundNoteId;
      await repo.save(draft, 'note', 'Notat slettet'); await refresh();
    }, 'Slett notat');
  };
}
async function action(name: string) {
  const c = current();
  switch (name) {
    case 'create': editCharacter(); break;
    case 'edit': editCharacter(c); break;
    case 'note': editNote(); break;
    case 'copy': {
      const copy = copyCharacter(c!);
      await repo.save(copy, 'copy', 'Karakter kopiert'); selected = copy.id;
      message = 'Uavhengig kopi opprettet.'; await refresh(); break;
    }
    case 'delete': dialog('Slett karakter?', `<p>Vil du slette «${esc(c!.name)}» fra denne enheten? Eksporter backup først hvis du vil beholde karakteren.</p>`, async () => {
      await repo.remove(c!); message = 'Karakter slettet.'; await refresh();
    }, 'Slett karakter'); break;
    case 'undo': await repo.undo(c!); message = 'Siste endring angret.'; await refresh(); break;
    case 'history': {
      const events = await repo.history(c!.id);
      dialog('Endringslogg', `<p>Kun bekreftede endringer logges. Eldre verdier korrigeres manuelt.</p><ol>${events.map(e => `<li><strong>${esc(e.description)}</strong> · ${esc(new Date(e.timestamp).toLocaleString('nb-NO'))}<details><summary>Før og etter</summary><pre>${esc(JSON.stringify(e.changes, null, 2))}</pre></details></li>`).join('')}</ol>`, async () => {}, 'Lukk'); break;
    }
    case 'export': {
      const raw = await exportBackup(repo.db, characters);
      const url = URL.createObjectURL(new Blob([raw], { type: 'application/json' }));
      const a = document.createElement('a'); a.href = url; a.download = `dnd-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      await repo.setSetting('lastExport', Date.now()); tell('Backup eksportert. Oppbevar filen et trygt sted.'); break;
    }
    case 'import': dialog('Importer backup', '<p>Import legger til karakterer. En eksisterende ID overskrives aldri. Hele importen avvises ved feil.</p><label>JSON-fil<input type="file" name="backup" accept=".json,application/json" required></label>', async form => {
      const file = (form.elements.namedItem('backup') as HTMLInputElement).files![0];
      if (file.size > 20_000_000) throw new Error('Backup er for stor (maks 20 MB).');
      const imported = await importBackup(repo.db, await file.text());
      selected = imported[0].id; message = 'Backup importert.'; await refresh();
    }, 'Importer'); break;
  }
}
async function start() {
  root.innerHTML = '<p role="status">Åpner lokalt karakterark …</p>';
  try {
    repo = new CharacterRepository(await openDatabase());
    selected = await repo.setting<string>('selectedCharacter');
    await refresh();
    const last = await repo.setting<number>('lastExport');
    if (characters.length && (!last || Date.now() - last > 7 * 86400000)) tell('Husk å eksportere JSON-backup av karakterene dine.');
    try {
      if (localStorage.getItem('dnd-5e-pwa-data')) tell('Prototype-data finnes fortsatt i nettleseren. De er bevart, men importeres ikke automatisk. Åpne den gamle versjonen og eksporter før du flytter data manuelt.');
    } catch { /* IndexedDB can still work when localStorage access is restricted. */ }
  } catch (error) {
    root.innerHTML = `<main><h1>Kunne ikke åpne lokal lagring</h1><p role="alert">${esc(error instanceof Error ? error.message : error)}</p><p>Ikke slett nettleserdata. Tillat lokal lagring og prøv igjen.</p><button onclick="location.reload()">Prøv igjen</button></main>`;
  }
}
registerSW({ onOfflineReady() { tell('Appen er klar for bruk uten nett.'); },
  onNeedRefresh() { tell('En ny versjon er klar. Lagre endringer og lukk alle appfaner før du åpner appen igjen.'); },
  onRegisterError() { tell('Offline-cache kunne ikke oppdateres. Karakterdata er fortsatt lokale.'); } });
void start();
