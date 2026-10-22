# Full tekstvisning og enkelt skille

Grunnlag: brukerens to Notat-bilder og godkjente presisering i samtalen 22. oktober 2026. Faktisk lokal app i Chromium med mobil/touch-geometri; dette er ikke fysisk iPhone/PWA eller native tastaturtest.

- [Notat ved starten, 390 px](note-top-390.png): teksten fortsetter under skjermkanten og kan rulles i dialoginnholdet.
- [Notat ved slutten, 390 px](note-bottom-390.png) og [320 px / 200 % tekst](note-bottom-320.png): hele siste avsnitt kan leses; overskrift/X og Lagre beholder plasseringen.
- [Flerlinjeeditor, 390 px](editor-390.png): bare ett skille over Avbryt/OK.
- [Kort editor, 320 × 360 / 200 % tekst](editor-short-large-320.png): tekstområdet ruller, mens X og knappene forblir tilgjengelige.

[Målingene](measurements.json) viser lik synlig/total felthøyde (715/715 px og 2265/2265 px) og identiske topp-/bunnposisjoner før/etter rulling. Høyden beregnes av tekstens layout, uten avhengighet til støtte for `field-sizing:content`. Prøvene kontrollerer også at kort tekst krymper igjen, lagring/reload, Avbryt, retur til utstyrsveiviser og beskrivelse fra gjenopptatt utkast. Full tekst kopieres bare til en skjult layoutflate; den opprinnelige tekstfeltnoden og dens innhold/validering er beholdt.

155 enhets-/integrasjonstester, produksjonsbygg og 21 berørte nettlesertester bestod. Fysisk PWA-review og uttrykkelig mergegodkjenning gjenstår.

## Popup fra nedscrollet side

Brukeren rapporterte en Rediger-popup som kunne scrolles forbi i installert iPhone-PWA, og opplyste deretter at problemet forsvant etter omstart. Den konkrete PWA-tilstanden er ikke identifisert eller gjenskapt fysisk. Undersøkelsen avdekket samtidig at vanlige dialoger manglet bakgrunnslås og eksplisitt skjermforankring. En ny prøve feilet på den publiserte kildekoden fordi hjulrulling på popupoverskriften flyttet dokumentet fra 909 px til 0.

Vanlige dialoger får nå eksplisitt `position:fixed` og en bakgrunnslås med bevaring av eksisterende stiler. Låsen beholdes ved tekstredigering og avbrutt sletting, og frigjøres sammen med lukking før sideposisjon/fokus gjenopprettes. Det er ingen endring av hvilken notatpopup som åpnes.

Inspiserte faktiske Chromium-bilder viser [Rediger notat fra nedscrollet side](popup-from-bottom-390.png) og [retur til notatet](return-to-note-390.png). Målt åpning fra 1026 px beholdt den underliggende sidens plassering med `body.top:-1026px`; dialogens topp var 0 før/etter rulling. Lukking gjenopprettet 1026 px og fokus på reisenotatet. Dette er lokal mobilgeometri, ikke fysisk PWA-verifikasjon eller bevis på årsaken til den forbigående PWA-feilen.

Oppfølgingen er kontrollert med 155 enhets-/integrasjonstester, produksjonsbygg og alle 106 nettleserscenarioer (105 i fullkjøringen, samt grønn etterprøve av returposisjonen med måling ved faktisk brukertrykk). Ingen tester eller forventninger er fjernet. Full GitHub Validate kjøres før oppdatert testpublisering.
