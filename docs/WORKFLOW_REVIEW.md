# Pågående gjennomgang av arbeidsflyter

Status: Brukeren har bestilt implementasjon av de avklarte flytene («Ja, gör det»). Arbeidet samles på én arbeidsbranch. Ingen PR eller merge per kommentar. Én samlet PR leverer dokumentasjon og prøveversjon etter produktkontroll. Dette supplerer REQUIREMENTS §13 og DECISIONS. Notatene under bevarer avklaringshistorikken. Den etterfølgende implementasjonen beskrives i [GUIDED_WORKFLOWS](GUIDED_WORKFLOWS.md) og kontrolleres i kravmatrisen; historiske «ikke implementert»-formuleringer nedenfor beskriver samtaletidspunktet.

## Godkjent etter forrige dokumentasjonsleveranse

### Cantrips og spells

+ i riktig seksjon åpner søkbar liste med riktig innholdstype. Standard følger karakterens klasser, relevante klassenivåer og andre gyldige tilgangskilder, med Vis alle som overstyring. Velg registrerer katalogdata og lukker listen. Bare nødvendige, tvetydige opplysninger utløser veiviserspørsmål, eksempelvis hvilken klasse eller feat som gir tilgang. Tilpass bruker en eksisterende spell som grunnlag. Opprett egen bruker kort veiviser for navn, eventuelt spellnivå og valgfri regeltekst; flere detaljer ved behov.

Regelpresisering i samtalen: Wizard har en bred klasseliste og tilgang til flere magiskoler, ikke automatisk alle spells i spillet. Valgt magiskole skal ikke alene begrense spellvalg. Cantrips følger klasselister og øvrige tilgangskilder; Wizard kjenner også bare et begrenset utvalg. Skill velg/lær, registrert innhold og forberedelse/bruk. Faktiske 2014-kilder og konkrete klassescenarioer kontrolleres før implementasjon.

### Egen Magi-fane og ikonbasert bunnavigasjon

Fire hovedfaner: Character, Combat, Magi og Utstyr, samt Meny. Magi samler cantrips/spells, known/spellbook/prepared, spell slots og relevante spellcasting-verdier. Combat beholder relevante kampoppslag under Action/Bonus/Reaction fra de samme dataene. Character beholder grunnverdier, egenskaper og feats.

Bunnavigasjonen bruker bare ikoner: Character/karakterark, Combat/kryssede sverd, Magi/tryllestav med gnist, Utstyr/ryggsekk, Meny/tre streker. Samme størrelse og gode trykkflater. Aktiv fane har farge og en liten strek. Tilgjengelige navn beholdes for skjermleser. Ingen hjørnetrekanter på navigasjonen. Dette erstatter tidligere krav om tre hovedfaner og synlig navigasjonstekst; produksjonsappen er ennå ikke endret.

### Forberedelse av spells

Brukeren ga foreløpig tilslutning til flyten: Forbered spells i Magi åpner en avkrysningsliste etter klassens regler, eksempelvis Wizard fra egen spellbook, Cleric/Druid fra relevant klasseliste. Teller viser valgt/maks, beregnet fra karakteren. Alltid forberedte spells vises og holdes utenfor vanlig telling etter sine regler. Ferdig lagrer samlet; overskridelse varsles med manuelt DM-unntak. Cantrips og klasser uten slik forberedelse får enklere visning. Veiviser brukes når flere opplysninger trengs; rene flervalg kan være avkrysningsliste.

### Spell slots: automatisk oppsett og enkelt forbruk

Brukeren godkjente: Slots opprettes fra klasse/nivå; Wizard3 har eksempelvis fire nivå1-slots og to nivå2-slots. En cantrip alene gir ingen slots. Magi viser én pille per slotnivå med tilgjengelig/maks. Trykk åpner et lite panel med Bruk én og Gi tilbake én. Valget lagres og panelet lukkes; Angre er tilgjengelig. Kompakt slotoversikt finnes også i Combat. Tilpass lar spilleren overstyre maks eller korrigere antallet direkte; manuelle overstyringer bevares. Warlock Pact Magic er egen beholdning med relevante hvilevilkår. Eksakt multiclass-beregning, trygge nivåendringer og øvrige grensetilfeller må konkretiseres og testes før implementasjon.

## Senere avklart: enklere Hit Dice og felles tallvelger

### Hit Dice: beholdning og manuell HP-føring

Forslaget om å registrere hvert fysisk terningkast, automatisk legge til CON og bekrefte én terning om gangen ble forkastet som for tungvint. Brukeren ønsker oversikt over tilgjengelige terninger, enkel justering av beholdningen og manuell HP-føring. Et samlet HP-adjustment kan eventuelt oppgis, slik at appen oppdaterer HP; rå terningkast skal ikke registreres som nødvendig del av flyten. Flere terningtyper vises separat. Den eldre per-terning-flyten i DECISIONS gjelder ikke som føring for denne nye forenklingen. Det konkrete samspillet med fullføring av kort hvile avklares fortsatt.

### Tallhjul som alternativ til slider

Brukeren foreslo iPhone-klokkens rullende tallhjul som generell inspirasjon ved justering av tall, både i character creation og ellers, og sluttet seg til forslaget: hele tall ruller vertikalt med valgt verdi i midten, relevante grenser og mulighet til å trykke på tallet for direkte skriving. Uttrykket følger Eventyrjournal. Ved character creation velges selve verdien; ved HP-justering velges endringen med separat før/etter-visning. Valgt endring blir stående frem til bekreftelse. Dette er et gjenbrukbart alternativ til slideren; ingen komponent er implementert i denne diskusjonsrunden.

## Senere avklart: lang hvile og andre beholdninger

### Lang hvile

Brukeren godkjente: Hvile → Lang hvile viser en kort forhåndsvisning av faktiske endringer i HP, slots, Hit Dice og beholdninger med relevante hvileregler. Fullfør hvilen lagrer samlet, med samlet Angre. Spiller/DM avgjør når hvilen gjelder; manuelle overstyringer er tilgjengelige. Etter 2014-reglene gjenopprettes normalt inntil halvparten av maksimalt antall Hit Dice, rundet ned og minst én. Eksempel Monk4 med 1/4 d8 får tilbake to og ender på 3/4. Brukeren understreket at papirarket fortsatt er føringen: dette skal være enkelt å administrere. Multiclass-fordeling, betingede gjenopprettinger, temporary HP og øvrige faktiske regler må undersøkes før implementasjon, uten å innføre en generell hvilesimulator eller timer.

### Andre begrensede beholdninger

Foreløpig akseptert til utprøving: Når en kjent egenskap har begrensede bruk, følger en beholdning med der det finnes sikre regeldata. Egen beholdning bruker kort veiviser: navn → maks/tilgjengelig (tilgjengelig lik maks som utgangspunkt) → gjenoppretting ved kort hvile, lang hvile eller manuelt. Vis som for eksempel Amulettens kraft 3/3, med enkel justering via −/+ eller tallhjulet. Spell slots og Hit Dice beholder sine konkrete plasseringer. «Ny beholdning» gjelder øvrige ting spilleren vil telle.

## Fortsatt til diskusjon

Samlet kort-hvileflyt, proficiencies, skadeegenskaper og tilstandsimmunitet, samt detaljer/grensetilfeller i de foreløpig avklarte flytene. Nye forslag under samtalen regnes ikke som godkjent før brukeren har sluttet seg til dem. Tidligere rapporterte HP-/zoomfeil, AC-forklaring og visuell støy beholdes i REQUIREMENTS §13.
