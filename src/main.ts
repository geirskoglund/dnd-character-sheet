import { installUpdates } from './ui/updates';
import { choosePortrait } from './ui/portrait';
import { characterSchema, copyCharacter, createCharacter, type Character, type PortraitAsset } from './domain/model';
import { CharacterRepository, openDatabase } from './storage/database';
import { exportBackup, importBackup } from './storage/backup';
import { libraryPicker } from './ui/library-picker';
import { createRecordEditors } from './ui/record-editors';
import { characterView, combatView } from './ui/views';
import { characterForm, bindCharacterForm, readCharacterForm, subclassFields, bindSubclass, readSubclass } from './ui/character-form';
import { equipmentForm, bindEquipment, readEquipment, newEquipment } from './ui/equipment-form';
import { editDialog as dialog, viewDialog, confirmDialog, commitDialog } from './ui/dialog';
import { equipmentPicker, bindEquipmentPicker } from './ui/equipment-picker';
import { instantiateEquipment } from './domain/catalog';
import { historyView } from './ui/history';
import { modifiers, signed } from './domain/modifiers';
import { levelUpCharacter } from './domain/level-up';
import { deriveStats, hpAfterChange } from './domain/derived';
import { escapeHtml as esc, field, select } from './ui/html';
import './style.css';

const root = document.querySelector<HTMLDivElement>('#app')!;
const updates = installUpdates();
let repo: CharacterRepository;
let characters: Character[] = [];
let selected: string | undefined;
let portrait: PortraitAsset | undefined;
let page: 'character' | 'combat' = 'character';
let category = 'Action';
const scroll = { character: 0, combat: 0 };
let busy = false;
let message = '';
const current = () => characters.find(c => c.id === selected);
const editorContext = {current: () => current()!, save: async (draft: Character,type: string,description: string) => {
  await repo.save(draft,type,description); message = 'Endring lagret.'; await refresh();
}};
const editors = createRecordEditors(editorContext);
function openRecord(kind: string, id?: string) {
  switch (kind) {
    case 'action': editors.action(id); break;
    case 'feature': editors.feature(id); break;
    case 'species': editors.feature(id,'species'); break;
    case 'language': editors.language(id); break;
    case 'proficiency': editors.proficiency(id); break;
    case 'defense': editors.defense(id); break;
    case 'immunity': editors.immunity(id); break;
    case 'spell': editors.spell(id); break;
    case 'cantrip': editors.spell(id,true); break;
    case 'resource': editors.resource(id); break;
    case 'resource-custom': editors.resource(undefined,'custom'); break;
    case 'resource-spellSlot': editors.resource(undefined,'spellSlot'); break;
    case 'resource-hitDie': editors.resource(undefined,'hitDie'); break;
    case 'conditions': editors.conditions(); break;
    case 'deathSaves': editors.deathSaves(); break;
    case 'rest': editors.rest(); break;
    case 'inspiration': void run(editors.inspiration); break;
  }
}
function tell(text: string) {
  message = text;
  const status = document.querySelector('#status');
  if (status) status.textContent = text;
}
function render() {
  const c = current();
  root.onkeydown = event => {
    if (event.key === 'Escape' && root.querySelector('details.app-menu[open]')) {
      root.querySelector('details.app-menu')!.removeAttribute('open');
      root.querySelector<HTMLElement>('.app-menu > summary')!.focus();
    }
  };
  root.onclick = event => {
    if (!(event.target as HTMLElement).closest('.app-menu')) root.querySelector('details.app-menu')?.removeAttribute('open');
  };
  root.innerHTML = `<a href="#content" class="skip-link">Til innhold</a><div class="shell">
    <header>${portrait ? `<button class="portrait" data-action="portrait" aria-label="Vis portrett"><img src="${portrait.dataUrl}" alt="Portrett av ${esc(c?.name)}"></button>` : ''}<div class="identity"><p class="eyebrow">D&D · 5e 2014</p><h1>${esc(c?.name ?? 'Ditt neste eventyr')}</h1>${c ? `<p class="identity-detail">${esc(c.species.name)} · ${c.classes.map(cl => `${esc(cl.name)} ${cl.level}${cl.subclass ? ' · ' + esc(cl.subclass) : ''}`).join(' / ')}</p>` : ''}</div>
    <details class="app-menu"><summary>Meny</summary><div class="menu-panel">
    ${c ? '<h2>Denne karakteren</h2><div class="menu-actions"><button data-action="edit">Rediger karakter</button><button data-action="portrait">Portrett</button><button data-action="level-up">Level Up</button><button data-action="overrides">Beregninger og overstyringer</button><button data-action="history">Endringslogg</button><button data-action="undo">Angre siste endring</button></div>' : ''}
    <h2>Karakteradministrasjon</h2><label>Bytt karakter<select id="character-select"><option value="" disabled>Velg karakter</option>${characters.map(ch => `<option value="${ch.id}" ${selected === ch.id ? 'selected' : ''}>${esc(ch.name)}</option>`).join('')}</select></label>
    <div class="menu-actions"><button data-action="create">Ny karakter</button>${c ? '<button data-action="copy">Kopier karakter</button><button data-action="delete">Slett karakter</button>' : ''}<button data-action="export" ${characters.length ? '' : 'disabled'}>Eksporter backup</button><button data-action="import">Importer backup</button></div>
    <p class="muted">Lokalt lagret på denne enheten. Ta JSON-backup før du rydder nettleserdata.</p><a href="./SRD-LICENSE.txt">SRD 5.1 · lisens</a><p class="muted">Versjon ${__APP_VERSION__}</p><button data-action="check-update">Se etter oppdatering</button></div></details></header>
    <main id="content" tabindex="-1">${c ? page === 'character' ? characterView(c) : combatView(c, category) : '<section class="empty"><h2>Et ark som er ditt</h2><p>Opprett en karakter og før inn verdiene fra karakterarket ditt. Data lagres lokalt på denne enheten.</p><button data-action="create">Opprett første karakter</button></section>'}</main>
    <p id="status" role="status" aria-live="polite">${esc(message)}</p></div>
    <nav aria-label="Hovednavigasjon">${['character', 'combat'].map(tab => `<button data-page="${tab}" ${page === tab ? 'aria-current="page"' : ''}>${tab === 'character' ? 'Character' : 'Combat'}</button>`).join('')}</nav>
    `;
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
    const next = (event.target as HTMLSelectElement).value;
    if (!next || next === selected) return;
    selected = next;
    await refresh();
  });
  root.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(button => button.onclick = () => {
    root.querySelector('details.app-menu')?.removeAttribute('open');
    void run(() => action(button.dataset.action!));
  });
  root.querySelectorAll<HTMLButtonElement>('[data-modifier]').forEach(button => button.onclick = () => {
    const c = current()!, index = Number(button.dataset.modifier);
    const options = modifiers(c);
    const d = viewDialog('Velg modifierfavoritt', `<p>Trykk på oppslaget som skal vises i dette kortet.</p><div class="modifier-list">${options.map((m, i) => `<button type="button" data-choice="${i}" aria-pressed="${c.favoriteModifierRefs[index] === m.ref}"><span>${esc(m.name)}</span><strong>${signed(m.value)}</strong></button>`).join('')}</div>`);
    d.querySelectorAll<HTMLButtonElement>('[data-choice]').forEach(choice => choice.onclick = () => void commitDialog(async () => {
      if (c.favoriteModifierRefs[index] === options[Number(choice.dataset.choice)].ref) return;
      const draft = structuredClone(c);
      draft.favoriteModifierRefs[index] = options[Number(choice.dataset.choice)].ref;
      await repo.save(draft, 'favorite', 'Modifierfavoritt endret');
      message = 'Modifierfavoritt lagret.'; await refresh();
    }));
  });
  root.querySelectorAll<HTMLButtonElement>('[data-trait]').forEach(button => button.onclick = () => {
    const trait = current()!.species.traits[Number(button.dataset.trait)];
    viewDialog(trait.name, `<p>${esc(trait.description)}</p>`);
  });
  root.querySelectorAll<HTMLButtonElement>('[data-note]').forEach(button => button.onclick = () => editNote(button.dataset.note));
  root.querySelectorAll<HTMLButtonElement>('[data-lookup]').forEach(button=>button.onclick=()=>{
    const [kind,id]=button.dataset.lookup!.split(':');
    const c=current()!;
    if (kind==='spell') {
      const row=c.spells.find(row=>row.id===id)!;
      viewDialog(row.name,`<p>${row.spellLevel ? `Level ${row.spellLevel}` : 'Cantrip ∞'} · ${esc(row.castingTime)} · ${esc(row.range)}</p><p>${esc(row.duration)}${row.concentration?' · Concentration':''}${row.ritual?' · Ritual':''}</p><p>${esc(row.components.join(', '))}</p><p>${esc([row.attack,row.save,row.damage].filter(Boolean).join(' · '))}</p><p class="rule-text">${esc(row.description)}</p>`);
    } else {
      const row=c.actions.find(row=>row.id===id)!;
      viewDialog(row.name,`<p>${esc([row.attackRoll,...row.damageRolls,row.saveDC ? `Save DC ${row.saveDC}` : '',row.range].filter(Boolean).join(' · '))}</p><p class="rule-text">${esc(row.detail || row.summary)}</p>${row.requirements?`<p>Krav: ${esc(row.requirements)}</p>`:''}<div class="pills">${row.resourceRefs.map(id=>c.resources.find(pool=>pool.id===id)).filter(pool=>!!pool).map(pool=>`<button type="button" class="pill" data-lookup-resource="${pool.id}">${esc(pool.name)} · ${pool.current}/${pool.max}</button>`).join('')}</div>`);
      document.querySelectorAll<HTMLButtonElement>('[data-lookup-resource]').forEach(button=>button.onclick=()=>editors.resource(button.dataset.lookupResource));
    }
  });
  root.querySelectorAll<HTMLButtonElement>('[data-add]').forEach(button => button.onclick = () => {
    const kind=button.dataset.add!;
    if (kind==='feature' || kind==='spell' || kind==='cantrip') libraryPicker(editorContext,kind,()=>openRecord(kind));
    else openRecord(kind);
  });
  root.querySelectorAll<HTMLButtonElement>('[data-record]').forEach(button => button.onclick = () => {
    const key = button.dataset.record!, separator = key.indexOf(':');
    openRecord(separator < 0 ? key : key.slice(0,separator), separator < 0 ? undefined : key.slice(separator+1) || undefined);
  });
  root.querySelectorAll<HTMLButtonElement>('[data-equipment-group]').forEach(button => button.onclick = () => addEquipment(current()!,button.dataset.equipmentGroup));
  root.querySelectorAll<HTMLButtonElement>('[data-item]').forEach(button => button.onclick = () => inspectEquipment(button.dataset.item!));
}
async function refresh() {
  characters = await repo.list();
  if (!current()) selected = characters[0]?.id;
  await repo.setSetting('selectedCharacter', selected);
  portrait = current()?.portraitAssetId ? await repo.portrait(current()!.portraitAssetId!) : undefined;
  render();
}
async function run(fn: () => Promise<void>) {
  if (busy) return;
  busy = true;
  try { await fn(); } catch (error) { tell(error instanceof Error ? error.message : 'Operasjonen mislyktes. Prøv igjen og ta backup.'); }
  finally { busy = false; }
}
function editCharacter(source?: Character) {
  const draft = source ? structuredClone(source) : { ...createCharacter(), name: '' };
  const creating = !source;
  const d = dialog(source ? 'Rediger karakter' : 'Ny karakter', characterForm(draft, creating), async form => {
    const updated = readCharacterForm(form, draft, creating);
    if (!updated.species.name || updated.species.walkingSpeed === null) throw new Error('Velg art eller angi navn og grunnfart for egen art.');
    if (!updated.classes.length || updated.classes.some(cl => !cl.name)) throw new Error('Velg minst én klasse.');
    if (new Set(updated.classes.map(cl => cl.name.toLowerCase())).size !== updated.classes.length) throw new Error('Registrer hver klasse én gang, med samlet klassenivå.');
    if (updated.hp.max < 1) throw new Error('Registrer maksimal HP fra karakterarket.');
    const valid = characterSchema.safeParse(updated);
    if (!valid.success) throw new Error('Kontroller navn, klassenivå (totalt 1–20), ability scores og maks HP.');
    const saved = await repo.save(valid.data, source ? 'edit' : 'create', source ? 'Karaktergrunnlag redigert' : 'Karakter opprettet');
    selected = saved.id;
    message = 'Karakter lagret på denne enheten.';
    await refresh();
  });
  bindCharacterForm(d.querySelector('form')!, draft, creating);
}
function inspectEquipment(id: string) { editEquipment(current()!, id); }
function addEquipment(c: Character, group = '') {
  const d = viewDialog('Legg til utstyr', equipmentPicker(group), '[name="equipmentSearch"]');
  bindEquipmentPicker(d, async catalogId => {
    const item = instantiateEquipment(catalogId);
    await repo.save({...c, items:[...c.items, item]}, 'equipment', `${item.name} lagt til`);
    message = `${item.name} lagt til.`; await refresh();
  }, () => editEquipment(c,undefined,group));
}
function editEquipment(c: Character, id?: string, group = '') {
  const source = id ? c.items.find(i => i.id === id)! : {...newEquipment(),category:(group === 'weapon' ? 'weapon' : group === 'armor' ? 'armor' : 'equipment') as Character['items'][number]['category']};
  const d = dialog(id ? source.name : 'Nytt utstyr', equipmentForm(source, !id), async form => {
    const item = readEquipment(form, source);
    const items = id ? c.items.map(i => i.id === id ? item : i) : [...c.items, item];
    const result = characterSchema.safeParse({...c, items});
    if (!result.success) throw new Error('Kontroller navn, antall og utstyrsverdier. Bruk hele tall der det kreves.');
    await repo.save(result.data, 'equipment', `${item.name} ${id ? 'redigert' : 'lagt til'}`);
    message = 'Utstyr lagret.'; await refresh();
  });
  bindEquipment(d.querySelector('form')!, source, c);
  const remove = d.querySelector<HTMLButtonElement>('#delete-item');
  if (remove) remove.onclick = () => confirmDialog('Fjern utstyr?', `<p>Vil du fjerne «${esc(source.name)}» fra karakteren?</p>`, async () => {
    await repo.save({...c, items:c.items.filter(i => i.id !== id)}, 'equipment', `${source.name} fjernet`);
    message = 'Utstyr fjernet.'; await refresh();
  }, 'Fjern utstyr');
}
function levelUp(c: Character) {
  if (!c.classes.length) { tell('Registrer klasse og klassenivå før Level Up.'); editCharacter(c); return; }
  if (c.level >= 20) { tell('Karakteren er allerede level 20. Korriger eventuelt nivå via Rediger karakter.'); return; }
  const d = dialog('Level Up', `<p>Level ${c.level} → ${c.level + 1}. Registrer det du og DM har bestemt.</p>
    ${c.classes.length === 1 ? `<p>${esc(c.classes[0].name)} ${c.classes[0].level} → ${c.classes[0].level + 1}</p><input type="hidden" name="levelClass" value="${c.classes[0].id}">` : select('Klasse som øker ett nivå', 'levelClass', c.classes[0].id, c.classes.map(cl => ({value:cl.id, label:`${cl.name} ${cl.level} → ${cl.level + 1}`})), 'required')}
    <div data-level-subclass></div>
    ${field('Ny samlet maks HP', 'maxHp', '', `type="number" min="${Math.max(1, c.hp.max)}" required`)}
    <p>Tidligere maks HP: ${c.hp.max}. Legg til fysisk Hit Die-kast eller fast verdi, Constitution modifier og eventuelle andre bonuser.</p>
    <p>Nåværende HP og temporary HP beholdes. Kontroller andre endringer med DM. Ny klasse kan registreres via Rediger karakter.</p>`, async form => {
      const data = new FormData(form);
      const draft = levelUpCharacter(c, String(data.get('levelClass')), Number(data.get('maxHp')), readSubclass(form));
      await repo.save(draft, 'level-up', `Level Up: ${c.level} → ${draft.level}, maks HP ${c.hp.max} → ${draft.hp.max}`);
      message = 'Nivå og maks HP oppdatert.'; await refresh();
    }, 'Bekreft Level Up');
  const form = d.querySelector('form')!;
  const update = () => {
    const cl = c.classes.find(cl => cl.id === form.querySelector<HTMLInputElement | HTMLSelectElement>('[name="levelClass"]')!.value)!;
    form.querySelector('[data-level-subclass]')!.innerHTML = subclassFields(cl.definitionRef?.id ?? '', cl.subclass);
    bindSubclass(form);
  };
  form.querySelector<HTMLInputElement | HTMLSelectElement>('[name="levelClass"]')!.onchange = update;
  form.addEventListener('change', () => bindSubclass(form));
  update();
}
function editHitPoints(c: Character) {
  const range = Math.max(c.hp.max, c.hp.current + c.hp.temp, 1);
  const d = dialog('Endre HP', `<p>Skade bruker temporary HP først. Healing endrer bare vanlig HP.</p><label>Endring i HP<input type="range" name="delta" min="-${range}" max="${range}" value="0" step="1"></label>${field('HP-endring i tall', 'deltaAmount', 0, `type="number" min="-${range}" max="${range}" step="1" required inputmode="numeric"`)}<div class="actions"><button type="button" id="hp-minus" aria-label="Reduser endring med 1">−1</button><button type="button" id="hp-plus" aria-label="Øk endring med 1">+1</button></div><p id="hp-preview" aria-live="polite"></p>`, async form => {
    const delta = Number(new FormData(form).get('delta'));
    if (!Number.isInteger(delta) || delta < -range || delta > range) throw new Error('Ugyldig HP-endring.');
    if (!delta) return;
    await repo.save({ ...c, hp: hpAfterChange(c.hp, delta) }, 'hp', `HP endret (${delta > 0 ? '+' : ''}${delta})`);
    message = 'HP oppdatert.'; await refresh();
  }, 'Oppdater HP');
  const slider = d.querySelector<HTMLInputElement>('[name="delta"]')!;
  const amount = d.querySelector<HTMLInputElement>('[name="deltaAmount"]')!;
  const preview = () => {
    const delta = Number(slider.value), after = hpAfterChange(c.hp, delta);
    amount.value = slider.value;
    d.querySelector<HTMLButtonElement>('#submit')!.disabled = delta === 0;
    d.querySelector('#hp-preview')!.textContent = `${delta > 0 ? '+' : ''}${delta}: HP ${c.hp.current} → ${after.current} / ${after.max} · Temporary HP ${c.hp.temp} → ${after.temp}`;
  };
  slider.oninput = preview;
  amount.oninput = () => {
    if (amount.value === '' || !amount.checkValidity()) { d.querySelector<HTMLButtonElement>('#submit')!.disabled = true; return; }
    slider.value = amount.value; preview();
  };
  d.querySelector<HTMLButtonElement>('#hp-minus')!.onclick = () => { slider.stepDown(); preview(); };
  d.querySelector<HTMLButtonElement>('#hp-plus')!.onclick = () => { slider.stepUp(); preview(); };
  preview();
}
function editOverrides(c: Character) {
  const stats = deriveStats({ ...c, acOverride: null, speedOverride: null });
  dialog('Beregninger og overstyringer', `<p>Grunnlaget gir AC ${stats.ac} og speed ${stats.speed ?? 'ukjent'} ft. La feltene stå tomme for å bruke beregningene.</p>
    <p>${esc(stats.acExplanation)}</p><p>${esc(stats.speedExplanation)}</p>${stats.warnings.map(w => `<p class="warning">${esc(w)}</p>`).join('')}
    ${field('Manuell AC (valgfritt)', 'ac', c.acOverride ?? '', 'type="number" min="0"')}
    ${field('Manuell speed (ft, valgfritt)', 'speed', c.speedOverride ?? '', 'type="number" min="0"')}
    ${field('Manuell proficiency bonus (valgfritt)', 'proficiencyBonus', c.proficiencyBonusOverride ?? '', 'type="number" step="1"')}
    ${field('Manuell Initiative (valgfritt)', 'initiative', c.derivedOverrides.initiative ?? '', 'type="number" step="1"')}
    ${field('Manuell Passive Perception (valgfritt)', 'passivePerception', c.derivedOverrides.passivePerception ?? '', 'type="number" step="1"')}
    ${select('Unarmored Defense', 'unarmoredDefense', c.unarmoredDefense, [{ value: 'auto', label: 'Fra registrert klasse' }, { value: 'none', label: 'Vanlig AC / rustning' }, { value: 'barbarian', label: 'Fra Barbarian' }, { value: 'monk', label: 'Fra Monk' }])}
    <p>Multiclass: Du kan ikke få Unarmored Defense en gang til fra en annen klasse. Velg den karakteren faktisk har. Rustning og skjold må fortsatt oppfylle egenskapens vilkår.</p>`, async form => {
    const data = new FormData(form), ac = String(data.get('ac')), speed = String(data.get('speed'));
    const draft = characterSchema.parse({ ...c, acOverride: ac === '' ? null : Number(ac), speedOverride: speed === '' ? null : Number(speed), unarmoredDefense: data.get('unarmoredDefense'),proficiencyBonusOverride:String(data.get('proficiencyBonus'))===''?undefined:Number(data.get('proficiencyBonus')) });
    for (const name of ['initiative','passivePerception']) { const value=String(data.get(name)); if (value==='') delete draft.derivedOverrides[name]; else draft.derivedOverrides[name]=Number(value); }
    await repo.save(draft, 'override', 'Beregningsvalg endret'); message = 'Beregninger oppdatert.'; await refresh();
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
    confirmDialog('Slett notat?', `<p>Vil du slette «${esc(note.title)}»?</p>`, async () => {
      draft.notes = draft.notes.filter(n => n.id !== id);
      if (draft.backgroundNoteId === id) delete draft.backgroundNoteId;
      await repo.save(draft, 'note', 'Notat slettet'); await refresh();
    }, 'Slett notat');
  };
}
async function action(name: string) {
  const c = current();
  switch (name) {
    case 'portrait': {
      const upload = async () => {
        const asset = await choosePortrait();
        if (!asset) return;
        await repo.save({...c!,portraitAssetId:asset.id},'portrait','Portrett endret',asset);
        message = 'Portrett lagret.'; await refresh();
      };
      if (!portrait) { await upload(); break; }
      const d = viewDialog('Portrett', `<img class="portrait-large" src="${portrait.dataUrl}" alt="Portrett av ${esc(c!.name)}"><div class="actions"><button type="button" id="change-portrait">Bytt portrett</button><button type="button" id="remove-portrait">Fjern portrett</button></div>`);
      d.querySelector<HTMLButtonElement>('#change-portrait')!.onclick = () => void commitDialog(upload);
      d.querySelector<HTMLButtonElement>('#remove-portrait')!.onclick = () => confirmDialog('Fjern portrett?', '<p>Bildet fjernes fra denne karakteren.</p>', async () => {
        const draft=structuredClone(c!); delete draft.portraitAssetId;
        await repo.save(draft,'portrait','Portrett fjernet'); await refresh();
      }, 'Fjern');
      break;
    }
    case 'check-update': await updates.check(); break;
    case 'create': editCharacter(); break;
    case 'edit': editCharacter(c); break;
    case 'edit-equipment': addEquipment(c!); break;
    case 'level-up': levelUp(c!); break;
    case 'hp': editHitPoints(c!); break;
    case 'overrides': editOverrides(c!); break;
    case 'temp-hp': dialog('Temporary HP', `<p>Sett den nye totalen. Temporary HP stables ikke; velg hvilken total du beholder.</p>${field('Temporary HP', 'temp', c!.hp.temp, 'type="number" min="0" required')}`, async form => {
      const draft = characterSchema.parse({ ...c!, hp: { ...c!.hp, temp: Number(new FormData(form).get('temp')) } });
      await repo.save(draft, 'temp-hp', 'Temporary HP endret'); message = 'Temporary HP oppdatert.'; await refresh();
    }); break;
    case 'money': dialog('Penger', field('GP', 'gold', (c!.goldCp / 100).toFixed(2), 'type="number" min="0" step="0.01" required'), async form => {
      const draft = characterSchema.parse({ ...c!, goldCp: Math.round(Number(new FormData(form).get('gold')) * 100) });
      await repo.save(draft, 'money', 'Penger endret'); message = 'Penger oppdatert.'; await refresh();
    }); break;
    case 'note': editNote(); break;
    case 'copy': {
      const copy = copyCharacter(c!);
      await repo.save(copy, 'copy', 'Karakter kopiert'); selected = copy.id;
      message = 'Uavhengig kopi opprettet.'; await refresh(); break;
    }
    case 'delete': confirmDialog('Slett karakter?', `<p>Vil du slette «${esc(c!.name)}» fra denne enheten? Eksporter backup først hvis du vil beholde karakteren.</p>`, async () => {
      await repo.remove(c!); message = 'Karakter slettet.'; await refresh();
    }, 'Slett karakter'); break;
    case 'undo': await repo.undo(c!); message = 'Siste endring angret.'; await refresh(); break;
    case 'history': {
      const events = await repo.history(c!.id);
      viewDialog('Endringslogg', historyView(events)); break;
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
void start();
