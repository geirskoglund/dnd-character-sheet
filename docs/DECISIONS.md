# Beslutningslogg – D&D Character Companion

**Oppdatert:** 2026-10-18  
**Status:** Gjeldende produktbeslutninger og åpne spørsmål før neste funksjonsprototype. **Ikke endelig Codex-spesifikasjon.**  
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
- Statusfelt høyt på Character: HP, AC, initiative og GP; **Temporary HP har egen kompakt pille ved HP**. GP med to desimaler, internt heltall kobbermynter.
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
- Skill lisensiert SRD 5.1-regeldata fra proprietært innhold og brukerregistrerte karakterdata.
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
9. **Innholdsdekning:** Hvilke 2014-/Eberron-opsjoner trengs i første virkelige versjon, kontra manuell registrering?

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
