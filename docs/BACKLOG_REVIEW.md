# Kvalitetsgjennomgang av backloggen

> Historisk kontrollgrunnlag for PR #53. Gjeldende beskrivelse og status for hver sak vedlikeholdes i GitHub. #25 er senere erstattet av brukerens fulle tallhjulstekst; denne gjennomgangens tidligere åpne pengeflyt er ikke dagens arbeidsgrunnlag.

Gjennomgått 2026-10-20 etter brukerens påpekning av pengeunntaket i #25 og bestillingen «Rett det opp. Vær selvkritisk og gå gjennom alle sakene for å kvalitetssikre.» Startgrunnlag er master **eefa958** (PR #52); appkoden er uendret fra PR #23. Dette gjelder dokumentasjon og alle27 Issues, ikke appimplementasjon.

## Feilen og kontrollmetoden

Jeg gjorde eksisterende pengeoppførsel til et bindende unntak uten brukerens godkjenning. Feilen sto i flere dokumenter, ikke bare første Issue. At et utsagn allerede står i et Codex-skrevet dokument gjør det ikke til en brukerbeslutning.

Alle27 beskrivelser er sammenholdt med samtaleavklaringene som er tilgjengelige, REQUIREMENTS, DECISIONS, DESIGN, DATA_MODEL, CODEX_HANDOFF, WORKFLOW_REVIEW, den opprinnelige backloggen og relevante prototype-/kode-/datasteder. Kontrollspørsmålene var: Har føringen kilde? Er den brukeravklart, regelavledet, eksisterende oppførsel eller bare et forslag? Gir scenarioet riktig 2014-forventning? Gjenåpner vi et avgjort spørsmål? Er avhengigheten nødvendig, eller bare mulig koderekkefølge? Er Klar-status forsvarlig?

De konkrete kildehenvisningene står i hver [revidert saksseksjon](BACKLOG_READY.md#oppgaveoversikt) og i Issuen. Bare faktisk leverte funksjoner skal kvitteres ut; denne gjennomgangen har ikke kjørt nye D&D- eller fysiske mobilscenarioer. Regelavledede forventninger er testplanlegging, ikke bevis for ferdig appfunksjon. Full SRD-dekning, sammensatt skade og øvrige opprinnelige krav beholdes.

## Resultat

- **Pengeunntaket er trukket tilbake**, uten å erstatte det med en ny uavklart pengeflyt. Midtbåndslukking, to pengehjul og direkteinnskriving består som mål.
- **#25 og #38 er nedgradert fra Klar til Trenger produktavklaring.** Den konkrete pengelukkingen og den tidligere utsatte immunitetsflyten var ikke godkjent.
- **#35 går fra Avventer til Trenger produktavklaring.** Attack/DC-oppgaven er ikke en hard forutsetning for scaling; ny slotnivåvelger og første beregningsomfang er fortsatt forslag.
- **Unødvendige avhengigheter er fjernet** fra #29, #35, #45, #47 og #51. #31 trenger Forbruk som funksjonsgrunnlag. Fysisk review kan begynne før feilene rettes, og må gjentas på senere endrede flyter.
- **Regel- og omfangsfeil er rettet:** ingen vanlig Expertise på saving throws, ingen regel om ikke-stabling utledet bare fra katalog-ID, ingen oppdiktet kastemetode for Magic Missile, og ingen automatisk Second Wind-healing forkledd som ressursføring.
- **Egne tekniske valg er merket som slike:** blant annet syvdagers backupperiode, 44px kontrollmål og metadata som gjennomføringsforslag. Ingen av disse er tillagt brukeren som nye beslutninger.
- **Overflødige produktspørsmål er fjernet:** blant annet bekreftelse av ukjente skadevilkår, behov for terninger ved kort hvile og manuell potion-HP. De gjenværende spørsmålene gjelder konkrete nye flyter eller avgrensninger.

Fordelingen ved PR #53 var **7 klare, 19 trengte produktavklaring og 1 avventet fysisk testtilgang**; dette er en historisk opptelling. Alle27 Issues beholdes åpne med samme BL-ID, prioritet, type og opprinnelige rekkefølge. Klar er fortsatt ikke en kodebestilling eller en garanti mot fremtidige funn.

## Kontroll per sak

«Ingen ny rettelse» betyr at denne gjennomgangen ikke fant en tilsvarende feil innen sakens beskrevne omfang; det er ingen generell garanti for all regeldekning.

| Sak | Kontrollresultat / rettelse | Gjeldende status |
| --- | --- | --- |
| [BL-01 / #25](https://github.com/geirskoglund/dnd-character-sheet/issues/25) | Pengeunntaket fjernet. Status senket fra Klar; dagens kode behandles som eksisterende oppførsel, ikke brukerens godkjenning av den. | Trenger produktavklaring |
| [BL-02 / #26](https://github.com/geirskoglund/dnd-character-sheet/issues/26) | Klar for teknisk feilutredning beholdt. Fysisk reproduksjon/etterkontroll er fortsatt nødvendig; verken fokusforklaringen eller ekstern rapport blir fasit. | Klar for implementasjon |
| [BL-03 / #27](https://github.com/geirskoglund/dnd-character-sheet/issues/27) | Klar beholdt. Upresist forbud mot endret cacheidentitet erstattet med bevaring av installasjons-/lagringsidentitet og fungerende oppdateringer. | Klar for implementasjon |
| [BL-04 / #28](https://github.com/geirskoglund/dnd-character-sheet/issues/28) | Klar beholdt. Eksakt menygeometri er teknisk designarbeid; 44px er ikke presentert som en ny produktbeslutning. Fysisk standalone-port består. | Klar for implementasjon |
| [BL-05 / #29](https://github.com/geirskoglund/dnd-character-sheet/issues/29) | Forbruk fjernet som hard avhengighet. Bevaring av gamle data er krav; en egen delingsdialog er bare et forslag, ikke obligatorisk ny funksjon. | Trenger produktavklaring |
| [BL-06 / #30](https://github.com/geirskoglund/dnd-character-sheet/issues/30) | Foreslått startutvalg og egenregistrering er uttrykkelig forslag. Ingen ny beslutning om bare åtte varer eller forbud mot valgfrie beskrivelser. | Trenger produktavklaring |
| [BL-07 / #31](https://github.com/geirskoglund/dnd-character-sheet/issues/31) | Avhengighet til Forbruk beholdt som nødvendig funksjonsgrunnlag. Spørsmålet om automatisk potion-HP fjernet: manuell HP-føring ligger allerede i grunnlaget. | Trenger produktavklaring |
| [BL-08 / #32](https://github.com/geirskoglund/dnd-character-sheet/issues/32) | Klar beholdt innen eksisterende Combat-krav. De 13 navnene er et kildebasert arbeidsutvalg, ikke nytt uttømmende vedtak. Martial Arts-forutsetninger og Grapple/Shove innen Attack presisert. | Klar for implementasjon |
| [BL-09 / #33](https://github.com/geirskoglund/dnd-character-sheet/issues/33) | Klar beholdt for oppslag/tellere. Full kartlegging betyr dekningskontroll, ikke automatisk regelutførelse for 407 poster. Second Wind-eksempelet presisert som manuell telling, ikke automatisk heling. | Klar for implementasjon |
| [BL-10 / #34](https://github.com/geirskoglund/dnd-character-sheet/issues/34) | Klar beholdt. Attack/DC-tall kontrollert mot klasse, PB, riktig ability og aktive item-bidrag. Ingen attack/DC tilføyes spells uten slike kast, og gamle manuelle tekster skal ikke gjettetolkes. | Klar for implementasjon |
| [BL-11 / #35](https://github.com/geirskoglund/dnd-character-sheet/issues/35) | Kunstig hard avhengighet til #34 fjernet. Status endret til produktavklaring om ny nivåvelger/dekningsgrense. Magic Missile-eksempelet binder ikke appen til en oppdiktet kastemetode. | Trenger produktavklaring |
| [BL-12 / #36](https://github.com/geirskoglund/dnd-character-sheet/issues/36) | Felles Skill/save → Expertise rettet. Reglene og valgene er typespesifikke; databevaring gjør ikke alle gamle UI-valg til normale D&D-regler. | Trenger produktavklaring |
| [BL-13 / #37](https://github.com/geirskoglund/dnd-character-sheet/issues/37) | Kravet om betingelser og samtidige defenses beholdt. Spørsmål om allerede bestemt hendelsesbekreftelse fjernet; bare faktisk registrerings-UX står åpen. | Trenger produktavklaring |
| [BL-14 / #38](https://github.com/geirskoglund/dnd-character-sheet/issues/38) | Feil Klar-status senket. Standardliste/direkte lagring er et forslag, selv om det samsvarer med det generelle prinsippet om få mellomtrykk. | Trenger produktavklaring |
| [BL-15 / #39](https://github.com/geirskoglund/dnd-character-sheet/issues/39) | Forslaget til oversikt beholdt uavklart. Begrensning til én ny handling/pool/effekt er ikke avtalt og skal ikke innføres som følge av dagens begrensede editor. | Trenger produktavklaring |
| [BL-16 / #40](https://github.com/geirskoglund/dnd-character-sheet/issues/40) | Skilt vedtatt minimumsflyt fra foreslått detaljoversikt. Uklar påstand om ukjent iconKey rettet til gyldig valgfri metadata; validering skal ikke svekkes. | Trenger produktavklaring |
| [BL-17 / #41](https://github.com/geirskoglund/dnd-character-sheet/issues/41) | Aktivering presisert som regelinformasjon. Ikke avklart for egne actions er fortsatt et forslag, ikke automatisk et nytt vedtak fra item-flyten. | Trenger produktavklaring |
| [BL-18 / #42](https://github.com/geirskoglund/dnd-character-sheet/issues/42) | Forslagsstatus beholdt. Ingen ny råkastføring/auto-CON eller automatisk HP ved hvile innført; betingede gjenopprettinger skilt fra manuelle særregler. | Trenger produktavklaring |
| [BL-19 / #43](https://github.com/geirskoglund/dnd-character-sheet/issues/43) | Klar beholdt for det klare atferdsmålet. Syv dager/første-endring-start er tatt ut som bindende krav og merket tekniske utgangspunkter. | Klar for implementasjon |
| [BL-20 / #44](https://github.com/geirskoglund/dnd-character-sheet/issues/44) | Spørsmål om allerede vedtatt vilkårsbekreftelse fjernet. Bare faktisk skjermkonflikt står igjen. HAM brukes som manuelt eksempel, ikke et løfte om ikke-SRD-katalog. | Trenger produktavklaring |
| [BL-21 / #45](https://github.com/geirskoglund/dnd-character-sheet/issues/45) | Spell attack/DC fjernet som hard avhengighet: tilgang kan føres uten beregningsoppslag. Registreringsinngang/delt teller er fortsatt uavklart, ingen obligatorisk spellkobling. | Trenger produktavklaring |
| [BL-22 / #46](https://github.com/geirskoglund/dnd-character-sheet/issues/46) | Avklaringsoppgave beholdt. Spør om ønsket omfang, mens kilde/lisens/research eies av implementatøren. | Trenger produktavklaring |
| [BL-23 / #47](https://github.com/geirskoglund/dnd-character-sheet/issues/47) | #39 fjernet som hard avhengighet. Ingen godkjent én-child-grense eller automatisk virkning av generisk aktivflagg er lagt inn. | Trenger produktavklaring |
| [BL-24 / #48](https://github.com/geirskoglund/dnd-character-sheet/issues/48) | Generell formulering om ikke-stabling av identiske katalogkilder fjernet som regelgrunnlag. Konkret Cloak + Ring-scenario satt inn; utvalg/etappegrense og oppslag er fortsatt forslag. | Trenger produktavklaring |
| [BL-25 / #49](https://github.com/geirskoglund/dnd-character-sheet/issues/49) | Forslagsstatus beholdt for underartspresentasjon og senere artsvalg. Ingen dobbel artsbonus eller automatisk valg av ancestry. Manglende innhold beholdes som krav. | Trenger produktavklaring |
| [BL-26 / #50](https://github.com/geirskoglund/dnd-character-sheet/issues/50) | Presentasjon er uavklart, full SRD gjenåpnes ikke. Ingen ekstra bunnfane eller kampadministrasjon lagt inn. | Trenger produktavklaring |
| [BL-27 / #51](https://github.com/geirskoglund/dnd-character-sheet/issues/51) | Hard venting på feilrettinger fjernet: review kan finne dem før de fikses. Fysisk tilgang er eneste faktiske blokker; retest av senere endringer kreves separat. Nytt intermitterende scrolltestutslag er registrert som uavklart kontrollfunn, ikke rettet appfunksjon. | Avventer avhengighet |

## Regelkontroll og avgrensning

De konkrete spell-/featureforventningene er sammenholdt med de pinnede 2014-dataene fra [importverktøyet](../scripts/import-srd.mjs), distribuerte [spells](../src/data/srd-spells.json) og [features](../src/data/srd-features.json): Martial Arts-forutsetninger, Second Wind, Ki, Expertise, Fire Bolt, Eldritch Blast og Magic Missile. Magic-item-eksemplene er sammenholdt med samme kilderevisjons Amulet of Health/Cloak of Protection/Ring of Protection og eksisterende [utstyrskontrakt](EQUIPMENT.md).

I denne kontrollen er [Rule Sections](https://github.com/5e-bits/5e-database/blob/a6212beb4b278917c2cff41c2b04c4ef4f3e0d6f/src/2014/en/5e-SRD-Rule-Sections.json) og [Magic Items](https://github.com/5e-bits/5e-database/blob/a6212beb4b278917c2cff41c2b04c4ef4f3e0d6f/src/2014/en/5e-SRD-Magic-Items.json) hentet på den pinnede revisjonen. Relevante avsnitt er Actions in Combat, Making an Attack (Unarmed Strike/Grapple/Shove), Damage and Healing (minst0, resistance før vulnerability, temp HP først), Resting og Attunement. Tallene i de konkrete scenarioene er gjennomgått, men nye beregninger/UI er ikke implementert eller testet her. Heavy Armor Master er et manuelt ikke-SRD-eksempel fra kravene, ikke ny distribuert feattekst.

Det er fortsatt ikke utført en full revisjon av alle SRD-oppføringer, ny mobil-/spilltest eller fysisk iPhone-kontroll. Produktspørsmålene tas én flyt om gangen etter brukerens ønske. Tekniske valg sendes ikke til brukeren som en unødvendig avklaringsrunde.

## Verifikasjon av dokumenter og GitHub

Utført lokalt:27 unike saker,7/19/1-status,114 planlagte akseptansescenarioer,27 kilde-/kontrollseksjoner og alle114 opprinnelige produktpunkter bevart.482 lokale lenker/ankere og221 GitHub-kildelenker i produktdokumentene er kontrollert. Ingen sykliske avhengigheter; ingen Klar-sak har åpne produktspørsmål eller harde oppgaveavhengigheter. Reviderte Issue-utkast har identisk saksseksjon med BACKLOG_READY og bevarer opprinnelig audittekst som tydelig merket historikk. `git diff --check` passerer. Bare ti dokument-/instruksfiler endres; app, tester, katalogdata, bygg og publiseringsoppsett er urørt.

GitHub-tilbakekontrollen av alle27 oppdaterte Issues passerer: eksakt samsvar med saksutkastene, ett riktig klargjøringsmerke per sak, uendrede titler/prioriteter/typer/øvrige merker og fortsatt åpen tilstand. Ingen funksjonssak er lukket. Sluttkontrollen gjentas etter suppleringen av #51 nedenfor.

## Nytt kontrollfunn i eksisterende scrolltest

[CI39517435615](https://github.com/geirskoglund/dnd-character-sheet/actions/runs/39517435615) på første dokumentcommit29fc4fe feilet:75 nettleserscenarioer passerte, men `equipment.spec.ts:83` fikk scrollY903 der150 var forventet etter fanebytte. App- og testkoden er uendret fra startgrunnlaget. CI-loggnedlastingen var proxyblokkert; feilutdraget er hentet fra GitHubs check-run-annotasjoner, ikke gjettet fra rød status.

`npm run build` passerer TypeScript/produksjonsbygg. Fem lokale gjentakelser av det navngitte eksisterende scenarioet med system-Chromium ga **4 bestått, 1 feil**, med samme150/903-avvik. Utslaget er dermed gjenskapt, men årsaken er ikke bekreftet. Det er registrert under [#51](https://github.com/geirskoglund/dnd-character-sheet/issues/51) og i [DAT-06](BACKLOG.md#pwa-data-og-bibliotek). Ingen ny venting/retry, testfjerning eller apprettelse er lagt inn for å få grønt resultat. En senere grønn kjøring betyr ikke at den intermitterende feilen er rettet.

Dette arbeidet endrer fortsatt bare dokumenter og Issue-tekster/merker. Ingen nye spill-/nettlesertester er skrevet og ingen fysisk iPhone-test er gjennomført. Ny CI på sluttcommit og sluttkontroll av Issues dokumenteres i leveranse-PR.
