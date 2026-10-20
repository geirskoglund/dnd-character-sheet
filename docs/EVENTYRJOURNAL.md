# Eventyrjournal – implementert grensesnitt

Brukeren bestilte implementasjon 2026-10-20 etter tre designforslag og komponentplansjer. Denne versjonen innfører det valgte lyse journaluttrykket og avklarte betjeningsendringer. Den bygger videre på eksisterende karakterføringer; den er ikke en ny regelmotor eller automatisk karakterbygger.

## Uttrykk og navigasjon

- Elfenben `#f4ecd8`, vinrødt `#8b2c34`, tekst `#302920`, sekundærtekst `#6b5c49` og grønne statusetiketter `#3d674f`. Cormorant Garamond til overskrifter/tall, Source Sans 3 til lesetekst og felt.
- Kompakt identitet med portrett eller illustrert placeholder, navn og art/klasser/nivå/subclass. Appnavn, regelutgave og versjon ligger i Meny → Om appen. Toppfeltet følger vanlig scrolling.
- Character, Combat og Utstyr har ikon og tekst i fast bunnavigasjon, med separat Meny og bevarte scrollposisjoner. Menyens innhold kan scrolles uten å miste tilgangen nederst.
- Fem statuser på Character, fire luftige modifierfavoritter og seks statusmynter. Alle forkortelser følger samme SVG-bue, tekstlengde og sentrering. Ved større skrift tilpasser myntgridet seg.
- Små overskriftsikoner og felles pillefamilie. Fire kolonner på vanlig mobilbredde, tre ved 320 px; større skrift kan redusere kolonneantallet videre. Lik størrelse per samling, også inline +. En tom samling har en kortere plusspille slik at tomme seksjoner tar mindre plass.
- En liten fylt 45° trekant i ramme-/bunnlinjefargen markerer knapper og disclosure-kontroller. Rene statuser har ingen markør. Utstyrt/forberedt vises med hake og tekst, uten egen bakgrunnsfarge. Fokus og trykk har egne, midlertidige tilstander.

## Kategoriikoner og manuell kontroll

`domain/iconography.ts` velger visuell kategori fra sikker katalog-ID, registrert våpen-/rustningstype eller det eksplisitte damage-feltet. For kjent innhold finnes også kuraterte effektfamilier som healing, beskyttelse, bevegelse, teleportering, manipulasjon og illusjon. Ukjent/sammensatt skade får ikke en vilkårlig skadetype som ikon. Ukjent kategori bruker familieikon; egne ukjente egenskaper får et nøytralt fantasyemblem.

`ui/icons.ts` inneholder egne lokale SVG-tegninger. Alle eksisterende katalogposter og artsegenskaper får et gyldig ikon; gjenbruk av kategorier er tilsiktet. Navnet beholdes som hovedinformasjon. Språk, notater, ressurser, proficiencies og øvrige strukturerte felt har konsistente familieikoner.

Egenskaper/feats, spells, egne handlinger og utstyr har et frivillig «Ikon (valgfritt)»-felt under detaljer. Valget lagres som `iconKey` på posten og kan settes tilbake til automatisk. Dette er visuell metadata; ikonvalget gir ingen spillverdier, proficiencies eller tilgang. Artsegenskapsmodellen tillater også et ikonvalg i importerte data. Ingen kataloginstanser omskrives ved oppstart for å fylle inn automatisk ikon. Det valgfrie feltet bevares i IndexedDB, kopiering, undo og JSON-backup uten ny DB-/skjemaversjon.

## HP-kontrollen

Kontrollen i Combat har et innrammet bevegelsesområde og et grep som bare viser pågående justering. Et drag bestemmer justeringen av det valgte beløpet; det skjer ingen repetisjon mens grepet holdes stille. Ved slipp, pekerkansellering eller fokusbytte går grepet til midten. Endringsbeløpet beholdes, og neste drag justerer videre fra dette.

Vanlig maks utslag per drag er inntil 50 poeng, tilpasset tilgjengelig HP, med minst 10 for håndterlig finjustering. Store verdier kan nås med flere drag eller direkte tall. ±1 og tastatur (piler, Page Up/Down, Home/End) er tilgjengelig. Tallet og forhåndsvisningen viser transaksjonen, mens slideren er nøytral mellom drag.

Justeringen begrenses fra `−(nåværende HP + temp HP)` til manglende vanlig HP. Skade tar temp først; healing endrer ikke temp. Ingen lagring før «Oppdater HP». Avbryt, tomt/ugyldig tall og nullendring skriver ikke til karakteren; lagringsfeil bevarer beløpet for ny prøve. Hele bekreftede endringen kan angres samlet. Dette er vanlig HP-føring, ikke den fremtidige flerkomponent-skadekalkulatoren.

## Dialoger og Combat

Store velgere og redigeringsflater får full mobilflate med fast topp og tilgjengelig X. Redigering har én bekreftelse nederst; X er Avbryt. Kort oppslag er kompakt med bare én X/Lukk. Destruktiv bekreftelse har Avbryt + Fjern/Slett, uten ekstra X. Innholdet scroller mellom kontrollene. Escape lukker også et aktivt søkefelt med ett trykk. Ventende lagring kan ikke avbrytes som om den var kastet; utkast, feil, fokus og retur-scroll bevares.

Combat-kategoriene kan velges med knapp eller horisontalt sveip. Vertikal bevegelse beholder vanlig scrolling. Sveip skal ikke også åpne våpen-/spelloppslaget fingeren startet på. Ingen permanent sveipeinstruksjon er lagt på arbeidsflaten. Våpen vises med større angreps-/skadeoppslag som i den valgte skissen. Tom «Andre egenskaper»-overskrift skjules. Begrensede ressurser og oppslag bruker fortsatt eksisterende registrerte data; ingen turstyring er innført.

## Offline og kilder

Fontene er uendrede OFL-filer fra samme verifiserte Google Fonts-revisjon som designstudien: `47d54ca1ebb14fd864695f1d39dc734f39017c33`. Fontene lagres lokalt og inngår i service workerens precache, sammen med SVG-er, app og regelbibliotek. Første nedlasting/caching er omtrent 2,6 MiB, hovedsakelig fonter og eksisterende SRD-data. Ingen ekstern font-/ikonserver brukes. [Font-/ikoninformasjon](../public/FONT-LICENSES.txt) og [SRD-lisens](../public/SRD-LICENSE.txt) følger publiseringen og kan åpnes fra Om appen.

## Faktisk produktgjennomgang

Alva Nattvind ble registrert gjennom UI som Elf Rogue5/Thief, STR10 DEX18 CON14 INT12 WIS14 CHA10, maks HP38. Shortsword, Dagger og Studded Leather ble lagt til fra katalogen, og skills/saves/favoritter ført manuelt: Perception+5, Stealth expertise+10, Dexterity save+7, Persuasion+3. HP ble ført til28 og temp5, GP42.50; AC16 og våpen d20+7 med1d6+4/1d4+4 piercing. Rogue-egenskapene ble lagt til fra biblioteket; Trance som artsegenskap manuelt. Portrett er et fiktivt bilde fra designstudien lastet opp gjennom UI, ikke en forhåndsutfylt karakter.

En separat Mira Stjernelys ble opprettet som Human Wizard3/Evocation, INT16, DEX14, CON14 og HP20. Fire Bolt, Mage Hand, Minor Illusion, Shield, Magic Missile og Misty Step ble lagt til fra biblioteket, med tre forberedte leveled spells og spellbook-markering. Det er ingen automatisk tildeling til Rogue-karakteren. Feat-/spellrelevans i katalogvelgeren er fortsatt et tidligere dokumentert åpent krav.

Alle hovedfaner ble kontrollert med denne caster-karakteren ved 320/390 px og 100/200 % skrift: ingen horisontal overflyt eller klippet pille-/modifier-/statustekst. UI-gjennomgangen fant og rettet tre kolonner på smal mobil, en Escape som bare tømte søket, markør som stakk utenfor portrettrammen og et lite egnet verktøyikon for Mage Hand. Meny ble harmonisert med journalens rader, og tom Combat-overskrift fjernet. Ingen full WCAG-revisjon eller fysisk mobiltest er påstått.

Bilder fra det faktiske produksjonsbygget under Pages-understien:

- [Character 390 px](images/eventyrjournal-character-390.png) / [320 px](images/eventyrjournal-character-320.png)
- [Combat](images/eventyrjournal-combat-390.png) / [HP med −8 og nøytralt grep](images/eventyrjournal-hp-390.png)
- [Utstyr](images/eventyrjournal-equipment-390.png) / [direkte katalogvelger](images/eventyrjournal-picker-390.png)
- [Kort oppslag](images/eventyrjournal-lookup-390.png) / [Meny](images/eventyrjournal-menu-390.png)
- [Miras cantrips/spells](images/eventyrjournal-spells-390.png)

## Tester og grenser

`CI=1 CHROMIUM_PATH=/usr/bin/chromium npm run check` kjører domene-/lagringstester, TypeScript, produksjonsbygg og nettlesertester. De nye kontrollene ligger i `tests/iconography.test.ts` og `tests/e2e/design.spec.ts`. Se [kravmatrisen](CHARACTER_WORKSPACE.md) for endelig resultat og gjenstående arbeid.

Tidligere fasegrenser gjelder: avansert sammensatt skade, automatisk konteksttilpasning av alle katalogvalg, komplett SRD/standardhandlinger og flere automatiske klasseregler er ikke implementert av dette temaet. Kategorisering av ikoner er ikke slik spillmessig filtrering. Ingen eksisterende karakterdata fjernes eller automatisk erstattes med eksempeldata.
