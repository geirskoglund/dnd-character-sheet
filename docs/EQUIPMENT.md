# Utstyr: føring og oppslag

Appen erstatter papirarket ved spillebordet. Katalogen gir sikre grunnverdier, mens spilleren fører egne tillegg og vurderer betingelser med DM.

## Legg til

Åpne + under Weapons, Armor og skjold eller Annet utstyr. Inngangen bestemmer listen; søkefeltet har hintet «Søk». Velg en katalograd for å legge den rett til, eller Tilpass for en egen variant. Opprett eget utstyr står under listen. Egne våpen velger et grunnvåpen og arver profil/ikon.

Den illustrerte veiviseren spør om navn og viser en samlet virkningsoversikt. Velg **+ Legg til virkning** for å føre bare det som gjelder. Hver spørsmålsflate har én verdi eller ett valg. Grunnvåpenets ferdige profil gjentas ikke som et stort skjema.

- **Skadebonus** er et fast positivt/negativt tillegg. **Ekstraskade** har egne terninger, skadetype og eventuell betingelse. Betingelsen følger akkurat denne ekstraskaden, også i Combat.
- **Ability scores** kan få et bidrag eller «Hev til minst». CON14 med minst19 vises som19; CON20 forblir20. Grunnverdien lagres separat. Total HP fra karakterarket justeres fortsatt manuelt ved level-up; en ny CON-verdi rekonstruerer ikke HP-historikken.
- Andre støttede bidrag gjelder AC, våpenangrep/skade, speed, initiative, maks HP, skills og saving throws. Aktive bidrag brukes i relevante beregninger. En eksplisitt manuell total har fortsatt prioritet. Tekstvilkår vises og anvendes ikke automatisk.
- Beskyttelser velges etter skadetype eller tilstand. De vises med gjenstanden som kilde; appen utfører ingen automatisk skaderesolusjon.
- **Andre effekter → + Effekt** redigerer én spillmessig tekst. Valgfri handlingstype beskriver hva reglene/DM krever. Ikke avklart er tillatt og vises under Andre egenskaper i Combat; passiv vises også der. Ingen spellkobling kreves.
- En effekt kan ha en bruksteller med maks og gjenoppretting. Tilgjengelig starter på maks. Short/long rest bruker den samme ressursen som item, Combat og Beholdninger. Daggry er en manuell særregel, og blir ikke automatisk gjenopprettet ved hvile.

Merknad og attunement ligger separat. Merknaden gjelder opphav, utseende eller historie, og erstatter ikke effektbeskrivelsen. Antall finnes separat for andre gjenstander; våpen føres som individuelle oppføringer.

## Lagre eller fortsett senere

Lagre finnes direkte i arbeidsflaten og de enkelte spørsmålene. Nødvendige manglende svar vises før bekreftelse. Hvis gjenstanden ennå ikke er i bruk, avsluttes flyten med et bruksspørsmål; deretter lagres den og popupen lukkes. Eksisterende bruk beholdes uten nytt spørsmål.

X/Escape bevarer et lokalt utkast med samme spørsmål og svar. Den opprinnelige gjenstanden endres først ved Lagre. Forkast utkast er en egen bekreftet handling. Lagringsfeil holder skjermen åpen med tydelig feil; to faner kan ikke stille overskrive samme utkast eller en nyere original. Backup tar med utkast. Tvangslukking mens en skriving fortsatt pågår følger nettleserens vanlige begrensninger.

## Bruk under spill

Et utstyrsoppslag har bruk/håndvalg øverst. Disse raske valgene lagres direkte. Våpen velger Ikke i bruk, Venstre hånd, Høyre hånd eller Begge hender der profilen tillater det. Konflikter varsles med mulighet til å beholde et DM-unntak. **Kopier** lager en selvstendig oppføring uten å ta den i bruk eller attune den automatisk.

Vanlig 2014 two-weapon fighting vises når to passende lette melee-våpen er i hver sin hånd. Bonusangrep utelater positiv ability modifier fra skade uten relevant registrert fighting style, men beholder negativ modifier og magiske bonuser. Ingen hånd låses permanent til Bonus Action. Appen følger ikke turer og utfører ingen angrep.

Utstyrsvirkninger gjelder når gjenstanden er i bruk, finnes i antall>0 og har nødvendig attunement. Grunnscore/profil/manuelle totaler forblir lagret. Å legge bort en gjenstand klipper ikke nåværende HP stille. Eldre bonusfelt, egne profiler og manuelle totaler bevares; manuelle våpentotaler og eget AC-grunnlag finnes som valg under Merknad og attunement når relevant. Eldre utkast bruker en kompatibel fortsettelsesflyt. Eldre våpenantall blir først separate oppføringer ved uttrykkelig lagring.

Fjern fra utstyrslisten krever bekreftelse og kan angres. Andre eiere sine delte referanser beholdes. For å legge bort noe velges Ikke i bruk.

## Kontroll og avgrensning

Se [kravmatrisen](CHARACTER_WORKSPACE.md#før-koding-kontroll-utstyrsflyt-i-hovedappen), [datamodellen](DATA_MODEL.md#utstyrsvirkninger-fra-den-godkjente-veiviseren) og [observerte mobilflater](reviews/equipment-app/README.md). Beregningen støtter avklarte enkle bidrag og eksisterende klassespesifikke våpenregler. Den tolker ikke fritekst eller alle magiske særregler, og erstatter ikke DM. Ny magisk katalog, full regeldekning og utsatte arbeidsflyter er fortsatt egne krav. Installasjonsnavn, ikonvalg og lavere bunnmeny er loggført separat i krav §17.

## Bevarte klasse- og katalogberegninger

- Light armor legger til DEX; medium har sin angitte positive grense og beholder negativ DEX; heavy legger ikke til DEX. Rustningens eventuelle AC-bonus og ett skjold legges til. Flere rustninger/skjold varsles og bare den høyeste enkeltverdien brukes. Uten rustning beholdes tidligere Unarmored Defense-regler.
- Katalogens faste AC-/save-bonuser teller bare fra gjenstander med positivt antall i bruk og oppfylt eventuell attunement. Antall multipliserer ikke en bonus; flere kopier av samme katalogførte magiske gjenstand stabler ikke effekten. Egne fortryllelser på vanlige gjenstander regnes som eksplisitte, uavhengige DM-bidrag. Ulike gjenstander, som Cloak og Ring of Protection, kan bidra sammen. Katalogen har 237 vanlige gjenstander og to kuraterte protection-gjenstander; den er ikke et komplett magic-item-bibliotek.
- Angrep = relevant ability modifier + proficiency når kjent + våpenets angrepsbonus + støttede egenskaper. Melee bruker STR, ranged DEX, finesse beste STR/DEX, kastet melee-våpen beholder sin melee-ability. Proficiency bonus bruker samlet karakterlevel eller manuell overstyring; proficiency legges normalt ikke til skade.
- Skade bruker våpenets grunnterninger/skadetype, valgt én/tohåndsbruk for versatile, relevant ability og eksplisitte skadebonuser. Net får ingen oppdiktet skade. Rekkevidde, thrown range, reach og særlige lance-/net-regler bevares.
- Støttede registrerte Fighting Styles: Archery, Dueling, Defense og Two-Weapon Fighting. Great Weapon Fighting vises som regeltekst for fysisk omkast. Monk Martial Arts bruker monk-klassenivå, våpenkrav og rustning/skjold-vilkår for ability/terning. Rogue Sneak Attack vises som betinget tilleggstekst, ikke permanent ekstra grunnskade. Ingen automatisk tildeling av feats/egenskaper ved opprettelse/Level Up.
- Off-hand-valg vises under Bonus når to separate lette enhånds-melee-våpen er i hver sin hånd. Positiv ability legges ikke til off-hand-skade uten Two-Weapon Fighting; negativ beholdes. Dette er oppslag, uten «brukt»-status eller digitalt kast.
- Manglende armor proficiency gir forklarende regeladvarsel, ikke blokkering eller endret AC. Flere enn tre attuned, håndkonflikter og bevisst enhåndsbruk av Two-Handed varsles. Ukjent klasse/profil behandles som usikker, ikke som forbud mot eierskap.

Proficiency kommer først fra eksplisitt våpenvalg eller registrerte proficiencies, deretter fra kjente 2014-klasser. Ved multiclass brukes **første registrerte klasse som startklasse**, senere klasser gir de begrensede multiclass-proficiencies. Dette vises i våpenets beregningsgrunnlag. Arket krever ikke historisk level-bygging: korriger faktisk tilgang via Proficiencies eller manuelt våpenvalg dersom registreringsrekkefølgen ikke svarer til startklassen. Egne klassenavn blir ikke tolket som katalogklasser.

Manuell AC og manuelle attack/damage-totaler erstatter beregnet total, med tydelig merking. Manuell save-total erstatter også utstyrsbonuser. Vanlig katalogtekst som historisk lå i damage-feltet regnes fortsatt som grunnskade; endret tekst bevares som manuell total.


Kilde er SRD 5.1 (2014); strukturert våpendata er kontrollert mot 5e-bits/5e-database revisjon `a6212beb4b278917c2cff41c2b04c4ef4f3e0d6f`, Equipment/Classes/Magic-Items. Se [lisens](../public/SRD-LICENSE.txt). Ingen kopiert kode eller persondata fra papirarkreferansene.
