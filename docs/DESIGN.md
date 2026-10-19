# Designbrief – D&D Character Companion

**Mål:** Et kompakt, intuitivt, vakkert digitalt karakterark som **føles personlig og inspirerende** ved et fysisk D&D-bord, uten å stjele oppmerksomheten fra spillet.

## Designintensjon
- Moderne, gjennomarbeidet mobilprodukt med diskré fantasy/tablå-identitet. Mer **fantasy-journal og elegant verktøy** enn business-dashboard, men uten pergamentstøy, tunge border, utsmykkede knapper og klisjéer.
- Høy kontrast, tydelig typografi, gode trykkflater, små mengder permanent tekst. Kompakt er **prioritert informasjonsarkitektur**, ikke mikroskopiske knapper.
- Unngå stor visuell vekt på navigasjon; de viktigste verdiene og handlingene skal dominere.
- Mørk modus kan være naturlig ved spillebordet, men sørg for tilgjengelighet og lesbarhet.

## Tre visuelle retninger – foreslå og vis før endelig valg
Codex skal lage **2–3 klart forskjellige designkonsepter** med samme eksempelkarakter og **samme funksjonalitet** på Character og Combat. Foreløpige muligheter:
1. **Modern Arcana:** varm mørk bakgrunn, forsiktig metallisk aksent, rene kort, diskrete fantasy-motiver.
2. **Field Journal:** lyst/dempet, materialfølelse uten fotorealistisk pergament, typografisk karakter.
3. **Precision Companion:** nesten minimalistisk, sterk informasjonsarkitektur med ett særegent grafisk element.
Ikke bruk forslagene som ferdig bestemte farger/fontvalg. Brukeren skal velge retning etter visuell vurdering.

## Låste UX-mønstre som ikke kan redesignes bort
- Tre hovedfaner Character, Combat og Utstyr, separate scrollposisjoner.
- Character: fem like store statuspiller på én rad (HP, AC, Initiative, GP, Speed). HP er kun status; Temporary HP og HP-endringer ligger i Combat. Fire tilpassbare modifier-kort med **fulltekst**.
- Karakteradministrasjon og grunnlagsredigering ligger i menyen; ingen permanente administrasjonspaneler.
- Alle piller innen hver seksjon har lik størrelse, form og ramme, inkludert inline +.
- Piller/kort for lagret informasjon, åpne detaljer ved trykk.
- **Inline + i samme pilleform** som dataelementene, rett etter siste element med naturlig wrap; ingen separat sirkel eller egen pluss-rad.
- Søkbare velgerpaneler for store kataloger; søk og filtre øverst; egenregistrering lett tilgjengelig.
- Combat har tre faner Action/Bonus/Reaction, ikke gjentatt tittel under. Andre egenskaper utenfor, «Ta skade» og «Hvile» under.
- Combat som **oppslag**; fysiske terninguttrykk og verdier lesbare ved trykk, ikke ekstra «Bruk»-knapper eller turstatus.
- Damage dialog: én komponent som standard, flere via +, egne modifikatorlinjer og kompakte on/off/condition-kontroller; synlig og etterprøvbar resultatoppsummering.
- Skill details/modifiers bør være ett eller to trykk unna fra vanlige situasjoner; unngå permanent søkeboks i modifierseksjonen.
- Aldri dupliser Bakgrunn og Notater; navngitte notatpiller. Strukturerte data må ikke skjules bak generisk «øvrige felt».

## Liten skjerm / tilgjengelighet
- Primær bredde 360–390 CSS px; vurder 320 px, stor skrift, smale layouts og nettbrett. Horisontal scrolling kun som bevisst interaksjon for Combat faner, ikke for formular.
- Klare fokusindikatorer, tastaturbetjening for desktop, touch targets omtrent 44px når praktisk mulig, semantiske labels og god skjermleserstøtte.
- Modals/paneler kan være større for søkbare kataloger, små for én slot/ressurs; unngå å tvinge brukeren gjennom mange dialoger.
- Feedback ved lagring, undo, tom/oppbrukt ressurs, betingelser som ikke er bekreftet, og tap av lokal data.

## Rolle til referanseprototyper
Prototyper v0.2–v0.11 viste og testet **arbeidsflyt**. v0.11 har regresjoner (bl.a. skadeegenskaper og generisk redigeringspopup). **Kopier ikke UI eller kode ukritisk.** Krav og gjeldende beslutninger går foran skjermbilder og HTML.

## Godkjenningsflyt
1. Designskisser/klikkbare views av 2–3 retninger for hovedfanene.
2. Brukeren velger én retning og kommenterer.
3. Codex bygger konsistent design-system og gjennomfører test av ekte mobilarbeidsflyt.
Fremdrift og implementasjon trenger ikke stoppe på teknisk grunnarbeid mens designalternativene utformes.

## Pågående designstudie 2026-10-19

Brukeren har bestilt tre visuelle forslag og har ingen sterk preferanse for lyst/mørkt tema. Se [felles karakter, komponentdekning og vurderingsgrunnlag](design/2026-10/README.md). Runesmed, Eventyrjournal og Stjernekart er forslag, ikke valgte temaer. Ved vurderingen inngår også meny tilgjengelig uten scrolling, ulike dialogtyper med fast tilgjengelig avbryt/lukk, Combat-swipe og kontrolltilstander. Endelig tema og eventuelle nye samhandlingsmønstre velges før produksjonsimplementasjon.
