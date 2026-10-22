# Fast testadresse på GitHub Pages

Test: https://geirskoglund.github.io/dnd-character-sheet/test/

Produksjon: https://geirskoglund.github.io/dnd-character-sheet/

Én testutgave er tilgjengelig om gangen. Testappen viser «Testversjon», PR-nummer og kort commit-ID; startutgaven fra master viser master i stedet. Den kan installeres separat som **My D&D Test**. Produksjonsappens installasjonsnavn endres ikke av dette oppsettet.

## Første gang på telefonen

Oppdater produksjonsappen til utgaven med testmiljøstøtte før du åpner testadressen. En eldre, fortsatt aktiv produksjons-worker har en generell navigasjonsregel som ellers kan vise produksjonsappen på testadressen. Bruk eksisterende «Se etter oppdatering» / «Oppdater appen»; ikke slett nettleserdata. Kontroller at testadressen faktisk viser «Testversjon» før du bruker den.

Åpne deretter testadressen. Den begynner med et eget tomt karakterark. Vil du bruke en installert testapp, installer og åpne den før du importerer testgrunnlaget. Hvis ønskelig: eksporter backup fra produksjonsappen og importer den én gang i testappen. Etter dette beholdes lokale testkarakterer mellom testpubliseringer og bytte av PR. Testappen har samme eksplisitte oppdateringsvalg som produksjon.

Data finnes i nettleseren/installasjonen som opprettet dem. Ny nettleser, privat modus eller flytting mellom nettleser og hjemskjermapp kan innebære et annet lagringsområde på iOS. Ta backup før slike bytter. Det er ingen synkronisering mellom enheter eller miljøer.

## Velge PR til test – for agenten

1. Opprett funksjons-PR mot master og vent på grønn **Validate** på gjeldende PR-hode. Branchen må inneholde testmiljøstøtten fra master; merge/rebase master om nødvendig.
2. Velg PR med workflowen **Deploy GitHub Pages**, kjørt fra master:

   ```sh
   gh workflow run pages.yml --repo geirskoglund/dnd-character-sheet --ref master -f preview=PR_NUMMER
   ```

   Bruk tallet uten `#`. Alternativt: Actions → Deploy GitHub Pages → Run workflow → master → Preview.
3. Vent på grønn publisering og HTTPS-kontroll i workflowen. Gi brukeren den faste testlenken, PR-lenken og hva som skal testes. Brukeren trenger ikke gjennomgå kode.
4. Nye commits i **den valgte PR-en** publiseres automatisk etter vellykket Validate. Urelaterte PR-er tar ikke over adressen. Gamle/outdaterte valideringskjøringer og mislykkede bygg publiseres ikke. Ved samtidige kjøringer eller behov for ny publisering kan samme PR-nummer velges igjen.
5. Behold PR-en åpen til brukeren uttrykkelig godkjenner funksjonsendringen. Testpublisering er ikke produksjonsmerge.

`preview=keep` bygger master og beholder sist publiserte test-commit, også etter merge/sletting av PR-branchen. `preview=master` velger siste master som testgrunnlag. Det nullstiller ikke testdata. Det trengs ingen fast testbranch, ekstra repository, konto eller hostingtjeneste.

## Teknisk kontrakt

- GitHub Pages mottar ett samlet nettsted. Workflowen bygger master og valgt test-commit i separate jobber og legger testbygget under `test/` **etter** at begge service workers er generert. Produksjonens precache inneholder dermed ingen testfiler.
- Publisert `deployment.json` inneholder de eksakte commit-ID-ene og valgt PR. Senere produksjonspubliseringer leser dette for å bevare testutgaven. Metadata-/nettverksfeil stopper publisering; HTTP 404 ved første oppsett gir master som startutgave. Eksplisitt valg av PR/master kan gjenopprette ugyldige metadata. Ingen branch-/PR-strenger brukes som shell-kode.
- IndexedDB heter fortsatt `dnd-character-companion` i produksjon. Test bruker alltid `dnd-character-companion-test`, uavhengig av PR/commit. Karakterer, assets, historikk, settings og veiviserutkast følger hver sin database. Ingen DB-versjons-/backupformatendring, automatisk kopiering eller sletting.
- Service worker og manifest ligger relativt til hvert miljø. Testmanifestets `id`, `start_url` og `scope` løses til testadressen og gir egen installasjonsidentitet.
- Workbox-cache får ulike miljøprefikser. Generell `cleanupOutdatedCaches` er deaktivert fordi root-scope ellers også kan matche nestet testcache; Workbox fjerner fortsatt utdaterte precache-oppføringer i sin egen cache. Produksjonens navigasjonsfallback ekskluderer teststien. Oppdateringskontrollen teller ikke vinduer fra det andre miljøet.
- Nåværende app har ingen andre varige appinnstillinger i localStorage/sessionStorage. Testappen leser ikke produksjonens gamle prototype-localStorage. Nye lagringsmekanismer må videreføre miljøskillet.
- PR-bygg har bare lesetilgang, uten lagrede Git-credentials. Valg av samme-repo-PR og publisering kjøres fra betrodd master-workflow i separate jobber. Fork-PR-er velges ikke. Begge miljøer deler origin; lagringsnavnene beskytter mot utilsiktet sammenblanding, ikke ondsinnet JavaScript.
- Mislykket plan/bygg hindrer ny Pages-deploy. En feil i kontrollen etter selve deployen rapporteres som feil; den ruller ikke automatisk nettstedet tilbake. Gjenpubliser et kjent commit ved behov.
- Testdata flyttes aldri til produksjon ved godkjenning. Bruk vanlig backup/import ved et bevisst ønske om å overføre karakterdata. Eldre testkode kan ikke forventes å lese et nyere databaseskjema; slik feil skal aldri møtes med automatisk sletting.

## Verifikasjon

`tests/pages-plan.test.ts` kontrollerer PR-valg, master/test-skille, bevart test-commit, relevante/stale valideringskjøringer og avvisning av ugyldige valg/forker/feilende Validate.

`tests/e2e/preview.spec.ts` bygger to faktiske testutgaver og serverer produksjon/test på samme origin. Den prøver backup-import én gang, uavhengig redigering, portrett, historikk, veiviserutkast, oppdatering av begge scopes mens det andre er åpent, bytte av test-PR, beholdte databaser og offline-reload etter begge aktiveringer. Workflowen kontrollerer også publiserte HTTPS-adresser, testmanifest og commit-metadata.

Fysisk installering og oppdatering på iPhone er ikke dekket av Chromium-testen og skal rapporteres separat. Oppsettet implementerer ikke tallhjulssak #25.

## Test av tallendringsdialogen #25

Prøv den valgte funksjons-PR-en på testadressen over. Kontroller «Testversjon» og PR/commit i appen før test. Bruk «Se etter oppdatering» / «Oppdater appen» ved en eldre utgave; bevar testkarakterene og ta gjerne backup først.

1. **Vanlige tall og nestet redigering:** Meny → Rediger karakter → trykk klassenivå eller maks HP. Dialogen heter «Endre …», viser Før/Etter og starter alltid med 0. Positive tall står over, negative under. Rull, bekreft med OK, og kontroller at bare dette feltet i skjemaet endres. Avbryt/X/Escape skal bevare skjemaet uten tallendringen. Karakteren endres først når du fullfører skjemaet.
2. **Direkte innskriving:** Trykk midttallet: hjulene erstattes av et eget tallpanel med en visuell 0 når innskrivingen er tom, uten markering/håndtak. Null-plassholderen skal forsvinne når du skriver og komme tilbake når du sletter alt; den skal ikke påvirke valgt endringsbeløp. Før/Etter beholder hjulvalget til du begynner å taste. Retur eller OK uten inntasting skal beholde valget; første siffer erstatter endringsbeløpet. Bruk talltastene, ± og slett; vanlig tastatur og lim inn støttes også. Pilen viser hjulene igjen, eller du kan trykke OK direkte. Verdien skal ikke skjules av systemtastaturet. Før/Etter og hovedknappene skal beholde plasseringen. Valget og Før/Etter skal stemme; desimalpunkt/komma i ett hjul skal gi forklaring. Store endringer mot klassens 1–20-grense begrenses til nærmeste gyldige resultat. Tall-elementer har ingen «Fjern verdi»-knapp (#58 WP04).
3. **Penger:** Trykk GP-pillen. Fra 0 gir `9 | 80` og `10 | −20` begge 9,80 GP. Fra 10,50 gir `−10 | −50` null. Hundredelshjulet har −99…99; resultatet skal aldri bli negativt. Avbryt bevarer beløpet, OK lagrer, og Angre gjenoppretter.
4. **HP og beholdninger:** På Combat: med HP 7/12 og temp HP 3 skal HP-pillen med −5 gi HP 2 og beholde temp HP 3. Prøv −100 → HP 0 og +100 → HP 12; temp HP skal være uendret. Angre, og prøv Ta skade med −5: HP 5 og temp HP 0. Ta skade har egen tittel og tillater bare 0 eller reduksjon, også ved direkte innskriving; Før/Etter viser vanlig HP som hovedtall og temp HP separat. OK lagrer én hendelse; Angre gjenoppretter begge delverdier. Fra en beholdningspille åpner tallet i oppslaget dialogen; verdien begrenses til 0…maks og oppslaget er tilgjengelig etterpå.
5. **Fysisk iPhone – fortsatt nødvendig før merge:** Gjenta langsomme/raske sveip, stopp, midttrykk og direkteinnskriving i installert **My D&D Test**, deretter i vanlig nettleser på samme telefon. Mens tallpanelet er åpent: trykk OK én gang, Avbryt én gang og X én gang i hver sin åpning. Ingen systemtastatur skal dekke panelet. Sveip også over/under/ved siden av hjulene: dialogen skal stå fast og ikke avdekke skjermen under. Hver handling skal virke på første trykk og bare én gang. Kontroller også neste handling i skjemaet, HP ved 0 og smal skjerm/stor tekst. Meld iOS-versjon, nettleser/installert modus, PR/commit og konkret feilforløp ved avvik. Brukeren bekreftet første-trykk-betjening og temp HP i `dfe853e` på installert iOS-webapp; dette er historisk fysisk bevis. Etterkontroller denne nye utgaven; Chromium-testene alene kvitterer ikke ut den nye fysiske betjeningen eller hele #26.

PR-en skal stå åpen til brukeren har testet og uttrykkelig godkjent merge.

## Test av UI-prinsippene #58

Primær test er installert **My D&D Test** på fysisk iPhone. Gjenta tastaturprøvene i vanlig nettleser. Kontroller «Testversjon», PR og commit før start. Oppdater med appens vanlige oppdateringsvalg; ikke slett nettleserdata.

1. Meny → Ny karakter: tomt navn skal gi deaktivert Neste. Trykk navnet, skriv og prøv Avbryt, X og OK i hver sin åpning. Bare OK skal overføre teksten. Tøm navnet med OK og kontroller at Neste deaktiveres igjen. Art-/klassevalgene skal være kompakte; et ubesvart valg skal ikke se valgt ut. Direkte valg går videre på ett trykk.
2. Meny → Rediger karakter: prøv klassenivå og maks HP. Grafiske tall åpner tallvelgeren; OK endrer bare valgt felt. Avbryt/X bevarer tall og veivisersteg. Ingen tall-elementer har Fjern verdi-knapp. Lukk veiviseren uten å fullføre hvis du ikke vil bekrefte endringen på karakteren.
3. Notater: prøv tittel og lang tekst med linjeskift. Med native tastatur åpent skal teksten kunne rulles, og OK/Avbryt/X virke på første trykk. Kontroller også smal skjerm/stor tekst. Lagre, gjenåpne og prøv Angre.
4. Utstyr → tilpass en gjenstand: sett navn, en tallbonus og en betingelse eller merknad. Rediger tekst og prøv OK og Avbryt/X. Andre svar og aktuelt spørsmål skal bestå. Lukk hele veiviseren, åpne utkastet igjen og kontroller svarene.
5. Åpne utstyrsvelger og innholdsbibliotek på nytt. Søk skal ikke få fokus eller åpne tastaturet automatisk. Trykk søk aktivt og skriv direkte. Kontroller Character, Combat, Magi, Utstyr og meny: ingen røde fokusrammer skal dukke opp.

Rapporter iOS-versjon, installert modus/nettleser, PR/commit og konkret forløp ved avvik. Chromium-testene og de simulerte viewportene dokumenterer ikke fysisk iPhone-tastatur. Fysisk kontroll og uttrykkelig mergegodkjenning gjenstår ved overlevering.

### Etterkontroll av PWA-reviewet

- **Valgt svar og Neste:** Ny Jones → Dragonborn → Rogue. «Ingen / ikke valgt» skal ha Neste. Gå videre, Tilbake, velg Thief og gå Tilbake igjen. Det markerte svaret og Neste skal vises sammen. Lukk hele veiviseren og gjenoppta utkastet. Gjenta med et allerede valgt utstyrssvar.
- **Tall og klassehandlinger:** Klassenivå og maks HP skal vises i en midtstilt pille med ledetekst inni, ramme og hjørnetrekant som Combat. Trykk også på ledeteksten. Prøv én og to klasser; + Klasse og Fjern klasse skal være kompakte også i installert PWA. Prøv kort skjerm og stor tekst, med intern rulling der det trengs.
- **Feltgrenser:** Notattittel er én linje / 100 tegn; notattekst tillater linjeskift / 10 000 tegn. Manuell angrepstekst for utstyr er én linje / 1 000 tegn. Prøv typing og lim inn, samt Avbryt/X. Grensene er feltinnstillinger; en avbrutt editor skal aldri endre feltet under.

## Etterkontroll: full notattekst

1. Opprett eller åpne et notat med flere linjer, blanklinjer og et langt avsnitt. Bekreft teksteditoren med OK. Hele teksten skal kunne leses ved å rulle innholdet i Nytt/Rediger notat; overskrift/X og Lagre skal stå fast. Prøv også liten skjerm og stor tekst, og åpne notatet igjen etter lagring.
2. Åpne Tekst igjen. Nederst skal det være én strek over Avbryt/OK. Prøv med tastaturet åpent og lukket i installert My D&D Test; X/Avbryt/OK skal være tilgjengelige og virke på første trykk. Avbryt skal bevare den opprinnelige teksten.
3. Den samme fulltekstvisningen gjelder flerlinjefelt i andre dialoger/veivisere, også etter Tilbake og gjenopptatt utkast. Kontroller gjerne en lang utstyrsmerknad eller beskrivelse.
4. Rull ned til notatpillene før åpning. Popupen skal fylle skjermen med en gang. Sveip på overskriften, nederste knappelinje og gjennom hele teksten: siden bak skal stå fast. Åpne/lukk teksteditoren og avbryt en slettingsbekreftelse. Lukk eller lagre notatet; du skal komme tilbake til samme sted på siden. Prøv også etter at PWA-en har vært i bakgrunnen og tas frem igjen.
