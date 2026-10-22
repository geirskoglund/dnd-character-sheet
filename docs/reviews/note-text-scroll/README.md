# Full tekstvisning og enkelt skille

Grunnlag: brukerens to Notat-bilder og godkjente presisering i samtalen 22. oktober 2026. Faktisk lokal app i Chromium med mobil/touch-geometri; dette er ikke fysisk iPhone/PWA eller native tastaturtest.

- [Notat ved starten, 390 px](note-top-390.png): teksten fortsetter under skjermkanten og kan rulles i dialoginnholdet.
- [Notat ved slutten, 390 px](note-bottom-390.png) og [320 px / 200 % tekst](note-bottom-320.png): hele siste avsnitt kan leses; overskrift/X og Lagre beholder plasseringen.
- [Flerlinjeeditor, 390 px](editor-390.png): bare ett skille over Avbryt/OK.
- [Kort editor, 320 × 360 / 200 % tekst](editor-short-large-320.png): tekstområdet ruller, mens X og knappene forblir tilgjengelige.

[Målingene](measurements.json) viser lik synlig/total felthøyde (715/715 px og 2265/2265 px) og identiske topp-/bunnposisjoner før/etter rulling. Høyden beregnes av tekstens layout, uten avhengighet til støtte for `field-sizing:content`. Prøvene kontrollerer også at kort tekst krymper igjen, lagring/reload, Avbryt, retur til utstyrsveiviser og beskrivelse fra gjenopptatt utkast. Full tekst kopieres bare til en skjult layoutflate; den opprinnelige tekstfeltnoden og dens innhold/validering er beholdt.

155 enhets-/integrasjonstester, produksjonsbygg og 21 berørte nettlesertester bestod. Fysisk PWA-review og uttrykkelig mergegodkjenning gjenstår.
