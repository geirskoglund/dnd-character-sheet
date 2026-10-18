# Papirark som funksjonell referanse

Undersøkt 2026-10-19. Formålet er å forstå faktisk føring og oppslag på karakterark og bruke dette sammen med produktkravene og v0.11-prototypen. Dette er referansearbeid; det velger ikke ferdig UI eller implementerer nye regler.

## Kilder og hva som faktisk er undersøkt

| Kilde | Undersøkt materiale | Begrensning |
| --- | --- | --- |
| [DnDTeX SampleSheet.pdf](https://github.com/rent-yr-chemicals/DnDTeX/blob/d3ea43835d1db25870b3337df7bd3e71dcbd3e6b/SampleSheet.pdf) og [prosjektets forklaring](https://github.com/rent-yr-chemicals/DnDTeX/blob/d3ea43835d1db25870b3337df7bd3e71dcbd3e6b/README.md) | Utfylt eksempel lagt over standardarkets bakgrunn. Side 1 er visuelt lest; feltoverskrifter fra alle tre sider er tekstuttrukket. PDF og kilde er fra 2020; arket viser Wizards' 2014-kreditering | Et tredjeparts eksempel, ikke en direkte nedlasting av et offisielt blankark. Feltstruktur og plassbruk er referansen; prøvekarakterens verdier er ikke regelbevis |
| [Multiclass Half Caster_EU A4.pdf](https://github.com/Yarden-zamir/fogged-town-cale/blob/411f99d2cc017359ed6d2c8a25a709509e68b691/Multiclass%20Half%20Caster_EU%20A4.pdf) | Sidene 1 og 3 i en offentlig kopi er visuelt lest. Caster-/multiclassfelt og utstyrs-/notatoppsett er undersøkt | Filen er lagret i 2025, har ni sider og identifiserer ikke entydig regelversjon eller opprinnelig opphav i det undersøkte materialet. Brukes som layout-/føringsreferanse; ingen regler utledes fra den |
| [MPMBs 2014 Character Record Sheet, README](https://github.com/morepurplemorebetter/MPMBs-Character-Record-Sheet/blob/2e4485f247bde5d295d22f303c4730848543e6f7/README.md) | Dokumentasjonen identifiserer eksplisitt 2014-utgaven og lenker til egne «Spell Sheets per Class» | Dokumentasjonen er lest. Selve MPMB-PDF-arkene er ikke åpnet i denne gjennomgangen. Prosjektets automatisering er ikke en bestilling på tilsvarende automatikk i appen |

Direkte nedlasting fra Wizards (`media.wizards.com`) og DMs Guild (`www.dmsguild.com`) ble blokkert av miljøets nettverk med HTTP 403. De er derfor ikke omtalt som undersøkte primærkilder. De to PDF-kopiene ovenfor er hentet fra GitHub og kontrollert mot sine Git-blob-ID-er. Ingen PDF-er, illustrasjoner eller utfylte personopplysninger er kopiert inn i dette repositoriet.

## Observerte arbeidsmåter

| Observasjon | Konkret kilde | Betydning for videre vurdering av appen |
| --- | --- | --- |
| Våpnene står med navn, angrepsbonus og skade/type, med korte forklaringer under | Standardeksempelet, side 1: «NAME», «ATK BONUS», «DAMAGE/TYPE», med blant annet finesse-/rekkeviddemerknader | Karakterens ferdige spillverdier og nødvendige betingelser må være enkle å slå opp fra det konkrete våpenet |
| Innhold og forklaringer kan føres kort i store tekstområder | Standardarket: «EQUIPMENT», «FEATURES & TRAITS», «OTHER PROFICIENCIES & LANGUAGES»; tilleggsside med «ADDITIONAL FEATURES & TRAITS» | Notater og egne beskrivelser er en viktig del av føringen. Struktur vurderes for det som trengs til beregning, telling og oppslag; vanlige tilfeller bør ikke kreve mange detaljfelt |
| Utstyr som bæres har egne plasser, og lager/ryggsekk er separat | Multiclass-/casterarket, side 3: Head, Amulet, Cloak, Armour, Hands/Arms, Ring, Belt, Boots og «BACKPACK/STORAGE» | Oppsettet skiller det man har på seg fra øvrige eiendeler og gjør kombinasjoner synlige. Dette er relevant for brukerens brynje-/kappeeksempel |
| Attunement er en enkel markering ved gjenstanden | Samme side: «Attuned» ved utstyr og magic items | En viktig tilstand kan gjøres tilgjengelig uten et omfattende registreringsskjema |
| Casteroppsettet samler spell attack bonus/save DC, slots, favorittspells, prepared og egne ressursfelt | Multiclass-/casterarket, side 1; MPMB-dokumentasjonen viser også klassevise spell sheets | Felles informasjon kan tilpasses karakterens faktiske behov. Klasse-, subclass-, feat-, arts- og andre tilgangskilder må fortsatt vurderes etter 2014-reglene |

## Føringer og åpne valg

- Papirarkets plassbruk og merknader er funksjonell inspirasjon. Den vedtatte mobilflyten, fem statusverdier på Character, HP-endring i Combat og øvrige brukeravklaringer gjelder fortsatt.
- Konkrete kombinasjoner vurderes etter spillreglene og DM, ikke antall trykte linjer. At ett eksempelark har to ringlinjer, fastsetter ingen generell regel om maksimalt to ringer. Unngå å gjøre et bestemt papirlayout til nye spillbegrensninger.
- Ved videre arbeid skal hver berørt flyt undersøke hva spilleren vanligvis fører direkte, hva som kan følge en kjent gjenstand/regel, hva som hører til i merknader, og hva som trenger egne verdier eller tellere.
- Et kort minimumsskjema, katalogverdier og detaljer ved behov er forslag til forenkling. Konkrete felt og visning må vurderes med spillerflyten og produktkontrollen; de er ikke bestemt av disse eksemplene alene.
- Klassespesifikke referanser skal brukes til å forstå behovene. Appen har fortsatt felles spell-/ressursmodell og skal kunne håndtere multiclass og alternative tilgangskilder.

Se [krav §1](REQUIREMENTS.md#1-produkt-og-akseptansekriterier), [datamodellen](DATA_MODEL.md) og [kravmatrisens kontrollscenarioer](CHARACTER_WORKSPACE.md#kjente-mangler-som-den-nye-kontrollen-må-fange). Referansearbeidet er ikke en utført produktgjennomgang av en ny implementasjon.
