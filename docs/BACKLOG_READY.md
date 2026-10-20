# Klargjøring av backlog for egne tråder

Kontrollert mot master **e2f8786**, med samme appkode som9518d8c. Bestillingen gjelder klargjøring og dokumentasjon av de27 eksisterende oppgavene, ikke implementasjon av appen. Ingen av scenarioene nedenfor er nye kjørte tester eller bevis for at en funksjon er levert.

## Status og bruk

**9 klare, 16 trenger produktavklaring og 2 avventer avhengighet/testtilgang.** Prioritet og opprinnelig BL-rekkefølge endres ikke. «Klar» betyr at en oppgave kan bestilles implementert uten en ny generell produktgjennomgang; det er ikke tillatelse til å begynne kodearbeid.

- **Klar for implementasjon:** flyt, omfang, forventninger og bevaringskrav er tilstrekkelig avklart; ingen åpne produktspørsmål eller utestående harde oppgaveavhengigheter. Tekniske valg/rotårsaksutredning eies av implementatøren. En uttrykkelig fysisk testport må fortsatt oppfylles før levering.
- **Trenger produktavklaring:** teksten inneholder et konkret **forslag**, ikke en ny vedtatt løsning. Spørsmålene i oppgaven må avklares, oppdateres i krav/beslutninger og kontrolleres før Klar-merket kan settes. Ikke spør på nytt om papirarkmålet, manuell kontroll eller allerede bestemte plasseringer.
- **Avventer avhengighet:** oppgavens forventning er beskrevet, men angitte leveranser eller fysisk testtilgang mangler. En lukket avhengighet er ikke nok i seg selv: sammenhold spesifikasjonen med den faktiske leveransen før status endres.

Status føres som GitHub-merker og speiles her ved nye beslutninger/leveranser. Den vurderes ved hver ny implementasjonstråd mot gjeldende master; denne filen er ikke automatisk synkronisert med GitHub. En endret forutsetning kan gjøre en tidligere klar oppgave uklar igjen. Ingen Issue lukkes av denne klargjøringen.

## Felles kontrakt for alle implementasjoner

1. Les oppgaven og AGENTS, REQUIREMENTS, DECISIONS, DATA_MODEL, DESIGN, BACKLOG og gjeldende leveransestatus. Nyeste eksplisitte beslutning går foran historikk. Dokumenter aktuell startcommit og hvilke scenarioer som faktisk omfattes.
2. Papirkarakterarket er målet: enkel føring/oppslag, relevante valg, fysiske terninger og DM som autoritet. Generelle gyldige valg, alternative kilder og manuelle unntak bevares. Ingen automatisk karakterbygging, kamp-/turtelling eller fri regelteksttolkning.
3. Bevar data utenfor endringen: stabile IDs, catalog/source/ownership, manuelle totaler, bruk/hender/attunement, pooler, referanser, utkast, portrett og andre karakterer. Åpning/preview/filtervalg skriver ingen karakterendring. Ukjente/importerte data må ikke normaliseres bort av UI-forenkling.
4. Ved faktisk mutasjon: tydelig validering/feil, bevart arbeid ved retry, revisjonskontroll, én atomisk bekreftelse/hendelse og samlet Angre der flyten krever det. Nye datafelt må overleve relevant kopi/backup/import og gamle data må fortsatt kunne leses. Rene visnings-/manifestendringer trenger ikke kunstige mutasjons- eller migreringstester.
5. UI følger Eventyrjournal, lesbar mobil, uniforme elementer, riktige hjørnemarkører, riktig fokus/scroll og tilgjengelige kontrollnavn. Rene listevalg registreres direkte. Flere verdier følger den avklarte ett-spørsmål-veiviseren; et avvik fra dette må være et godkjent konkret produktvalg.
6. Utled nødvendige regresjonstester fra scenarioene **før koding**. Filene i hvert punkt er eksisterende relevante testsuiter, ikke en påstand om at de nye scenarioene allerede er dekket. Test faktisk inndata, grenser, feil og kontekst; ikke bare at et felt finnes.
7. Lever på egen branch/PR. Gjør reell produktkontroll på320/390px og stor tekst av berørte flyter; beskriv begrunnede forskjeller fra prototype/gjeldende app. Fysisk iOS/Safari/standalone må ikke erklæres testet ut fra Chromium. Legg kontrollbevis og restkrav i CHARACTER_WORKSPACE og PR før merge.
8. Hold konkrete nye beslutninger i REQUIREMENTS/DECISIONS, faktisk status i BACKLOG og oppgavens bevis i Issue/PR. Ikke merk et helt område ferdig fordi en del er levert; ikke lukk en rapportert fysisk feil uten dens testgrunnlag.

Egne tråder bruker separate brancher/arbeidskopier; start med én aktiv implementasjon. Samtidige tråder på samme checkout er ikke beskyttet av separate samtaler. Filoverlapp er en samordningsrisiko, ikke automatisk en funksjonell avhengighet.

## Oppgaveoversikt

| Oppgave | Status | Avhengighet / leveringsport |
| --- | --- | --- |
| [BL-01 /#25](#bl-01) | Klar for implementasjon | Ingen hard oppgaveavhengighet |
| [BL-02 /#26](#bl-02) | Klar for implementasjon | Ingen hard oppgaveavhengighet; fysisk iPhone-kontroll kreves |
| [BL-03 /#27](#bl-03) | Klar for implementasjon | Ingen hard oppgaveavhengighet |
| [BL-04 /#28](#bl-04) | Klar for implementasjon | Ingen hard oppgaveavhengighet; fysisk iPhone-kontroll kreves |
| [BL-05 /#29](#bl-05) | Trenger produktavklaring | #30; spørsmål nedenfor |
| [BL-06 /#30](#bl-06) | Trenger produktavklaring | Ingen hard oppgaveavhengighet; spørsmål nedenfor |
| [BL-07 /#31](#bl-07) | Trenger produktavklaring | #30; spørsmål nedenfor |
| [BL-08 /#32](#bl-08) | Klar for implementasjon | Ingen hard oppgaveavhengighet |
| [BL-09 /#33](#bl-09) | Klar for implementasjon | Ingen hard oppgaveavhengighet |
| [BL-10 /#34](#bl-10) | Klar for implementasjon | Ingen hard oppgaveavhengighet |
| [BL-11 /#35](#bl-11) | Avventer avhengighet | #34 |
| [BL-12 /#36](#bl-12) | Trenger produktavklaring | Ingen hard oppgaveavhengighet; spørsmål nedenfor |
| [BL-13 /#37](#bl-13) | Trenger produktavklaring | Ingen hard oppgaveavhengighet; spørsmål nedenfor |
| [BL-14 /#38](#bl-14) | Klar for implementasjon | Ingen hard oppgaveavhengighet |
| [BL-15 /#39](#bl-15) | Trenger produktavklaring | Ingen hard oppgaveavhengighet; spørsmål nedenfor |
| [BL-16 /#40](#bl-16) | Trenger produktavklaring | Ingen hard oppgaveavhengighet; spørsmål nedenfor |
| [BL-17 /#41](#bl-17) | Trenger produktavklaring | Ingen hard oppgaveavhengighet; spørsmål nedenfor |
| [BL-18 /#42](#bl-18) | Trenger produktavklaring | Ingen hard oppgaveavhengighet; spørsmål nedenfor |
| [BL-19 /#43](#bl-19) | Klar for implementasjon | Ingen hard oppgaveavhengighet |
| [BL-20 /#44](#bl-20) | Trenger produktavklaring | Ingen hard oppgaveavhengighet; spørsmål nedenfor |
| [BL-21 /#45](#bl-21) | Trenger produktavklaring | #34; spørsmål nedenfor |
| [BL-22 /#46](#bl-22) | Trenger produktavklaring | Ingen hard oppgaveavhengighet; spørsmål nedenfor |
| [BL-23 /#47](#bl-23) | Trenger produktavklaring | #39; spørsmål nedenfor |
| [BL-24 /#48](#bl-24) | Trenger produktavklaring | Ingen hard oppgaveavhengighet; spørsmål nedenfor |
| [BL-25 /#49](#bl-25) | Trenger produktavklaring | Ingen hard oppgaveavhengighet; spørsmål nedenfor |
| [BL-26 /#50](#bl-26) | Trenger produktavklaring | Ingen hard oppgaveavhengighet; spørsmål nedenfor |
| [BL-27 /#51](#bl-27) | Avventer avhengighet | #26, #28; fysisk iPhone-kontroll kreves |

## Første trygge oppgave

Start med **BL-01 / #25** når implementasjon uttrykkelig bestilles. Den er liten og har tydelige grenser; #26 følger som separat fysisk verifisert feilretting. #27 (appnavnet) er også en uavhengig liten oppgave. Dette starter ingen av dem nå.

## Åpne produktvalg tas i korte runder

Ikke send alle16 avklaringer til brukeren som én spørsmålsliste. Begynn med de tidligste sammenhengende punktene: #29–31 om individuelt utstyr/Forbruk. Ta så én brukerflyt om gangen. Eksisterende vedtak som Forbruk-gruppen, manuelle terninger og ingen tursporing skal ikke gjøres til åpne spørsmål igjen.

## BL-01

**[#25 – Lukke vanlig tallhjul ved trykk på valgt midtbånd](https://github.com/geirskoglund/dnd-character-sheet/issues/25)**

**Status:** Klar for implementasjon

Midtbåndets nye funksjon er uttrykkelig ønsket. Det øvrige tallhjulet og pengeunntaket er kjent.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Arbeidsflyt og omfang

1. Åpne et vanlig tallhjul, rull til ønsket verdi og trykk på den valgte midtraden. Hjulet lukkes og verdien står igjen i tallfeltet.
2. Lukkingen bekrefter ikke skjemaet. Spilleren kan skrive direkte i tallfeltet eller åpne hjulet igjen; skjemaets eksisterende Lagre/Avbryt gjelder.
3. Pengenes to alltid synlige hjul beholder dagens særskilte direkteinnskriving. De skal ikke få generisk midtbåndslukking.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| HP 20/20, velg delta−7, trykk midtraden | Hjulet lukkes uten å åpne tastatur. Preview viser HP 13, men lagret HP er20 til Oppdater HP trykkes. |
| Åpne samme hjul igjen; endre via tastatur | Hjulet er sentrert på−7. Direkte innskriving virker og senere scroll overskriver ikke den nye teksten. |
| Tall ved min 0/maks 3; trykk valgt rad etter scroll | Valget beholdes innen grensene; en avsluttet momentumbevegelse endrer ikke tallet etter lukking. |
| Penger55,25 GP, rull ett hjul og bruk direkte beløp | Begge hjul og eksakt CP-lagring virker fortsatt. Ingen skjult pengekolonne eller utilsiktet submit. |

### Må bevares og avgrenses

Avgrens til vanlig hjul/lukk/fokus. Bevar tastatur, ARIA, grenser og HP-preview. Ikke gjør en antatt iOS-årsak til fasit; #26 har egen leveringstest.

### Berørte områder og regresjonsgrunnlag

Kode/data: [number-wheel.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/number-wheel.ts), [hp-control.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/hp-control.ts), [money-control.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/money-control.ts).

Eksisterende relevante testsuiter: [design.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/design.spec.ts), [illustrated.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/illustrated.spec.ts), [workflows.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/workflows.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål

Ingen uavklarte produktvalg identifisert innen dette omfanget. Ny faktisk motstrid må avklares, ikke løses ved å droppe et krav.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-02

**[#26 – Finne og rette dobbelttrykk i installert iPhone-app](https://github.com/geirskoglund/dnd-character-sheet/issues/26)**

**Status:** Klar for implementasjon

Feilen og forventet oppførsel er konkrete. Årsaksutredning er teknisk arbeid; fysisk iOS-verifikasjon er en leveringsport, ikke en uavklart produktregel.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Arbeidsflyt og omfang

1. Reproduser åpning, rulling, lukking og neste handling på samme iPhone i installert modus og vanlig nettleser. Noter iOS/browser, build og faktisk hendelsesrekkefølge.
2. Undersøk fokus, blur, click/touch/pointer og scroll før rettelse velges. Et eksternt Web Awesome-problem er kun en sammenligning, ikke årsaksbevis.
3. Første trykk skal åpne/lukke; etter lukking skal neste tilsiktede kontroll virke på første trykk. Dersom #25 endrer samme område, prøves den leverte kombinasjonen på nytt.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Installert iPhone, åpne/rull/lukk/åpne gjentatte ganger | Hvert bevisst trykk gir én handling. Dokumenter også langsomt trykk og liten fingerbevegelse. |
| Rull og gå direkte til Neste/Lagre eller et annet tallfelt | Ingen fokustapspassasje krever et ekstra trykk; ingen dobbel submit eller tap av siste valgte tall. |
| Samme scenario i nettleser, med tastatur og på HP 0 | Eksisterende fungerende betjening, input og grenser bevares. |
| Kun Chromium-resultat foreligger | Registrer fysisk iOS som utestet. Feilen skal ikke lukkes som bekreftet løst. |

### Må bevares og avgrenses

Ingen blind global pointerup-erstatning, dobbel hendelsesbinding eller deaktivering av tilgjengelig zoom. Ikke utvid til et nytt kontrollsystem.

### Berørte områder og regresjonsgrunnlag

Kode/data: [number-wheel.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/number-wheel.ts), [dialog.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/dialog.ts), [wizard.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/wizard.ts), [style.css](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/style.css).

Eksisterende relevante testsuiter: [design.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/design.spec.ts), [illustrated.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/illustrated.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

**Leveringsport:** Fysisk iPhone/standalone må prøves før denne delen kan kvitteres ut. Registrer manglende tilgang som utestet; ikke erklær den løst på bakgrunn av Chromium.

### Produktspørsmål

Ingen uavklarte produktvalg identifisert innen dette omfanget. Ny faktisk motstrid må avklares, ikke løses ved å droppe et krav.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-03

**[#27 – Bruke navnet My D&D ved installasjon](https://github.com/geirskoglund/dnd-character-sheet/issues/27)**

**Status:** Klar for implementasjon

Det installerte navnet My D&D er uttrykkelig bestemt. Nytt ikon er en separat åpen beslutning.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Arbeidsflyt og omfang

1. La manifestets name og short_name være My D&D. Bevar id, start_url og scope slik at app- og lagringsidentiteten ikke skiftes.
2. Kontroller fersk installasjon og beskriv hva en eksisterende installasjon faktisk gjør ved manifestoppdatering. Ikke lov automatisk omdøping på alle plattformer.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Produksjonsmanifest på Pages-understien | Begge navnefelt er nøyaktig My D&D; id/start_url/scope og korrekt escaping er beholdt. |
| Oppdater en installert utgave med lagret karakter | Appen åpner riktig ark uten ny origin/database eller tapt utkast. |
| Hjemskjermnavnet blir ikke endret automatisk på en plattform | Dokumenter faktisk oppførsel. Eventuell reinstallasjonsveiledning må bevare og sikkerhetskopiere data, ikke anta at avinstallering er tapsfri. |

### Må bevares og avgrenses

Endre installasjonsnavn, ikke appikon, branding over karakteren eller database-/cache-identitet.

### Berørte områder og regresjonsgrunnlag

Kode/data: [manifest.webmanifest](https://github.com/geirskoglund/dnd-character-sheet/blob/master/public/manifest.webmanifest), [UPDATES.md](https://github.com/geirskoglund/dnd-character-sheet/blob/master/docs/UPDATES.md).

Eksisterende relevante testsuiter: [characters.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/characters.spec.ts), [updates.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/updates.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål

Ingen uavklarte produktvalg identifisert innen dette omfanget. Ny faktisk motstrid må avklares, ikke løses ved å droppe et krav.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-04

**[#28 – Redusere høyden på bunnmenyen](https://github.com/geirskoglund/dnd-character-sheet/issues/28)**

**Status:** Klar for implementasjon

Lavere meny er bestemt. Avstanden kan velges teknisk innen eksisterende Eventyrjournal og tilgjengelige trykkflater.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Arbeidsflyt og omfang

1. Mål dagens høyde med og uten safe area. Reduser overflødig vertikal padding/min-height, mens de fem ikonmålene beholder minst44 CSS-px høye trykkflater.
2. Kontroller at siste innhold kan scrolle fri av menyen, at aktiv markør er synlig, og at Meny åpnes og lukkes uten klipping.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| 390px med safe-area0, sammenlign med dagens build | Menyens faktiske høyde er redusert, ikke bare ikonets størrelse; de fem trykkflatene er fortsatt minst44px. |
| iPhone standalone med home-indikator | Nødvendig safe area består, siste rad kan leses og menyen dekker ingen bekreftelse. |
| 320px og200% tekst, alle fire faner og Meny | Ingen horisontal overflyt, utilgjengelig knapp eller tap av aktivtilstand/tilgjengelig navn. |

### Må bevares og avgrenses

Ingen ny navigasjonsstruktur, sticky topp eller mindre trykkflater for å oppnå høyde. Endelig geometri dokumenteres med før/etter-mål.

### Berørte områder og regresjonsgrunnlag

Kode/data: [style.css](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/style.css), [main.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/main.ts).

Eksisterende relevante testsuiter: [design.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/design.spec.ts), [equipment.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/equipment.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

**Leveringsport:** Fysisk iPhone/standalone må prøves før denne delen kan kvitteres ut. Registrer manglende tilgang som utestet; ikke erklær den løst på bakgrunn av Chromium.

### Produktspørsmål

Ingen uavklarte produktvalg identifisert innen dette omfanget. Ny faktisk motstrid må avklares, ikke løses ved å droppe et krav.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-05

**[#29 – Føre vanlig utstyr enkeltvis, uten Antall](https://github.com/geirskoglund/dnd-character-sheet/issues/29)**

**Status:** Trenger produktavklaring

Individuelt vanlig utstyr er bestemt, men skillet mot Forbruk og håndteringen av eldre stabler med virkninger må være tydelig før migreringsflyten velges.

**Avhengigheter:** [#30](https://github.com/geirskoglund/dnd-character-sheet/issues/30).

### Forslag til arbeidsflyt – ikke godkjent

1. Vedtatt: nytt vanlig armor/ring/amulet føres som én gjenstand, og Kopier lager en separat instans. Ingen Antall i normalflyten.
2. Forslag til eldre data: les eksisterende stabel urørt. Vis en særskilt, uttrykkelig deling med preview når spilleren velger å dele; ikke del under oppstart/import.
3. Forbruk skal ligge i sin egen gruppe. Klassifiseringen må samsvare med #30, også for egne varer og tidligere feilplasserte piler.

Scenariene er akseptanseforslag til den uavklarte flyten; de vedtar ingen nye produktvalg.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Ny Leather og to ringer | Ingen antallspørsmål. Kopier påvirker ikke originalens bruk/attunement/ressurser. |
| Eldre rustning quantity2, navngitt bonus og notat | Åpning endrer ingen data. En senere bekreftet konvertering bevarer verdiene og kan angres samlet. |
| Eldre magisk stabel med én begrenset pool | Ingen oppdiktet fordobling av tilgjengelige bruk. Avklaringsvalget for delte versus separate pools må være testbart. |
| Eldre/custom ammunition | Blir ikke utilsiktet individuelle rustningslignende poster; klassifisering og omplassering bevarer antall og IDs. |

### Må bevares og avgrenses

Bevar item-/child-ID-er og gamle utkast. Ikke anvend copyEquipment ukritisk som automatisk migrering av alle stabeltyper.

### Berørte områder og regresjonsgrunnlag

Kode/data: [model.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/model.ts), [item-effects.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/item-effects.ts), [equipment-wizard.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/equipment-wizard.ts).

Eksisterende relevante testsuiter: [item-effects.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/item-effects.test.ts), [item-effects.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/item-effects.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål før Klar-status

- Skal eldre vanlige stabler som utgangspunkt forbli urørte til spilleren velger Del til gjenstander, også når antallet fortsatt er synlig som legacy-information?
- Når en gammel stabel har én bruksteller: skal delingen bevare én delt pool, eller skal spilleren velge fordeling? Forslag: ikke gjette; bevar originalen frem til et uttrykkelig valg.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-06

**[#30 – Legge til Forbruk med et avgrenset standardutvalg](https://github.com/geirskoglund/dnd-character-sheet/issues/30)**

**Status:** Trenger produktavklaring

Forbruk som egen gruppe og ferdige standardvarer er bestemt. Første katalogomfang og betjeningen for egne/eldre varer trenger en konkret avgrensning.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Forslag til arbeidsflyt – ikke godkjent

1. Vedtatt: Utstyr får gruppen Forbruk. + åpner relevant søk/liste direkte; katalogvalg leverer navn og regeltekst uten et langt registreringsskjema.
2. Forslag til startutvalg: Arrow, Crossbow bolt, Sling bullet, Rations(1 day) og de fire2014 healing-potiongradene med kildebelagte uttrykk. Ikke alle magiske pilvarianter.
3. Egen vare velges nederst og spør bare navn og startantall. Omplassering av eldre/custom utstyr må bevare data uten å gjette fra navnet.

Scenariene er akseptanseforslag til den uavklarte flyten; de vedtar ingen nye produktvalg.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Velg Arrow og angi20 | Én beholdning med20, ingen egen pilskade eller våpenprofil; ingen ny kategori-dropdown som gjentar inngangen. |
| Velg Potion of Healing | Vis2d4+2 som fysisk healingoppslag. Ingen automatisk HP-endring eller digitalt kast. |
| Ingen nettforbindelse | Startutvalget og egenregistrering virker etter caching med lisens/kilde. |
| Eksisterende vare med samme grunnnavn | Ikke slå ulike DM-varianter/stabler sammen automatisk; behold ID/notat/antall. |

### Må bevares og avgrenses

De fire healing-potiongradene er et konkret forslag, ikke allerede godkjent katalogutvalg. Ingen vekt/encumbrance-, ammunition- eller potionmotor.

### Berørte områder og regresjonsgrunnlag

Kode/data: [catalog.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/catalog.ts), [model.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/model.ts), [equipment-picker.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/equipment-picker.ts), [views.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/views.ts).

Eksisterende relevante testsuiter: [records.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/records.test.ts), [equipment.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/equipment.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål før Klar-status

- Er det foreslåtte startutvalget tilstrekkelig, eller skal andre ordinære potions/forbruksvarer inn i første levering?
- Kan en gammel/custom vare flyttes til Forbruk med et enkelt eksplisitt Flytt-valg? Forslag: ja, uten automatisk navnegjetting.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-07

**[#31 – Bruke og fylle på Forbruk raskt](https://github.com/geirskoglund/dnd-character-sheet/issues/31)**

**Status:** Trenger produktavklaring

Enkel reduksjon og samlet påfyll er ønsket, men den konkrete knappflyten ble bare foreslått. Den må avklares sammen med #30.

**Avhengigheter:** [#30](https://github.com/geirskoglund/dnd-character-sheet/issues/30).

### Forslag til arbeidsflyt – ikke godkjent

1. Forslag: Forbruk-raden viser navn, antall, −1 og Påfyll. −1 lagrer straks én endring med Angre; Påfyll spør hvor mange som skal legges til.
2. Påfyll er en endring, ikke ny total:18+20 blir38. En valgfri direkte korreksjon ligger i detaljene.
3. Ved null beholdes raden, −1 er deaktivert og Påfyll virker. Våpen-/spelloppslag trekker aldri automatisk fra beholdningen.

Scenariene er akseptanseforslag til den uavklarte flyten; de vedtar ingen nye produktvalg.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Piler18; trykk−1 | 17 lagres én gang; Angre gir18. Ingen dobbel nedtelling ved touch/klikk. |
| Piler18; Påfyll20 | Preview38, bekreftelse lagrer38 som én hendelse. Avbryt bevarer18. |
| Piler0; forsøk−1 og deretter Påfyll20 | Antallet blir ikke negativt; samme rad blir20 uten nyopprettelse. |
| Lagringsfeil eller gammel fane under påfyll | Ingen stille tap/duplisering. Valgt beløp beholdes for trygg retry; konflikter vises tydelig. |

### Må bevares og avgrenses

Skill faktisk item-quantity fra rechargeable klasse-/item-pools. Mat-/pilforbruk beregnes ikke automatisk over tid eller ved hvile.

### Berørte områder og regresjonsgrunnlag

Kode/data: [views.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/views.ts), [number-wheel.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/number-wheel.ts), [database.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/storage/database.ts).

Eksisterende relevante testsuiter: [storage.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/storage.test.ts), [interactions.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/interactions.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål før Klar-status

- Godkjenner du raden med direkte−1 og en Påfyll-knapp for et samlet beløp, med direkte totalretting i detaljene?
- Skal bruk av potion bare redusere antallet og vise regelteksten, mens HP fortsatt føres manuelt? Dette er foreslått for å holde papirarkflyten enkel.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-08

**[#32 – Legge inn relevante standardhandlinger i Combat](https://github.com/geirskoglund/dnd-character-sheet/issues/32)**

**Status:** Klar for implementasjon

Standardhandlingene og oppslagsprinsippet er allerede kravsatt og vist i v0.11. Ingen ny turstyringsflyt behøver å velges.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Arbeidsflyt og omfang

1. Combat legger til Unarmed Strike, Grapple, Shove, Attack, Dash, Disengage, Dodge, Help, Hide, Ready, Search, Use an Object og Opportunity Attack i riktig2014-kategori.
2. Karakterens egne våpen/spells/evner kommer først, generelle oppslag sist. Trykk åpner én lesbar detalj med relevante egne verdier og vilkår.
3. Unarmed Strike og særregler følger kjent klasse/utstyr. Grapple/Shove beskriver fysisk contest og forutsetninger; oppslaget utfører ikke handlingen.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Fighter 3 STR 16, PB 2, uten annet | Unarmed Strike viser d20+5 og4 bludgeoning, uten digitalt kast. |
| Fighter 3/Wizard 2 STR 16; og STR 6-figur | Første bruker PB 3 og d20+6. Vanlig unarmed-skade for STR 6 er0, aldri negativ. |
| Monk 2 DEX 16 STR 10, uten armor/skjold; deretter med armor | Martial Arts-grunnlaget viser d4+3 når vilkårene gjelder. Ved armor brukes vanlig grunnlag; klassenivå, ikke totalnivå, styrer Martial Arts-die. |
| Athletics proficiency/expertise og mål utenfor størrelse/rekkevidde | Korrekt egen Athletics-verdi og tekstkrav vises. Ingen beregnet vinner, action-forbruk eller blokkering av DM-unntak. |
| Skift/sveip alle Combat-faner; åpne/lukk general action | Andre oppslag, ∞/spellnivå, scroll og delte tellere bevares; ingen endring skrives ved oppslag. |

### Må bevares og avgrenses

Bruk SRD 5.1/2014 Combat og Martial Arts, ikke2024-regler. Kategori bestemmes av reglene; ingen auto-levelup eller handlingsutførelse. Net/lance/off-hand-oppførsel bevares.

### Berørte områder og regresjonsgrunnlag

Kode/data: [views.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/views.ts), [equipment.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/equipment.ts), [modifiers.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/modifiers.ts), [main.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/main.ts).

Eksisterende relevante testsuiter: [equipment.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/equipment.test.ts), [equipment.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/equipment.spec.ts), [design.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/design.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål

Ingen uavklarte produktvalg identifisert innen dette omfanget. Ny faktisk motstrid må avklares, ikke løses ved å droppe et krav.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-09

**[#33 – Knytte kjente klasse-/feat-/artsoppslag og tellere til samme kilde](https://github.com/geirskoglund/dnd-character-sheet/issues/33)**

**Status:** Klar for implementasjon

Kildebaserte oppslag fra registrerte evner og eksisterende tellere er et opprinnelig krav. Produktmålet og kategoriene er avklart; regelkartlegging er teknisk arbeid.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Arbeidsflyt og omfang

1. En registrert katalogegenskap gir relevante lesbare Combat-oppslag fra samme kilde, uten at spilleren kopierer teksten til en egen handling.
2. Kartlegg hele det distribuerte SRD-featureutvalget mot handlingskategori, eventuell teller og nødvendige vilkår før kodeendringen. Bruk eksplisitte kuraterte metadata, ikke fri tolkning av prosatekst ved runtime.
3. Katalogdefault brukes bare der brukeren ikke allerede har en egen korrigert/registrert kobling. Ukjent/custom innhold bevares og kan føres manuelt. Klassen alene skal ikke tildele alle features automatisk.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Fighter 3 registrerer Second Wind og Action Surge | Second Wind vises under Bonus med1d10+3 HP-tekst. Action Surge vises under Andre egenskaper. Begge bruker sine eksisterende pools. |
| Bruk Second Wind fra Combat, se Character, fullfør kort hvile | Samme pool-ID og antall vises begge steder og gjenopprettes etter regelen. Oppslagsåpning bruker ingenting. |
| Multiclass Fighter 2/Wizard 3, senere Fighter 3 | Fighter-nivået styrer Second Wind; PB/totalnivå må ikke erstatte riktig klassenivå. Ingen dupliserte pools ved nivåendring. |
| Manuell handling koblet til samme feature; slett/angre feature | Ikke lag parallell default eller mist andre eieres delte koblinger. Sletting/Angre/kopi/backup bevarer referansene. |
| Registrerte Rage, Ki, Wild Shape og øvrige støttede features | Alle relevante oppslag i kartleggingen er dekket eller merket som konkret gjenstående avvik. Ni eksempeltester alene betyr ikke komplett leveranse. |

### Må bevares og avgrenses

Bevar manuelle overstyringer og aktive vilkår. Ikke tildel features ut fra klasse alene, ikke fortolk custom tekst automatisk og ikke bygg en kampmotor. Hvis kartleggingen avdekker reell produktmotstrid, stopp den delen før koding.

### Berørte områder og regresjonsgrunnlag

Kode/data: [character-library.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/character-library.ts), [resource-setup.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/resource-setup.ts), [views.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/views.ts), [records.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/records.ts).

Eksisterende relevante testsuiter: [workflows.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/workflows.test.ts), [records.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/records.test.ts), [workspace.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/workspace.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål

Ingen uavklarte produktvalg identifisert innen dette omfanget. Ny faktisk motstrid må avklares, ikke løses ved å droppe et krav.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-10

**[#34 – Vise karakterens spell attack og save DC der spellen slås opp](https://github.com/geirskoglund/dnd-character-sheet/issues/34)**

**Status:** Klar for implementasjon

Karakterberegnede spellverdier i relevante oppslag er kravsatt. Eksisterende casting-kilder og manuelle felt gir et tydelig beregningsgrunnlag.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Arbeidsflyt og omfang

1. Åpne en spell fra Combat eller Magi. Når den faktisk har spell attack/save, vis karakterens verdi og kort kildegrunnlag i oppslaget.
2. Bruk registrert tilgangskilde/castingAbility og effektive ability scores. Ukjent eller tvetydig kilde skal merkes og kunne korrigeres; ikke anta første klasse eller INT.
3. Skill generell katalogtekst fra en eksplisitt manuell total. Bevar brukerens lagrede attack/save-tekst; oppslagsberegningen skal ikke omskrive den.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Wizard 3 INT 16 PB 2 med Fire Bolt og Hold Person | Fire Bolt viser d20+5; Hold Person viser WIS save DC 13. Grunnlaget bruker INT og riktig PB. |
| Samme figur med Magic Missile eller Shield | Ikke legg til et attack roll eller save DC som spellen ikke krever. Regeltekst og opprinnelig casting time bevares. |
| Wizard 1/Warlock 4, INT 12 CHA 16, PB 3 | Wizard-kildens attack/DC er+4/12; Warlock-kildens er+6/14. Samme spellnavn med annen kilde blandes ikke. |
| Aktiv INT-bonus endrer16 til18; deretter legges item bort | Wizard-attack/DC endres til+6/14 og tilbake til+5/13; manuell total og kilder endres ikke stille. |
| Custom spell uten kjent ability; manuell DC 15-tekst | Vis uavklart beregning fremfor feil default, og bevar manuelt grunnlag gjennom reload/backup/kopi. |

### Må bevares og avgrenses

Ingen slotforbruk, nye spelltilganger, automatisk casting eller global spellbonus fra vilkårlig itemtekst. Effekter som ikke er støttet, beskrives manuelt.

### Berørte områder og regresjonsgrunnlag

Kode/data: [magic.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/magic.ts), [item-effects.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/item-effects.ts), [views.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/views.ts), [main.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/main.ts).

Eksisterende relevante testsuiter: [workflows.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/workflows.test.ts), [item-effects.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/item-effects.test.ts), [workflows.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/workflows.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål

Ingen uavklarte produktvalg identifisert innen dette omfanget. Ny faktisk motstrid må avklares, ikke løses ved å droppe et krav.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-11

**[#35 – Gjøre cantrip-scaling og upcasting lettere å slå opp riktig](https://github.com/geirskoglund/dnd-character-sheet/issues/35)**

**Status:** Avventer avhengighet

Nivågrunnlaget og oppslagsmålet er avklart. Lever etter #34 så kilde/ability og felles spelldetalj ikke utvikles som konkurrerende løsninger.

**Avhengigheter:** [#34](https://github.com/geirskoglund/dnd-character-sheet/issues/34).

### Arbeidsflyt og omfang

1. Cantrip-oppslaget viser støttet scaling fra samlet karakterlevel. Flere stråler/angrep skal vises som flere fysiske kast, ikke som ett oppdiktet samlet angrep.
2. For en leveled spell kan spilleren se regeltekst og et støttet høyere slotnivå som oppslagsvalg uten å bruke en slot. Bruk sikre strukturerte/kildebelagte data; behold manuell tekst for ukjent innhold.
3. Før implementasjon angis eksplisitt hvilke eksisterende kataloguttrykk som beregnes og hvordan resten vises. Ingen unsupported verdi skal se ferdigberegnet ut.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Fire Bolt ved totalnivå 1/5/11/17, også multiclass | 1d10/2d10/3d10/4d10 fire; totalnivå brukes, ikke Wizard-nivået alene. |
| Eldritch Blast ved totalnivå 5 uten ekstra feat/modifier | To stråler, hver1d10 force og eget attack roll; ikke ett2d10-angrep og ingen oppdiktet CHA-skadebonus. |
| Magic Missile på slotnivå 1 og3 | Tre henholdsvis fem darts, hver1d4+1; samlet3d4+3/5d4+5 kan vises som sum, ikke som skade per dart. Ingen slot endres. |
| Custom eller ukjent scaling og manuelt damage-felt | Egen tekst bevares og vises tydelig som manuelt grunnlag; ingen regex-gjetting på nye regler. |
| Åpne/endre preview/avbryt og les historikk | Ingen karakterendring eller audit-hendelse for ren oppslagsnavigasjon. |

### Må bevares og avgrenses

Omfanget er etterprøvbare oppslag, ikke spellutførelse, målfordeling eller generell prosatolker. Ukjent/kompleks scaling skal ha ærlig manuell fallback.

### Berørte områder og regresjonsgrunnlag

Kode/data: [magic.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/magic.ts), [character-library.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/character-library.ts), [import-srd.mjs](https://github.com/geirskoglund/dnd-character-sheet/blob/master/scripts/import-srd.mjs), [main.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/main.ts).

Eksisterende relevante testsuiter: [workflows.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/workflows.test.ts), [workflows.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/workflows.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål

Ingen uavklarte produktvalg identifisert innen dette omfanget. Ny faktisk motstrid må avklares, ikke løses ved å droppe et krav.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-12

**[#36 – Forenkle proficiency-registrering](https://github.com/geirskoglund/dnd-character-sheet/issues/36)**

**Status:** Trenger produktavklaring

Alle datatypene må bevares. Den nye proficiencyflyten ble uttrykkelig utsatt og er ikke godkjent som et konkret skjermforløp.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Forslag til arbeidsflyt – ikke godkjent

1. Forslag: velg type med direkte knapper. Skill/save får liste over relevante valg, så Proficient/Expertise; weapon/armor/tool får kjent liste og Opprett egen.
2. Manuell total modifier er et frivillig eget spørsmål i skill/save-redigering, ikke et nødvendig skapelsesfelt.
3. Regelkonsekvensene beregnes fra registrerte poster; manglende proficiency blokkerer aldri eierskap til et våpen.

Scenariene er akseptanseforslag til den uavklarte flyten; de vedtar ingen nye produktvalg.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| STR 16 PB 2; Athletics proficient og expertise | Modifier blir+5 henholdsvis+7, og favoritt/oppslag oppdateres. |
| Sett eksplisitt Athletics-total+9 | +9 er totalen, ikke+9 i tillegg til proficiency/itembonus. Tom override går tilbake til beregning. |
| Velg Martial weapons; legg til eget verktøy | Riktig strukturert kategori lagres. Egen post krever ikke en teknisk katalog-ID. |
| Åpne/avbryt/slett/angre en eksisterende proficiency | ID, category, level og ukjente referanser bevares. Ingen stille sletting eller dobbeltregistrering. |

### Må bevares og avgrenses

Ikke rekonstruer karakterens tidligere valg, eller tildel skills automatisk fra et klassenavn. Skill proficiency og weapon/armor/tool-tilgang har ulike regler.

### Berørte områder og regresjonsgrunnlag

Kode/data: [record-editors.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/record-editors.ts), [modifiers.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/modifiers.ts), [equipment.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/equipment.ts).

Eksisterende relevante testsuiter: [modifiers.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/modifiers.test.ts), [workspace.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/workspace.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål før Klar-status

- Godkjenner du den foreslåtte type → konkret valg → proficiency-grad-flyten, med manuelt totalfelt bare under frivillig tilpasning?
- Skal både endring av eksisterende proficiency og nyregistrering bruke denne korte flyten, eller ønskes en rask gradvelger ved redigering?

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-13

**[#37 – Forenkle registrering av skadeegenskaper](https://github.com/geirskoglund/dnd-character-sheet/issues/37)**

**Status:** Trenger produktavklaring

Skadetyper og varige beskyttelser er avklart; en ny registreringsflyt og hvordan vilkårstilstand vises er ennå ikke godkjent.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Forslag til arbeidsflyt – ikke godkjent

1. Forslag: velg skadetype direkte → velg Resistance/Vulnerability/Immunity → Gjelder dette under en betingelse? Ja/Nei → eventuell tekst → Lagre.
2. En beskyttelse er en varig karakterpost. Om vilkåret gjelder for en bestemt skadehendelse avgjøres senere i Ta skade, ikke automatisk fra teksten.
3. Eldre condition.state=true/false/unknown og koblinger må bevares ved vanlig redigering, ikke normaliseres bort.

Scenariene er akseptanseforslag til den uavklarte flyten; de vedtar ingen nye produktvalg.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Legg til Fire resistance og Fire vulnerability | To separate poster består samtidig; ingen eksklusiv radiogruppe som fjerner den andre. |
| Betinget beskyttelse mot ikke-magisk skade | Vilkårsteksten følger sin post og er synlig; vanlig HP-delta foretar ingen uannonsert halvering. |
| Importer eldre post med state=false og rediger navngitt tekst | Eksisterende struktur/vilkår bevares med mindre spilleren uttrykkelig endrer dem. |
| Eget skadenavn, lagringsfeil, retry og Angre | Custom navn tillates som DM-føring; feil beholder svar og retry lager ikke to poster. |

### Må bevares og avgrenses

Ingen skaderesolusjon i denne oppgaven. Det er #44. Nye datavalg skal ikke forveksles med at en effekt er aktiv i en bestemt hendelse.

### Berørte områder og regresjonsgrunnlag

Kode/data: [record-editors.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/record-editors.ts), [record-fields.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/record-fields.ts), [model.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/model.ts).

Eksisterende relevante testsuiter: [workspace.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/workspace.spec.ts), [storage.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/storage.test.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål før Klar-status

- Godkjenner du de foreslåtte direkte type-/egenskapsvalgene med valgfritt betingelsesspørsmål?
- Skal vilkåret bare beskrives her, med bekreftelse per skadehendelse senere, mens eventuell eldre lagret vilkårstilstand beholdes under detaljer?

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-14

**[#38 – Forenkle tilstandsimmunitet og forklare hensikten](https://github.com/geirskoglund/dnd-character-sheet/issues/38)**

**Status:** Klar for implementasjon

Dette er hovedsakelig ett listevalg, ikke en flerverdiveiviser. Standardliste, egenregistrering og bevaring av data følger allerede vedtatte prinsipper.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Arbeidsflyt og omfang

1. Fra + under Tilstandsimmuniteter velges en standardtilstand fra en synlig/søkbar liste. Valget registreres direkte og listen lukkes.
2. En kort forklaring sier at dette fører en beskyttelse mot en tilstand; det aktiverer ikke tilstanden på karakteren. Opprett egen spør bare om navnet.
3. Eksisterende post åpnes for oppslag/endring eller bekreftet fjerning. UI skal ikke automatisk slette eller nekte registrering av en nåværende condition.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Velg Poisoned fra standardlisten | Én strukturert immunitet lagres, popup lukkes og Reload/backup bevarer den. |
| Velg samme allerede registrerte standardtilstand igjen | Markert/ingen dobbeltregistrering eller meningsløs historikk; immutabel katalog endres ikke. |
| Eksisterende custom conditionId=DMs forbannelse | Navnet forblir lesbart og redigerbart; ny standardliste erstatter eller forkaster det ikke. |
| Karakteren har både condition Poisoned og immunitet mot Poisoned | Begge data bevares; spilleren/DM korrigerer situasjonen. Ingen ny tilstandsmotor. |
| Lagring feiler under tillegg; sletting avbrytes | Valg og eksisterende post bevares; tydelig feil/retry og ett samlet Angre for bekreftet endring. |

### Må bevares og avgrenses

Ingen regel om automatisk blokkerte conditions eller tvungen kobling til en spell. Skadeimmunitet er fortsatt en annen datadel.

### Berørte områder og regresjonsgrunnlag

Kode/data: [record-editors.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/record-editors.ts), [records.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/records.ts), [views.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/views.ts).

Eksisterende relevante testsuiter: [workspace.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/workspace.spec.ts), [storage.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/storage.test.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål

Ingen uavklarte produktvalg identifisert innen dette omfanget. Ny faktisk motstrid må avklares, ikke løses ved å droppe et krav.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-15

**[#39 – Fullføre enkel feature-/featredigering også for handling/ressurs/effekt](https://github.com/geirskoglund/dnd-character-sheet/issues/39)**

**Status:** Trenger produktavklaring

Vanlig featureføring er veiledet, men handling/ressurs/passiv effekt ligger fortsatt i ekspertskjema. Den samlede nye redigeringsflyten må godkjennes.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Forslag til arbeidsflyt – ikke godkjent

1. Forslag: navn/kategori → valgfri beskrivelse → oversikt over Handling, Begrensede bruk og Passiv virkning. Velg bare relevant del; hvert spørsmål får ett valg/verdi.
2. En eksisterende egenskap viser sine registrerte deler. Redigering beholder UUID-er og de andre delene; én sluttlagring bekrefter hele endringen.
3. Den eksisterende utstyrsveiviserens grafiske ramme kan gjenbrukes. Det betyr ikke automatisk at alle item-virkningstyper skal legges til features.

Scenariene er akseptanseforslag til den uavklarte flyten; de vedtar ingen nye produktvalg.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Egen feat med én Bonus-handling og1/short rest | Én feature, én kildekoblet handling og én delt pool; samme antall i Character/Combat/hvile. |
| Rediger bare tekst på importert feature med flere actionRefs | Ingen øvrige koblinger, passive effekter, spellAccess eller private/shared pools forsvinner. |
| Slå av en privat ressurs som en annen handling fortsatt deler | Ikke slett den andre eierens pool. Konflikten må håndteres etter eksisterende source-/ownership-kontrakt. |
| Lukk halvveis, reload offline, fortsett og lagre | Utkast påvirker ikke Combat før samlet bekreftelse. Retry og Angre gir én hel endring. |

### Må bevares og avgrenses

Ingen auto-tildeling ved level-up eller automatisk fortolkning av regeltekst. #33 gjelder genererte katalogoppslag; denne oppgaven gjelder enkel egenføring.

### Berørte områder og regresjonsgrunnlag

Kode/data: [guided-records.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/guided-records.ts), [record-editors.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/record-editors.ts), [wizard.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/wizard.ts), [records.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/records.ts).

Eksisterende relevante testsuiter: [workspace.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/workspace.spec.ts), [wizard-drafts.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/wizard-drafts.test.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål før Klar-status

- Godkjenner du en samlet oversikt over Handling, Begrensede bruk og Passiv virkning, fremfor et lineært spørsmål om alle tre hver gang?
- Skal første versjon føre én ny handling/pool/effekt per feature som i dag, eller skal alle importerbare flerkoblinger også kunne redigeres her? Forslag: avklar dette mot #47, uten å slette øvrige data.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-16

**[#40 – Fullføre enkel registrering/redigering av spell-detaljer](https://github.com/geirskoglund/dnd-character-sheet/issues/40)**

**Status:** Trenger produktavklaring

Felt og bevaringskrav er kjent, men hvilke spørsmål en vanlig egen spell skal møte og hvordan kjent katalogtekst låses opp må konkretiseres.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Forslag til arbeidsflyt – ikke godkjent

1. Forslag: velg eksisterende grunnspell eller Opprett egen → navn/nivå/tilgangskilde → valgfri tekst → frivillig oversikt for tid/range/varighet/components og attack/save/damage.
2. Katalogbaserte verdier følger med. Endre bare valgte forskjeller; ett spørsmål per verdi. Ingen obligatorisk spellbook/prepared/known-kryssrunde for alle.
3. Samme spellinstans brukes i Magi, forberedelse og Combat. Lagre lukker; X bevarer et separat utkast når veiviseren er aktiv.

Scenariene er akseptanseforslag til den uavklarte flyten; de vedtar ingen nye produktvalg.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Tilpass Shield med eget navn og tekst | Reaction, range, varighet, components og øvrige data bevares uten ny utfylling. |
| Ny egen cantrip fra en feat, med castingAbilityCHA | Nivå0, riktig kilde og ingen oppdiktede slots; vanlig klassefilter skal ikke skjule den. |
| Wizard-spell i bok som er forberedt og alltid-forberedt via annen kilde | Rediger riktig instans uten å flytte eller slå sammen de forskjellige tilgangene/preparation-flagene. |
| Importert damage/save-overstyring og ukjent iconKey-kompatibel metadata | Eksisterende gyldige data bevares; bare eksplisitte felt endres. Lagringsfeil beholder svarene. |

### Må bevares og avgrenses

Ingen ny spellbygger eller automatisk prosatolkning. Beregnede castingverdier/scaling avhenger av sikre metadata; #34/#35 samordnes ved redigering av samme detaljer.

### Berørte områder og regresjonsgrunnlag

Kode/data: [guided-records.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/guided-records.ts), [record-editors.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/record-editors.ts), [magic.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/magic.ts), [preparation.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/preparation.ts).

Eksisterende relevante testsuiter: [workflows.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/workflows.spec.ts), [illustrated.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/illustrated.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål før Klar-status

- Godkjenner du den foreslåtte valgfrie detaljoversikten, så normal egenregistrering kan avsluttes etter navn/nivå/kilde og eventuell tekst?
- Skal egne attack/save/damage-verdier primært føres som frie papirarkuttrykk, mens katalogbaserte beregninger har et eget tydelig overstyringsvalg?

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-17

**[#41 – Forenkle egne handlingsoppslag](https://github.com/geirskoglund/dnd-character-sheet/issues/41)**

**Status:** Trenger produktavklaring

Et eget handlingsoppslag skal være enkelt, men skillet mellom ren tekst, attack/save og ressurs må få en godkjent normalflyt.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Forslag til arbeidsflyt – ikke godkjent

1. Forslag: navn → velg Action/Bonus/Reaction/Andre egenskaper → valgfri regeltekst. Spilleren kan lagre her.
2. Vil du føre kast eller begrensede bruk? åpner bare nødvendige valg: attack/damage/save, eller eksisterende/ny pool. Ett spørsmål per verdi.
3. En linked pool er samme beholdning som ellers; ikke en ny teller på kortet. Rene oppslag krever ikke pool.

Scenariene er akseptanseforslag til den uavklarte flyten; de vedtar ingen nye produktvalg.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Eget tekst-oppslag Teleporter med Bonus | Kan opprettes uten attack, damage, DC eller ressurs. Riktig Combat-kategori viser teksten. |
| Egen handling bruker en allerede registrert pool | Bruk fra Combat endrer eksisterende pool; ingen duplisert beholdning. |
| Angi kun save DC 15 og kravtekst | Ingen oppdiktet attack roll eller damage; brukerens totale DC bevares. |
| Fjern handling med delt pool; avbryt og Angre | Delt pool og andre oppslag består. Bare bekreftede endringer gir historikk. |

### Må bevares og avgrenses

Ingen ny action-tracker, cast-motor eller tildeling av regelmekanikk fra navnet. Unngå å gjenta samme fritekst som både obligatorisk summary og detail.

### Berørte områder og regresjonsgrunnlag

Kode/data: [record-editors.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/record-editors.ts), [views.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/views.ts), [records.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/records.ts).

Eksisterende relevante testsuiter: [workspace.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/workspace.spec.ts), [storage.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/storage.test.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål før Klar-status

- Godkjenner du den korte normalflyten med frivillige kast/bruk som tillegg, og én regeltekst som utgangspunkt for kort/detalj?
- Skal aktiveringstypen være obligatorisk her, eller ha Ikke avklart med plassering under Andre egenskaper slik item-effekter har? Forslag: samme reserve som items.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-18

**[#42 – Samle kort hvile uten rå terningregistrering](https://github.com/geirskoglund/dnd-character-sheet/issues/42)**

**Status:** Trenger produktavklaring

Hit Dice som telling og separat/samlet HP-delta er bestemt. Samspillet mellom disse og selve kort-hvilebekreftelsen er uttrykkelig utsatt.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Forslag til arbeidsflyt – ikke godkjent

1. Forslag: Hvile → Kort hvile viser relevante beholdninger og Hit Dice. Spilleren fører antall brukte terninger per type; fysiske kast og regning skjer ved bordet.
2. Et frivillig totalt HP-tillegg kan føres. Preview viser faktisk HP og ressursgjenoppretting. Fullfør lagrer samlet med én Angre.
3. Betinget recharge krever uttrykkelig bekreftelse; manuelle/special-pools skal ikke fylles automatisk.

Scenariene er akseptanseforslag til den uavklarte flyten; de vedtar ingen nye produktvalg.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Monk 4 med2/4d8 og HP 10/28, bruker1 die og fører+7 HP | Resultat1/4d8, HP 17; ingen automatisk ekstra CON-bonus og temp HP uendret. |
| Samme figur velger Ki-gjenoppretting uten meditasjonsbekreftelse | Den betingede poolen fylles ikke før vilkåret bekreftes. |
| Fighter/Wizard med d10 og d6, Warlock Pact som separat pool | Brukte terninger telles mot riktig type. Kort hvile fyller relevante Pact/short-rest-pools, ikke ordinære Spellcasting-slots. |
| Avbryt, lagringsfeil/retry og samlet Angre | Ingen delvis HP/HitDice/rest-commit. Rå kast registreres ikke som en nødvendig del. |

### Må bevares og avgrenses

Ingen digital terningkasting, timer, spilledagskalender eller automatisk heling ved bare å åpne hvile. Den nåværende manuelle føringen må virke til erstatningen er levert.

### Berørte områder og regresjonsgrunnlag

Kode/data: [resource-dialogs.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/resource-dialogs.ts), [resource-setup.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/resource-setup.ts), [derived.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/derived.ts).

Eksisterende relevante testsuiter: [workflows.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/workflows.test.ts), [workflows.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/workflows.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål før Klar-status

- Godkjenner du én samlet bekreftelse for Hit Dice, valgfritt HP-tillegg og gjenoppretting, eller skal HP fortsatt bekreftes uavhengig?
- Skal en kort hvile kunne fullføres uten å føre Hit Dice/HP, bare for å oppdatere relevante beholdninger? Forslag: ja.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-19

**[#43 – Gjøre backup-påminnelsen avhengig av faktiske endringer](https://github.com/geirskoglund/dnd-character-sheet/issues/43)**

**Status:** Klar for implementasjon

Påminnelse etter faktiske endringer over tid er kravsatt. Eksisterende syvdagersgrense kan beholdes uten ny produktavgjørelse.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Arbeidsflyt og omfang

1. Behold dagens diskrete syvdagersvindu, men kontroller også om lagrede karakterdata er endret siden siste vellykkede backupgenerering.
2. Eksport markerer bare det som faktisk var med i backupen som dekket. Ny endring etter eksport gjør arket usikret igjen; rene oppslag og no-op-lagring gjør det ikke.
3. Uten tidligere eksport brukes tidspunktet for den første reelle ikke-dekkede endringen som utgangspunkt. Feil ved eksport må ikke nullstille påminnelsen.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Eksporter; vent åtte dager uten karakterendring | Ingen påminnelse bare fordi kalenderen har gått. |
| Endre HP etter eksport; syvdagersvindu er utløpt | Diskret påminnelse vises ved passende oppstart/retur, uten å stjele fokus fra et skjema. |
| Ny karakter uten eksport; deretter favoritttab/søk og no-op | Vinduet starter ved faktisk lagret endring, ikke ved hvert besøk. Første dag gir ikke en ny masete advarsel. |
| Backupgenerering feiler eller en annen fane endrer data under eksport | Ikke marker de ueksporterte endringene som sikkerhetskopiert. |
| Importer eller endre/kopier/slett karakter, flere faner | Påminnelsens grunnlag kan ikke miste nye lokale endringer. Selve tegnene/loggen/utkastene endres ikke av påminnelsen. |

### Må bevares og avgrenses

Ingen automatisk skybackup, blokkerende modal eller løfte om at en startet nedlasting er skrevet til telefonens disk. Hold teknisk dirty-markering adskilt fra karakterens spillhistorikk.

### Berørte områder og regresjonsgrunnlag

Kode/data: [main.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/main.ts), [database.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/storage/database.ts), [backup.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/storage/backup.ts).

Eksisterende relevante testsuiter: [storage.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/storage.test.ts), [characters.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/characters.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål

Ingen uavklarte produktvalg identifisert innen dette omfanget. Ny faktisk motstrid må avklares, ikke løses ved å droppe et krav.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-20

**[#44 – Levere sammensatt «Ta skade», som én etterprøvbar spillerflyt](https://github.com/geirskoglund/dnd-character-sheet/issues/44)**

**Status:** Trenger produktavklaring

Det funksjonelle beregningskravet er vedtatt. Den enkle skjermflyten og valgene for ukjente vilkår må avklares før den store kalkulatoren kodes.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Forslag til arbeidsflyt – ikke godkjent

1. Forslag: Ta skade åpner én skadepost med beløp/tallhjul og skadetype; + legger til en ny. Vis relevante kilder med hver sin avkryssing og synlig vilkår.
2. Kjente gyldige effekter velges, ukjente vilkår må bekreftes. Midlertidige DM-overstyringer gjelder bare hendelsen. Vis etterprøvbar breakdown og kort DM-oppsummering.
3. Oppdater HP bekrefter alle komponenter/temp HP/HP som én operasjon. Åpning, preview og avkryssing endrer ikke karakteren.

Scenariene er akseptanseforslag til den uavklarte flyten; de vedtar ingen nye produktvalg.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| 5 fire med resistance, vulnerability, begge, immunity | Resultat2,10,4,0 henholdsvis etter2014-ordre/avrunding; kilder vises separat. Flere resistances halverer ikke gjentatte ganger. |
| 10 slashing +5 fire; kun fire resistance; temp HP 4, HP 20 | Delsummer10+2=12; tempHP blir0, HP blir12. Breakdown forklarer hvert ledd. |
| 10 slashing,2014 HAM−3, kvalifisert heavy armor og ikke-magisk angrep bekreftet | 7 før eventuell resistance. Ukjent/avvist ikke-magisk-vilkår gir ikke automatisk−3. Hendelses-/komponentscope må kildeverifiseres, ikke multipliseres blindt. |
| DM har allerede regnet inn en effekt | Spilleren kan slå av bare den effekten for hendelsen; permanent defense eller feature endres ikke. |
| 0 HP, temp større enn skade, feil/retry og Angre | Ingen negativ HP, ingen dobbeltføring; hele bekreftede hendelsen kan angres samlet. |

### Må bevares og avgrenses

Krav §4 og DATA_MODELs skade-kontrakt gjelder i sin helhet. Sliderbeskrivelsen er historisk; bruk gjeldende tallkontroll. Ingen AC-treffsjekk, automatisk Uncanny Dodge eller generell simulator.

### Berørte områder og regresjonsgrunnlag

Kode/data: [hp-control.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/hp-control.ts), [model.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/model.ts), [derived.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/derived.ts), [item-effects.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/item-effects.ts), [database.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/storage/database.ts).

Eksisterende relevante testsuiter: [derived.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/derived.test.ts), [item-effects.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/item-effects.test.ts), [foundations.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/foundations.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål før Klar-status

- Godkjenner du én samlet skadeflate med komponenter, synlige effekter og løpende resultat, fremfor en lang veiviser med ett spørsmål per skjerm for beregningen?
- Skal et ukjent vilkår bekreftes direkte på den aktuelle effektlinjen før medregning, med mulighet til å slå effekten av for denne hendelsen? Forslag: ja, i tråd med det vedtatte beregningskravet.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-21

**[#45 – Dekke flere reelle spellkilder uten å skjule gyldige valg](https://github.com/geirskoglund/dnd-character-sheet/issues/45)**

**Status:** Trenger produktavklaring

Alle reelle tilgangskilder skal kunne beholdes. Flere item-/art-/featgrenser krever et valgt registreringsmønster, særlig ved egne begrensninger og brukstellere.

**Avhengigheter:** [#34](https://github.com/geirskoglund/dnd-character-sheet/issues/34).

### Forslag til arbeidsflyt – ikke godkjent

1. Forslag: en strukturert, valgfri spelltilgang kan knyttes til feature/art/item, med sikre spellvalg/klasseliste, nivå, ability og eventuell egen bruksteller.
2. Tilgangskildene danner en union med klassevalg. En fritekst-itemevne uten spellkobling skal fortsatt være gyldig og enkel.
3. Skill velg/lær, registrert innhold og bruk. Ingen spellslots tildeles bare fordi en feature/ting gir en cantrip.

Scenariene er akseptanseforslag til den uavklarte flyten; de vedtar ingen nye produktvalg.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Wizard får en cantrip fra en egen feat med annen ability | Begge kildene er tilgjengelige; riktig kilde/ability følger instansen, og skolefilter skjuler ikke gyldige valg. |
| Tiefling ved totalnivå 1/3/5 | Sikre medfødte tilgangsgrenser følger totalnivå uten nye klasse-slots. Ikke skjul annen registrert tilgang. |
| Item gir en spell én gang per short rest | Samme valgfri pool brukes ved føring; ikke både separat itemteller og nye spellslots. Ren tekstregistrering må fortsatt være mulig. |
| Legg item bort, fjern en kilde eller gå ned i level | Tidligere registrert spell/data slettes ikke. Eventuell brukskonsekvens vises uten å endre andre kilders tilgang. |

### Må bevares og avgrenses

Ingen proprietær feat-/subclasskatalog, prosatolkning eller obligatorisk spellkobling. #34 gir felles castingberegning; artsvalg må samordnes med #49.

### Berørte områder og regresjonsgrunnlag

Kode/data: [magic.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/magic.ts), [model.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/model.ts), [library-picker.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/library-picker.ts), [guided-records.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/guided-records.ts).

Eksisterende relevante testsuiter: [workflows.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/workflows.test.ts), [workflows.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/workflows.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål før Klar-status

- Skal valgfri strukturert spelltilgang føres under den givende gjenstanden/egenskapen, eller primært fra Magi med valg av kilde? Forslag: samme data, én tydelig hovedinngang.
- Hvordan skal en item-gitt spell med egen bruksteller føres fra oppslaget uten å innføre automatisk casting/slotforbruk? Vis ett konkret flytforslag før kode.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-22

**[#46 – Gjennomgå behov for tredjedels-caster-/andre klasseregler](https://github.com/geirskoglund/dnd-character-sheet/issues/46)**

**Status:** Trenger produktavklaring

Dette er en avklaringsoppgave, ikke en ordre om å implementere alle boksubclasses. Eksisterende manuell føring må være tilstrekkelig i mellomtiden.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Forslag til arbeidsflyt – ikke godkjent

1. Lag en kort sammenligning av dagens manuelle oppsett og en mulig avgrenset tabellstøtte for tredjedels-castere.
2. Avklar hvilke konkrete2014-varianter som faktisk skal støttes og hvilket lisensiert grunnlag som kan distribueres. Ikke legg inn proprietary regeltekst.
3. Dokumenter et godkjent omfang før en eventuell implementasjonstråd starter.

Scenariene er akseptanseforslag til den uavklarte flyten; de vedtar ingen nye produktvalg.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Egen Fighter-subclass med manuelt slotoppsett | Registreringen fungerer uten at appen gjetter Spellcasting fra et navn. |
| En fremtidig godkjent third-caster på nivå 3 og multiclass | Forventede slots/tilgang må utledes fra riktig2014-tabell og avrunding før tester skrives, ikke fra full-caster-tabellen. |
| Endre nivå med eldre manuell maks | Eksplisitte manuelle pools/navn/maks/spent-count bevares. Ingen duplisert automatisk pool. |

### Må bevares og avgrenses

Ingen appkode fra denne research-/beslutningsoppgave. Navnet Eldritch Knight eller Arcane Trickster er ikke tilstrekkelig grunnlag for å distribuere boktekst eller gjette regler.

### Berørte områder og regresjonsgrunnlag

Kode/data: [magic.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/magic.ts), [resource-setup.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/resource-setup.ts), [import-context.mjs](https://github.com/geirskoglund/dnd-character-sheet/blob/master/scripts/import-context.mjs).

Eksisterende relevante testsuiter: [workflows.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/workflows.test.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål før Klar-status

- Er manuelle slot-/tilgangsoverstyringer tilstrekkelig foreløpig, eller ønsker du automatisk tabellstøtte for navngitte konkrete tredjedels-castere?
- Hvis automatikk ønskes: hvilke2014-varianter prioriteres? Avklar datakilde/lisens før distribusjon.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-23

**[#47 – Redigere flere koblinger og nyttige egne aktivtilstander](https://github.com/geirskoglund/dnd-character-sheet/issues/47)**

**Status:** Trenger produktavklaring

Data kan representere flere koblinger og activeStates, men hvilke aktive tilstander som er nyttige og hvor de føres er ikke valgt.

**Avhengigheter:** [#39](https://github.com/geirskoglund/dnd-character-sheet/issues/39).

### Forslag til arbeidsflyt – ikke godkjent

1. Forslag: rediger flere navngitte handlinger/pools/effekter under sin eier; vis kilde og hvilke andre poster som deler dem.
2. Prøv én konkret egen tilstand, eksempelvis Rage, som valgfri markering på sin feature. Den skal ikke bli en generell tracker for eksterne buffs.
3. Fjerning av én kobling skal ikke slette en underpost som andre fortsatt eier/bruker.

Scenariene er akseptanseforslag til den uavklarte flyten; de vedtar ingen nye produktvalg.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Importert feat med to handlinger som deler én pool | Begge kan vises/redigeres; ingen kopi av poolen. Endring av én handling bevarer den andre. |
| Fjern eier A mens eier B fortsatt refererer til effekten | Overlevende referanse og nødvendig children består. ID-remapping ved kopi/backup/Angre er korrekt. |
| Egen aktiv Rage og ukjent ekstern buff | Ingen automatisk generell buffmotor eller tids-/turutløp. Eventuell beregning krever en særskilt uttrykkelig avgrensning. |
| Åpne/lukke og endre draft uten å fullføre | Bekreftede actions/effects og Combat er urørt. |

### Må bevares og avgrenses

Ikke begrens importerte modeller til én child ved UI-forenkling. Ikke bruk et generisk aktiv-flagg som sikker regel om at alle tilknyttede virkninger gjelder.

### Berørte områder og regresjonsgrunnlag

Kode/data: [model.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/model.ts), [records.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/records.ts), [record-editors.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/record-editors.ts).

Eksisterende relevante testsuiter: [records.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/records.test.ts), [storage.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/storage.test.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål før Klar-status

- Hvilken konkret egen aktivstatus er verdt å føre først, og skal den bare være en synlig markering eller påvirke bestemte verdier?
- Godkjenner du flerkoblingsredigering i feature-oversikten fra #39, med separate redigerbare deler og tydelig delt kilde?

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-24

**[#48 – Utvide med ferdige SRD-magic-items](https://github.com/geirskoglund/dnd-character-sheet/issues/48)**

**Status:** Trenger produktavklaring

Fullt lokalt SRD-innhold er et opprinnelig krav. Første magic-itemleveranses innhold og forskjellen mellom oppslag og ferdige beregnede virkninger må være eksplisitt.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Forslag til arbeidsflyt – ikke godkjent

1. Forslag: tilby søkbare SRD-magic-items med regeltekst og konkrete grunnlag; kjente støttede virkninger fylles inn, andre beholdes som fritekst/valgfrie tellere.
2. Katalogvalget lager en uavhengig instans. Attunement, I bruk, tekst, beskyttelser og bruksteller følger samme nye utstyrsflyt.
3. Standard Forbruk/potions i #30 skal ikke måtte vente på hele magic-itembiblioteket.

Scenariene er akseptanseforslag til den uavklarte flyten; de vedtar ingen nye produktvalg.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Amulet of Health med CON 14 og senere20 | Kildens minst19 viser19/20 ved korrekt bruk/attunement; grunnscore endres ikke. |
| Cloak og Ring of Protection sammen med armor/skjold | Eksisterende AC-/save-bidrag og ikke-stabling av identiske katalogkilder bevares. |
| Item med kompleks handling eller egen recharge | Tekst og tellemulighet er ærlige; ikke vis en usupportert effekt som automatisk beregnet. |
| Offline direktevalg, egen variant, backup/kopi | Samme item kan tilpasses uten å endre katalog eller andre karakterer; lisens/kilde er lokale. |

### Må bevares og avgrenses

Ingen proprietary magic items eller automatiske kaste-/forbrukseffekter fra prosatekst. Et navn alene er ikke et ferdig magisk objekt.

### Berørte områder og regresjonsgrunnlag

Kode/data: [catalog.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/catalog.ts), [import-srd.mjs](https://github.com/geirskoglund/dnd-character-sheet/blob/master/scripts/import-srd.mjs), [item-effects.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/item-effects.ts), [equipment-picker.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/equipment-picker.ts).

Eksisterende relevante testsuiter: [item-effects.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/item-effects.test.ts), [item-effects.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/item-effects.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål før Klar-status

- Skal første leveranse prioritere hele SRD-listen som gode oppslag med sikre støttede virkninger, eller et mindre fullt kuratert utvalg først? Hele SRD-kravet beholdes uansett.
- Hvordan skal en kjent, men ikke automatisk støttet virkning merkes, så vanlig bordføring fortsatt er enkel og ingen tror den er medregnet?

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-25

**[#49 – Fullføre relevant art-/underart-/valginnhold](https://github.com/geirskoglund/dnd-character-sheet/issues/49)**

**Status:** Trenger produktavklaring

Manglende traits/underarter skal dekkes, men utvidelsen må bevare enkel opprettelse og unngå automatisk ombygging av eksisterende karakterer.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Forslag til arbeidsflyt – ikke godkjent

1. Forslag: velg en presis artsvariant fra listen uten at opprettelsen viser lange trait-/speedforklaringer. Artsvalg som krever flere opplysninger kan fullføres i appen.
2. Fyll bare sikre artsoppslag/tilganger. Spilleren har allerede registrert endelige ability scores; ikke legg artsbonuser oppå dem igjen.
3. Eldre grunnart eller egne traits beholdes frem til en uttrykkelig endring med preview.

Scenariene er akseptanseforslag til den uavklarte flyten; de vedtar ingen nye produktvalg.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Ny High Elf og en eldre generisk Elf | Nye sikre traits/valg kan representeres; den eldre figuren får ikke en automatisk underart eller mistede egne poster. |
| Dragonborn med valgt ancestry og betinget breath/resistance | Riktig kilde og valgbetingelse vises; uavklart ancestry gir ikke en vilkårlig damage type. |
| Endelige DEX 16 allerede registrert; endre artsvariant | DEX forblir16 med mindre spilleren uttrykkelig korrigerer grunnscore. |
| Egen art med eget navn, speed, språk og featuretilgang | Ingen katalogoppgradering erstatter custom data eller skjuler gyldige spells. |

### Må bevares og avgrenses

Ingen full character builder eller automatisk rekonstruksjon av tidligere valg. SRD-versjon/attribusjon gjelder; andre bøkers artsvalg føres manuelt.

### Berørte områder og regresjonsgrunnlag

Kode/data: [catalog.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/catalog.ts), [character-form.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/character-form.ts), [magic.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/magic.ts), [records.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/records.ts).

Eksisterende relevante testsuiter: [foundations.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/foundations.spec.ts), [workflows.test.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/workflows.test.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål før Klar-status

- Skal underart føres som del av artslisten, eksempelvis Elf – High Elf, eller som et eget valgfritt valg etter grunnarten?
- Godkjenner du at nødvendige artsvalg som ancestry/cantrip fullføres inne i appen, slik at karakteropprettelsen fortsatt er minimal?

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-26

**[#50 – Fullføre lokalt SRD-regelbibliotek](https://github.com/geirskoglund/dnd-character-sheet/issues/50)**

**Status:** Trenger produktavklaring

Full SRD er vedtatt, men hvor regelkapitler/monstre slås opp og første leseflyt er ikke besluttet. Ny fane må ikke innføres på eget initiativ.

**Avhengigheter:** Ingen hard oppgaveavhengighet.

### Forslag til arbeidsflyt – ikke godkjent

1. Forslag: Meny → Regler/bibliotek åpner lokalt søkbart SRD 5.1-innhold med enkle kategorier for regler og monstre.
2. Dette er lesing/oppslag. Ingen encounter builder, monsterturner, statblock-instansiering eller VTT.
3. Før teknisk import lages en dokumentert innholdsfortegnelse og kilde-/lisensdekning. Hele opprinnelige kravet beholdes ved eventuell etappevis levering.

Scenariene er akseptanseforslag til den uavklarte flyten; de vedtar ingen nye produktvalg.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Offline oppslag på en2014-regel og et SRD-monster | Tekst, søk, kilde og tilbake/fokus virker uten runtime-API. |
| Åpne monster eller regel mens en karakter er valgt | Ingen karakterdata, HP, Combat-tur eller audit-hendelse opprettes. |
| Ikke-SRD navn/tekst etterspørres | Ikke distribuer proprietary innhold eller påstå full bokdekning. |
| 320/390px og stor tekst | Regeltekst er lesbar og søkbar uten klipping; navigering tilbake mister ikke karakterens scroll. |

### Må bevares og avgrenses

Ingen ny global søk-/taleplattform er implisitt bestilt. Katalogoppslag til Character/Magi/Utstyr må fortsatt være direkte og relevante.

### Berørte områder og regresjonsgrunnlag

Kode/data: [import-srd.mjs](https://github.com/geirskoglund/dnd-character-sheet/blob/master/scripts/import-srd.mjs), [catalog.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/domain/catalog.ts), [library-picker.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/library-picker.ts), [main.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/main.ts).

Eksisterende relevante testsuiter: [characters.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/characters.spec.ts), [workspace.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/workspace.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

### Produktspørsmål før Klar-status

- Godkjenner du en egen Regler/bibliotek-inngang i Meny fremfor en ny bunnfane?
- Skal monstre inngå som rene oppslag i samme leseflyt? Forslag: ja, i tråd med et lokalt SRD-bibliotek, uten kampadministrasjon.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## BL-27

**[#51 – Gjennomføre fysisk mobil-/tilgjengelighetskontroll av relevante flyter](https://github.com/geirskoglund/dnd-character-sheet/issues/51)**

**Status:** Avventer avhengighet

Kontrollmålet er avklart. En fysisk iPhone og et konkret kandidatbygg må være tilgjengelig; ingen emulering kan erstatte det.

**Avhengigheter:** [#26](https://github.com/geirskoglund/dnd-character-sheet/issues/26), [#28](https://github.com/geirskoglund/dnd-character-sheet/issues/28). Krever i tillegg tilgang til fysisk iPhone og et navngitt kandidatbygg; appen gir ingen slik testtilgang automatisk.

### Arbeidsflyt og omfang

1. Avtal testtilgang og noter fysisk enhet, iOS/browser, installert modus, aktuell commit og testdata før kontrollen.
2. Prøv vanlige arbeidsflyter med tallhjul, tastatur, wizard, meny, safe area, oppdatering og offline. Sammenlign Safari/Chrome-fane og installert app.
3. Registrer observerte feil med reproduksjon og forventning på berørt Issue. Behold utestede situasjoner eksplisitt; en rapport uten fysisk enhet er bare en testplan.

### Akseptansescenarioer – forventninger, ikke kjørte tester

| Situasjon | Forventet resultat |
| --- | --- |
| Oppdatert tallhjul fra #25/#26 | Test én-trykks åpning/lukking, valgt midtrad, scrollmomentum, tall0 og neste knapp på fysisk iPhone. |
| Lavere meny fra #28, portrett og lange piller | Ingen innhold under home-indikator, utilgjengelig meny eller utilsiktet fokuszoom; tilgjengelig pinch-zoom skal fortsatt virke. |
| VoiceOver og stor tekst/eksternt tastatur der tilgjengelig | Navn, fokusrekkefølge, verdier og modalretur er forståelige. Manglende utstyr/tilgang merkes utestet. |
| Backup av testdata, offline, gjenåpning og oppdateringsvalg | Ingen ekte karakterdata slettes for feilsøking. Beskyttet redigering og lagrede data bevares. |

### Må bevares og avgrenses

Dette er kontrollarbeid, ikke en generell redesignbestilling. Ikke lukk alle mobilavvik samlet bare fordi en enkelt enhet eller én skjerm er prøvd.

### Berørte områder og regresjonsgrunnlag

Kode/data: [CHARACTER_WORKSPACE.md](https://github.com/geirskoglund/dnd-character-sheet/blob/master/docs/CHARACTER_WORKSPACE.md), [UPDATES.md](https://github.com/geirskoglund/dnd-character-sheet/blob/master/docs/UPDATES.md), [number-wheel.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/ui/number-wheel.ts), [style.css](https://github.com/geirskoglund/dnd-character-sheet/blob/master/src/style.css).

Eksisterende relevante testsuiter: [design.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/design.spec.ts), [updates.spec.ts](https://github.com/geirskoglund/dnd-character-sheet/blob/master/tests/e2e/updates.spec.ts). Nye forventninger over må prøves uttrykkelig; eldre grønne tester er ikke dekning i seg selv.

**Leveringsport:** Fysisk iPhone/standalone må prøves før denne delen kan kvitteres ut. Registrer manglende tilgang som utestet; ikke erklær den løst på bakgrunn av Chromium.

### Produktspørsmål

Ingen uavklarte produktvalg identifisert innen dette omfanget. Ny faktisk motstrid må avklares, ikke løses ved å droppe et krav.

**Bestillingsgrense:** Klargjøring og Klar-status er ikke en kodebestilling. Implementasjon starter først når den konkrete oppgaven uttrykkelig bestilles.

## Kontroll av klargjøringen

Denne leveransen endrer dokumenter og GitHub-oppgavebeskrivelser/merker. Den endrer ingen appkode og gjennomfører ingen av de27 implementasjonene. Kontroller struktur, avhengigheter, kilde-/testfilhenvisninger, at alle27 opprinnelige oppgaver er bevart, og at ingen Klar-oppgave har åpne produktspørsmål eller utestående harde avhengigheter. Verifiser oppdaterte Issues mot tekst og merker. D&D-scenarioene er planlagte akseptanseforventninger; nye spill-/nettlesertester kjøres først ved den faktiske implementasjonen.

Utført tekstkontroll før levering:27 unike oppgaver,9/16/2-status, 112 konkrete akseptansescenarioer, gyldige eksisterende kilde-/testfilhenvisninger,458 lokale lenker/ankere og152 GitHub-kildelenker i produktdokumentene. Avhengighetsgrafen har ingen syklus; ingen Klar-oppgave har åpne produktspørsmål eller harde oppgaveavhengigheter. Originale Issue-tekster beholdes ved oppdateringen. `git diff --check` passerer. Nye D&D-funksjoner eller fysisk mobilatferd er ikke testet av denne dokumentkontrollen.
