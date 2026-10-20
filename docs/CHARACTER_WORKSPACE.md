# Character-arbeidsflate: krav, kilde og leveransestatus

Arbeidsgrunnlag: REQUIREMENTS §§1–10, DATA_MODEL, DESIGN, gjeldende DECISIONS, CODEX_HANDOFF, brukerens forklaringsdokument og `prototypes/dnd-character-companion-v0.11.html`. Nyeste brukeravklaringer har forrang. Dette er leveransestatus, ikke en erstatning for kravene. **Nyeste utstyrsleveranse er beskrevet nederst; historiske PR #8-resultater er beholdt som historikk.**

## Overordnet mål: erstatte papirkarakterarket

[Produktmålet i krav §1](REQUIREMENTS.md#1-produkt-og-akseptansekriterier) er øverste føring: rask oversikt, oppslag, notater og manuell føring ved et fysisk D&D-bord. Spilleren beholder kontrollen over karakterdata og DM-godkjente unntak. Hver berørt user story og produktgjennomgang skal konkretisere hvordan flyten hjelper spilleren med dette. Kontekstprinsippet nedenfor skal gjøre det digitale arket enklere å bruke. [Papirarkgjennomgangen](PAPER_SHEET_REVIEW.md) dokumenterer undersøkte eksempler, observerte føringsmåter og kildebegrensninger.

## Gjennomgående prinsipp: karakterens kontekst

[Produktprinsippet i krav §1](REQUIREMENTS.md#overordnet-prinsipp-karakterens-kontekst) gjelder hele appen og skal konkretiseres i hver berørt user story. Prinsippet styrer hvilke valg, verdier og oppslag som er relevante i flyten. Generelle valg, tilgang fra ulike kilder, ukjente vilkår og manuelle DM-unntak skal ivaretas. Spesifikke regler vurderes per område; egenskaps-/featvelgeren er ett av flere bruksområder.

| Område | Prinsippet skal undersøkes gjennom | Faktisk status / kontrollbehov |
| --- | --- | --- |
| Papirark og klassespesifikke referanser | Hva som føres direkte, merknader, ferdige spillverdier, utstyr som bæres/lager og klasseavhengige spell-/ressursbehov | To PDF-eksempler er undersøkt på angitte sider og 2014-prosjektdokumentasjon er lest; se PAPER_SHEET_REVIEW.md. Funnene er referansegrunnlag, ikke testet appfunksjon |
| Lett registrering på tvers av samlinger | Antall steg, synlige felt og nødvendig utfylling; sikre katalog-/kontekstdata, minimumsregistrering og tilgang til detaljer/manuelle overstyringer | Brukeren rapporterer tungvinte registreringsflyter. En samlet gjennomgang av feltmengde og konkrete forenklinger er ikke gjennomført; løsning vurderes per flyt |
| Egenskaper og feats | Klasse/subclass/klassenivå, art og faktiske forutsetninger; generelle feats bevares | Kjente avvik i listen og klassefilteret står nedenfor; rettelsen er ikke implementert |
| Cantrips og spells | Tilgang fra klasse, subclass, art, feats og DM; formål som registrering, læring, prepared og kampoppslag; relevante nivåer og multiclass | Manuell registrering og enkelte oppslag finnes. Full kontekstrelevans på tvers av kilder er ikke verifisert og må få egne scenarioer |
| Utstyr og proficiencies | Skill mellom eid, utstyrt og brukt; manglende proficiency stopper ikke eierskap; konsekvenser ved bruk vurderes etter faktisk regel | Enkel AC/speed og utstyrskategorier er testet i tidligere leveranse. Dette er ikke bevis for hele prinsippet i alle utstyrsflyter |
| Ressurser og Combat-oppslag | Karakterens faktiske innhold, riktig kilde/klasse/system, registrert tilstand og relevante hvilevilkår | Enkelte flyter er testet tidligere; samlet dekning mot prinsippet må dokumenteres per berørt flyt |

Dette er en oversikt over hvor prinsippet skal brukes, ikke en uttømmende liste over funksjoner eller en erklæring om verifisert støtte. Den konkrete akseptansen føres i scenarioformatet nedenfor.

## Levert Character-versjon (PR #8)

| Krav / avklaring | Konkret løsning | Verifikasjon |
| --- | --- | --- |
| Tette, uniforme samlinger, inline + | Fire kolonner ved 360/390 px, tre ved 320 px; like celler innen samlingen, samme form/ramme for + | Mobilgeometri og lesbare eksempelnavn i nettlesertester |
| Artsegenskaper | Katalogoppslag med én Lukk; egne artsegenskaper legges til/redigeres som feature-instanser | Oppslag, egenregistrering, lagring |
| Class Features & Feats før utstyr | Søkbar SRD-velger og egenregistrering; redigering/fjerning fra egen pille. **Delvis:** standardlisten tar ennå ikke hensyn til karakterens klasse, subclass, klassenivå eller forutsetninger | Feat-CRUD, betinget effekt, handling/ressurs og angre testet. Kontekstrelevans og forutsetninger er ikke verifisert; se åpne avvik nedenfor |
| Weapons / Armor og skjold / Annet utstyr | Egne grupper og individuelle utstyrsposter, equipped først, filtrert direktevalg og eget utstyr. **Delvis:** karakterens våpenangrep/skadebonuser beregnes ikke | Kategorier, AC/speed og grupper testet tidligere. Karaktertilpasset våpenoppslag og tydelig visning av utstyrsverdier gjenstår |
| Languages | Separate navngitte instanser; artens basisvalg materialiseres ved første språkendring | Redigering/fjerning/backup; ingen duplisering |
| Proficiencies | Skill/save med proficiency/expertise og totaloverride; weapon/armor/tool/other som egne objekter | Beregnede favoritter/saves, persistering |
| Skadeegenskaper / tilstandsimmunitet | Separate objekter og redigeringsflater; resistance og vulnerability kan sameksistere; vilkår true/false/unknown | CRUD og backup; ingen automatisk skadereduksjon ennå |
| Spells / cantrips | Lokal søkbar 2014-katalog, egenregistrering, felles skjema; known/book/prepared, casting-felter og upcasting-tekst | Katalog/egen spell, persistering/offline |
| Spell slots / Pact Magic | Separate navngitte pools per nivå/system/klasse; trykk åpner kun den ene poolen med ±1 | Adskilte pools og hvilevilkår |
| Hit Dice / hvile | Én fysisk terning av gangen, CON modifier, HP cap, samlet audit/angre; manuell tildeling av gjenopprettede terninger | Domene- og nettlesertester |
| Andre ressurser | Custom pools med nåværende/maks og short/long/manual/særregel, egen handling kan referere pool | Persistering/angre og resource-referanser |
| Inspiration / death saves / conditions / exhaustion | Kompakte piller og direkte redigering | Manuell endring og persistering |
| Portrett | Lokal opplasting/skalering, bytt/fjern, atomisk asset+karakter, eksport/import | Validering, kopi/undo og backup |
| Meny / creation / Level Up / HP | Beholder siste godkjente plassering og minimale creation; manuelt maks HP | Eksisterende regresjonssuite |
| Samtalens avklaringer bevares | REQUIREMENTS og DECISIONS oppdatert sammen; matrisen angir hva som faktisk finnes | Dokumentgjennomgang før PR |

Verifikasjonskolonnen beskriver kontrollene. Faktiske kjøreresultater og mobilgjennomgang står under «Verifisert ved levering av PR #8».

## Fortsatt delvis eller gjenstående – beholdes som produktkrav

- **Relevante egenskaps-/featvalg:** Standardlisten er for lang og viser valg som ikke gjelder karakteren. Eksisterende manuelt klassefilter gir ikke automatisk relevans etter subclass, klassenivå, art eller andre faktiske forutsetninger. Generelle feats må beholdes også ved klassefilter; dagens manuelle klassefilter utelater poster uten klasseliste. Dette er åpne produktavvik, selv om opprettelse og lagring fungerer. Se scenarioene nedenfor.

- **Konkrete utstyrsoppslag og samlet oppsett:** Rettet i utstyrsleveransen nedenfor: egen fane, karakterberegnede angrep/skade, tydelig AC, håndbruk, faste bonuser og attunement. Brukerens senere forenkling erstatter et påkrevd kroppsrutenett med samlet rustning og frivillige enkeltgjenstander. Avanserte/situasjonelle effekter forblir tekst/manuelle verdier etter godkjent avgrensning.
- **Combat:** Våpen i bruk, standard off-hand for to lette våpen, manuelle handlinger og tilgjengelige spells vises nå. Standardhandlingene Unarmed Strike/Grapple/Shove og komplett sammenstilling av katalogregler gjenstår. Ingen turstyrer innføres.
- **Ta skade:** Den eksisterende HP-justeringen med temp HP først er beholdt. Sammensatt skade, individuelt valgbare passive effekter, bekreftelse ved ukjente vilkår, flat reduksjon, korrekt resistance/vulnerability-rekkefølge og forklaring til DM gjenstår. Lagrede skadeegenskaper/effekter brukes ikke i denne HP-justeringen.
- **SRD:** Lokal karakterkatalog omfatter 319 spells/cantrips, 407 klasseegenskapsoppføringer, én SRD-feat og 237 vanlige utstyrsoppføringer og to kuraterte protection-gjenstander, i tillegg til eksisterende species/klassegrunnlag. Dette er ikke et komplett SRD-regelbibliotek: øvrige regelkapitler, monster- og magic-item-bibliotek og full trait-/subrace-dekning gjenstår. Ingen automatisk regelkonvertering fra prosatekst.
- **Koblinger:** Feature-editoren støtter egen handling, ressurs, skadeeffekt og eksisterende ressurser. Vilkårlig mange avanserte koblinger/aktive tilstander fra import bevares, men alle har ennå ikke egne fullstendige redigeringsflater. Utstyrsavhengige avanserte effekter gjenstår.
- **Hvile:** Registrert short/long-rest-recharge følger ressursen. Særregler (inkludert Arcane Recovery/spilledag), exhaustion/conditions og death-save-reset vurderes manuelt med DM. Ingen automatisk spilledagskalender.
- **Design:** Denne rettelsen harmoniserer eksisterende arbeidsflate med prototype og seneste avklaringer. Den erstatter ikke det senere avklarte valget mellom 2–3 designretninger.

## Teknikk og databevaring

Samme schemaVersion 2 / IndexedDB v3: ingen omskriving av eksisterende karakterer er nødvendig. Nye brukerflyter bruker allerede definerte, strukturerte felt. Katalogvalg lagres som uavhengige UUID-instanser med katalogreferanse; katalogen endres aldri av karakterredigering. Bekreftede operasjoner går gjennom samme revisjonskontrollerte repository og atomiske endringslogg. Portrett lagres atomisk med karakteren; gamle immutable assets beholdes for kopi og angre.

SRD-data er bygget inn i egne statiske chunks og precaches av PWA-en. Ingen API-avhengighet under spill. `scripts/import-srd.mjs` er et valgfritt vedlikeholdsverktøy med fast kilderevisjon; installasjon/bygg trenger det ikke. Se `public/SRD-LICENSE.txt` for attribusjon og kilde.

## Verifisert ved levering av PR #8

`CI=1 CHROMIUM_PATH=/usr/bin/chromium npm run check` passerer: **60 domene-/lagringstester, TypeScript-kontroll, produksjonsbygg og 34 Playwright-tester**. Ingen hoppede tester. `git diff --check` er også kontrollert.

Nettlesertestene kjører produksjonsbygget på Pages-understien `/dnd-character-sheet/` og dekker:

- normalt fire piller per mobilrad, tre ved 320 px, like cellemål/form og inline +; features før de tre utstyrsgruppene;
- opprettelse/redigering/fjerning/angre av samlinger, meningsfull proficiency/expertise-/save-beregning, separate defenses/immunities og redigerbare språk fra art;
- egne feats med handling, begrenset ressurs og betinget effekt, atomisk sletting/angre og bevart utkast ved avbrutt sletting;
- faktisk offline SRD-søk/valg og egen spell, prepared/spellbook/known, Combat-oppslag med én Lukk, separate spell-slot/Pact Magic-pools;
- ett fysisk Hit Die-kast med preview og én bekreftelse, samlet HP/terning-undo, short/long rest og uendrede særregler;
- Inspiration/death saves/conditions/exhaustion, portrettopplasting, full UI-backup/import og uavhengig kopi;
- feil ved lagring uten tapt utkast/duplikater, fokus/scroll etter dialoger, uendrede lagringer uten nye hendelser, migrering og oppdatering av cachet PWA.

En fylt prøvekarakter (Elf, Fighter 3 / Wizard 2) er også åpnet i Chromium ved 390/320 px, med utstyr, feats, spells, pools, språk, proficiencies og notater. Visuelt kontrollert utstyrsgrupper, fulle navn, inline +, Hit Die-dialog med én primær bekreftelse og Reaction-oppslag. Ved 320 px og 200 % skrift reduseres antall kolonner automatisk; ingen horisontal overflyt eller nettleserfeil ble observert. Dette er ingen full WCAG-revisjon eller påstand om full Combat-/SRD-paritet.

Bilder fra denne implementasjonen:

- [Character, 390 px](images/workspace-character-390.png)
- [Character, 320 px](images/workspace-character-320.png)
- [Combat med registrert Reaction-spell, 390 px](images/workspace-combat-390.png)

Ved oppdatering: Meny → Se etter oppdatering → Oppdater appen når den nye versjonen er klar. Lukk andre appfaner ved behov; karakterdata skal beholdes. Ikke slett nettleserdata for å oppdatere.

## Produktkontroll før levering og merge (vedtatt 2026-10-19)

De fire kravene i [arbeidsinstruksen](../AGENTS.md#obligatorisk-produktkontroll-før-levering-og-merge) gjelder alle senere funksjons- og UX-endringer. Den tekniske oversikten og de 94 tidligere beståtte testene ovenfor beskriver den leverte revisjonen. De dokumenterer ikke at den nye produktkontrollen er gjennomført, eller at alle spillmessige forventninger er dekket.

| Krav til arbeidet | Skal dokumenteres per berørt flyt | Når kravet er oppfylt |
| --- | --- | --- |
| 1. Forventet spilleropplevelse før koding | Kilde/avklaring, konkret karakter og tilstand, spillerens mål og forventet resultat, inkludert relevant D&D 2014-grunnlag | Forventningen er formulert før implementasjon og sammenholdt med spesifikasjon, beslutninger og prototype |
| 2. Testscenarier fra forventningene | Relevante/irrelevante valg, relevante grenser og unntak; testreferanse, faktisk kjøring og resultat | Testene prøver forventningene og kan fange feil i berørt spillatferd; utestede forhold er eksplisitt merket |
| 3. Egen produktgjennomgang | Faktisk mobilflyt med konkret karakter, viste valg, plassbruk, mellomtrykk, knappeformål, forskjeller fra referansen og begrunnelse | Codex har prøvd og vurdert hele den berørte spillerflyten, dokumentert resultatene og håndtert avvik |
| 4. Betingelse for merge | Samlet status, kontrollbevis, gjenværende krav og eventuelle tidligere godkjente avgrensninger i matrise og PR | Teknisk kontroll og produktkontroll er tilfredsstilt for endringens omfang. Uløste avvik i berørt flyt er rettet eller uttrykkelig avgrenset av brukeren |

### Format for neste funksjonsendring

Fyll inn én rad per scenario før koding; oppdater med faktisk resultat ved kontroll. Tomme felter og planlagte tester regnes som ikke verifisert.

| Flyt / scenario | Kilde og karaktertilstand | Forventet spilleropplevelse | Testreferanse og kjøreresultat | Mobilgjennomgang / forskjell fra referanse | Status / gjenværende avvik |
| --- | --- | --- | --- | --- | --- |
| Fyll inn berørt flyt | Krav/avklaring/regelkilde; klasse, subclass, klassenivå og øvrig relevant tilstand | Konkret forventet resultat ut fra flytens formål og karakterkontekst, med generelle valg, tilgangskilder og unntak der relevant | Faktisk test og resultat, eller «ikke kjørt» | Faktisk observasjon og begrunnelse, eller «ikke gjennomført» | Verifisert / delvis / åpent avvik / avklart utenfor omfang |

### Kjente mangler som den nye kontrollen må fange

Dette er opprinnelige akseptansescenarier for videre arbeid med egenskaps-/featvelgeren og konkrete utstyrsoppslag. Status for utstyr er senere oppdatert i leveranseseksjonen nederst; feat-avvikene er fortsatt åpne. De er ikke nye kjørte tester eller en bestilling på funksjonskode i denne dokumentasjonsendringen. Detaljert regelgrunnlag og testreferanser må fylles inn før en implementasjon.

| Flyt / scenario | Kilde og karaktertilstand | Forventet spilleropplevelse | Testreferanse og kjøreresultat | Mobilgjennomgang / forskjell fra referanse | Status / gjenværende avvik |
| --- | --- | --- | --- | --- | --- |
| Klasseegenskaper i standardlisten | Brukerreview 2026-10-19; Fighter level 3 med valgt subclass | Standardlisten bruker karakterens klasse, subclass og klassenivå til å vise relevante egenskaper | Ingen relevanstest kjørt; tidligere CRUD-test dekker ikke dette | Brukeren rapporterte en lang liste med ugyldige valg. Kodegjennomgang bekrefter at listen starter med alle klasser | **Åpent avvik:** automatisk kontekstfiltrering mangler |
| Generelle feats beholdes | Brukerpresisering 2026-10-19; klassenøytral feat med eventuelle øvrige krav oppfylt, prøvd med ulike klasser | Generelle feats blir værende ved klassefilter. Bare faktiske forutsetninger begrenser; uavklarte krav merkes og valget beholdes tilgjengelig | Ikke testet for dette kriteriet; må inngå i rettelsen sammen med begrensede feats | Kodegjennomgang viser at manuelt klassefilter utelater katalogposter med tom klasseliste | **Åpent avvik:** generelle feats kan forsvinne ved klassefilter |
| Multiclass og nivågrenser | Samme review; Fighter 3 / Wizard 2, samlet level 5 | Hver klasseegenskap vurderes mot nivået i sin aktuelle klasse; endring over en nivågrense prøves særskilt | Ikke implementert eller testet for relevans | Ikke gjennomført med dette akseptansekriteriet | **Ikke verifisert:** inngår i videre rettelse av velgeren |
| Feats og øvrige forutsetninger | Samme review; konkrete feats med faktiske krav til eksempelvis ability scores, proficiencies eller art | Vis relevante valg ut fra de faktiske kravene. Uavklarte krav synliggjøres; manuelle valg og DM-unntak bevares | Ingen test av forutsetninger kjørt. Regler, grensetilfeller og nøyaktig unntaksflyt må beskrives før koding | Ikke gjennomført med dette akseptansekriteriet | **Åpent avvik:** forutsetninger vurderes ikke av dagens velger |
| Våpenets verdier for karakteren | Brukerreview 2026-10-19; Fighter med STR 16, proficiency bonus +2 og proficiency med longsword, én hånd og ingen andre bonuser; krav §3 / SRD 5.1 angreps- og skaderuller | Ved trykk på eget longsword: angrepskast d20 +5, skade 1d8 +3 slashing, med forståelig grunnlag og mulighet for manuell korrigering | Ingen test av beregnet våpenangrep/skade kjørt; implementasjonen har manuelle attack/damage-felt | Kodegjennomgang bekrefter grunnskade for nye katalogvåpen, men ingen karakterberegning; feltene ligger under lukket «Utstyrsverdier» | **Åpent avvik:** våpenets karaktertilpassede verdier mangler |
| Rustningsprofil og karakterens AC | Samme review; Fighter med DEX 16, Leather utstyrt, uten skjold eller andre AC-bonuser; krav §2–3 | Oppslaget forklarer Leather 11 + DEX 3 = AC 14; relevant Dexterity-regel og manuelle endringer er forståelige | AC-beregning testet i tidligere leveranse; brukervennlig visning av grunnlaget er ikke verifisert med dette kriteriet | AC/speed beregnes; editorens AC-profil ligger under «Utstyrsverdier» | **Delvis:** beregningen finnes, konkret oppslags-UX må gjennomgås |
| Rask tillegging og egenregistrering | Brukerreview 2026-10-19; legg til en katalogpost og en egen post i berørte samlinger, eksempelvis en spell | Føringen krever få relevante valg og lite utfylling, med kjente verdier tilgjengelige og enkel tilgang til detaljer/overstyringer. Konkret minimumssett av felt bestemmes ved gjennomgangen | Ingen ny felttellings-/brukerflyttest kjørt. Eksisterende direkte katalogvalg dokumenterer ikke enkelheten i alle registreringsskjemaer | Brukeren rapporterer mange felt og tungvint tillegging; samlet gjennomgang av formene og forenklingsforslag gjenstår | **Åpent UX-behov:** konkret løsning ikke besluttet |
| Kombinert rustning, skjold og kappe | Brukeravklaring 2026-10-19; Chain Mail og Shield utstyrt, Cloak of Protection båret og attuned, ingen andre bonuser | AC 16 + 2 + 1 = 19, med tydelig kildegrunnlag og kappens +1 på saving throws. Med vanlig kappe eller uten nødvendig attunement gir kappen ingen magisk bonus; DM-overstyring tilgjengelig | Ikke implementert eller testet som samlet scenario | Ingen ny mobilgjennomgang; dagens løsning dekker rustning/skjold, men ikke full kombinasjon med øvrige gjenstander | **Sentralt åpent krav:** samlet utstyrsoppsett med vilkår og enkel føring |

### Denne dokumentasjonsendringen

Arbeidsinstruks, matrise, kravspesifikasjon og beslutningslogg beskriver den vedtatte leveringskontrollen og det gjennomgående prinsippet om karakterens kontekst. Ingen brukerflyt eller funksjonskode endres. Kontroll for denne endringen: tekst, konsistens, relative lenker og `git diff --check`. Nye spilltester og mobilgjennomgang er ikke kjørt for dokumentasjonsendringen; eksisterende testresultater ovenfor beholdes som historikk fra PR #8.

## Utstyr-leveranse: forventninger fastsatt før koding (2026-10-19)

Kilder: godkjent brukerbestilling, REQUIREMENTS §§1–3 og 11, DECISIONS siste avklaring, SRD 5.1 (2014) Equipment/Combat/Classes/Magic Items, samt faktisk prototype (grupper, equipped, Combat-oppslag) og PAPER_SHEET_REVIEW. Nyeste tre-fanevalg erstatter prototypens to faner; ingen kroppsrutenett. Følgende kontroller er planlagt, ikke kjørt.

| Flyt / scenario | Kilde og karaktertilstand | Forventet spilleropplevelse | Testreferanse og kjøreresultat | Mobilgjennomgang / forskjell fra referanse | Status / gjenværende avvik |
| --- | --- | --- | --- | --- | --- |
| Navigasjon og enkel føring | Fighter 3; nytt og eksisterende ark | Tre faner med separat scroll; Character uten utstyrsadministrasjon; + åpner filtrert søk direkte; valg lagrer én gang; egne detaljer frivillige | Planlagt nettlesertest; ikke kjørt | Planlagt 320/390 px og stor skrift; forskjell: godkjent egen fane | Før koding |
| Longsword og håndbruk | Fighter 3, STR16 DEX12, PB2 | d20+5, 1d8+3 slashing; to hender 1d10+3; skjoldkonflikt varsles uten blokkering; viser samme i Combat | Planlagt domene/UI-test; ikke kjørt | Planlagt oppslag og redigering uten mellomdialog | Før koding |
| Finesse, ranged, thrown og proficiency | Rogue DEX16 STR10; Wizard uten martial proficiency; Fighter3/Wizard2 PB3 | Finesse bruker beste STR/DEX; ranged DEX; thrown melee bruker melee-ability; proficiency bare på angrep; egne valg og manglende proficiency hindrer ikke eierskap | Planlagt domene/UI-test; ikke kjørt | Alle katalogvåpen kan registreres; relevant konsekvens forklares | Før koding |
| Rustningens faste verdier | DEX16: Leather, Half Plate, Chain Mail; DEX6 negativ modifier | AC14 /17 /16; medium negative DEX beholdes; viser rustning, DEX og skjold separat; manuell AC merkes | Planlagt domene/UI-test; ikke kjørt | AC-grunnlag synlig uten å redigere profil | Før koding |
| Magiske bonuser og attunement | Chain Mail, Shield, Cloak of Protection i bruk og attuned | AC19, alle saves +1; uten attunement/bruk eller med vanlig kappe ingen kappebonus; antall multipliserer ikke bonus; mer enn tre attuned og håndkonflikter varsles | Planlagt domene/UI-test; ikke kjørt | Kun relevant attunement-kontroll, detaljer ved behov | Før koding |
| Egenskaper og situasjonsregler | Registrerte Fighting Styles og Monk; betingede effekter | Støttede faste regler med vilkår beregnes; andre beskrives som tekst, uten å bli gjort permanente ved antakelse | Planlagt domene-test; ikke kjørt | Forklar hva som regnes med og vis øvrige merknader | Før koding |
| Eksisterende data og DM-unntak | Eldre katalogvåpen uten skade, egne attack/damage-tekster, ny profil/bonuser | Sikre kataloggrunnlag brukes som fallback uten omskriving; manuelle totaler bevares; lagre/undo/kopi/backup/offline bevarer nye data og isolasjon | Planlagt lagring/import/UI-test; ikke kjørt | Avbryt og lagringsfeil skal bevare utkast; ingen tvungen migreringsveiviser | Før koding |

Utenfor denne bestillingen: feat-/spellrelevansrettelse, komplett SRD/magic-item-bibliotek, sammensatt skadekalkulator og standardhandlingene Grapple/Shove. De tidligere dokumenterte kravene beholdes. Off-hand-oppslag fra relevante våpen inngår uten tursporing.

## Utstyr: faktisk produktgjennomgang og leveransestatus (2026-10-19)

De syv forventningene i før-koding-tabellen ovenfor er gjennomført. Kilde- og beregningsgrenser står i [EQUIPMENT.md](EQUIPMENT.md). Det er ikke implementert en generell regelmotor. Produktkontrollen nedenfor er separat fra de tekniske testresultatene.

| Flyt / scenario | Kilde og karaktertilstand | Forventet spilleropplevelse | Testreferanse og kjøreresultat | Mobilgjennomgang / forskjell fra referanse | Status / gjenværende avvik |
| --- | --- | --- | --- | --- | --- |
| Tre faner, direktevalg og enkel egenregistrering | Godkjent §11; Fighter 3/Champion/Elf | Character uten utstyrsadministrasjon; egne scrollposisjoner; + direkte til gruppens katalog; bare navn nødvendig for eget vanlig utstyr | `equipment.spec.ts` tester tre faner, 2 synlige input for egenregistrering, 3 for longsword-editor, én commit, scroll og offline | Faktisk 390/320 px: grupper og inline + beholdt fra prototypen, egen fane følger ny beslutning. Ingen mellomoppsummering eller dobbel avbryt | Implementert og gjennomgått |
| Longsword, finesse, ranged/thrown, proficiency og multiclass | STR16 / PB2; Fighter3/Wizard2; Rogue/Wizard, ulike proficiencies | +5 /1d8+3; versatile to hender 1d10+3; klasse-/registrerbare proficiencies, totallevel-PB, korrigerbare unntak | `equipment.test.ts` regeltilfeller, `equipment.spec.ts` faktisk endring/Combat/lagring | Faktisk Fighter3: longsword viser +5/1d8+3 direkte. To hender oppdaterer; skjoldkonflikt varsles uten blokkering. Combat-oppslag har én Lukk | Implementert; første registrerte klasse tolkes som startklasse ved multiclass, forklart og overstyrbar |
| Rustningsregler og tydelig AC | DEX16 og negativ DEX; Leather/Half Plate/Chain Mail | AC14/17/16; ett rustningssett, ett skjold, forståelige bidrag | `derived.test.ts`, `equipment.test.ts`, foundations- og equipment-nettlesertester | Faktisk Chain Mail vises som samlet rustning. Ingen plaggplassering; gjenstandsprofil og AC-grunnlag kan åpnes ved behov | Implementert innen støttede profiler |
| Faste magiske bonuser og attunement | Chain Mail+Shield+Cloak of Protection; vanlig kappe, ikke-attuned, antall0, kopier, saves | AC19 og saves+1 når vilkår gjelder; ikke dobbel bonus eller bonus fra vanlig kappe | `equipment.test.ts` kombinasjoner og `equipment.spec.ts` AC19/save+4 fra DEX16, toggling, endring/undo/offline | Faktisk AC19, I bruk og Attuned; bonuskildene kan leses. Ingen tvungen registrering av vanlige klær | Implementert; større magic-item-bibliotek gjenstår |
| Klasseregler og off-hand | Registrerte Fighting Styles, Monk med riktig klassenivå/utstyr; to lette melee-våpen | Kjente faste bidrag med vilkår; off-hand uten positiv ability med mindre stil; andre effekter som tekst | `equipment.test.ts` egne regeltilfeller, `equipment.spec.ts` off-hand med én Lukk og uten Bruk | Oppslagsmønster følger prototypens idé, men bruker faktisk proficiency og korrigert off-hand. Ikke bruk-/tursporing | Avgrenset støtte som dokumentert; feat-spesifikke unntak kan føres manuelt |
| Databevaring og DM-tilpasninger | Eldre instans uten profil/damage, egne totaler, nye bonuser/referanser | Ingen omskriving ved oppstart; uendret save uten hendelse; feil bevarer utkast; kopi/backup/undo uavhengig | `equipment.test.ts` lagring/kopi/undo/import; `equipment.spec.ts` eldre fallback, full lagring og retry, manuelle totaler/offline; eksisterende migrations/storage-suite | Faktisk redigering åpner samme post direkte. Skjulte detaljer følger med uten ny utfylling. Avbryt og slett-avbryt beholder utkast | Implementert; v2-feltene er additive, ingen DB-migrering |
| Liten skjerm og lesbarhet | 320/390 px, også 200 % skrift | Like piller og lesbare verdier uten horisontal overflyt, også utvidede skjemaer | `equipment.spec.ts` geometri, scroll, lukket/utvidet editor; øvrig mobilregresjon | Egen gjennomgang fant overflyt ved 200 % i dialog og avanserte felt; rettet med responsiv padding, tekstbryting og kolonner. Gjenprøvd uten overflyt eller nettleserfeil | Rettet og gjennomgått; ingen full WCAG-revisjon |

Synlige felt er vurdert ved faktisk føring, ikke bare telt: katalogtillegg trenger ingen ekstra utfylling; eget vanlig utstyr trenger navn. Antall, bonuser, profiler og merknader er tilgjengelige ved behov. Våpeneditoren viser egne verdier først og gjentar ikke en irrelevant global Stealth-advarsel. Ordinære kompleksiteter som Sneak Attack og særlige våpenvilkår vises som tekst uten å gjøres til permanent grunnskade.

Bilder fra egen produktgjennomgang med Fighter3/Champion, Elf, STR16 DEX16, longsword i bruk, dagger i sekken, Chain Mail, Shield og attuned Cloak of Protection:

- [Utstyr 390 px](images/equipment-390.png)
- [Utstyr 320 px](images/equipment-320.png)
- [Direkte våpenredigering 390 px](images/equipment-weapon-390.png)
- [Combat-oppslag 390 px](images/equipment-combat-390.png)

Fortsatt utenfor omfang: feat-/spellkontekstfiltrering, komplett SRD/magic-item-katalog, standardhandlingene Unarmed Strike/Grapple/Shove, sammensatt skadekalkulator og endelig designvalg. Disse kravene er ikke slettet eller erklært løst. Proficiency- og effektgrenser er beskrevet eksplisitt i EQUIPMENT.md.

Endelig lokal kontroll av utstyrsleveransen: `CI=1 CHROMIUM_PATH=/usr/bin/chromium npm run check` passerer **85 domene-/lagringstester, TypeScript/produksjonsbygg og 41 Playwright-tester (126 totalt), ingen hoppet over**. Dette inkluderer regresjon for tidligere tomme attack/damage-felt og egne fortryllelser uten falsk proficiency/stacking-antakelse. Dokumentlenker, ankere, tabellkolonner og `git diff --check` er kontrollert. Screenshots og gjennomgang er fra produksjonsbygget under Pages-understien, ikke en påstand om kontroll av offentlig URL. CI og Pages kontrolleres ved PR/merge.

## Designstudie: tre forslag, ingen valgt retning (2026-10-19)

| Flyt / scenario | Kilde og karaktertilstand | Forventet spilleropplevelse | Testreferanse og kjøreresultat | Mobilgjennomgang / forskjell fra referanse | Status / gjenværende avvik |
| --- | --- | --- | --- | --- | --- |
| Sammenligne tre helhetlige utseender | Brukerens bestilling, krav §12 / DESIGN; samme Elf Rogue5/Thief, HP28/38, temp5, AC16, PB3 | Tre tydelig forskjellige temaer med samme funksjon/innhold og de 13 nevnte komponentene; fantasyfølelse, lesbarhet og kompakt føring | Isolert HTML-render, innhold/geometri og 9 skjermer ved 320 px kontrollert; JS-syntaks og lokale ressurser kontrollert. Ingen spill-/lagringstester for statiske skisser | Faktisk sett Character, Combat, HP-dialog, utstyrs-/felt-/menykomponenter og tre dialogtyper i alle temaene. Ny menyplassering og X-mønstre er forslag; eksisterende app er uendret | Forslag ferdige til vurdering. Tema og samhandlingsvalg ikke valgt; 200 % tekst, full tilgjengelighet og reelle flyter verifiseres ved senere implementasjon |

Se [plansjer, komponentmatrise, faktisk gjennomgang og kilder](design/2026-10/README.md). Skisser endrer ikke status for Combat-swipe, general actions eller andre uimplementerte produktkrav. Ingen appfunksjon erklæres ferdig av et bilde.

### Brukervurdering av designforslagene (2026-10-20)

Eventyrjournal er valgt som retning/palett, med Stjernekartets runde ability-mynter og uniform bueplassering av forkortelser. Se [vedtatte føringer og åpne designspørsmål](REQUIREMENTS.md#valgt-retning-og-videre-designavklaringer-2026-10-20). Meny nederst og eksisterende positive ikon-/portrettvalg videreføres; klikkbarhet og portrett-placeholder skal tydeliggjøres. Modifiers, individuelt ikonomfang og komplett komponentplansje er ikke ferdig avklart eller levert. Ingen produksjonskode eller nye skisser endres av denne dokumentasjonsrunden. Historiske bilder og testresultater over er ikke bevis for en implementert Eventyrjournal-variant. Kontroll: tekst, beslutningskonsistens, lokale lenker/ankere og `git diff --check`; ingen nye spilltester kjørt.

### Bestilte komponentplansjer: faktisk gjennomgang (2026-10-20)

Brukeren bestilte deretter de beskrevne plansjene. [Forventninger, eksempelfigurer, tre bilder, renderer og avgrensninger](design/2026-10/components/README.md) dokumenterer leveransen.

| Flyt / scenario | Kilde og karaktertilstand | Forventet spilleropplevelse | Testreferanse og kjøreresultat | Mobilgjennomgang / forskjell fra referanse | Status / gjenværende avvik |
| --- | --- | --- | --- | --- | --- |
| Alle elementfamilier og ensartethet | Brukerens komponentbestilling; Alva Rogue5/Thief, separat Mira Wizard3 og merkede katalogalternativer | Eventyrjournal med runde mynter og komplett komponentdekning; samme pillefamilie på tvers av innholdstyper; ingen ugyldig tildeling til eksempelkarakteren | `components/render.mjs`: 5/4/6 verdier, identiske myntbuer/etikettplasseringer og lik pille/+ geometri per samling passerer | Faktisk sett alle plansjer; mynttekst flyttet innenfor rammen. 32 isolerte 320/390 px-visninger passerer uten horisontal overflyt eller klippet korttekst | Designforslag levert; ingen produksjonskode endret |
| Modifier- og ikonvalg | Samme navn/verdier i hver variant, også lange navn | Sammenligne ramme/uten ramme og ikon/uten ikon med reell høydeforskjell | Renderer sammenligner innholdet på begge sider; lokal JS-syntaks passerer, ingen nettleser-/ressursfeil | Faktisk sett begge varianter. Eksempelikonene er ikke et komplett sett; de skal ikke forveksles med vedtatt bibliotek | Avventer brukerens detaljvalg |
| Klikkbarhet, placeholder og tilstander | HP er Character-status; GP åpner pengeføring; ressurs-/attunement-/forberedelseseksempler | Sammenhengende handlingsmarkering uten hover, pen placeholder og entydige tilstander | Fargekontroll av tekst/kanter på relevante bakgrunner; dokumentlenker og diff kontrollert | GP-handlingsmarkering og tomtilstandens inline + rettet. Grønne etiketter mørknet for kontrast. Sett også bunnmeny, Combat-kategorier, felt, HP-kontroll og dialogeksempler | Visuell studie; ingen faktisk swipe/dialog-/lagringsfunksjon implementert. Stor tekst/full tilgjengelighet prøves ved eventuell produksjonsimplementasjon |

Dette er en isolert designleveranse. Øvrige funksjonsmangler og implementasjonsgrenser i matrisen beholdes. Ingen eksisterende spilltester eller statiske bilder brukes som bevis for implementert produksjonstema.

### Felles klikkbarhetsmarkør: bestilt designprøve (2026-10-20)

Brukeren ba om fylt hjørnetrekant med 45° diagonal som ensartet markør, uten rammeendringer for klikkbarhet. [Plansje og dokumentasjon](design/2026-10/components/README.md#senere-prøve-ett-hjørne-samme-betydning) viser dette på modifiers (bytt favoritt), GP, piller/+, ressurser, navigasjon og handlingsknapper. Rene statuser har ingen markør. Egen visuell gjennomgang og `render-corners.mjs` passerer: samme 10 × 10 px-form på alle knapper; GP har samme flate/ramme som øvrige statuser; 20 isolerte 320/390 px-utsnitt uten overflyt/klippet korttekst; uniform pille/+ størrelse, ingen JS-/ressursfeil. Ingen produksjonskode eller brukerdata endres. Endelig markør-/statusdesign og eventuell avgrensning i navigasjon avventer brukerens vurdering; tidligere tekniske tester beviser ikke disse uimplementerte appendringene.

### Avklart hjørnefarge og HP-slider; ikke implementert (2026-10-20)

Brukeren godkjente trekantfyll i ramme-/bunnlinjefargen og en innrammet relativ HP-slider med retur til midten ved slipp, beholdt beløp, videre justering fra dette og HP-resultat innenfor 0/maks. Se [presise krav](REQUIREMENTS.md#avklart-hjørnefarge-og-relativ-hp-slider-2026-10-20). Dette er varig prosjektminne; ingen appkode eller nye bilder endres nå.

Ved eventuell bestilling skal akseptansescenarioer omfatte: 0 → −8 → slipp med grep i midten og beløp fortsatt −8; et nytt drag justerer fra −8; skade ved lav HP ender på 0; healing ved nesten full HP stopper på maks; temporary HP tas først ved skade; avbryt/forhåndsvisning/bekreftelse bevarer korrekt dataflyt. Ingen av disse nye betjeningsscenarioene er implementert eller testet. Eksisterende bilde- og spilltester beviser ikke den nye kontrollen. Denne dokumentasjonsrunden kontrolleres med tekst-/beslutningskonsistens, relative lenker/ankere og diff-kontroll.

### Kompakt toppfelt og scrolling avklart; ikke implementert (2026-10-20)

[Brukerens vedtatte toppfelt](REQUIREMENTS.md#avklart-kompakt-toppfelt-og-scrolling-2026-10-20) beholder portrett/placeholder og karakteridentitet, flytter appnavn/regelutgave til «Om appen» og scroller helt bort med innholdet. Bunnavigasjon og menytilgang beholdes. Ingen appkode eller bilder endres her. Ved eventuell bestilling skal mobilgjennomgangen verifisere bortscrollet toppfelt, nåbar meny/faner og ingen tap av eksisterende separate scrollposisjoner. Dette er uimplementerte krav, ikke nye beståtte scenarioer. Dokumentkontroll: tekst-/beslutningskonsistens, lokale lenker/ankere og diff-kontroll.

### B2 med individuelle ikoner valgt; bibliotek gjenstår (2026-10-20)

Brukeren valgte [B2 med individuelle ikoner](REQUIREMENTS.md#individuelle-ikoner-valgt-2026-10-20) på artsegenskaper, features/feats, våpen og spells/cantrips. B1/B2 er ikke lenger et åpent designvalg. Fullstendig ikonbibliotek for støttet innhold, reservemarkør og kontroll av lesbarhet/tekstmengde/konsekvent uttrykk gjenstår. Prøveikoner og tidligere geometritester dokumenterer ikke ferdig dekning eller gjenkjennelighet. Ingen ny kode eller nye bilder endres i denne dokumentasjonsrunden.

## Eventyrjournal: forventninger og scenarier før implementasjon (2026-10-20)

Grunnlag: siste uttrykkelige implementasjonsbestilling, REQUIREMENTS §12, avklarte plansjer 02/06/08, nyeste slider-/header-/ikonbeslutninger, faktisk v0.11-prototype som flytreferanse og D&D 2014-beregningene som allerede er implementert. Dette er planlagte kontroller, ikke beståtte tester.

| Flyt / scenario | Kilde og karaktertilstand | Forventet spilleropplevelse | Planlagt test / gjennomgang | Status før koding |
| --- | --- | --- | --- | --- |
| Personlig ark og navigasjon | Alva Elf Rogue5/Thief; separat Fighter3/Wizard2; portrett med/uten bilde | Journal-palett, portrett/pen placeholder, fem statuser, fire modifiers og seks mynter. Navn/art/klasser/nivå/subclass bevares. Toppfelt scroller bort; Meny og tre faner er alltid tilgjengelige nederst, med egne scrollposisjoner | Nettlesertest ved 320/390 px, 200 % tekst, bytte karakter/fane, ekte oppslag og skjermbilder | Planlagt |
| Modifierfavoritt | Alva DEX18/WIS14/CHA10, PB3, Stealth expertise | Luftig klikkbart felt åpner alfabetisk liste; bytt valgt favoritt og bevar +5/+10/+7/+3 hvor grunnlaget tilsier det, uten å redigere selve terningmodifieren | UI- og lagringsregresjon, fokus/scroll ved retur, ingen hendelse ved uendret valg | Planlagt |
| Ikoner og reserve | SRD-spells med fire/cold/healing, swords/bows, lette/tunge armor; egne ukjente poster | Passende kategori-/familieikon, pen reserve og lesbart navn. Frivillig ikonvalg under detaljer. Ingen regelendring på grunn av ikonvalg | Rene mappingtester, alle katalogposter får eksisterende ikon, backup/kopi/undo og offline med manuell overstyring | Planlagt |
| Relativ HP-kontroll | HP28/38 temp5; HP5/12 temp0; full HP; stor maks HP | Drag til −8 → slipp, beløp fortsatt −8 og grep i midten; nytt drag fra −8. Skade tar temp først og gir 25/38. Grense 0/maks; ±1/eksakt tall og tastatur. Ingen lagring før bekreftelse | Domene- og UI-test av flere drag, pekerkansellering, grenser, ingen endring mens grepet holdes stille, avbryt/feil/retry og atomisk undo | Planlagt |
| Dialoger og egne poster | Katalogtillegg, eget våpen, spell, notat, avbrutt sletting | Enkelt direkte tillegg; samme journaluttrykk i felt, velgere, meny, korte oppslag og store redigeringsflater. Fast lukk/avbryt og relevant bekreftelse. Utkast og feil bevares | Eksisterende ende-til-ende-regresjon + mobiltest av lang dialog, fokus/tastatur, scroll, knappenes formål og 200 % tekst | Planlagt |
| Utstyrs- og spillverdier | Fighter3 STR16 PB2 Longsword, Chain Mail/Shield/Cloak of Protection | Kjente +5/1d8+3 og AC19 beholdes; «I bruk» er egen status, hjørne er klikkbarhet. Ingen ny proficiency-/tilgangsregel. Manuelle unntak bevares | Eksisterende domene-/utstyrstester og reell produktgjennomgang av Character/Combat/Utstyr | Planlagt |
| Combat og offline | Egne actions/spells og brukte våpen; relevante 2014-regler uendret | Action/Bonus/Reaction med trykk og horisontalt sveip; vertikal scrolling fungerer. Slå opp og før HP uten nett. Lokale fonter/ikoner er tilgjengelige etter offline reload | UI-test av sveip, oppslag, HP og backup uten nett; oppdateringsregresjon | Planlagt |

Avgrensning: tidligere dokumenterte mangler i feat-/spellkontekst, full SRD/standardhandlinger og sammensatt skadekalkulator implementeres ikke som en utilsiktet del av styling. Ingen visuell endring skal skjule eller erklære dem ferdige. Nytt ikonfelt er valgfritt og additivt, slik at gamle karakterer og backup fortsatt virker.

## Eventyrjournal: faktisk produktkontroll og leveranse (2026-10-20)

Før-koding-forventningene over er gjennomført. [Detaljert betjening, tekniske valg, bilder og avgrensning](EVENTYRJOURNAL.md) beskriver den faktiske produksjonsimplementasjonen.

| Flyt / scenario | Kilde og karaktertilstand | Forventet spilleropplevelse | Testreferanse og kjøreresultat | Mobilgjennomgang / forskjell fra referanse | Status / gjenværende avvik |
| --- | --- | --- | --- | --- | --- |
| Personlig ark, toppfelt og meny | Avklart journaltema; Alva Rogue5/Thief, faktisk opplastet portrett, samt placeholder i tester | Ingen app-/regeltekst i header; identiteten scroller bort; fast bunnavigasjon/Meny og uavhengig scroll | `design.spec.ts` og eksisterende karakter-/utstyrstester passerer; faktisk brukt Meny/Om appen ved lang scroll og returnert fokus/scroll | Sett 390/320 px, med portrett/placeholder. Navn/art/klasse/subclass beholdt. Meny er journalrader; bilder ligger i EVENTYRJOURNAL | Implementert; ingen automatisk eksempelkarakter eller foto |
| Modifiers og abilities | Alva DEX18 WIS14 CHA10 PB3, Stealth expertise og DEX-save proficiency | Fire fullstendige favoritter +5/+10/+7/+3; valglisten bytter felt, mynter med uniforme buer | `design.spec.ts`: 6 identiske buer; eksisterende modifier-/proficiency-/offline-regresjon passerer | Faktisk ført proficiencies og favoritter gjennom UI. Luftige felt har hjørnemarkør, rene statuser/mynter har ingen | Implementert; større skrift får responsivt myntgrid |
| Ikoner, egne poster og status | Alle støttede katalogposter; egne ukjente egenskaper, manuelt ikonvalg; Mira Wizard3 | Kategori-/familie-/reserveikon, lesbart navn og frivillig ikonvalg. Hake/tekst viser utstyrt/forberedt, uten annen klikkbarhetsflate | `iconography.test.ts`: katalog-/reserve-/override-/validerings-/backup-/kopi-/undo-tilfeller; `design.spec.ts`: virkelig valg og offline visning passerer | Sett Darkvision/Fey/Trance, Rogue-features, våpen/rustning og caster-ikoner. Mage Hand fikk manipulasjonsikon etter egen gjennomgang | Implementert som kategoriikoner; ikke unikt bilde per ID. Ingen ikonbasert regel-/tilgangsendring |
| Relativ HP-kontroll | HP28/38 temp5, null/full HP, store korreksjoner | Flere drag summerer, grep til midten ved slipp/kansellering, ingen tidsrepetisjon, resultat innen 0/maks; temp først | `design.spec.ts`: faktiske musedrag til −8 og −16, hold uten repetisjon, keyboard/±1/tall/grenser, pointercancel, avbryt, lagringsfeil/retry og atomisk undo passerer; domenegrenser testet | Faktisk −8-forhåndsvisning gir HP25/temp0 mens grep er nøytralt. Grep/track er innen rammen også ved 320/390 og 200 % tekst | Implementert vanlig HP-føring. Flerkomponent-/effektkalkulator gjenstår som tidligere |
| Dialoger og registrering | Katalogvalg, egne utstyr/features/spells/notater, avbrutt sletting og feil | Én lukk for oppslag, fast topp og bekreftelse for større redigering, utkast/fokus/scroll beholdes | `design.spec.ts` pinned topp/footer ved 320/390; eksisterende 41 ende-til-ende-tester passerer med ny forventning om nøytralt HP-grep | Gjennomgang fant Escape som bare tømte aktivt søk; rettet og testet med ett trykk. Ingen ekstra mellomdialog. Tom samling får kortere inline + for plassbruk | Implementert; eksisterende registreringsfelt er bevart, ikke en ny automatisk bygger |
| Combat og utstyr | Alvas Shortsword/Dagger d20+7 og 1d6+4/1d4+4; eksisterende Fighter-/multiclass-/magic-item-scenarioer | Store lesbare våpenoppslag, kategori med trykk/sveip, uendrede faktiske spillverdier og separate utstyrsstatuser | `equipment.test.ts` og eksisterende utstyr-/Combat-regresjon passerer; `design.spec.ts` ekte touch-sveip og vertikal gest uten feiloppslag passerer | Sett Combat og Utstyr. Tom «Andre egenskaper»-tittel skjules; ingen permanent sveipeinstruks. Kortene følger valgt Combat-skisse fremfor å presse våpenverdier i fire små kolonner | Implementert visning/sveip. Registrerte data styrer innholdet; standardhandlinger og full generering gjenstår |
| Mobil, offline og oppdatering | 320/390/768 px; 100/200 % tekst, gamle karakterer og egne ikonvalg | Ingen horisontal overflyt/klippet korttekst; lokale fonter og ikoner virker etter offline reload; data bevares ved oppdatering | `design.spec.ts`, eksisterende mobil-, backup-, migrerings- og oppdateringstester passerer. Egen 12-kombinasjonsvisning av caster/faner gir ingen overflyt eller nettleserfeil | Alle endelige produktbilder er fra produksjonsbygget under Pages-understien. Kontrollert flere skjermstørrelser og stor skrift; ingen full WCAG-revisjon eller fysisk enhetstest påstås | Implementert innen denne kontrollen; schema2/DB3 beholdes med valgfrie ikonfelt |

Endelig lokal kontroll: `CI=1 CHROMIUM_PATH=/usr/bin/chromium npm run check` passerer **93 domene-/lagringstester + 50 nettlesertester (143 totalt), TypeScript og produksjonsbygg**, ingen hoppet over. Egen produktgjennomgang og nye scenarier er gjennomført separat fra denne tellingen. Lenker/ankere, tabeller, fontkilder og diff kontrolleres før commit. CI og Pages-status kontrolleres ved PR/merge.

Gjenstående funksjonskrav er beholdt: kontekstfiltrering av feats/spells, komplett lokalt innhold/standardhandlinger, avansert sammensatt skade og flere klasseregler. Denne leveransen endrer utforming og avklarte kontroller, ikke den tidligere avtalte funksjonsavgrensningen. Ukjente kategorier er dekket visuelt av reserveikoner, ikke tolket som automatisk regelstøtte.
