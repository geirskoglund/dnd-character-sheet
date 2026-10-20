# Produktgjennomgang og backlog

Gjennomgått 2026-10-20 mot `master` **9518d8c** (PR #23). Dette er en dokumentleveranse: ingen appkode endres. Brukeren har bestilt opprettelse av GitHub-backloggen i rekkefølgen nedenfor og fullføring av dokumentasjons-PR #24. Opprettelse og prioritering er ikke en implementasjonsbestilling.

Målet er fortsatt å erstatte papirkarakterarket. Oversikten tar med både levert funksjonalitet, opprinnelige udekkede krav, senere innspill og løsninger som er erstattet. Utsatt arbeid er ikke slettet fra produktomfanget.

Første gjennomgang omfatter **114 kontrollpunkter**:

| Status | Antall |
| --- | --- |
| Levert innen beskrevet omfang | 61 |
| Delvis levert | 26 |
| Mangler | 11 |
| Rapportert feil | 1 |
| Avklares | 5 |
| Erstattet av nyere beslutning | 10 |

De 38 delvise/manglende/feil-punktene er samlet i **27 foreslåtte backlog items**, BL-01–27. Fem avklaringspunkter beholdes synlig; skadeflytens avklaring inngår også i BL-20. Dette er en opptelling av denne gjennomgangens oppdeling, ikke et endelig tak på arbeidet eller et tidsestimat.

## GitHub-backlog

De 27 oppgavene er opprettet som [GitHub Issues i opprinnelig arbeidsrekkefølge](https://github.com/geirskoglund/dnd-character-sheet/issues?q=is%3Aissue%20is%3Aopen%20label%3Abacklog%20sort%3Acreated-asc), med direkte lenker i arbeidslisten nedenfor. De er åpne og merket `backlog`, `prioritet: P1/P2/P3` og `type: …`. BL-ID-en er stabil identitet, ikke et løfte om uforanderlig prioritet. Metadata og rekkefølge i oppgavebeskrivelsen er opprettelsesgrunnlaget; endrede prioritets-/typemerker er gjeldende i GitHub.

**Project er blokkert av tilgangen:** GitHub avviste opprettelse av «My D&D – Backlog» med `Resource not accessible by integration (createProjectV2)`. Ingen Project, tabellvisning eller dra-og-slipp-rekkefølge er opprettet. Issues-listen er en fungerende midlertidig arbeidsliste, ikke en erstatning for Project-funksjonen. GitHub-tilkoblingen må få Project-skrivetilgang, eller eieren kan opprette og legge oppgavene i et Project via [Projects-siden](https://github.com/users/geirskoglund/projects). Repoets native Issue Types er ikke tilgjengelige; type vises derfor med merker.

Appoppgavene er fortsatt ikke påbegynt. Krav og beslutninger vedlikeholdes i repoet; konkrete avklaringer/testbevis på en Issue skal tilbakeføres dit ved levering.

## Hvordan oversikten brukes

- **Levert:** kan kvitteres ut for det beskrevne omfanget på grunnlag av kode og navngitte testscenarioer. Betyr ikke at all D&D-regeldekning eller fysisk iPhone-kontroll er ferdig.
- **Delvis:** noe fungerer, men et uttrykkelig krav eller nødvendig brukerflyt gjenstår. Det som mangler står i raden.
- **Mangler:** ingen tilsvarende ferdig appflyt funnet.
- **Feil:** observert avvik, med angitt skille mellom brukerens observasjon og egen kontroll.
- **Avklares:** kilden, produktvalget eller akseptansen må avklares; ingen antatt kodebestilling.
- **Erstattet:** bevares for sporbarhet, men skal ikke implementeres etter gammel beskrivelse.

Matrisen teller kontrollpunkter. Arbeidslisten grupperer sammenhengende kontrollpunkter til leveranser; disse tellingene er derfor forskjellige. Et punkt er ikke en oppgave per felt, terningtype eller katalogpost. Nye funn kan gi ytterligere oppdeling.

Kravspesifikasjonen beskriver produktet, beslutningsloggen bevarer avklaringer, denne filen styrer status og foreslått rekkefølge. Historiske leveransematriser i CHARACTER_WORKSPACE beholdes som kontrollbevis. Nyere eksplisitte avklaringer går foran gamle statuser og prototypefeil.

## Undersøkte kilder

| Referanse | Materiale og hva som er kontrollert |
| --- | --- |
| K1 | [Opprinnelig REQUIREMENTS](https://github.com/geirskoglund/dnd-character-sheet/blob/0d03be3/docs/REQUIREMENTS.md), [opprinnelig handoff](https://github.com/geirskoglund/dnd-character-sheet/blob/a34c5d9/docs/CODEX_HANDOFF.md), opprinnelig DATA_MODEL/DESIGN/DECISIONS i Git-historikken. Sammenholdt med dagens [krav](REQUIREMENTS.md), [datamodell](DATA_MODEL.md), [design](DESIGN.md), [beslutninger](DECISIONS.md) og [handoff](CODEX_HANDOFF.md). |
| K2 | [Faktisk v0.11](../prototypes/dnd-character-companion-v0.11.html), innført i ef9fa3a: Character/Combat, alle funksjoner og handlingsgrener, bibliotek, oppslag, ressurser, hvile og skadekalkulator. Kodegjennomgang i denne runden; tidligere visuell kjøring står i [prototypegjennomgangen](PROTOTYPE_REVIEW.md). Prototypen inneholder også forkastede mønstre. |
| K3 | [Arbeidsflytavklaringer](WORKFLOW_REVIEW.md), [gjeldende flyter](GUIDED_WORKFLOWS.md), [utstyrskontrakt](EQUIPMENT.md), [godkjent utstyrsprototype v2](../prototypes/equipment-study/README.md), [papirarkreferanser](PAPER_SHEET_REVIEW.md). |
| K4 | [Krav- og kontrollhistorikk](CHARACTER_WORKSPACE.md), [UX-review](UX_REVIEW.md), [Eventyrjournal](EVENTYRJOURNAL.md), [oppdateringsflyt](UPDATES.md), [siste produktreview](reviews/equipment-app/README.md). Historiske «mangler» er kontrollert mot nyere kode, ikke summert direkte. |
| K5 | Samtaleinnspill etter PR #23: individuelt vanlig utstyr, Forbruk, standardvarer, enkel telling/påfyll, tallhjulets midtbånd og rapportert dobbelttrykk i installert iPhone-app. Disse er nå bevart i krav §18 og beslutningsloggen. |

**Overleveringsgrunnlaget er tilgjengelig og gjennomgått:** v0.11 og CODEX_HANDOFF, REQUIREMENTS, DATA_MODEL, DESIGN og DECISIONS er materialet som den tidligere bekreftede overleveringen viser til. Brukeren viste denne bekreftelsen i oppfølgingen. Første utgave av gjennomgangen førte feilaktig en antatt ekstra forklaringsfil som AVK-01. Punktet er fjernet; det foreligger ikke grunnlag for å be brukeren finne en ytterligere fil. Øvrige ID-er beholdes.

Kontrollgrunnlaget er nåværende kode og eksisterende testscenarioer, supplert med dokumenterte tidligere produktkontroller og brukerens ferske feilrapport. Ingen ny fysisk iOS-test, full tilgjengelighetsrevisjon eller komplett kontroll av hver SRD-tekst er utført. Detaljene nedenfor angir disse grensene.

## Samlet statusmatrise

### Grunnlag og karakteradministrasjon

| ID | Ønsket funksjonalitet / kilde | Status | Kontrollgrunnlag og eventuell rest |
| --- | --- | --- | --- |
| GR-01 | Modulær mobilførst-app uten backend, statisk Pages-publisering. K1 | Levert | [Arkitektur](ARCHITECTURE.md), [CI](../.github/workflows/ci.yml), [Pages](../.github/workflows/pages.yml), [Pages-/offline-test](../tests/e2e/characters.spec.ts). |
| GR-02 | IndexedDB, skjemaversjoner og atomiske migreringer. K1 | Levert | [Repository](../src/storage/database.ts), [migreringstester](../tests/migrations.test.ts): historikk/undo og rollback ved ugyldig data. |
| GR-03 | Separate karakterinstanser, katalogreferanser og egne verdier. K1 | Levert | [Modell](../src/domain/model.ts), [lagringstester](../tests/storage.test.ts): stabile IDs, kopireferanser og isolasjon. |
| GR-04 | Offline karakterføring og lokale katalogoppslag etter caching. K1 | Levert | [Offline-scenarioer](../tests/e2e/characters.spec.ts), [katalogtest](../tests/e2e/workspace.spec.ts); ingen regel-API under spill. |
| ADM-01 | Opprette en eksisterende karakter direkte, uten tidligere level-ups. K1 | Levert | [Karakterform](../src/ui/character-form.ts), [opprettelsestest](../tests/e2e/foundations.spec.ts); nåværende klassenivå/HP registreres direkte. |
| ADM-02 | Tomt navn, hint frem til fokus; minimal opprettelse uten AC/temp HP/utstyr. K1 og senere avklaring | Levert | [Foundations-test](../tests/e2e/foundations.spec.ts): minimal creation. Navn må fylles før ferdig lagring, men ingen forhåndsutfylt eksempelverdi. |
| ADM-03 | Species, klasse og subclass velges fra lister, med egne alternativer. K1 | Levert | [Katalog](../src/domain/catalog.ts), [klasse-/custom-test](../tests/e2e/foundations.spec.ts). Katalogens innholdsdekning vurderes separat i KAT-03. |
| ADM-04 | Redigere/bytte karakter; huske valgt karakter over reload. K1/K2 | Levert | [Livssyklustest](../tests/e2e/characters.spec.ts), [repositorytest](../tests/storage.test.ts). |
| ADM-05 | Uavhengig karakterkopi, inklusive egne koblinger og portrett. K1 | Levert | [Kopitest](../tests/storage.test.ts), [UI-backup/kopi](../tests/e2e/workspace.spec.ts), [item-referanser](../tests/item-effects.test.ts). |
| ADM-06 | Slette valgt karakter med bekreftelse, uten å berøre andre. K1 | Levert | [Livssyklustest](../tests/e2e/characters.spec.ts), [lagringstest](../tests/storage.test.ts). Gjenoppretting av slettet karakter er et separat åpent valg, AVK-04. |
| ADM-07 | Karakteradministrasjon og grunnlagsredigering bare i tilgjengelig meny. K1 og senere avklaring | Levert | [Meny](../src/main.ts), [design-/identitetstest](../tests/e2e/design.spec.ts). |
| ADM-08 | Manuell Level Up med ny samlet maks HP, valgt klasse/subclass, samlet angre. K1 | Levert | [Nivåfunksjon](../src/domain/level-up.ts), [domene](../tests/level-up.test.ts) og [UI](../tests/e2e/foundations.spec.ts). Ingen automatisk healing eller tildeling av feats/spells. |

### Character og grunnverdier

| ID | Ønsket funksjonalitet / kilde | Status | Kontrollgrunnlag og eventuell rest |
| --- | --- | --- | --- |
| KAR-01 | Kompakt identitet, portrett/placeholder og topp som scroller bort. K1 og designavklaringer | Levert | [Views](../src/main.ts), [design-test](../tests/e2e/design.spec.ts), [portrett/backup](../tests/e2e/workspace.spec.ts). |
| KAR-02 | Fem like statusfelt: HP/AC/Initiative/GP/Speed; temp HP bare i Combat. K1, senere presisering | Levert | [Views](../src/ui/views.ts), [foundations](../tests/e2e/foundations.spec.ts). |
| KAR-03 | Fire konfigurerbare modifierfavoritter med fulle navn og alfabetisk velger. K1/K2 | Levert | [Modifiers](../src/domain/modifiers.ts), [favorittscenario](../tests/e2e/foundations.spec.ts). Valg av samme verdi lager ingen ny hendelse. |
| KAR-04 | Seks ability scores med modifier, proficiency/expertise og manuelle totaler. K1 | Levert | [Modifiertest](../tests/modifiers.test.ts), [proficiency-UI](../tests/e2e/workspace.spec.ts). Redigering av grunnscore ligger i menyen. |
| KAR-05 | AC og speed følger kjent art, klasse, armor/skjold; manuelle overstyringer. K1, senere rettelse | Levert | [Derived](../src/domain/derived.ts), [regelforventninger](../tests/derived.test.ts), [utstyrstest](../tests/equipment.test.ts). Avgrenset støttede regler, ikke all klasse-/magiautomatikk. |
| KAR-06 | Språk som egne redigerbare poster, også artens basisvalg. K1/K2 | Levert | [Records](../src/domain/records.ts), [språk/UI/backup](../tests/e2e/workspace.spec.ts); artsdata kopieres ikke dobbelt. |
| KAR-07 | Proficiencies: skills/saves/expertise, våpen/armor/verktøy/annet. K1 | Delvis | Reell CRUD/beregning i [editor](../src/ui/record-editors.ts), testet i workspace. Brukerens ønskede enklere registreringsflyt er utsatt; våpen/armor/verktøy bruker fortsatt navnefelt fremfor gjennomarbeidede direktevalg. |
| KAR-08 | Skadeegenskaper: resistance/vulnerability/immunity og vilkår. K1 | Delvis | Strukturerte poster med samtidig resistance/vulnerability er [testet](../tests/e2e/workspace.spec.ts). Gammelt skjema/datalist og teknisk vilkårsfelt gjenstår å forenkle; HP bruker dem ikke, se SKA. |
| KAR-09 | Tilstandsimmunitet skal være forståelig og lett å velge. K1 og brukerreview | Delvis | [Editor](../src/ui/record-editors.ts) lagrer strukturert conditionId, men UI er fortsatt tekst med datalist. Ingen automatisk blokkering av tilstander er bestilt. Kort forklaring/vanlige valg/egenregistrering gjenstår. |
| KAR-10 | Inspiration, death saves, conditions og exhaustion kan føres manuelt. K1/K2 | Levert | [Editor](../src/ui/record-editors.ts), [persistensscenario](../tests/e2e/workspace.spec.ts). Ingen automatisk ekstern buff-/tilstandsmotor. |
| KAR-11 | Flere navngitte notater uten duplisert Bakgrunn-del. K1/K2 | Levert | [Notatflyt](../src/main.ts), [avbryt/slett/angre](../tests/e2e/interactions.spec.ts). |

### Egenskaper og magi

| ID | Ønsket funksjonalitet / kilde | Status | Kontrollgrunnlag og eventuell rest |
| --- | --- | --- | --- |
| EGN-01 | Søkbart lokalt bibliotek og fungerende feat-/egenskapsvalg. K1/K2 | Levert | [Library picker](../src/ui/library-picker.ts), [katalog/CRUD](../tests/e2e/workspace.spec.ts). Bare SRD-feat er inkludert; ikke et komplett bokbibliotek. |
| EGN-02 | Mine klasser som standard; én type Egenskaper/Feats, riktig klassesortering. K3 | Levert | [Filtertest](../tests/e2e/workflows.spec.ts): egne klasser først, Mine/Alle, generelle feats beholdes. Gamle åpne avvik er erstattet av denne leveransen. |
| EGN-03 | Relevans etter faktisk klassenivå/subclass og kjente forutsetninger; ukjente/DM-valg beholdes. K1/K3 | Levert | [Eligibility](../src/domain/magic.ts), [workflow-tester](../tests/workflows.test.ts). Gjelder distribuert strukturert SRD-metadata; videre innhold tas i KAT-03/04. |
| EGN-04 | Egne features/feats med handling, pool og betinget effekt. K1 | Delvis | [Editor](../src/ui/record-editors.ts), [koblingstest](../tests/e2e/workspace.spec.ts). Fungerer, men Flere detaljer åpner fortsatt langt skjema; ny enkel veiviser dekker ikke alle disse feltene. |
| EGN-05 | Flere kildebundne handlinger/ressurser/effekter og eventuell nyttig aktivstatus. K1 | Delvis | [Modell](../src/domain/model.ts) og [kopi/backup](../tests/storage.test.ts) bevarer referanser. Editor håndterer hovedsakelig første private underpost; øvrige importerte koblinger mangler komplett redigeringsflyt. Aktivstatus har ikke egen generell UI; konkret behov må vurderes. |
| MAG-01 | Egen Magi-fane, cantrips/spells tilgjengelige utenfor Combat. K1/K3 | Levert | [Magic view](../src/ui/views.ts), [workflow](../tests/e2e/workflows.spec.ts). |
| MAG-02 | Spells/cantrips filtreres på karakterens kilder og klassenivå; Vis alle og DM-unntak. K1/K3 | Levert | [Magic](../src/domain/magic.ts), [Wizard-/multiclass-/ekstratilgangstest](../tests/workflows.test.ts), [UI](../tests/e2e/workflows.spec.ts). Wizard-skole begrenser ikke skolene generelt. |
| MAG-03 | Flere tilgangskilder, også art, feat, subclass og utstyr. K1/prinsipp om kontekst | Delvis | Tiefling, støttede subclasses og eksplisitt feature-tilgang fungerer. [spellSources](../src/domain/magic.ts) leser ikke generelle item-kilder eller alle subrace-/featregler. Friteksteffekt uten spellkobling fungerer separat og skal bevares. |
| MAG-04 | Known/spellbook/prepared og klassevise forberedelsesregler. K1/K3 | Levert | [Preparation](../src/ui/preparation.ts), [Wizard/Cleric/free domain/DM-grense](../tests/e2e/workflows.spec.ts). Registrert innhold beholdes når kontekst endres. |
| MAG-05 | Standard slots fra klasse/nivå, multiclass og separat Pact Magic. K3 | Levert | [Slot progression](../src/domain/magic.ts), [standardressurser](../src/domain/resource-setup.ts), [workflow-tester](../tests/workflows.test.ts). SRD full-/halv-castertabeller; tredjedels-castere er MAG-10. |
| MAG-06 | Ett slotnivå per oppslag; bruk/gi tilbake/manuell maks og bevart brukt antall ved level-endring. K1/K3 | Levert | [Resource dialog](../src/ui/resource-dialogs.ts), [nivå/override/undo](../tests/e2e/workflows.spec.ts). Ingen automatisk slotbruk når et oppslag åpnes. |
| MAG-07 | Spelloppslag med tid, rekkevidde, varighet, concentration, ritual, components og upcasting-tekst. K1/K2 | Levert | [Instansiering](../src/domain/character-library.ts), [oppslag](../src/main.ts), [offline custom-spell-test](../tests/e2e/workspace.spec.ts). Beregnede karakterverdier vurderes separat i MAG-08/09. |
| MAG-08 | Spell attack/save DC på det aktuelle Combat-oppslaget. K1 §3/K2 openDetail | Delvis | Magi viser klassevis attack/DC, men [Combat-oppslaget](../src/main.ts) viser lagret generell attack/save-tekst. Fire Bolt instansieres som «ranged spell attack», uten d20+karakterbonus; ingen dynamisk DC her. |
| MAG-09 | Korrekt nivåtilpasset cantrip-skade og tydelig upcasting-oppslag. K1 §3/K2 | Delvis | [Spellkatalogen](../src/domain/character-library.ts) lagrer grunnskade og hele regelteksten. Fire Bolt viser 1d10 også ved høyere totalnivå; scaling må leses fra teksten. Trygg, avgrenset oppslagsstøtte gjenstår; ingen digitale kast eller automatisk casting bestilt. |
| MAG-10 | Registrere ikke-SRD-/tredjedels-castere uten feilaktige automatiske forventninger. K1/K3 | Delvis | Custom klasser, manuelle pools/spells og tilgang finnes. Automatiske subclass-tabeller som Eldritch Knight/Arcane Trickster støttes ikke. Omfanget for ytterligere automatikk må avklares. |
| MAG-11 | Egne spells/cantrips med kort normalflyt og frivillige detaljer. K1/K3 | Delvis | [Guided records](../src/ui/guided-records.ts) dekker navn/nivå/tekst/kilde. [Detaljeditoren](../src/ui/record-editors.ts) er fortsatt et langt skjema for andre spellverdier. Prinsippet om ett spørsmål er ikke fullført for hele redigeringen. |

### Utstyr

| ID | Ønsket funksjonalitet / kilde | Status | Kontrollgrunnlag og eventuell rest |
| --- | --- | --- | --- |
| UTS-01 | Egne grupper, i bruk først, + direkte til riktig katalog, Søk-hint, Opprett eget nederst. K2/K3 | Levert | [Utstyrspicker](../src/ui/equipment-picker.ts), [views](../src/ui/views.ts), [item-UI-test](../tests/e2e/item-effects.spec.ts), [produktreview](reviews/equipment-app/README.md). |
| UTS-02 | Konkrete standardvåpen/armor med arvede regler og ikon, egne navn/varianter. K1/K3 | Levert | [Katalog](../src/domain/catalog.ts), [weapon-profiltester](../tests/equipment.test.ts), [ny veiviser](../src/ui/equipment-wizard.ts). |
| UTS-03 | Karakterens våpenangrep/skade med proficiency, ability, håndbruk og manuelle totaler. K1/K2 | Levert | [Equipment-domene](../src/domain/equipment.ts), [regelforventninger](../tests/equipment.test.ts). Omfatter støttede Fighting Styles/Martial Arts; ikke alle særregler. |
| UTS-04 | Armor/skjold/kappe og attunement gir forklarbare samlede bidrag; advarsel uten blokkering. K1/K3 | Levert | [AC19/saves/attunement](../tests/equipment.test.ts), [UI](../tests/e2e/equipment.spec.ts). Ingen påkrevd figur eller kroppsslotmodell. |
| UTS-05 | Skadebonus og flere ekstraskader med egne terninger/type/betingelse. K3 | Levert | [Item effects](../tests/item-effects.test.ts), [veiviser/Combat](../tests/e2e/item-effects.spec.ts). Tekstvilkår tolkes av spiller/DM. |
| UTS-06 | Item-virkninger på ability, AC, speed, initiative, skills/saves og maks HP; «hev til minst». K3 | Levert | [Item effects](../src/domain/item-effects.ts), [tester](../tests/item-effects.test.ts). Grunnscore bevares; CON-endring rekonstruerer ikke historisk HP. |
| UTS-07 | Samlet gjenstand med beskyttelser, én friteksteffekt og valgfri delt bruksteller. K3 | Levert | [Magic Mist-test](../tests/e2e/item-effects.spec.ts), [ressurs/rest/kopi/backup](../tests/item-effects.test.ts). Beskyttelse vises, men automatisk skaderesolusjon mangler, SKA. |
| UTS-08 | Raske brukskontroller øverst; kopier og relevante venstre/høyre/begge-hender-valg. K3 | Levert | [Oppslag](../src/ui/equipment-wizard.ts), [to dolker/off-hand](../tests/item-effects.test.ts), [UI](../tests/e2e/item-effects.spec.ts). Ingen fast kobling av venstre hånd til Bonus. |
| UTS-09 | Ingen antallspørsmål for individuelle våpen; eldre antall bevares til eksplisitt save. K3 | Levert | [Legacy quantity-test](../tests/e2e/item-effects.spec.ts). Nyere ønske om samme prinsipp for vanlig annet utstyr er UTS-10. |
| UTS-10 | Vanlig armor, ringer, amuletter mv. føres enkeltvis; Kopier erstatter Antall. K5 | Delvis | Kopier finnes, men [veiviser](../src/ui/equipment-wizard.ts) spør fortsatt om quantity for ikke-våpen. Krever trygg behandling av eksisterende stabler; ikke endre dem stille. |
| UTS-11 | Egen kategori Forbruk under Utstyr. K5 | Mangler | [Views](../src/ui/views.ts) har bare Weapons / Armor og skjold / Annet utstyr. |
| UTS-12 | Standard ammunisjon, vanlige potions og mat velges ferdig. K5 | Delvis | Katalogen har Arrow, Crossbow bolt, Sling bullet og Rations (1 day), men ingen ferdig potionkatalog eller Forbruk-presentasjon. Avgrens ordinære SRD-varer; ikke opprett alle tenkelige magiske varianter. |
| UTS-13 | Raskt føre forbruk og fylle på en beholdning, også fra null. K5 | Mangler | Quantity finnes i gammel redigering, men ingen egen enkel Forbruk-flyt. Forslag: −1 med Angre, legg til ønsket antall, behold rad ved null. Ingen automatisk piltrekk fra våpenoppslag. |
| UTS-14 | Sammenhengende redigering, kontekstuell hjelp, direkte Lagre/lukk og siste bruksspørsmål. K3 | Levert | [Veiviser](../src/ui/equipment-wizard.ts), [item-UI](../tests/e2e/item-effects.spec.ts), [produktreview](reviews/equipment-app/README.md). Gamle utkast bruker separat kompatibilitetsflyt. |

### Combat og innkommende skade

| ID | Ønsket funksjonalitet / kilde | Status | Kontrollgrunnlag og eventuell rest |
| --- | --- | --- | --- |
| KAM-01 | Tre Combat-kategorier med trykk/sveip, egen Andre egenskaper og verktøy under. K1/K2 | Levert | [Views](../src/ui/views.ts), [sveiptest](../tests/e2e/design.spec.ts). Tom Andre egenskaper-overskrift skjules. |
| KAM-02 | Oppslag fra aktive våpen, tilgjengelige spells og eksplisitt registrerte handlinger/item-effekter. K1/K2 | Levert | [Combat view](../src/ui/views.ts), [workflow-/item-tester](../tests/e2e/workflows.spec.ts). Kildedata deles; bredere autogenerering er KAM-04. |
| KAM-03 | Unarmed Strike, Grapple, Shove og øvrige relevante standardhandlinger; generelle sist. K1/K2 basicActions | Mangler | Ingen standard-action-liste i [Combat view](../src/ui/views.ts). Også Dash/Disengage/Dodge/Help/Hide/Ready/Search/Use an Object/Opportunity Attack i prototypen må vurderes, ikke bare tre navngitte handlinger. |
| KAM-04 | Klasse-/arts-/featvalg gir sine relevante Combat-oppslag uten manuell duplisering. K1/K2 | Delvis | [instantiateFeature](../src/domain/character-library.ts) gir tomme actionRefs. Utvalgte pools opprettes, men katalogvalgt Second Wind/Action Surge blir ikke automatisk egne action-/other-oppslag. Manuell kobling finnes. |
| KAM-05 | Ressurs knyttet til oppslag kan føres fra Combat, uten brukt-turtilstand. K1/K2 | Levert | [Action resource lookup](../src/main.ts), [item-teller](../src/ui/equipment-markup.ts), [delte ressurser](../tests/e2e/item-effects.spec.ts). Ingen «Ferdig med tur». |
| KAM-06 | Kort detaljoppslag med én lukkeknapp, fysiske terninguttrykk, ∞/spellnivå. K1/K2 | Delvis | Én lukk og merker fungerer og er [testet](../tests/e2e/interactions.spec.ts). Våpen har faktiske beregninger; spell-/klasseoppslag trenger MAG-08/09 og KAM-04. |
| SKA-01 | En eller flere innkommende skadeposter med hver sin skadetype. K1 §4/K2 openDefense | Mangler | «Ta skade» går til [editHitPoints](../src/main.ts); bare ett signert HP-delta, ingen damage components. |
| SKA-02 | Relevante lagrede defenses/item-/feature-effekter foreslås hver for seg. K1 §4 | Mangler | Strukturerte data finnes, men [HP-kontroll](../src/ui/hp-control.ts) anvender dem ikke. Ikke kvitter ut på grunnlag av defense-CRUD. |
| SKA-03 | Ukjente vilkår bekreftes; hver effekt kan overstyres for én hendelse uten permanent endring. K1 §4 | Mangler | Ingen hendelsesspesifikk modifierflyt. Må også unngå dobbeltføring når DM allerede har regnet inn en reaksjon. |
| SKA-04 | Flat reduksjon, resistance/vulnerability samtidig, immunity og 2014-rekkefølge/avrunding/scope. K1 §4 | Mangler | Effektmodell er lagret, ingen implementert samlet skadekalkulator. Ikke kopier prototypens hardkodede HAM-navnematch. |
| SKA-05 | Etterprøvbar breakdown og kort forklaring til DM. K1 §4/K2 drawResult | Mangler | Vanlig HP-preview forklarer ikke hver skadeeffekt. |
| SKA-06 | Samlet skade lagres atomisk med temp HP først, bekreftelse og én Angre. K1 §4 | Delvis | Enkel HP-justering har allerede [temp/HP/undo](../tests/e2e/foundations.spec.ts). Hele sammensatte hendelsen og kombinasjonstestene gjenstår. |

### Beholdninger, HP, penger og hvile

| ID | Ønsket funksjonalitet / kilde | Status | Kontrollgrunnlag og eventuell rest |
| --- | --- | --- | --- |
| BEH-01 | HP-preview, skade fra temp først, healing kun vanlig HP, grense ved null/maks, eksplisitt lagring. K1/K3 | Levert | [Derived/item HP](../src/domain/derived.ts), [UI/zero/retry/undo](../tests/e2e/workflows.spec.ts), [HP-tester](../tests/e2e/design.spec.ts). |
| BEH-02 | Temporary HP er en egen valgt total; ikke automatisk stabling. K1/K2 | Levert | [Temp-HP-dialog](../src/main.ts), [foundations-test](../tests/e2e/foundations.spec.ts). |
| BEH-03 | Penger i GP med to separate hjul, eksakt heltall CP og direkte innskriving. K1/K3 | Levert | [Money](../src/domain/money.ts), [money-control](../src/ui/money-control.ts), [todelt hjul/undo](../tests/e2e/illustrated.spec.ts). |
| BEH-04 | Hit Dice fra klasse/nivå, telling per type og separat manuell HP-endring. K3 | Levert | [Standardressurser](../src/domain/resource-setup.ts), [count-only](../tests/e2e/workflows.spec.ts). Ingen rå kast/CON-registrering kreves. |
| BEH-05 | Vanlig Ny beholdning uten Hit Dice-/spell-slot-typevalg. K3 | Levert | [Resource wizard](../src/ui/resource-dialogs.ts); slots/Hit Dice har egne manuelle oppsett. Maks/tilgjengelig kan korrigeres. |
| BEH-06 | Kjente begrensede klasseegenskaper får sikre beholdninger; delte kilder og manuelle unntak. K1/K3 | Delvis | [Standardressurser](../src/domain/resource-setup.ts) støtter utvalgte Ki/Rage/Second Wind/Action Surge mv., [testet](../tests/workflows.test.ts). Ikke komplett SRD-evnedekning; utvid sammen med konkrete oppslag, ikke generell motor. |
| BEH-07 | Lang hvile viser faktiske endringer, riktig Hit Dice-budsjett, samlet commit/Angre. K1/K3 | Levert | [Rest dialog](../src/ui/resource-dialogs.ts), [multiclass/betinget gjenoppretting](../tests/workflows.test.ts), [UI-feil/retry](../tests/e2e/workflows.spec.ts). Conditions/exhaustion er manuelt avklart. |
| BEH-08 | Enkel samlet kort-hvileflyt, med telling og eventuelt ett totalt HP-delta. K1/K3 | Delvis | Kort hvile gjenoppretter relevante pools, men Hit Dice og HP må fortsatt åpnes/føres hver for seg. Ny samlet UX ble uttrykkelig utsatt; rå terningregistrering er forkastet. |
| BEH-09 | Arcane Recovery og andre særregler bruker spilledag/DM, ikke kalenderautomatikk. K1 | Levert | [Special recharge](../src/domain/resource-setup.ts), [tester](../tests/workflows.test.ts). Slots korrigeres manuelt; ingen spilledagskalender er påkrevd. |

### Design, veivisere og fysisk mobil

| ID | Ønsket funksjonalitet / kilde | Status | Kontrollgrunnlag og eventuell rest |
| --- | --- | --- | --- |
| UX-01 | Godkjent fantasy-uttrykk: Eventyrjournal, mynter, lokale fonter, ikoner/placeholder. K1 og designvalg | Levert | [Designleveranse](EVENTYRJOURNAL.md), [design-test](../tests/e2e/design.spec.ts), [ikon-dekning/fallback](../tests/iconography.test.ts). Kategoriikoner er valgt fremfor unikt bilde per katalog-ID. |
| UX-02 | Hjørnetrekant på oppslag/ekspanderbare felt; ikke nav, X eller listevalg. K3 | Levert | [CSS](../src/style.css), [markørtest](../tests/e2e/illustrated.spec.ts), [siste review](reviews/equipment-app/README.md). Eldre rapporter om AC-grunnlag/utstyrsdisclosures er omfattet av siste rettelse. |
| UX-03 | Uniforme piller/+ innen seksjon, naturlig wrap, kompakt mobilbredde. K1/K2 | Levert | [Geometri-/stor skrift-test](../tests/e2e/workspace.spec.ts), [utstyrstest](../tests/e2e/equipment.spec.ts), [review](reviews/equipment-app/README.md). Våpen har bevisst større uniforme kort. |
| UX-04 | Ett spørsmål per veiviserskjerm, direkte svar/terninger, forklaring og grafisk fremdrift. K3 | Delvis | [Felles ramme](../src/ui/wizard.ts), [illustrert test](../tests/e2e/illustrated.spec.ts). Utstyr er gjennomarbeidet; avanserte feature/spell/action-flater og utsatte registreringer mangler samme oppgaveorienterte flyt. Se EGN-04, MAG-11, UX-10. |
| UX-05 | Lukk bevarer separat utkast; Fortsett samme sted, Forkast separat, trygg feil/konflikt/backup. K3 | Levert | [Draft repository](../src/storage/wizard-drafts.ts), [draft-tester](../tests/wizard-drafts.test.ts), [offline/reload/two-tabs](../tests/e2e/illustrated.spec.ts). Gjelder veiviserne, ikke alle eldre skjemaer. |
| UX-06 | Lagre direkte og lukk; ingen overflødige mellomdialoger eller rutinemessige lagret-meldinger. K1/K3 | Levert | [Dialog](../src/ui/dialog.ts), [interaksjonstester](../tests/e2e/interactions.spec.ts), [utstyrsreview](reviews/equipment-app/README.md). Feilmeldinger beholdes tydelige. |
| UX-07 | Felles tallhjul med grenser og tastatur/direct entry. K3 | Delvis | [Number wheel](../src/ui/number-wheel.ts), [touch/keyboard/grensetester](../tests/e2e/design.spec.ts). Brukerens nyere midtbånd-/iOS-innspill er UX-08/09; eksisterende tester dekker ikke dem. |
| UX-08 | Trykk valgt midtbånd for å lukke et vanlig tallhjul og beholde tallet. K5 | Mangler | [Row handler](../src/ui/number-wheel.ts) fokuserer nå input ved valgt rad. Direkte innskriving må fortsatt være tilgjengelig. Pengers to alltid synlige hjul må behandles særskilt. |
| UX-09 | Åpne/lukke tallhjul og neste kontroll skal reagere på første trykk i installert iPhone-app. K5 | Feil | Brukeren reproduserer konsekvent i installert modus, men ikke Chrome-fane. Fokusflytting er funnet i koden; eksakt årsak og rettelse er ikke bekreftet på fysisk iOS. Krever kontroll av touch/scroll/fokus, ikke bare desktop-klikk. |
| UX-10 | Nye egne handlinger skal være en enkel, logisk flerverdiflyt. K1 og generelt veiviserprinsipp | Delvis | [Action editor](../src/ui/record-editors.ts) er fortsatt langt skjema, selv om CRUD/poolkobling fungerer. Skill enkle notatoppslag fra valgfrie attack/damage/DC-felt. |
| UX-11 | Ingen utilsiktet fokuszoom/overflyt; tilgjengelig zoom og stor skrift beholdes. K3 | Delvis | Chromium-layout/touch er [testet](../tests/e2e/design.spec.ts), minst16px inputfont. Brukerens eldre zoomrapport er ikke kontrollert på fysisk iPhone/standalone. Ikke erklær full iOS-retting fra Chromium. |
| UX-12 | Lavere bunnmeny, særlig som installert app, uten å miste trykkflate/safe area. Krav §17 | Mangler | [main-nav CSS](../src/style.css) er ikke endret etter innspillet. Visuell aksept må omfatte faktisk standalone. |

### PWA, data og bibliotek

| ID | Ønsket funksjonalitet / kilde | Status | Kontrollgrunnlag og eventuell rest |
| --- | --- | --- | --- |
| PWA-01 | Oppdage ny utgave også mens appen står åpen; eksplisitt oppdatering og manuell sjekk. K3 | Levert | [Updates](../src/ui/updates.ts), [to-utgavers SW-test](../tests/e2e/updates.spec.ts): redigeringsvern, andre faner, data/offline. |
| PWA-02 | Installert navn My D&D. Krav §17 | Mangler | [Manifest](../public/manifest.webmanifest) har fortsatt name «Character & Combat — D&D 5e 2014» og short_name «Character 5e». |
| PWA-03 | Endelig installasjonsikon. Krav §17 | Avklares | [Foreløpig SVG](../public/icon.svg) finnes. Uttrykk må velges; nødvendige installasjonsformater/iPhone-visning verifiseres deretter. |
| DAT-01 | Faktiske bekreftede endringer logges samlet med før/etter; visningsvalg/no-op logges ikke. K1 | Levert | [Repository](../src/storage/database.ts), [lagring](../tests/storage.test.ts), [interaksjoner](../tests/e2e/interactions.spec.ts). Full-aggregate snapshots oppfyller atomisk før/etter-kontrakt. |
| DAT-02 | Angre siste lagrede endring; lesbar historikk og manuell eldre korrigering. K1 | Levert | [History UI](../src/ui/history.ts), [repository/undo](../tests/storage.test.ts). Ikke flerstegsundo; slettet karakter har ikke restore-UI, AVK-04. |
| DAT-03 | Komplett versjonert karakterbackup, portrett, utkast, validering og sikker import. K1/K3 | Levert | [Backup](../src/storage/backup.ts), [round-trip/collision](../tests/storage.test.ts), [utkast](../tests/wizard-drafts.test.ts), [UI](../tests/e2e/characters.spec.ts). Historikkeksport er ikke med, AVK-05. |
| DAT-04 | Samtidige faner, lagringsfeil og migreringsfeil gir ingen stille overskriving eller tapt skjema. K1 | Levert | [Repository](../src/storage/database.ts), [conflict/rollback](../tests/storage.test.ts), [draft CAS](../tests/wizard-drafts.test.ts), [UI-feil](../tests/e2e/illustrated.spec.ts). |
| DAT-05 | Diskret backup-påminnelse etter endringer over tid uten eksport. K1 | Delvis | [start](../src/main.ts) minner etter7 dager eller manglende lastExport, uavhengig av om noe er endret. Påminnelsen finnes, men er ikke endringsbasert slik kravet sier. |
| DAT-06 | Test, bygg og publisering med regresjon for prototypefeil. K1 | Delvis | Vitest/Playwright/CI/Pages finnes og aktive flyter har dekning. Manglende skade-/standardhandlingsflyter har ikke sine påkrevde regresjonstester; fysisk iOS og bred tilgjengelighet gjenstår. Grønne tester er ikke full produktaksept. |
| KAT-01 | Lokale SRD-spells, klasseegenskaper/feat og vanlig utstyr med kilde/lisens. K1 | Levert | [Katalogimport](../scripts/import-srd.mjs), [kontekstimport](../scripts/import-context.mjs), [lisens](../public/SRD-LICENSE.txt). 319 spells, 408 featureposter (407 klasseoppføringer +1 feat), 237 vanlig utstyr +2 kuraterte magic items. |
| KAT-02 | Ferdige SRD-magic-items fremfor bare generiske amuletter/ringer. K1/K5 | Delvis | Bare Cloak/Ring of Protection er kuraterte magic-items. Vanlig Amulet er utstyrsgrunnlag, ikke et ferdig magisk objekt. Potion-minimum tas i UTS-12; bredere magisk katalog er egen leveranse. |
| KAT-03 | Arts-/subrace-/subclass-/featinnhold med korrekte valg og tilgang. K1 | Delvis | [Katalog](../src/domain/catalog.ts) har9 grunnarter med utvalgte traits og én SRD-subclass per12 klasser. Manglende traits/underarter og valg skal ikke forveksles med forbud mot egenregistrering. Ingen automatisk full karakterbygger. |
| KAT-04 | Fullt lokalt SRD5.1-regelbibliotek, inkludert øvrige regler og monstre. K1 | Delvis | Nåværende karakterkatalog er lokal; ingen komplett regelkapittel-/monsterleser funnet. Fortsatt opprinnelig krav, men anbefales senere enn kjernearket. Omfang/prioritet trenger eksplisitt gjennomgang, ikke stilltiende bortfall. |
| KAT-05 | Registrere eget/proprietært/DM-innhold uten å distribuere bøkene. K1 | Levert | Egne klasser/art/features/spells/items/notater, [CRUD-tester](../tests/e2e/workspace.spec.ts), [lisensgrenser](../public/SRD-LICENSE.txt). Ingen proprietær fullkatalog er lovet. |

### Erstattede retninger og åpne produktvalg

| ID | Tidligere løsning / spørsmål | Status | Gjeldende føring / kilde |
| --- | --- | --- | --- |
| HIST-01 | To/tre hovedfaner og utstyr/spells inne på Character. K1/K2 | Erstattet | Fire hovedfaner Character/Combat/Magi/Utstyr + Meny. K3/krav §13. |
| HIST-02 | Temp HP og skadeføring på Character; AC/temp/speed som skapelsesfelt. K1/K2 | Erstattet | Fem statusverdier på Character; HP-endring/temp i Combat; minimal opprettelse. |
| HIST-03 | Absolutt/relativ HP-slider, hold for kontinuerlig endring. K2 og designhistorikk | Erstattet | Tallhjul med valgt delta og før/etter til bekreftelse, krav §13–14. |
| HIST-04 | Registrere hvert Hit Die-kast med automatisk CON/healing. K1/K2 | Erstattet | Antall tilgjengelige terninger og separat/samlet manuell HP-endring, K3. Gamle domenehjelpere gjør ikke dette til krav igjen. |
| HIST-05 | Tursporing, Cast/Bruk for alle handlinger, Ferdig med tur, AC-treffkontroll. K2/tidlig historikk | Erstattet | Oppslag og bare begrensede tellere. DM og fysiske terninger avgjør. |
| HIST-06 | Generisk Rediger øvrige felt, duplisert Bakgrunn, fritekst i stedet for struktur. K2 | Erstattet | Navngitte notater og egne språk/proficiency/defense/immunity-data. |
| HIST-07 | Kroppsfigur/obligatoriske plaggslots, unikt ikon per katalogpost, statbasert itemopprettelse. Design-/utstyrsdiskusjon | Erstattet | Enkel samlet gjenstand, arvet profil/kategoriikon med reserve, virkningsoversikt. |
| HIST-08 | Bare manuelle slots; alle klasser/levels som standard; flere typer blandet i samme velger. K1/eldre UI | Erstattet | Sikre standardpools og relevante valg, typeknapper og manuelle DM-overstyringer. |
| HIST-09 | Eksklusive Normal/Resistance/Vulnerability/Immunity-valg eller skjult samlemodifikator. K2/regresjon | Erstattet | Individuelle, samtidige effekter og forklaring. Gjeldende kalkulator er fortsatt ikke implementert, SKA. |
| HIST-10 | Påkrevd flerkategoriplassering for itemeffekt og antall for alle gjenstander. K3/eldre prototype | Erstattet | Valgfri faktisk aktivering/Ikke avklart. Individuelt utstyr med Kopier; bare Forbruk telles etter nyeste avklaring, UTS-10–13. |
| AVK-02 | Enkel betjening for den opprinnelige sammensatte skadekalkulatoren. | Avklares | Kravet er vedtatt og beholdes, SKA-01–06. Backlogrekkefølgen er bestilt; konkret enkel spillerflyt må fortsatt godkjennes før koding. Ingen omkamp om at kravet finnes. |
| AVK-03 | Tverrgående søk/oppslag og valgfritt taleoppslag fra prototypen. | Avklares | v0.11 har searchopen/voice-grener; ingen tilsvarende global appflyt funnet. Tale er eksplisitt fremtidig/ikke MVP i DECISIONS §6. Et globalt tekstsøk er ikke et like tydelig vedtatt krav som katalogsøk. |
| AVK-04 | Skal slettet karakter kunne gjenopprettes med Angre? | Avklares | Sletting logger førtilstand, men karakteren forsvinner fra valget og UI-undo. Nåværende dokumentert grense er restore fra backup; ikke bestilt ny gjenopprettingsfunksjon. |
| AVK-05 | Skal endringshistorikken følge JSON-backup? | Avklares | Nåværende backup tar karakter, portrett og utkast; import starter ny logg. DATA_MODEL nevner optional events; historikkeksport er tidligere utsatt. Ikke en bevist datatapfeil i dagens vedtatte backupflyt. |

## Foreslått arbeidsliste

Én rad er en sammenhengende backlog item, ikke en formell user story. De åpne kontrollpunktene over er samlet her. **P1/P2/P3 og BL-01–27 er opprettet i den foreslåtte rekkefølgen etter brukerens bestilling.** Rekkefølgen kan omprioriteres uten å endre oppgavens BL-ID. Prinsippene om papirark, relevant kontekst, manuelle unntak, data/Angre og egen produktkontroll gjelder hvert punkt. Detaljerte akseptansescenarioer skrives før den aktuelle implementasjonen bestilles.

### P1 – friksjon og kjente avvik i daglig bruk

| ID | Arbeid | Punkter | Ferdig når | GitHub |
| --- | --- | --- | --- | --- |
| BL-01 | Lukke vanlig tallhjul ved trykk på valgt midtbånd. | UX-07/08 | Valget beholdes, hjulet lukkes uten tastatur, fokus gir neste handling på første trykk. Direkte tallinnskriving og de to pengehjulene fungerer fortsatt. | [#25](https://github.com/geirskoglund/dnd-character-sheet/issues/25) |
| BL-02 | Finne og rette dobbelttrykk i installert iPhone-app. | UX-09, del av UX-11 | Reproduksjon/årsaksgrunnlag dokumentert og første trykk fungerer ved åpne/lukke/etter scrolling. Brukerens standalone-observasjon må retestes fysisk; Chromium alene lukker ikke feilen. Kan ha samme årsak som forrige punkt, men lukkes ikke automatisk sammen med det. | [#26](https://github.com/geirskoglund/dnd-character-sheet/issues/26) |
| BL-03 | Bruke navnet My D&D ved installasjon. | PWA-02 | Manifestnavn og kortnavn er riktige; oppførsel for eksisterende installasjon er forklart/verifisert. | [#27](https://github.com/geirskoglund/dnd-character-sheet/issues/27) |
| BL-04 | Redusere høyden på bunnmenyen. | UX-12 | Mindre vertikal luft på mobil og installert iOS, med lesbar aktivtilstand, gode trykkflater og korrekt safe area. | [#28](https://github.com/geirskoglund/dnd-character-sheet/issues/28) |
| BL-05 | Føre vanlig utstyr enkeltvis, uten Antall. | UTS-10 | Armor/amuletter/ringer bruker samme individuelle Kopier-prinsipp. Eksisterende antall>1 bevares eller deles ved uttrykkelig handling med Angre; ingen stille tap. | [#29](https://github.com/geirskoglund/dnd-character-sheet/issues/29) |
| BL-06 | Legge til Forbruk med et avgrenset standardutvalg. | UTS-11/12 | Egen synlig gruppe og direkte valg av ordinær ammunisjon, vanlige SRD-potions og rasjoner. Kun nødvendig antall; egne varer mulig. Ingen automatisk pilskade eller potionmotor. | [#30](https://github.com/geirskoglund/dnd-character-sheet/issues/30) |
| BL-07 | Bruke og fylle på Forbruk raskt. | UTS-13 | Ett forbruk kan føres raskt og angres, påfyll kan gjøres i ett samlet antall, tom beholdning kan fylles igjen. Knappene/layouten er et forslag som prøves før implementasjon. | [#31](https://github.com/geirskoglund/dnd-character-sheet/issues/31) |

### P2 – fullføre det sentrale karakterarket og Combat-oppslagene

| ID | Arbeid | Punkter | Ferdig når | GitHub |
| --- | --- | --- | --- | --- |
| BL-08 | Legge inn relevante standardhandlinger i Combat. | KAM-03 | Unarmed Strike/Grapple/Shove og avklart øvrig 2014-utvalg er korrekte oppslag, generelle sist, uten tursporing eller digitale kast. Monk-/hånd-/proficiency-unntak vurderes i sine scenarioer. | [#32](https://github.com/geirskoglund/dnd-character-sheet/issues/32) |
| BL-09 | Knytte kjente klasse-/feat-/artsoppslag og tellere til samme kilde. | KAM-04/06, BEH-06 | Valg som Second Wind/Action Surge gir relevante oppslag og delte tellere uten at spilleren skriver samme informasjon igjen. Bare sikre kuraterte regler; egne unntak beholdes. | [#33](https://github.com/geirskoglund/dnd-character-sheet/issues/33) |
| BL-10 | Vise karakterens spell attack og save DC der spellen slås opp. | MAG-08, KAM-06 | Verdier følger faktisk kilde/ability/proficiency og vises i aktuelt Combat-oppslag, også ved multiclass og DM-tilpasset spell. | [#34](https://github.com/geirskoglund/dnd-character-sheet/issues/34) |
| BL-11 | Gjøre cantrip-scaling og upcasting lettere å slå opp riktig. | MAG-09 | Støttede kjente skadeuttrykk har riktig nivågrunnlag; ellers er tekstbegrensningen tydelig. Ingen vilkårlig prosatolkning eller automatisk slotbruk. | [#35](https://github.com/geirskoglund/dnd-character-sheet/issues/35) |
| BL-12 | Forenkle proficiency-registrering. | KAR-07 | Vanlige skills/saves/våpen/armor/verktøy kan velges forståelig; egne navn og manuelle totaler beholdes uten omfattende standardskjema. | [#36](https://github.com/geirskoglund/dnd-character-sheet/issues/36) |
| BL-13 | Forenkle registrering av skadeegenskaper. | KAR-08 | Skadetype og resistance/vulnerability/immunity velges direkte, eventuell betingelse spørres enkelt og forklares. Ikke lov automatisk skadeberegning før SKA er levert. | [#37](https://github.com/geirskoglund/dnd-character-sheet/issues/37) |
| BL-14 | Forenkle tilstandsimmunitet og forklare hensikten. | KAR-09 | Standardtilstander kan velges fra liste, egen tilstand er mulig, og spilleren forstår at det føres en varig beskyttelse. | [#38](https://github.com/geirskoglund/dnd-character-sheet/issues/38) |
| BL-15 | Fullføre enkel feature-/featredigering også for handling/ressurs/effekt. | EGN-04, del av UX-04 | Vanlig registrering trenger ikke gå ut av veiviseren til et langt restskjema; eksisterende data og koblinger overlever. | [#39](https://github.com/geirskoglund/dnd-character-sheet/issues/39) |
| BL-16 | Fullføre enkel registrering/redigering av spell-detaljer. | MAG-11, del av UX-04 | Relevante spørsmål dekker nødvendig attack/save/tid/range/kilde uten å tvinge alle gjennom alt. Direkte katalogvalg forblir direkte. | [#40](https://github.com/geirskoglund/dnd-character-sheet/issues/40) |
| BL-17 | Forenkle egne handlingsoppslag. | UX-10, del av UX-04 | Et vanlig tekst-/ressursoppslag er lett å føre; angrep/skade/DC spørres bare når relevant. | [#41](https://github.com/geirskoglund/dnd-character-sheet/issues/41) |
| BL-18 | Samle kort hvile uten rå terningregistrering. | BEH-08 | Tilgjengelige Hit Dice, relevant gjenoppretting og valgfritt samlet HP-delta kan føres enkelt, med forståelig bekreftelse/Angre. Konkret flyt må avklares. | [#42](https://github.com/geirskoglund/dnd-character-sheet/issues/42) |
| BL-19 | Gjøre backup-påminnelsen avhengig av faktiske endringer. | DAT-05 | Ingen påminnelse for et uendret ark som allerede er sikkerhetskopiert; endringer uten eksport over tid gir diskret påminnelse. | [#43](https://github.com/geirskoglund/dnd-character-sheet/issues/43) |

### P3 – opprinnelige større krav og videre dekning

Krav §4 omtaler «Ta skade» som høyprioritert. Brukeren bestilte likevel opprettelse av backloggen i den foreslåtte rekkefølgen, med dagens friksjon og sentrale oppslagsmangler først. Kravet og hele akseptanseomfanget består; den konkrete enkle skadeflyten må fortsatt avklares i AVK-02 før implementasjon.

| ID | Arbeid | Punkter | Ferdig når | GitHub |
| --- | --- | --- | --- | --- |
| BL-20 | Levere sammensatt «Ta skade», som én etterprøvbar spillerflyt. | SKA-01–06, AVK-02 | Alle §4-krav er prøvd: flere typer, hver modifier/vilkår/DM-overstyring, korrekt 2014-beregning, forklaring, atomisk HP/temp/Angre og grensetestene. Del opp teknisk først etter godkjent enkel flyt; ingen AC-/treffmotor. | [#44](https://github.com/geirskoglund/dnd-character-sheet/issues/44) |
| BL-21 | Dekke flere reelle spellkilder uten å skjule gyldige valg. | MAG-03 | Avklart arts-/feat-/subclass-/item-tilgang inngår i relevans og bruk. Fritekst-evner uten spellkobling skal fortsatt være en enkel og gyldig løsning. | [#45](https://github.com/geirskoglund/dnd-character-sheet/issues/45) |
| BL-22 | Gjennomgå behov for tredjedels-caster-/andre klasseregler. | MAG-10 | Manuell registrering er tydelig; ytterligere automatikk begrenses til uttrykkelig avtalt og kildebelagt omfang. | [#46](https://github.com/geirskoglund/dnd-character-sheet/issues/46) |
| BL-23 | Redigere flere koblinger og nyttige egne aktivtilstander. | EGN-05 | Konkrete papirarkbehov har enkel UI uten å skade delte referanser. Ikke en generell ekstern bufftracker. | [#47](https://github.com/geirskoglund/dnd-character-sheet/issues/47) |
| BL-24 | Utvide med ferdige SRD-magic-items. | KAT-02 | Avklart utvalg kan velges med sikre data og kilde; fritekst/særregler og brukerens egne varianter er fortsatt mulig. Potions i Forbruk trenger ikke vente på hele denne leveransen. | [#48](https://github.com/geirskoglund/dnd-character-sheet/issues/48) |
| BL-25 | Fullføre relevant art-/underart-/valginnhold. | KAT-03 | Manglende støttede traits/valg blir tilgjengelige uten å bli en automatisk karakterbygger eller fylle skaperen med irrelevante felt. | [#49](https://github.com/geirskoglund/dnd-character-sheet/issues/49) |
| BL-26 | Fullføre lokalt SRD-regelbibliotek. | KAT-04 | Avklart presentasjon av øvrige regelkapitler og monstre fungerer offline med riktig lisens og kilde. Beholdes som opprinnelig krav; rekkefølgen vurderes mot papirarkets kjernebehov. | [#50](https://github.com/geirskoglund/dnd-character-sheet/issues/50) |
| BL-27 | Gjennomføre fysisk mobil-/tilgjengelighetskontroll av relevante flyter. | UX-11, DAT-06 | iPhone browser/standalone, fokuszoom, safe area, store tekster og tastatur/skjermleser dokumenteres med faktisk testgrunnlag. Feil blir konkrete oppgaver; ingen generell omskriving bestilles. | [#51](https://github.com/geirskoglund/dnd-character-sheet/issues/51) |


### Avklaringer før eventuell ny funksjonalitet

| Spørsmål | Punkter | Forslag til håndtering |
| --- | --- | --- |
| Velge endelig appikon. | PWA-03 | En liten designavgjørelse; ta installasjonsformatene med når uttrykket er valgt. |
| Globalt tekstsøk og valgfritt talesøk. | AVK-03 | Behold som synlig prototypeidé; prioriter ikke som vedtatt kjernekrav uten avklaring. |
| Restore av slettet karakter. | AVK-04 | Avklar om backupgrensen er tilstrekkelig eller om enkel gjenoppretting ønskes. |
| Historikk i backup. | AVK-05 | Avklar behovet før formatet utvides; full karakterbackup og historikkeksport er forskjellige behov. |

## Sporbarhet til hele v0.11

Denne koblingen fanger også prototypefunksjoner som ikke har et tydelig krav i dagens normalflyt. Statiske demoer er ikke regnet som bevis for produksjonsfunksjon.

| Prototypeområde/funksjoner | Dekning i oversikten |
| --- | --- |
| demo/normalize, valg mellom Fighter/Wizard/Warlock, characters, level | ADM-01–08, GR-03. Ferdige demofigurer/reset skal ikke innføres som brukerkrav. |
| render/character/quickStats/searchArea/modifierNames/modSkill | KAR-01–05, MAG-01, HIST-01/02. Nyere faner, statusplassering og design overstyrer prototypeuttrykket. |
| gearPanel/gearopen/addgear/ac, weapon attacks og equipppedDual | UTS-01–14, KAR-05, KAM-02. Nye iteminstanser, proficiency og korrekt off-hand erstatter demoens forenklinger. |
| combat/allActions/basicActions/openDetail/compactAction | KAM-01–06, MAG-08/09. Generelle handlinger og automatisk class/feat-sammenstilling er fortsatt åpne. |
| spellCards/spellItem/spellopen/library/addspell/slots/slotopen/cast/ritual | MAG-01–11. Manuell forberedelse og telling er implementert; automatiske Cast-/ritualknapper er ikke et vedtatt krav, HIST-05. |
| featureItem/addfeat/addcustom/resourceopen og resource-checkboxes | EGN-01–05, BEH-05/06, KAM-04/05. Teller kan være antall i stedet for en bestemt boksutforming. |
| hpPanel/hpopen/applyhp/temp/tempopen, cashPanel/moneyopen | BEH-01–03, UX-07–09, HIST-03. Vanlig HP-justering er ikke samme funksjon som openDefense. |
| openDefense/modifiers/calcPart/calculate/renderParts/drawResult | SKA-01–06. Funksjonelt krav bevart, hardkodet prototypelogikk skal ikke kopieres. |
| restopen/rest/diceopen | BEH-04/07–09, HIST-04. Kort-hvile-UX er ufullført, men enkel telling og lang hvile fungerer. |
| inspiration/deathopen/conditionsopen | KAR-10, BEH-07. Ingen automatisk tilstandssimulator. |
| extrasPanel/addentry/editentry/noteopen/addnote/notesopen/portraitopen | KAR-06–11, KAR-01, HIST-06. Strukturerte data erstatter dupliserte fritekstfelt. |
| settings/modifier/fold/tab/scrollRender/bind, modal | ADM-07, KAR-03, KAM-01, UX-02/03/05/06, HIST-01. Nyere design og eksplisitt draftsemantikk gjelder. |
| snapshot/undo/export/import/save | DAT-01–05, GR-02/03, ADM-05. IndexedDB/validert backup erstatter demo-localStorage og destruktiv import. |
| searchopen/updateHits/findValue/voice | AVK-03. Katalogsøk/favoritter finnes; globalt søk/tale er ikke implementert og ikke erklært forkastet. |

## Kontroll av denne dokumentleveransen

Statusene er sammenholdt med appens kode og de navngitte eksisterende testscenarioene. Full kontroll av uendret app er kjørt: `CI=1 CHROMIUM_PATH=/usr/bin/chromium npm run check` passerer med **127 domenemodell-/lagringstester, TypeScript-kontroll, produksjonsbygg og 76 nettlesertester** (203 tester totalt, ingen hoppet over). Dette er samme appkilde som master9518d8c; testene legger ikke til dekning for de identifiserte manglene. Dokumentkontroll passerer: 319 lokale lenker/ankere i de endrede dokumentene, unike kontroll-/backlog-ID-er, statusopptelling, alle åpne punkter koblet til arbeidsliste/avklaringer, og `git diff --check`. GitHub-kontroll: 27 åpne Issues (#25–51), 7 P1 /12 P2 /8 P3, med riktige BL-ID-er, typemerker, kildehenvisninger og ønsket resultat. Hver rad lenker riktig Issue. Project-opprettelse er avvist og ikke erklært levert. Ingen ny appflyt implementeres eller erklæres løst av denne filen.

Backloggen er opprettet etter brukerens bestilling; åpne produktspørsmål består. Apparbeid starter først ved uttrykkelig bestilling; et «ja», «ok» eller enighet i et backlogpunkt er ikke i seg selv en slik bestilling.
