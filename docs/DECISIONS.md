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
- Strukturert effect-modell bør kunne representere betingelser som skade-/våpentype, heavy armor og ikke-magiske angrep, uten særkode for hver feat.
- Regn i korrekt 2014-rekkefølge og med korrekt avrunding, også når flere effekter virker sammen. Passive effekter fra feats, class features og utstyr behandles konsistent.
- Temporary HP absorberer før vanlig HP; vis begge nye verdier. **Én Angre skal reversere hele skadehendelsen.**
- Vis **etterprøvbar beregningslogg** og kort «til DM»-oppsummering: innkommende, anvendte modifikatorer og grunn, absorbert av temp HP, tap av vanlig HP, ny HP. Ikke beskriv AC som skadeabsorpsjon.
- **Uncanny Dodge** vises som Reaction/oppslag, men ligger ikke som obligatorisk automatisk skadereduksjon i kalkulatoren.
- HP-pillens primærtrykk er vanlig HP-justering. «Ta skade» som sekundær snarvei i HP-popup er **ikke påkrevd**.
- Spesialtilfeller (f.eks. sammensatt skade i flere damage types, saving-throw-effekter, flere betingelser) er til videre avklaring – ikke legg inn som kompleks standardflyt.

## 5. Karakterdata, ressurser og utstyr – besluttet

- Modellér **verdier**, **ressurser** (antall/maks, short/long rest, eventuelle særregler), **handlinger/egenskaper**, **aktive tilstander/effekter** og **notater** med tydelige koblinger der det er relevant. Egendefinerte poster skal fungere uten forhåndsprogrammerte regler.
- Ressurser skal omfatte HP, Temporary HP, Hit Dice, Death Saves, Inspiration, spell slots/Pact Magic, klasse- og item-ressurser; conditions og exhaustion må kunne registreres.
- HP-popup: slider sentrert på null for skade/healing, ±1, forhåndsvisning, bekreft og angre. Temp HP separeres synlig; skade tar temp HP først; healing bare vanlig HP. Temp HP stables normalt ikke.
- **Spell-slot-piller:** Trykk på nivåets pille åpner *kun dette nivået* med ±1 og tilgjengelig/maks. **Hvile** åpnes via kompakt pille/verktøy, ikke permanent stort panel.
- Spell-data må skille cantrip, spell level, known/spellbook/prepared, slots, Pact Magic, concentration, ritual, casting time, range, duration, components, saving throw/attack, damage, upcasting; registrering manuell når nødvendig.
- Utstyr skiller **eid** fra **utstyrt**, weapons fra armor, equipped først. Utstyr kan endre AC, våpenkast, Combat-alternativer og betingede effekter; advar ved konflikt, **blokker aldri** DM-godkjente valg. Støtt dual wielding og tohåndsvåpen.
- Class Features & Feats vises **før utstyr**. Feats skal kunne opprettes/redigeres manuelt og eventuelt knyttes til ressurs/handling/betinget effekt.
- Levende tilstander som Rage, Concentration og Mage Armor må etter hvert knyttes til tilhørende feature/spell, men konkret interaksjonsdesign er åpent.
- **Level Up** finnes under «Denne karakteren» i innstillingsmenyen, ikke under generell administrasjon og ikke som stort Progression-panel.
- Arcane Recovery krever vurdering av spilledag/short rest; ikke anta kalenderdato fra virkeligheten.

## 6. Teknologi og videre prosess – besluttet

- Hosting: **GitHub Pages**. Lokal database: **IndexedDB**, ingen backend/brukerkonto. Lokal persistens synkroniseres ikke mellom enheter.
- Eksport/import **JSON** som backup (inkludert evt. portrett), robust håndtering av data og migrering; offline PWA med cache/service worker når implementasjonen modnes.
- Prototype-HTML er **funksjonell referanse, ikke produksjonskode**. Kravspesifikasjon og designbrief skrives **etter** at prototypen er testet/avklart; deretter Codex-implementasjon med tester.
- Skill lisensiert SRD 5.1-regeldata fra proprietært innhold og brukerregistrerte karakterdata.
- Talebasert oppslag på skill/modifier var diskutert som valgfri fremtidig funksjon, **ikke nødvendig for MVP**. Ingen talemutasjoner.

## 7. Åpne spørsmål – avklares én etter én

1. **Sammensatt skade:** Flere skadeposter med forskjellige skadetyper i én skadehendelse – skal v0.11 støtte det?
2. **Betingelser for passive skadeeffekter:** Hvilke opplysninger skal spilleren oppgi eller bekrefte når effekten avhenger av f.eks. ikke-magisk angrep/heavy armor?
3. **Hit Dice og hvile:** Hvordan registrere antall brukte terninger og HP-healing uten å simulere terningkast?
4. **Spellcasting-varianter:** Hvordan holde prepared/known/spellbook og Warlock Pact Magic tydelig og praktisk?
5. **Aktive effekter:** Hvordan kombinere av/på-status og begrenset ressurs for Rage, Concentration, Mage Armor osv.?
6. **Undo:** Bekrefte transaksjonsbasert angre for sammensatte endringer, og hvor langt tilbake man skal kunne gå.
7. **Backup-sikkerhet:** Hvordan gjøre lokal lagring forståelig og sikkerhetskopiering enkel uten mas.
8. **Systematisk funksjonstest:** Death Saves, Hit Dice, Inspiration, Conditions, feats, modifiers, spells og rustning/våpen på ulike klasser.
9. **Innholdsdekning:** Hvilke 2014-/Eberron-opsjoner trengs i første virkelige versjon, kontra manuell registrering?

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
