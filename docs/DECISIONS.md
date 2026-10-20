# Beslutningslogg – D&D Character Companion

**Oppdatert:** 2026-10-20
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

- Tre hovedvisninger: **Character**, **Combat** og **Utstyr** med separat scrollposisjon (senere avklart 2026-10-19; erstatter to faner).
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
- Class Features & Feats vises på **Character**, utstyr i egen **Utstyr**-fane (senere avklart). Feats skal kunne opprettes/redigeres manuelt og eventuelt knyttes til ressurs/handling/betinget effekt.
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


## Øverste produktmål: erstatte papirkarakterarket (presisert 2026-10-19)

Brukeren minnet om at hele produktet skal erstatte et papirkarakterark. Dette eksisterende målet er nå fremhevet som øverste føring i krav §1, arbeidsinstruksen og matrisen. Konteksttilpasning og kommende user stories skal vurderes etter hvordan de støtter rask oversikt, oppslag, notater og manuell føring under fysisk spill, med spillerens kontroll og DM som autoritet. Tidligere vedtatte grenser for automatisk karakterbygging, regelmotor og turstyring gjelder fortsatt.


## Konkrete våpen- og rustningsoppslag (brukerreview 2026-10-19)

Brukeren opplever at våpen og rustning fremstår som generiske typer og savner blant annet damage modifiers. Gjennomgangen av kode bekrefter at utstyr allerede lagres som egne instanser, med redigerbart navn og verdier. Mangelen er karaktertilpasset våpenoppslag: angreps-/skadebonus beregnes ikke, og utstyrsverdiene ligger under et lukket detaljfelt. Nye katalogvåpen har grunnskade; eldre poster fra den tidligere katalogen kan mangle den. Rustningsprofil brukes allerede til beregnet AC/speed.

Dette føres som delvis støtte og åpne avvik i matrisen, med separate scenarioer for våpenverdier og tydelig rustningsoppslag. Manuelle overstyringer og eksisterende karakterdata bevares. Det er ikke bestilt ny funksjonskode i denne gjennomgangen. Dette er også et konkret eksempel på produktprinsippene: det digitale arket skal gjøre karakterens faktiske spillverdier tilgjengelige under spill.


## Lettere registrering og færre felt (brukerreview 2026-10-19)

Brukeren opplever at det generelt er tungvint å legge til innhold og at mange felt må håndteres. Dette føres som et gjennomgående UX-behov, knyttet til målet om enkel føring på et digitalt papirark. Gjennomgangen skal vurdere både synlig feltmengde og faktisk nødvendig utfylling i hver berørt flyt.

Sikre katalog-/kontekstverdier, korte minimumsskjemaer og detaljer/overstyringer ved behov er mulige forenklinger som skal vurderes. Konkret feltsett og utforming per flyt er ikke besluttet. Nødvendig informasjon, eksisterende avklaringer om opprettelse og spillerens manuelle kontroll skal bevares. Ingen funksjonskode er bestilt eller endret i denne dokumentasjonsrunden.


## Utstyrskombinasjoner er sentrale for karakterarket (2026-10-19)

Brukeren presiserte behovet for å kunne kombinere eksempelvis brynje og kappe etter hvordan gjenstandene faktisk bæres, og bekreftet at dette er kompliserende, men svært viktig. Dette føres som et sentralt funksjonskrav: gjenstandstype, relevant plassering/håndbruk, eid/utstyrt-status, eventuell attunement og kildebaserte virkninger må ses samlet. Spilleren skal få enkel føring og forståelige samlede verdier med bidrag fra de enkelte gjenstandene. Advarsler og manuell DM-overstyring beholdes.

Kombinasjonene vurderes etter D&D 2014-reglene; konkrete felt, UI og implementasjonsrekkefølge er ikke fastsatt. Et kontrollscenario er Chain Mail + Shield + båret/attuned Cloak of Protection: AC 16 + 2 + 1 = 19, med kappens +1 på saving throws. Samme oppsett med vanlig kappe eller uten nødvendig attunement gir ikke kappens magiske bonus. Dette er dokumenterte forventninger til videre arbeid, ikke implementert funksjon eller en ny kodebestilling.


## Referer til faktisk bruk av papirark og klassespesifikke ark (2026-10-19)

Brukeren ba om at videre utforming ser til dagens character sheets, merknadsfelt og klassespesifikke ark, med relevante kilder på nett. [PAPER_SHEET_REVIEW.md](PAPER_SHEET_REVIEW.md) dokumenterer konkrete undersøkte sider, observerte føringsmåter og kildebegrensninger. Funn om våpenverdier, merknader, båret utstyr versus lager, attunement og casterbehov inngår i videre produktvurdering. Trykte felt og linjer er ikke nye spillregler; gjeldende D&D 2014-regler, mobilavklaringer og manuell kontroll beholdes. Referansearbeidet fastsetter ikke endelig UI eller bestiller ny funksjonskode.

## Godkjent implementasjon: enkel Utstyr-fane (2026-10-19)

Brukeren godkjente alle tre foreslåtte produktvalg og bestilte koding: (1) Character, Combat og Utstyr som tre faner, (2) korrekte avgrensede AC-/våpenberegninger med relevante egenskaper og vanlige magiske bonuser, forklarte bidrag og mer sammensatte effekter som tekst frem til konkret støtte, (3) enkelt «I bruk», relevant én/to-håndsvalg og attunement, med advarsler og DM-unntak.

Diskusjonen om plassering er forenklet: ingen figur eller påkrevd oppdeling i kroppsdeler/plagg. Rustning føres normalt som et samlet sett med faste regelverdier. Brukeren kan frivillig føre enkeltplagg. Katalogvalg legger til direkte med regelverdier; egne navn/varianter og manuelle korrigeringer finnes ved behov. Implementasjon skal gjøre føringen enklere enn et spill med mange utstyrsmenyer. Karakteropprettelsen forblir uten utstyr. Se krav §11 og konkrete før-koding-scenarioer i matrisen. Ingen utvidelse til full regelmotor eller kampautomatisering.

## Tre designforslag bestilt, tema ikke valgt (2026-10-19)

Brukeren ønsker et tydeligere fantasy-/D&D-uttrykk og en samlet styling av appens UI-komponenter. Godkjent oppgave er tre sammenlignbare mobilskisser, komponenteksempler og dialog/meny, med samme karakter/innhold og eksisterende funksjonskrav som grunnlag. Lyst/mørkt er åpent; riktig følelse avgjør. Senere avklart tema velges av brukeren før implementasjon i appen. Ingen produksjonstema, ny menyplassering eller fullskjermstandard er vedtatt ennå. Den isolerte [designstudien](design/2026-10/README.md) dokumenterer forslag og vurderingsgrunnlag, uten å endre appen.

## Eventyrjournal valgt; komponentdetaljer diskuteres (2026-10-20)

Brukeren valgte Eventyrjournal og paletten som videre retning, med Stjernekartets runde ability-mynter. Forkortelsene skal følge myntbuen uniformt. Små overskriftsikoner, portrettpresentasjonen, meny nederst og bunnfaneikonene videreføres; manglende portrett trenger en pen placeholder. Klikkbare elementer trenger et subtilt, konsekvent skille fra ren informasjon. HP-forløpsindikatoren er ikke viktig å prioritere.

Modifiers uten ramme er positivt vurdert for luften de gir, men skal diskuteres. Individuelle ikoner på artsegenskaper, features/feats, våpen og spells/cantrips er heller ikke vedtatt: balansen mot informasjonsplass og krav til komplett dekning må avklares. Ingen delvis ikonfamilie skal behandles som en ferdig løsning for artsegenskaper. Brukeren ønsker å se alle elementfamiliene som rader i en samlet komponentstudie, også manglende spells/cantrips og utstyr. Samme form kan brukes på flere familier; unikhet er ikke et mål.

Se [krav §12](REQUIREMENTS.md#12-bestilt-designstudie-2026-10-19). Disse tilbakemeldingene oppdaterer designgrunnlaget; de bestiller ikke implementasjon i appen eller generering av et stort ikonsett. Tidligere bilder beholdes som historiske forslag, ikke som en oppdatert komponentstudie.

## Komponentplansjer bestilt etter valg av retning (2026-10-20)

Brukeren bestilte deretter «lag de plansjene som beskrevet». [Tre isolerte plansjer](design/2026-10/components/README.md) viser alle elementfamilier i Eventyrjournal med ability-mynter, sammenlignbare modifier-/ikonvarianter og relevante tilstander/klikkbarhet. Ikonene dekker bare prøveeksemplene; intet stort ikonsett eller produksjonstema er implementert. GP beholder handlingen for pengeføring, mens HP på Character og ability-myntene er status. Spell-/ressurseksempler bruker en separat Wizard, og feat-/langnavneksempler er merket som katalogalternativer. Dette forhindrer at visuell utprøving fremstilles som nye karakterregler eller tildelte egenskaper. Ramme-, ikon- og dialogdetaljer er fortsatt forslag til brukerens vurdering.

## Felles hjørnemarkør prøves for klikkbarhet (2026-10-20)

Brukeren påpekte at «svak innramming» var like tydelig som andre rammer, at luftige modifiers ikke forklarte byttefunksjonen, og at bakgrunnskontrast fikk doble betydninger (klikkbarhet og utstyrt). Etter diskusjon ba brukeren om å prøve en liten fylt trekant nederst til høyre, avgrenset av eksisterende kant og en 45° diagonal, som felles signal uten å endre rammer. Den [fjerde komponentplansjen](design/2026-10/8-hjornemarkor.png) prøver dette på alle viste trykkflater, også modifiers, +, navigasjon og handlingsknapper. Rene statusfelt/mynter har ingen markør. Modifiertrykk betyr å velge hvilken verdi favorittfeltet viser. Prøven viser dessuten status med hake/tekst uten egen fyllfarge som et fortsatt uavklart forslag. Ingen produksjonskode endres, og forsøket er ikke en endelig godkjenning av alle detaljene.

## Hjørnefarge og slider med retur til midten avklart (2026-10-20)

Brukeren godkjente trekantuttrykket og bekreftet samme farge på trekantfyll og ramme; på luftige modifierfelt brukes bunnlinjens farge. Plansjens lysere fyll er ikke endelig valgt farge. Omfang på selvforklarende navigasjon/knapper og øvrige åpne detaljvalg er ikke fastsatt særskilt.

Brukeren valgte en relativ HP-skyvekontroll med retur: dragets lengde styrer justeringen av beløpet; ved slipp beholdes beløpet og grepet går til midten; neste drag justerer videre fra det valgte beløpet. Alternativet med kontinuerlig endring mens man holder et utslag er ikke valgt. Hele kontrollen får tydelig innramming, med grepet innenfor. Tallet og forhåndsvisningen viser valgt endring, mens grepet viser pågående justering. Bekreftelse før oppdatering av karakterens HP beholdes.

Brukeren presiserte grenser: HP-resultatet stopper ved 0 ved skade og maks HP ved healing. Temporary HP håndteres først ved skade som tidligere vedtatt. Se [samlede krav](REQUIREMENTS.md#avklart-hjørnefarge-og-relativ-hp-slider-2026-10-20). Ingen appkode eller nye skisser er bestilt i denne diskusjonsrunden; dette lagrer avklaringene som prosjektminne.

## Kompakt identitet; toppfeltet scroller bort (2026-10-20)

Brukeren godkjente å fjerne appnavn og regelutgave fra toppfeltet og legge dem under «Om appen» i menyen. Identiteten beholder portrett/placeholder, navn, art, klasse, nivå og subclass. Toppfeltet følger vanlig innholdsscrolling og skal ikke bli stående fast øverst; arbeidsflaten prioriteres mens fast bunnavigasjon/Meny gir tilgang til navigasjon. Dette erstatter eventuell tidligere usikkerhet om fast toppfelt. Ingen ny appkode eller reviderte bilder er bestilt i denne avklaringen. Se [krav](REQUIREMENTS.md#avklart-kompakt-toppfelt-og-scrolling-2026-10-20).

## B2 med individuelle ikoner valgt (2026-10-20)

Brukeren foretrekker ikonvarianten B2 i plansje 06, med individuelle ikoner på artsegenskaper, features, feats, våpen, cantrips og spells. Detaljvalget B1/B2 er dermed avklart. Mengden ikoner godtas som del av videre designarbeid; små, konsistente og gjenkjennelige ikoner og komplett dekning av støttet innhold krever egen produksjon/kontroll. Egne/ukjente poster trenger reservemarkør. Lokale SVG-er er en egnet teknisk løsning for skarp og offline visning. Ingen appkode eller komplett ikonsett er bestilt eller implementert gjennom denne diskusjonen. Se [krav](REQUIREMENTS.md#individuelle-ikoner-valgt-2026-10-20).

## Implementasjon bestilt; kategoriikoner og reserve avklart (2026-10-20)

Brukeren ba uttrykkelig om å implementere valgt layout og avtalte endringer i en ny versjon. Brukerens kategoriinnspill presiserer B2: gjenbruk av kategoriikoner er ønsket, med passende familieikon og pen nøytral reserve når klassifisering ikke er mulig. Egne poster omfattes. Et ikonsett per semantisk kategori skal dekke alle støttede poster; unikt bilde per katalog-ID er ikke et krav. Lokale SVG-er og valgfri eksplisitt overstyring er tekniske valg. Ikonene tolker ikke regeltekst som spillmekanikk.

Gjeldende bestilling og implementasjonsvalg for dialoger/status står i [krav §12](REQUIREMENTS.md#bestilt-implementasjon-av-eventyrjournal-2026-10-20). Den luftige modifierutformingen brukes med felles hjørnemarkør, og store mobildialoger får fast tilgjengelig lukk/avbryt og bekreftelse. Det bygges ikke en omfattende regelmotor eller nye automatiske karaktervalg som del av temaet. Produktkontroll og gjenstående funksjonskrav dokumenteres separat i matrisen.

## Eventyrjournal implementert og produktkontrollert (2026-10-20)

Den bestilte layouten og de avklarte kontrollendringene er implementert. [EVENTYRJOURNAL.md](EVENTYRJOURNAL.md) beskriver faktisk betjening, kategori-/reserveikoner, valgfri ikonmetadata, lokale fonter, dialogtyper, bunnmeny, Combat-sveip og relativ HP-føring. Produksjonsvalg: større våpenoppslag i Combat, tom «Andre egenskaper»-tittel skjules, tom samling får kortere inline +, og Meny følger journalens rader. Dette gjør ikke tidligere uimplementerte regel-/katalogkrav ferdige. [Kravmatrisen](CHARACTER_WORKSPACE.md#eventyrjournal-faktisk-produktkontroll-og-leveranse-2026-10-20) skiller forventninger, faktisk mobilgjennomgang og testresultater. Ingen karakterdata erstattes med designstudienes eksempler.

## Flerverdiregistrering med veiviser er et overordnet prinsipp (2026-10-20)

Etter faktisk mobilreview ønsket brukeren en konseptuell opprydding før videre koding. Brukeren vedtok deretter veivisertankegangen som et generelt prinsipp alle steder hvor man skal legge inn flere verdier, fremfor bare å velge noe fra en liste. [Prinsippet i krav §1](REQUIREMENTS.md#overordnet-prinsipp-veiviser-ved-flerverdiregistrering) krever korte, forgrenede spørsmål, relevante ja/nei-grener, sikre forhåndsverdier og beslektede felt samlet. Direkte listevalg beholdes. Tilbake bevarer svar, Avbryt og samlet bekreftelse følger vanlig trygg føring. Veiviser er betjeningsmønster, ikke en automatisk karakterbygger eller rekonstruksjon av tidligere level-ups.

Brukeren godkjente arbeidsflytene for direkte katalogvåpen, «Tilpass» fra et eksisterende grunnvåpen, egne ekstraskadekomponenter og konteksttilpasset egenskaps-/featvelger. Betingelser registreres etter et spørsmål per ekstraskade, lagres som fritekst knyttet til akkurat den komponenten og vises sammen med den på våpenkortet. Kategori/skadetype velges fra liste. Dette erstatter tidligere idé om å bruke bare en generell våpenmerknad for slike betingelser.

[Samlede avklaringer og rapporterte feil i krav §13](REQUIREMENTS.md#13-konseptuell-opprydding-og-arbeidsflyter-2026-10-20) bevarer også brukerens krav om automatisk oppsett av spell slots fra klasse/nivå med manuell overstyring, mindre markør-/lagringsstøy og AC-forklaring bare under Utstyr. Nye flyter for spells/cantrips, Hit Dice, ressurser, proficiencies og immuniteter avklares fortsatt én om gangen. Forslag fra forklaringsrunden blir ikke automatisk vedtatte detaljer. HP ved 0 og utilsiktet zoom er rapporterte feil; de er ikke rettet eller verifisert av dokumentasjonen.

Dette vedtar produktprinsipp og beskrevne flyter. Appkode er ikke bestilt i denne gjennomgangen. Krav, designbrief, arbeidsinstruks, handoff og matrise oppdateres som varig prosjektminne; status er avklart, men ikke implementert. Dokumentkontroll: tekst-/beslutningskonsistens, lokale lenker/ankere og diff. Ingen ny brukerflyt eller nye spilltester inngår i dokumentasjonsendringen.

Nyere avklaringer fra den pågående én-og-én-gjennomgangen samles i [arbeidsnotatet](WORKFLOW_REVIEW.md), på én arbeidsbranch frem til samlet dokumentasjonsleveranse. Det skiller avklart produktretning fra uavklarte forslag og faktisk implementasjon.

## Prøveversjon av avklarte flyter bestilt (2026-10-20)

Brukeren svarte «Ja, gör det» på bestilling om å implementere de avklarte flytene, med proficiencies og immuniteter i en senere runde. WORKFLOW_REVIEW og ny før-koding-matrise er samlet grunnlag sammen med krav §13. Alle endringer samles på én branch og leveres gjennom én samlet PR; ingen PR eller merge per kommentar. Eldre «ingen appkode bestilt» beskriver nå historiske avklaringsrunder. Forenklet Hit Dice-føring erstatter per-terning-veiviseren. Tallhjul brukes som felles tallvelger med direkte innskriving; det valgte HP-deltaet beholdes frem til bekreftelse. Ingen nye regler tolkes fra fritekst.


## Avklarte arbeidsflyter implementert som én prøveversjon (2026-10-20)

Fire ikonfaner og Meny er valgt; Magi eier spelladministrasjonen, Combat viser relevante oppslag fra samme data. Kontekst følger klasse, faktisk klassenivå/subclass og eksplisitt tilgang fra art/registrert egenskap, med generelle gyldige valg og manuell overstyring. Wizard-skolen begrenser ikke hele klasselisten. Forberedelse følger Wizard-bok versus klasseliste; gratis alltid-forberedte spells teller ikke, overskridelse gir et DM-varsel. Ingen tvungen forberedelse for cantrips/known-klasser.

Slots og Hit Dice opprettes fra kjente 2014-tabeller; Pact Magic holdes separat. Gamle manuelle beholdninger er autoritative. Genererte beholdninger har en stabil identitet og lagret standardmaks, slik at nivåendring bevarer brukt antall og manuell maks. Å åpne appen er en leseprojeksjon, ingen skjult karakterlagring eller audit-hendelse; neste reelle endring lagrer oppsettet sammen med føringen. Undo leser bekreftet lagringssnapshot, også når visningen har nye standarder. Navn som spilleren har tilpasset beholdes.

Hit Dice-forslaget med obligatorisk terningkast og automatisk CON-healing er **forkastet**. Vis antall og la spilleren føre HP separat/samlet delta. Lang hvile har konkret preview, relevant automatikk og ett samlet Angre. Betinget gjenoppretting krever eksplisitt valg; manuelle og særregel-beholdninger/tidsgrenser behandles ikke automatisk. Samlet kort-hvileomlegging er utsatt.

Tallhjul erstatter slideren i prøveversjonen: vertikal, begrenset tallrekke, midtstilt valg og direkte tastaturinnskriving. HP-delta står til bekreftelse. Veivisere bruker bevarte skjemanoder, relevante grener, Tilbake og atomisk bekreftelse. Direkte katalogvalg har fortsatt ingen mellomdialog. Tilpass ved katalogvåpen gir egen variant, med separate ekstraskader og tekstbetingelse per komponent. Nytt utstyr føres som eid; I bruk velges eksplisitt. Flere detaljer og gamle manuelle overstyringer bevares uten å tvinge dem inn i normal registrering.

Tekniske valg: små UI-moduler, gjenbruk av dialog/IndexedDB/validering, additiv schema2/DB3, ingen ny runtime-avhengighet. Lokale metadata fra samme pinnede SRD5.1-revisjon kan gjenskapes med import-context.mjs; ingen runtime-nettverk eller generell tolkning av regeltekst. Automatikk er avgrenset til sikre data; tredjedels-castere, andre boksubclasses og ukjente effekter føres manuelt/med eksplisitt tilgang. Detaljer og observerte grenser står i GUIDED_WORKFLOWS og matrisen.

Brukerens senere rapport om manglende oppdateringsmelding tas med: åpen, synlig app sjekker også hvert minutt, i tillegg til retur/fokus/online og menyens manuelle sjekk. Ny versjon installeres fortsatt bare etter eksplisitt klikk. Ulagrede skjemaer og andre åpne faner beskyttes; ingen lagringsdata slettes. Server/Pages-status og todelt service-worker-test kontrolleres før levering.
