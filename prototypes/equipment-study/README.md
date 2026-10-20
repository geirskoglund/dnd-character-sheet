# Utstyrsverksted – isolert interaksjonsprototype

Åpne **[utstyrsverksted.html](utstyrsverksted.html)** direkte i Chrome eller Safari på Mac. Ingen server, installasjon, bygg, nettforbindelse eller andre filer trengs. Ved nedlasting fra GitHub er **[zip-filen](utstyrsverksted.zip)** enklest: pakk ut og dobbeltklikk HTML-filen. Zip inneholder bare den samme HTML-filen, uten tester eller bilder.

Dette er en arbeidsflytstudie, ikke en ny appversjon. Den leser ikke appens IndexedDB, importerer ingen karakterdata og registrerer ingen service worker. Hovedappens funksjon, dataformat og publiserte versjon er uendret.

## Prøv disse tre situasjonene

1. **Våpen:** Start «Et våpen med noe ekstra». Warhammer følger som grunnmodell. Gi den navnet Steam Hammer, legg til Ekstraskade → d4 → én terning → Fire → betingelse «Når hammeren damper». Lagre, slå på I bruk og bytt til to hender. Grunnprofil/ikon skal aldri måtte fylles ut på nytt.
2. **Amulett:** Start «En magisk amulett». Legg til Constitution → Sett til en verdi → 19, uten betingelse. Legg til Immunity → En tilstand → Frightened. Begge virkningene følger samme gjenstand. Vanlig Amulett gir ingen magisk bonus før du selv registrerer den.
3. **Fritekstevne:** Start «En evne med tre bruk», gi gjenstanden navn og velg Egen evne. Beskriv virkningen med egne ord. Ja til begrenset antall → maks 3 → Long rest. Etter lagring starter telleren på 3/3. Bruk −/+ for å føre forbruk og korrigering. Ingen spellkobling eller tilgjengelig-nå-felt ved opprettelse.

Prøv også direkte katalogvalg gjennom gruppenes +, tilbake, lukking midt i en registrering, reload, Fortsett, redigering, sletting og angre fjerning.

## Funksjonelle prøvevalg

- Inngangen gir kontekst; ingen duplisert kategorivelger. Et lite prøveutvalg av grunnmodeller, ikke en full katalog. Søk har hint og tilgjengelig navn. Opprett eget kommer etter listen.
- Kort navnesteg, deretter én felles oversikt over gjenstandens virkninger. Matrisen grupperer abilities, AC/angrep/skade/maksHP/bevegelse, skills/saves, beskyttelser og egen evne. + betyr legg til; hake betyr allerede representert, flere bidrag tillates.
- Valgt virkning bruker ett spørsmål eller én verdi per skjerm. Ingen generell «endre spillverdier»-avkrysning. Ingen egen bekreftelsesskjerm per virkning; siste svar fører direkte tilbake til oversikten. Oversikten er også oppsummeringen før én samlet lagring.
- Merknad, antall og krav om attunement er valgfrie opplysninger i samme redigeringsflyt. Ingen parallell ekspertdialog. Grafiske fremdriftspunkter følger spørsmålsgrenen; ingen synlig stegtelling.
- Oppslag viser I bruk øverst og relevant håndbruk/angrepsmåte. Attuned vises bare ved krav. Navnet står én gang i dialoghodet. Grunnlag kan ekspanderes med hjørnemarkør. Markøren brukes ikke på lukkekryss eller selvforklarende svar/listevalg.
- X/Escape bevarer ett separat utkast, også spørsmålsposisjon. Uferdig redigering endrer ikke sist lagrede gjenstand. Før en annen opprettelse/redigering spør prototypen om eksisterende utkast skal forkastes. Lagrede gjenstander, ett utkast og siste slettede oppføring er forsøkt bevart i en egen localStorage-nøkkel `dnd-equipment-study-v1`.
- Lagring kan være begrenset ved lokal filåpning/private nettleservinduer. Feil gir en tydelig advarsel, og arbeidet beholdes i minnet. Samme filplassering/nettleser anbefales. Last ned prøvedata gir en JSON-kopi; import inngår ikke. Tilbakestill sletter bare prototypens prøveoppføringer.

## Avgrensning og spørsmål til brukerreview

Dette prøver føring og oppslag. Tall tastes direkte i denne isolerte flytprøven; appens tallhjul er ikke kopiert inn. Ingen faktiske karaktertotaler, automatisk evaluering av vilkår, kampmotor eller hvileautomatikk beregnes. Sett-til beskrives som fast verdi; for ability-gjenstander som Amulet of Health gjelder ikke senking av en allerede høyere verdi. Avgrensningen mellom absolutt overstyring og minimumsverdi må formaliseres ved produksjonsimplementasjon.

Hver fritekstevne kan ha egen teller. Delte charges, variabel utgift, delvis/terningbasert gjenoppretting og skiftende aktiveringsvilkår er ikke modellert. Disse kan beskrives i merknad, og telleren korrigeres manuelt. Faste bonusvirkninger, ekstraskade og beskyttelser har ikke egne brukstellere i denne prøven. Ingen full datamigrering/produksjonskonkurrenskontroll eller magisk katalog inngår. Sjeldne våpen uten grunnmodell er ikke gjennomdesignet; Opprett eget gir navn/egne virkninger, men ingen ny våpenprofilredigerer.

Vurder spesielt: Er inndelingen forståelig? Er det enkelt å føre flere virkninger? Er antallet spørsmål passende? Er forskjellen på fast bonus, sett-til, ekstraskade, beskyttelse og egen evne tydelig? Detaljflyten er et forslag til vurdering, ikke godkjent produksjonsdesign.

## Reproduserbar kontroll

Fra repository-roten med eksisterende avhengigheter:

```sh
node prototypes/equipment-study/check.mjs
npm run build
```

`CHROMIUM_PATH` kan peke til en annen Chromium. Skriptet bruker repoets Playwright og trenger ingen ny avhengighet. Det henter HTML fra disk og oppfyller dokumentforespørselen direkte i nettleseren; ingen testserver eller ekstern nettforespørsel brukes. Dette gir en testbar nettleser-origin for lokal lagring. Miljøets administrerte Chromium blokkerer `file://` med `ERR_BLOCKED_BY_ADMINISTRATOR`; direkte filåpning på Mac/Safari er derfor ikke fysisk verifisert her. HTML har kun innebygd CSS/JS/SVG og ingen import/fetch, og er konstruert for lokal filåpning.

11 scenariogrupper kontrollerer de tre flytene, redigering/bevart brukt antall, utkast/reload, direkte katalogvalg, markører, sletting/angre, tilbake/betingelsesgren, smal bredde/stor tekst, lagringsfeil/korrupt lokaldata og frakoblet betjening. Layout prøves ved 320, 390, 768 og 1280 px med 100/200 % tekst, gjennom faktiske registreringsskjermer. Bilder genereres i [screenshots](screenshots/). Resultat og observerte begrensninger føres også i [kravmatrisen](../../docs/CHARACTER_WORKSPACE.md#isolert-utstyrsprototype-2026-10-20).

Zip regenereres fra HTML ved endring. Kilden er HTML-filen; zip er bare nedlastingsinnpakning.
