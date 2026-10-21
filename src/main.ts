import {textArea} from './ui/record-fields';
import {numberChangeDialog} from './ui/number-change-dialog';
import {effectiveMaxHp} from './domain/item-effects';
import {isTestApp,testVersion} from './app-environment';
import {z} from 'zod';
import {WizardDraftRepository} from './storage/wizard-drafts';
import {newWizardDraft,type WizardDraft,type DraftToken} from './domain/wizard-draft';
import type {EditorContext} from './ui/record-editors';
import {changeMoney} from './ui/money-control';
import {flushWizard} from './ui/wizard';
import {inspectRecord} from './ui/record-dialogs';
import {withStandardResources} from './domain/resource-setup';
import {equipmentWizard,equipmentDraftPayload,inspectEquipment as equipmentLookup} from './ui/equipment-wizard';
import {guidedRecord} from './ui/guided-records';
import {resourceDialog,resourceWizard,restDialog} from './ui/resource-dialogs';
import {preparationDialog} from './ui/preparation';
import {bindWizard} from './ui/wizard';
import {bindCombatSwipe} from './ui/combat-swipe';
import {icon,portraitPlaceholder} from './ui/icons';
import {changeHp} from './ui/hp-control';
import { installUpdates } from './ui/updates';
import { choosePortrait } from './ui/portrait';
import { characterSchema, copyCharacter, createCharacter, type Character, type PortraitAsset } from './domain/model';
import { CharacterRepository, openDatabase } from './storage/database';
import { exportBackup, importBackup } from './storage/backup';
import { libraryPicker } from './ui/library-picker';
import { createRecordEditors } from './ui/record-editors';
import { characterView, combatView, equipmentView, magicView } from './ui/views';
import { characterForm, bindCharacterForm, readCharacterForm, subclassFields, bindSubclass, readSubclass } from './ui/character-form';
import { newEquipment, weaponSummary } from './ui/equipment-form';
import { editDialog as dialog, viewDialog, confirmDialog, commitDialog } from './ui/dialog';
import { equipmentPicker, bindEquipmentPicker } from './ui/equipment-picker';
import { instantiateEquipment } from './domain/catalog';
import { historyView } from './ui/history';
import { modifiers, signed } from './domain/modifiers';
import { levelUpCharacter } from './domain/level-up';
import { deriveStats } from './domain/derived';
import { escapeHtml as esc, field, select } from './ui/html';
import './style.css';

const root = document.querySelector<HTMLDivElement>('#app')!;
const updates = installUpdates();
let repo: CharacterRepository;
let draftRepo:WizardDraftRepository;
let drafts:WizardDraft[]=[];
let characters: Character[] = [];
let selected: string | undefined;
let portrait: PortraitAsset | undefined;
let page: 'character' | 'combat' | 'magic' | 'equipment' = 'character';
let category = 'Action';
const scroll = { character: 0, combat: 0, magic:0, equipment: 0 };
let busy = false;
let message = '';
const current = () => characters.find(c => c.id === selected);
const editorContext:EditorContext = {get drafts(){return draftRepo;},draftChanged:refresh,current: () => current()!, save: async (draft: Character,type: string,description: string,completion?:DraftToken) => {
  await saveCharacter(draft,type,description,undefined,completion); message = ''; await refresh();
}};
const editors = createRecordEditors(editorContext);
async function saveCharacter(input:Character,type='edit',description='Karakter redigert',asset?:PortraitAsset,completion?:DraftToken){
  const draft=withStandardResources(input),existing=current();
  if(!asset&&!completion&&existing?.id===draft.id&&JSON.stringify(existing)===JSON.stringify(draft))return existing;
  return repo.save(draft,type,description,asset,completion);
}
function openRecord(kind: string, id?: string) {
  switch (kind) {
    case 'action': editors.action(id); break;
    case 'feature': if(id)inspectRecord(editorContext,'feature',id,(draft,completion)=>editors.feature(id,undefined,draft as Character['features'][number],completion));else guidedRecord(editorContext,'feature',undefined,'feat',false,(draft,completion)=>editors.feature(undefined,undefined,draft as Character['features'][number],completion)); break;
    case 'species': editors.feature(id,'species'); break;
    case 'language': editors.language(id); break;
    case 'proficiency': editors.proficiency(id); break;
    case 'defense': editors.defense(id); break;
    case 'immunity': editors.immunity(id); break;
    case 'spell': if(id)inspectRecord(editorContext,'spell',id,(draft,completion)=>editors.spell(id,false,draft as Character['spells'][number],completion));else guidedRecord(editorContext,'spell',undefined,'feat',false,(draft,completion)=>editors.spell(undefined,false,draft as Character['spells'][number],completion)); break;
    case 'cantrip': if(id)inspectRecord(editorContext,'spell',id,(draft,completion)=>editors.spell(id,true,draft as Character['spells'][number],completion));else guidedRecord(editorContext,'cantrip',undefined,'feat',false,(draft,completion)=>editors.spell(undefined,true,draft as Character['spells'][number],completion)); break;
    case 'resource': if(id)resourceDialog(editorContext,id,()=>editHitPoints(current()!));else resourceWizard(editorContext); break;
    case 'resource-custom': resourceWizard(editorContext); break;
    case 'resource-spellSlot': resourceWizard(editorContext,undefined,'spellSlot'); break;
    case 'resource-hitDie': resourceWizard(editorContext,undefined,'hitDie'); break;
    case 'conditions': editors.conditions(); break;
    case 'deathSaves': editors.deathSaves(); break;
    case 'rest': restDialog(editorContext,()=>editHitPoints(current()!)); break;
    case 'inspiration': void run(async()=>{
      const position=window.scrollY;await editors.inspiration();
      root.querySelector<HTMLElement>('[data-record="inspiration"]')?.focus({preventScroll:true});window.scrollTo(0,position);
    }); break;
  }
}
function tell(text: string, error=false) {
  message = text;
  const status = document.querySelector<HTMLElement>('#status');
  if(status){status.textContent=text;status.setAttribute('role',error?'alert':'status');if(error){status.tabIndex=-1;status.focus();status.scrollIntoView({block:'center'});}}
}
function draftButtons(rows:WizardDraft[]){return rows.map(d=>`<button type="button" data-draft="${d.id}"><span>${esc(d.label)}</span><small>Utkast · Fortsett</small></button>`).join('');}
async function resumeWizard(id:string){
 const entry=(await draftRepo.list()).find(d=>d.id===id);if(!entry)throw new Error('Utkastet finnes ikke lenger.');
 if(entry.characterId){if(!characters.some(c=>c.id===entry.characterId))throw new Error('Karakteren til dette utkastet finnes ikke.');selected=entry.characterId;await refresh();}
 root.querySelector('details.app-menu')?.removeAttribute('open');
 const context={...editorContext,resumedDraft:entry};
 if(entry.kind==='equipment'){const payload=equipmentDraftPayload.parse(entry.payload);page='equipment';render();equipmentWizard(context,payload.source,payload.existing);}
 else if(entry.kind==='character'){
  const payload=z.object({source:characterSchema.safeExtend({name:z.string().max(100)}),creating:z.boolean(),classes:characterSchema.shape.classes}).parse(entry.payload);editCharacter(payload.creating?undefined:payload.source,{...entry,payload});
 }else if(entry.kind==='resource'){const payload=z.object({pool:characterSchema.shape.resources.element,existing:z.boolean(),kind:z.enum(['custom','spellSlot','hitDie'])}).parse(entry.payload);resourceWizard(context,payload.existing?payload.pool.id:undefined,payload.kind);}
 else{
  const payload=z.object({base:(entry.kind==='spell'||entry.kind==='cantrip'?characterSchema.shape.spells.element:characterSchema.shape.features.element).optional(),category:z.enum(['class','feat']).optional(),existing:z.boolean(),expected:(entry.kind==='spell'||entry.kind==='cantrip'?characterSchema.shape.spells.element:characterSchema.shape.features.element).optional()}).parse(entry.payload);
  if(entry.kind==='spell'||entry.kind==='cantrip'){page='magic';render();}
  guidedRecord(context,entry.kind,payload.base,payload.category,payload.existing,(draft,completion)=>entry.kind==='spell'||entry.kind==='cantrip'?editors.spell(payload.existing?payload.base?.id:undefined,entry.kind==='cantrip',draft as Character['spells'][number],completion):editors.feature(payload.existing?payload.base?.id:undefined,entry.kind==='species'?'species':payload.category,draft as Character['features'][number],completion));
 }
}
function menuMarkup(c:Character|undefined){
  const button=(action:string,label:string,glyph:Parameters<typeof icon>[0])=>`<button data-action="${action}">${icon(glyph)}<span>${label}</span></button>`;
  return `<details class="app-menu"><summary aria-label="Meny">${icon('menu')}<span class="sr-only">Meny</span></summary><div class="menu-panel" aria-label="Karaktermeny">
    ${c?`<h2>Denne karakteren</h2><div class="menu-actions">${button('edit','Rediger karakter','note')}${button('portrait','Portrett','species')}${button('level-up','Level Up','magic')}${button('overrides','Beregninger og overstyringer','tools')}${button('history','Endringslogg','history')}${button('undo','Angre siste endring','history')}</div>`:''}
    ${drafts.length?`<h2>Utkast</h2><div class="draft-list">${draftButtons(drafts)}</div>`:''}<h2>Karakteradministrasjon</h2><label>Bytt karakter<select id="character-select"><option value="" disabled>Velg karakter</option>${characters.map(ch=>`<option value="${ch.id}" ${selected===ch.id?'selected':''}>${esc(ch.name)}</option>`).join('')}</select></label>
    <div class="menu-actions">${button('create','Ny karakter','plus')}${c?button('copy','Kopier karakter','feature')+button('delete','Slett karakter','close'):''}<button data-action="export" ${characters.length?'':'disabled'}>${icon('equipment')}<span>Eksporter backup</span></button>${button('import','Importer backup','equipment')}</div>
    <p class="muted">Lokalt lagret på denne enheten. Ta JSON-backup før du rydder nettleserdata.</p>
    <div class="menu-actions">${button('about','Om appen','feature')}${button('check-update','Se etter oppdatering','history')}</div>
  </div></details>`;
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
    ${isTestApp?`<p class="test-version" aria-label="Testversjon">${esc(testVersion)}</p>`:''}
    <header class="character-header">${c?`<button class="portrait" data-action="portrait" aria-label="${portrait?'Vis portrett':'Velg portrett'}">${portrait?`<img src="${portrait.dataUrl}" alt="Portrett av ${esc(c.name)}">`:portraitPlaceholder()}</button>`:''}<div class="identity"><h1>${esc(c?.name ?? 'Ditt neste eventyr')}</h1>${c?`<p class="identity-detail">${esc(c.species.name)} · ${c.classes.map(cl=>`${esc(cl.name)} ${cl.level}${cl.subclass?' · '+esc(cl.subclass):''}`).join(' / ')}</p>`:''}</div></header>
    <main id="content" tabindex="-1">${c&&page==='equipment'&&drafts.some(d=>d.kind==='equipment'&&d.characterId===c.id)?`<section aria-label="Utstyrsutkast"><h2>Utkast</h2><div class="draft-list">${draftButtons(drafts.filter(d=>d.kind==='equipment'&&d.characterId===c.id))}</div></section>`:''}${c ? page === 'character' ? characterView(c) : page === 'equipment' ? equipmentView(c) : page === 'magic' ? magicView(c) : combatView(c, category) : '<section class="empty"><h2>Et ark som er ditt</h2><p>Opprett en karakter og før inn verdiene fra karakterarket ditt. Data lagres lokalt på denne enheten.</p><button data-action="create">Opprett første karakter</button></section>'}</main>
    <p id="status" role="status" aria-live="polite">${esc(message)}</p></div>
    <nav class="main-nav" aria-label="Hovednavigasjon"><div class="nav-inner">${(['character','combat','magic','equipment'] as const).map(tab=>`<button data-page="${tab}" ${page===tab?'aria-current="page"':''}>${icon(tab==='character'?'feature':tab==='combat'?'crossedSwords':tab==='magic'?'wand':'backpack')}<span class="sr-only">${tab==='character'?'Character':tab==='combat'?'Combat':tab==='magic'?'Magi':'Utstyr'}</span></button>`).join('')}${menuMarkup(c)}</div></nav>
    `;
  root.querySelectorAll<HTMLButtonElement>('[data-draft]').forEach(b=>b.onclick=()=>void run(()=>resumeWizard(b.dataset.draft!)));
  root.querySelectorAll<HTMLButtonElement>('[data-page]').forEach(button => button.onclick = () => {
    scroll[page] = window.scrollY;
    page = button.dataset.page as typeof page;
    render();
    window.scrollTo(0, scroll[page]);
    document.querySelector<HTMLElement>(`[data-page="${page}"]`)?.focus({ preventScroll: true });
  });
  const setCategory=(next:string,focus=false)=>{
    if(category===next)return;
    const position=window.scrollY;category=next;render();window.scrollTo(0,position);
    if(focus)root.querySelector<HTMLElement>(`[data-category="${category}"]`)?.focus({preventScroll:true});
  };
  root.querySelectorAll<HTMLButtonElement>('[data-category]').forEach(button=>button.onclick=()=>setCategory(button.dataset.category!,true));
  const combatRegion=root.querySelector<HTMLElement>('[aria-label="Kampoppslag"]');
  if(combatRegion)bindCombatSwipe(combatRegion,direction=>{const categories=['Action','Bonus','Reaction'];setCategory(categories[Math.max(0,Math.min(2,categories.indexOf(category)+direction))]);});
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
    const d = viewDialog('Velg modifierfavoritt', `<p>Trykk på oppslaget som skal vises i dette kortet.</p><div class="modifier-list">${options.map((m, i) => `<button type="button" data-choice="${i}" aria-pressed="${c.favoriteModifierRefs[index] === m.ref}"><span>${esc(m.name)}</span><strong>${signed(m.value)}</strong></button>`).join('')}</div>`,undefined,'large');
    d.querySelectorAll<HTMLButtonElement>('[data-choice]').forEach(choice => choice.onclick = () => void commitDialog(async () => {
      if (c.favoriteModifierRefs[index] === options[Number(choice.dataset.choice)].ref) return;
      const draft = structuredClone(c);
      draft.favoriteModifierRefs[index] = options[Number(choice.dataset.choice)].ref;
      await saveCharacter(draft, 'favorite', 'Modifierfavoritt endret');
      message = ''; await refresh();
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
    if (kind==='weapon' || kind==='offhand') {
      const item=c.items.find(row=>row.id===id)!;
      viewDialog(item.name + (kind==='offhand' ? ' · Off-hand' : ''), weaponSummary(c,item,kind==='offhand') + [item.userNote,item.notes].filter(Boolean).map(note=>`<p class="rule-text">${esc(note)}</p>`).join(''));
    } else if (kind==='spell') {
      const row=c.spells.find(row=>row.id===id)!;
      viewDialog(row.name,`<p>${row.spellLevel ? `Level ${row.spellLevel}` : 'Cantrip ∞'} · ${esc(row.castingTime)} · ${esc(row.range)}</p><p>${esc(row.duration)}${row.concentration?' · Concentration':''}${row.ritual?' · Ritual':''}</p><p>${esc(row.components.join(', '))}</p><p>${esc([row.attack,row.save,row.damage].filter(Boolean).join(' · '))}</p><p class="rule-text">${esc(row.description)}</p>`);
    } else {
      const row=c.actions.find(row=>row.id===id)!;
      viewDialog(row.name,`<p>${esc([row.attackRoll,...row.damageRolls,row.saveDC ? `Save DC ${row.saveDC}` : '',row.range].filter(Boolean).join(' · '))}</p><p class="rule-text">${esc(row.detail || row.summary)}</p>${row.requirements?`<p>Krav: ${esc(row.requirements)}</p>`:''}<div class="pills">${row.resourceRefs.map(id=>c.resources.find(pool=>pool.id===id)).filter(pool=>!!pool).map(pool=>`<button type="button" class="pill" data-lookup-resource="${pool.id}">${esc(pool.name)} · ${pool.current}/${pool.max}</button>`).join('')}</div>`);
      document.querySelectorAll<HTMLButtonElement>('[data-lookup-resource]').forEach(button=>button.onclick=()=>resourceDialog(editorContext,button.dataset.lookupResource!,()=>editHitPoints(current()!)));
    }
  });
  root.querySelectorAll<HTMLButtonElement>('[data-add]').forEach(button => button.onclick = () => {
    const kind=button.dataset.add!;
    if (kind==='feature' || kind==='spell' || kind==='cantrip') libraryPicker(editorContext,kind,(base,category)=>guidedRecord(editorContext,kind,base,category,false,(draft,completion)=>kind==='feature'?editors.feature(undefined,category,draft as Character['features'][number],completion):editors.spell(undefined,kind==='cantrip',draft as Character['spells'][number],completion)));
    else if(kind==='species')guidedRecord(editorContext,'species',undefined,'feat',false,(draft,completion)=>editors.feature(undefined,'species',draft as Character['features'][number],completion));else openRecord(kind);
  });
  root.querySelectorAll<HTMLButtonElement>('[data-record]').forEach(button => button.onclick = () => {
    const key = button.dataset.record!, separator = key.indexOf(':');
    openRecord(separator < 0 ? key : key.slice(0,separator), separator < 0 ? undefined : key.slice(separator+1) || undefined);
  });
  root.querySelectorAll<HTMLButtonElement>('[data-equipment-group]').forEach(button => button.onclick = () => addEquipment(current()!,button.dataset.equipmentGroup));
  root.querySelectorAll<HTMLButtonElement>('[data-item]').forEach(button => button.onclick = () => inspectEquipment(button.dataset.item!));
  root.querySelectorAll<HTMLButtonElement>('[data-item-counter]').forEach(button=>button.onclick=()=>void run(async()=>{const c=structuredClone(current()!),pool=c.resources.find(p=>p.id===button.dataset.pool);if(!pool)return;pool.current=Math.max(0,Math.min(pool.max,pool.current+Number(button.dataset.delta)));await saveCharacter(c,'resource',pool.name+' bruk endret');await refresh();}));

}
async function refresh() {
  characters = (await repo.list()).map(withStandardResources);
  drafts=await draftRepo.list();
  if (!current()) selected = characters[0]?.id;
  await repo.setSetting('selectedCharacter', selected);
  portrait = current()?.portraitAssetId ? await repo.portrait(current()!.portraitAssetId!) : undefined;
  render();
}
async function run(fn: () => Promise<void>) {
  if (busy) return;
  busy = true;root.setAttribute('aria-busy','true');
  try { await fn(); } catch (error) { tell(error instanceof Error ? error.message : 'Operasjonen mislyktes. Prøv igjen og ta backup.',true); }
  finally { busy = false;root.setAttribute('aria-busy','false'); }
}
function editCharacter(source?: Character,resume?:WizardDraft) {
  const recovered=resume?.payload as {source:Character;creating:boolean;classes:Character['classes']}|undefined;
  if(recovered&&!recovered.creating)source=recovered.source;
  const draft = recovered?.source??(source ? structuredClone(source) : { ...createCharacter(), name: '' });
  const creating = !source;
  const d = dialog(source ? 'Rediger karakter' : 'Ny karakter', characterForm({...draft,classes:recovered?.classes??draft.classes}, creating), async form => {
    const updated = withStandardResources(readCharacterForm(form, draft, creating));
    if (!updated.species.name || updated.species.walkingSpeed === null) throw new Error('Velg art eller angi navn og grunnfart for egen art.');
    if (!updated.classes.length || updated.classes.some(cl => !cl.name)) throw new Error('Velg minst én klasse.');
    if (new Set(updated.classes.map(cl => cl.name.toLowerCase())).size !== updated.classes.length) throw new Error('Registrer hver klasse én gang, med samlet klassenivå.');
    if (updated.hp.max < 1) throw new Error('Registrer maksimal HP fra karakterarket.');
    const valid = characterSchema.safeParse(updated);
    if (!valid.success) throw new Error('Kontroller navn, klassenivå (totalt 1–20), ability scores og maks HP.');
    const saved = await saveCharacter(valid.data, source ? 'edit' : 'create', source ? 'Karaktergrunnlag redigert' : 'Karakter opprettet',undefined,await flushWizard(d));
    selected = saved.id;
    message = '';
    await refresh();
  });
  bindCharacterForm(d.querySelector('form')!, draft, creating);
  bindWizard(d,[...d.querySelectorAll<HTMLElement>('#dialog-body > fieldset')].map(element=>({element})),'Lagre',{store:draftRepo,entry:resume??newWizardDraft({kind:'character',label:draft.name||'Ny karakter',characterId:creating?undefined:draft.id,editingId:creating?undefined:draft.id,payload:{source:draft,creating,classes:draft.classes}}),changed:refresh,payload:form=>({source:draft,creating,classes:readCharacterForm(form,draft,creating).classes.map(cl=>({...cl,level:Number.isFinite(cl.level)&&cl.level>=1&&cl.level<=20?cl.level:1}))})});
}
function inspectEquipment(id: string) { equipmentLookup(editorContext,id); }
function addEquipment(c: Character, group = '') {
  const d = viewDialog('Legg til utstyr', equipmentPicker(group), '[name="equipmentSearch"]','large');
  bindEquipmentPicker(d, async catalogId => {
    const item = instantiateEquipment(catalogId,false);
    await saveCharacter({...c, items:[...c.items, item]}, 'equipment', `${item.name} lagt til`);
    message = ''; await refresh();
  }, catalogId => equipmentWizard(editorContext,catalogId?instantiateEquipment(catalogId,false):{...newEquipment(),equipped:false,category:(group==='weapon'?'weapon':group==='armor'?'armor':'equipment')}));
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
      await saveCharacter(draft, 'level-up', `Level Up: ${c.level} → ${draft.level}, maks HP ${c.hp.max} → ${draft.hp.max}`);
      message = ''; await refresh();
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
function editHitPoints(c: Character, damageOnly=false) {
  changeHp({...c.hp,max:effectiveMaxHp(c)},async (hp,delta)=>{
    await saveCharacter({...c,hp:{...hp,max:c.hp.max}},'hp',`HP endret (${delta>0?'+':''}${delta})`);
    message='';await refresh();
  },{damageOnly});
}

function editOverrides(c: Character) {
  const stats = deriveStats({ ...c, acOverride: null, speedOverride: null });
  dialog('Beregninger og overstyringer', `<p>Grunnlaget gir AC ${stats.ac} og speed ${stats.speed ?? 'ukjent'} ft. La feltene stå tomme for å bruke beregningene.</p>
    <p>${esc(stats.acExplanation)}</p><p>${esc(stats.speedExplanation)}</p>${stats.warnings.map(w => `<p class="warning">${esc(w)}</p>`).join('')}
    ${field('Manuell AC (valgfritt)', 'ac', c.acOverride ?? '', 'type="number" min="0"')}
    ${field('Manuell speed (ft, valgfritt)', 'speed', c.speedOverride ?? '', 'type="number" min="0"')}
    ${field('Manuell proficiency bonus (valgfritt)', 'proficiencyBonus', c.proficiencyBonusOverride ?? '', 'type="number" step="1" data-allow-negative')}
    ${field('Manuell Initiative (valgfritt)', 'initiative', c.derivedOverrides.initiative ?? '', 'type="number" step="1" data-allow-negative')}
    ${field('Manuell Passive Perception (valgfritt)', 'passivePerception', c.derivedOverrides.passivePerception ?? '', 'type="number" step="1" data-allow-negative')}
    ${select('Unarmored Defense', 'unarmoredDefense', c.unarmoredDefense, [{ value: 'auto', label: 'Fra registrert klasse' }, { value: 'none', label: 'Vanlig AC / rustning' }, { value: 'barbarian', label: 'Fra Barbarian' }, { value: 'monk', label: 'Fra Monk' }])}
    <p>Multiclass: Du kan ikke få Unarmored Defense en gang til fra en annen klasse. Velg den karakteren faktisk har. Rustning og skjold må fortsatt oppfylle egenskapens vilkår.</p>`, async form => {
    const data = new FormData(form), ac = String(data.get('ac')), speed = String(data.get('speed'));
    const draft = characterSchema.parse({ ...c, acOverride: ac === '' ? null : Number(ac), speedOverride: speed === '' ? null : Number(speed), unarmoredDefense: data.get('unarmoredDefense'),proficiencyBonusOverride:String(data.get('proficiencyBonus'))===''?undefined:Number(data.get('proficiencyBonus')) });
    for (const name of ['initiative','passivePerception']) { const value=String(data.get(name)); if (value==='') delete draft.derivedOverrides[name]; else draft.derivedOverrides[name]=Number(value); }
    await saveCharacter(draft, 'override', 'Beregningsvalg endret'); message = ''; await refresh();
  });
}
function editNote(id?: string) {
  const draft = structuredClone(current()!);
  const note = draft.notes.find(n => n.id === id) ?? { id: crypto.randomUUID(), title: '', body: '' };
  const d = dialog(id ? 'Rediger notat' : 'Nytt notat', `${field('Tittel', 'title', note.title, 'required maxlength="100"',{multiline:false,maxLength:100})}${textArea('Tekst','body',note.body,8,{multiline:true,maxLength:10000})}${id ? '<button type="button" id="delete-note">Slett notat</button>' : ''}`, async form => {
    const data = new FormData(form);
    note.title = String(data.get('title')).trim(); note.body = String(data.get('body'));
    if (!id) draft.notes.push(note);
    await saveCharacter(draft, 'note', id ? 'Notat redigert' : 'Notat lagt til');
    message = ''; await refresh();
  });
  const remove = d.querySelector<HTMLButtonElement>('#delete-note');
  if (remove) remove.onclick = () => {
    confirmDialog('Slett notat?', `<p>Vil du slette «${esc(note.title)}»?</p>`, async () => {
      draft.notes = draft.notes.filter(n => n.id !== id);
      if (draft.backgroundNoteId === id) delete draft.backgroundNoteId;
      await saveCharacter(draft, 'note', 'Notat slettet'); await refresh();
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
        await saveCharacter({...c!,portraitAssetId:asset.id},'portrait','Portrett endret',asset);
        message = ''; await refresh();
      };
      if (!portrait) { await upload(); break; }
      const d = viewDialog('Portrett', `<img class="portrait-large" src="${portrait.dataUrl}" alt="Portrett av ${esc(c!.name)}"><div class="actions"><button type="button" id="change-portrait">Bytt portrett</button><button type="button" id="remove-portrait">Fjern portrett</button></div>`);
      d.querySelector<HTMLButtonElement>('#change-portrait')!.onclick = () => void commitDialog(upload);
      d.querySelector<HTMLButtonElement>('#remove-portrait')!.onclick = () => confirmDialog('Fjern portrett?', '<p>Bildet fjernes fra denne karakteren.</p>', async () => {
        const draft=structuredClone(c!); delete draft.portraitAssetId;
        await saveCharacter(draft,'portrait','Portrett fjernet'); await refresh();
      }, 'Fjern');
      break;
    }
    case 'prepare': preparationDialog(editorContext);break;
    case 'about': viewDialog('Om appen',`<p><strong>D&amp;D Character Companion</strong></p><p>D&amp;D 5e · 2014</p><p>${isTestApp?esc(testVersion):`Versjon ${__APP_VERSION__}`}</p><p>Et digitalt karakterark ved det fysiske spillebordet. Lagres på denne enheten og kan brukes uten nett.</p><a href="./SRD-LICENSE.txt">SRD 5.1 · lisens</a><p><a href="./FONT-LICENSES.txt">Fonter og ikoner</a></p>`);break;
    case 'check-update': await updates.check(); break;
    case 'create': editCharacter(); break;
    case 'edit': editCharacter(c); break;
    case 'edit-equipment': addEquipment(c!); break;
    case 'level-up': levelUp(c!); break;
    case 'hp': editHitPoints(c!); break;
    case 'hp-change': editHitPoints(c!,true); break;
    case 'overrides': editOverrides(c!); break;
    case 'temp-hp': numberChangeDialog({name:'Temporary HP',icon:'healing',original:c!.hp.temp,min:0,
      preview:()=> 'Temporary HP stables ikke. Før inn forskjellen til totalen du skal beholde.',
      onConfirm:async result=>{if(result!==c!.hp.temp){await saveCharacter(characterSchema.parse({...c!,hp:{...c!.hp,temp:result}}),'temp-hp','Temporary HP endret');message='';await refresh();}}});break;
    case 'money': changeMoney(c!.goldCp,async cp=>{
      await saveCharacter(characterSchema.parse({...c!,goldCp:cp}),'money','Penger endret');message='';await refresh();
    });break;
    case 'note': editNote(); break;
    case 'copy': {
      const copy = copyCharacter(c!);
      await saveCharacter(copy, 'copy', 'Karakter kopiert'); selected = copy.id;
      message = ''; await refresh(); break;
    }
    case 'delete': confirmDialog('Slett karakter?', `<p>Vil du slette «${esc(c!.name)}» fra denne enheten? Eksporter backup først hvis du vil beholde karakteren.</p>`, async () => {
      await repo.remove(c!); message = ''; await refresh();
    }, 'Slett karakter'); break;
    case 'undo': {const stored=(await repo.list()).find(row=>row.id===c!.id);if(!stored||stored.revision!==c!.revision)throw new Error('Karakteren er endret i en annen fane. Last siden på nytt.');await repo.undo(stored); message = ''; await refresh(); break;}
    case 'history': {
      const events = await repo.history(c!.id);
      viewDialog('Endringslogg', historyView(events),undefined,'large'); break;
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
      selected = imported[0].id; message = ''; await refresh();
    }, 'Importer'); break;
  }
}
async function start() {
  root.innerHTML = '<p role="status">Åpner lokalt karakterark …</p>';
  try {
    repo = new CharacterRepository(await openDatabase());
    draftRepo=new WizardDraftRepository(repo.db);
    selected = await repo.setting<string>('selectedCharacter');
    await refresh();
    const last = await repo.setting<number>('lastExport');
    if (characters.length && (!last || Date.now() - last > 7 * 86400000)) tell('Husk å eksportere JSON-backup av karakterene dine.');
    try {
      if (!isTestApp && localStorage.getItem('dnd-5e-pwa-data')) tell('Prototype-data finnes fortsatt i nettleseren. De er bevart, men importeres ikke automatisk. Åpne den gamle versjonen og eksporter før du flytter data manuelt.');
    } catch { /* IndexedDB can still work when localStorage access is restricted. */ }
  } catch (error) {
    root.innerHTML = `<main><h1>Kunne ikke åpne lokal lagring</h1><p role="alert">${esc(error instanceof Error ? error.message : error)}</p><p>Ikke slett nettleserdata. Tillat lokal lagring og prøv igjen.</p><button onclick="location.reload()">Prøv igjen</button></main>`;
  }
}
void start();
