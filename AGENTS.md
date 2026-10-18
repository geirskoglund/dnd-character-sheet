# Prosjektminne og arbeidsflyt

- Les `docs/CODEX_HANDOFF.md`, `REQUIREMENTS.md`, `DATA_MODEL.md`, `DESIGN.md`, `DECISIONS.md` og aktuell kravmatrise `CHARACTER_WORKSPACE.md` før funksjonsendringer. Filene under `docs/` er varig prosjektminne, også etter samtalekomprimering.
- Hold REQUIREMENTS og DECISIONS oppdatert med brukerens vedtatte avklaringer. Skill vedtatte krav, uavklarte forslag og faktisk implementasjonsstatus. Uimplementerte krav skal ikke fjernes eller erklæres løst uten fungerende flyt og verifikasjon.
- Nyeste eksplisitte brukeravklaring går foran eldre prototypeutforming. Bruk den faktiske `prototypes/dnd-character-companion-v0.11.html` som funksjonell referanse sammen med spesifikasjonen; kopier ikke kjente regresjoner eller prototypekode ukritisk.
- Løpende kommentarer er ikke en ny kodebestilling: brukeren skal få fullføre tankeprosessen. Når koding er uttrykkelig bestilt, fullfør de avtalte endringene og nødvendige kontroller.
- Arbeid på egen branch og lever PR mot master. Brukeren har delegert kodegjennomgang og merge av testede endringer; ikke push direkte til master.
- Kjør relevante tester og produksjonsbygg. Full kontroll: `CI=1 CHROMIUM_PATH=/usr/bin/chromium npm run check` når system-Chromium brukes. Kontroller reelle mobilflyter og plassbruk, ikke bare at knapper og datafelt finnes.
- Ingen full regelmotor, automatisk karakterbygger, digitale terninger, turstyring eller AC-treffkontroll. Fysiske kast og DM avgjør spillet.

## Obligatorisk produktkontroll før levering og merge

For hver funksjons- eller UX-endring skal disse fire kravene oppfylles og dokumenteres i `docs/CHARACTER_WORKSPACE.md`:

1. **Forventet spilleropplevelse før koding.** Beskriv hver berørt flyt med konkret karakter, relevant tilstand, spillerens mål og forventet resultat. Spor forventningen til krav, gjeldende avklaringer og relevante D&D 5e 2014-regler; bruk prototypen som funksjonell referanse. Ta med hvilken betydning klasse, subclass, klassenivå, art, proficiencies og øvrige forutsetninger har der de er relevante. Faktiske motstridende produktkrav avklares med brukeren; vanlige konsekvenser av vedtatte krav skal vurderes av Codex.
2. **Testscenarier fra forventningene.** Definer akseptansescenariene før implementasjonen ut fra spilleropplevelsen i punkt 1. Kontroller relevante og irrelevante valg, nivågrenser, multiclass og manuelle DM-unntak der det er aktuelt. CRUD-, katalogantalls- og lagringstester dekker bare sine respektive områder; funksjonens relevans og spillmessige korrekthet trenger egne forventninger. Registrer manglende tester som manglende dekning.
3. **Egen produktgjennomgang før levering.** Gå gjennom berørte flyter i appen på mobil med konkrete karakterer. Vurder hvilke valg spilleren møter, relevans, plassbruk, mellomtrykk, knappenes formål og sammenheng med prototype og spesifikasjon. Dokumenter observerte resultater, avvik og begrunnelsen for forskjeller fra referansen. Codex utfører denne kontrollen selv; brukerens UX-vurdering kommer i tillegg.
4. **Betingelse for merge.** PR og kravmatrise skal vise hvilke spillsituasjoner og tester som er kjørt, resultatene, produktgjennomgangen og gjenværende krav. Grønne tekniske tester alene oppfyller ikke denne betingelsen. Uløste avvik i en berørt flyt må rettes eller ha en uttrykkelig avgrensning godkjent av brukeren før flyten erklæres ferdig og endringen merges. Allerede avklarte leveransegrenser gjelder fortsatt; gjenstående krav utenfor endringens omfang beholdes synlig i matrisen.

Ved relevansfiltrering skal generelle feats uten klassekrav beholdes uansett valgt klasse. Bare faktiske klasse-, subclass-, arts-, nivå- eller øvrige forutsetninger kan begrunne en begrensning; en feat uten klassekrav er ikke irrelevant fordi karakterens klasse ikke er nevnt. Eventuelle andre reelle krav vurderes fortsatt. Uavklarte forutsetninger merkes og valget beholdes tilgjengelig. Ta med både generelle og begrensede feats i kontrollscenarioene.

Bruk matriseformatet under «Produktkontroll før levering og merge». Tidligere grønne tester eller skjermbilder må ikke omtales som bevis for situasjoner de ikke undersøkte. Rene dokumentasjonsendringer kontrolleres med tekst-, konsistens- og lenkekontroll; dokumenter at ingen brukerflyt endres. De trenger ingen ny D&D-spilltest. Nye funksjoner kodes først etter brukerens bestilling.
