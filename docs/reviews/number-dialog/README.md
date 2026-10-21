# Produktbilder: tallendringsdialog #25

Faktiske Chromium-bilder fra `tests/e2e/number-review.spec.ts` mot produksjonsbygget etter godkjent brukerreview. Før/Etter er større, Etter prioriteres, og båndet står fast utenfor tallrekken. GP/CP deler ett tallpanel; systemtastaturet åpnes ikke av det readonly feltet. Vanlig tastatur, ekte clipboard-paste og talltastene er funksjonelt prøvd.

![GP/CP-hjul, 390 × 844](money-390.png)

![Eget tallpanel, 390 × 844](keypad-390.png)

![Eget tallpanel, 320 × 568](keypad-320.png)

![Ta skade: bare reduksjon, HP/temp HP separat](damage-390.png)

200 % tekst på 320 × 568 krever intern innholdsrulling. Store tall tilpasses bredden, og inputfeltets høyde følger skriften. Footer og dialogramme står fast; skjermbildene viser ulike scrollposisjoner, ikke et flyttet popup-vindu.

![GP/CP med stor tekst](money-320-large-text.png)

![Tallpanel med stor tekst og input i viewporten](keypad-320-large-text.png)

Brukeren bekreftet første trykk og temp HP på fysisk installert iOS-webapp i forrige utgave `dfe853e`. Disse nye bildene dokumenterer Chromium-layout. Ny fysisk etterkontroll gjenstår. Se [kravmatrisen](../../CHARACTER_WORKSPACE.md#før-koding-kontroll-oppfølging-av-25-etter-fysisk-brukerreview) og [telefonprøvene](../../TESTING.md#test-av-tallendringsdialogen-25).
