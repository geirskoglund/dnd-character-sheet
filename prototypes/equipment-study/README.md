# Utstyrsverksted – prototype v2

**[Last ned zip](utstyrsverksted.zip)**, pakk ut og åpne **utstyrsverksted.html** i Chrome eller Safari på Mac. Filen inneholder alt den trenger: ingen installasjon, server eller nettforbindelse. Erstatt den gamle HTML-filen på samme sted dersom nettleseren skal kunne finne tidligere prøvedata. Nettleser/private vinduer kan begrense lokal lagring.

Dette er fortsatt en isolert arbeidsflytstudie. Hovedappen, dens karakterer/IndexedDB og GitHub Pages-versjonen er uendret. Detaljene er til brukerreview før eventuell appimplementasjon.

## Prøv dette

### Våpen med skadebonus

Start «Et våpen med noe ekstra». Gi Warhammer et eget navn, legg til **Skadebonus +2** og **Ekstraskade 1d4 Fire** med betingelsen «Når hammeren damper». Lagre og velg hånd som siste valg. Popupen lukkes til listen. Åpne våpenet: grunnskade, modifiers og ekstraskade vises samlet; detaljene finnes under det merkede Beregningsgrunnlag.

Prøvekarakteren har Strength14 (+2), derfor blir resultatet `1d8 + 4 bludgeoning` og den betingede fire-skaden. Begge hender gir versatile-grunnskade1d10. Bruk **Kopier** for et nytt uavhengig eksemplar, uten noe Antall-felt i våpenveiviseren.

### To dolker og Combat

Legg til en Dagger via gruppens +, åpne den og velg Høyre hånd. Kopier den, åpne kopien og velg Venstre hånd. Begge vises i Combat. Prøvekarakterens Dexterity16 (+3) og proficiency+2 gir:

- Action: `d20 + 5`, skade `1d4 + 3 piercing`.
- Bonus Action: `d20 + 5`, skade `1d4 piercing`.

Hver dolk kan være første eller andre angrep; ingen hånd er permanent koblet til Action/Bonus. Vilkåret om Attack action og et lett melee-våpen i den andre hånden står ved bonusoppslagene. Under **Prøvekarakter og beregninger** kan du endre STR/DEX/proficiency og prøve Two-Weapon Fighting-kampstilen. Magisk skadebonus beholdes også på bonusangrepet; negativ ability modifier trekkes fortsatt fra. Håndkonflikter gir advarsel med DM-unntak. Two-handed-våpen tilbyr bare Begge hender/Ikke i bruk, og vanlige dolker tilbyr bare én hånd om gangen.

### Amulett med minsteverdi

Start «En magisk amulett». Legg til Constitution → **Hev til minst** → 19. Legg eventuelt til Immunity → En tilstand → Frightened. De er virkninger på samme gjenstand. Gjenstanden beskrives ikke lenger som uten magisk effekt. Grunnverdien er fortsatt separat; en høyere ability-verdi beholdes. Tallbidrag som Skadebonus går rett til beløpet, med feltspesifikke tekster.

### Magic Mist og én samlet effekttekst

Start «En effekt med begrensede bruk», gi gjenstanden navn og velg **Andre effekter → + Effekt**. Skriv «Magic Mist», velg hvor den skal vises i Combat, og angi eventuelt ett bruk per Short rest. Tilgjengelig starter på maks uten eget spørsmål.

Ta gjenstanden i bruk ved lagring. Beskrivelsen vises i valgte Combat-kategorier og oppslaget med samme bruksteller. Flere kategorier kan velges. Gjentatt +Effekt åpner den eksisterende teksten, fremfor å opprette et nytt felt. Merknad om gjenstanden er separat og ment for historie, opphav og utseende.

## Lagring og navigering

- **Lagre er tilgjengelig underveis**, også i matrisen og spørsmålene. Nødvendige mangler får konkret beskjed. En komplett virkning kan lagres uten å trykke Tilbake flere ganger.
- Hvis gjenstanden ikke allerede er i bruk, spørres det som siste lagringsvalg. Svaret lagrer og lukker. Eksisterende bruk beholdes uten nytt spørsmål.
- **Lagre merknad** lagrer den sammen med resten av gjenstanden og lukker etter eventuell bruk. «Merknad og attunement» inneholder ikke Antall. Antall for andre gjenstander er et separat frivillig valg; våpen har ingen antallsregistrering.
- Oppslagets raske hånd-/I bruk-/attunement-kontroller og brukstellere lagrer direkte. Oppslaget åpnes bare når du velger det, ikke automatisk etter lagring.
- Avbryt denne virkningen avslutter bare den aktuelle virkningen og beholder resten av gjenstandsutkastet.
- X/Escape bevarer et separat utkast og spørsmålsposisjon. Bekreftede data endres først ved Lagre. Tilbake bevarer svar. Forkast utkast er en egen handling.
- Lagringsfeil vises tydelig, hindrer bekreftelse/lukking og beholder utkastet. Prøvedata kan eksporteres som JSON, også fra feilvarselet. Import inngår ikke. Sletting bekreftes, og siste fjerning kan angres.

## Eldre prøvedata

Den samme localStorage-nøkkelen beholdes. Prøveformatet er nå versjon2, uavhengig av hovedappens format. Eldre quantity-våpen deles i individuelle kopier ved innlesing; kopiene får egne ID-er og starter uten hånd/attunement. Gamle sett-til-ability-effekter får minsteverdisemantikken som den første prøven beskrev. Beskrivelse, tellere og utkast bevares. Gamle multiple friteksteffekter bevares som historiske separate oppføringer for å unngå datatap; ny +Effekt redigerer første eksisterende og oppretter ikke flere. Eldre absolutte overstyringer utenfor abilities bevares i data/oppsummeringen, men brukes ikke som en ny generell beregningsmotor.

## Avgrensning

Combat er en liten prøveflate med eksplisitte prøveverdier og vanlig 2014 two-weapon-fighting, ikke et komplett karakterark eller en turtracker. Våpnene regnes som proficient; normal finesse, versatile, two-handed og faste skade-/angrepsbonuser inngår. Ubetingede aktive ability-bidrag/minsteverdier og globale bonuser fra andre aktive gjenstander brukes i prøveberegningene. Attunement-krav respekteres. Passive fritekstvirkninger vises under Andre egenskaper.

Fritekst/vilkår tolkes ikke automatisk. Betingede skadebonuser/ekstraskader vises med vilkåret og vurderes av spilleren. Ingen fysiske kast simuleres. Spesielle feats, spellangrep, delte charges, variabel utgift, automatisk hvile, komplett magisk katalog, full karaktermatematikk og samtidighetskontroll mellom faner inngår ikke. Tall tastes direkte i denne isolerte filen; appens tallhjul er ikke kopiert.

## Kontroller

Fra repoets rot med eksisterende avhengigheter:

```sh
node prototypes/equipment-study/check.mjs
npm run build
```

18 scenariogrupper kontrollerer nye og eksisterende flyter, migrering av eldre prøvedata, statgulv, konteksttekster, siste bruksspørsmål/lukking, kopiering/hender, Action/Bonus-regler, delte fritekstoppslag/tellere, betingelser, utkast, lagringsfeil, slett/angre og offline. Layout prøves gjennom faktiske spørsmål og Combat ved320/390/768/1280px og100/200%tekst. Bilder i [screenshots](screenshots/), oppdatert matrise i [CHARACTER_WORKSPACE](../../docs/CHARACTER_WORKSPACE.md#før-koding-kontroll-utstyrsprototype-v2).

`CHROMIUM_PATH` kan overstyre testnettleseren. Testen leser HTML fra disk og leverer den direkte til Chromium gjennom en Playwright-route, uten testserver/eksterne forespørsler. Miljøet har tidligere blokkert file://; fysisk Mac/Safari er ikke testet her. Brukeren har prøvd første utgave på egen maskin; alle ressurser er fortsatt innebygd i én fil. Zip inneholder bare HTML og kontrolleres identisk med kilden ved pakking.
