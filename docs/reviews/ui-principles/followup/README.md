# Oppfølging etter fysisk PWA-review

Dette erstatter vurderingen av tallutforming, valgt svar/Neste og + Klasse i den første gjennomgangen. Brukerens bilder av `aa3c43c` viste at den tidligere tallvisningen og den store klasseknappen ikke oppfylte WP02/WP08. De gamle lokale bildene er historikk, ikke bevis for den observerte PWA-layouten.

Nye faktiske Chromium-bilder med mobil/touch-geometri:

- [Rogue: standard «Ingen / ikke valgt» med Neste](subclass-default-390.png), [Thief etter Tilbake med Neste](subclass-back-390.png).
- [Klassenivå](level-390.png) og [maks HP](hp-390.png): delt ramme og hjørnemarkør med Combat, ledetekst inni, større tall og midtstilling.
- [To klasser, subclass](subclass-multiclass-390.png), [nivå](level-multiclass-390.png), [320 px](level-multiclass-320.png), [stor tekst](level-multiclass-320-large.png) og [tallpillen rullet frem](level-multiclass-320-large-value.png).
- [Utstyr med registrert standardvalg og Neste](equipment-default-390.png), [utstyrstall](equipment-number-390.png).

+ Klasse bruker nå en vanlig knapp. Den generelle pilleklassens `height:100%` er fjernet, og skjulte subclass-beholdere tar ikke opp gridrader. Høydeprøvene kontrollerer én/to klasser ved 390/320 px, 844/568 px høyde og 100/200 % tekst. Tallpillens ramme/radius sammenlignes med den faktiske Combat-pillen; midtstilling, intern ledetekst og trekant kontrolleres eksplisitt. Se [målinger fra bildene](measurements.json).

Teksteditoren bruker kallerspesifikke `multiline`/`maxLength`-innstillinger via `field`/`textArea` eller `editText`. Native feltgrenser beholdes. Prøvene dekker standard-/tidligere svar, reload/utkast, utstyrsvalg og tall, tre faktiske tekstgrenser, ekte clipboard-paste og simulerte komposisjonshendelser. Å bekrefte en urørt eldre tekst skal ikke automatisk kutte den.

Bildene og de automatiske prøvene er ikke en fysisk iPhone-kjøring eller en native IME/tastaturtest. WebKit er ikke installert i arbeidsmiljøet. Etter publisering av `cd0e66472ef94fa54b8e0521e73af8ef1cadec41` avsluttet brukeren gjennomgangen 22. oktober 2026 med «Alt bra nå. Complete pr». Rettelsene er akseptert og merge av PR #59 uttrykkelig godkjent. Det foreligger ingen detaljert testlogg per enhet eller tastaturscenario fra brukeren.
