# Prosjektminne og arbeidsflyt

- Les `docs/CODEX_HANDOFF.md`, `REQUIREMENTS.md`, `DATA_MODEL.md`, `DESIGN.md`, `DECISIONS.md` og aktuell kravmatrise `CHARACTER_WORKSPACE.md` før funksjonsendringer. Filene under `docs/` er varig prosjektminne, også etter samtalekomprimering.
- Hold REQUIREMENTS og DECISIONS oppdatert med brukerens vedtatte avklaringer. Skill vedtatte krav, uavklarte forslag og faktisk implementasjonsstatus. Uimplementerte krav skal ikke fjernes eller erklæres løst uten fungerende flyt og verifikasjon.
- Nyeste eksplisitte brukeravklaring går foran eldre prototypeutforming. Bruk den faktiske `prototypes/dnd-character-companion-v0.11.html` som funksjonell referanse sammen med spesifikasjonen; kopier ikke kjente regresjoner eller prototypekode ukritisk.
- Løpende kommentarer er ikke en ny kodebestilling: brukeren skal få fullføre tankeprosessen. Når koding er uttrykkelig bestilt, fullfør de avtalte endringene og nødvendige kontroller.
- Arbeid på egen branch og lever PR mot master. Brukeren har delegert kodegjennomgang og merge av testede endringer; ikke push direkte til master.
- Kjør relevante tester og produksjonsbygg. Full kontroll: `CI=1 CHROMIUM_PATH=/usr/bin/chromium npm run check` når system-Chromium brukes. Kontroller reelle mobilflyter og plassbruk, ikke bare at knapper og datafelt finnes.
- Ingen full regelmotor, automatisk karakterbygger, digitale terninger, turstyring eller AC-treffkontroll. Fysiske kast og DM avgjør spillet.
