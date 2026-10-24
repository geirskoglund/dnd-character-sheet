# Produktgjennomgang av Forbruk #30/#31

390px fullskjermliste og Ny total er visuelt inspisert i Chromium med en Elf Fighter1, HP12 og manuelt registrert beholdning18. Egen langlistefixture med30 poster brukes for rulling/plassbruk; den er satt opp direkte i testlageret og er ikke bevis for registrering av30 varer gjennom UI. Standardregistrering og DM-variant/utkast prøves separat gjennom ekte appflyt i `tests/e2e/consumables.spec.ts`.

- `stock-390.png`: liste med kategorier, ikon, enhet og raske tellere.
- `total-390.png`: reell Før18/Etter18 og eksisterende fullskjermtallvelger.
- `stock-320-large.png`: to uavhengige Arrows-poster ved320px. Den første bildeserien brukte stylesheet for stor tekst som ikke overstyrte `:root`; denne filen er derfor bare320px-bevis. Sluttprøven bruker inline root-størrelse.
- `long-list-large.png`:390px med faktisk200% root-skrift, kontrollert sammen med320px. Teller bryter til egen rad, knapper og navn er lesbare, intern liste kan rulles. Alle fire bredde/skrift-kombinasjoner hadde scrollWidth=clientWidth. Etter nestet tallvelger/Avbryt var scrollTop2043 i begge målinger.

De første bildene er tatt før den siste forkortingen av Legg til-knappens synlige tekst og fjerningen av plusstegn fra omliggende tall i totalmodus. Ingen ny funksjonsforskjell fra kravene: relativ langt-trykk-modus er fortsatt signert. Fysisk iPhone, Safari, installert PWA, VoiceOver og bakgrunn/retur er ikke verifisert i denne gjennomgangen.
