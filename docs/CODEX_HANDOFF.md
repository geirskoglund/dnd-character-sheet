# Overlevering til Codex

## Gjeldende oppgavegrunnlag

[#25 – Felles tallendringsdialog med rullehjul](https://github.com/geirskoglund/dnd-character-sheet/issues/25) har brukerens fulle tekst med P01–P16/K1–K9, etterfulgt av akseptansekriterier og agentnotater. Den erstatter tidligere midtbåndslukking og den gamle Issue-teksten. Les Issuen som detaljert arbeidsgrunnlag; [krav §22](REQUIREMENTS.md#22-felles-tallendringsdialog) angir felles produktretning. Ingen ny appkode er bestilt gjennom denne oppgave-/dokumentoppdateringen.

GitHub har aktuelle oppgavebeskrivelser, status og prioritet. [BACKLOG.md](BACKLOG.md) har produktoversikt og tidligere kontrollgrunnlag; [BACKLOG_READY.md](BACKLOG_READY.md) er indeks og historisk klargjøring. [BACKLOG_REVIEW.md](BACKLOG_REVIEW.md) bevarer gjennomgangen i PR #53, ikke dagens tallhjulskrav. Ikke oppdater alle dokumenter eller speil statustellinger ved hver US-redigering. Bare nye fellesføringer og reelle motstrid krever dokumentendring. Bevar brukerens tekst/ID-er og hold egne tillegg separat.

## Arbeidsmåte og brukerreview

Brukeren må uttrykkelig bestille appkode. Korte bekreftelser og en bestilling av Issue-/dokumentarbeid starter ingen appendring. Ta reelle produktspørsmål én flyt om gangen og løs tekniske valg selv. Funksjons-/UI-PR skal kunne testes og må få brukerens godkjenning før merge; dette erstatter tidligere generell delegasjon av automatisk testet merge.

Testmiljøet er bestilt som egen oppgave [#55](https://github.com/geirskoglund/dnd-character-sheet/issues/55). Én fast testadresse på GitHub Pages viser valgt PR, med varige testdata isolert fra produksjon; egen testbranch er ikke nødvendig. Se [testpublisering og førstegangsbruk](TESTING.md) og [arbeidsinstruksen](../AGENTS.md). #25 implementeres separat og funksjons-PR skal testes før brukerens mergegodkjenning.

## Repo og GitHub-backlog

Issues #25–51 er opprettet med stabile BL-ID-er og prioritets-/typemerker. Ingen oppgave blir levert eller bestilt kodet av en statusendring. Historiske leveransestatuser må sammenholdes med nyere leveranser og faktisk kode.

Brukeren har opprettet [Project1](https://github.com/users/geirskoglund/projects/1/views/1), men integrasjonen avviser også lesing av det. Appens rettigheter omfatter ikke Projects; ingen tilgjengelig bryter i installasjonsinnstillingene løser dette. Innhold/rekkefølge kan ikke verifiseres her. Issues kan fortsatt administreres; se [GitHub-status](BACKLOG.md#github-backlog).

Overleveringen omfatter v0.11 og CODEX_HANDOFF, REQUIREMENTS, DATA_MODEL, DESIGN og DECISIONS. Alle er tilgjengelige. Ikke gjeninnfør den tidligere feilaktige antakelsen om en manglende ekstra forklaringsfil.

## Siste appleveranse: den godkjente utstyrsflyten

Godkjent v2-utstyrsflyt er levert i [PR23](https://github.com/geirskoglund/dnd-character-sheet/pull/23), merge `9518d8c`. Krav §16 erstattet tidligere avgrensning til isolert fil. [Før-koding-matrisen](CHARACTER_WORKSPACE.md#før-koding-kontroll-utstyrsflyt-i-hovedappen) angir scenarioene; 203 lokale tester og faktisk produktgjennomgang er dokumentert der. CI og Pages var vellykket for mergecommit; direkte ekstern Pages-røyktest var blokkert av miljøets proxy, ikke utført. [Utstyrsguiden](EQUIPMENT.md) beskriver gjeldende føring og bevarte beregninger.

Siste presisering: spør valgfritt «Hva kreves for å aktivere effekten?» med ett svar, inkludert Ikke avklart. Dette er regel-/DM-informasjon. Ikke avklart og passiv vises under Andre egenskaper. Ikke gjeninnfør obligatorisk flerkategoriplassering. Ekte karakterberegninger, én effekttekst, delte ressurser, håndvalg/kopiering og én sluttlagring skal erstatte prototypeverdiene og gammelt generisk utstyrsskjema. Eldre profiler/overstyringer/utkast skal bevares.

Løpende innspill i krav §17: installert navn **My D&D**, endelig appikon ubestemt, lavere bunnmeny ønsket spesielt i installert visning. Dette er loggført; ikon og meny er ikke ferdig levert.

## Historikk: isolert utstyrsprototype

**Nyeste oppfølging:** Brukeren har bestilt prototype v2 etter positiv veiviserreview. Samlede avklaringer står i krav §15 «Oppfølging», siste beslutningslogg og [v2-kontrollen](CHARACTER_WORKSPACE.md#før-koding-kontroll-utstyrsprototype-v2). Skadebonus/samlet skade, feltspesifikk hjelp, minsteverdi for abilities, Lagre uten bakovernavigering med lukking/siste bruksspørsmål, ingen Antall for våpen, Kopier og håndvalg samt én friteksteffekt med Combat-plassering er gjeldende. Hovedappen er fortsatt utenfor denne bestillingen.

Etter review av utstyr ønsket brukeren å prøve en ny arbeidsflyt isolert før appendring. Bestillingen er én lokal HTML-fil for Mac, ikke en produksjonsombygging eller Pages-publisering. [Krav §15](REQUIREMENTS.md#15-ny-utstyrsregistrering-isolert-prøve-før-appendring-2026-10-20), siste DECISIONS og [nyeste matrise](CHARACTER_WORKSPACE.md#isolert-utstyrsprototype-2026-10-20) bevarer avklaringene. [Prototypen](../prototypes/equipment-study/README.md) prøver en samlet gjenstand med flere virkninger, arvet våpenprofil/ikon, statbidrag/sett-til, beskyttelser og fritekstevner med valgfri bruksteller. Ingen spellkobling kreves; tilgjengelig starter på maks. Statbasert utstyrsopprettelse ble diskutert og trukket tilbake. Detaljflyten er til UX-vurdering; ikke kopier den inn i appen uten ny bestilling. Rapporterte feil i hovedappens utstyrsflate er fortsatt åpne.

## Varig prosjektminne og aktuell status

Les også [CHARACTER_WORKSPACE.md](CHARACTER_WORKSPACE.md) før videre funksjonsarbeid. Brukeren har uttrykkelig bedt om at REQUIREMENTS og DECISIONS holdes oppdatert, slik at avklaringer ikke forsvinner når samtalen komprimeres. Før oppgavedetaljer i GitHub-Issuen; oppdater felleskrav/beslutningslogg bare når en vesentlig produktføring endres, og før faktisk produktkontroll ved levering. Ikke gjeninnfør forkastede mønstre eller anta at hele SRD/Combat er ferdig bare fordi Character-flytene er utvidet. Brukeren må få fullføre løpende tilbakemeldinger før ny koding bestilles.

Gjeldende uttrykk er Eventyrjournal, med den nye [prøveversjonen av veiviserflyter](GUIDED_WORKFLOWS.md): Character/Combat/Magi/Utstyr og Meny, kontekstfiltre, forberedelse, automatiske slots/Hit Dice, enkle beholdninger/hvile og tallhjul. Nyere krav §13–14 og WORKFLOW_REVIEW erstatter tidligere slider-/trefane-/per-terning-forslag. Tidligere bestilt implementasjon er levert gjennom de historiske PR-ene. Ny funksjons-/UI-PR krever brukerens test og godkjenning før merge; saml arbeid, ingen merge per kommentar.

Proficiencies, skadeegenskaper og tilstandsimmunitet beholder eksisterende funksjon; ny forenkling er uttrykkelig utsatt. Samlet ny kort-hvileflyt, avansert skadeberegning, komplett SRD/standardhandlinger og ikke-SRD-klasseregler er fortsatt åpne krav. Ikke gjeninnfør rå terningkast som obligatorisk Hit Dice-føring eller generisk spell-slot/HitDice-type i vanlig Ny beholdning. Appen erstatter papirarket, ingen automatisk karakterbygger.

Ny oppdateringsrapport: også en app som står synlig åpen skal oppdage publiserte versjoner; hvert minutt/fokus/online/manuell sjekk, eksplisitt Oppdater appen. Bevar utkast, andre faner og lokale karakterer. Se UPDATES og reell ende-til-ende-test av to service-worker-utgaver.

## Før du endrer appen
1. Les [REQUIREMENTS.md](REQUIREMENTS.md), [DATA_MODEL.md](DATA_MODEL.md), [DESIGN.md](DESIGN.md), [DECISIONS.md](DECISIONS.md).
2. Bruk [v0.11-prototypen](../prototypes/dnd-character-companion-v0.11.html) **kun som UX-referanse**. Den har kjente regresjoner og er ikke autoritativ kilde.
3. Inspiser eksisterende repo og identifiser allerede implementerte deler. **Ikke anta at gammel GitHub Pages-side eller prototype v0.11 tilfredsstiller kravene.**
4. Lag en kort gjennomføringsplan med små, etterprøvbare etapper og tydelig teststrategi. Du står fritt til å velge rammeverk og arkitektur som egner seg for GitHub Pages + IndexedDB + offline-first PWA.
5. Oppretthold tydelig skille mellom SRD 5.1-data, custom innhold og konkrete karakterinstanser. Sjekk lisens/attribusjon og kilde før import av regeldata.

## Foreslått implementasjonsrekkefølge
- **Grunnlag:** modulær arkitektur, IndexedDB med migrering, stabil karaktermodell, dataimport/-eksport, enkel navigasjon, tester.
- **Karakterark:** redigerbare verdier, modifierfavoritter, egne features/feats, utstyr, spells, strukturerte proficiencies/damage defenses, notater og portrett.
- **Combat:** genererte handlingsoppslag, tre faner, separate features, begrensede ressurser, short/long rest, manuelle overstyringer.
- **«Ta skade»:** avgrenset beregningsmotor, flere damage types, hver betinget modifier, temp HP, forklarbar breakdown, atomisk commit + undo.
- **Design:** 2–3 visuelle retninger for godkjenning, deretter konsistent implementasjon.
- **Kvalitet:** automatiserte enhets-/integrasjons-/UI-tester, offline- og backup-test, tilgjengelighet og mobilregresjon.

## Viktigste kjente feil fra prototypeprosessen
- + rendret som sirkel og tvunget til egen rad, tross krav om inline pille.
- Feat kan ikke legges til pålitelig via UI.
- Fungerende resistance-/vulnerability-UI forsvant fra «Ta skade».
- Beregningsresultat var for ugjennomsiktig («Etter modifikatorer»).
- «Rediger øvrige felt»-popup dupliserte notat/bakgrunn og erstattet ikke strukturerte data.
- Cantrips falt bort fra Combat i en tidligere versjon.
- Generelle tomme knapper og layout-regresjoner ble gjentatt.
Bygg regresjonstester som forhindrer disse feilene.

## Akseptansekriterium for PR-er
- Inkluder hva som faktisk er implementert og vist på mobil, hvilke automatiske tester som er kjørt, og eventuelle uavklarte valg.
- Ikke presenter statiske demo-knapper som ferdig funksjonalitet.
- Ikke implementer funksjoner fra forkastede retninger (turstyrer, AC hit check, auto level-up).
- **Be om eksplisitt produktavklaring** hvis krav kolliderer; ikke la prototypekode overstyre dokumentene.

## Retningslinje for samarbeid
Codex **eier testopplegg og kode**. Brukeren **eier funksjonelle beslutninger og designgodkjenning**. Praktiske forslag og opprydding er velkomne, men skal ikke stille om produktets mål.

## Kvalitetskontroll av brukerflyt før levering

Gå gjennom hver implementert flyt fra brukerens utgangspunkt på mobil. Oppslag har én Lukk-knapp; redigering har ulike lagre-/avbryt-handlinger. + skal starte valg/opprettelse direkte, og en lagret pille skal åpne sin egen post. Bevar utkast ved avbrutt sletting, fokus/scroll ved retur og felt/søk ved lagringsfeil. Uendrede lagringer skal ikke fylle historikk eller forstyrre Angre. Test antall steg og knappenes formål i tillegg til at data blir lagret. Se [gjennomgangen og regresjonene](UX_REVIEW.md).

## Nyeste leveranse: illustrerte spørsmål og gjenopptakbare utkast

Brukeren bestilte ett valg/en verdi per skjerm, direkte Ja/Nei, illustrerte d4/d6/d8/d10/d12 og Annet, forklaringer og bare grafisk fremdrift. Dette erstatter tidligere samling av beslektede felter. X/Escape lagrer svar/posisjon; Fullfør bekrefter og fjerner utkastet atomisk; Forkast er separat. Utstyr viser egne utkast, Meny viser alle utkast inkludert ny karakter. Ved redigering består siste bekreftede post/Combat til fullføring. Ingen karakterhistorikk for utkast.

`domain/wizard-draft.ts`, `storage/wizard-drafts.ts` og felles `ui/wizard.ts` håndterer dette. Eget revisjonstall beskytter utkast i flere faner; karakterens revisjon og originalpost beskytter ferdige data. Schema2/DB3 beholdes; valgfrie `wizardDrafts` følger backup. Penger har hele GP/00–99 i to hjul, eksakt CP-lagring og direkte innskriving. Trekanten er gjeninnført på HP/temp HP i Combat. Se [betjening og produktbilder](GUIDED_WORKFLOWS.md#illustrert-spørsmålsveiviser-og-utkast) og siste kontrollmatrise.

Tidligere utsatte proficiencies/skadeegenskaper/immuniteter og samlet ny kort-hvileflyt er ikke del av denne bestillingen. Avansert manuell detaljflate er beholdt; den er ikke erklært omdesignet til spørsmål. Fysiske terninger/spiller/DM vurderer fortsatt regler og fritekstvilkår.
