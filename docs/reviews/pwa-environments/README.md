# Produktkontroll: søskenmiljøer og My D&D

Mobilbildene er fra faktisk lokal Chromium-kjøring på 390 × 844 CSS px, med de bygde appene og genererte service workerne. De er inspisert av Codex. Fullsidebilder viser også innhold under den faste bunnmenyen; de er ikke et OS-installasjonsskjermbilde. Lokale fixture-merker (PR #61 / startmaster 9212c84) identifiserer testen, ikke en allerede publisert leveranse.

- [Gammel appadresse](migration-app-mobile.png) og [gammel testadresse](migration-test-mobile.png): enkel overgangsside, riktig appnavn og lenke, ingen installasjonsmanifest eller ekstra backupfunksjon. Ingen breddeoverflyt i den observerte mobilvisningen.
- [Ny app etter offline-reload](new-app-mobile.png): bekreftet Alva Human/Fighter1, HP 12/12 og vanlig arbeidsflate består etter worker-/adressebytte.
- [Ny testapp etter offline-reload](new-test-app-mobile.png): separat Test-Alva og synlig Testversjon-merke. Testens uferdige karakterutkast ble gjenåpnet med riktig tekst før bildet.

`pwa-migration.spec.ts` genererer ekte Workbox-workere med de tidligere root-/test-scope- og navigasjonsreglene. Etter bytte av publikasjon installeres retirement-workeren, root-registreringen forsvinner, og et åpent redigeringsfelt beholder «Ulagret navn». Snapshot av begge databasene er identisk over selve avviklingen. Ny app rydder også gammel testregistrering. Begge nye registreringer/caches består etter besøk på gamle overgangssider, og begge apper kan reloades offline. Det er ingen tvungen navigasjon av redigeringsvinduet og ingen database-/localStorage-sletting.

`preview.spec.ts` kontrollerer egne databaser, portrett, historikk og utkast, testbytte, oppdatering av begge søsken-workere mens den andre appen er åpen, offline og 320/390 px. Manifestenes id/start/scope løses til de to ulike adressene. Dekodede ikoner er 192/512 px, maskérbart ikon 512 px og iPhone-ikon 180 px. Test- og appikon er ulike filer. Faktiske eksportfiler er også visuelt inspisert mot det godkjente A-designet; [originaler og eksport](../../../assets/app-icons/README.md).

Fysisk Android-launcher, WebAPK og iPhone-installasjon er ikke prøvd. Brukeren har godkjent ikonretningen, uttrykkelig valgt overgang uten backup og delegert merge etter Codex-kontroll for denne leveransen. Klasse-/arts-/spellregler og vanlige appflyter endres ikke av publikasjonen. [Kravmatrise](../../CHARACTER_WORKSPACE.md#før-koding-kontroll-nye-pwa-adresser-og-my-dd-ikoner-2026-10-22) og [publiseringsinstruks](../../TESTING.md) beskriver grenser og leveranse.
