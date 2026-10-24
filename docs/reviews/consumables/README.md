# Produktgjennomgang av Forbruk #30/#31

390px fullskjermliste og Ny total er visuelt inspisert i Chromium med en Elf Fighter1, HP12 og manuelt registrert beholdning18. Egen langlistefixture med30 poster brukes for rulling/plassbruk; den er satt opp direkte i testlageret og er ikke bevis for registrering av30 varer gjennom UI. Standardregistrering og DM-variant/utkast prøves separat gjennom ekte appflyt i `tests/e2e/consumables.spec.ts`.

- `stock-390.png`: liste med kategorier, ikon, enhet og raske tellere.
- `total-390.png`: reell Før18/Etter18 og eksisterende fullskjermtallvelger.
- `stock-320-large.png`: to uavhengige Arrows-poster ved320px. Den første bildeserien brukte stylesheet for stor tekst som ikke overstyrte `:root`; denne filen er derfor bare320px-bevis. Sluttprøven bruker inline root-størrelse.
- `long-list-large.png`:390px med faktisk200% root-skrift, kontrollert sammen med320px. Teller bryter til egen rad, knapper og navn er lesbare, intern liste kan rulles. Alle fire bredde/skrift-kombinasjoner hadde scrollWidth=clientWidth. Etter nestet tallvelger/Avbryt var scrollTop2043 i begge målinger.

De første bildene er tatt før den siste forkortingen av Legg til-knappens synlige tekst og fjerningen av plusstegn fra omliggende tall i totalmodus. Ingen ny funksjonsforskjell fra kravene: relativ langt-trykk-modus er fortsatt signert. Fysisk iPhone, Safari, installert PWA, VoiceOver og bakgrunn/retur er ikke verifisert i denne gjennomgangen.


## Etter brukerreview: Forbruksvarer

Nyeste bilder: `review-equipment-390.png` (egen seksjonsrad/flaskeikon uten AC), `review-stock-390.png` (Utstyr), `review-combat-stock-390.png` (bare OK, terninger og justering), `review-combat-lookup-390.png` (relevant potion-tekst uten tabell), `review-remove-positive-390.png` (slettingsvarsel med5), `review-stock-320-large.png` (faktisk200% root-skrift). Disse er visuelt inspisert etter endringene. Eldre bilder ovenfor er historikk.

Observerte resultater: Alle tre tellerknapper er like brede, navn og terninguttrykk er lesbare, enheter tar ingen plass, og administrasjon er borte i Combat. Faste bunnlinjer er synlige; stor tekst bryter innhold til nye linjer og listen ruller. Den nye nulltesten bekrefter3→0 uten at raden forsvinner, skjuling ved ny Combat-åpning og påfyll fra Utstyr. Bekreftelsen kan avbrytes tilbake til samme oppslag; simulert lagringsfeil bevarer bekreftelse og post før ett vellykket retry.

Ingen fysisk iPhone-/Safari-kontroll påstås for denne nye versjonen. Brukerens bilder gjelder den forrige testutgaven og er grunnlag for endringene, ikke godkjenning av sluttversjonen.


## Ikon- og terningvalg etter nytt brukerreview

`icon-choices-390.png` og `icon-choices-320-large.png` viser faktiske ikonforhåndsvisninger med navn. `dice-choice-390.png`, `dice-choice-320.png` og `dice-choice-320-large.png` viser den illustrerte terningvelgeren; siste bilde er rullet til valgene ved320px/200% root-skrift. Bilder er inspisert: tre terningkolonner ved vanlig tekst, én kolonne når stor tekst krever plassen. Alle valg og faste handlinger kan nås uten horisontal rulling. Eldre bilder er historikk.

Gjennomført i Chromium, ikke fysisk iPhone/Safari. Brukerens tidligere oppdateringsfeil er grunnlag for mer robust worker-kontroll, men den konkrete årsaken på telefonen er fortsatt ikke fastslått.
