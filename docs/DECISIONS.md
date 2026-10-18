# Beslutningslogg – D&D Character Companion

**Oppdatert:** 2026-10-18  
**Status:** Prototyping er avsluttet etter v0.11. Konsolidert implementasjonsgrunnlag finnes i [REQUIREMENTS.md](REQUIREMENTS.md), [DATA_MODEL.md](DATA_MODEL.md), [DESIGN.md](DESIGN.md) og [CODEX_HANDOFF.md](CODEX_HANDOFF.md). Denne loggen bevarer beslutningshistorikken.  
**Regelversjon:** D&D 5e **2014**, ikke 2024. Innhold fra Eberron kan registreres, men proprietært innhold kan ikke uten videre distribueres.

## 1. Produktmål og grenser – besluttet

- **Et bedre, digitalt papirkarakterark**, ikke automatisk karakterbygger, full regelmotor, virtuell spilleleder eller kampsimulator.
- Mobilførst, kompakt, raskt, diskret og inspirerende ved spillebordet. Fysiske terninger; DM har siste ord.
- Eksisterende karakterer registreres direkte; ikke krav om å bygge dem opp fra level 1.
- All informasjon skal kunne redigeres/overstyres manuelt. Enkle, sikre beregninger (f.eks. ability modifiers) er nyttige, men må aldri låse spilleren.
- Flere karakterer; mulig kopiering mellom kampanjer med uavhengig utvikling. Ingen stor kampanjeadministrasjon.
- **Level-up kan være manuelt**, i samarbeid med DM; juster level, HP, slots, spells, feats, egenskaper osv. uten regelstyrt veiviser.
- Ikke terninggenerator, tale-styrte endringer eller automatisk tur-/rundetelling.

## 2. Navigasjon og visuell UX – besluttet

- To hovedvisninger: **Character** (verdier, redigering, oppslag) og **Combat** (rask handling-/regeloversikt); behold separat scrollposisjon.
- Kort/piller fremfor lange tekstblokker; detaljer åpnes ved trykk. Unngå overflødige overskrifter og tellere.
- Statusfelt høyt på Character: fem like store piller på én rad: HP, AC, Initiative, GP og Speed. **Temporary HP og HP-endring ligger i Combat** (senere avklart). GP med to desimaler, internt heltall kobbermynter.
- **Modifiers:** Fire kompakte, tilpassbare favorittkort med fullt navn. Trykk for alfabetisk liste over ferdigheter, ability modifiers, saves, initiative m.m., og bytt kortets innhold. Ikke separat permanent søkefelt/duplikatknapp her.
- **Pluss-pille-mønster:** Hver redigerbare samling får en pille med stort «+», identisk pilleform og **inline rett etter siste element**, naturlig linjebryting; ikke egen sirkel eller dedikerte «Legg til»-knapper. Gjelder Weapons, Armor, annet utstyr, Features/Feats, Spells, Cantrips, ressurser, handlinger, notater og andre samlinger.
- For store biblioteker: søkbar, mobilvennlig velger med relevante filtre, og «Opprett egen». Ikke lange demolister i liten popup. Egne feats skal faktisk kunne legges til.
- **Notater:** Vilkårlig mange med tittel og tekst; vist som piller. Bakgrunn kan være et notat.
- Språk, proficiencies, damage defenses og condition immunities struktureres, men kan presenteres kompakt som piller. Skill mellom skadeimmunitet og tilstandsimmunitet.
- Valgfritt opplastet karakterportrett; kompakt ved navn, større visning/bytt/fjern, lagres lokalt og tas med i backup.
- Visuell design skal bli gjennomarbeidet og karakterfullt, ikke generisk administrasjons-UI eller overlesset fantasy. **Codex lager 2–3 designretninger senere**, med prototype og skriftlige krav som underlag; ingen endelig designbestilling før prototypen er vurdert.

## 3. Combat – besluttet

- Combat er **oppslagsverk**, ikke turstyrer. Ingen «Bruk» for vanlige handlinger, ikke «Ferdig med tur», ingen sporing av brukt Action/Bonus Action/Reaction eller movement.
- **Tre faner: Action, Bonus, Reaction.** Sveip/naviger mellom. «Andre egenskaper» er egen kompakt seksjon utenfor fanene (f.eks. Action Surge, passive evner), **ikke en fjerde rundedel**. Dette er gjeldende prototype-retning; finplassering kan fortsatt vurderes.
- Vis karakterspesifikke muligheter fra klasse, feats, species, utstyr og spells i riktig handlingskategori; generelle handlinger følger der de hører hjemme, uten egen duplikatoverskrift.
- Standard kampoppslag inkluderer våpenangrep, **Unarmed Strike**, **Grapple**, **Shove** m.m. etter 2014-regler. Trykk viser angrepskast, skadeuttrykk, damage type, krav og beskrivelse. Ikke dupliser alle saving throws/modifiers fra Character.
- Cantrips må vises i riktig Combat-fane og merkes **∞**, leveled spells med konsistent nivåsymbol. Spells må også kunne ses/administreres utenfor kamp.
- Begrensede egenskaper spores med **enkle avkryssinger / flere bruk**, ikke obligatorisk action-registrering. Short/long rest nullstiller etter relevante regler. Manuell overstyring og angre.
- **«Ta skade» og «Hvile» plasseres under «Andre egenskaper»**. Den tomme knappen som dukket opp i v0.8–v0.9 skal bort.

## 4. «Ta skade» – gjeldende beslutning

- **Navn:** «Ta skade». Kalkulatoren behandler **innkommende skade, ikke om angrepet treffer**. DM avgjør treff, saving throws og kan allerede ha regnet inn aktive reaksjoner som Uncanny Dodge. **Ingen AC-/treffkontroll** i kalkulatoren.
- Rask standardflyt: angi skademengde (slider med ±1 for presisjon) → velg skadetype → gjennomgå automatisk foreslåtte skadeeffekter → se tydelig resultat → bekreft «Oppdater HP». Oppdater aldri HP bare ved åpning.
- Finn relevante passive skademodifikatorer fra karakterdata, inkludert resistance, vulnerability, immunity, flat reduksjon som **Heavy Armor Master** med betingelser. **Alle som kan anses relevante er avkrysset som standard**, men **hver modifikator kan deaktiveres separat for denne beregningen** (f.eks. hvis DM allerede har regnet den med). Dette endrer ikke karakterdata.
- Resistance og vulnerability **kan eksistere samtidig**; ikke bruk eksklusive radiovalg. «Normal» = ingen; damage immunity gir null. Foreslåtte effekter må oppdateres ved endring av skadetype.
- Strukturert effect-modell bør kunne representere betingelser som skade-/våpentype, heavy armor og ikke-magiske angrep, uten særkode for hver feat. **Ukjente betingelser vises tydelig og krever spillerens bekreftelse før modifikatoren regnes med**; kjente relevante effekter velges automatisk.
- **Sammensatt skade:** Én skadepost vises som standard; spilleren kan legge til flere med pluss-pille, med selvstendig skadetype/modifikatorer per post og samlet HP-resultat.
- Regn i korrekt 2014-rekkefølge og med korrekt avrunding, også når flere effekter virker sammen. Passive effekter fra feats, class features og utstyr behandles konsistent.
- Temporary HP absorberer før vanlig HP; vis begge nye verdier. **Én Angre skal reversere hele skadehendelsen.**
- Vis **etterprøvbar beregningslogg** og kort «til DM»-oppsummering: innkommende, anvendte modifikatorer og grunn, absorbert av temp HP, tap av vanlig HP, ny HP. Ikke beskriv AC som skadeabsorpsjon.
- **Uncanny Dodge** vises som Reaction/oppslag, men ligger ikke som obligatorisk automatisk skadereduksjon i kalkulatoren.
- HP-pillens primærtrykk er vanlig HP-justering. «Ta skade» som sekundær snarvei i HP-popup er **ikke påkrevd**.
- Spesialtilfeller (f.eks. saving-throw-effekter og flere betingelser) er til videre avklaring – ikke legg inn som kompleks standardflyt.

## 5. Karakterdata, ressurser og utstyr – besluttet

- Modellér **verdier**, **ressurser** (antall/maks, short/long rest, eventuelle særregler), **handlinger/egenskaper**, **aktive tilstander/effekter** og **notater** med tydelige koblinger der det er relevant. Egendefinerte poster skal fungere uten forhåndsprogrammerte regler.
- Ressurser skal omfatte HP, Temporary HP, Hit Dice, Death Saves, Inspiration, spell slots/Pact Magic, klasse- og item-ressurser; conditions og exhaustion må kunne registreres.
- HP-popup: slider sentrert på null for skade/healing, ±1, forhåndsvisning, bekreft og angre. Temp HP separeres synlig; skade tar temp HP først; healing bare vanlig HP. Temp HP stables normalt ikke.
- **Short Rest / Hit Dice:** DM avgjør når hvile skjer; registrer én fysisk kastet Hit Die og dens HP-healing av gangen, med mulighet for flere etterpå og manuell justering. Samlet angre for hver registrering.
- **Spell-slot-piller:** Trykk på nivåets pille åpner *kun dette nivået* med ±1 og tilgjengelig/maks. **Hvile** åpnes via kompakt pille/verktøy, ikke permanent stort panel.
- **Felles spellvisning med klassetilpassede felt og ressurser**, ikke separate UI-er per klasse. Spell-data må skille cantrip, spell level, known/spellbook/prepared, slots, Pact Magic, concentration, ritual, casting time, range, duration, components, saving throw/attack, damage, upcasting; registrering manuell når nødvendig.
- Utstyr skiller **eid** fra **utstyrt**, weapons fra armor, equipped først. Utstyr kan endre AC, våpenkast, Combat-alternativer og betingede effekter; advar ved konflikt, **blokker aldri** DM-godkjente valg. Støtt dual wielding og tohåndsvåpen.
- Class Features & Feats vises **før utstyr**. Feats skal kunne opprettes/redigeres manuelt og eventuelt knyttes til ressurs/handling/betinget effekt.
- Ikke krev løpende registrering av eksterne buffs/debuffs eller situasjonsforhold. Egne egenskaper som Rage, Concentration og Mage Armor kan ved behov ha enkel status knyttet til feature/spell, men kun der det har praktisk verdi; eksterne/midlertidige skademodifikatorer kan velges direkte i «Ta skade» uten permanent sporing.
- **Level Up** finnes under «Denne karakteren» i innstillingsmenyen, ikke under generell administrasjon og ikke som stort Progression-panel.
- Arcane Recovery krever vurdering av spilledag/short rest; ikke anta kalenderdato fra virkeligheten.

- **Hendelseslogg:** Faktiske endringer i karakterens lagrede tilstand logges samlet per operasjon med tidspunkt, før-/etter-verdier og type. Midlertidige visningsvalg logges ikke. Angre siste endring og lesbar historikk; eldre poster kan korrigeres manuelt.

## 6. Teknologi og videre prosess – besluttet

- Hosting: **GitHub Pages**. Lokal database: **IndexedDB**, ingen backend/brukerkonto. Lokal persistens synkroniseres ikke mellom enheter.
- Eksport/import **JSON** som backup (inkludert evt. portrett), med **diskret påminnelse etter en periode med endringer uten eksport**. Robust håndtering av data og migrering; offline PWA med cache/service worker når implementasjonen modnes.
- Prototype-HTML er **funksjonell referanse, ikke produksjonskode**. Kravspesifikasjon og designbrief skrives **etter** at prototypen er testet/avklart; deretter Codex-implementasjon med tester.
- **Innhold:** SRD 5.1 leveres som ferdig, lokalt regelbibliotek; innhold utenfor SRD (inkludert proprietært 2014-/Eberron-innhold) skal kunne registreres manuelt. Skill lisensiert SRD 5.1-regeldata fra proprietært innhold og brukerregistrerte karakterdata.
- Talebasert oppslag på skill/modifier var diskutert som valgfri fremtidig funksjon, **ikke nødvendig for MVP**. Ingen talemutasjoner.

## 7. Åpne spørsmål – avklares én etter én

1. **Sammensatt skade – besluttet:** Støtt flere skadeposter/skadetyper i én hendelse. Vis én skadepost som standard; legg til flere via pluss-pille.
2. **Betingelser for passive skadeeffekter – besluttet:** Vis aktuelle modifikatorer og vilkår. Når vilkår ikke kan avgjøres automatisk, må spilleren bekrefte at effekten gjelder før den brukes i beregningen.
3. **Hit Dice og hvile – besluttet:** DM avgjør om Short Rest gjennomføres. Spilleren kan bruke én Hit Die av gangen, kaste fysisk og registrere resultatet som healing, og velge å bruke flere etterpå. Tillat også manuell justering av totalsummer. Ingen digital terningkasting.
4. **Spellcasting-varianter – besluttet:** Felles spellvisning med klassetilpassede felt og ressurser (known, spellbook, prepared, Pact Magic), og alltid mulighet for manuell redigering.
5. **Aktive effekter – avgrenset:** Ikke bygg generell tracker for buffs/debuffs, eksterne spells, mørke eller andre situasjonsforhold. Registrer bare det som naturlig hører til karakterarket (f.eks. egne begrensede ressurser og eventuelt nyttig aktiv-status), eller er nødvendig for skadekalkulatoren. Videre detalj-UX kan utsettes.
6. **Endringslogg og angre – besluttet:** Logg faktiske karakterendringer (HP, Temporary HP, spell slots, penger, utstyr og opprettelse/sletting) som strukturerte hendelser med før-/etter-verdier. Ikke logg midlertidige UI-valg som avkryssing i skadeberegning. Vis inspeksjonslogg; støtt enkel «Angre siste endring». Eldre endringer korrigeres manuelt i første versjon; eventuell flerstegs reversering utsettes.
7. **Backup-sikkerhet – besluttet:** Manuell JSON-eksport/import, med diskret påminnelse når karakteren er endret og det har gått en stund siden siste sikkerhetskopi. Ingen automatisk skybackup eller masete varsler.
8. **Testopplegg – besluttet:** Codex utformer testarkitektur, eksempelkarakterer, scenarier og automatiserte tester ut fra kravene; dekker ulike klasser, ressurser, spells, utstyr, skadeeffekter og grensetilfeller. Brukeren kvalitetssikrer UX manuelt. Vi forhåndsbestemmer ikke detaljert testpakke.
9. **Innholdsdekning – besluttet:** Lever SRD 5.1 som ferdig, lokalt tilgjengelig regelbibliotek. Annet 2014- og Eberron-innhold registreres manuelt av brukeren. Respekter lisens og skill regelbibliotek fra brukerdata.

- **Testing:** Codex har ansvar for å utforme og vedlikeholde automatiserte tester, testdata og scenarier, inklusive grensetilfeller; kravene definerer forventet funksjon. Bruker tester UX manuelt.

## 8. Beslutningshistorikk – erstattede retninger

- **Tidligere automatisk Level Up/karakterbygger → erstattet av manuelt redigerbart digitalt ark.**
- **Tidligere «Bruk»-knapper for alle actions og «Ferdig med tur» → forkastet.** Combat er nå oppslagsverk; kun begrensede ressurser spores.
- **Tidligere fire Combat-faner Action/Bonus/Reaction/Other → tre faner og separat «Andre egenskaper».**
- **Tidligere dropdown/radiogruppe med eksklusive Normal/Resistance/Vulnerability/Immunity → individuell effektmodell**, der flere kan eksistere samtidig og brukes/overstyres per hendelse.
- **Tidligere forslag om AC/treffkontroll i skadekalkulator → uttrykkelig forkastet.**
- **Tidligere «Forsvar»/«Beregn skade» → godkjent «Ta skade».**
- **Tidligere egne «Legg til …»-knapper og sirkel-pluss på egen linje → inline pluss-pille.**
- **Tidligere særskilt «Bakgrunn»-felt → generelle navngitte notater.**
- **Tidligere forslag om HP-popup-snarvei til kalkulator → ikke påkrevd.**
- v0.2–v0.10 ble brukt for å oppdage disse valgene; feil i prototyper er ikke gjeldende krav.

---
**Vedlikehold:** Nye avklaringer oppdateres i gjeldende seksjon og føres eventuelt som historisk endring. Ikke legg uavklarte forslag inn blant besluttede krav.

## Evaluering v0.11 og overgang til Codex (2026-10-18)

**Beslutning:** Stans videre iterasjon på énfil-HTML-prototyper. Overfør arbeidet til Codex med en konsolidert kravspesifikasjon, datamodell, designbrief og automatiserte tester. Eksisterende prototyper brukes som illustrasjon av arbeidsflyt, **ikke som korrekt eller fullstendig funksjonell fasit**.

**Feil/mangler observert i v0.11 – skal uttrykkelig håndteres i Codex-bestillingen:**
- Skadekalkulatoren viser en lite forklarende samlepost «Etter modifikatorer». Vis i stedet **hver anvendt skademodifikator separat**, med navn, endringsbeløp, årsak/vilkår og mulighet til å slå den av/på for gjeldende hendelse. Oppsummeringen skal kunne leses/forklares til DM.
- Muligheten til å **angi/overstyre resistance, vulnerability og immunity i kalkulatoren** har forsvunnet. Gjeninnfør med kompakte, synlige kontroller; støtt samtidig resistance og vulnerability, og oppdater forslag ved bytte av skadetype. De strukturerte karakteregenskapene skal være utgangspunkt, men manuell overstyring skal alltid være mulig.
- Flere tidligere fungerende grensesnittfunksjoner er falt bort under prototypeiterasjon. Codex må kartlegge gjeldende krav opp mot prototypeversjonene, bygge regresjonstester og ikke behandle siste prototype som eneste sannhet.
- «Rediger øvrige felt»-popup er **forkastet**. Ikke egne duplikatfelt for Bakgrunn/Notater; bakgrunn kan være ett av mange **navngitte notater**, vist som piller med inline +-pille.
- **Languages, proficiencies, damage resistances, vulnerabilities, immunities og condition immunities** må lagres og redigeres som **separate strukturerte data**, ikke uspesifisert fritekst. De kan presenteres kompakt som piller og kobles til beregningene der dette er relevant. Å bare beskrive dem som strukturert uten fungerende brukergrensesnitt og lagring er utilstrekkelig.
- Behold tidligere avklaringer: tre Combat-faner og Andre egenskaper separat, ingen turstyring eller AC-treffkontroll, valgfrie skadeposter, betingede modifikatorer med bekreftelse ved ukjente vilkår, pluss-piller inline, kortfattede oppslag, DM avgjør spillet.

**Overlevering:** Før Codex starter, skriv en konsistent kravspesifikasjon og implementasjonsplan med prioritet mellom kilder: 1) vedtatte krav, 2) godkjente UX-mønstre fra prototyper, 3) visuell designbrief. Testarkitektur og testcaser utformes av Codex; bruker vurderer UX. Design kan forbedres vesentlig uten å videreføre prototypefeil.

## Presisering etter gjennomgang av fase 1

Brukeren har påpekt at opprettelsen feilaktig ba om AC, speed og temporary HP som uavhengige grunnverdier. Denne første rettelsen ble senere presisert ytterligere: Opprettelse registrerer bare identitet, art, klasse/subclass/nivå, ability scores og maks HP. Utstyr legges til inne i appen, og løpende HP-tilstand håndteres i Combat. Se siste avklaring nedenfor. Manuelle overstyringer er egne, eksplisitte korreksjoner. Eksisterende karakterer kan fortsatt registreres direkte uten automatisk karakterbygging eller rekonstruksjon av tidligere levels. Se [implementert kontrakt og avgrensning](CHARACTER_FOUNDATIONS.md).

Brukeren har også overlatt kodegjennomgang og merge av testede endringer til Codex. Produkt- og designavgjørelser ligger fortsatt hos brukeren.

## Seneste brukeravklaringer om arbeidsflate og opprettelse

Disse presiserer og erstatter eldre plasseringer i prototypebeslutningene:

- All karakteradministrasjon i menyen; grunnlagsredigering og Level Up under «Denne karakteren», uten permanent panel på arbeidsflaten.
- Character har fem statusverdier på én rad: HP, AC, Initiative, GP og Speed. HP er lesbar status; skade/healing og Temporary HP er i Combat, også for skade utenfor kamp.
- Like store piller med lik form og ramme innen hver seksjon, inkludert inline +.
- Opprettelse har tomt navn med grått hint som skjules ved fokus, species-listen uten speed/artsdetaljer, klasse/subclass-lister med egne alternativer, nivå, grunnverdier og manuelt maks HP. Utstyr og features hører til inne i appen.
- Maks HP kan bygge på fysisk Hit Die-kast eller fast verdi. Manuell Level Up må derfor ha felt for ny maks HP. Ingen digital kasting eller automatisk karakterbygger.
- Brukeren ønsker å kunne fullføre en tankeprosess før koding: kommentarer er ikke i seg selv en kodebestilling. Denne endringen ble uttrykkelig bestilt med «nå starter å kode».
- Brukeren la v0.11-prototypen i `prototypes/dnd-character-companion-v0.11.html`. Den er lest og åpnet i nettleser; se [konkret gjennomgang og avgrensning](PROTOTYPE_REVIEW.md). Gammel app.js er ikke samme referanse.

## Avklart opprydding av eksisterende brukerflyter

Brukeren aksepterte at Combat-oppslag ennå ikke var implementert innen den opprinnelige faseavgrensningen, og bestilte deretter en grundig rettelse av unødvendige mellomsteg og dårlig UX i eksisterende funksjoner. Katalogutstyr velges direkte fra inline +; eget utstyr kan opprettes fra velgeren. Eksisterende utstyr redigeres/fjernes fra sin egen pille. Rene oppslag har bare Lukk. Se [konkret gjennomgang, rettelser og kontroll](UX_REVIEW.md). Dette erstatter den tidligere samlede utstyrsredigeringsdialogen.

## Samlet gjennomgang etter brukerens tilbakemeldinger (2026-10-18)

Disse avklaringene må bevares mellom arbeidsøkter og eventuell komprimering av samtalen:

- **Dokumentene er varig prosjektminne.** Kravspesifikasjonen og beslutningsloggen skal oppdateres fortløpende med vedtatte avklaringer. Implementasjonsstatus føres separat; et uimplementert krav skal ikke fjernes eller omskrives til en ny avgrensning uten brukerens beslutning.
- **Alt må ses i sammenheng:** kravspesifikasjon, datamodell, gjeldende beslutninger, forklaringsfil og faktisk v0.11-prototype. Brukeren skal ikke måtte spesifisere på nytt funksjoner som allerede finnes der. Nyeste eksplisitte brukeravklaring går foran eldre prototypeutforming.
- **Tette pillesamlinger:** To faste kolonner for artsegenskaper og utstyr er for glissent. Bruk plass til omtrent fire piller på normal mobilbredde, tre på de smaleste skjermene, med lesbare navn og tilstrekkelige trykkflater. Behold lik størrelse, utforming og ramme innen samlingen. + er neste pille i samme grid.
- **Utstyr følger prototypens inndeling:** Weapons, Armor og skjold, Annet utstyr. Vis utstyrt først innen hver gruppe. Gruppens + åpner relevante søkbare valg direkte. Egenregistrering skal alltid være tilgjengelig.
- **Features/feats, languages og proficiencies er påkrevde brukerflyter.** Det er utilstrekkelig at de bare finnes i datamodellen. Det samme gjelder spesifikasjonens separate skadeegenskaper og tilstandsimmuniteter. Skill-/save-proficiency, expertise og manuelle modifiers må påvirke de viste verdiene.
- Brukeren bestilte uttrykkelig **en ny implementert versjon basert på den samlede gjennomgangen og tilbakemeldingene**. Dette autoriserer denne endringen. Det opphever ikke regelen om at senere løpende kommentarer skal få fullføres før ny koding settes i gang.
- Tidligere aksept av en fasevis implementering av Combat står ved lag: genererte standard-/våpenhandlinger og den avanserte skadekalkulatoren er fortsatt krav, men inngår ikke i denne Character-rettelsen. Manuelt registrerte handlinger og spells kan allerede brukes som oppslag. Ikke beskriv dette som full Combat-paritet eller komplett SRD-dekning.
- Codex skal gjennomgå de konkrete brukerflytene og regresjonene selv før levering. Grønne tester er nødvendig, men erstatter ikke sammenligning med krav og prototype eller vurdering av mellomsteg, plassbruk og knappeformål.

Se [kravmatrise og faktisk leveransestatus](CHARACTER_WORKSPACE.md). Dette dokumentet bevarer produktbeslutningene; matrisen skiller implementert funksjon, delvis støtte og gjenstående arbeid.

## Fast produktkontroll før levering og merge (2026-10-19)

**Besluttet av brukeren:** De fire foreslåtte kravene til arbeidet skal legges inn i arbeidsinstruksen og kravmatrisen:

1. Forventet spilleropplevelse med konkrete karakterer beskrives før koding, basert på spesifikasjon, avklaringer og relevante D&D 2014-regler, sammenholdt med prototypen.
2. Testscenariene utledes fra disse forventningene før implementasjon; de dekker relevans og spillmessig korrekthet i tillegg til teknisk funksjon og lagring.
3. Codex gjennomfører en egen produktgjennomgang på mobil før levering og vurderer valg, plassbruk, mellomtrykk og sammenheng med referansen. Forskjeller begrunnes.
4. Dette er en betingelse for merge: PR og matrise viser prøvde spillsituasjoner, faktiske resultater og gjenværende krav. Uløste avvik i berørte flyter rettes eller uttrykkelig avgrenses av brukeren. Tidligere godkjente fasegrenser står ved lag.

Bakgrunnen er den lange egenskaps-/featlisten som viser irrelevante valg for karakteren. Eksisterende CRUD- og lagringstester dokumenterte ikke korrekt relevans etter klasse, subclass, klassenivå, art eller faktiske feat-forutsetninger. Dette føres som et **åpent avvik**, med scenarioer i matrisen. Tidligere grønne tester skal ikke omtales som bevis for denne dekningen.

Denne bestillingen gjelder dokumentasjon av arbeidsmåten og status. Den autoriserer ingen ny implementasjon av filtreringen. Rene dokumentasjonsendringer kontrolleres med tekst, konsistens og lenker. Se [arbeidsinstruks](../AGENTS.md#obligatorisk-produktkontroll-før-levering-og-merge), [krav §10](REQUIREMENTS.md#10-produktkontroll-som-betingelse-for-levering-og-merge-2026-10-19) og [kravmatrise](CHARACTER_WORKSPACE.md#produktkontroll-før-levering-og-merge-vedtatt-2026-10-19).

### Presisering: generelle feats skal beholdes (2026-10-19)

Brukeren presiserte at filtreringen ikke må være så streng at feats som gjelder for alle, forsvinner. **Generelle feats uten klassekrav skal beholdes uansett klassefilter.** En manglende klassebegrensning er ikke grunnlag for å skjule en feat. Eventuelle andre faktiske forutsetninger vurderes fortsatt; uavklarte krav merkes og valget beholdes tilgjengelig. Matrisen skal ha scenarioer for både generelle feats og feats med reelle begrensninger. Dette er ført som krav og åpent kontrollpunkt, uten å implementere ny filtrering i denne dokumentasjonsendringen.


## Karakterens kontekst er et overordnet produktprinsipp (2026-10-19)

Brukeren presiserte at relevans gjelder gjennomgående, blant annet cantrips og spells, og skal ligge over enkeltstående user stories. Feats er et eksempel på det samme prinsippet. Dette er derfor ført i [krav §1](REQUIREMENTS.md#overordnet-prinsipp-karakterens-kontekst), arbeidsinstruksen og matrisen.

Appen skal bruke karakterens kjente kontekst og formålet med den aktuelle flyten til å presentere relevante valg, verdier og oppslag. Generelle valg skal beholdes; faktiske regler og flere mulige tilgangskilder må vurderes per område. Uavklarte forhold merkes, og manuelle valg og DM-unntak beholdes. Eierskap/registrering, læring/valg og bruk har ulike forutsetninger. Tidligere registrerte data skal bevares ved kontekstendringer.

Hver berørt user story skal konkretisere prinsippet i forventet spilleropplevelse og kontrollscenarioer. De fire vedtatte kravene før levering/merge gjelder fortsatt. Denne presiseringen dokumenterer produktgrunnlaget; ingen funksjonskode implementeres i denne dokumentasjonsendringen.
