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
