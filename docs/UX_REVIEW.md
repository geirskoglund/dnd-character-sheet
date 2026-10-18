# Gjennomgang av eksisterende brukerflyter

Denne rettelsen følger brukerens bestilling om å fjerne unødvendige mellomsteg og gå gjennom hele den implementerte arbeidsflaten. Referanse: [v0.11](../prototypes/dnd-character-companion-v0.11.html), gjeldende krav og de seneste brukeravklaringene. Arbeidet utvider ikke den avklarte Combat-avgrensningen; genererte kampoppslag og øvrig D&D-funksjonalitet er fortsatt videre arbeid.

| Flyt | Problem funnet | Rettet flyt |
| --- | --- | --- |
| Legg til katalogutstyr | + åpnet en tom administrasjonsdialog med forklaringer, beregninger og enda en +. | + åpner søk, filter og utstyrsvalg direkte. Velg én oppføring for å legge den til; én bekreftet hendelse, uten ekstra lagreklikk. Nytt katalogutstyr starter med antall 1 og utstyrt-status, som før. |
| Eget utstyr | Egenregistrering var skjult inne i en dropdown etter flere steg. | «Opprett eget utstyr» finnes direkte i velgeren, også ved null treff, og åpner et utfyllingsklart skjema i samme dialog. |
| Endre eller fjerne utstyr | Utstyrspillen endret bare utstyrt-status; annen redigering krevde + og hele utstyrslisten. | Trykk på posten åpner ett skjema for navn, kategori, antall, utstyrt-status og notat. Utstyrsverdier kan åpnes ved behov. Fjerning er tilgjengelig her med eksplisitt bekreftelse. |
| Artsegenskaper og historikk | Rene oppslag hadde både Avbryt og Lukk. | Én Lukk-knapp. Escape fungerer, ingen lagring eller historikkhendelse. |
| Modifierfavoritt | En umiddelbar velger hadde både Avbryt og Lukk; valg av samme favoritt kunne opprette en hendelse. | Én Lukk-knapp; valgt oppslag lagres direkte. Uendret valg skriver ingenting. |
| Avbryt sletting | Avbrutt sletting av notat kastet brukeren ut av redigeringen og mistet utkastet. | Avbryt/Escape gjenåpner det samme skjemaet med uendrede utkastverdier, fokus og hendelseslyttere. Gjelder også utstyr. |
| Lagre uendret | En identisk lagring la til en hendelse og gjorde Angre mindre nyttig. | Uendret aggregat beholder revisjon og historikk; Angre reverserer siste faktiske endring. Stale data avvises fortsatt. |
| Fokus og scroll | Ny rendering kunne miste utgangspunktet; en lukket menykontroll kunne bli valgt som fokusmål. | Dialogen lever utenfor hovedrenderingen. Ved lukking returneres fokus og scroll til samme pille eller samling; menyoperasjoner returnerer til Meny. |
| Lagring pågår / feil | Avbryt og Escape kunne antyde avbrutt lagring selv om transaksjonen allerede var sendt. | Under lagring er knapper og Escape låst. Ved feil beholdes felt/søk, feilen vises i dialogen og handlingen kan prøves igjen. |
| HP | Presise endringer kunne kreve mange ±1-klikk; nullendring hadde en aktiv bekreftelsesknapp. | Direkte tallinntasting synkroniseres med slider og forhåndsvisning. Null/ugyldig endring kan ikke bekreftes. |
| Historikkdetaljer | «Før og etter» viste hele karakteren som teknisk JSON. | Bare faktiske endringer vises med feltetiketter og før-/etterverdier; revisjon, tidsstempler og interne kilde-ID-er fjernes fra detaljvisningen. Audit-dataene i databasen beholdes. |
| Opprettelse / Level Up / bytte | Første og eneste klasse kunne fjernes uten gyldig alternativ; Level Up viste en meningsløs énvalgsvelger; tomt karaktervalg kunne skjule arket. | Eneste klasse beholdes, ny klasserad får fokus, én klasse i Level Up vises direkte, og tomt karaktervalg kan ikke velges. Lagret artsgrunnlag bevares ved uendret artsvalg. |

## Kontroller

Automatiserte nettlesertester verifiserer både handlingens resultat og selve flyten: én oppslagsknapp, direkte utstyrsvalg, filtrering/tomt søk, dobbeltklikk uten dobbelt tillegg, redigering av bare valgt post, slett/avbryt/angre, urørt historikk ved uendret lagring, fokus/scroll, nøyaktig HP, feil og gjenforsøk og blokkert avbryt under ventende lagring. Eksisterende tester av karakteropprettelse/-bytte, multiclass, databevaring, JSON-backup, offline og overgang mellom cachede versjoner beholdes.

Mobilgjennomgangen er gjort i Chromium ved 320/360/390/768 px og 568 px høyde, samt 320 px med stor skrift. Dette omfatter de nye velger- og redigeringsdialogene; det er ikke en full revisjon av alle mobile nettlesere eller skjermlesere.

- [Utstyrsvalg direkte fra +](images/ux-equipment-picker.png)
- [Rediger én utstyrspost](images/ux-equipment-edit.png)
- [Artsegenskap med én Lukk](images/ux-trait.png)
