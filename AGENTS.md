# Prosjektminne og arbeidsflyt

- Les `docs/CODEX_HANDOFF.md`, `REQUIREMENTS.md`, `DATA_MODEL.md`, `DESIGN.md`, `DECISIONS.md` og aktuell kravmatrise `CHARACTER_WORKSPACE.md` før funksjonsendringer. Filene under `docs/` er varig prosjektminne, også etter samtalekomprimering.
- Hold REQUIREMENTS og DECISIONS oppdatert med brukerens vedtatte avklaringer. Skill vedtatte krav, uavklarte forslag og faktisk implementasjonsstatus. Uimplementerte krav skal ikke fjernes eller erklæres løst uten fungerende flyt og verifikasjon.
- Nyeste eksplisitte brukeravklaring går foran eldre prototypeutforming. Bruk den faktiske `prototypes/dnd-character-companion-v0.11.html` som funksjonell referanse sammen med spesifikasjonen; kopier ikke kjente regresjoner eller prototypekode ukritisk.
- Løpende kommentarer er ikke en ny kodebestilling: brukeren skal få fullføre tankeprosessen. Når koding er uttrykkelig bestilt, fullfør de avtalte endringene og nødvendige kontroller.
- Brukeren har bestilt implementasjon av avklarte flyter; samle endringer på én arbeidsbranch; se [arbeidsnotatet](docs/WORKFLOW_REVIEW.md). Ikke opprett eller merge PR per kommentar. Én samlet testet leveranse og PR/merge til slutt. Nyere status står i GUIDED_WORKFLOWS og kravmatrisen.
- Arbeid på egen branch og lever PR mot master. Brukeren har delegert kodegjennomgang og merge av testede endringer; ikke push direkte til master.
- Kjør relevante tester og produksjonsbygg. Full kontroll: `CI=1 CHROMIUM_PATH=/usr/bin/chromium npm run check` når system-Chromium brukes. Kontroller reelle mobilflyter og plassbruk, ikke bare at knapper og datafelt finnes.
- Ingen full regelmotor, automatisk karakterbygger, digitale terninger, turstyring eller AC-treffkontroll. Fysiske kast og DM avgjør spillet.

## Gjennomgående produktprinsipp

Bruk [veiviserprinsippet](docs/REQUIREMENTS.md#overordnet-prinsipp-veiviser-ved-flerverdiregistrering) ved registrering av flere verdier i hele appen: korte, forgrenede spørsmål, beslektede felt samlet og sikre grunnverdier automatisk. Rene listevalg registreres direkte. Konkrete arbeidsflyter avklares én om gangen; vedtatt prinsipp er ikke i seg selv en bestilling på appkode.

Øverste føring er å [erstatte papirkarakterarket](docs/REQUIREMENTS.md#1-produkt-og-akseptansekriterier) ved det fysiske spillebordet. Vurder forslag og user stories etter hvordan de gjør oversikt, oppslag, notater og manuell føring enklere under spill. Bevar spillerens frihet til å registrere og overstyre etter avtale med DM. Konteksttilpasningen nedenfor skal støtte dette målet.

Bruk det overordnede prinsippet [karakterens kontekst](docs/REQUIREMENTS.md#overordnet-prinsipp-karakterens-kontekst) i alle funksjonsområder og user stories. Vurder forventede valg, verdier og oppslag ut fra karakterens relevante tilstand og formålet med flyten. Feats, cantrips og spells er eksempler; den samme kontrollen gjelder blant annet utstyr, proficiencies, ressurser og Combat-oppslag. Ta med gyldige generelle valg, alternative kilder til tilgang, uavklarte forutsetninger og DM-unntak i relevante scenarioer. Skill mellom eierskap/registrering, valg/læring og bruk. Bruk områdets faktiske regler; kontekstfiltrering skal bevare registrerte data.

## Obligatorisk produktkontroll før levering og merge

For hver funksjons- eller UX-endring skal disse fire kravene oppfylles og dokumenteres i `docs/CHARACTER_WORKSPACE.md`:

1. **Forventet spilleropplevelse før koding.** Beskriv hver berørt flyt med konkret karakter, relevant tilstand, spillerens mål og forventet resultat. Spor forventningen til krav, gjeldende avklaringer og relevante D&D 5e 2014-regler; bruk prototypen som funksjonell referanse. Ta med hvilken betydning klasse, subclass, klassenivå, art, proficiencies og øvrige forutsetninger har der de er relevante. Faktiske motstridende produktkrav avklares med brukeren; vanlige konsekvenser av vedtatte krav skal vurderes av Codex.
2. **Testscenarier fra forventningene.** Definer akseptansescenariene før implementasjonen ut fra spilleropplevelsen i punkt 1. Kontroller relevante og irrelevante valg, nivågrenser, multiclass og manuelle DM-unntak der det er aktuelt. CRUD-, katalogantalls- og lagringstester dekker bare sine respektive områder; funksjonens relevans og spillmessige korrekthet trenger egne forventninger. Registrer manglende tester som manglende dekning.
3. **Egen produktgjennomgang før levering.** Gå gjennom berørte flyter i appen på mobil med konkrete karakterer. Vurder hvilke valg spilleren møter, relevans, plassbruk, mellomtrykk, antall synlige felt og faktisk utfyllingsbehov, knappenes formål og sammenheng med prototype og spesifikasjon. Dokumenter observerte resultater, avvik og begrunnelsen for forskjeller fra referansen. Codex utfører denne kontrollen selv; brukerens UX-vurdering kommer i tillegg.
4. **Betingelse for merge.** PR og kravmatrise skal vise hvilke spillsituasjoner og tester som er kjørt, resultatene, produktgjennomgangen og gjenværende krav. Grønne tekniske tester alene oppfyller ikke denne betingelsen. Uløste avvik i en berørt flyt må rettes eller ha en uttrykkelig avgrensning godkjent av brukeren før flyten erklæres ferdig og endringen merges. Allerede avklarte leveransegrenser gjelder fortsatt; gjenstående krav utenfor endringens omfang beholdes synlig i matrisen.

Bruk matriseformatet under «Produktkontroll før levering og merge». Tidligere grønne tester eller skjermbilder må ikke omtales som bevis for situasjoner de ikke undersøkte. Rene dokumentasjonsendringer kontrolleres med tekst-, konsistens- og lenkekontroll; dokumenter at ingen brukerflyt endres. De trenger ingen ny D&D-spilltest. Nye funksjoner kodes først etter brukerens bestilling.
