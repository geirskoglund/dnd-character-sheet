# Tre visuelle retninger – designstudie, oktober 2026

**Status: forslag til vurdering, ingen valgt retning eller endring av appen.** Bestilt av brukeren 2026-10-19 etter avklaring om tre sammenlignbare mobilskisser, komponenteksempler og dialog/meny. Ingen preferanse for lyst/mørkt: riktig fantasyfølelse og brukbarhet avgjør.

## Forventning før utforming

Alva Nattvind, Elf Rogue 5 / Thief. STR10 DEX18 CON14 INT12 WIS14 CHA10; PB3; HP28/38, temp5; Studded Leather AC12+DEX4=16; shortsword/dagger attack+7, vanlig skade1d6+4/1d4+4 piercing. Stealth expertise+10, Perception proficiency+5, Dexterity save+7, Persuasion proficiency+3. Samme grunnlag i alle retninger; ingen feats eller spells fra en ugyldig klasse. Skade8 bruker temp5, så HP28→25.

Skissene skal gjøre Character-status (fem jevne felt), fire fullstendig navngitte modifierfavoritter, seks abilities, tette uniforme piller med inline + og tre hovedfaner gjenkjennelige. Combat Action/Bonus/Reaction og swipe skal ha samme visuelle navigasjon. Karakteradministrasjon ligger i menyen. Gjenstand er samlet rustning, ikke plaggadministrasjon.

Tre konsepter: **Runesmed** (jern/messing, kantede beslag), **Eventyrjournal** (lys folio, blekk, boktypografi), **Stjernekart** (nattblått, sølv, himmelgeometri). Samme innhold og komponentfunksjon; form, type, ikonrammer, materialpreg og tilstander varierer.

## Kontrollplan for skissene

- Sammenlign innhold og tall programmatisk; fem statusfelt, fire modifiers, seks abilities og identiske piller/plusser.
- Kontroller 390 px skjermflater og 320 px/stor skrift i isolert visning; ingen skjulte viktige kontroller eller uleselig tekst på dekor.
- Se faktisk på rendrene: egen stil, hierarki, tetthet, label/ikon, meny, modaltyper og tilstander. Kontrast i primærtekst og kontrollgrenser undersøkes separat; ikke påstå full WCAG-revisjon eller fungerende produksjonsflyt.
- Rendrene er designforslag. Noen krevde, ennå uimplementerte deler (Combat swipe/general actions/Ta skade) kan illustreres, men implementasjonsstatus endres ikke av bildene. Ingen funksjons- eller lagringstest kan godkjenne et nytt tema før faktisk implementasjon.

## Filer og kilder

`index.html`, `study.css`, `study.js` er en isolert skisseflate, uten tilgang til appens IndexedDB, app-kode eller service worker. Rendres lokalt med Chromium. PNG-bildene er laget fra HTML for presise, lesbare verdier. Portrettet er nygenerert illustrasjon av en fiktiv karakter, brukt likt i alle tre alternativer.

Fonter er lokale og OFL-lisensierte: Cinzel, Cormorant Garamond, Marcellus og Source Sans 3. Fra Google Fonts, fast revisjon `47d54ca1ebb14fd864695f1d39dc734f39017c33`; nedlastinger verifisert mot Git blob-hash. Lisenser ligger sammen med fontene i `assets/`; lisensordlyden er beholdt med normalisert linjeslutt og fjernede etterfølgende mellomrom. Ingen eksterne fonter eller nettressurser kreves ved visning.

## Leveransen

- [Samlet sammenligning](0-sammenligning.png)
- [01 Runesmed: Character, Combat, HP-dialog og komponenter](1-runesmed.png)
- [02 Eventyrjournal: samme skjermer og komponenter](2-eventyrjournal.png)
- [03 Stjernekart: samme skjermer og komponenter](3-stjernekart.png)
- [Dialogtyper i alle tre retninger](4-dialoger.png)

| Komponent | Vist i skissene | Felles funksjon / forslag |
| --- | --- | --- |
| 1. Tittelfelt | Alle hovedskjermer | Samme navn, art, klasse/nivå og subclass, valgfritt portrett; ulike typografier og rammer |
| 2. Grunnleggende info | Character øverst | Fem jevne felt, HP/AC/Initiative/GP/Speed; HP-status uten temp HP |
| 3. Modifiers | Character | Fire like kort med fullstendige navn og tydelige modifiers |
| 4. Ability scores | Character | Seks på rad ved vist normal skrift; skjold, bokbuer eller sigilringer etter retning |
| 5. Overskrifter | Alle | Lesbart hierarki, enkle symboler og skillelinjer |
| 6. Piller og + | Character, Utstyr-utsnitt | Lik geometri innen samlingen, inline + og semantisk valgt/aktiv-status |
| 7. Dialogsystem | HP-skjerm + egen dialogplansje | Stor redigering/velger med fast topp; kort oppslag; bekreftelse. X erstatter Avbryt i redigeringsforslaget; ingen ekstra Lukk/Avbryt med samme funksjon |
| 8. Bunnfaner | Character/Combat | Tre innholdsfaner med ikon og tekst; tydelig valgt tilstand |
| 9. Menyknapp | Bunnlinjen | Fast separat menytilgang som forslag, tilgjengelig uten å gå til toppen |
| 10. Meny | Komponentplansje | Denne karakteren, karakteradministrasjon og backup; ikke permanent administrasjon på arket |
| 11. Combat-tabs/swipe | Combat | Action/Bonus/Reaction med tydelig markør; sveip illustrert, ikke implementert av en statisk skisse. Hint kan begrenses til første bruk |
| 12. Slider/stepper | HP-dialog | Delt skade/healing-skala, tydelig nullpunkt, fysisk kontrollknott, eksakt tall og ±1; korrekt preview før bekreftelse |
| 13. Tekstfelt | Komponentplansje og velger | Samme feltfamilie for input, fokus, feil og select; labels bevares |
| Andre tilstander | Komponentplansje | Inspiration, tilgjengelige Hit Dice, lagret, betinget attunement og oppbrukt/disabled. Ikoner er egne SVG-tegninger; ingen farge alene som forklaring |

## Dialogforslag

Kort oppslag har bare X/Lukk og ingen Lagre. Store velgere har fast topp med X og søk; valg legger til direkte. Stor redigering har X/Avbryt fast øverst og én lagrehandling fast nederst. Bekreftelse har to ulike handlinger (Avbryt/Fjern), uten ekstra X. Dette er foreslåtte mønstre, ikke vedtatte endringer. Ved implementasjon må fokus, tastatur, utkast/avbryt, lagringsfeil, separate scrollposisjoner og gjeldende dataflyt beholdes og testes.

## Faktisk gjennomgang

Alle fem PNG-er er rendret fra lokal HTML i Chromium med innlastede lokale fonter. Character/Combat/HP er gjennomgått visuelt i alle tre retninger. Innholdet er sammenlignet, og 5 statusfelt, 4 modifiers og 6 abilities er bevart. Per samling er piller og + like store. Ni isolerte skjermvarianter (3 retninger × 3 skjermer) er kontrollert ved 320 × 844; ingen horisontal overflyt, avkuttet korttekst eller skjulte Character-/Combat-elementer ble observert. Ved 390 px passer alle de viste hovedflatene. Stjernekartets dekor ble klippet til identitetsfeltet etter at kontrollen fant intern breddeoverflyt.

Primær-/sekundærtekst, aksent og kontrollrammer er målt mot temaets bakgrunn/panel. Journalens kontrollrammer og Stjernekartets rammer ble mørknet/lysnet for bedre kontrast. Disabled og rent dekorative skillelinjer er ikke brukt som kontrastbevis. Dette er ingen full WCAG-revisjon: 200 % tekst, alle skjermstørrelser, faktiske berøringsflater og full skjermleser-/tastaturflyt må verifiseres i det valgte produksjonstemaet. Fast pikseltypografi i denne illustrasjonsflaten er ikke en ferdig tilgjengelig implementasjon.

`node --check study.js` og `node --check render.mjs` er kjørt. Nettleseren meldte ingen JavaScript-feil. HP-dialogene er også prøvd med langt innhold: X og bekreftelsesfeltet beholder posisjon mens dialoginnholdet scrolles, i alle tre temaer. Ingen funksjonskode, database, app-CSS, arbeidsflyt eller deploy-oppsett er endret; derfor er ingen nye spilltester opprettet eller påstått kjørt for skissene. De eksisterende produktkravene og kjente funksjonsmanglene står ved lag.

### Gjenskape bildene

Fra repository-roten, med prosjektets eksisterende npm-installasjon og Chromium:

```sh
python3 -m http.server 4190 --bind 127.0.0.1 --directory docs/design/2026-10
```

I en annen terminal:

```sh
node docs/design/2026-10/render.mjs
```

`CHROMIUM_PATH` kan angi en annen installert Chromium. `index.html?theme=forge`, `journal` eller `stars` viser én plansje; `?overview=1` viser sammenligningen og `?dialogs=1` dialogene. Dette er lokale vedlikeholdsinstruksjoner, ikke en publisert app-preview.
