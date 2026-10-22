# Oppdatering av den installerte appen

Appens karakterer ligger i IndexedDB på samme origin. Oppdateringskoden sletter verken IndexedDB eller localStorage. Ikke slett nettleserdata for å hente en ny versjon.

## Publisering

Repository Settings → Pages → Build and deployment → Source skal være **GitHub Actions**:
https://github.com/geirskoglund/dnd-character-sheet/settings/pages

Den gamle «Deploy from a branch»-metoden kan publisere kildefiler parallelt med Vite-produksjonsbygget. Repository-root er ikke lenger et ferdig nettsted. `pages.yml` bygger master og valgt test-commit separat og publiserer ett samlet nettsted: My D&D på `my-dnd/app/`, My D&D Test på `my-dnd/test-app/`. Dette skal være eneste publiseringskilde. Se [faste adresser og publiseringskommandoer](TESTING.md). Codex-integrasjonen kan lese denne innstillingen, men GitHub har avvist endring av den med «Resource not accessible by integration», så kontoeieren må velge kilden i GitHub.

## Overgang fra gamle adresser

Gamle `/dnd-character-sheet/` og `/dnd-character-sheet/test/` er erstattet med overgangssider og retirement-workere. Ta JSON-backup på hver telefon/i hvert miljø før gamle installasjoner fjernes. Følg [overgangsoppskriften](TESTING.md#første-overgang-fra-gamle-telefoninstallasjoner). Eksakte gamle workers og deres appcaches ryddes; IndexedDB/localStorage og nye appscopes røres ikke. En gammel frakoblet/cachet app må komme på nett og eventuelt lukkes/åpnes før den nye overgangssiden blir synlig. Ingen åpen redigering navigeres automatisk.

## I appen

Meny → Om appen viser versjonens korte commit-ID. «Se etter oppdatering» ligger direkte i menyen. Appen sjekker også når den får fokus, blir synlig, gjenopptas eller kommer på nett, og hvert minutt mens den er synlig og på nett. En app som står åpen ved bordet skal dermed oppdage en publisert utgave uten manuelt menyvalg. Kontroll av service-worker-kilden omgår HTTP-cachen via `updateViaCache: none`.

Når en ferdig nedlastet versjon venter, vises «Oppdater appen». Fullfør eller lukk veiviseren før oppdatering; X/Escape bevarer et separat utkast som kan fortsettes etterpå. Andre redigeringsflater bruker fortsatt Lagre/Avbryt. Andre faner/PWA-vinduer på appens scope må lagres og lukkes først; den ventende workeren teller dem før aktivering. Først etter et eksplisitt klikk aktiveres workeren og denne siden lastes på nytt. Ved en ekstern aktivering viser en åpen side melding og lar redigeringen fortsette uten automatisk reload.

Offline-/nettverksfeil vises uten å røre karakterdata. En ferdig installert, ventende worker kan aktiveres fra appen. Det er ikke nødvendig å logge inn eller flytte karakterer til et annet lagringssted.

Ved første overgang fra eldre versjoner uten oppdateringsknapp: bekreft Pages-kilden, lagre endringer, lukk alle appfaner og eventuelt hjemskjermappen, åpne nettstedet igjen mens du er på nett og la den nye workeren installeres. Den gamle versjonen kan kreve at fanen lukkes/åpnes en gang til. På desktop kan hard reload hente det publiserte dokumentet. Bruk ikke «slett nettstedsdata». En privat fane har separat lagring og er kun egnet til å se hvilken versjon serveren leverer, ikke til å finne eksisterende karakterer.

## Test

`tests/e2e/updates.spec.ts` serverer to produksjonsutgaver med forskjellige precache-revisjoner. Den oppretter og lagrer en karakter i A, lar en annen fane ha et ulagret utkast, gjør B tilgjengelig og bekrefter at oppdateringen venter. Deretter lagres utkastet og den andre fanen lukkes. Oppdateringsknappen aktiverer B, navnet og HP beholdes, og B med karakteren kan lastes uten nett. Testen kontrollerer også offline-/serverfeil uten sletting av data. Førstegangsinstallasjonen skal ikke vise et falskt oppdateringsvarsel.

Ingen oppdateringsmelding er normalt når den nyeste publiserte utgaven allerede er installert. Lokalt arbeid publiseres ikke. En validert, valgt PR oppdaterer testappen gjennom den faste Pages-flyten; master-merge oppdaterer produksjonsappen. Begge får en ny oppdaterbar worker når tilhørende bygg og Pages-jobben er ferdig. Testen simulerer nå også minuttkontroll uten manuelt søk, lukket varsel som hentes frem igjen via menyen, redigeringsvern og fortsatt offline-data.
