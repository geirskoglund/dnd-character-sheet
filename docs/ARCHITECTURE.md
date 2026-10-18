> Oppdatert karaktergrunnlag: [CHARACTER_FOUNDATIONS.md](CHARACTER_FOUNDATIONS.md) beskriver den nåværende opprettelsesflyten, AC/speed, spilltilstand og migrering til Character/backup v2 og IndexedDB v3. Avsnittene nedenfor dokumenterer den opprinnelige fase 1-leveransen og må leses med denne oppdateringen.

# Fase 1 – arkitektur og gjennomføring

## Valg

TypeScript + Vite og små DOM-baserte views uten UI-rammeverk. Grunnflaten er liten; eksplisitte modulgrenser er viktigere enn en stor avhengighet til komponent-/state-rammeverk. Zod gir samme runtime-validering ved lagring og import som TypeScript-typene bygger på. Vitest + fake-indexeddb tester lagringstransaksjoner; Playwright tester faktisk nettleser, IndexedDB og service worker.

- `src/domain/model.ts`: versjonert Character-aggregat, typer, validering, factory og kopiering.
- `src/storage/database.ts`: IndexedDB, skjemaoppgradering, repository, optimistisk revisjonskontroll og atomiske endringshendelser.
- `src/storage/backup.ts`: komplett karakterpayload og refererte portrettdata, størrelsesgrenser og transaksjonell import.
- `src/ui/`: presentasjon og HTML-escaping. `src/main.ts` binder UI, navigasjon, dialogs og applikasjonsoperasjoner sammen.
- `public/`: manifest og ikon. Vite PWA/Workbox genererer `sw.js` med hashet precache ved bygg. Ingen CDN, eksterne fonter eller runtime API-kall.

Implementasjonsrekkefølgen er modell → lagring/backup → UI → produksjons-PWA og Pages. Teststrategien dekker isolasjon, datatap, versjoner og brukerflyt før publisering.

## Data og utvidbarhet

Databaseversjon 1 etablerer `characters`, `catalog`, `assets`, `events`, `settings`. Versjon 2 legger til hendelsesindeksen `characterId` uten å skrive om karakterdata. Neste versjon må ha en eksplisitt migrering og bevaringstest. Character- og backup-formatet har egen `schemaVersion: 1`, uavhengig av databaseversjonen. Ukjente backupversjoner avvises med feilmelding fremfor risikabel gjetting. Prototype-localStorage er ikke en tidligere versjon av denne databasen; verdiene bevares urørt.

Hver karakter er et aggregat med strukturerte samlinger for klasser, språk, proficiencies, defenses, conditions, features, spells, items, actions, effects, resources og notater. Disse er utvidelsespunkter, **ikke ferdige funksjoner eller redigeringsflater**. Eide og equipped items er separate tilstander. Ressurser kan skille vanlige spell slots, Pact Magic og klassebaserte hit dice. Effects kan uttrykke vilkår med true/false/unknown og component/event-scope uten at noen regelmotor er implementert. Katalogreferanser holdes separate fra instans-UUID-er. Det distribueres ingen SRD- eller proprietær regeltekst i fase 1; senere katalogimport krever lisens og kildeattribusjon.

Klasser kan registreres manuelt med navn, subclass og level, uten katalog eller level-bygging. Sum klassenivå kontrolleres i skjemaet før lagring. Karakter uten registrert klasse tillates ved første registrering. HP over maks er tillatt som manuell overstyring; ingen healing-/skadeberegning brukes i redigeringsskjemaet. GP lagres som heltall CP. Background er et navngitt notat, ikke et duplisert felt.

Karakter og audit-event skrives i samme transaksjon. Hver bekreftet operasjon er én hendelse med before/after av hele aggregatet på path `/`. Det gir tydelig atomisk undo nå; feltvise patches kan komme senere. Navigasjon og andre midlertidige valg logges ikke. Revisjonstall hindrer at en gammel fane overskriver nye karakterverdier. Angre krever samsvar med siste lagrede after-tilstand og støtter én redigering om gangen. Opprettelse/sletting kan inspiseres i databasen, men slettet karakter kan ikke gjenopprettes via UI; bruk backup. Historikkeksport og flerstegs undo er utsatt.

Kopiering remapper karakterens og alle underentiteters UUID-er, inklusive interne referanser, men beholder katalogreferanser. Portretter behandles som immutable assets og kan deles av kopier inntil portrettbytte oppretter ny asset. Det finnes ingen portrettredigeringsflate ennå.

Import validerer hele payloaden før transaksjonen og avviser alle karakter-ID-kollisjoner uten å skrive noe. Ingen stille overskriving eller automatisk remapping ved restore. Bruk eksplisitt Kopier karakter for en uavhengig kopi. Backup omfatter karakterdata og portrettdata, ikke tidligere audit-logg, katalog eller UI-settings. Import lager en ny audit-hendelse. Valideringen setter grenser på filstørrelse, antall karakterer, tekst og portrettformat; den er ikke en SRD-regelvalidator.

## UI og designstatus

Character og Combat har egne scrollposisjoner i sesjonen. Navigasjonen bruker buttons med aria-current. Combat-kategorier er ordinære buttons med aria-pressed (ingen ufullstendig ARIA-tab-widget). Dialoger bruker native dialog, labels, fokusstyring og tastatur. Brukerinnhold escapes før HTML-rendering. Feil i lagring gir synlig melding og dialogen beholdes ved mislykket bekreftelse. Ingen tomme handlinger for skade, hvile eller utstyr vises som om de virker.

Utformingen er et foreløpig teknisk grunnlag med høy kontrast og 44 px trykkflater. Endelig visuelt design er ikke vedtatt. Designbriefens 2–3 retninger med samme eksempelkarakter og funksjonalitet for begge hovedfaner gjenstår før endelig designgodkjenning. Det er ingen blokkerende produktmotstrid for fase 1; valg av visuell retning skal gjøres av brukeren senere.

## Videre faser

1. Redigeringsflater for alle strukturerte samlinger og fire konfigurerbare modifierkort.
2. Portrettopplasting med filvalidering, enklere backupmigrering fra prototype og forbedret backup-påminnelse basert på faktiske endringer.
3. Lisensiert lokalt SRD 5.1-bibliotek; søkbare velgere og manuelle egendefinerte oppføringer.
4. Karaktergenererte Combat-oppslag, swipe, ressurser, spells/Pact Magic og hvile.
5. Avgrenset skadekalkulator med individuelle vilkår og eksplisitt bekreftelse/undo.
6. Designalternativer og godkjenning, mer omfattende tilgjengelighets- og mobilregresjon.

Fase 1 krever ikke produktavklaring for å fungere. Framtidige motstridende regler eller endret omfang skal avklares fremfor å arve prototypens antakelser.

## Verifisert fase 1

12 automatiserte domenemodell-/lagringstester og 5 nettlesertester dekker opprettelse, redigering, avbryt, bytte/reload, uavhengig kopi, sletting med bekreftelse, notater, undo, JSON round-trip og feil, databasemigrering, samtidighetskonflikter, multiklassevalidering, scrollposisjoner og simulert full lagring. Offline-testen kjører mot produksjonsbygget under `/dnd-character-sheet/`, slår av nettverket og bekrefter både reload og lagret redigering. Layout er kontrollert ved 320, 360, 390 og 768 CSS px. Dette er ingen full WCAG-revisjon eller validering av ennå uimplementerte D&D-krav.

Mobilbilder av samme eksempelkarakter, med foreløpig teknisk utforming:

- [Character](images/phase-1-character.png)
- [Combat](images/phase-1-combat.png)
