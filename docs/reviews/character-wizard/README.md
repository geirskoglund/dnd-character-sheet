# Produktgjennomgang: karakterveiviser #61

Gjennomgangen bruker den faktiske appen i Chromium, med Alva Elf/Fighter11/Rogue3/Wizard10, Champion/Thief/School of Evocation, STR17, CHA14 og HP73. Ved tilbakegang fjernes Rogue; Bryn Fighter11/Wizard10 beholder sine svar. Egne skjemaverdier, nestede editorer og gjenopptakelse prøves i `tests/e2e/character-wizard.spec.ts`. Forventninger før koding og faktisk teststatus står i [kravmatrisen](../../CHARACTER_WORKSPACE.md#før-koding-kontroll-karakterveiviser-61); oppgavedetaljene vedlikeholdes i [#61](https://github.com/geirskoglund/dnd-character-sheet/issues/61).

| Faktisk bilde | Observert resultat |
| --- | --- |
| [Tre nivåer, 390 px](levels-390-100%25.png) | Klassenavn og nivå i hver pille, to per rad og ingen tom fjerde pille. Tilbake/Neste står nederst. |
| [Seks abilities, 390 px](abilities-390-100%25.png) | Alle seks verdier på samme skjerm i tre kolonner og to rader. STR/DEX/CON/INT/WIS/CHA inne i pillene. |
| [Tre subklasser, 320 px](subclasses-320.png) | Klassens navn over hvert eget valg; ett valgt alternativ per klasse. Ingen / ikke valgt er tilgjengelig uten nivåstyrte sperrer. Ingen automatisk videreføring ved svar. |
| [Abilities, 320 px / 200 % tekst](abilities-320-200%25.png) | Forkortelser og tosifrede verdier får plass uten avkutting. Pillenes innvendige plass og skrift tilpasses bredden, fortsatt tre kolonner. |
| [Nivåer, 320 px / 200 % tekst](levels-320-200%25.png) | Klassenavn og tall er lesbare. Den lange avklarte overskriften tar mer høyde; innholdet kan rulles internt, mens knappelinjen forblir tilgjengelig. |

Dette viderefører Eventyrjournal, fullskjermdialogen, lokale illustrasjoner, grafisk fremdrift og de felles tekst-/talleditorene. Forskjellen fra v0.11 og eldre ett-felt-skjermer er den uttrykkelig bestilte grupperingen i #61. Andre veivisere beholder sin oppdeling; utstyrs- og notatregresjoner kontrolleres av eksisterende tester. Ved normal tekst er både seks abilities og tre klassenivåer tilgjengelige uten mellomskjermer. Mobilprøvene bruker 390×844 og 320 CSS-piksler, normal og 200 % rottekst.

Første bildegjennomgang avdekket vertikalt brutt ability-forkortelse og avkuttet tall ved 320 px / stor tekst. Pillenes innvendige plass og skrift ble korrigert og bildene kontrollert på nytt. Tester kontrollerer nå også én tekstlinje, overflyt, riktig antall kolonner og tilgjengelige knapper. Ingen nye progresjonstabeller er innført: ukjent nivågrunnlag bevarer eksisterende ressurser, bruk og manuelle overstyringer.

Dette er **emulert Chromium**, ikke fysisk iPhone, WebKit eller en installert PWA. Safe area, native tastatur, sveip og reell første-trykk-betjening må gjennomgås i installert My D&D Test før merge. Brukerens produktgodkjenning kommer i tillegg til denne gjennomgangen.

Etter brukerens avsluttede iPhone-review er ledeteksten i HP-pillen forkortet til «Maks HP». [Uno med HP2 ved 390 px](hp-caption-390.png) er kontrollert i faktisk lokal Chromium. Den opprinnelige overskriften og tall-/lagringsflyten består. Brukeren har uttrykkelig godkjent testpublisering, merge og produksjonspublisering med denne rettelsen; dette erstatter tidligere ventestatus for merge, uten å utvide den dokumenterte fysiske testdekningen.
