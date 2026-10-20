> Nyeste presisering: illustrert veiviser med ett spørsmål per skjerm, direkte svarflater, grafiske fremdriftspunkter og separate gjenopptakbare utkast. Penger bruker to hjul (hele GP / 00–99) med felles midtmarkering. HP/temp HP har hjørnemarkør i Combat. Se [implementasjonen](GUIDED_WORKFLOWS.md#illustrert-spørsmålsveiviser-og-utkast).

> Gjeldende arbeidsflyter (2026-10-20): [GUIDED_WORKFLOWS.md](GUIDED_WORKFLOWS.md). Eventyrjournal videreføres med fire ikonfaner og Meny, separat Magi, vertikalt tallhjul med eksakt innskriving og korte forgrenede veivisere. Hjørnetrekanten brukes på arbeidsflatens oppslag/kort, aldri på navigasjon, Combat-kategorier, lukkekryss eller selvforklarende listevalg. Rutinemeldinger om lagring fjernes, feil er tydelige. Toppfelt scroller fortsatt bort. Eldre slider-/trefaneskisser nedenfor er historikk.

# Designbrief – D&D Character Companion

**Mål:** Et kompakt, intuitivt, vakkert digitalt karakterark som **føles personlig og inspirerende** ved et fysisk D&D-bord, uten å stjele oppmerksomheten fra spillet.

Gjeldende produksjonsuttrykk er nå [Eventyrjournal](EVENTYRJOURNAL.md), implementert etter brukerens bestilling 2026-10-20. Historiske forslag under dokumenterer hvordan retningen ble valgt.

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
- Fire hovedfaner Character, Combat, Magi og Utstyr, samt Meny, separate scrollposisjoner (nyere avklaring §13).
- Character: fem like store statuspiller på én rad (HP, AC, Initiative, GP, Speed). HP er kun status; Temporary HP og HP-endringer ligger i Combat. Fire tilpassbare modifier-kort med **fulltekst**.
- Karakteradministrasjon og grunnlagsredigering ligger i menyen; ingen permanente administrasjonspaneler.
- Alle piller innen hver seksjon har lik størrelse, form og ramme, inkludert inline +.
- Piller/kort for lagret informasjon, åpne detaljer ved trykk.
- **Inline + i samme pilleform** som dataelementene, rett etter siste element med naturlig wrap; ingen separat sirkel eller egen pluss-rad.
- Søkbare velgerpaneler for store kataloger; søk og filtre øverst; egenregistrering lett tilgjengelig.
- Ved flerverdiregistrering gjelder det [vedtatte veiviserprinsippet](REQUIREMENTS.md#overordnet-prinsipp-veiviser-ved-flerverdiregistrering): ett spørsmål eller én verdi per skjerm og bare relevante oppfølgingsspørsmål. Direkte listevalg får ingen ekstra veiviser. Det illustrerte spørsmålsmønsteret er implementert for karaktergrunnlag, egne egenskaper/spells, beholdninger og utstyrsvarianter. Avanserte ekspertfelt og tidligere utsatte flyter beholdes; se §14 og GUIDED_WORKFLOWS.
- Combat har tre faner Action/Bonus/Reaction, ikke gjentatt tittel under. Andre egenskaper utenfor, «Ta skade» og «Hvile» under.
- Combat som **oppslag**; fysiske terninguttrykk og verdier lesbare ved trykk, ikke ekstra «Bruk»-knapper eller turstatus.
- Damage dialog: én komponent som standard, flere via +, egne modifikatorlinjer og kompakte on/off/condition-kontroller; synlig og etterprøvbar resultatoppsummering.
- Skill details/modifiers bør være ett eller to trykk unna fra vanlige situasjoner; unngå permanent søkeboks i modifierseksjonen.
- Aldri dupliser Bakgrunn og Notater; navngitte notatpiller. Strukturerte data må ikke skjules bak generisk «øvrige felt».

## Liten skjerm / tilgjengelighet
- Primær bredde 360–390 CSS px; vurder 320 px, stor skrift, smale layouts og nettbrett. Horisontal scrolling kun som bevisst interaksjon for Combat faner, ikke for formular.
- Klare fokusindikatorer, tastaturbetjening for desktop, touch targets omtrent 44px når praktisk mulig, semantiske labels og god skjermleserstøtte.
- Modals/paneler kan være større for søkbare kataloger, små for én slot/ressurs; unngå å tvinge brukeren gjennom mange dialoger.
- Tydelige, merkbare feil ved mislykket lagring eller fare for tap av data; ingen rutinemeldinger om vellykket lagring. Undo, tom/oppbrukt ressurs og uavklarte betingelser skal være forståelige.

## Rolle til referanseprototyper
Prototyper v0.2–v0.11 viste og testet **arbeidsflyt**. v0.11 har regresjoner (bl.a. skadeegenskaper og generisk redigeringspopup). **Kopier ikke UI eller kode ukritisk.** Krav og gjeldende beslutninger går foran skjermbilder og HTML.

## Godkjenningsflyt
1. Designskisser/klikkbare views av 2–3 retninger for hovedfanene.
2. Brukeren velger én retning og kommenterer.
3. Codex bygger konsistent design-system og gjennomfører test av ekte mobilarbeidsflyt.
Fremdrift og implementasjon trenger ikke stoppe på teknisk grunnarbeid mens designalternativene utformes.

## Pågående designstudie 2026-10-19

Tre visuelle forslag er levert. Se [felles karakter, komponentdekning og vurderingsgrunnlag](design/2026-10/README.md). **2026-10-20 valgte brukeren Eventyrjournal**, med runde ability-mynter fra Stjernekart. Meny nederst, bunnfaneikoner, små overskriftsikoner og portrettpresentasjonen videreføres; uten bilde vises en pen placeholder. Klikkbarhet skal skilles subtilt fra ren informasjon. Ability-forkortelser følger myntbuen uniformt.

Neste vurderingsgrunnlag er rader med alle elementfamiliene, inkludert artsegenskaper, features/feats, spells/cantrips og utstyr. Gjenbruk av samme form er ønskelig der funksjonen er lik. Ikonomfang og modifiers uten ramme diskuteres før detaljene fastsettes; HP-forløpsindikatoren har lav prioritet. Se [full brukeravklaring og åpne spørsmål](REQUIREMENTS.md#valgt-retning-og-videre-designavklaringer-2026-10-20). Store kataloger med individuelle ikoner eller produksjonsimplementasjon er ikke bestilt. Dialogdetaljer og øvrige samhandlingsforslag er fortsatt til vurdering.

Brukeren bestilte disse komponentplansjene 2026-10-20. Se [elementfamilier, modifier-/ikonalternativer og tilstander](design/2026-10/components/README.md), med lokale rendrer og dokumenterte kontroller. Studien viser GP som handling og øvrige Character-statusfelt som informasjon, i tråd med faktisk føringsflyt. Ingen produksjonskode endres. Ved senere implementasjon må valg av detaljer, samtlige skjermstørrelser, stor tekst og reelle brukerflyter fortsatt verifiseres.

Neste bestilte prøve bruker en [liten fylt hjørnetrekant](design/2026-10/8-hjornemarkor.png) som felles klikkbarhetsmarkør, uten å endre bakgrunn/rammetykkelse for dette formålet. Den er prøvd på både luftige modifiers og innrammede elementer, samt pluss, brede kontroller, navigasjon og knapper. Modifierens funksjon er å velge hva favoritten viser. Endelig vurdering av markøren, statusvisning og detaljene gjenstår; de tidligere plansjene beholdes som historiske alternativer.

Etter visning godkjente brukeren hjørneuttrykket med **samme fyllfarge som ramme/bunnlinje**. HP-slideren er avklart som en innrammet, relativ dragkontroll som går til midten ved slipp og beholder endringsbeløpet. Nye drag justerer videre; beløpet vises separat. HP-resultatet begrenses til 0/maks med temp HP først ved skade. Se [presise krav og eksempel](REQUIREMENTS.md#avklart-hjørnefarge-og-relativ-hp-slider-2026-10-20). Eksisterende plansjer viser ikke denne endelige fargen eller sliderbetjeningen. Ingen produksjonsimplementasjon er bestilt gjennom avklaringen.

Brukeren har også godkjent [et kompakt toppfelt som scroller bort](REQUIREMENTS.md#avklart-kompakt-toppfelt-og-scrolling-2026-10-20). Appnavn og regelutgave hører under «Om appen», ikke over karakteridentiteten. Portrett/placeholder, navn og karakterinformasjon beholdes. Ingen fast/sticky toppseksjon; meny og hovedfaner forblir tilgjengelige nederst. De eldre plansjenes ekstra merkevare-/regeltekst er ikke endelig design.

**B2 med individuelle ikoner er nå valgt** fra sammenligningsplansje 06. Se [ikonkrav](REQUIREMENTS.md#individuelle-ikoner-valgt-2026-10-20). Et komplett sett for støttet innhold og en gjennomtenkt reservemarkør trengs før denne varianten kan erklæres ferdig implementert. Eksempelikonene er ikke tilstrekkelig dekning; konsistent stil, gjenkjennelighet og tekstplass på mobil må kontrolleres. Ingen produksjonsimplementasjon er bestilt i denne avklaringen.
