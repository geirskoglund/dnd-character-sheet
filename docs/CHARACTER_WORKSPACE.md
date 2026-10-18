# Character-arbeidsflate: krav, kilde og leveransestatus

Arbeidsgrunnlag: REQUIREMENTS §§1–10, DATA_MODEL, DESIGN, gjeldende DECISIONS, CODEX_HANDOFF, brukerens forklaringsdokument og `prototypes/dnd-character-companion-v0.11.html`. Nyeste brukeravklaringer har forrang. Dette er leveransestatus, ikke en erstatning for kravene.

## Levert Character-versjon (PR #8)

| Krav / avklaring | Konkret løsning | Verifikasjon |
| --- | --- | --- |
| Tette, uniforme samlinger, inline + | Fire kolonner ved 360/390 px, tre ved 320 px; like celler innen samlingen, samme form/ramme for + | Mobilgeometri og lesbare eksempelnavn i nettlesertester |
| Artsegenskaper | Katalogoppslag med én Lukk; egne artsegenskaper legges til/redigeres som feature-instanser | Oppslag, egenregistrering, lagring |
| Class Features & Feats før utstyr | Søkbar SRD-velger og egenregistrering; redigering/fjerning fra egen pille. **Delvis:** standardlisten tar ennå ikke hensyn til karakterens klasse, subclass, klassenivå eller forutsetninger | Feat-CRUD, betinget effekt, handling/ressurs og angre testet. Kontekstrelevans og forutsetninger er ikke verifisert; se åpne avvik nedenfor |
| Weapons / Armor og skjold / Annet utstyr | Egne grupper, equipped først, filtrert direktevalg og eget utstyr | Kategori, gruppetilhørighet, konfliktadvarsler, mobil |
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

- **Combat:** Manuelle handlingsinstanser og tilgjengelige spells kan vises som oppslag etter action economy. Automatisk genererte våpenhandlinger, off-hand, standardhandlinger (Unarmed Strike/Grapple/Shove osv.) og komplett sammenstilling av katalogregler gjenstår. Ingen turstyrer innføres.
- **Ta skade:** Den eksisterende HP-justeringen med temp HP først er beholdt. Sammensatt skade, individuelt valgbare passive effekter, bekreftelse ved ukjente vilkår, flat reduksjon, korrekt resistance/vulnerability-rekkefølge og forklaring til DM gjenstår. Lagrede skadeegenskaper/effekter brukes ikke i denne HP-justeringen.
- **SRD:** Lokal karakterkatalog omfatter 319 spells/cantrips, 407 klasseegenskapsoppføringer, én SRD-feat og 237 vanlige utstyrsoppføringer, i tillegg til eksisterende species/klassegrunnlag. Dette er ikke et komplett SRD-regelbibliotek: øvrige regelkapitler, monster- og magic-item-bibliotek og full trait-/subrace-dekning gjenstår. Ingen automatisk regelkonvertering fra prosatekst.
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
| Fyll inn berørt flyt | Krav/avklaring/regelkilde; klasse, subclass, klassenivå og øvrig relevant tilstand | Konkret forventet resultat, tilgjengelige valg og unntak | Faktisk test og resultat, eller «ikke kjørt» | Faktisk observasjon og begrunnelse, eller «ikke gjennomført» | Verifisert / delvis / åpent avvik / avklart utenfor omfang |

### Kjent mangel som den nye kontrollen må fange

Dette er akseptansescenarier for videre arbeid med egenskaps-/featvelgeren. De er ikke nye kjørte tester eller en bestilling på funksjonskode i denne dokumentasjonsendringen. Detaljert regelgrunnlag og testreferanser må fylles inn før en implementasjon.

| Flyt / scenario | Kilde og karaktertilstand | Forventet spilleropplevelse | Testreferanse og kjøreresultat | Mobilgjennomgang / forskjell fra referanse | Status / gjenværende avvik |
| --- | --- | --- | --- | --- | --- |
| Klasseegenskaper i standardlisten | Brukerreview 2026-10-19; Fighter level 3 med valgt subclass | Standardlisten bruker karakterens klasse, subclass og klassenivå til å vise relevante egenskaper | Ingen relevanstest kjørt; tidligere CRUD-test dekker ikke dette | Brukeren rapporterte en lang liste med ugyldige valg. Kodegjennomgang bekrefter at listen starter med alle klasser | **Åpent avvik:** automatisk kontekstfiltrering mangler |
| Generelle feats beholdes | Brukerpresisering 2026-10-19; klassenøytral feat med eventuelle øvrige krav oppfylt, prøvd med ulike klasser | Generelle feats blir værende ved klassefilter. Bare faktiske forutsetninger begrenser; uavklarte krav merkes og valget beholdes tilgjengelig | Ikke testet for dette kriteriet; må inngå i rettelsen sammen med begrensede feats | Kodegjennomgang viser at manuelt klassefilter utelater katalogposter med tom klasseliste | **Åpent avvik:** generelle feats kan forsvinne ved klassefilter |
| Multiclass og nivågrenser | Samme review; Fighter 3 / Wizard 2, samlet level 5 | Hver klasseegenskap vurderes mot nivået i sin aktuelle klasse; endring over en nivågrense prøves særskilt | Ikke implementert eller testet for relevans | Ikke gjennomført med dette akseptansekriteriet | **Ikke verifisert:** inngår i videre rettelse av velgeren |
| Feats og øvrige forutsetninger | Samme review; konkrete feats med faktiske krav til eksempelvis ability scores, proficiencies eller art | Vis relevante valg ut fra de faktiske kravene. Uavklarte krav synliggjøres; manuelle valg og DM-unntak bevares | Ingen test av forutsetninger kjørt. Regler, grensetilfeller og nøyaktig unntaksflyt må beskrives før koding | Ikke gjennomført med dette akseptansekriteriet | **Åpent avvik:** forutsetninger vurderes ikke av dagens velger |

### Denne dokumentasjonsendringen

Arbeidsinstruks, matrise, kravspesifikasjon og beslutningslogg oppdateres med den vedtatte leveringskontrollen. Ingen brukerflyt eller funksjonskode endres. Kontroll for denne endringen: tekst, konsistens, relative lenker og `git diff --check`. Nye spilltester og mobilgjennomgang er ikke kjørt for dokumentasjonsendringen; eksisterende testresultater ovenfor beholdes som historikk fra PR #8.
