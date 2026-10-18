# Gjennomgang av v0.11 mot den nye arbeidsflaten

Referansen er [den faktiske v0.11-filen](../prototypes/dnd-character-companion-v0.11.html), lagt inn av brukeren i `ef9fa3a`, med lenke fra overleveringen i `d5ba985`. Filen er lest og kjørt lokalt i Chromium ved 390 px. Character, Combat og menyen er visuelt gjennomgått. Demoen bruker Bryn/Fighter og localStorage; demoobjektene og prototypekoden er ikke flyttet inn som produksjonsdata.

| Mønster i referansen | Gjeldende implementasjon / beslutning |
| --- | --- |
| Kompakt identitet og innstillingsmeny | Kompakt navn, species/klasse/subclass/nivå og «Meny». Alle karakteroperasjoner og oppdateringskontroll ligger i menyen. |
| To hovedfaner, separat scroll | Beholdt; Character og Combat har uavhengig scrollposisjon. |
| Toppstatus med HP/temp/AC/Initiative/penger | Nyere avklaring overstyrer referansen: Character har HP, AC, Initiative, GP, Speed på én rad. HP er lesbar status. HP-endring og temp HP finnes bare i Combat. |
| Fire modifierfavoritter og kompakte abilities | Fire lagrede favoritter med alfabetisk velger, fullstendige navn, og modifiers fra karakterdata. Seks scores viser også modifier. |
| Tette seksjoner, blågrå kort og dempet gull | Samme kompakte rytme, fargetoner og rolige serifoverskrifter. Lange forklaringspaneler og teknisk fasetekst er fjernet fra arbeidsflaten. |
| Tre Combat-faner med aktiv understrek | Harmonisert uten gjentatt kategoritittel eller turstatus. |
| Utstyrspille åpner detaljer | Åpner én utstyrspost for redigering og eventuell fjerning. Ingen lagring ved åpning eller avbryt; + åpner katalogvalget direkte. |
| + med annen størrelse/form eller på egen rad | Kjent regresjon er rettet: alle piller i samlingen, inkludert +, har lik bredde, høyde, form og ramme. + følger siste element og bryter naturlig til neste ledige plass. |
| Fritekst/grunnlagsredigering og demo-Level Up | Nyere avklaring: minimal opprettelse, klasseavhengig subclass-liste og egne valg. Egen utstyrsdialog inne i appen. Manuell Level Up krever ny samlet maks HP; ingen automatisk healing eller tildeling av innhold. |
| Statiske demoer, «Nullstill demo» og generisk «øvrige felt» | Ikke videreført. Karakterer lagres i IndexedDB; JSON-backup, hendelseslogg og angre beholdes. |

Den opprinnelige sammenligningen ovenfor var ufullstendig: tette samlinger, utstyrsgrupperingen og flere påkrevde Character-funksjoner manglet. Brukeren påpekte dette og bestilte en samlet rettelse mot krav, avklaringer og prototype. Den nye versjonen har egne grupper for Weapons / Armor og skjold / Annet utstyr, normalt fire piller per rad, fungerende features/feats, spells/cantrips, strukturerte languages/proficiencies/defenses, ressurser/hvile og portrett. Se [kravmatrise, avgrensning og testbevis](CHARACTER_WORKSPACE.md) for gjeldende status.

Fullt SRD-regelbibliotek, automatisk genererte våpen-/standardoppslag i Combat, avansert skadekalkulator og endelig designretning gjenstår. Disse er fortsatt produktkrav, ikke krav som er bortfalt ved faseavgrensning.

Implementasjonen er inspisert ved 390 og 320 px, inkludert stor skrift. Nettlesertestene kontrollerer 320/360/390/768 px, like piller og én statusrad, dataisolasjon, HP i Combat, Level Up/angre, offline, backup og oppdatering av en cachet versjon. Se [mobilbildene og implementasjonskontrakten](CHARACTER_FOUNDATIONS.md).
