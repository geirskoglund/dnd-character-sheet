# D&D Character Companion

Et mobilførst, lokalt lagret karakterark for **D&D 5e (2014)**. Fysiske terninger og DM avgjør spillet. Ingen konto, backend eller automatisk karakterbygger.

## Utvikling

Node.js **22.12 eller nyere** og npm er nødvendig.

```sh
npm ci
npm run dev
```

```sh
npm test                 # Domenemodell, IndexedDB, oppgradering og backup
npm run build            # Typekontroll og produksjonsbygg til dist/
npx playwright install chromium
npm run test:e2e         # Nettlesertester mot produksjonsbygget
npm run check            # Alle kontrollene, inkludert bygg før nettlesertester
npm run preview          # Lokalt produksjonsbygg
```

Bruk `CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e` hvis Chromium allerede er installert. I miljøer med skrivebeskyttet hjemmemappe: `npm ci --cache /tmp/dnd-npm-cache`. Service worker er aktiv i produksjonsbygget, ikke under vanlig Vite-utvikling.

## Karaktergrunnlag og spill

- Art fra SRD 5.1 eller egen art/underart med grunnfart.
- Klasse og subclass fra lister eller egenregistrering; nåværende klassenivå og multiclass uten rekonstruksjon av level-ups.
- Endelige ability scores og maksimal HP fra karakterarket.
- Opprettelsen inneholder bare identitet, klasse/nivå, ability scores og maks HP. Utstyrs-+ åpner søk/valg direkte; eksisterende utstyr redigeres fra sin egen pille.
- Egen Utstyr-fane med direkte katalogvalg, normalt samlet rustningssett og enkel «I bruk»/håndbruk/attunement. Regelverdier følger med; egne navn, bonuser og overstyringer åpnes ved behov. Rustning/skjold og øvrige faste gjenstandsbonuser gir beregnet AC, saves og walking speed. Forklaringer finnes i utstyrsdialogen og menyens beregningsvalg. Se [støttede 2014-regler og begrensninger](docs/CHARACTER_FOUNDATIONS.md).
- Character viser HP, AC, Initiative, GP og Speed på én rad. Skade, healing og temporary HP håndteres i Combat; GP fra Character.
- Meny → Denne karakteren: redigering, manuell Level Up med ny samlet maks HP, beregninger, historikk og angre. Level Up gir ingen automatisk healing eller valg av spells/features; kjente slots og Hit Dice følger nivået med bevaring av brukt kapasitet/manuelle maksverdier.
- Fire lagrede modifierfavoritter med alfabetisk velger og fullstendige navn, samt ability modifiers.
- Opprette, redigere, velge, kopiere og slette karakterer, navngitte notater, audit-logg og angre.
- IndexedDB med atomisk versjonsoppgradering, konfliktkontroll og versjonert JSON-backup.
- Tette pillesamlinger og utstyr delt i Weapons, Armor og skjold, Annet utstyr.
- Egenskaper/feats med egne handlinger, ressurser og betingede skadeeffekter; strukturerte languages, proficiencies/expertise, skadeegenskaper og tilstandsimmuniteter.
- Egen Magi-fane med kontekstfiltrerte spells/cantrips, klassebasert forberedelse og automatiske spell-slot/Pact Magic-pools. Hit Dice er enkle tellere, HP føres separat. Lang hvile viser før/etter og lagres samlet med Angre.
- Illustrerte veivisere med ett spørsmål per skjerm, direkte Ja/Nei, terningknapper og grafisk fremdrift for karakter/egne poster/beholdninger og våpenvarianter. X/Escape bevarer et lokalt utkast som kan fortsettes etter reload; Fullfør bekrefter. Ekstraskade har skadetype fra liste og egen valgfri tekstbetingelse per komponent; navn/merknad alene er mulig. Nytt utstyr registreres som eid, deretter velges I bruk.
- Penger har to hjul (hele GP / 00–99), eksakt CP-lagring og direkte beløp. Øvrige tall har vertikalt tallhjul med grenser og direkte innskriving; HP bruker signert endring og før/etter-visning. Se [flyter, faktiske bilder og avgrensning](docs/GUIDED_WORKFLOWS.md).
- Inspiration, death saves, conditions og exhaustion, lokalt portrett inkludert i JSON-backup.
- Character/Combat/Magi/Utstyr-navigasjon og offline produksjons-PWA. Våpen i bruk gir beregnet attack/damage og Combat-oppslag, også relevante off-hand-valg. Finesse, ranged/thrown, proficiency/multiclass, håndbruk, faste magiske bonuser og utvalgte Fighting Styles/Martial Arts støttes. Registrerte handlinger og tilgjengelige spells beholdes. Sammensatte effekter er tekst/manuelle tilpasninger; standardhandlinger, avansert skadekalkulator og full SRD-dekning gjenstår. Se [beregningskontrakten](docs/EQUIPMENT.md).

Arbeidsflaten er sammenholdt med [v0.11-prototypen](docs/PROTOTYPE_REVIEW.md), med nyere brukeravklaringer som føring. En [UX-gjennomgang av eksisterende flyter](docs/UX_REVIEW.md) dokumenterer videre opprydding av tillegg, oppslag, redigering, avbryt, fokus og historikk. Se [samlet kravmatrise og faktisk status](docs/CHARACTER_WORKSPACE.md). Eventyrjournal-temaet er implementert med kategoriikoner, ability-mynter, fast bunnmeny, dialogsystem og tallhjul med direkte innskriving. Se [designleveranse, betjening og faktiske bilder](docs/EVENTYRJOURNAL.md). Se [arkitekturen](docs/ARCHITECTURE.md) og [rettelsen av opprettelsesflyten](docs/CHARACTER_FOUNDATIONS.md).

## Data og backup

Data finnes bare i nettleseren på samme origin. Sletting av nettleserdata fjerner karakterene; privatmodus kan være midlertidig. Ta JSON-backup via Meny → Karakteradministrasjon. Import legger til og overskriver aldri. Schema v2 støtter også import og migrering av v1-backuper fra denne appen; prototype-JSON er et separat format. Hendelsesloggen beholdes lokalt, men følger ikke med i fase 1-backup; import starter en ny historikk med en importhendelse. Portrett velges fra Meny → Denne karakteren → Portrett, eller byttes/fjernes fra portrettet ved navnet. PNG/JPEG/WebP under 10 MB skaleres lokalt til høyst 800 px; tidligere bilder beholdes internt for trygg kopi/angre.

Eksisterende prototype-data i `localStorage` røres ikke og konverteres ikke automatisk. Ved funn vises en advarsel. Eksporter fra den gamle versjonen før overgang; prototype-JSON er ikke kompatibel med det nye formatet. Oppbevar originalfilen og registrer karakterens grunnverdier manuelt. Fjern aldri IndexedDB eller nettleserdata som feilsøking uten backup.

## GitHub Pages

Velg **Settings → Pages → Source → GitHub Actions** i GitHub. Etter merge til `master` bygger og publiserer `pages.yml` innholdet i `dist/`. Ingen backend eller hemmeligheter kreves. Vite bruker relative asset-stier; nettlesertestene kjører under `/dnd-character-sheet/` for å kontrollere Pages-understien. Publisering krever tilgang til Pages og godkjenning av GitHub-miljøet dersom repositoriet krever det. PR-er valideres av `ci.yml` og publiseres ikke.

Meny → Om appen viser versjons-ID. «Se etter oppdatering» ligger direkte i menyen. Når en ny versjon er nedlastet, bruk «Oppdater appen». Lagre redigering og lukk andre appfaner først. Karakterdata beholdes; slett aldri nettleserdata for å oppdatere. Se [oppdatering og publiseringskilde](docs/UPDATES.md) for første overgang fra eldre versjoner og feilsøking.

## Gjeldende produktgrunnlag

Les disse før funksjonsendringer; prototypekode er ikke fasit:

1. [Overlevering](docs/CODEX_HANDOFF.md)
2. [Kravspesifikasjon](docs/REQUIREMENTS.md)
3. [Datamodell](docs/DATA_MODEL.md)
4. [Designbrief](docs/DESIGN.md)
5. [Beslutningslogg](docs/DECISIONS.md)
