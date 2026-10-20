// Isolated visual studies. No app imports, storage, service worker, or gameplay actions.
const shapes={
  book:'<path d="M3 4h7l2 2 2-2h7v15h-7l-2 2-2-2H3zM12 6v15M6 8h3m6 0h3M6 11h3m6 0h3"/>',
  leaf:'<path d="M4 20C2 8 9 3 21 3c0 12-5 18-17 17ZM4 20 16 8M9 15v-5m0 5h5"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  moon:'<path d="M19 15A8 8 0 0 1 9 4 9 9 0 1 0 19 15Z"/>',
  spark:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>',
  swords:'<path d="m5 3 5 3 8 11-2 2L5 8zM3 17l4 4m-2-2 3-3M19 3l-4 3-2 3m-3 5-4 5M17 16l4 4m-2-2 2-2"/>',
  shield:'<path d="M12 2 3 5v7c0 4 9 10 9 10s9-6 9-10V5zM8 11l3 3 5-6"/>',
  bag:'<path d="M7 7V5a5 5 0 0 1 10 0v2M4 7h16v14H4zM4 11h16M9 10v4h6v-4"/>',
  feather:'<path d="M4 21 19 4M7 18C0 8 17-2 21 3c5 6-5 18-14 15ZM10 14h7M14 10V5"/>',
  bolt:'<path d="m14 2-9 12h6l-1 8 9-13h-6z"/>',
  hand:'<path d="M5 12V8a1.5 1.5 0 0 1 3 0v4-7a1.5 1.5 0 0 1 3 0v7-8a1.5 1.5 0 0 1 3 0v8-6a1.5 1.5 0 0 1 3 0v8l2-3c2-2 4 0 2 3l-4 7H9l-6-7c-1-2 0-4 2-2z"/>',
  cold:'<path d="M12 2v20M3 7l18 10M3 17 21 7M9 4l3 3 3-3M9 20l3-3 3 3M3 10l4-1-1-4M18 19l-1-4 4-1M3 14l4 1-1 4M18 5l-1 4 4 1"/>',
  sound:'<path d="M3 10h4l5-5v14l-5-5H3zM16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14"/>',
  sword:'<path d="m16 2 5 1-1 5L9 19l-4-4zM3 13l8 8M7 17l-4 4M13 10l4-4"/>',
  dagger:'<path d="m14 3 5-1-1 5-7 8-3-3zM5 11l8 8M9 15l-5 6-2-2 5-6"/>',
  bow:'<path d="M6 3c15 1 15 17 0 18l4-9zM3 12h18m-4-4 4 4-4 4"/>',
  star:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  armor:'<path d="m8 3 4 3 4-3 5 5-4 4v9H7v-9L3 8zM8 3v5l4 3 4-3V3M8 16h8"/>',
  speech:'<path d="M3 3h18v14H9l-6 4zM7 7h10M7 11h7"/>',
  check:'<path d="m5 12 5 5L20 6"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
  menu:'<path d="M5 6h14M5 12h14M5 18h14"/>',
  warning:'<path d="m12 2 10 19H2zM12 8v5M12 17v.2"/>',
};
const icon=name=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${shapes[name]||shapes.spark}</svg>`;
const title=(text,symbol='spark')=>`<h3 class="sample-title">${icon(symbol)}<span>${text}</span></h3>`;
const pill=(name,{detail='',symbol='',state='',flag=''}={})=>`<button type="button" class="pill tap ${state}">${symbol?icon(symbol):''}<span class="name">${name}</span>${detail?`<small>${detail}</small>`:''}${flag?`<span class="flag">${icon('check')}${flag}</span>`:''}</button>`;
const add=()=>`<button type="button" class="pill tap add" aria-label="Legg til">${icon('plus')}</button>`;
const pills=(items,{icons=false,plus=true}={})=>`<div class="pills ${icons?'icon-pills':''}">${items.map(([name,props={}])=>pill(name,{...props,symbol:icons?props.symbol:''})).join('')}${plus?add():''}</div>`;
const species=[['Darkvision',{symbol:'eye'}],['Fey Ancestry',{symbol:'leaf'}],['Trance',{symbol:'moon'}]];
const features=[['Sneak Attack',{detail:'3d6',symbol:'dagger'}],['Cunning Action',{symbol:'bolt'}],['Uncanny Dodge',{symbol:'shield'}],['Fast Hands',{symbol:'hand'}]];
const feats=[['Alert',{symbol:'eye'}],['Lucky',{symbol:'star'}],['Crossbow Expert',{symbol:'bow'}]];
const cantrips=[['Mage Hand',{symbol:'hand'}],['Ray of Frost',{symbol:'cold'}],['Minor Illusion',{symbol:'sound'}]];
const spells=[['Magic Missile',{detail:'1st level',symbol:'bolt'}],['Shield',{detail:'1st level',symbol:'shield'}],['Misty Step',{detail:'2nd level',symbol:'moon'}],['Detect Magic',{detail:'Ritual',symbol:'eye'}]];
const weapons=[['Shortsword',{flag:'I bruk',state:'selected',symbol:'sword'}],['Dagger',{flag:'I bruk',state:'selected',symbol:'dagger'}],['Shortbow',{detail:'I sekken',symbol:'bow'}]];
const modifiers=(framed=false)=>`<div class="modifiers ${framed?'framed':''}">${[['Perception','+5'],['Stealth','+10'],['Dexterity save','+7'],['Persuasion','+3']].map(([label,value])=>`<button type="button" class="modifier"><span>${label}</span><strong>${value}</strong></button>`).join('')}</div>`;
let unique=0;
function abilities(){return `<div class="abilities">${[['STR',10,'+0'],['DEX',18,'+4'],['CON',14,'+2'],['INT',12,'+1'],['WIS',14,'+2'],['CHA',10,'+0']].map(([label,score,mod])=>{
const id=`coin-arc-${++unique}`;
return `<div class="coin" role="img" aria-label="${label} ${score}, modifier ${mod}"><svg viewBox="0 0 80 80" aria-hidden="true"><defs><path id="${id}" d="M17 43 A23 23 0 0 1 63 43"/></defs><circle class="coin-face" cx="40" cy="40" r="38"/><circle class="coin-ring" cx="40" cy="40" r="34.5"/><path class="tick" d="M5 40h4m62 0h4"/><text class="coin-label" text-anchor="middle"><textPath href="#${id}" startOffset="50%" textLength="27" lengthAdjust="spacing">${label}</textPath></text><text class="coin-score" x="40" y="48" text-anchor="middle">${score}</text><text class="coin-mod" x="40" y="65" text-anchor="middle">${mod}</text></svg></div>`;
}).join('')}</div>`;}
const placeholder=()=>`<svg class="placeholder" viewBox="0 0 52 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"><path d="M8 49c2-8 9-9 12-13m12 0c3 4 10 5 12 13M17 24c0-14 18-14 18 0v5c0 7-4 11-9 11s-9-4-9-11zM14 29c-2-16 7-20 12-20s14 4 12 20M17 24c6 0 8-5 9-7 1 4 5 6 9 7M11 53h30M6 34c-2 9 1 15 7 19M46 34c2 9-1 15-7 19M6 39l4 1m-3 5 4 1M46 39l-4 1m3 5-4 1"/><path d="m26 3 1 2-1 2-1-2z" fill="currentColor"/></svg>`;
const portrait=(empty=false)=>`<div class="portrait">${empty?placeholder():'<img src="../assets/alva.png" alt="Illustrert portrett av Alva">'}</div>`;
const identity=(empty=false)=>`<div class="identity">${portrait(empty)}<div><h3>Alva Nattvind</h3><p>Elf · Rogue 5 <span>· Thief</span></p></div></div>`;
const stats=()=>`<div class="stats">${[['HP','28<em>/38</em>'],['AC','16'],['Initiative','+4'],['GP','42.50'],['Speed','30<em>ft</em>']].map(([label,value])=>`<${label==='GP'?'button type="button"':'div'} class="stat ${label==='GP'?'tap':''} ${label==='HP'?'hp':''}"><small>${label}</small><strong>${value}</strong>${label==='GP'?`<span class="openmark">${icon('arrow')}</span>`:''}</${label==='GP'?'button':'div'}>`).join('')}</div>`;
const resources=(zero=false)=>`<button type="button" class="resource-open"><span class="resource-bar"><span>Spell slots · 1st level <strong>${zero?'0':'3'} / 4</strong></span><span class="pips" aria-hidden="true">${[0,1,2,3].map(i=>`<i class="${!zero&&i<3?'full':''}"></i>`).join('')}</span></span></button>`;
const nav=()=>`<nav class="nav" aria-label="Hovednavigasjon">${[['Character','book'],['Combat','swords'],['Utstyr','bag'],['Meny','menu']].map(([label,symbol])=>`<button type="button" ${label==='Character'?'aria-current="page"':''} class="${label==='Meny'?'menu':''}">${icon(symbol)}<span>${label}</span></button>`).join('')}</nav>`;
const heading=(n,name,description)=>`<header class="sheet-head"><div class="eyebrow">D&D CHARACTER COMPANION <span>EVENTYRJOURNAL / KOMPONENTSTUDIE ${n} / 20.10.2026</span></div><h1>${name}</h1><p>${description}</p></header>`;
const footer=note=>`<footer class="sheet-foot"><span>EVENTYRJOURNAL · ELFENBEN / VINRØDT BLEKK</span><span>${note} Visuell studie, ikke nye appfunksjoner.</span></footer>`;
const family=(id,label,content,note)=>`<section class="family-row" data-family="${id}"><header class="family-label"><small>${id}</small><h2>${label}</h2></header><div class="sample">${content}</div><p class="family-note">${note}</p></section>`;
const families=()=>`<article class="sheet" data-board="families">${heading('01','Et felles språk for arket','Alle elementfamiliene samlet. Samme pilleform der oppgaven er lik; særpreg der verdiene trenger et annet hierarki.')}
${family('identity','Karakter',identity(),'<b>Samme portrettramme.</b> Navn først, art og klasse under. Administrasjon ligger i menyen.')}
${family('status','Fem statusverdier',stats(),'<b>Status og én handling.</b> GP åpner pengeføringen og får lys flate, fin kant og pil. HP er kun status, uten forløpsindikator eller temporary HP.')}
${family('modifiers','Favorittmodifiers',modifiers(),'<b>Luftig variant til vurdering.</b> Fullstendige navn, samme størrelse og diskret bunnlinje. Begge rammevariantene vises på plansje 02.')}
${family('abilities','Ability scores',abilities(),'<b>Runde statusmynter.</b> Grunnverdi i sentrum, modifier under. Forkortelsene følger nøyaktig samme bue.')}
${family('species','Artsegenskaper',title('Artsegenskaper','leaf')+pills(species),'<b>Tekstvariant.</b> Overskriften har ikon. Individuelle ikoner sammenlignes separat, ikke valgt som standard.')}
${family('features','Klasseegenskaper',title('Class Features','swords')+pills(features),'<b>Alva · Rogue 5 / Thief.</b> En kort ekstralinje bare når den har verdi, som Sneak Attack 3d6.')}
${family('feats','Feats',title('Feats','star')+pills(feats),'<b>Alternative katalogeksempler.</b> Ikke tre registrerte feats på Alva. Samme form som andre egenskaper.')}
${family('cantrips','Cantrips',title('Cantrips','spark')+pills(cantrips),'<b>Egen eksempelkarakter:</b> Mira, Human Wizard 3. Cantrips har ingen spell-slot-teller.')}
${family('spells','Spells',title('Spells','book')+pills(spells),'<b>Mira · Wizard 3.</b> Kort nivå-/ritualinformasjon. Forberedelse og ressursbruk får egne tydelige tilstander.')}
${family('weapons','Våpen',title('Våpen','swords')+pills(weapons),'<b>Alvas utstyr.</b> I bruk markeres med tekst og hake. Angrep og skade får plass i Combat/oppslaget, ikke inne i hver lille utstyrspille.')}
${family('armor','Armor og skjold',title('Armor og skjold','shield')+pills([['Studded Leather',{flag:'I bruk',state:'selected',detail:'AC 16'}]]),'<b>Samlet rustning.</b> AC 12 + DEX 4. Ingen kroppsdeler eller oppdeling i plagg.')}
${family('equipment','Annet utstyr',title('Annet utstyr','bag')+pills([['Thieves’ tools'],['Rope',{detail:'50 ft'}],['Reisekappe']]),'<b>Samme pillefamilie.</b> En vanlig kappe får ingen automatisk bonus. Navnet får størst plass.')}
${family('languages','Språk og proficiencies',pills([['Common'],['Elvish'],['Thieves’ tools',{detail:'Proficiency'}]]),'<b>Ingen ny form nødvendig.</b> Samme oppslagsmønster for korte registrerte opplysninger.')}
${family('notes','Notater',pills([['Bakgrunn'],['Kontakter'],['Avtaler med DM']]),'<b>Navngitte oppslag.</b> Lang tekst blir i oppslaget, ikke på arbeidsflaten.')}
${family('resources','Ressurser',resources(),'<b>Miras slots som eget eksempel.</b> Tall er hovedinformasjonen; punktene støtter rask avlesning. Trykk åpner ressursføringen.')}
${footer('Eksempelverdier er skilt mellom Rogue, Wizard og alternative katalogvalg.')}</article>`;
const compareBlock=(name,symbol,items,withIcons)=>`<section class="alt-block" data-compare="${name}">${title(name,symbol)}${pills(items,{icons:withIcons})}</section>`;
const alternatives=()=>`<article class="sheet" data-board="alternatives">${heading('02','Hvor mye skal formen fortelle?','To valg vurderes hver for seg: ramme rundt modifiers, og individuelle ikoner på pillene. Innholdet er likt på begge sider.')}
<h2 class="subhead">A · Modifiers — luft eller svak innramming</h2>
<div class="mod-comparison"><section class="mod-option"><h3>A1 · Åpent på arket</h3><div class="sample">${modifiers()}</div><p>Færre bokser. Bunnlinjen binder navn og tall sammen og markerer at feltet kan åpnes.</p></section><section class="mod-option"><h3>A2 · Svak innramming</h3><div class="sample">${modifiers(true)}</div><p>Samme størrelse og typografi. En lys flate og fin kant gjør trykkflaten lettere å oppdage.</p></section></div>
<h2 class="subhead">B · Piller — samme innhold, med og uten individuelle ikoner</h2>
<div class="alternatives">${[false,true].map(withIcons=>`<section class="alt-column" data-icons="${withIcons}"><header class="alt-head"><h2>${withIcons?'B2 · Med individuelle ikoner':'B1 · Teksten får plassen'}</h2><p>${withIcons?'Små symboler over navnene. Krever komplett, konsekvent dekning og mer høyde.':'Ikoner ved overskriftene, navn på pillene. Tettere rader og færre visuelle signaler.'}</p></header><div class="sample">
${compareBlock('Artsegenskaper','leaf',species,withIcons)}
${compareBlock('Class Features','swords',features,withIcons)}
${compareBlock('Feats · alternative valg','star',feats,withIcons)}
${compareBlock('Våpen','swords',weapons,withIcons)}
${compareBlock('Cantrips · Wizard 3','spark',cantrips,withIcons)}
${compareBlock('Spells · Wizard 3','book',spells,withIcons)}
${compareBlock('Lange navn · katalogeksempler','book',[['Protection from Evil and Good',{symbol:'shield'}],['Comprehend Languages',{symbol:'speech'}],['Unarmored Movement',{symbol:'bolt'}]],withIcons)}
</div></section>`).join('')}</div>
<div class="callout"><strong>Ikonene er en prøvesamling for disse eksemplene.</strong> De er ikke et ferdig bibliotek. Valg av individuelle ikoner krever dekning av støttede poster og en løsning for egne/ukjente elementer. Lange navn og + har samme størrelse som de andre pillene i samlingen.</div>
${footer('A1/A2 og B1/B2 er forslag til vurdering, ikke vedtatte detaljvalg.')}</article>`;
const states=()=>`<article class="sheet" data-board="states">${heading('03','Tydelig uten å rope','Trykkflater, portrett uten bilde, navigasjon og tilstander. Farge støttes av form, tekst og symboler.')}
<div class="state-grid">
<section class="state-card"><h2>01 · Informasjon og handling</h2><div class="sample"><div class="click-comparison"><div class="click-example"><small>BARE INFORMASJON</small><div class="stat hp"><small>HP</small><strong>28<em>/38</em></strong></div></div><div class="click-example"><small>ÅPNER PENGEFØRING</small><button type="button" class="stat tap"><small>GP</small><strong>42.50</strong><span class="openmark">${icon('arrow')}</span></button></div></div></div><p>Samme størrelse, ulike oppgaver. HP er ren status; GP kan endres og får fin kant, lys flate og en liten pil. Skillet virker uten hover.</p></section>
<section class="state-card"><h2>02 · Trykk, fokus og valgt</h2><div class="sample"><div class="state-pills">${pill('Darkvision')+pill('Darkvision',{state:'press'})+pill('Darkvision',{state:'focus'})+pill('Shortsword',{state:'selected',flag:'I bruk'})}</div><div class="state-legend"><span>Vanlig oppslag</span><span>Mens du trykker</span><span>Tastaturfokus</span><span>Valgt / i bruk</span></div></div><p>Oppslag trenger ingen permanent pil på hver pille. Alle deler samme trykkflate. «I bruk» har i tillegg tekst og hake.</p></section>
<section class="state-card"><h2>03 · Portrett og placeholder</h2><div class="sample"><div class="portrait-pair"><div>${portrait()}<span>Med<br>bilde</span></div><div>${portrait(true)}<span>Uten<br>bilde</span></div></div><div class="mini-identity">${identity(true)}</div></div><p>En enkel illustrert byste i samme ramme. Ingen bokstavavatar, tom grå flate eller krav om bilde.</p></section>
<section class="state-card"><h2>04 · Alltid tilgjengelig meny</h2><div class="sample">${nav()}<div class="combat-tabs" role="tablist" aria-label="Combat-kategori"><button type="button" role="tab" aria-selected="true">Action</button><button type="button" role="tab" aria-selected="false">Bonus</button><button type="button" role="tab" aria-selected="false">Reaction</button></div><div class="swipe">← Sveip mellom Combat-kategoriene →</div></div><p>Tre hovedfaner og egen Meny nederst. Aktiv kategori har både blekkfarge og markør. Sveipehint kan begrenses til første bruk.</p></section>
<section class="state-card"><h2>05 · Forberedt og oppbrukt</h2><div class="sample">${title('Spells · Mira, Wizard 3','book')}${pills([['Shield',{flag:'Forberedt',state:'selected'}],['Misty Step',{flag:'Forberedt',state:'selected'}],['Detect Magic',{detail:'Ikke forberedt · ritual',state:'secondary'}]],{plus:true})}<div style="margin-top:14px">${resources(true)}</div></div><p>Et tomt ressurslager skjuler ikke oppslaget. Detect Magic kan fortsatt ritualkastes fra spellbook etter Wizard-reglene, selv uten forberedelse.</p></section>
<section class="state-card"><h2>06 · Tom samling og vilkår</h2><div class="sample">${title('Feats','star')}${pills([])}<p class="empty-caption">Ingen feats lagt til</p><div style="margin-top:14px">${pills([['Cloak of Protection',{detail:'I bruk · ikke attuned'}]],{plus:false})}</div><div class="state-labels"><span class="warning">${icon('warning')}Krever attunement</span><span class="success">${icon('check')}Lagret</span><span class="muted">Angre</span></div></div><p>Vilkår beskrives med tekst, ikke bare farge. Kappen gir ikke bonus før nødvendig attunement er registrert. Tomtilstand skal fortsatt gjøre tillegging enkel.</p></section>
<section class="state-card"><h2>07 · Felt og tydelige valg</h2><div class="sample"><div class="form-grid"><label class="field">Navn<input placeholder="Karakterens navn" readonly></label><label class="field">Håndbruk<select><option>Én hånd</option><option>To hender</option></select></label><label class="field">Navn på gjenstand<input class="focus" value="Reisekappe" readonly></label><label class="field error">Antall<input value="−1" readonly><small>Angi 0 eller mer</small></label></div><div class="toggle-row"><span class="check">${icon('check')}I bruk</span><span class="toggle"><i></i>Attuned</span></div></div><p>Etiketter beholdes. Fokus og feil har egne markeringer. Navnet er tomt med et grått hint; skissen forhåndsutfyller det ikke.</p></section>
<section class="state-card"><h2>08 · HP-endring i Combat</h2><div class="sample hp-adjust"><div class="hp-value">−8 <small>HP</small></div><div class="slider-labels"><span>Skade</span><span>Healing</span></div><div class="slider"><span class="track"></span><span class="zero"></span><span class="fill"></span><span class="knob"></span></div><div class="stepper"><button type="button" aria-label="Reduser med én">−</button><output>−8</output><button type="button" aria-label="Øk med én">+</button></div><div class="hp-preview"><span>Temp HP <strong>5 → 0</strong></span><span>HP <strong>28 → 25</strong></span></div></div><p>Tydelig nullpunkt, eksakt verdi og ±1. Dette er kontrollen for endring, ikke en forløpsindikator på Character-kortet.</p></section>
</div>
<div class="dialog-pair"><section class="mini-dialog"><div class="mini-dialog-head"><h3>Shortsword</h3><button type="button" class="close" aria-label="Lukk oppslag">${icon('close')}</button></div><div class="attack-values"><div><small>ANGREP</small><strong>d20 +7</strong></div><div><small>SKADE</small><strong>1d6+4</strong><span>piercing</span></div></div><p>DEX +4 · proficiency +3 · Finesse · Light</p><div class="dialog-caption">Kort oppslag: én X. Ingen ekstra Avbryt eller Lagre.</div></section><section class="mini-dialog"><h3>Fjern Shortsword?</h3><p>Gjenstanden fjernes fra Alvas utstyr.</p><div class="confirmation"><button type="button" class="secondary-button">Avbryt</button><button type="button" class="primary">Fjern</button></div><div class="dialog-caption">Bekreftelse: to ulike handlinger, ingen ekstra X.</div></section></div>
<div class="callout"><strong>Meny og store dialoger følger samme familie.</strong> Administrasjon blir i menyen. Store redigeringsflater beholder tilgjengelig lukk/avbryt og én bekreftelse; innholdet scroller mellom dem. Dialogdetaljene er fortsatt designforslag.</div>
${footer('Viste tilstander er illustrasjoner. Ingen handling lagrer eller endrer karakteren.')}</article>`;
const query=new URLSearchParams(location.search);
const boards={families,alternatives,states};
document.querySelector('#study').innerHTML=(boards[query.get('board')]||families)();
if(query.has('solo')){
 const target=query.get("solo")==="icons"?document.querySelector('.alt-column[data-icons="true"]>.sample'):document.querySelector(`[data-family="${query.get('solo')}"]`);
 if(target){document.body.classList.add('solo');document.querySelector('.sheet').replaceChildren(target);}
}
