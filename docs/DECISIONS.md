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
- **Tale som valgfritt oppslag (ny beslutning):** Behold muligheten til å bruke mikrofonen for å søke etter f.eks. «Perception» og få opp modifieren. Vanlig søk med autofullføring og synlige favoritter er fortsatt primærløsningen. Det skal ikke kreve at man snakker høyt for vanlige oppslag.
- **Ingen talestyrte endringskommandoer:** HP, penger, spell slots og andre ressurser oppdateres diskret via berøring. Skill tydelig mellom taleoppslag og talebetjening av karakterens tilstand. Talegjenkjenning kan være avhengig av plattform/nett; alltid tekstfallback.

### Ressurser og registrering
- Registrer kun *begrensede* ressurser som har praktisk behov for telling (spell slots, begrensede class features, ammo/forbruksvarer ved behov), samt HP og penger.
- Bruk én felles domenetanke om økning/reduksjon/gjenoppretting, **men korrekt og ressurs-spesifikk regelhåndtering**. En kommando er ikke alltid ren aritmetikk.
- Direkte «bruk»-knapp der evnen/spellen presenteres, med automatisk reduksjon av riktig ressurs og enkel **Angre**.
- **Short Rest** og **Long Rest** skal være enkle handlinger og gjenopprette riktige ressurser etter 2014-reglene. Short rest og Hit Dice krever egnet brukerinput; spesialregler må modelleres.
- **HP-interaksjon (foreløpig valgt for prototype):** Slider sentrert på 0 som angir *endring*, dra venstre for skade/høyre for healing. ±1-knapper for nøyaktig finjustering. Dynamisk område etter karakternivå/størrelse på HP. Vis endringen før den registreres; ha Angre.
- Skade («ta bort X HP») går først mot temporary HP, deretter vanlige HP. Healing («legg til X HP») øker vanlige HP, ikke temporary HP, opp til max HP. Temporary HP legges normalt ikke sammen (5e 2014); velg korrekt regelhåndtering.
- **Spell slots og begrensede evner:** Enkle ±1-knapper eller én «bruk»-knapp; ingen slider der.
- **Penger (besluttet):** GP er fast standardenhet i grensesnittet, vises med **to desimaler**. Saldo relativt høyt i Character. Trykk saldo → lite beløpsfelt og +/− samt Angre. Ingen myntvelger i vanlige transaksjoner. Oppbevar verdier som heltall CP internt for eksakt regning; omregning til andre mynter kan håndteres ved behov. Ikke press slider på pengebeløp.


### Utstyr, AC og spesialeffekter (besluttet 2026-10-17)
- Skille mellom **eid** og **utstyrt** utstyr. Kun aktivt/relevant utstyr skal påvirke beregninger og Combat.
- Rustning: AC etter type, Dexterity-begrensninger, skjold og eventuelle magiske bonuser; håndter relevante begrensninger (f.eks. proficiency) og spesialregler.
- Våpen: attack bonus, skadeuttrykk, damage type, properties, proficiency, bruksvarianter og magiske bonuser.
- Magiske våpen/rustninger/gjenstander: egne effekter, aktive/passive bonuser, charges, bruk og recharge. Handlinger fra utstyret skal dukke opp under riktig Action/Bonus Action/Reaction i Combat.
- Egenskaper og effekter lagres strukturert når mulig, med fritekst for særegne effekter. Unngå å la utstyrsinformasjon bli en isolert inventarliste.
- **Viktig integrasjonskrav:** Combat er én samlet handlingsmeny. Handlinger/reaksjoner som gis av utstyrt våpen, armor, shield eller magiske gjenstander, vises automatisk under riktig **Action / Bonus Action / Reaction / Other** sammen med klasse-, feat- og spellhandlinger. Ved equip/unequip oppdateres menyen. Passive effekter påvirker beregnede verdier eller vises som passive, ikke som falske handlinger. Betingede og ressursbegrensede effekter merkes tydelig; ikke lag en separat meny som brukeren må lete i for utstyrsevner.
- Dette skal demonstreres i neste énfil-HTML-prototype med fungerende eksempler, uten å bygge en komplett regelmotor.

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
- Om mikrofonoppslag tas inn i første prototype eller først i robust app; funksjonen er ønsket, men nettleserstøtte/offline og engelsk/norsk D&D-transkripsjon må testes.

## Historikk / beslutningsendringer
- Først vurdert taleoppslag og talekommandoer («legg til / ta bort X Y»). Deretter ble all tale utsatt av hensyn til immersion og kompleksitet. **Ny avklaring:** Valgfritt taleoppslag (f.eks. «Perception») er ønsket; talekommandoer som endrer ressurser er fortsatt ute. Favoritter og vanlig søk beholdes.
- Først vurdert avkryssing av action/bonus action/reaction og movement-tracking. **Forkastet:** Combat skal vise *muligheter*, ikke en turtracker.
- Først foreslått én felles inputmekanisme for alle ressurser. **Revidert:** Ressurstypen avgjør egnet UI: HP-slider + finjustering, penger desimalinput i GP, begrensede evner ett trykk.
- Først utviklet en enkel GitHub Pages-PWA. Brukeren opplevde at den manglet mye av den avtalte funksjonaliteten. Ikke behandle eksisterende implementasjon som autoritativ kravspesifikasjon.


## Tilbakemelding etter første gjennomgang av prototype v0.2 (2026-10-17)

**Prioriteres i neste prototype – brukerens observasjoner:**
1. **Penger:** Kompakt saldo-brikke på størrelse med HP/AC; trykk åpner popup med GP-beløp, +/− og angre. Ikke ha hele redigeringspanelet synlig.
2. **HP:** Kompakt HP-brikke; trykk åpner popup med endringsslider, finjustering, temp-HP og angre. Ikke vis hele kontrollen permanent.
3. **Oppslag:** Flytt favoritter/hurtigoppslag høyere opp, frigjort av kompakte brikker. Vurder om søkefelt skal være permanent eller åpnes ved behov – **åpent UX-spørsmål**.
4. **Sjeldne handlinger:** Level Up og Bytt karakter skal ikke oppta toppareal; flyttes til meny/administrasjon.
5. **Utstyr:** Hindre ugyldige samtidige kombinasjoner av våpen/skjold; modellér håndbruk (én hånd/to hender) og relevante 2014-regler. Muligheter for å trekke, bytte og håndtere våpen i combat skal vises med korrekt action economy (ikke anta at alle bytter alltid koster en Action; objektinteraksjon og situasjon avgjør).
6. **Navigasjon:** Bevar scrollposisjon **separat for Character og Combat** når man veksler mellom dem.
7. **Combat-liste:** Mye kortere linjer/kort. Vis navn og essensiell status; trykk åpner popup/popover med full forklaring. Tydeligere visuell hierarki/kontrast mellom Action/Bonus Action/Reaction-overskrifter og handlingsalternativene.
8. **Ressursknapper:** Kall knappen **«Bruk»**, ikke «Bruk 1». Når beholdningen er null, skjul/deaktiver bruksknappen og vis tydelig «oppbrukt», men **behold evnen i listen**.
9. **Action economy – endret beslutning:** Brukeren ønsker nå at bruk av en Action, Bonus Action eller Reaction faktisk kan registreres, og at «Ferdig med tur» gjør relevante turressurser klare til neste runde. Når en handling brukes, markeres tilsvarende handlingstype som brukt. **Dette overstyrer tidligere beslutning om ingen action-avkryssing/tursporing.** Avklar nøyaktig reset-semantikk for Reaction (2014: gjenopprettes ved starten av neste tur) og støtte for unntak som Action Surge, Extra Attack og actions uten ressurskostnad. Løsningen bør utløses av trykk på selve handlingen, ikke ekstra avkrysningsfelt, og bør ikke spore movement/rundekart.


10. **DM har siste ord (besluttet):** Appen skal aldri forhindre at spilleren registrerer eller gjennomfører en handling, verken den normalt er lovlig eller ulovlig etter reglene. Den kan varsle om regelkonflikt, oppbrukt Action/Bonus Action/Reaction, ugyldig utstyrskombinasjon eller manglende ressurser, men skal tillate overstyring uten tungvint prosess. Bruk av «Bruk» og turstatus er veiledning, ikke håndhevelse; eventuell overstyring og angre må være enkel. Dette presiserer også punkt 5 om utstyrsvalidering: **advar, ikke blokker**.

**Fortsatt åpent:** Hvor mye automatikk for turstatus skal være aktivert, og hvordan «Ferdig med tur» håndterer reaksjoner brukt utenfor egen tur, uten å gjøre appen tungvint.


## Gjennomgang av prototype v0.3 (2026-10-18)

Tilbakemeldinger og foreslått løsning for neste prototype (ikke implementert ennå):

1. **Ferdig med tur:** Plasseringen øverst til høyre er lite naturlig. Flytt den til etter handlingsalternativene; vurder diskret sticky knapp hvis det reduserer scrolling uten å stjele plass.
2. **Kollapsbare grupper:** Action, Bonus Action, Reaction og andre relevante grupper kan åpnes/lukkes ved å trykke overskriften. Bevar tilstanden ved fanebytte.
3. **Spellcasting-popup:** Erstatt dropdown for spell-slot-nivå med små valgkort/chips. Valgt nivå aktiverer «Bruk/Cast». Kompakte knapper.
4. **Generelle handlinger:** Ikke egen løsrevet bunnliste. Vis generelle handlinger *etter karakterspesifikke handlinger innen riktig kategori*. Merk 2014-reglene: Dash, Dodge, Disengage m.fl. bruker normalt Action; Jump inngår normalt i movement, enkelte objektinteraksjoner er gratis.
5. **Hurtigoppslag:** Sikt på fire små kort i bredden, slik status- og ability-scorekortene bruker plassen effektivt. Forkort labels eller tilpass typografi for lange skillnavn.
6. **Utstyr:** Skill **Armor** og **Weapons**, vis equipped før unequipped, og sikt på fire kort i bredden på relevante mobilbredder. Bevar støtte for automatiske handlinger/effekter fra utstyr.
7. **Arcane Recovery:** En gang per spilledag når wizard fullfører short rest, ikke automatisk basert på virkelige døgn. Appen skal ikke gjette hvor mange spilledager som har gått. Avklar UX for eksplisitt «ny spilledag» eller DM-styrt reset, og vis mekanikken forståelig.
8. **Level Up:** Hører til karakterens progresjon, ikke sammen med rent teknisk administrasjon som import/eksport eller bytte karakter.
9. **Feats:** Relevante aktive feats og avledede handlinger skal være synlige i riktig Combat-kategori; passive feats skal påvirke relevante verdier/angrep eller vises kontekstuelt. Unngå en ukritisk full feat-liste i Combat.
10. **Generell layout:** Fortsatt for mye fullbreddeinnhold. Prioriter kompakte kort, tydelig hierarki og detaljer ved trykk. Merk at fire kolonner må testes for lesbarhet og treffflater på små mobiler.

Status: Tilbakemelding ferdig. Ingen v0.4 bygget ennå.


## Designavklaring etter v0.6 (2026-10-18)
- **Combat-faner:** Når «Action», «Bonus», «Reaction» eller «Other» allerede vises i fanelinjen, skal samme navn **ikke gjentas som overskrift** i innholdspanelet. Fjern også redundant teller for antall alternativer. Vis handlingskortene direkte under fanelinjen, med tydelig, men kompakt visuelt skille.


## Videre testdekning – våpen (2026-10-18)
- Legg til demonstrasjon av **dual wielding** (ett våpen i hver hånd), inkludert Bonus Action-angrep og relevante 2014-regler, og **tohåndsvåpen** (f.eks. greatsword) med korrekt håndbruk/equip-validering. Test også at Combat viser handlingene riktig ved bytte av utstyr. Foreløpig eksempelkarakterutvalg mangler disse kombinasjonene.

## Vedlikehold
Oppdater denne filen når et designvalg blir tatt eller omgjort. Marker tydelig **besluttet**, **foreløpig** og **åpent**, og legg vesentlige omgjøringer i historikken. Denne filen er kilden til prosjektbeslutninger på tvers av chat-komprimering og kan deles med Codex.


## Produktavklaring – digitalt papirark (2026-10-18)
- **Primærmål:** Erstatte papirkarakterarket med et oversiktlig, raskt og manuelt redigerbart digitalt ark; **ikke** lage en helautomatisk D&D-regelmotor eller karakterbygger.
- **Level-up:** Kan gjennomføres manuelt med DM. Brukeren skal kunne endre level, verdier, spell slots, spells, features, feats og utstyr direkte, uten at appen må utlede alle regelkonsekvenser.
- **Automatisering:** Kun som praktisk hjelp når den er enkel, forutsigbar og pålitelig (f.eks. ability modifiers). DM og spilleren har autoritet over verdiene; automatiske beregninger må ikke blokkere manuelle justeringer.
- **Combat:** Rask oversikt/ressursstyring snarere enn full validering og håndheving av regler.
- **Evaluering av alternativer:** Vektlegg redigerbarhet, oversikt, mobilbruk og fart over automatisert karakterbygging/level-up.


## Combat-forenkling – oppslagsverk, ikke turstyrer (2026-10-18)
- Combat viser alle relevante **Action / Bonus Action / Reaction / Other** som en lett tilgjengelig oversikt over hva karakteren kan gjøre.
- Fjern «Bruk» på ordinære handlinger, markering av brukt action/bonus/reaction og «Ferdig med tur»; ingen turstyring.
- Trykk på handlingen viser detaljer/regler/terningkast.
- **Kun begrensede ressurser registreres som brukt**, med enkel avkryssing. Ved flere bruk vises tilsvarende antall bokser/teller. Relevant short/long rest tilbakestiller ressurser.
- Avkryssing må også kunne oppheves manuelt; DM og spiller styrer.


## Lagringsbeslutning – lokal database (2026-10-18)
- Velg **IndexedDB** som lokal database i nettleseren for karakterdata og ressursstatus; GitHub Pages brukes fortsatt som statisk hosting, uten backend.
- Behold **eksport/import av JSON** for sikkerhetskopi og flytting mellom enheter. Lokal nettleserlagring er ikke automatisk synkronisert eller en sikkerhetskopi.
- Server/synkronisering er ikke del av første versjon; kan vurderes senere. Offline PWA-støtte kan bygges med service worker/cache separat fra databasen.


## Design og datamodell – avklart (2026-10-18)
- Brukeren bekrefter: enkle modifiers beregnes automatisk, **manuell overstyring alltid mulig**; egne handlinger/ressurser/effekter/notater kan opprettes og redigeres; eksisterende karakterer kan registreres direkte, uten level-1-veiviser.
- Videre UX: **kompakt, rask, mobilførst**, men også visuelt inspirerende og karakterfullt; ikke bare funksjonelt dashboard.
- Codex kan foreslå og implementere visuell utforming, men skal følge godkjent funksjonell UX og eksplisitt designretning. Vurder 2–3 alternative visuelle retninger på samme Character- og Combat-skjerm før én velges. Unngå overdreven ornamentikk og tap av lesbarhet.


## Valgfritt karakterportrett (2026-10-18)
- Spilleren kan laste opp et eget bilde som karakterportrett fra mobil eller PC.
- Vis portrettet kompakt ved karakteridentiteten uten å fortrenge viktige verdier; trykk for større visning/bytt/fjern.
- Lagre bildet lokalt i IndexedDB; sørg for at JSON-sikkerhetskopi kan inneholde portrettet (med hensyn til filstørrelse).
- Portrettet er frivillig; appen skal fungere like godt uten bilde. Inkluder dette i Codex-designbriefen.


## Evaluering av v0.8 (2026-10-18) – innspill, ikke ferdigspesifisert
- Tomt/uforklart felt eller knapp observert i v0.8; må lokaliseres og fjernes/rettes.
- Brukeren foreslår at **Bakgrunn og fritekst** erstattes med vilkårlig mange notater, hvert med overskrift og tekst, vist som kompakte piller. Bakgrunn kan være et vanlig notat. Dette er ønsket retning.
- Brukeren vurderer om språk, proficiencies og resistances også kan vises som piller; fortsatt uavklart. Anbefaling: språk som strukturert liste, proficiencies og resistances som strukturerte egenskaper, gjerne med pillevisning, ikke bare fritekst.
- **Egne handlinger og ressurser** i v0.8 oppleves som gode; behold konseptet.
- Uklar vei til å legge til **egne feats**; neste versjon bør ha tydelig «Legg til feat» med fri redigering og valgfri kobling til handling/ressurs.
- Saving throws og modifiers behøver ikke gjentas i Combat; Character er ett fanetrykk unna.
- **Action Surge** ligger under Other: teknisk korrekt at evnen ikke koster Action/Bonus Action, men «Other» er ikke en egen rundedel. Forslag til vurdering: endre fanen til «Features» for passive/spesielle egenskaper; de tre øvrige fanene er Action, Bonus og Reaction. **Navnevalget er ennå ikke godkjent.**
- Videre testscenarier: Fighter våpenangrep + Action Surge + short rest; Wizard cantrip, leveled spell + slot-justering; dual wielding med bonus-angrep. Tohåndsvåpen viktig for regeldata, mindre for ny UX.
- Avvent v0.9 og Codex-kravspesifikasjon til bruker har vurdert videre.
