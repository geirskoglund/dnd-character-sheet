# Overlevering til Codex

## Varig prosjektminne og aktuell status

Les også [CHARACTER_WORKSPACE.md](CHARACTER_WORKSPACE.md) før videre funksjonsarbeid. Brukeren har uttrykkelig bedt om at REQUIREMENTS og DECISIONS holdes oppdatert, slik at avklaringer ikke forsvinner når samtalen komprimeres. Før nye vedtatte avklaringer i begge dokumenter og faktisk leveransestatus i matrisen. Ikke gjeninnfør forkastede mønstre eller anta at hele SRD/Combat er ferdig bare fordi Character-flytene er utvidet. Brukeren må få fullføre løpende tilbakemeldinger før ny koding bestilles.

Gjeldende grensesnitt er [Eventyrjournal](EVENTYRJOURNAL.md), implementert etter godkjente design-/ikon-/header-/slideravklaringer 2026-10-20. Historiske plansjer er ikke lenger hele implementasjonsstatusen. Kategoriikoner med reserve dekker også egne poster, uten regel-/tilgangsfiltrering. Kjente funksjonskrav utenfor denne leveransen er fortsatt synlige i matrisen.

Etter brukerens faktiske mobilreview er vi i en konseptuell gjennomgang, én arbeidsflyt om gangen. [Veiviser ved flerverdiregistrering](REQUIREMENTS.md#overordnet-prinsipp-veiviser-ved-flerverdiregistrering) er nå et overordnet krav. [Krav §13](REQUIREMENTS.md#13-konseptuell-opprydding-og-arbeidsflyter-2026-10-20) bevarer rapporterte feil, avklarte våpen-/featflyter og temaer som fortsatt må diskuteres. Betingelser knyttes til hver ekstraskade og vises på våpenkortet. Ingen av disse nye endringene er implementert eller bestilt kodet ennå; avtalte flyter og åpne forslag må holdes adskilt.

## Før du endrer appen
1. Les [REQUIREMENTS.md](REQUIREMENTS.md), [DATA_MODEL.md](DATA_MODEL.md), [DESIGN.md](DESIGN.md), [DECISIONS.md](DECISIONS.md).
2. Bruk [v0.11-prototypen](../prototypes/dnd-character-companion-v0.11.html) **kun som UX-referanse**. Den har kjente regresjoner og er ikke autoritativ kilde.
3. Inspiser eksisterende repo og identifiser allerede implementerte deler. **Ikke anta at gammel GitHub Pages-side eller prototype v0.11 tilfredsstiller kravene.**
4. Lag en kort gjennomføringsplan med små, etterprøvbare etapper og tydelig teststrategi. Du står fritt til å velge rammeverk og arkitektur som egner seg for GitHub Pages + IndexedDB + offline-first PWA.
5. Oppretthold tydelig skille mellom SRD 5.1-data, custom innhold og konkrete karakterinstanser. Sjekk lisens/attribusjon og kilde før import av regeldata.

## Foreslått implementasjonsrekkefølge
- **Grunnlag:** modulær arkitektur, IndexedDB med migrering, stabil karaktermodell, dataimport/-eksport, enkel navigasjon, tester.
- **Karakterark:** redigerbare verdier, modifierfavoritter, egne features/feats, utstyr, spells, strukturerte proficiencies/damage defenses, notater og portrett.
- **Combat:** genererte handlingsoppslag, tre faner, separate features, begrensede ressurser, short/long rest, manuelle overstyringer.
- **«Ta skade»:** avgrenset beregningsmotor, flere damage types, hver betinget modifier, temp HP, forklarbar breakdown, atomisk commit + undo.
- **Design:** 2–3 visuelle retninger for godkjenning, deretter konsistent implementasjon.
- **Kvalitet:** automatiserte enhets-/integrasjons-/UI-tester, offline- og backup-test, tilgjengelighet og mobilregresjon.

## Viktigste kjente feil fra prototypeprosessen
- + rendret som sirkel og tvunget til egen rad, tross krav om inline pille.
- Feat kan ikke legges til pålitelig via UI.
- Fungerende resistance-/vulnerability-UI forsvant fra «Ta skade».
- Beregningsresultat var for ugjennomsiktig («Etter modifikatorer»).
- «Rediger øvrige felt»-popup dupliserte notat/bakgrunn og erstattet ikke strukturerte data.
- Cantrips falt bort fra Combat i en tidligere versjon.
- Generelle tomme knapper og layout-regresjoner ble gjentatt.
Bygg regresjonstester som forhindrer disse feilene.

## Akseptansekriterium for PR-er
- Inkluder hva som faktisk er implementert og vist på mobil, hvilke automatiske tester som er kjørt, og eventuelle uavklarte valg.
- Ikke presenter statiske demo-knapper som ferdig funksjonalitet.
- Ikke implementer funksjoner fra forkastede retninger (turstyrer, AC hit check, auto level-up).
- **Be om eksplisitt produktavklaring** hvis krav kolliderer; ikke la prototypekode overstyre dokumentene.

## Retningslinje for samarbeid
Codex **eier testopplegg og kode**. Brukeren **eier funksjonelle beslutninger og designgodkjenning**. Praktiske forslag og opprydding er velkomne, men skal ikke stille om produktets mål.

## Kvalitetskontroll av brukerflyt før levering

Gå gjennom hver implementert flyt fra brukerens utgangspunkt på mobil. Oppslag har én Lukk-knapp; redigering har ulike lagre-/avbryt-handlinger. + skal starte valg/opprettelse direkte, og en lagret pille skal åpne sin egen post. Bevar utkast ved avbrutt sletting, fokus/scroll ved retur og felt/søk ved lagringsfeil. Uendrede lagringer skal ikke fylle historikk eller forstyrre Angre. Test antall steg og knappenes formål i tillegg til at data blir lagret. Se [gjennomgangen og regresjonene](UX_REVIEW.md).
