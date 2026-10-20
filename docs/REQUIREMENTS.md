# Kravspesifikasjon – D&D Character Companion
**Status:** Gjeldende produktgrunnlag, oppdatert 2026-10-20. Gjeldende beslutninger: [DECISIONS.md](DECISIONS.md).
**Spill:** D&D 5e (2014). Mobilførst, offline-først, fysisk terningkast og DM som autoritet.

## 1. Produkt og akseptansekriterier
**Overordnet mål: erstatte papirkarakterarket ved det fysiske spillebordet.** Appen skal gjøre det enkelt å lese, slå opp, notere og endre karakterinformasjon under spill, med spillerens manuelle kontroll og DM som autoritet. Nye funksjoner og brukerflyter vurderes først etter hvordan de støtter dette målet.

Dette er et **digitalt, manuelt redigerbart karakterark**, ikke en regelmotor, turstyrer, VTT eller karakterbygger. Eksisterende karakterer registreres uten å rekonstruere tidligere levels. Brukeren skal kunne overstyre beregninger og lagre egne egenskaper fra DM. Ingen backend, konto, digitale terninger, stemmestyrt mutasjon eller krav om å gjennomføre karakterens tidligere level-ups.

**Papirarkpraksis som referanse:** Undersøk hvordan vanlige og klassespesifikke karakterark faktisk brukes, inkludert merknadsfelt og klasseavhengige oppslag/ressurser. Kildenes regelversjon og undersøkte sider skal angis. Bruk læringen sammen med vedtatte mobile brukerflyter; papirarkets linjer og felt skal ikke skape nye spillbegrensninger. Se [konkret referansegjennomgang](PAPER_SHEET_REVIEW.md).

**Lett registrering:** Det skal være enkelt å legge til og føre informasjon under spill. Vurder både antall synlige felt og hva spilleren faktisk må fylle ut. Bruk kjent katalog-/karakterinformasjon der den gir et sikkert grunnlag. Flerverdiregistrering følger veiviserprinsippet under; detaljer og manuelle overstyringer skal være tilgjengelige ved behov.

### Overordnet prinsipp: veiviser ved flerverdiregistrering

Når spilleren skal legge inn flere verdier, brukes en kort, forgrenet veiviser fremfor et omfattende skjema. Dette gjelder på tvers av appen, ikke bare våpen. Rene valg fra en liste beholder direkte registrering uten ekstra spørsmål eller bekreftelser.

- Still forståelige spørsmål fra spillerens oppgave. Ja/nei-svar bestemmer hvilke oppfølgingssteg som trengs; sikre katalog-/karakterverdier følger med automatisk.
- Nyeste presisering (§14): ett spørsmål eller én verdi per skjerm. Terningtype, antall, skadetype og betingelse får separate spørsmål. Ja/nei-svar er direkte knapper som går videre.
- Spør bare om relevant informasjon. Tilby avslutning så snart nødvendig informasjon er registrert; merknader og øvrige detaljer er valgfrie.
- Tilbake bevarer svar. Nyeste presisering (§14): Lukk bevarer et lokalt utkast; Forkast utkast er separat. Hele registreringen bekreftes samlet, med trygg feilbehandling og Angre etter gjeldende lagringskrav.
- Veiviseren hjelper med føring på karakterarket; den krever ikke rekonstruksjon av tidligere level-ups eller automatiske regelvalg.

Prinsippet er vedtatt 2026-10-20. Konkrete arbeidsflyter avklares én om gangen før ny appkode bestilles; se [nyeste brukerreview og avklarte flyter](#13-konseptuell-opprydding-og-arbeidsflyter-2026-10-20). Det er ikke implementert gjennom denne dokumentasjonen.

### Overordnet prinsipp: karakterens kontekst

Konteksttilpasning skal støtte målet om et digitalt papirkarakterark og gjøre føring og oppslag enklere. Hele appen skal bruke kjent informasjon om karakteren til å presentere relevante valg, verdier og oppslag i den aktuelle spillerflyten. Dette gjelder på tvers av Character, Combat og Utstyr, blant annet egenskaper/feats, cantrips/spells, utstyr, proficiencies og ressurser. Hver user story skal beskrive hvordan prinsippet gjelder for sin flyt.

- Relevans vurderes etter flytens formål og faktiske regler, med klasse/subclass, nivå i den aktuelle klassen, art, registrerte egenskaper, proficiencies, utstyr og øvrig relevant tilstand som grunnlag.
- Generelle valg skal beholdes. Bare reelle forutsetninger kan begrunne en begrensning; ukjente eller uavklarte forhold merkes og valget beholdes tilgjengelig.
- Tilgang og egenskaper kan komme fra flere kilder. Cantrips/spells kan for eksempel komme fra klasse, subclass, art, feats, utstyr eller en avtale med DM. Et klassefilter alene skal ikke skjule andre gyldige tilganger.
- Skille mellom å eie/registrere, velge/lære og bruke noe er del av relevansvurderingen. Manglende proficiency for et våpen hindrer for eksempel ikke eierskap; eventuelle konsekvenser ved bruk håndteres i den aktuelle flyten.
- Manuelle valg, «Opprett egen» og DM-unntak skal fortsatt være tilgjengelige. Endret kontekst skal bevare tidligere registrerte data.

De konkrete reglene og kontrollscenarioene defineres for hvert område. Prinsippet følger produktets eksisterende grenser for manuell kontroll og avgrensede beregninger.

**Må fungere end-to-end**, ikke bare demonstreres visuelt:
1. Opprette, redigere, bytte, kopiere og slette karakterer, med eksplisitt bekreftelse ved sletting.
2. Registrere en eksisterende karakter direkte; endre level og tilhørende felt manuelt.
3. Administrere HP, temp HP, spell slots, hit dice, inspiration, death saves, ressurser og penger med persistering og hendelseslogg.
4. Registrere og redigere weapons, armor, annet utstyr, class features, feats, spells, cantrips, notater, languages, proficiencies, damage defenses og condition immunities **som virkelige data**.
5. Se korrekte, oppdaterte Combat-oppslag fra karakterens faktiske innhold, med korte kort og detaljvisning.
6. Beregne og bekrefte sammensatt skade, inkludert betingede, individuelt overstyrbare modifikatorer, og forklare resultatet.
7. Eksportere/importere en komplett karakter som versjonert JSON, inkludert portrett, med validering og trygg feilbehandling.
8. Bestå automatiserte tester, inkl. regresjon for feilene fra prototype v0.8–v0.11.

## 2. Character
- Tre hovedfaner **Character**, **Combat** og **Utstyr** med separat bevart scrollposisjon.
- Kompakt identitet med valgfritt portrett; klassenivå, species/race, subclass, background som notat etter ønske.
- Øverst: fem like store statuspiller på én rad: HP, AC, Initiative, GP og Speed. GP vises med to desimaler; lagres som heltall copper pieces. HP er lesbar status på Character. Skade, healing og Temporary HP håndteres i Combat med sentrert endringsslider, ±1, forhåndsvisning og bekreftelse. Healing påvirker ikke temporary HP; temp HP absorberer skade først.
- Fire konfigurerbare modifier-kort med **fullstendige navn** (f.eks. Perception). Trykk viser alfabetisk, kort oversikt over skills, saving throws, abilities, passive perception og initiative som kan velges til kortet. Ikke ekstra fast søkefelt eller dupliserte Skills/Saves-knapper i denne seksjonen.
- Class Features & Feats ligger på Character. Weapons/Armor/Equipment ligger i egen Utstyr-fane; i bruk først. Skill eid fra equipped. Ved trykk på en konkret utstyrspost skal relevante verdier for karakteren og et forståelig beregningsgrunnlag være tilgjengelige: blant annet angrepskast/skade for våpen og AC-regler for rustning. Egne navn, varianter og manuelle korrigeringer skal bevares.
- **Utstyrsoppsettet er et sentralt krav:** Konkrete gjenstander skal kunne kombineres som de faktisk bæres og brukes. Skill type, relevant plassering/håndbruk, eid/utstyrt-status og eventuell attunement. Vis samlet virkning og bidraget fra hver kilde, med forståelige advarsler ved regelkonflikter og rom for DM-overstyring. Vanlige plagg kan bæres sammen med rustning uten å gi en automatisk bonus; særvirkninger følger den konkrete gjenstanden og dens vilkår. Føringen skal være enkel selv om grunnlaget omfatter flere kombinasjoner.
- Hver redigerbare samling bruker **inline, pilleformet +** på samme flex/wrap-rad, etter siste element. Ikke rundt +, ikke på egen rad med mindre naturlig wrap. Klikk på element for detaljer/redigering; + for legg til.
- Velgere for større innholdsbibliotek er søkbare, med kategorifiltre og «Opprett egen». Feat-tillegging skal fungere fullt ut.
- Egenskaps-/featvelgerens standardliste skal bruke karakterens relevante kontekst. Klasseegenskaper vurderes etter klasse, subclass og nivå i den aktuelle klassen; art tas med der den har betydning. Feats vurderes etter sine faktiske forutsetninger. Manuelle valg og DM-unntak beholdes.
- Generelle feats uten klassekrav skal beholdes ved klassefiltrering. Begrensninger må bygge på faktiske forutsetninger; eventuelle andre krav vurderes fortsatt. Uavklarte forutsetninger merkes og valget beholdes tilgjengelig.
- Spells, cantrips og spell slots tilgjengelige også utenfor Combat. Slot-pille åpner **kun sitt nivå** og enkel ±1-redigering; skille known, spellbook, prepared og klassespesifikt Pact Magic.
- Hit Dice brukt én om gangen ved Short Rest med spillerens fysisk kastede healingresultat; tillat manuell korrigering. Rests endrer bare relevante ressurser, med korrekt håndtering av særregler og DM-baserte unntak.
- Death Saves (3 suksesser/3 feilslag), Inspiration, Conditions, Exhaustion og tilpassbare ressurser skal være redigerbare.
- Vilkårlig mange navngitte notater med fritekst. Bakgrunn er **ikke** en separat duplisert datadel. Ingen «Rediger øvrige felt»-popup med redundante felt.
- **Separate strukturerte felt:** languages, armor/weapon/tool proficiencies, skill/save proficiencies/expertise, damage resistance/vulnerability/immunity per damage type, og condition immunity per condition. Strukturerte data må ha fungerende create/edit/delete-UI og persistering.
- All karakteradministrasjon ligger i menyen. «Denne karakteren» har grunnlagsredigering og manuell Level Up med ny maks HP; bytt/opprett/importer/eksporter osv. ligger i egen gruppe. Ingen permanente redigerings- eller byttepaneler på arbeidsflaten.
- Opprettelse: tomt navn med grått hint som skjules ved fokus, species fra liste uten etterfølgende artsdetaljer, klasse/subclass fra lister (egne valg tillatt), nivå, endelige ability scores og manuelt angitt maks HP. Utstyr og egenskaper registreres inne i appen etterpå.
- Innen hver pilleseksjon: lik størrelse, form og ramme, inkludert inline +.

## 3. Combat
- **Action | Bonus | Reaction** er tre kompakte faner som kan sveipes mellom. Ingen duplisert kategorioverskrift etter tab-raden. Under finnes kompakt seksjon **Andre egenskaper** for Action Surge, passive/andre features.
- Tilbud er oppslag, **ikke handlingstracker**: fjern Bruk for ordinære handlinger og «Ferdig med tur»; ingen Action/Bonus/Reaction brukt-indikator. Viser tilgjengelige våpenangrep, Unarmed Strike, Grapple, Shove, relevante general actions, cantrips, spells, feats, class features og utstyrshandlinger. Generelle handlinger sist innen passende kategori.
- Trykk åpner kompakt detalj med fysisk terningkast uttrykt tydelig: attack bonus, dice/formula, damage type, save DC, casting time og regeltekst når relevant. ∞-symbol for cantrips og konsekvent levelmerke for spells.
- Begrensede ressurser spores med enkel avkryssing eller antall, også når evnen vises i Combat; ingen automatisk turstyring.
- «Ta skade» og «Hvile» ligger **under Andre egenskaper**, ingen tomme/uforklarlige knapper. Modifiers/saves kan hentes fra Character; ingen stor duplisering i Combat.
- Våpen/håndbruk: dual wielding, bonus-action offhand, two-handed, versatile, skjold, proficiency og utstyrseffekter må kunne representeres; advar om konflikter, blokker aldri.

## 4. «Ta skade» – høyprioritert akseptansetest
**Ikke treff-/AC-kalkulator.** DM avgjør treff og saving throws og kan allerede ha justert skade for aktive reaksjoner (som Uncanny Dodge). Den samme reaksjonen skal fortsatt kunne slås opp under Reaction.

1. Én skadepost som standard: mengde med slider og ±1, damage type. Inline +-pille legger til flere skadeposter med uavhengige damage types.
2. For hver post, hent matchende passive modifikatorer fra **lagret, strukturert karakterdata** og relevante feats/effects. Reberegn umiddelbart når damage type endres.
3. Vis **hver enkelt modifikator eksplisitt**: navn, effekt, eventuell betingelse og egen avkryssing. Ikke skjul alt bak «Etter modifikatorer». Vis både resistance og vulnerability samtidig når begge gjelder. Immunity nuller den relevante skaden.
4. Kjente gyldige modifikatorer er valgt som standard. Når vilkår (f.eks. om angrepet er magisk) ikke er kjent, vis vilkåret og krev **brukerbekreftelse før medregning**. Spiller kan deaktivere enkeltekter som DM allerede har regnet inn, uten å endre karakterens permanente egenskaper.
5. Støtt strukturert flat reduksjon (f.eks. Heavy Armor Master, 2014: -3 passende ikke-magisk B/P/S mens heavy armor er utstyrt). Bruk regelrett rekkefølge, inklusive 2014 resistance/vulnerability/avrunding. Ikke implementer en automatisert kampsimulator.
6. Beregn damage-type-delene individuelt, summer skade, trekk så fra temporary HP og deretter vanlig HP. HP endres **kun ved eksplisitt Bekreft/Oppdater HP**; én samlet logghendelse registreres.
7. Oppsummering viser innkommende skade per type, **alle anvendte modifikatorer og deres faktiske effekt**, temp HP absorbert, vanlig HP tapt, ny HP og kort forklaring som kan gis DM.
8. Både skadetype- og modifikatorvalg skal være kompakte på mobil. Bruker kan legge til manuell, hendelsesspesifikk justering hvis datamodellen ikke kjenner effekten. Ikke dobbelberegn effekter DM har håndtert.
9. Test eksplisitt: ingen effekt; bare resistance; bare vulnerability; begge samtidig; immunity; betinget Heavy Armor Master (bekreft/avvis); compound fire+slashing; temp HP større/mindre enn skade; 0 HP; overstyrte effekter; undo.

## 5. Ressurser, spells og regler
- Ressurser kan knyttes til class features, feats, spells og items og har count/max, rest-regler og manuell overstyring. Arcane Recovery styres av **spilledag**, ikke kalenderdato.
- Felles spellvisning; klassespesifikke data (Wizard spellbook/prepared, Warlock Pact Magic, andre known/prepared). Slot-beholdning skal følge klasse/nivå med manuell overstyring etter senere avklaring i §13; forbruk føres manuelt med ±1. Cantrips koster normalt ingen spell slots.
- Egne features kan være handlinger, ressurser, betingede passive effekter og eventuelt aktivstatus. Eksterne buffs, debuffs, darkness/dekning og lignende **skal ikke kreve** løpende registrering; bare tilføy ved behov, særlig for skadeberegning.
- Full SRD 5.1 som lokalt regelbibliotek med riktig lisensinformasjon og sporbar opprinnelse. Innhold utenfor SRD, inkludert Eberron, er manuelt registrert av bruker; ikke distribuer proprietært innhold.

## 6. Historikk, lagring og drift
- **IndexedDB**, lokal/offline-first, GitHub Pages statisk hosting. Ingen obligatorisk nettforbindelse for lagrede karakterer og SRD-oppslag etter at appen er cachet.
- Lagrede karakterendringer føres som strukturerte logghendelser med før-/etter-verdier; sammensatte endringer som én hendelse. Angre siste endring, se logg, korriger eldre manuelt. Ikke logg midlertidige UI-valg.
- JSON import/export med schemaVersion, relevante IDs og komplett karakterdata inkl. valgfritt portrett; valider før import, ikke overskriv uventet. Diskret backup-påminnelse etter endringer over tid.
- Data fra flere karakterer må forbli isolerte, også etter kopi. Oppgraderings-/migreringstester og backup round-trip er obligatoriske.

## 7. Ikke-mål
Automatisk karakterbygging/levelup, digital dice roller, rundeteller, AC-treffsjekk, full kampmotor, tvungen aktiv-status for eksterne effekter, konto/synk, all proprietær boktekst, komplett VTT.

## 8. Kilderangering og ferdigdefinisjon
Ved motstrid: **Denne spesifikasjonen og vedtatte gjeldende beslutninger** > godkjente arbeidsflyter i prototype > foreslått visuell utforming. Prototype v0.11 inneholder kjente regresjoner og er **ikke fasit**.
Codex eier testplan, testdata og testimplementasjon; brukeren godkjenner UX. Før markering av ferdig: bygg kjører, tester er grønne, tilgjengelighet/mobilskjermer og offline er prøvd, kravene ovenfor demonstreres praktisk, og ingen godkjent funksjon har falt bort.

## 9. Presiseringer fra samlet brukerreview (2026-10-18)

Disse presiserer eksisterende krav og skal leses sammen med siste avklaringer i [DECISIONS.md](DECISIONS.md):

- Pillesamlinger skal utnytte mobilbredden bedre enn to faste kolonner: normalt fire piller i bredden, tre ved 320 px, med lesbare navn, like celler og inline +. Stor skrift må kunne brukes uten horisontal overflyt.
- Utstyr har tre synlige grupper: **Weapons**, **Armor og skjold**, **Annet utstyr**, med equipped først innen hver gruppe og direkte, relevant valg fra gruppens +.
- **Class Features & Feats ligger på Character; utstyr er flyttet til egen fane etter senere avklaring.** Feats/egenskaper, språk, skill-/save-proficiencies (inkludert expertise og manuell total modifier), weapon-/armor-/tool-/other-proficiencies, skadeegenskaper og tilstandsimmuniteter skal ha fungerende opprettelse, redigering, fjerning og persistering. De må ikke erstattes av fritekstfelt eller bare finnes i eksportformatet.
- Egenskaper skal kunne kobles til handlinger, begrensede ressurser og betingede skadeeffekter. Spells/cantrips og ressurser inngår i den samlede Character-gjennomgangen. Valg av spells/egenskaper forblir manuelt; senere presisering i §13 krever automatisk oppsett av spell slots fra klasse/nivå, med manuell overstyring.
- Se både prototype og spesifikasjon før endring, og kontroller komplette brukerflyter etterpå. Rene oppslag har én Lukk, redigering har Lagre/Avbryt. Unødvendige mellomdialoger og dupliserte avbryt-/lukkhandlinger skal fjernes.
- **Vedlikeholdskrav:** Oppdater denne spesifikasjonen og beslutningsloggen når brukeren avklarer noe. Før leveransestatus og gjenstående arbeid eksplisitt i en kravmatrise. Samtalekomprimering skal ikke medføre tap av vedtatte krav. Nye ideer må merkes som uavklart fremfor å føres som beslutninger.

Fasevis levering endrer ikke ferdigdefinisjonen for hele produktet. Genererte Combat-oppslag, sammensatt skadekalkulator og komplett lokalt SRD-bibliotek står fortsatt som krav der de ennå ikke er implementert. Se [aktuell kravmatrise](CHARACTER_WORKSPACE.md).

## 10. Produktkontroll som betingelse for levering og merge (2026-10-19)

For hver funksjons- eller UX-endring skal Codex:

1. Beskrive forventet spilleropplevelse med konkret karakter og relevant tilstand **før koding**, med grunnlag i krav, gjeldende avklaringer og D&D 5e 2014-regler, sammenholdt med prototypen.
2. Definere testscenarier fra disse forventningene før implementasjonen, og verifisere relevante valg, ugyldige valg, grenser og DM-unntak der de gjelder.
3. Gjennomføre en egen produktgjennomgang på mobil av berørte flyter, inkludert relevans, plassbruk, mellomtrykk, knappeformål og begrunnede forskjeller fra referansen.
4. Dokumentere scenarioer, faktisk kontroll, resultater og gjenværende krav i PR og kravmatrise før merge. Grønne tekniske tester alene oppfyller ikke dette kravet. Uløste avvik i berørte flyter må rettes eller uttrykkelig avgrenses av brukeren; eksisterende godkjente fasegrenser beholdes.

Codex utfører produktkontrollen; brukerens UX-vurdering kommer i tillegg. Se [arbeidsinstruks](../AGENTS.md#obligatorisk-produktkontroll-før-levering-og-merge) og [matriseformat, scenarioer og åpne avvik](CHARACTER_WORKSPACE.md#produktkontroll-før-levering-og-merge-vedtatt-2026-10-19). Rene dokumentasjonsendringer verifiseres med tekst-, konsistens- og lenkekontroll; funksjonskrav erklæres ikke oppfylt av en dokumentasjonsendring.

## 11. Enkel Utstyr-fane og avgrensede beregninger (vedtatt 2026-10-19)

- Tre hovedfaner Character, Combat og Utstyr erstatter tidligere tofanekrav. Hver bevarer egen scroll. Administrasjon av utstyr ligger i Utstyr, relevante våpenoppslag og kampverdier i Combat, samme data ligger til grunn.
- Ingen utstyrsfigur, dra-og-slipp eller obligatoriske kroppsdeler. Rustning er normalt ett samlet sett; enkeltplagg og egne gjenstander kan føres frivillig. Vanlige plagg gir ingen automatisk bonus.
- Normalt velg kataloggjenstand → legg til direkte. Verdier følger med. Egenregistrering krever bare navn og relevant kategori; notater, antall, regelverdier, magiske bonuser og overstyringer er tilgjengelige ved behov.
- Enkelt «I bruk»-valg, én/to hender der relevant, og attunement-valg for gjenstander som krever det. Varsle om konflikter uten å blokkere DM-unntak.
- Beregn AC, våpenangrep og skade etter 2014-reglene fra relevant karaktergrunnlag, proficiencies, håndbruk og støttede registrerte egenskaper/vanlige magiske bonuser. Vis forklaring og kilder. Attunement-avhengige magiske bonuser gjelder bare når kravet er oppfylt; rustningens normale grunnverdier beholdes.
- Mer sammensatte effekter beskrives som tekst inntil konkret støtte er implementert. Ikke tolk vilkårlig regeltekst som automatisk effekt. Manuelle totaler og egne varianter bevares og merkes tydelig.

## 12. Bestilt designstudie (2026-10-19)

Tre klart forskjellige fantasy-/D&D-inspirerte utseendeforslag skal vises før endelig designvalg. Brukeren har ingen preferanse for lyst eller mørkt tema. Samme karakter og innhold skal brukes, med Character/Combat-skisser, Utstyr-utsnitt og komponenteksempler for identitet, fem statusfelt, fire modifiers, seks abilities, overskrifter, piller/inline +, dialogtyper, bunnavigasjon, tilgjengelig menyknapp og meny, Combat-tabs/swipe, slidere og tekstfelt. Ta også med ikoner, fonter, farger, fokus, valgt/aktiv/oppbrukt og feiltilstander. Menyplassering og dialogutforming undersøkes som forslag; de er ikke vedtatt gjennom en skisse. Se [designstudien](design/2026-10/README.md). Eksisterende funksjonskrav beholdes; tema skal velges før appens utseende implementeres.

### Valgt retning og videre designavklaringer (2026-10-20)

- **Eventyrjournal er valgt** som videre retning og fargepalett. Ability scores skal bruke runde mynter fra Stjernekart fremfor Eventyrjournalens bueformer. Forkortelsene øverst skal følge buen uniformt, med konsistent radius, plassering og bokstavavstand.
- Elementer som åpner oppslag/dialog eller utfører en handling skal ha et subtilt, konsekvent visuelt skille fra ren informasjon. Skillet må fungere uten hover og uten bare å bygge på farge.
- Små ikoner ved overskrifter, karakterportrettets presentasjon, meny nederst og ikoner på bunnfanene er positivt vurdert og skal videreføres. Uten portrett skal en gjennomarbeidet placeholder vises; bilde er fortsatt valgfritt.
- HP-forløpsindikatoren vurderes av brukeren som lite viktig; den trenger ikke prioriteres. Endelig utforming er ikke fastsatt.
- Luftige modifiers videreføres med felles hjørnemarkør etter senere avklaring. Pillene bruker samme familie med kategoriikon og inline +.
- B2 med ikoner på artsegenskaper, features/feats, våpen og spells/cantrips er senere valgt og presisert til kategoriikoner med familie-/reservevalg for egne og ukjente poster. Navnet beholdes lesbart. Se implementasjonsbestillingen under.
- Videre komponentstudie skal vise representative rader av alle relevante elementfamilier samlet: piller/inline +, HP/AC/øvrig status, modifiers, ability-mynter, artsegenskaper, features/feats, spells/cantrips og utstyr. Ta med lange navn og relevante tilstander. Ulike familier trenger ikke unike former; gjenbruk skal gi sammenheng og kompakthet.

Dette er tilbakemelding på designstudien og valg av retning, ikke en bestilling av produksjonskode. Dialogdetaljer, ikonsett og modifierutforming er fortsatt uavklart.

**Bestilling 2026-10-20:** Brukeren ba uttrykkelig om komponentplansjene som beskrevet. [Komponentstudien](design/2026-10/components/README.md) viser elementfamilier, modifier-/ikonalternativer og samhandling/tilstander. Bestillingen gjelder disse designforslagene, ikke produksjonsimplementasjon eller et komplett ikonbibliotek. De åpne designvalgene over avgjøres etter vurdering av plansjene.

**Videre designutprøving 2026-10-20:** Brukeren ønsker samme klikkbarhetsmarkør på tvers av komponenter, uten å endre rammene: en liten fylt trekant nederst til høyre, dannet av kanten og en 45° diagonal. Dette prøves i en egen plansje. Modifierfeltet åpner listen for å bytte hva favoritten viser, ikke en direkte tallredigering. Ramme-/bakgrunnskontrast skal ikke brukes som klikkbarhetsmarkering i denne prøven. Endelig utforming og omfang, samt hvordan utstyrt-/forberedt-status vises, avklares etter visning; ingen appimplementasjon er bestilt.

### Avklart hjørnefarge og relativ HP-slider (2026-10-20)

- Brukeren godkjente hjørnemarkørens uttrykk og samme fyllfarge på trekant og ramme. På luftige modifiers brukes bunnlinjens farge. Den tidligere plansjens lysere trekantfyll er historisk utprøving.
- HP-kontrollen får tydelig innramming rundt hele bevegelsesområdet og grepet. Dragets retning og lengde bestemmer justeringen: høyre øker endringsbeløpet, venstre senker det. Å holde grepet stille gir ingen kontinuerlig endring over tid.
- Ved slipp beholdes endringsbeløpet, mens grepet smetter tilbake til nøytral midtposisjon. Et nytt drag justerer videre fra beløpet som allerede er valgt. Grepet er ikke en indikator for beløpets absolutte plassering på en skala.
- Endringsbeløpet og HP-forhåndsvisningen vises separat fra grepet. Eksempel: start 0, dra til −8, slipp → beløpet står på −8 og grepet er i midten. Neste drag justerer fra −8.
- HP-resultatet begrenses til 0–maks: skade kan gi 0, aldri negativ HP; healing kan ikke gi vanlig HP over maks. Temporary HP absorberer skade først og økes ikke av healing, som tidligere vedtatt. Forhåndsvisning og bekreftelse beholdes; karakterens HP endres først ved bekreftelse.

Dette er avklart betjening og design, ikke en bestilling av appkode eller nye sliderplansjer. Numerisk følsomhet og detaljert animasjon er ikke fastsatt. Eksisterende bilder viser ikke denne betjeningen.

### Avklart kompakt toppfelt og scrolling (2026-10-20)

Brukeren godkjente at appnavnet «D&D Character Companion» og regelutgaven «5e · 2014» fjernes fra karakterens toppfelt og plasseres under «Om appen» i menyen. Toppfeltet viser portrett/placeholder, karakterens navn og art, klasse, nivå og subclass. Hele toppfeltet scroller bort med innholdet; det skal ikke være fast eller sticky. Meny og hovedfaner forblir tilgjengelige nederst. Dette er vedtatt design, ikke en ny implementasjonsbestilling; eksisterende plansjer er historiske forslag.

### Individuelle ikoner valgt (2026-10-20)

Brukeren valgte **B2** fra plansje 06 (Alternativer): individuelle ikoner på artsegenskaper, class features, feats, våpen, cantrips og spells, i tillegg til overskrifts-/navigasjonsikonene. Dette erstatter tidligere uavklart valg mellom B1/B2. Ved implementasjon må det finnes et komplett og stilistisk sammenhengende sett for innholdet som støttes, med lesbare navn og en gjennomtenkt reservemarkør for egne/ukjente poster. Prøveikonene er ikke et ferdig bibliotek. Ikonene skal kunne vises offline. Dette er et designvalg, ikke en bestilling om å starte produksjonskode eller generere hele ikonsettet nå.

### Bestilt implementasjon av Eventyrjournal (2026-10-20)

Brukeren har nå uttrykkelig bestilt en ny implementert versjon med valgt layout og avtalte endringer. Tidligere «ingen produksjonskode bestilt» beskriver historiske avklaringsrunder. Gjeldende omfang er Eventyrjournal-paletten og lokale fonter, runde ability-mynter med uniforme buede forkortelser, luftige modifiers med hjørnemarkør, portrett/placeholder og kompakt toppfelt uten merkevare-/regeltekst, fast bunnavigasjon med Meny, konsekvent styling av alle eksisterende skjemaer/dialoger/kontroller, kategoriikoner med reserveikoner og den avklarte relative HP-kontrollen. Combat-kategoriene skal også kunne sveipes gjennom. Eksisterende føring, lagring, offline, backup, fokus/scroll og Angre skal bevares.

Ikonvalget presiseres etter brukerens siste innspill: hver post får ikon, men beslektede poster kan dele kategoriikon. Kjent våpentype, rustningstype, spellens skade/effekt og tilsvarende sikre kategoridata brukes til visuell klassifisering. Der spesifikk kategori mangler brukes familieikon, deretter nøytralt fantasyemblem. Egne poster dekkes også; valgfritt ikonvalg under detaljer gir manuell kontroll uten nye obligatoriske registreringsfelt. Ikonet tildeler aldri regelverdier eller tilgang. Status som «I bruk»/«Forberedt» vises med hake/tekst; hjørnet markerer klikkbarhet. Produksjonsvalg: korte oppslag er kompakte, søk/omfattende redigering får stor flate med fast topp/lukk og relevant bekreftelse. Destruktiv bekreftelse har to ulike handlinger. Ingen duplisert lukk/avbryt.

Tidligere avklarte fasegrenser for avansert skadeberegning, komplett Combat-/SRD-dekning og kontekstfiltrering består; de kravene skal ikke erklæres løst av en ny visuell layout.

## 13. Konseptuell opprydding og arbeidsflyter (2026-10-20)

Etter egen mobilgjennomgang ba brukeren om enklere føring med papirarket som mål. Arbeidsflytene ble avklart én om gangen og deretter uttrykkelig bestilt implementert («Ja, gör det»). Dette avsnittet og arbeidsnotatet er gjeldende føring; eldre avklarings-/leveranseavsnitt beskriver historikk. Det overordnede veiviserprinsippet i §1 gjelder alle flerverdiregistreringer.

### Avklart: våpen fra katalog og egne varianter

- Utstyr → + under Våpen → søk/velg katalogvåpen → direkte tillegg og lukket velger. Standardverdiene følger med uten obligatorisk skjema eller ekstra bekreftelse.
- «Tilpass» ved et katalogvåpen bruker det som utgangspunkt for en egen variant. Navn og frivillig merknad er den enkle føringen; relevante grunnverdier følger med. Etter den siste avklaringen brukes veiviser ved flerverdiregistrering, med spørsmål om ytterligere endringer bare ved behov.
- Flere spillverdier kan endres frivillig; våpenet kan deretter markeres «I bruk» fra utstyrslisten. Tillegging skal være praktisk under spill.
- Grunnskade følger våpen og relevant karaktermodifier. Ekstra skade føres som egne komponenter med skadeuttrykk og skadetype fra liste, eksempelvis `1d8 + 3 slashing + 1d6 fire`. Flere komponenter tillates.
- For hver ekstraskade spør veiviseren «Gjelder ekstraskaden bare under en betingelse?». Ja åpner et fritekstfelt. Betingelsen tilhører akkurat den ekstraskaden, ikke hele våpenet eller bare en generell merknad. Den vises sammen med ekstraskaden på våpenkortet, eksempelvis «+ 1d6 fire · Når sverdet brenner».
- Spilleren/DM vurderer fritekstbetingelsen ved bordet. Registreringen beskriver terningkast; den introduserer ikke automatisk vurdering av vilkåret eller digitale terninger.

### Avklart: velger for egenskaper og feats

- + åpner søkbar liste. To knapper velger Egenskaper eller Feats; én type er aktiv om gangen.
- Standard er «Mine klasser» og karakterens relevante klassenivåer/øvrige forutsetninger. Generelle feats og andre gyldige tilgangskilder beholdes etter kontekstprinsippet. Kjente nivåkrav vises på oppføringene.
- Klassefilterets rekkefølge: Mine klasser, Alle klasser, egne enkeltklasser alfabetisk, øvrige klasser alfabetisk. Filtre kan overstyres for manuelle valg/DM-unntak.
- Trykk registrerer valget og lukker velgeren uten ekstra registreringsdialog. Allerede registrerte valg markeres.
- Samme overordnede relevansprinsipp gjelder cantrips/spells og andre områder. Den senere godkjente flyten er beskrevet nedenfor.

### Bevarte tilbakemeldinger og videre avklaring

- Spell slots skal opprettes/oppdateres fra klassene og nivåene etter 2014-reglene, med manuell overstyring. Dette erstatter tidligere krav om bare manuell opprettelse av slot-beholdning; bruk av slots føres fortsatt manuelt. Konkret flyt, multiclass/Pact Magic og trygg håndtering av eksisterende bruk/overstyringer må avklares og testes før implementasjon.
- Proficiencies, skadeegenskaper og tilstandsimmunitet skal forenkles i en senere avklaringsrunde. Eksisterende føring bevares. Hit Dice og øvrige beholdninger har senere fått godkjente flyter nedenfor.
- AC-beregningsforklaring skal ligge under Utstyr, ikke i Character. Brukeren så Leather-tekst for en gnome monk; det konkrete beregningsgrunnlaget må undersøkes uten å anta at rustningen er feilregistrert.
- Rutinemessige meldinger som «Utstyr lagret» fjernes; feil skal gi tydelig, merkbar beskjed.
- Hjørnetrekanten fjernes fra bunnavigasjon/Meny, Combat-faner, lukkekryss og selvforklarende listevalg. Dette presiserer omfanget av den tidligere generelle markøren.
- Brukeren rapporterer utilsiktet zoom/innhold utenfor skjermen og at HP-slideren ikke kan øke igjen etter at HP-resultatet har nådd 0. Begge står som rapporterte feil som må reproduseres og rettes; tidligere grønne tester beviser ikke at disse situasjonene fungerer.

Nyere avklaringer fra den pågående én-og-én-gjennomgangen samles i [arbeidsnotatet](WORKFLOW_REVIEW.md), på én arbeidsbranch frem til samlet dokumentasjonsleveranse. Det skiller avklart produktretning fra uavklarte forslag og faktisk implementasjon.


### Senere godkjent: Magi, spells og forberedelse

- Fire hovedfaner **Character, Combat, Magi, Utstyr**, samt Meny. Bare ikoner nederst, med tilgjengelige navn og tydelig aktiv fane; ingen hjørnetrekanter. Hver fane bevarer egen scroll. Dette erstatter eldre to-/trefanekrav.
- Magi samler cantrips, spells, spellbook/known/prepared, casting-verdier og slots. Combat bruker de samme spellinstansene for relevante Action/Bonus/Reaction-oppslag.
- + åpner riktig type direkte. Standard er Mine klasser, relevante **klassenivåer** og andre registrerte tilgangskilder. Vis alle/DM-overstyring finnes. Wizard får sin klasseliste på tvers av skoler, ikke alle klassers spells. Multiclass-slots gir ikke i seg selv tilgang til spells på høyere nivå i en enkeltklasse.
- Direkte valg instansierer katalogdata og lukker. Spør om kilde bare når flere tilganger passer. Tilpass bruker katalogdata som utgangspunkt; egen spell/cantrip har navn/nivå og valgfri beskrivelse i kort veiviser. Flere detaljer er frivillig.
- Forbered spells er en avkrysningsliste: Wizard fra egen bok; Cleric/Druid og Paladin etter sine lister/forberedelsesregler. Teller viser valgt/maks. Alltid-forberedte spells holdes utenfor vanlig telling. Lagre samlet; over grensen gir tydelig DM-varsel, ingen hard blokkering. Cantrips og known-klasser tvinges ikke gjennom forberedelse.

### Senere godkjent: slots og enkle beholdninger

- Spell slots settes opp fra 2014-tabellene, felles Spellcasting ved multiclass og separat Pact Magic. Wizard3 har 4/2. Én pille per nivå, Bruk én/Gi tilbake én lagrer og lukker, med Angre. Tilpass åpner direkte tall/manuell maks; manuelle maksverdier og eldre pools bevares uten duplisering. Nivåendring bevarer antallet brukt, også når Pact Magic skifter slotnivå.
- Hit Dice er **antall tilgjengelig/maks per klasse/terningtype**. Ikke krev terningresultat, automatisk CON-regning eller én HP-bekreftelse per fysisk kast. HP føres separat, eventuelt som ett samlet HP-delta. Automatisk oppsett følger kjent klasse/nivå og kan korrigeres manuelt.
- Kjente registrerte egenskaper kan få sikker, kildeknyttet beholdning automatisk. Egen beholdning: navn → maks/tilgjengelig (som utgangspunkt lik maks) → kort/lang/manuell gjenoppretting. Spell slots og Hit Dice skal ikke ligge som generiske typer i denne vanlige registreringsflyten.
- Hvile → Lang hvile viser faktiske før/etter-endringer og lagres i én operasjon med samlet Angre. Vanlig HP til maks, ordinære temp HP bort, relevante slots/beholdninger tilbake; Hit Dice inntil halvparten av totalt maksimalt antall Hit Dice, rundet ned, minst én. Monk4 med 1/4 d8 ender på 3/4. Ved tvetydig multiclass-fordeling velger spilleren terningene. Betingede gjenopprettinger krever eksplisitt bekreftelse; manuelle/særregel-beholdninger og tilstander beholdes. DM avgjør hvilen; ingen simulator, timer eller kalender.
- Samlet ny kort-hvileflyt er fortsatt utsatt; enkel manuell føring og de vedtatte tellerne brukes.

### Senere godkjent: felles tallhjul

Hele tall rulles vertikalt, med valgt tall i midten, endelige grenser og direkte innskriving ved trykk på tallet. Eventyrjournal-uttrykk. I opprettelse velges selve verdien; for HP velges en signert **endring**, med før/etter-visning. Valget står til bekreftelse, fremfor tidligere slider med nøytral retur. Tallfeltene beholder tastaturstøtte og eksplisitt lagring. HP skal kunne økes igjen fra 0.

### Leveranse og avgrensning

Brukeren har delegert gjennomgang og merge, og ønsker én samlet branch/PR til slutt. Implementer og kontroller flytene samlet; ikke merge hver kommentar. [Arbeidsnotatet](WORKFLOW_REVIEW.md) bevarer samtalens rekkefølge, [aktuell leveransebeskrivelse](GUIDED_WORKFLOWS.md) beskriver implementasjonen, og [kravmatrisen](CHARACTER_WORKSPACE.md) fører faktisk kontroll og gjenværende krav. Fysisk iOS-kontroll er ikke tilgjengelig; nettlesermål og minst16px skjemafont begrenser utilsiktet fokuszoom uten å slå av tilgjengelighetszoom.

## 14. Illustrert spørsmålsveiviser og utkast (bestilt 2026-10-20)

Nyere avklaring erstatter «beslektede felt samlet» i veivisere: **ett spørsmål eller én verdi per skjerm**. Ja/nei er tydelige svarflater og går videre ved trykk, ikke avkrysninger eller spørsmål om generelle «spillverdier». Våpen spør konkret «Vil du legge til ekstraskade?». Terningtype vises som trykkbare illustrerte d4/d6/d8/d10/d12 og Annet, ikke dropdown. Antall terninger, skadetype, eventuell betingelse og teksten i betingelsen har hvert sitt steg. Spør til slutt om enda en ekstraskade. Fritekst/nummer bruker Neste, Tilbake bevarer svar. Korte hjelpetekster forklarer det aktuelle valget, blant annet at betingelsen tilhører denne skaden og beskriver når den gjelder.

Veiviseren er et eget grafisk element i Eventyrjournal: tematisk illustrasjon, tydelig spørsmål, god luft, store valg, fast tilgjengelig lukk/tilbake og diskret grafisk fremdrift. Fullførte markører fylles, gjeldende fremheves, kommende har omriss. Ingen synlig «Steg 3 av 6»-tekst; skjermleser får fremdrift. Grenene tilpasses svar og gjentatte ekstraskader.

Lukk/X bevarer et lokalt utkast med svar og posisjon, også over reload/app-lukking. Fortsett åpner samme steg. Fullfør registrerer gjenstanden/verdiene; Forkast utkast er egen destruktiv handling. Ved redigering består sist bekreftede våpen og Combat-verdier til fullføring. Utkast skal ikke telles som utstyr, brukes i Combat eller skrive karakterhistorikk. Lagre-/konfliktfeil vises tydelig og skal ikke lukke eller forkaste uferdig arbeid. Karakteradministrasjon/karakterutkast hører i menyen, utstyrsutkast finnes i Utstyr.

Penger har to rullefelt ved siden av hverandre: hele GP og desimaldel00–99, med felles midtrad; direkte innskriving beholdes. 55|25 betyr55,25GP og lagres som5525CP. HP og Temporary HP i Combat får hjørnetrekant fordi de åpner redigering; AC/Initiative og Character-HP forblir uten.
