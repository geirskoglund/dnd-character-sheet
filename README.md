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

## Fase 1

- Opprette, redigere, velge, kopiere og slette karakterer med bekreftelse.
- Manuell registrering av identitet, level, flere klasser/subclasses, ability scores, HP/temp HP, AC, speed og GP (heltall copper pieces).
- Navngitte notater, atomisk endringslogg med før/etter og angre siste redigering.
- IndexedDB med versjonert oppgradering, konfliktkontroll mellom faner og bevart karaktervalg.
- Validert, versjonert JSON-backup av alle karakterer, inklusive refererte portrettdata. ID-kollisjoner avviser hele importen.
- Character/Combat-navigasjon med separate scrollposisjoner; Action/Bonus/Reaction er foreløpig tomme oppslagsflater.
- Produksjons-PWA med cache av alle appfiler og offline bruk etter første vellykkede lasting.

Dette er et teknisk grunnlag med foreløpig visuell utforming, ikke hele produktet. Se [arkitektur og avgrensning](docs/ARCHITECTURE.md).

## Data og backup

Data finnes bare i nettleseren på samme origin. Sletting av nettleserdata fjerner karakterene; privatmodus kan være midlertidig. Ta JSON-backup via Karakteradministrasjon. Import legger til og overskriver aldri. Hendelsesloggen beholdes lokalt, men følger ikke med i fase 1-backup; import starter en ny historikk med en importhendelse. Portrettopplasting har ennå ikke eget UI.

Eksisterende prototype-data i `localStorage` røres ikke og konverteres ikke automatisk. Ved funn vises en advarsel. Eksporter fra den gamle versjonen før overgang; prototype-JSON er ikke kompatibel med det nye formatet. Oppbevar originalfilen og registrer karakterens grunnverdier manuelt. Fjern aldri IndexedDB eller nettleserdata som feilsøking uten backup.

## GitHub Pages

Velg **Settings → Pages → Source → GitHub Actions** i GitHub. Etter merge til `master` bygger og publiserer `pages.yml` innholdet i `dist/`. Ingen backend eller hemmeligheter kreves. Vite bruker relative asset-stier; nettlesertestene kjører under `/dnd-character-sheet/` for å kontrollere Pages-understien. Publisering krever tilgang til Pages og godkjenning av GitHub-miljøet dersom repositoriet krever det. PR-er valideres av `ci.yml` og publiseres ikke.

En gammel prototype-service-worker erstattes av den nye Workbox-worker ved samme `sw.js`-sti. Lukk alle gamle appfaner etter oppdatering. Den nye appen sletter ikke prototype-cache eller prototype-data. Fremtidige oppdateringer venter til åpne faner er lukket for å unngå å avbryte redigering.

## Gjeldende produktgrunnlag

Les disse før funksjonsendringer; prototypekode er ikke fasit:

1. [Overlevering](docs/CODEX_HANDOFF.md)
2. [Kravspesifikasjon](docs/REQUIREMENTS.md)
3. [Datamodell](docs/DATA_MODEL.md)
4. [Designbrief](docs/DESIGN.md)
5. [Beslutningslogg](docs/DECISIONS.md)
