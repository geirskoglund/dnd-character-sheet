# Eventyrjournal – komplette komponentrader

Bestilt av brukeren 2026-10-20: lag komponentplansjene som beskrevet etter tilbakemelding på de tre opprinnelige temaene. Dette er isolert designarbeid, ikke styling eller funksjonsendring av appen.

## Forventet vurderingsgrunnlag

- Eventyrjournalens elfenben/vinrøde palett og boktypografi, med Stjernekartets runde ability-mynter. Alle seks forkortelser følger identisk bue, tekstlengde og sentrering.
- Vis alle familier samlet: identitet, fem statusverdier uten HP-indikator, fire fullstendig navngitte modifiers, seks abilities, artsegenskaper, features, feats, cantrips, spells, våpen, rustning, annet utstyr, språk/proficiencies, notater og ressurser. Ikke gi hver innholdstype en ny form uten grunn.
- Sammenlign åpne modifiers med svak innramming og individuelle pilleikoner med bare tekst. Begge sider skal ha identisk innhold og verdier. Ikonvarianten skal vise sin faktiske ekstra høyde, også med lange navn.
- Vis skille mellom ren informasjon og åpnbare elementer uten hover, samt trykk/fokus/valgt/oppbrukt, tom samling, attunement-vilkår, feil/fokus i felt, portrett-placeholder, bunnmeny og Combat-tabs. Dialog- og HP-kontroller viderefører diskusjonen, uten å påstå implementert funksjonalitet.

## Eksempelkarakterer og regelgrunnlag

Alva Nattvind er den samme Elf Rogue 5 / Thief som i første studie: HP28/38, temp5, AC16 (Studded Leather12 + DEX4), Initiative+4, GP42.50, speed30ft; STR10 DEX18 CON14 INT12 WIS14 CHA10; PB3. Modifiers +5/+10/+7/+3; shortsword/dagger d20+7 og 1d6+4 /1d4+4 piercing. Skade8 gir temp5→0 og HP28→25. Rogue5 og Thief3-egenskapene er vist uten å legge til spells fra en annen subclass.

Mira, Human Wizard3, brukes som et **separat** spell-/ressurseksempel: Mage Hand/Ray of Frost/Minor Illusion, Magic Missile/Shield/Detect Magic og Misty Step (2nd level). Wizard3 har 4 førstenivåslots og 2 andrenivåslots; eksemplet viser først 3/4 tilgjengelige, og en separat 0/4-tilstand. Detect Magic kan ritualkastes fra Wizard-spellbook uten å være forberedt (5e 2014). Tallene er eksempeltilstander, ikke automatisk tildeling av spells eller feats.

Feats og samlingen med lange navn er tydelig merket **alternative katalogeksempler**, ikke samtidig registrerte valg på Alva eller Mira. En vanlig kappe gir ingen bonus; Cloak of Protection uten nødvendig attunement gir ingen bonus. I bruk, forberedt og attunement er ulike forhold, selv om de deler visuelle markeringer. Alvas detaljerte fixture og avgrenset utstyrsregelgrunnlag finnes i [opprinnelig studie](../README.md) og [EQUIPMENT](../../../EQUIPMENT.md).

## Leveranse og omfang

- [05 · Alle elementfamilier](../5-elementfamilier.png)
- [06 · Modifier- og ikonalternativer](../6-alternativer.png)
- [07 · Samhandling og tilstander](../7-tilstander.png)
- [08 · Felles hjørnemarkør for klikkbarhet](../8-hjornemarkor.png) – senere bestilt prøve, se under

Den lyse flaten/fine kanten markerer generelle oppslagspiller. GP åpner pengeføring, mens HP og de øvrige statusverdiene vises som informasjon. En liten pil brukes på GP-handlingen; den er ikke gjentatt på hver pille. Åpne modifiers har en diskret bunnlinje som alternativ, ikke ferdig vedtatt løsning. Egne egenskapsikoner er en liten, egen SVG-prøvesamling for **bare de viste eksemplene**, ikke et ferdig eller komplett ikonbibliotek. Det er ikke generert et stort sett.

Placeholder er en enkel linjetegnet byste i samme ramme som portrettet; ingen bildeopplasting kreves. Portrett og lokale OFL-fonter gjenbrukes fra første studie, med samme kilde/lisenser. Ingen nettressurser lastes. Ingen appkode, IndexedDB, service worker eller gameplay importeres. Knappene illustrerer geometri og visuelle tilstander, ikke fungerende karakterføringer. Dialog- og ikonvalg er fortsatt til vurdering.

## Kontrollplan

Rendre lokalt med Chromium og faktiske lokale fonter. Se på alle tre bilder. Kontroller likt innhold i alternativene, uniform pille/+ størrelse, myntbuene, fem/fire/seks verdier, lange navn og manglende HP-indikator. Prøv alle 15 elementfamilier og hele ikonvarianten isolert ved 320 og 390 CSS px: ingen horisontal overflyt eller klippet korttekst. Kontroller tekst/kanter mot bakgrunn og oppgi begrensninger; ingen påstand om full tilgjengelighets- eller spilltest fra statiske bilder.

Gjenskaping fra repository-roten, i hver sin terminal:

```sh
python3 -m http.server 4190 --bind 127.0.0.1 --directory docs/design/2026-10
node docs/design/2026-10/components/render.mjs
```

`STUDY_URL` kan angi en annen lokal adresse til `components/`, og `CHROMIUM_PATH` en annen Chromium. Nettleservisning: `components/?board=families`, `alternatives` eller `states`. `?board=families&solo=abilities` viser én elementfamilie i vinduets reelle bredde.

## Faktisk kontroll

Alle tre endelige plansjer er rendret med lokale fonter og gjennomgått visuelt. Kontrollen fant og rettet myntforkortelser for nær rammen, en tomtilstand som brøt med inline-plussfamilien, og manglende handlingsmarkering på GP. Myntene er status, ikke nye knapper; GP beholder sin eksisterende pengeføringshandling. Sammenligningsplansjens to ikonvarianter har identiske navn og verdier, men ikonvarianten bruker synlig mer høyde.

Rendererens kontroller passerer: fem statusfelt, fire modifiers, seks mynter; identisk bue/tekstlengde/sentrering; lik pille-/plussgeometri per samling; ingen klippet korttekst. **32 isolerte mobilvisninger** (15 familier + hele ikonvarianten, hver ved 320 og 390 px) er prøvd uten horisontal overflyt eller klippet pille-/modifier-/statustekst. Nettleseren rapporterte ingen JavaScript- eller ressursfeil. JS-syntaks og dokumentlenker er kontrollert.

Primærtekst, sekundærtekst, vinrød aksent og grønne tekstmarkeringer er kontrollert mot papir, panel og valgt flate (minst 4,5:1); kontrollkanter minst 3:1 mot disse flatene. Grønnfargen ble mørknet litt fordi liten «I bruk»-tekst ellers hadde for svak kontrast på valgt flate. Dette er en begrenset farge-/geometrikontroll, **ingen full tilgjengelighetsrevisjon**. 200 % tekst, full tastatur-/skjermleserflyt, faktiske dialoginteraksjoner og reelle spillføringer er ikke verifisert av de statiske plansjene. Ingen nye app-, lagrings- eller spilltester er lagt til eller påstått kjørt lokalt.

## Senere prøve: ett hjørne, samme betydning

Brukeren bestilte deretter en liten fylt trekant nederst til høyre, avgrenset av kant og 45° strek, som felles klikkbarhetsmarkør uten å endre rammene. `?board=corners` viser prøveplansjen, med markøren i **10 × 10 CSS px** og et separat, tydelig merket forstørret utsnitt. Den bruker samme form/fyll på alle viste trykkflater: GP, luftige modifierfelt, piller, inline +, spell-/ressursoppslag, bunnfaner/Meny og vanlige handlingsknapper. Modifiers åpner valglisten for hva favoritten skal vise. HP/AC/Initiative/Speed og ability-mynter er status uten markør.

GP har samme overflate og rammefarge/-tykkelse som andre statuser. Ingen ekstra pil eller lysere handlingsflate brukes. Opprinnelig komponentgeometri beholdes, med litt innvendig plass til hjørnet ved pille-/modifiertekst. «I bruk»/«Forberedt» vises med hake og tekst uten egen fyllfarge i denne prøven; dette er et forslag, ikke et vedtatt statusdesign. Navigasjon og handlingsknapper er tatt med for å vurdere om fellesmarkøren blir overflødig der. Tekniske semantikker, tilstrekkelige trykkflater og fokus kan ikke erstattes av dekorasjonen ved senere implementasjon.

Rendre bare denne plansjen med `node docs/design/2026-10/components/render-corners.mjs`, med samme server/`STUDY_URL`/`CHROMIUM_PATH` som over. Originale plansjer overskrives ikke. Egen visuell gjennomgang og rendererens kontroller passerer: identisk 10 px-markør på alle viste knapper; ingen på statusmynter; bare GP markert blant de fem statusverdiene; samme bakgrunn/ramme for alle fem; uniforme piller/+ og **20 isolerte mobilutsnitt** ved 320/390 px uten horisontal overflyt eller klippet korttekst; ingen JS-/ressursfeil. En CSS-arv som strakk markøren i modifierfeltene ble rettet før endelig render. Dette er fortsatt en isolert designprøve, ikke produksjonsimplementasjon eller full tilgjengelighets-/spilltest.

## Senere avklaringer; bildene er historiske forslag

Brukeren godkjente hjørneuttrykket med trekantfyll i samme farge som ramme/bunnlinje, og avklarte HP-slideren som en innrammet relativ dragkontroll: dragets lengde justerer beløpet; ved slipp beholdes beløpet og grepet går tilbake til midten; nye drag justerer videre. HP-resultatet stopper ved 0/maks, med temporary HP først ved skade. Se [samlede krav](../../../REQUIREMENTS.md#avklart-hjørnefarge-og-relativ-hp-slider-2026-10-20). Ingen av de eksisterende bildene viser denne endelige fargen eller sliderbetjeningen. Ingen ny skisse eller produksjonskode endres gjennom denne avklaringen.
