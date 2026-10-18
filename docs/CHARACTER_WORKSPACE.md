# Character-arbeidsflate: krav, kilde og leveransestatus

Arbeidsgrunnlag: REQUIREMENTS §§1–9, DATA_MODEL, DESIGN, gjeldende DECISIONS, CODEX_HANDOFF, brukerens forklaringsdokument og `prototypes/dnd-character-companion-v0.11.html`. Nyeste brukeravklaringer har forrang. Dette er leveransestatus, ikke en erstatning for kravene.

## Denne endringen

| Krav / avklaring | Konkret løsning | Verifikasjon |
| --- | --- | --- |
| Tette, uniforme samlinger, inline + | Fire kolonner ved 360/390 px, tre ved 320 px; like celler innen samlingen, samme form/ramme for + | Mobilgeometri og lesbare eksempelnavn i nettlesertester |
| Artsegenskaper | Katalogoppslag med én Lukk; egne artsegenskaper legges til/redigeres som feature-instanser | Oppslag, egenregistrering, lagring |
| Class Features & Feats før utstyr | Søkbar SRD-velger og egenregistrering; redigering/fjerning fra egen pille | Feat-CRUD, betinget effekt, handling/ressurs, angre |
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

Verifikasjonskolonnen beskriver kontrollene. Faktiske kjøreresultater og mobilgjennomgang står under «Verifisert før levering».

## Fortsatt delvis eller gjenstående – beholdes som produktkrav

- **Combat:** Manuelle handlingsinstanser og tilgjengelige spells kan vises som oppslag etter action economy. Automatisk genererte våpenhandlinger, off-hand, standardhandlinger (Unarmed Strike/Grapple/Shove osv.) og komplett sammenstilling av katalogregler gjenstår. Ingen turstyrer innføres.
- **Ta skade:** Den eksisterende HP-justeringen med temp HP først er beholdt. Sammensatt skade, individuelt valgbare passive effekter, bekreftelse ved ukjente vilkår, flat reduksjon, korrekt resistance/vulnerability-rekkefølge og forklaring til DM gjenstår. Lagrede skadeegenskaper/effekter brukes ikke i denne HP-justeringen.
- **SRD:** Lokal karakterkatalog omfatter 319 spells/cantrips, 407 klasseegenskapsoppføringer, én SRD-feat og 237 vanlige utstyrsoppføringer, i tillegg til eksisterende species/klassegrunnlag. Dette er ikke et komplett SRD-regelbibliotek: øvrige regelkapitler, monster- og magic-item-bibliotek og full trait-/subrace-dekning gjenstår. Ingen automatisk regelkonvertering fra prosatekst.
- **Koblinger:** Feature-editoren støtter egen handling, ressurs, skadeeffekt og eksisterende ressurser. Vilkårlig mange avanserte koblinger/aktive tilstander fra import bevares, men alle har ennå ikke egne fullstendige redigeringsflater. Utstyrsavhengige avanserte effekter gjenstår.
- **Hvile:** Registrert short/long-rest-recharge følger ressursen. Særregler (inkludert Arcane Recovery/spilledag), exhaustion/conditions og death-save-reset vurderes manuelt med DM. Ingen automatisk spilledagskalender.
- **Design:** Denne rettelsen harmoniserer eksisterende arbeidsflate med prototype og seneste avklaringer. Den erstatter ikke det senere avklarte valget mellom 2–3 designretninger.

## Teknikk og databevaring

Samme schemaVersion 2 / IndexedDB v3: ingen omskriving av eksisterende karakterer er nødvendig. Nye brukerflyter bruker allerede definerte, strukturerte felt. Katalogvalg lagres som uavhengige UUID-instanser med katalogreferanse; katalogen endres aldri av karakterredigering. Bekreftede operasjoner går gjennom samme revisjonskontrollerte repository og atomiske endringslogg. Portrett lagres atomisk med karakteren; gamle immutable assets beholdes for kopi og angre.

SRD-data er bygget inn i egne statiske chunks og precaches av PWA-en. Ingen API-avhengighet under spill. `scripts/import-srd.mjs` er et valgfritt vedlikeholdsverktøy med fast kilderevisjon; installasjon/bygg trenger det ikke. Se `public/SRD-LICENSE.txt` for attribusjon og kilde.

## Verifisert før levering

`CI=1 CHROMIUM_PATH=/usr/bin/chromium npm run check` passerer: **60 domene-/lagringstester, TypeScript-kontroll, produksjonsbygg og 33 Playwright-tester**. Ingen hoppede tester. `git diff --check` er også kontrollert.

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
