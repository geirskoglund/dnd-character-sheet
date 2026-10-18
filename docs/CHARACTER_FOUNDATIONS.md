# Karaktergrunnlag, beregnede verdier og spilltilstand

Denne rettelsen erstatter det flate opprettelsesskjemaet fra fase 1. Opprettelse registrerer identitet, art, nåværende klasse(r)/nivå, endelige ability scores, maksimal HP og eid/utstyrt utstyr. Beregnet AC og walking speed forklares i forhåndsvisningen. Totalt level er summen av klassenivåene. Det finnes ingen automatisk level-up eller rekonstruksjon av tidligere levels.

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

`src/domain/catalog.ts` er et lokalt, kuratert utsnitt av SRD 5.1: ni grunnarter, tolv klassenavn, alle vanlige rustninger/skjold og noen våpen for håndbruk. Artsoppslag viser et utvalg sammenfattede egenskaper og faste språk. Grunnarter er ikke en komplett modell av alle underarter eller valg. Ekstra språk, alle traits/proficiencies/spells og artsbestemte handlinger fylles ikke automatisk ut av dette utsnittet. Fullt SRD-bibliotek og disse redigeringsflatene gjenstår som beskrevet i produktkravene.

Katalogoppføringer instansieres som uavhengige karakterdata med kilde-ID; endring av én karakter endrer ikke katalogen eller en annen karakter. Egen art/underart registrerer navn og grunnfart. Egen klasse registrerer navn og klassenivå. Egen rustning har en strukturert AC-profil med type, base, Dexterity-regel, Strength-krav og Stealth-egenskap. Eget skjold har egen bonus. Ukjente klasse-/artsegenskaper og andre effekter håndteres med eksplisitt manuell overstyring inntil deres regler modelleres.

Dette utsnittet beregner ikke automatisk alle klassenes og utstyrets effekter: eksempelvis Fighting Styles, Draconic Resilience, feats og midlertidige buffs må korrigeres manuelt foreløpig. Det gjøres ingen rustningsproficiency-, attunement- eller full utstyrsregelvalidering. Begrensningene skal ikke tolkes som ferdig oppfyllelse av hele REQUIREMENTS.md.

SRD-kilder og CC BY 4.0-attribusjon ligger i `public/SRD-LICENSE.txt`, som også caches offline og lenkes fra appen. Ingen proprietære arter eller boktekster distribueres.

## Spilltilstand og overstyringer

HP-pillens dialog har en endringsslider sentrert på 0, ±1, forhåndsvisning og eksplisitt bekreftelse. Skade tar temporary HP først, healing endrer bare current HP opp til maksimum. Lagret current HP over maksimum reduseres ikke av healing. En hendelse lagrer hele endringen og kan angres samlet. Dette er en vanlig HP-justering; damage types, resistance og den planlagte «Ta skade»-kalkulatoren er fortsatt en egen funksjon.

Temporary HP-pillens dialog erstatter den lagrede totalen; verdiene stables ikke automatisk. GP redigeres fra GP-pillen og lagres i heltall CP. Disse verdiene spørres det ikke om under opprettelsen. Identitets-/utstyrsredigering endrer ikke current eller temp HP.

«Beregninger og overstyringer» på karakterarket lar spilleren velge Unarmored Defense og korrigere AC/speed. Tomme overstyringsfelt betyr beregnet verdi. Aktive overstyringer merkes med forklaring og advarsel. Utstyrspiller skiller eid fra utstyrt og kan veksles direkte; detaljredigering/opprettelse/fjerning er i Utstyr-delen av karakterredigeringen.

## Versjoner og bevaring

Character og JSON-backup bruker nå `schemaVersion: 2`. IndexedDB versjon 3 migrerer karakterer og audit-snapshots atomisk. Versjon 1-backuper kan fortsatt importeres. Den gamle valideringskontrakten ligger frosset i `src/domain/legacy-model.ts`.

Tidligere manuelt lagret AC og speed bevares som aktive overstyringer; de kan ikke skilles sikkert fra bevisst registrerte verdier. Spilleren kan fjerne dem for å gå over til beregnet verdi. ID-er, noter, spells, utstyr, valg og historikk beholdes. En mislykket migrering avbryter hele databaseoppgraderingen. Testene kontrollerer både bevart historikk/undo, legacy-backup og rollback ved ugyldige data. Kopiering remapper ressurs-ID-er og deres referanser sammen med øvrige instans-ID-er.

## Verifisering

44 automatiserte modell-/lagringstester og 10 nettlesertester kontrollerer beregningskontrakten, import/migrering med rollback, kopierte referanser, grunnlagsredigering uten HP-reset, HP/temp HP og atomisk undo, egne arter/rustninger, fjerning av overstyringer, vedvarende utstyrstilstand og offline oppdatering av art/klasse/speed. Mobilvisningen er inspisert ved 390 px; regresjonstestene kontrollerer bredder 320/360/390/768 px.

- [Opprettelse på mobil](images/character-creation.png)
- [Karakterark med Human Monk 6: AC 16 og speed 45 ft](images/character-foundations.png)
