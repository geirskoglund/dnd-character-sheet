# Karaktergrunnlag, beregnede verdier og spilltilstand

Denne rettelsen erstatter det flate opprettelsesskjemaet fra fase 1. Opprettelse registrerer identitet, art, nåværende klasse(r)/nivå, endelige ability scores, maksimal HP. Valg av kjent art viser ingen artsdetaljer eller speed i opprettelsen. Utstyrs-+ åpner søk og kategorifilter direkte; et katalogvalg legges til umiddelbart. Eget utstyr opprettes fra samme velger. Beregnet AC og walking speed forklares i menyens beregningsvalg. Totalt level er summen av klassenivåene. Det finnes ingen automatisk level-up eller rekonstruksjon av tidligere levels.

Maks HP registreres fra karakterarket: tidligere HP-kast, Constitution-endringer og særregler kan ikke utledes trygt bare fra nåværende klasse/nivå. En ny registrering starter med current HP = max HP og temp HP = 0. Endelige ability scores inkluderer allerede artsbonuser og ASI/feats; katalogvalget legger dem ikke på igjen. Dette er registrering av karakteren spilleren har, ikke en automatisk karakterbygger.

## Beregningskontrakt (2014)

- Uten rustning: 10 + Dexterity modifier.
- Light armor: rustningens base + Dexterity modifier.
- Medium armor: rustningens base + Dexterity modifier, med maks +2; negative modifiers beholdes.
- Heavy armor: rustningens faste AC uten Dexterity.
- Shield: egen bonus, normalt +2. Flere skjold stables ikke.
- Barbarian Unarmored Defense: 10 + DEX + CON uten rustning, skjold tillatt.
- Monk Unarmored Defense: 10 + DEX + WIS uten rustning og skjold.
- Alternative AC-formler summeres ikke. Ved Barbarian/Monk-multiclass må spilleren velge den Unarmored Defense karakteren faktisk fikk; man kan ikke tilegne seg egenskapen på nytt gjennom multiclass. Den vanlige AC-formelen er fortsatt et alternativ.
- Walking speed begynner med artens speed. Ukjent art gir ukjent speed, ikke et antatt 30 ft.
- Barbarian Fast Movement gir +10 ft fra Barbarian level 5 uten heavy armor.
- Monk Unarmored Movement gir +10/+15/+20/+25/+30 ft ved Monk level 2/6/10/14/18 uten rustning eller skjold.
- Heavy armor med uoppfylt Strength-krav gir −10 ft. Dwarven Speed unntar dette tapet.
- Bare utstyrt utstyr med antall større enn null brukes. Flere rustninger, flere skjold og tohåndsvåpen med skjold gir synlige advarsler, ikke lagringsforbud. Ved flere rustninger vises høyeste AC fra én rustning som eksplisitt fallback; oppsettet må avklares med DM.

## Katalog og egne data

`src/domain/catalog.ts` er et lokalt, kuratert utsnitt av SRD 5.1: ni grunnarter, tolv klassenavn med én SRD-subclass per klasse, vanlige rustninger/skjold. Den senere katalogutvidelsen omfatter også 237 utstyrsposter samt spells og klasseegenskaper. Artsoppslag viser et utvalg sammenfattede egenskaper og faste språk. Grunnarter er ikke en komplett modell av alle underarter eller valg. Ekstra språk, alle traits/proficiencies/spells og artsbestemte handlinger fylles ikke automatisk ut av dette utsnittet. Den senere Character-rettelsen har redigeringsflater for disse samlingene og en større lokal karakterkatalog; se [gjeldende status](CHARACTER_WORKSPACE.md). Automatisk tildeling og et komplett SRD-bibliotek gjenstår.

Katalogoppføringer instansieres som uavhengige karakterdata med kilde-ID; endring av én karakter endrer ikke katalogen eller en annen karakter. Egen art/underart registrerer navn og grunnfart. Egen klasse registrerer navn og klassenivå. Subclass velges fra en klasseavhengig liste, kan stå tomt eller registreres som egen subclass. Eksisterende fritekst-subclasses beholdes som egne valg; endring av klasse nullstiller subclass-valget for den raden. Egen rustning har en strukturert AC-profil med type, base, Dexterity-regel, Strength-krav og Stealth-egenskap. Eget skjold har egen bonus. Ukjente klasse-/artsegenskaper og andre effekter håndteres med eksplisitt manuell overstyring inntil deres regler modelleres.

Dette utsnittet beregner ikke automatisk alle klassenes og utstyrets effekter: eksempelvis Fighting Styles, Draconic Resilience, feats og midlertidige buffs må korrigeres manuelt foreløpig. Det gjøres ingen rustningsproficiency-, attunement- eller full utstyrsregelvalidering. Begrensningene skal ikke tolkes som ferdig oppfyllelse av hele REQUIREMENTS.md.

SRD-kilder og CC BY 4.0-attribusjon ligger i `public/SRD-LICENSE.txt`, som også caches offline og lenkes fra appen. Ingen proprietære arter eller boktekster distribueres.

## Spilltilstand og overstyringer

HP-pillens dialog i Combat har en endringsslider sentrert på 0, ±1, forhåndsvisning og eksplisitt bekreftelse. Skade tar temporary HP først, healing endrer bare current HP opp til maksimum. Lagret current HP over maksimum reduseres ikke av healing. En hendelse lagrer hele endringen og kan angres samlet. Dette er en vanlig HP-justering; damage types, resistance og den planlagte «Ta skade»-kalkulatoren er fortsatt en egen funksjon.

Temporary HP-pillens dialog erstatter den lagrede totalen; verdiene stables ikke automatisk. GP redigeres fra GP-pillen og lagres i heltall CP. Disse verdiene spørres det ikke om under opprettelsen. Identitets-/utstyrsredigering endrer ikke current eller temp HP.

Meny → Denne karakteren → «Beregninger og overstyringer» lar spilleren velge Unarmored Defense og korrigere AC/speed. Tomme overstyringsfelt betyr beregnet verdi. Aktive overstyringer merkes med forklaring og advarsel. Utstyrspiller skiller eid fra utstyrt. Trykk åpner én post for redigering av antall, utstyrt-status, notat og øvrige verdier, samt fjerning med bekreftelse. Inline + brukes bare til tillegg. Utstyr og andre samlinger på karakteren bevares.

## Versjoner og bevaring

Character og JSON-backup bruker nå `schemaVersion: 2`. IndexedDB versjon 3 migrerer karakterer og audit-snapshots atomisk. Versjon 1-backuper kan fortsatt importeres. Den gamle valideringskontrakten ligger frosset i `src/domain/legacy-model.ts`.

Tidligere manuelt lagret AC og speed bevares som aktive overstyringer; de kan ikke skilles sikkert fra bevisst registrerte verdier. Spilleren kan fjerne dem for å gå over til beregnet verdi. ID-er, noter, spells, utstyr, valg og historikk beholdes. En mislykket migrering avbryter hele databaseoppgraderingen. Testene kontrollerer både bevart historikk/undo, legacy-backup og rollback ved ugyldige data. Kopiering remapper ressurs-ID-er og deres referanser sammen med øvrige instans-ID-er.

## Arbeidsflate og manuell Level Up

All karakteradministrasjon er i «Meny». «Denne karakteren» finnes bare inne i menyen: rediger grunnlag, Level Up, beregningsvalg, endringslogg og angre. Bytt/opprett/kopier/slett og JSON import/eksport er gruppert under Karakteradministrasjon. Appversjon, lisens og oppdateringskontroll finnes også her. Menyen støtter tastatur og kan lukkes med Escape eller trykk utenfor.

Character har fem like store statusceller på én rad: HP, AC, Initiative, GP og Speed. HP er kun lesbar status der. Temporary HP og HP-endring finnes i Combat. Pillene i hver samling har samme form, ramme, bredde og høyde, inkludert inline +. Lange navn brytes; høyden tilpasses den lengste pillen i samlingen.

Level Up registrerer én ekstra level i valgt eksisterende klasse, eventuell subclass og **manuelt angitt ny samlet maks HP**. Feltet er tomt til spilleren angir verdien. Maks HP kan bli stående uendret, men reduseres ikke i denne flyten. Vanlig redigering tillater korreksjoner. Nåværende HP og temp HP beholdes: nivåøkning er ikke automatisk hvile/healing. Endringen logges atomisk og angres samlet. Multiclass med ny klasse registreres foreløpig via Rediger karakter. Nye spells/features/ressurser tildeles ikke automatisk.

## Modifieroppslag

Fire favoritter lagres per karakter og velges fra én alfabetisk liste med fullstendige navn. Ingen permanent søkeboks. Ability modifiers er `floor((score - 10) / 2)`. Skills og saves bruker karakterens strukturerte proficiency/expertise og eventuelle manuelle overrides; standard proficiency bonus er `ceil(level / 4) + 1`. Initiative og passive Perception støtter lagrede overrides. Ukjente favorittreferanser vises med «—» og kan erstattes, uten å slette data. Proficiency-/skill-redigering, situasjonsbonuser og effekter er fortsatt videre arbeid; dette er et oppslag av lagret grunnlag.

## Verifisering

Domenetester dekker beregningskontrakten, manuell Level Up, import/migrering med rollback, kopierte referanser og databevaring. Nettlesertester dekker minimal opprettelse, subclass-listene/egne valg, separate utstyrs- og grunnlagsdialoger, fem statusceller på én rad, lik pillestørrelse, HP/temp HP i Combat, Level Up med samlet undo, backup, offline og eksplisitt oppdatering mellom to cachede versjoner. Bredder: 320/360/390/768 px.

Mobilbilder av implementasjonen ved 390 px:

- [Character](images/character-foundations.png)
- [Combat](images/combat-workspace.png)
- [Meny](images/character-menu.png)
- [Opprettelse](images/character-creation.png)
- [Manuell Level Up](images/level-up.png)

Den etterfølgende [UX-gjennomgangen](UX_REVIEW.md) dokumenterer direkte tillegg, dialogtyper, feil-/avbrytflyt, fokus, scroll og lesbar historikk.
