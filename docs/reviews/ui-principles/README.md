# Produktgjennomgang av #58

**Nyeste vurdering:** Se [oppfølgingen etter PWA-review](followup/README.md). Den erstatter vurderingen av tallpillene, valgt svar/Neste og + Klasse nedenfor.

Kilde: [gjeldende sak](https://github.com/geirskoglund/dnd-character-sheet/issues/58). Primærbruk er installert PWA; bildene her er faktiske Chromium-rendringer, ikke fysisk iPhone eller native tastatur. Mastergrunnlag for før-bildene: `c32c4d0`.

## Art og klasse før/etter

| 390 × 844 | Før | Etter |
| --- | --- | --- |
| Art | [Før](before-species-390.png) | [Etter](after-species-390.png) |
| Klasse | [Før](before-class-390.png) | [Etter](after-class-390.png) |
| Nederst i klassevalget | [Før](before-class-bottom-390.png) | [Etter](after-class-bottom-390.png) |

| 320 × 844 | Før | Etter |
| --- | --- | --- |
| Art | [Før](before-species-320.png) | [Etter](after-species-320.png) |
| Klasse | [Før](before-class-320.png) | [Etter](after-class-320.png) |
| Nederst i klassevalget | [Før](before-class-bottom-320.png) | [Etter](after-class-bottom-320.png) |

Alva (Elf/Fighter1): tomt navn sperrer Neste; bekreftet navn aktiverer. Elf/Fighter er direkte valg uten ekstra Neste. Ubesvarte valg har ingen valgtmarkering; retur viser registrert valg. Standardvalg og bevarte utkast gir reell valgt-tilstand. Klassenivå og maks HP bruker samme grafiske tallverdi og tallvelger. De gamle klassebeholdernes unødvendige skille/marg er fjernet, og + Klasse har vanlig kompakt trykkflate. Lange lister kan fortsatt rulle. Stor tekst er også sammenlignet ved 320 px: [art før](before-species-320-large.png), [art etter](after-species-320-large.png), [klasse før](before-class-320-large.png), [klasse etter](after-class-320-large.png). Nøyaktige scrollmål finnes i [målingene](measurements.json).

## Tekst og appflater

- [Lang tekst, 390 × 844](after-text-390.png): egen editor, intern rulling, fast overskrift og OK/Avbryt. Linjeskift beholdes. Underliggende felt viser et kort journalutdrag og åpner editoren ved trykk.
- [320 × 360 med 200 % tekst](after-text-320-large.png): en kort, simulert synlig viewport. Knappene er tilgjengelige, teksten ruller internt. Dette simulerer plass, ikke native skjermtastatur.
- [Character](after-character.png), [Combat](after-combat.png), [Magi](after-magi.png), [Utstyr](after-utstyr.png): eksisterende journaluttrykk og navigasjon beholdes. [Meny](after-menu.png), [grafisk tallverdi](after-number-value.png) og [tallvelger](after-number-editor.png) er også gjennomgått. Søk, notater, egne egenskaper, ressurser og utstyrsveiviser prøves i nettlesertestene. Tall og tekst deler kalleren, men redigeres i hver sin popup.

Avbryt/X/Escape forkaster editorinnskriving; OK overfører bare dette feltet. Notater er prøvd med lang tekst, linjeskift og HTML-lignende brukerinnhold, lagring, reload og Angre. Utstyrsutkast er prøvd med navn, tallbonus og betingelse, lukking/reload/gjenopptak. Eksisterende regresjoner kontrollerer lagringsfeil og retry. Søk åpner uten fokus, og direkte typing beholder fokus. Ingen aktiv fokusramme innføres; tastaturbetjening består.

Fysisk iPhone i installert **My D&D Test** og vanlig nettleser gjenstår. Gjenta med native tastatur åpent, korte navn og lange notater, og OK/Avbryt/X på første trykk. Kontroller safe area, markør, rulling, retur til underliggende popup og oppdatering uten sletting av testdata. PR-en skal stå åpen til brukeren har testet og uttrykkelig godkjent.
