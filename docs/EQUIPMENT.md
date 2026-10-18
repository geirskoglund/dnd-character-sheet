# Utstyr: føring og beregningskontrakt

Gjeldende bestilling 2026-10-19: [krav §11](REQUIREMENTS.md#11-enkel-utstyr-fane-og-avgrensede-beregninger-vedtatt-2026-10-19), [beslutninger](DECISIONS.md#godkjent-implementasjon-enkel-utstyr-fane-2026-10-19). Et digitalt papirark, uten kroppsrutenett eller kampautomatisering.

## Brukerflyt

Character viser karakterverdier; Combat viser aktuelle kampoppslag; **Utstyr** administrerer gjenstandene. Alle bruker samme lagrede karakter. Tre uavhengige scrollposisjoner beholdes i sesjonen.

Utstyr har de tidligere avklarte gruppene Weapons, Armor og skjold, Annet utstyr. I bruk sorteres først; øvrige poster merkes I sekken. Inline + åpner filtrert, søkbart katalogvalg direkte. Ett trykk på katalogposten lagrer den med standardverdiene. Manglende proficiency skjuler ikke gjenstander man kan eie. Rustning er normalt ett komplett sett.

Trykk på egen gjenstand åpner direkte redigering med aktuelle verdier, navn og I bruk. Våpen har håndbruk og eventuelt kast; attunement vises når gjenstanden krever det. «Tilpass gjenstanden» gir kategori, antall, faste bonuser, regelprofil, manuelle totaler og notat. Eget vanlig utstyr kan registreres med bare et navn fra riktig gruppe. Ingen ekstra oppsummeringspopup eller dobbelt Lukk/Avbryt innføres. Rene Combat-oppslag har én Lukk; redigering har Lagre/Avbryt.

## Beregninger

- Light armor legger til DEX; medium har sin angitte positive grense og beholder negativ DEX; heavy legger ikke til DEX. Rustningens eventuelle AC-bonus og ett skjold legges til. Flere rustninger/skjold varsles og bare den høyeste enkeltverdien brukes. Uten rustning beholdes tidligere Unarmored Defense-regler.
- Øvrige eksplisitte AC-/save-bonuser teller bare fra gjenstander med positivt antall i bruk og oppfylt eventuell attunement. Antall multipliserer ikke en bonus; flere kopier av samme katalogførte magiske gjenstand stabler ikke effekten. Egne fortryllelser på vanlige gjenstander regnes som eksplisitte, uavhengige DM-bidrag. Ulike gjenstander, som Cloak og Ring of Protection, kan bidra sammen. Katalogen har 237 vanlige gjenstander og to kuraterte protection-gjenstander; den er ikke et komplett magic-item-bibliotek.
- Angrep = relevant ability modifier + proficiency når kjent + våpenets angrepsbonus + støttede egenskaper. Melee bruker STR, ranged DEX, finesse beste STR/DEX, kastet melee-våpen beholder sin melee-ability. Proficiency bonus bruker samlet karakterlevel eller manuell overstyring; proficiency legges normalt ikke til skade.
- Skade bruker våpenets grunnterninger/skadetype, valgt én/tohåndsbruk for versatile, relevant ability og eksplisitte skadebonuser. Net får ingen oppdiktet skade. Rekkevidde, thrown range, reach og særlige lance-/net-regler bevares.
- Støttede registrerte Fighting Styles: Archery, Dueling, Defense og Two-Weapon Fighting. Great Weapon Fighting vises som regeltekst for fysisk omkast. Monk Martial Arts bruker monk-klassenivå, våpenkrav og rustning/skjold-vilkår for ability/terning. Rogue Sneak Attack vises som betinget tilleggstekst, ikke permanent ekstra grunnskade. Ingen automatisk tildeling av feats/egenskaper ved opprettelse/Level Up.
- Off-hand-valg vises under Bonus når minst to separate lette enhånds-melee-våpen er i bruk. Positiv ability legges ikke til off-hand-skade uten Two-Weapon Fighting; negativ beholdes. Dette er oppslag, uten «brukt»-status eller digitalt kast.
- Manglende armor proficiency gir forklarende regeladvarsel, ikke blokkering eller endret AC. Flere enn tre attuned, håndkonflikter og bevisst enhåndsbruk av Two-Handed varsles. Ukjent klasse/profil behandles som usikker, ikke som forbud mot eierskap.

Proficiency kommer først fra eksplisitt våpenvalg eller registrerte proficiencies, deretter fra kjente 2014-klasser. Ved multiclass brukes **første registrerte klasse som startklasse**, senere klasser gir de begrensede multiclass-proficiencies. Dette vises i våpenets beregningsgrunnlag. Arket krever ikke historisk level-bygging: korriger faktisk tilgang via Proficiencies eller manuelt våpenvalg dersom registreringsrekkefølgen ikke svarer til startklassen. Egne klassenavn blir ikke tolket som katalogklasser.

Manuell AC og manuelle attack/damage-totaler erstatter beregnet total, med tydelig merking. Manuell save-total erstatter også utstyrsbonuser. Vanlig katalogtekst som historisk lå i damage-feltet regnes fortsatt som grunnskade; endret tekst bevares som manuell total.

## Grenser og data

Sammensatte/ukjente effekter lagres som merknader eller eksisterende strukturerte referanser uten automatisk tolkning. Vilkår som måltype, kritisk treff, aktive spells, Rage, feat-unntak, situasjonell advantage og skadeeffekter avgjøres fysisk med DM. Disse må ikke fremstilles som beregnet. Ingen generell bonusmotor, AC-treffkontroll eller skadekalkulator er innført. Dual Wielder/andre særregler kan føres som egne handlinger eller manuelle verdier; den automatiske off-hand-listen dekker standardregelen for lette våpen.

Nye valgfrie v2-felter, eldre profilfallback, backup/kopi/undo og lagringskontrakt er dokumentert i [DATA_MODEL.md](DATA_MODEL.md#implementert-utstyrsutvidelse-2026-10-19). Ingen karakterdata skrives om ved oppstart. Kilde er SRD 5.1 (2014); strukturert våpendata er kontrollert mot 5e-bits/5e-database revisjon `a6212beb4b278917c2cff41c2b04c4ef4f3e0d6f`, Equipment/Classes/Magic-Items. Se [lisens](../public/SRD-LICENSE.txt). Ingen kopiert kode eller persondata fra papirarkreferansene.
