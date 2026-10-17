# Avklaringslogg – D&D Character Companion

**Sist oppdatert:** 2026-10-17  
**Status:** Produktavklaringer for konseptprototype; ikke fullstendig kravspesifikasjon.  
**Regler:** D&D 5e 2014, med mulighet for innhold fra *Eberron: Rising from the Last War*. Ikke bland automatisk inn 2024-reglene.

## Formål (besluttet)
En mobilvennlig, offline-først digital **karakterassistent** som reduserer tid og oppmerksomhet brukt på å finne relevant informasjon og administrere karakteren under bordspilling. Brukeren er relativt ny i D&D, kaster fysiske terninger, og vil konsentrere seg om spillet. Ikke en virtuell spilleleder eller komplett kampmotor.

**Styrende UX-prinsipp:** Minimer skjermtid og mental belastning, ikke bare antall trykk. Ikke krev at spilleren registrerer trivielle handlinger som DM allerede følger med på.

## Besluttede produkt- og UX-valg

### Navigasjon
- To hovedvisninger: **Character** og **Combat**.
- **Character:** Egenskaper, skills, saving throws, favorittoppslag/søk, spells og administrasjon, feats/class features, utstyr, penger og progresjon.
- **Combat:** Primært en **meny over hva karakteren kan gjøre**, gruppert etter **Action**, **Bonus Action**, **Reaction**, samt passende passivt/øvrig. Vis hva evnene gjør, vilkår, kostnader, og om begrensede ressurser er tilgjengelige.
- **Ikke** avkrysningsbokser for «Action brukt», «Bonus Action brukt», «Reaction brukt». **Ikke** registrering av tilbakelagt bevegelse, runder eller rutinemessige angrep.
- HP, AC og relevant informasjon skal være lett synlig, og pengebeholdning skal ligge relativt høyt i Character.

### Oppslag
- Søk i strukturerte karakter- og regeldata med autofullføring; ikke bare eksakt fritekst.
- Favoritter / ofte brukte modifiers (f.eks. Perception, Stealth, Insight) lett tilgjengelig.
- Mulighet for kategorisert oversikt over skills, saves, evner, angrep og spells.
- **Ingen talestøtte i første versjon** (besluttet). Tale kan forstyrre innlevelsen rundt bordet og øker kompleksiteten. Vi kan revurdere senere.

### Ressurser og registrering
- Registrer kun *begrensede* ressurser som har praktisk behov for telling (spell slots, begrensede class features, ammo/forbruksvarer ved behov), samt HP og penger.
- Bruk én felles domenetanke om økning/reduksjon/gjenoppretting, **men korrekt og ressurs-spesifikk regelhåndtering**. En kommando er ikke alltid ren aritmetikk.
- Direkte «bruk»-knapp der evnen/spellen presenteres, med automatisk reduksjon av riktig ressurs og enkel **Angre**.
- **Short Rest** og **Long Rest** skal være enkle handlinger og gjenopprette riktige ressurser etter 2014-reglene. Short rest og Hit Dice krever egnet brukerinput; spesialregler må modelleres.
- **HP-interaksjon (foreløpig valgt for prototype):** Slider sentrert på 0 som angir *endring*, dra venstre for skade/høyre for healing. ±1-knapper for nøyaktig finjustering. Dynamisk område etter karakternivå/størrelse på HP. Vis endringen før den registreres; ha Angre.
- Skade («ta bort X HP») går først mot temporary HP, deretter vanlige HP. Healing («legg til X HP») øker vanlige HP, ikke temporary HP, opp til max HP. Temporary HP legges normalt ikke sammen (5e 2014); velg korrekt regelhåndtering.
- **Spell slots og begrensede evner:** Enkle ±1-knapper eller én «bruk»-knapp; ingen slider der.
- **Penger (besluttet):** GP er fast standardenhet i grensesnittet, vises med **to desimaler**. Saldo relativt høyt i Character. Trykk saldo → lite beløpsfelt og +/− samt Angre. Ingen myntvelger i vanlige transaksjoner. Oppbevar verdier som heltall CP internt for eksakt regning; omregning til andre mynter kan håndteres ved behov. Ikke press slider på pengebeløp.

### Spells / evner
- Skill mellom **cantrips** (normalt uten slots), **spells**, **known/spellbook**, **prepared spells**, **spell slots** og **concentration**.
- Tilgjengelige spells og preparation-regler avhenger av **klasse**. Ikke alle klasser forbereder spells.
- Under Character: spelladministrasjon med tilgjengelige valg, kjent/spellbook, prepared og cantrips etter klassens regelmodell.
- Under Combat: vis tilgjengelige spells i riktig Action/Bonus Action/Reaction-gruppe med casting time, range, duration, concentration, effekter, spellnivå, ressurskrav, relevante terninguttrykk. Ved casting velges slotnivå når relevant, og riktig slot reduseres; cantrips krever normalt ingen registrering.
- Class features, racial traits og feats presenteres i samme handlingsoversikt som spells, men må beholde egne regeltyper og ressursmodeller.
- Vis forklaringer på relevante 2014-regler (bl.a. begrensninger ved bonus-action spellcasting) når nyttig, uten å forsøke å kjøre hele spillet automatisk.

### Progresjon og flere karakterer
- Flere karakterer.
- **Level Up:** Assistert veiviser som forklarer relevante endringer og valg, med så mye automatisk beregning som rimelig (HP, proficiency, features, ASI/feats, spells og slots). Sjeldne/komplekse prosesser kan godt bruke skjemaer og knapper, ikke tale.
- Karakter kan være uten campaign. Man kan **kopiere** en karakter til en annen campaign; kopiene utvikles **uavhengig**. Ikke bygg en stor flerbruker-/campaign-administrasjon nå.

### Teknologi og utviklingsprosess
- Mobile-first, offline, lokal data på enheten; eksport/import JSON for backup. Ingen påkrevd backend eller terninggenerator.
- En enkeltstående lokal HTML/CSS/JS-fil kan fungere som UX-prototype som testes uten deploy.
- For robust, versjonert app er **Codex i GitHub-repoet** bedre egnet for implementasjon, tester og refaktorering. Det er greit å restrukturere eksisterende kode.
- Tilgjengelige SRD 5.1-data bør importeres lokalt der lisensen tillater det; SRD ≠ hele Player's Handbook/Eberron. Ikke forutsett rett til å distribuere alt proprietært regelinnhold. Regelgrunnlag og karakterens lagrede data bør være separate.

## Åpne spørsmål / må testes (ikke besluttet)
- Hvor brukervennlig er HP-slideren på liten mobil, særlig ved større HP-verdier? Sammenlign med tastatur og alternative hurtigkontroller.
- Nøyaktig utforming og plassering av favoritter, globalt søk og alfabetisk/kategorisert oversikt.
- Hvilke regler, class/subclass-valg og Eberron-tillegg må støttes i første komplette versjon?
- Nøyaktig datamodell for multiclass, Pact Magic, spell preparation, concentration, Hit Dice, feats og spesielle rest-regler.
- Hvordan håndteres fysiske mynter hvis DM krever eksakt veksling eller mynttyper? Normal UX er GP-desimaler.
- Om «oftest brukt» skal foreslås automatisk eller bare administreres manuelt.
- Om man senere vil teste stemmestyring som valgfri snarvei; **ikke** med i v1.

## Historikk / beslutningsendringer
- Først vurdert taleoppslag og talekommandoer («legg til / ta bort X Y»). **Revidert:** Talestøtte droppes i første versjon av hensyn til immersion og kompleksitet.
- Først vurdert avkryssing av action/bonus action/reaction og movement-tracking. **Forkastet:** Combat skal vise *muligheter*, ikke en turtracker.
- Først foreslått én felles inputmekanisme for alle ressurser. **Revidert:** Ressurstypen avgjør egnet UI: HP-slider + finjustering, penger desimalinput i GP, begrensede evner ett trykk.
- Først utviklet en enkel GitHub Pages-PWA. Brukeren opplevde at den manglet mye av den avtalte funksjonaliteten. Ikke behandle eksisterende implementasjon som autoritativ kravspesifikasjon.

## Vedlikehold
Oppdater denne filen når et designvalg blir tatt eller omgjort. Marker tydelig **besluttet**, **foreløpig** og **åpent**, og legg vesentlige omgjøringer i historikken. Denne filen er kilden til prosjektbeslutninger på tvers av chat-komprimering og kan deles med Codex.
