# Faste app- og testadresser på GitHub Pages

- **My D&D:** https://geirskoglund.github.io/dnd-character-sheet/my-dnd/app/
- **My D&D Test:** https://geirskoglund.github.io/dnd-character-sheet/my-dnd/test-app/

Dette er repoets publiseringsmål. Det er ett Pages-nettsted med to søskenstier. Ikke opprett en testbranch, nye miljøstier eller et ekstra repository. Produksjonsappen bygges alltid fra master. Én valgt PR/commit er tilgjengelig i test om gangen. Testappen viser «Testversjon», PR-nummer og kort commit-ID; master som testgrunnlag viser master. Testdata beholdes på tvers av PR-er.

## Første overgang fra gamle telefoninstallasjoner

1. Ved behov kan JSON-backup tas fra den gamle installasjonen og lagres utenfor appen før den fjernes. Brukeren har uttrykkelig valgt overgang uten backup for sine to eksisterende telefoninstallasjoner; backup er ingen sperre for denne publiseringen.
2. Åpne den gamle adressen mens du er på nett: `/dnd-character-sheet/` for appen, `/dnd-character-sheet/test/` for test. De viser nå overgangssider til riktig ny adresse. En gammel cachet app kan vises først; la den hente retirement-workeren, lukk gamle appvinduer og åpne adressen igjen. Ikke slett nettleserdata.
3. Følg lenken til den nye adressen og installer appen derfra. Kontroller navn og ikon, og at test viser **Testversjon**. Hvis første åpning fortsatt viser en gammel cachet utgave, lukk vinduet og åpne igjen mens du er på nett. De nye scopes får egne workers.
4. Åpne den nye **installerte** appen og kontroller karakterene. Databasenavnene er bevart, men iOS kan gi en ny hjemskjerminstallasjon separat lagring. Importer backup bare hvis karakterene mangler; import legger til og er ikke en synkronisering.
5. Når data og den nye installasjonen er kontrollert, fjern de gamle hjemskjermappene manuelt. Kontroller også at den nye appen åpner uten nett.

Overgangssidene er ingen appbygg og har ikke installasjonsmanifest. Gamle `sw.js`-adresser leverer små retirement-workere: de aktiveres, fjerner bare egen gammel precache og avregistrerer seg. En ny app eller overgangsside rydder også eksakte gamle root-/test-registreringer. Åpne redigeringsvinduer navigeres ikke automatisk; lokale karakterdata slettes aldri. En helt frakoblet gammel installasjon kan ikke avvikles før den kommer på nett. Oppsettet garanterer ikke at OS-et fjerner gamle installasjoner eller oppdaterer gamle installasjonsnavn/ikoner.

## Velge PR til test – for agenten

1. Start fra oppdatert master. Opprett samlet PR mot master og vent på grønn **Validate** på gjeldende PR-hode. PR-en må inneholde den nye PWA-/publiseringsstøtten fra master. Merge/rebase master om nødvendig.
2. Kjør den betrodde master-workflowen:

   ```sh
   gh workflow run pages.yml --repo geirskoglund/dnd-character-sheet --ref master -f preview=PR_NUMMER
   ```

   Bruk tallet uten `#`. Alternativt: Actions → Deploy GitHub Pages → Run workflow → master → Preview.
3. Vent på vellykket deploy **og** HTTPS-kontroll. Kontroller `deployment.json` på repoets Pages-root: `production.sha`, `preview.sha` og `preview.pr` skal stemme. De nye appenes `environment-layout.json` viser kanal og eksakt bygg-commit. Gi brukeren PR-lenke, **den faste testlenken over** og konkrete testinstruksjoner.
4. Nye commits i den valgte PR-en publiseres automatisk etter vellykket Validate. Urelaterte PR-er tar ikke over adressen. Utdaterte valideringskjøringer og feilende bygg publiseres ikke. Velg samme PR-nummer igjen ved behov for eksplisitt gjenpublisering.
5. Behold funksjons-/UI-PR åpen til brukeren har testet og uttrykkelig godkjent merge, med mindre brukeren uttrykkelig har delegert egen merge for den aktuelle oppgaven. Testpublisering er ikke produksjonsmerge.
6. Etter godkjent merge publiserer et push til `master` appen automatisk og **bevarer testutgaven**. Vent på Pages/HTTPS-kontroll før du melder produksjon ferdig. Gi appadressen over. Testdata flyttes ikke til produksjon.

`preview=keep` bygger master og beholder sist publiserte eksakte test-commit, også når PR-branchen er slettet. `preview=master` velger siste master som testgrunnlag. Ingen av valgene nullstiller testdata. Ved første flytting må valgt test-commit ha de nye miljøfilene; velg en validert oppdatert PR før merge, eller bruk `preview=master` hvis en eldre valgt commit hindrer bygg. Ikke gjett nye adresser for å omgå en slik feil.

## Teknisk kontrakt og feilhåndtering

- `pages.yml` bygger master og valgt test-commit i separate jobber og lager begge service workere før sammensetning. Byggene legges i `my-dnd/app/` og `my-dnd/test-app/`. `scripts/assemble-pages.mjs` fra betrodd master kontrollerer kanal, commit, manifest og PNG-filer og skriver overgangssidene. Ingen PR-kode kjøres i deploy-jobben.
- `deployment.json` ligger fortsatt på `/dnd-character-sheet/deployment.json`. Metadata-versjon 1 bevares for valg av test-commit; `layout:2` og `paths` beskriver nye adresser. Metadata-/nettverksfeil stopper publisering; HTTP 404 ved første oppsett gir master som startutgave. Eksplisitt PR/master-valg kan gjenopprette ugyldige metadata. Branch-/PR-strenger kjøres aldri som shell-kode.
- Manifestene bruker relative `id`, `start_url` og `scope` (`./`) som løses til hver sin faste adresse. Appnavn og short_name er My D&D / My D&D Test. Separate PNG-er gir journallogoen på iPhone (`apple-touch-icon`) og et sirkelmotiv med `purpose:maskable` på Android. Android-launcheren velger ytterformen; det finnes ikke et PWA-valg «bare ved rund maske». TEST-merket inngår i testikonets bildefil.
- IndexedDB heter fortsatt `dnd-character-companion` og `dnd-character-companion-test`. Karakterer, assets, historikk, settings og veiviserutkast følger hver sin database. Ingen DB-versjons-/backupformatendring, automatisk kopiering eller sletting. Test leser ikke gammel prototype-localStorage.
- Begge workere er begrenset til sin egen søskensti. Cacheprefikser og scopes er forskjellige; bred `cleanupOutdatedCaches` er av. Workbox rydder sin egen precache. Oppdateringskontrollen teller bare egne vinduer. Root-/test-opprydding matcher eksakte gamle scopes og egne precache-navn, aldri nye appregistreringer/caches.
- Appene deler origin; navne-/scope-skillet beskytter mot utilsiktet sammenblanding og installasjonsforveksling, ikke ondsinnet JavaScript. Det er ingen synkronisering mellom enheter eller miljøer. Ny nettleser/privatmodus/installasjon kan ha et annet lagringsområde.
- PR-bygg har bare lesetilgang, uten lagrede Git-credentials. Valg av samme-repo-PR og deploy kjøres fra betrodd master-workflow med separate rettigheter. Fork-PR-er velges ikke.
- Mislykket plan/bygg/sammensetning hindrer deploy. Feil i HTTPS-kontroll etter deploy rapporteres, men ruller ikke automatisk nettstedet tilbake. Gjenpubliser et kjent kompatibelt test-commit eller velg `preview=master`; ikke slett brukerdata. Ikke rerun en fullført deploy-jobb med duplikate Pages-artifacts; start en ny workflow-kjøring.
- Eldre testkode kan ikke forventes å lese et nyere databaseskjema. Slike feil skal aldri møtes med automatisk databasesletting.

## Verifikasjon

`tests/pages-plan.test.ts` kontrollerer testvalg, bevart commit, relevante/stale Validate-kjøringer og avvisning av ugyldige valg/forker. `tests/pages-layout.test.ts` prøver sammensetning og avviser feil kanal/commit/navn/scope eller manglende ikoner før publisering.

`tests/e2e/preview.spec.ts` bygger to reelle testutgaver på samme origin som appen. Den prøver separate karakterer, portrett, historikk, utkast, backup/import, begge scopes' oppdatering mens den andre er åpen, beholdte databaser og offline. Den kontrollerer manifestidentitet og ikonstørrelser. `pwa-migration.spec.ts` bruker ekte genererte Workbox-workere med de tidligere scope-/fallback-reglene og prøver avvikling, åpen redigering, overgangssider, bevart lagring og nye offline-apper. `updates.spec.ts` prøver eksplisitt oppdatering og flere redigeringsvinduer på den nye appstien.

HTTPS-kontrollen verifiserer begge appadresser, navn/scope, ikoner, eksakte bygg-commits og gamle overgangssider/workere. Fysisk installasjon på iPhone/Android er ikke dekket av Chromium og skal rapporteres separat. Godkjente ikondesign er ikke bevis på at en bestemt launcher er prøvd.

## Test av tallendringsdialogen #25

Prøv den valgte funksjons-PR-en på testadressen over. Kontroller «Testversjon» og PR/commit i appen før test. Bruk «Se etter oppdatering» / «Oppdater appen» ved en eldre utgave; bevar testkarakterene og ta gjerne backup først.

1. **Vanlige tall og nestet redigering:** Meny → Rediger karakter → trykk klassenivå eller maks HP. Dialogen heter «Endre …», viser Før/Etter og starter alltid med 0. Positive tall står over, negative under. Rull, bekreft med OK, og kontroller at bare dette feltet i skjemaet endres. Avbryt/X/Escape skal bevare skjemaet uten tallendringen. Karakteren endres først når du fullfører skjemaet.
2. **Direkte innskriving:** Trykk midttallet: hjulene erstattes av et eget tallpanel med en visuell 0 når innskrivingen er tom, uten markering/håndtak. Null-plassholderen skal forsvinne når du skriver og komme tilbake når du sletter alt; den skal ikke påvirke valgt endringsbeløp. Før/Etter beholder hjulvalget til du begynner å taste. Retur eller OK uten inntasting skal beholde valget; første siffer erstatter endringsbeløpet. Bruk talltastene, ± og slett; vanlig tastatur og lim inn støttes også. Pilen viser hjulene igjen, eller du kan trykke OK direkte. Verdien skal ikke skjules av systemtastaturet. Før/Etter og hovedknappene skal beholde plasseringen. Valget og Før/Etter skal stemme; desimalpunkt/komma i ett hjul skal gi forklaring. Klassenivå har minimum 1 og ingen spillregelbasert øvre grense (#61). Tall-elementer har ingen «Fjern verdi»-knapp (#58 WP04).
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
- **Tall og klassehandlinger:** Klassenivå og maks HP skal vises i en midtstilt pille med ledetekst inni, ramme og hjørnetrekant som Combat. Trykk også på ledeteksten. Prøv én, to og tre klasser med flervalg på klasseskjermen (#61). Prøv kort skjerm og stor tekst, med intern rulling der det trengs.
- **Feltgrenser:** Notattittel er én linje / 100 tegn; notattekst tillater linjeskift / 10 000 tegn. Manuell angrepstekst for utstyr er én linje / 1 000 tegn. Prøv typing og lim inn, samt Avbryt/X. Grensene er feltinnstillinger; en avbrutt editor skal aldri endre feltet under.

## Etterkontroll: full notattekst

1. Opprett eller åpne et notat med flere linjer, blanklinjer og et langt avsnitt. Bekreft teksteditoren med OK. Hele teksten skal kunne leses ved å rulle innholdet i Nytt/Rediger notat; overskrift/X og Lagre skal stå fast. Prøv også liten skjerm og stor tekst, og åpne notatet igjen etter lagring.
2. Åpne Tekst igjen. Nederst skal det være én strek over Avbryt/OK. Prøv med tastaturet åpent og lukket i installert My D&D Test; X/Avbryt/OK skal være tilgjengelige og virke på første trykk. Avbryt skal bevare den opprinnelige teksten.
3. Den samme fulltekstvisningen gjelder flerlinjefelt i andre dialoger/veivisere, også etter Tilbake og gjenopptatt utkast. Kontroller gjerne en lang utstyrsmerknad eller beskrivelse.
4. Rull ned til notatpillene før åpning. Popupen skal fylle skjermen med en gang. Sveip på overskriften, nederste knappelinje og gjennom hele teksten: siden bak skal stå fast. Åpne/lukk teksteditoren og avbryt en slettingsbekreftelse. Lukk eller lagre notatet; du skal komme tilbake til samme sted på siden. Prøv også etter at PWA-en har vært i bakgrunnen og tas frem igjen.

5. Eksisterende notater skal ha overskriften «Notat», nye «Nytt notat». Søppelbøtten skal stå som en liten ikonknapp til venstre for Lagre og beholde plasseringen når lang tekst rulles. Trykk søppelbøtten og avbryt bekreftelsen: tekst og rulleposisjon skal beholdes.

## Test av karakterveiviseren #61

Bruk **My D&D Test** på den faste adressen øverst. Kontroller valgt PR/commit og oppdater appen med de vanlige oppdateringsvalgene. Behold testdatabasen. Primær kontroll er installert app på fysisk iPhone; gjenta gjerne editorene i Safari.

1. **Standardregistrering:** Ny karakter → skriv Jones. Gå gjennom navn, art, klasser, subklasser, klassenivåer, abilities og maks HP. Velg Elf, Fighter og Ingen / ikke valgt. Kontroller navn i overskriftene, nivå1, seks abilities10 og HP2. Lagre og åpne igjen etter reload.
2. **Multiclass og Tilbake:** Velg Fighter, Rogue og Wizard. Slå alle av og kontroller at Neste deaktiveres. Velg dem igjen, før ulike subklasser og nivåene 11/3/10, STR17 og HP73. Gå tilbake og fjern Rogue. Fighter/Wizard og øvrige svar skal bestå; Rogue skal ikke lagres. To nivåpiller per rad ved tre klasser; abilities skal ligge 3×2.
3. **Redigering og editorer:** Rediger en karakter med andre verdier enn standardene. Prøv OK, Avbryt og X i tekst-/talleditoren. Bare OK overfører feltendringen. Hver ability åpner tallvelger med fullt engelsk navn. Fullfør uten øvrige endringer og kontroller at current/temp HP består.
4. **Utkast og høyt nivå:** Registrer Wizard21. Lukk med X før lagring, last på nytt og fortsett utkastet på samme skjerm. Endre navn via Tilbake; videre overskrifter skal oppdateres. Lagre, last på nytt og åpne Magi/Combat. Prøv backup/import i et annet testlagringsområde. Nivå21 skal bestå. Forkast utkast skal ha egen bekreftelse.
5. **Fysisk mobil:** Kontroller normal og stor tekst, lesbare valg/tall, intern rulling og tilgjengelig Neste/Tilbake/Lagre. Prøv editorenes første trykk og retur, også etter at appen har vært i bakgrunnen. Ved avvik: oppgi iOS-versjon, installert app/Safari, PR/commit og konkret forløp.

PR-en beholdes åpen til uttrykkelig godkjent merge. Automatiske Chromium-resultater er ikke fysisk iPhone-bevis.

## Test av Forbruksvarer #30/#31

1. Utstyr skal ikke vise AC/AC-grunnlag. Trykk seksjonsraden Forbruksvarer med flaskeikon og antall varer. Legg til Arrows18 og en Potion of Supreme Healing5. Ingen søk i biblioteket. Registrerte standardvarer skal ikke tilbys på nytt. OK lukker listen og bevarer beholdningen.
2. Prøv kort/langt −/+ og ny total, også0. Gå via Meny → Angre siste endring ved behov; listen har ingen Angre-knapp. Lag egne varianter med valgfritt terninguttrykk og beskrivelse; identiske nye varer skal avvises. Lukk/gjenoppta utkastet via Meny og prøv backup/import.
3. Fra Combat: ingen Legg til eller Fjern. Varer med0 skjules ved åpning; bruk av siste enhet skal beholde raden til neste åpning. Utstyr viser fortsatt tomme varer og kan fylle på. Antall kan justeres, og vareoppslag kan leses. Supreme Healing viser10d4+20 under navnet; egen vare viser registrert uttrykk. Ingen enhetstekst eller healing-sammenligningstabell. Ingen automatisk HP-/beholdningsendring ved lesing.
4. Fra Utstyr → vareoppslag: Fjern utstyr/OK står fast nederst. Fjern med beholdning5 skal vise varenavn og advare om5; avbryt bevarer oppslaget. Ved beholdning0 skal advarselen om gjenværende antall være borte. Bekreftet fjerning fjerner hele posten; Meny → Angre kan gjenopprette den.
5. Prøv320/390px, stor tekst, lang liste og sveip som starter på teller. I installert My D&D Test og vanlig Safari på fysisk iPhone: prøv første OK/Avbryt/X, nestet sletting og retur etter bakgrunn. Kontroller PR/commit etter oppdatering. Behold testdata; PR-en står åpen til uttrykkelig mergegodkjenning.
