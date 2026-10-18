# Oppdatering av den installerte appen

Appens karakterer ligger i IndexedDB på samme origin. Oppdateringskoden sletter verken IndexedDB eller localStorage. Ikke slett nettleserdata for å hente en ny versjon.

## Publisering

Repository Settings → Pages → Build and deployment → Source skal være **GitHub Actions**:
https://github.com/geirskoglund/dnd-character-sheet/settings/pages

Den gamle «Deploy from a branch»-metoden kan publisere kildefiler parallelt med Vite-produksjonsbygget. Repository-root er ikke lenger et ferdig nettsted. `pages.yml` bygger og publiserer `dist/`; dette skal være eneste publiseringskilde. Codex-integrasjonen kan lese denne innstillingen, men GitHub har avvist endring av den med «Resource not accessible by integration», så kontoeieren må velge kilden i GitHub.

## I appen

Footeren viser versjonens korte commit-ID og «Se etter oppdatering». Appen sjekker også når den får fokus, blir synlig eller kommer på nett. Kontroll av service-worker-kilden omgår HTTP-cachen via `updateViaCache: none`.

Når en ferdig nedlastet versjon venter, vises «Oppdater appen». Lagre eller avbryt redigering før oppdatering. Andre faner/PWA-vinduer på appens scope må lagres og lukkes først; den ventende workeren teller dem før aktivering. Først etter et eksplisitt klikk aktiveres workeren og denne siden lastes på nytt. Ved en ekstern aktivering viser en åpen side melding og lar redigeringen fortsette uten automatisk reload.

Offline-/nettverksfeil vises uten å røre karakterdata. En ferdig installert, ventende worker kan aktiveres fra appen. Det er ikke nødvendig å logge inn eller flytte karakterer til et annet lagringssted.

Ved første overgang fra eldre versjoner uten oppdateringsknapp: bekreft Pages-kilden, lagre endringer, lukk alle appfaner og eventuelt hjemskjermappen, åpne nettstedet igjen mens du er på nett og la den nye workeren installeres. Den gamle versjonen kan kreve at fanen lukkes/åpnes en gang til. På desktop kan hard reload hente det publiserte dokumentet. Bruk ikke «slett nettstedsdata». En privat fane har separat lagring og er kun egnet til å se hvilken versjon serveren leverer, ikke til å finne eksisterende karakterer.

## Test

`tests/e2e/updates.spec.ts` serverer to produksjonsutgaver med forskjellige precache-revisjoner. Den oppretter og lagrer en karakter i A, lar en annen fane ha et ulagret utkast, gjør B tilgjengelig og bekrefter at oppdateringen venter. Deretter lagres utkastet og den andre fanen lukkes. Oppdateringsknappen aktiverer B, navnet og HP beholdes, og B med karakteren kan lastes uten nett. Testen kontrollerer også offline-/serverfeil uten sletting av data. Førstegangsinstallasjonen skal ikke vise et falskt oppdateringsvarsel.
