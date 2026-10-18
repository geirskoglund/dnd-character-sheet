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
- Rustning/skjold og separat eid/utstyrt-status gir beregnet AC og walking speed. Forklaringer finnes i utstyrsdialogen og menyens beregningsvalg. Se [støttede 2014-regler og begrensninger](docs/CHARACTER_FOUNDATIONS.md).
- Character viser HP, AC, Initiative, GP og Speed på én rad. Skade, healing og temporary HP håndteres i Combat; GP fra Character.
- Meny → Denne karakteren: redigering, manuell Level Up med ny samlet maks HP, beregninger, historikk og angre. Level Up gir ingen automatisk healing, spells eller features.
- Fire lagrede modifierfavoritter med alfabetisk velger og fullstendige navn, samt ability modifiers.
- Opprette, redigere, velge, kopiere og slette karakterer, navngitte notater, audit-logg og angre.
- IndexedDB med atomisk versjonsoppgradering, konfliktkontroll og versjonert JSON-backup.
- Character/Combat-navigasjon og offline produksjons-PWA. Kampoppslag og full SRD-dekning gjenstår.

Arbeidsflaten er sammenholdt med [v0.11-prototypen](docs/PROTOTYPE_REVIEW.md), med nyere brukeravklaringer som føring. En [UX-gjennomgang av eksisterende flyter](docs/UX_REVIEW.md) dokumenterer videre opprydding av tillegg, oppslag, redigering, avbryt, fokus og historikk. Utformingen er fortsatt foreløpig. Se [arkitekturen](docs/ARCHITECTURE.md) og [rettelsen av opprettelsesflyten](docs/CHARACTER_FOUNDATIONS.md).

## Data og backup

Data finnes bare i nettleseren på samme origin. Sletting av nettleserdata fjerner karakterene; privatmodus kan være midlertidig. Ta JSON-backup via Meny → Karakteradministrasjon. Import legger til og overskriver aldri. Schema v2 støtter også import og migrering av v1-backuper fra denne appen; prototype-JSON er et separat format. Hendelsesloggen beholdes lokalt, men følger ikke med i fase 1-backup; import starter en ny historikk med en importhendelse. Portrettopplasting har ennå ikke eget UI.

Eksisterende prototype-data i `localStorage` røres ikke og konverteres ikke automatisk. Ved funn vises en advarsel. Eksporter fra den gamle versjonen før overgang; prototype-JSON er ikke kompatibel med det nye formatet. Oppbevar originalfilen og registrer karakterens grunnverdier manuelt. Fjern aldri IndexedDB eller nettleserdata som feilsøking uten backup.

## GitHub Pages

Velg **Settings → Pages → Source → GitHub Actions** i GitHub. Etter merge til `master` bygger og publiserer `pages.yml` innholdet i `dist/`. Ingen backend eller hemmeligheter kreves. Vite bruker relative asset-stier; nettlesertestene kjører under `/dnd-character-sheet/` for å kontrollere Pages-understien. Publisering krever tilgang til Pages og godkjenning av GitHub-miljøet dersom repositoriet krever det. PR-er valideres av `ci.yml` og publiseres ikke.

Appen viser versjons-ID og «Se etter oppdatering» i menyen. Når en ny versjon er nedlastet, bruk «Oppdater appen». Lagre redigering og lukk andre appfaner først. Karakterdata beholdes; slett aldri nettleserdata for å oppdatere. Se [oppdatering og publiseringskilde](docs/UPDATES.md) for første overgang fra eldre versjoner og feilsøking.

## Gjeldende produktgrunnlag

Les disse før funksjonsendringer; prototypekode er ikke fasit:

1. [Overlevering](docs/CODEX_HANDOFF.md)
2. [Kravspesifikasjon](docs/REQUIREMENTS.md)
3. [Datamodell](docs/DATA_MODEL.md)
4. [Designbrief](docs/DESIGN.md)
5. [Beslutningslogg](docs/DECISIONS.md)
