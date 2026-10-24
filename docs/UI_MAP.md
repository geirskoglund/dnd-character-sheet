# Funksjonelt UI-kart – My D&D

Dette er inngangen til **faktisk implementert betjening**. Les navigasjonen og deretter relevant område; kartet krever ingen bilder. [Krav](REQUIREMENTS.md) og [beslutninger](DECISIONS.md) bestemmer produktet. Kartet innfører ingen nye krav og erklærer ikke alle krav levert. Historiske designforslag og leveransegjennomganger er referanser, ikke gjeldende betjeningsinstruks.

## Finn frem

| Område / mål | Innhold |
| --- | --- |
| [Character](#character) | Status, modifierfavoritter, abilities, egenskaper, spilltilstand og notater |
| [Combat](#combat) | HP, handlingskategorier, våpen-/spelloppslag og hvile |
| [Magi](#magi) | Registrerte cantrips/spells, forberedelse og slots |
| [Utstyr](#utstyr) | Inventar, bruk/håndvalg, virkninger og registrering |
| [Meny](#meny) | Karaktervalg, administrasjon, overstyringer, backup og oppdatering |
| [Karakterflyter](#karakterflyter) | Ny karakter, Rediger karakter og Level Up |
| [Felles betjening](#felles-betjening) | Lagring, lukking, felteditorer, utkast, beholdninger og hvile |
| [Kontrollgrunnlag](#kontrollgrunnlag-og-vedlikehold) | Undersøkt kode, runtimekontroll og vedlikehold |

Fast bunnavigasjon har Character, Combat, Magi, Utstyr og separat Meny. Sidene beholder hver sin scrollposisjon i sesjonen. Toppfeltet scroller med siden og viser valgt karakters portrett, navn, art, klasser/nivåer og subklasser. Trykk portrettet for bildevalg eller bildeadministrasjon; identitetsteksten er visning. Appnavn og versjon finnes under Meny → Om appen. Testappen har eget synlig testmerke.

Uten karakter viser arbeidsflaten «Et ark som er ditt» og **Opprett første karakter**. Meny tilbyr Ny karakter, import og eventuelle utkast, men ingen handlinger for «Denne karakteren»; eksport er deaktivert. Etter opprettelse/import velges karakteren. Bytt karakter i Meny for å vise et annet lokalt ark. Et uferdig Ny karakter-utkast er ennå ikke et ferdig ark.

## Felles betjening

Tabellene nedenfor bruker **Visning**, **Direkte**, **Oppslag** og **Redigering** for å skille handlingene. Samme pilleform betyr ikke samme funksjon.

| Type | Inngang, bekreftelse og retur |
| --- | --- |
| Visning | Tekst/status uten handling. Eksempel: abilities på Character. |
| Oppslag | Trykk åpner innhold med X/Lukk; Escape lukker. Enkelte oppslag inneholder egne direkte handlinger eller innganger til redigering. Lukk angrer ikke noe som allerede er lagret. |
| Direkte | Et listevalg, toggle eller en telleknapp kan lagre straks; se områdets beskrivelse. Ingen ekstra Lagre. Meny → Angre siste endring er en separat handling. |
| Redigering | Lagre/Legg til/Ferdig eller navngitt sluttknapp bekrefter. Vanlig X/Avbryt/Escape forkaster ubekreftede felt, med veiviserunntaket nedenfor. Slett/Fjern åpner egen bekreftelse; Avbryt der gir redigeringsflaten og usikrede felt tilbake. |

Dialoginnholdet ruller mellom fast topp og knapper. Lukking gir fokus/sideposisjon tilbake til inngangen eller relevant reserveknapp hvis posten er fjernet. Ved lagringsfeil står dialogen med feltene og feilen igjen for nytt forsøk; ventende lagring kan ikke avbrytes. En underliggende dialog kan bli erstattet av neste visning: Lukk betyr derfor ikke alltid tilbake til forrige popup.

### Felteditorer

Tekstfelt åpner en egen teksteditor over gjeldende flate. **OK** overfører teksten til feltet; Avbryt/X/Escape beholder gammel feltverdi. Dette lagrer ikke i seg selv den ferdige posten. Overordnet Lagre eller veiviserens sluttbekreftelse gjenstår. Lange tekstfelt vokser i den underliggende redigeringen; innholdet scroller i dialogen.

Tallpiller åpner fullskjerm tallendring fra **0 i endring**, med navn og Før/Etter. Rull hjulet eller bruk tastatur; trykk midtverdien for appens tallpanel. Panelet har siffer, fortegn og sletting uten systemtastatur over verdien. **OK** bekrefter, Avbryt/X/Escape forkaster endringen. I et skjema endres bare skjemafeltet; på en lagret beholdning/HP/penger lagrer OK selve endringen. GP bruker separate signerte GP-/CP-hjul og lagres som heltall CP. Grenser følger feltet.

### Veivisere og utkast

Ny/Rediger karakter, egne egenskaper/spells, beholdninger og utstyr har veivisere med grafisk fremdrift, relevante spørsmål og Tilbake. Direkte svar kan gå videre; tekst/tall bruker Neste. Karakterveiviseren har særskilt grupperte skjermer, se [karakterflytene](#karakterflyter).

**X/Escape bevarer svar og posisjon som separat lokalt utkast**, også etter reload/offline. Meny viser alle utkast; Utstyr viser i tillegg valgt karakters utstyrsutkast. Fortsett gjenåpner flyten og velger eierkarakteren ved behov. Sluttknappen lagrer ferdige data og fjerner utkastet samlet. Før det vises siste bekreftede post fortsatt i app/Combat; nye utkast er ikke ferdige poster. **Forkast utkast** krever egen bekreftelse og endrer ikke ferdige data. Utkast følger backup, men ikke Kopier karakter. Konflikt med nyere utkast eller endret original gir feil fremfor overskriving.

**Flere detaljer** i egenskaps-/spellveiviseren åpner et avansert skjema med egen Lagre/Avbryt. Disse detaljfeltene er ikke automatisk bevart som veivisersvar; avbryt lukker skjemaet, mens tidligere veiviserutkast kan fortsettes fra Meny.

### Beholdninger og hvile

Trykk en beholdningspille (tilgjengelig/maks, eventuelt terning) for oppslag. **Bruk én / Gi tilbake én** lagrer og lukker direkte, begrenset til 0–maks. Trykk totalen for tallendring; OK lagrer og viser beholdningsoppslaget igjen. **Tilpass** åpner veiviser for navn, maks, tilgjengelig og relevant gjenoppretting. Ny egen beholdning finnes på Character; manuelt slotoppsett finnes på Magi og Hit Dice-oppsett under Hvile. Disse har egne system-/nivå-/terningvalg. Automatiske beholdninger kan dempes til maks 0 via tilpasning/fjerning; de behandles ikke som en ny manuell beholdning ved neste beregning.

**Hvile** finnes på Character, Combat og Magi: velg Kort/Lang hvile eller åpne Hit Dice per klasse/terning. Hit Dice brukes med teller, og HP føres separat via Endre HP. Hvilevalget åpner forhåndsvisning av faktiske endringer, eventuelle vilkår som må bekreftes, og ved tvetydig lang-hvilefordeling valg av Hit Dice å få tilbake. **Fullfør hvilen** lagrer samlet; Avbryt/X lagrer ingen hvile. Ingen automatisk tilstands-/exhaustion-fjerning. Dette er dagens enkle hvileflate; en samlet ny kort-hvileflyt er fortsatt utenfor leveransen, se [krav §13](REQUIREMENTS.md#13-konseptuell-opprydding-og-arbeidsflyter-2026-10-20).

## Character

| Seksjon / element | Hva vises og hva gjør trykk? |
| --- | --- |
| Karakterstatus | HP/maks, AC, Initiative og Speed er **visning**. GP er **redigering** med tallendring; OK lagrer. HP føres fra Combat, AC/speed/øvrige overstyringer fra Meny. |
| Modifiers | Fire favoritter med beregnede modifiers. **Oppslag/listevalg:** trykk kortet → velg en annen modifier → favoritten lagres direkte og velgeren lukkes. Dette endrer favoritt, ikke proficiency eller grunnscore. |
| Ability scores | Seks **skrivebeskyttede** effektive scores med modifiers, inkludert aktive utstyrsbidrag. Grunnverdier redigeres i Meny → Rediger karakter. |
| Artsegenskaper | Artens innebygde traits åpner bare regeltekst. Manuelt registrerte artsegenskaper åpner egenskapsoppslag med Tilpass/Fjern. + starter egen artsegenskapsveiviser. |
| Class Features & Feats | Piller med navn og eventuell ressursstatus/Feat. Trykk → oppslag → Tilpass eller bekreftet Fjern. + åpner bibliotek; se nedenfor. |
| Beholdninger | Egne/klasse-/utstyrsrelaterte custom-beholdninger med tilgjengelig/maks. + starter Ny beholdning. Betjening følger [felles beholdninger](#beholdninger-og-hvile). |
| Egne handlinger | Selvstendige handlinger med handlingstype; kildeavledede handlinger listes ikke her. Trykk eller + åpner **redigering** av navn, type, beskrivelse, regeltekst, angrep/skade, Save DC, rekkevidde, krav og ressurskoblinger. Lagre bekrefter. Combat er oppslagsflaten. |
| Tilstander | Inspiration toggles og **lagres direkte**. Death saves åpner redigering av 0–3 vellykkede/mislykkede. Conditions og Exhaustion åpner samme redigering med tilstandsvalg, egne tilstander og exhaustion 0–6. Lagre bekrefter. Hvile åpner felles hvileflate. |
| Languages | Faste artsspråk og egne språk. Pille åpner språkredigering, + nytt språk; Lagre/Fjern bekrefter. Redigering av et grunnspråk gjør språklisten eksplisitt redigerbar på karakteren. |
| Proficiencies | Registrerte skills, saves og øvrige armor/weapon/tool/andre proficiencies. Pille eller + åpner skjema med relevant type, proficiency/expertise og manuelle verdier; Lagre bekrefter, Fjern krever bekreftelse. Endring oppdaterer beregnede modifiers. |
| Skadeegenskaper / Tilstandsimmuniteter | Manuelle poster åpner **redigering** (type, resistance/vulnerability/immunity og eventuelt vilkår; eller immun tilstand). + oppretter tilsvarende. Bidrag fra aktivt utstyr viser kilden og åpner **gjenstandsoppslaget**, ikke samme editor som manuelle poster. |
| Notater | Pille åpner **Notat** med tittel/tekst; + **Nytt notat**. Lagre bekrefter. Eksisterende notat har søppelbøtte ved Lagre, med slettingsbekreftelse. Avbrutt sletting bevarer usikret tekst. X er vanlig avbryt, ikke vedvarende notatutkast. |

**Bibliotek for egenskaper/feats:** + → søk i SRD 5.1, type Egenskaper/Feats, klassefilter (Mine klasser som standard) og valgfri forutsetnings-/nivåoverstyring. Generelle feats kan finnes uten klassetilknytning. Direkte katalogvalg registrerer og lukker; en registrert egenskap kan ikke legges til igjen via samme direkteknapp. Tilpass ved et treff eller Opprett egen starter veiviser med navn/kategori/beskrivelse. **Flere detaljer** gir avansert redigering, blant annet egen handling, begrenset ressurs/koblinger, passiv skadeeffekt, ekstra magitilgang og ikon. Lagre der bekrefter samlet. Biblioteket er et innholdsutvalg; det er ikke hele produktomfanget.

## Combat

| Element | Informasjon og betjening |
| --- | --- |
| HP / Temporary HP | **Redigering:** HP-pillen korrigerer bare vanlig HP mellom 0 og effektiv maks; temp HP bevares. Temporary HP-pillen endrer total temp HP via et delta, uten automatisk stabling. OK lagrer. |
| AC / Initiative | **Visning** fra samme karakterberegninger som Character; overstyr via Meny. |
| Spell slots | Vises når slike beholdninger finnes. Pille åpner [beholdningsoppslaget](#beholdninger-og-hvile); antall slots føres eksplisitt. |
| Action / Bonus / Reaction | Trykk kategori eller sveip horisontalt mellom kategoriene; vertikal bevegelse scroller. Valget endrer oppslagene og er ingen utført handling/tur. |
| Våpenkort | Action viser våpen i bruk, Bonus relevante off-hand-våpen; angrep/skade, hånd og ekstraskade vises. Trykk åpner våpenoppslag med beregningsgrunnlag. Det kastes ingen terninger. Bruk/hånd/redigering finnes på Utstyr. |
| Spells og handlinger | Handlingstype og faktisk spelltilgang/forberedelse bestemmer hva som vises. Trykk åpner regeltekst, angrep/skade/Save DC/rekkevidde/krav og eventuelle ressursknapper. Oppslaget bruker ingen slot eller ressurs automatisk. Ressursknappen åpner separat beholdning. |
| Utstyrseffekter | Aktivt utstyr med angitt Action/Bonus/Reaction viser effekttekst i tilsvarende kategori; navnet åpner gjenstandsoppslag. Egen bruksteller har direkte −/+ som lagrer uten å lukke siden. |
| Andre egenskaper | Vises bare ved innhold: handlinger uten handlingstype/passive og aktive utstyrseffekter som er passive/ikke avklart. Ikke avklart er merket. |
| Ta skade / Hvile | Ta skade åpner tallendring som bare tillater reduksjon, bruker temp HP først og viser Før/Etter; OK lagrer. Hvile åpner felles hvileflate. |

**Avgrensning mot krav:** Ta skade er i dag enkel HP-føring. Flere samtidige skadetyper, individuelle vilkår og strukturert reduksjonsberegning fra [krav §4](REQUIREMENTS.md#4-ta-skade--høyprioritert-akseptansetest) er ikke tilgjengelige her, selv om skadeegenskaper og passive effekter kan registreres. Dette er et gjenværende krav, ingen ny produktbeslutning.

## Magi

Magi er tilgjengelig også uten caster-klasse; egne spells kan registreres. Castingverdier vises bare for gjenkjente tilgangskilder med ability: kildenavn, Spell attack og Save DC. Klasse, faktisk klassenivå, subclass og registrert ekstra tilgang påvirker bibliotek/bruk. At en spell står på arket, betyr ikke at den er forberedt eller vises i Combat.

| Element | Informasjon og betjening |
| --- | --- |
| Cantrips / Spells | Alle registrerte poster, uavhengig av Combat-utvalg. Cantrips viser ∞; spells sorteres på nivå/navn og viser eventuell Spellbook, kilde og Forberedt/Alltid forberedt. Trykk åpner **oppslag** med regeltekst, nivå, casting time/range/duration, komponenter og registrert attack/save/damage. Tilpass starter veiviser; Fjern krever bekreftelse. |
| + per samling | Bibliotek med søk, Mine/Alle/bestemt klasse, nivåfilter for spells og forutsetningsoverstyring. Direkte katalogvalg lagrer/lukker; ved flere relevante kilder velges kilde først. Tilpass eller Opprett egen åpner veiviser for navn, nivå (cantrip = 0), beskrivelse og Tilgang fra. |
| Flere detaljer | Fra veiviseren: avansert skjema for klassekobling, nivå, casting time, action economy, range, duration, concentration, ritual, components, Known, I spellbook, Prepared, slotsystem, attack/save/damage, beskrivelse/upcasting og ikon. Lagre bekrefter; vanlig Avbryt gjelder. |
| Forbered spells | Vises bare når minst én registrert klasse har forberedelsesstøtte. Velg klasse ved flere → søk og avkryssing. Wizard bruker egen bok; andre støttede klasser får relevante kandidater. Alltid forberedte er låst avkrysset og teller ikke mot vanlig grense. Antall/maks vises; over grensen gir DM-varsel og kan bekreftes. **Ferdig** lagrer; X avbryter. |
| Spell slots | Samme beholdninger som Combat; trykk for bruk/tilbakeføring/tilpasning. **Manuelt slotoppsett** kan foldes ut og starte egen slotbeholdning. |
| Hvile | Åpner [felles hvileflate](#beholdninger-og-hvile). |

Kontekstfiltre har Alle klasser/overstyring/egen registrering som manuelle veier. De fjerner ikke eksisterende registreringer. Det finnes ingen «cast og trekk slot»-knapp eller full regelmotor; [kravgrunnlaget](REQUIREMENTS.md#overordnet-føring--regelgrunnlag-og-omfang) er større enn dagens lokale katalog og automatiske støtte.

## Utstyr

AC vises øverst; **AC-grunnlag** foldes ut for forklaring. Konflikter/advarsler vises ved relevante oppsett. Inventaret er delt i **Weapons**, **Armor og skjold** og **Annet utstyr**, med + per gruppe. I bruk sorteres først; piller viser navn, våpenangrep/skade eller AC/attunement, hånd/I bruk og eventuelt I sekken/ekstraskade. Trykk åpner gjenstandsoppslag, ikke automatisk utstyring.

| Inngang | Handling og lagring |
| --- | --- |
| + → søk i gruppen | Direkte katalogvalg registrerer gjenstanden som **eid, ikke i bruk**, og lukker. Tilpass ved treff eller Opprett eget utstyr starter veiviseren. |
| Gjenstandsoppslag | Våpen har håndvalg (Ikke i bruk/venstre/høyre/begge etter profil), øvrige gjenstander I bruk. Attuned finnes ved krav om attunement, Melee/Thrown ved relevant profil. Disse valgene **lagres direkte** og oppslaget oppdateres. Håndkonflikt ber om eksplisitt DM-bekreftelse. Lukk angrer ikke lagrede valg. |
| Innhold i oppslaget | Angrep/skade, bidrag/beskyttelser, Andre effekter, merknad og utfoldbart beregningsgrunnlag. Eventuell bruksteller har direkte −/+. Inaktive attunement-tillegg merkes; eid og i bruk er forskjellige tilstander. |
| Rediger gjenstanden | Åpner samme veiviser med eksisterende data. Navn → samlet «Hva gjør gjenstanden?» med virkninger; merknad/attunement og Antall for annet enn våpen ligger under egne innganger. Våpen bruker Kopier, ikke antallsfelt. |
| + Legg til virkning | Velg mål: abilities, kamp/bevegelse, skill/save, beskyttelse, ekstraskade eller én friteksteffekt. Relevante spørsmål følger: bidrag/minsteverdi, beløp, terning/uttrykk, skadetype og vilkår; friteksteffekt har aktivering og eventuell begrenset bruk/gjenoppretting. Avbryt/Fjern denne virkningen endrer arbeidsutkastet frem til sluttlagring. |
| Lagre i veiviseren | Kan brukes fra aktuell flate; ufullstendige nødvendige opplysninger etterspørres. Eget våpen uten grunnlag må velge grunnvåpen; egen rustning må angi AC-grunnlag/Dex-regel. Når gjenstanden ikke er i bruk, kommer et siste bruk-/håndspørsmål; svaret lagrer/lukker. Ellers lagres direkte. X bevarer bare utkast, se [felles flyt](#veivisere-og-utkast). |
| Kopier / Fjern fra utstyrslisten | Kopier lagrer uavhengig gjenstand og lukker. Fjern krever bekreftelse og fjerner posten; for bare å legge den bort brukes Ikke i bruk. Angre finnes i Meny. |

Utstyrsutkast vises over inventaret. **Eldre utkast** uten dagens editorformat fullføres med kompatibilitetsveiviser; dette er ikke vanlig nyregistrering. [Utstyrsguiden](EQUIPMENT.md) beskriver beregninger nærmere. Betinget tekst er regel-/DM-informasjon, ikke automatisk tolket logikk.

## Meny

Åpnes fra separat knapp nederst; trykk utenfor eller Escape lukker. En valgt menyhandling lukker menyen før neste flate åpnes.

| Gruppe / handling | Resultat |
| --- | --- |
| Denne karakteren | Rediger karakter og Level Up åpner [flytene nedenfor](#karakterflyter). Portrett åpner bildevalg uten eksisterende bilde, ellers visning med Bytt/Fjern. Valg lagres direkte; fjerning bekreftes. |
| Beregninger og overstyringer | Viser AC-/speed-grunnlag og advarsler. Rediger manuell AC, speed, proficiency bonus, Initiative, Passive Perception og Unarmored Defense-valg. Tom overstyring bruker beregning. Lagre bekrefter; X forkaster ubekreftede felt. Endrer ikke ability-grunnverdier. |
| Endringslogg / Angre siste endring | Loggen er lesing av bekreftede hendelser. Angre er en direkte lagringshandling for siste angrerbare endring på valgt karakter; det er ikke en vilkårlig historikkgjenoppretting eller en måte å hente slettet karakter på. Manglende angremulighet/konflikt gir feil. |
| Utkast | Vises bare ved utkast. Fortsett gjenåpner riktig flyt, også uferdig ny karakter. |
| Bytt / Ny / Kopier / Slett karakter | Bytt viser valgt ark og bevarer sidevalget. Ny starter tom karakterveiviser. Kopier lagrer og velger en uavhengig kopi av ferdige data. Slett krever bekreftelse; neste tilgjengelige karakter eller tomtilstanden vises. Sletting gjenopprettes via backup, ikke vanlig Angre. |
| Eksporter backup | Laster ned JSON med lokale karakterer, portretter og utkast; ingen karakterendring. Deaktivert uten ferdige karakterer. |
| Importer backup | Filvalg → Importer. Legger til karakterer og velger første importerte; overskriver aldri eksisterende ID. Feil/ID-kollisjon avviser hele importen. X avbryter filskjemaet. |
| Om appen / Se etter oppdatering | Om appen viser navn, 2014-grunnlag, versjon og lisenslenker. Manuell sjekk søker etter ny apputgave; ny nedlastet utgave aktiveres eksplisitt med Oppdater appen. [Oppdateringsguiden](UPDATES.md) beskriver åpne redigeringer/andre faner og feilsøking. |

Lagringen er lokal på enheten/nettleseren og separat for app/test. Nettleserdata skal ikke slettes for å oppdatere. [Test-/installasjonsguiden](TESTING.md) angir faste adresser og miljøskillet.

## Karakterflyter

### Ny karakter

Tomtilstand → Opprett første karakter, eller Meny → Ny karakter. Syv skjermer: **navn → art → klasser → subklasser → klassenivåer → abilities → maks HP**. Navn og minst én klasse kreves. Art/klasse/subklasse velges fra katalog; Ingen / ikke valgt er gyldig subclass. Klasseknapper toggles på samme skjerm; Neste går videre. Alle subklasser, alle klassenivåer og de seks abilities er samlet på hver sin skjerm. Tilbake bevarer svar for fortsatt valgte klasser.

Nye abilities starter på 10, valgte klasser på nivå 1 og maks HP på 2. Tallene registreres manuelt fra arket; det kastes ikke HP og artsbonuser legges ikke på igjen. Positive hele klassenivåer kan overstige 20; totalt nivå er summen. **Lagre** på siste skjerm oppretter karakteren, velger den, setter current HP = maks og temp HP = 0 og fjerner utkastet. Ingen ferdig karakter før dette. Utstyr, feats, spells, proficiencies og spilltilstand føres fra områdene etterpå; automatisk full karakterbygging finnes ikke.

### Rediger karakter

Meny → Rediger karakter bruker de samme syv skjermene med eksisterende verdier. Navn, art, klasseutvalg, subklasser, klassenivåer, ability-**grunnverdier** og maks HP kan endres. Tidligere registrerte katalogfrie svar kan beholdes, men nye fritekstgrener for art/klasse/subklasse tilbys ikke. Fjerning av en klasse fjerner dens rad; fortsatt valgte klasser beholder sine svar.

**Lagre** bekrefter samlet. Current HP, temp HP og øvrige registreringer/overstyringer bevares. Ny art gjør ikke appen til automatisk ombygger av feats/spells/proficiencies. Effektive abilities på Character kan derfor avvike fra grunnverdiene her på grunn av aktivt utstyr. X/Escape beholder eget utkast; siste bekreftede karakter vises til utkastet fullføres eller forkastes.

### Level Up

Meny → Level Up åpner et separat skjema, **ikke** syvskjermsveiviseren. Det viser totalt nivå før/etter og klassen som øker. Med flere klasser velges én eksisterende klasse. Subclass kan velges, og **ny samlet maks HP** må føres, minst lik tidligere maks. **Bekreft Level Up** øker valgt klasse og totalnivå med én, lagrer maks HP og subclass; current/temp HP bevares. Standardressurser oppdateres fra støttet klassegrunnlag med brukt kapasitet bevart; øvrige valg/egenskaper/spells føres manuelt.

Uten klasse sendes brukeren til Rediger karakter. Ved totalt nivå ≥20 åpnes ikke nivåøkningen; meldingen henviser til Rediger karakter for korreksjon. Ny klasse, abilities og manuell nivåføring over 20 gjøres i Rediger karakter. X/Escape avbryter Level Up uten vedvarende utkast. Dette er eksisterende progresjonsavgrensning, ikke en ny grense for hvilke karakterer produktet skal kunne representere.

## Kontrollgrunnlag og vedlikehold

Etablert mot master **`624d8c0d5c0ce2f961da11202d81c31d8c4ece1a`**, kontrollert 24. oktober 2026. Dokumentasjonsleveransen endrer ingen appkode. Kodegrunnlaget er undersøkt per område:

| Område | Primære kodeinnganger |
| --- | --- |
| Navigasjon/Meny/karakterflyter | [main.ts](../src/main.ts), [character-form.ts](../src/ui/character-form.ts), [level-up.ts](../src/domain/level-up.ts) |
| Character/Combat/Magi/Utstyr | [views.ts](../src/ui/views.ts) og hendelsesbindingene i main.ts; [combat-swipe.ts](../src/ui/combat-swipe.ts) |
| Egenskaper/spells/forberedelse | [library-picker.ts](../src/ui/library-picker.ts), [guided-records.ts](../src/ui/guided-records.ts), [record-dialogs.ts](../src/ui/record-dialogs.ts), [record-editors.ts](../src/ui/record-editors.ts), [preparation.ts](../src/ui/preparation.ts), [magic.ts](../src/domain/magic.ts) |
| Utstyr/beregninger | [equipment-picker.ts](../src/ui/equipment-picker.ts), [equipment-wizard.ts](../src/ui/equipment-wizard.ts), [equipment-markup.ts](../src/ui/equipment-markup.ts), [equipment.ts](../src/domain/equipment.ts), [item-effects.ts](../src/domain/item-effects.ts), [derived.ts](../src/domain/derived.ts) |
| Felles flater/lagring | [dialog.ts](../src/ui/dialog.ts), [wizard.ts](../src/ui/wizard.ts), [text-editor.ts](../src/ui/text-editor.ts), [number-change-dialog.ts](../src/ui/number-change-dialog.ts), [hp-control.ts](../src/ui/hp-control.ts), [resource-dialogs.ts](../src/ui/resource-dialogs.ts), [database.ts](../src/storage/database.ts) |

Beskrivelsene ovenfor er kontrollert ved kodegjennomgang, inkludert videre kall til lagring og domene. Lokal runtimekontroll ble forsøkt, men bygg/preview stopper i miljøet med `spawnSync git EPERM` i Vite-konfigurasjonen før appen starter; ingen runtimepåstander bygger på dette forsøket. Dokumentasjons-PR-en oppgir kontrollene. Lesing av kode er ikke fysisk iPhone-/PWA-verifikasjon. Utseende, OS-tastatur og fysisk installasjon er ikke dokumentert som prøvd gjennom dette kartet. Regelstøtte vurderes fortsatt mot krav og aktuell oppgave, ikke bare mot at en knapp eller et datafelt finnes.

Ved UI-/flytendringer skal berørte beskrivelser oppdateres i **samme leveranse og PR**. Nye hovedområder legges til; fjernet/erstattet atferd tas ut av gjeldende beskrivelse. Klargjøring bruker kartet og angir dokumentasjonsbehov i issuet; implementasjon undersøker aktuell kode, retter kartet og samordner berørte innganger/guider. Se [AGENTS.md](../AGENTS.md#arbeidsfordeling-og-dokumentasjonsansvar). Ingen separat statuslogg eller generell omskriving av historikk kreves.
