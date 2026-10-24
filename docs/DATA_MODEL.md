# Datamodell – konseptuell kontrakt for Codex

**Status:** Konseptuell kontrakt med implementerte utvidelser dokumentert nedenfor. Gjeldende format er Character/backup2 og IndexedDB3. Codex kan velge konkret TypeScript-/JS-struktur og IndexedDB-skjema, men må oppfylle funksjonene i [REQUIREMENTS.md](REQUIREMENTS.md). Manuelle overstyringer og SRD-/egendefinerte data er grunnleggende.

## Prinsipper
- **Per-character data** er separate fra immutable/importerte **CatalogEntries**. Følg [regelgrunnlag, omfang og utvidbarhet](REQUIREMENTS.md#overordnet-føring--regelgrunnlag-og-omfang): PHB 2014 og Eberron 2019 skal kunne representeres, også utenfor den distribuerbare SRD 5.1-katalogen. Ingen avhengighet til en komplett proprietær regeltekstkatalog.
- Regelutgave og innholdskilde skal kunne identifiseres. Skill medfølgende regeldata fra brukerregistrert bokinnhold; modellen og katalogreferansene skal tåle senere godkjente innholdskilder og karaktervalg uten unødvendig ombygging. Representasjon krever ikke automatisering av alle reglene.
- Identiteter er stabile UUID-er for brukeropprettede entiteter og lagrede karakterinstanser; eventuelle katalog-IDer er separate.
- Hver katalogbaserte entitet kan instansieres på en karakter og **overstyres** (navn, effekter, ressurser, tekst) uten å endre katalogen eller andre karakterer.
- Ikke forsøk én universal JSON-tekststreng for språk, proficiencies eller damage defenses: de er domeneobjekter.
- **Source/ownership**: et feature, spell eller item kan levere actions, passive modifiers, resource pools og valgfri active status. Bruk referanser, ikke uavhengige duplikatkort.
- Ukjente regler = fritekst og manuell endring, ikke blokkering eller taus antakelse.

## Forslag til aggregater

```text
Character
  id, name, level, classes[{classId, subclassId?, level}]
  species?, backgroundNoteId?, campaignId?, portraitAssetId?
  abilityScores, proficiencyBonusOverride?, derivedOverrides?
  hp{current,max,temp}, acOverride?, speed?, inspiration, deathSaves{successes,failures}
  skills[{skillId, proficiencyLevel, override?}]
  saves[{abilityId, proficiencyLevel, override?}]
  languages[{id?, name, sourceId?}]
  proficiencies[{category:armor|weapon|tool|other, referenceId?, name, level?}]
  damageDefenses[{damageType, kind:resistance|vulnerability|immunity, sourceId?, condition?}]
  conditionImmunities[{conditionId, sourceId?}]
  conditions[], exhaustionLevel
  resources[ResourcePool], features[FeatureInstance], spells[SpellInstance]
  items[ItemInstance], notes[Note], favoriteModifierRefs[4]
  goldCp, activeStates[], auditEvents[EventRef]
```

Anbefalt egne IndexedDB stores for `characters`, `catalog`, `assets`, `events`, `settings` (konkret normalisering avgjøres av Codex).

### ResourcePool
`{id,ownerCharacterId,name,current,max,unit?,recharge:{kind:shortRest|longRest|manual|special,ruleText?},sourceRef?,metadata?}`.
**Spell slots:** separate pools per level og caster/system (f.eks. spellcasting versus Pact Magic), slik at begge kan sameksistere ved multiclass. **Hit Dice:** type/antall og class-origins uten å kreve automatisk reglereduksjon. Simple checkboxes er visning for count=1/få, men data er strukturert telling.

### FeatureInstance
`{id,name,category:class|species|feat|custom|item,sourceRef?,description,actionRefs[],resourceRefs[],effectRefs[],activeStateRef?}`.
En feature er **ikke bare et notat**: feat som Heavy Armor Master kan gi en betinget skadeeffekt, mens Second Wind gir bonus action og begrenset ressurs.

### ActionDefinition / ActionInstance
`{id,name,actionEconomy:action|bonus|reaction|none|passive,sourceRef?,summary,detail,attackRoll?,damageRolls?,saveDC?,range?,requirements?,resourceRefs[]}`.
Combat viser handlingsinstanser og standardhandlinger gruppert etter action economy; `none`/passive under «Andre egenskaper». Ikke lag «brukt action»-tilstand.

### EffectDefinition / EffectInstance
`{id,sourceRef?,target:damage|ac|speed|roll|other,operation:flatReduction|resistance|vulnerability|immunity|bonus|override|manual,amount?,damageTypes?,condition?,description,activeStateRef?}`.
Betingelser er **beskrivbare, og evalueres tri-state**: `true` / `false` / `unknown`. Ukjent krever brukerbekreftelse for skadekalkulatoren. Skill persistent defense fra hendelsesvalget om den skal medregnes.

### ItemInstance
`{id,definitionRef?,name,category:weapon|armor|shield|equipment|magic,quantity,equipped,handUsage?:one|two|versatile,attack?,damage?,acContribution?,effectRefs[],resourceRefs[],notes?}`.
Eid og utstyrt er ulike tilstander. Equip kan advare om kombinasjonskonflikter, ikke nekte lagring.

Utstyrsoppsett (presisert 2026-10-19) må også kunne representere relevant bæreplassering/håndbruk og eventuell attunement, samt knytte gjenstandens bidrag til beregnede verdier/oppslag via kilde og vilkår. Gjenstandstype, eierskap og aktiv bruk er separate forhold. Senere godkjent forenkling (§11 i kravene) bruker ingen påkrevde kroppsdeler: samlet rustning, enkel bruk/håndbruk og attunement. Konkrete valg er beskrevet nedenfor. Kombinasjonsregler og advarsler følger D&D 5e 2014 og bevarer DM-unntak. Se [krav §2](REQUIREMENTS.md#2-character) og [åpne kontrollscenarioer](CHARACTER_WORKSPACE.md#kjente-mangler-som-den-nye-kontrollen-må-fange).

### SpellInstance
`{id,definitionRef?,name,spellLevel,castingTime,actionEconomy,range,duration,concentration,ritual,components,attack?,save?,damage?,description,known?,inSpellbook?,prepared?,casterClassRef?,resourceSystemRef?}`.
Bruk felles spellvisning, klasseavhengige felter og separate slotsystemer.

### Note / Portrait
`Note{id,title,body}`. Ingen hardkodede duplikatfelter for bakgrunn/notater.
`PortraitAsset{id,mimeType,blob,dimensions?}` lokalt; ved JSON-eksport som data-url/base64 eller annen komplett representasjon. Valider størrelse/type og unngå unødvendig oppblåst backup.

### ChangeEvent
`{id,characterId,timestamp,type,description,changes:[{entityRef,path,before,after}],version}`.
Kun **bekreftede karakterendringer** logges. Compound damage som endrer temp+normal HP = én atomisk hendelse. Angre siste hvis før-/ettertilstand fortsatt kan anvendes trygt, ellers tydelig manuell korrigering.

## «Ta skade» – beregningskontrakt
```text
DamageEventDraft:
  characterId, components:[{id,amount,damageType,chosenModifiers[]}]
  chosenModifiers:[{effectRef?,name,conditionState,confirmed?,enabled,manualOverride?}]
  hpBefore, tempHpBefore, computedBreakdown[], hpAfter, tempHpAfter
```
- Start med én komponent, legg til flere. Velg modifikatorer fra **strukturerte** damage defenses og effects; tillat midlertidige event-only overrides, ingen mutasjon av Character ved avkryssing.
- For **hver damage type/komponent**, anvend relevante flat justeringer i 2014-rekkefølge, deretter resistance (gulvdivisjon), vulnerability, immunity ved match. Flere kilder til resistance av samme type skal normalt ikke doble halvering. Ukjente vilkår regnes **ikke** før bekreftet.
- Summer resultatet av komponenter, trekk temporary HP, trekk resten fra vanlig HP ned mot 0. Ikke endre state før eksplisitt `commit`.
- Breakdown inneholder *hvilken* modifier, *hvorfor*, *faktisk beløp før/etter* og evt. avkrysset av DM-regnet. Output til DM bygger på samme struktur, ikke en uavhengig tekstberegning.
- Atomisk commit og undo via ChangeEvent. **Vær nøye med 2014-reglene rundt avrunding og effektrekkefølge**; la testene fange kombinasjoner og DM-overstyringer. Enkelte effekter gjelder på angreps-/hendelsesnivå, ikke per type: modellér scope eksplisitt ved behov.

## Import/eksport
Versjonert payload: `{schemaVersion, exportedAt, characters, referencedCustomCatalog?, portraitAssets?, events?}`. Import skal validere, håndtere ID-kollisjoner, migrere gamle versjoner, og aldri stilletiende overskrive brukerdata. SRD-katalog kan distribueres som app-asset i stedet for duplisering per backup.

## Åpne implementasjonsvalg for Codex
Valg av UI-rammeverk, state-management, IndexedDB-wrapper, normaliseringsgrad og fysisk schema, migrasjonsstrategi, testverktøy. Ikke endre brukerkrav uten å markere det som beslutningsbehov.

## Implementert utstyrsutvidelse (2026-10-19)

Character/backup forblir v2 og IndexedDB v3. Nye felter er valgfrie og endrer ikke tidligere felters kontrakt: `weaponProfile{category,kind,dice,damageType,twoHandedDice?,properties[],range?,thrownRange?,special?}`, `grip:one|two`, `attackMode:melee|thrown`, `attackAbility`, `damageOverride` (eksplisitt total), `proficient:boolean`, `requiresAttunement`, `attuned`, `bonuses{ac?,attack?,damage?,saves?}`. Manglende profil på eldre katalogvåpen får read-only katalogfallback; ingen omskriving eller brukerdataoverskriving ved oppstart. Manuelle `attack`/`damage`-totaler bevares og erstatter beregningene. Historisk katalogtekst i `damage` er fortsatt grunnverdi, ikke en manuell total. UUID-/katalogreferanser, andre effekter/ressurser og notater bevares.

De nye feltene følger automatisk eksisterende validering, atomisk save/undo, kopi og full karakterbackup. Dette er en additiv utvidelse som leser eldre v2-data uten migrering; nedgradering til en eldre appversjon støttes ikke som redigeringsflyt. Beregningsregler, multiclass-konvensjon og begrensninger: [EQUIPMENT.md](EQUIPMENT.md).

## Valgfri ikonmetadata (Eventyrjournal, 2026-10-20)

Features, spells, items, actions og artsegenskapsposter kan ha `iconKey` fra en lukket liste av visuelle kategorier. Feltet er valgfritt; fravær betyr automatisk kategori-/familie-/reserveikon ved visning. Det gir ingen regelverdi eller tilgang. UI tilbyr valget under detaljer på egenskaper, spells, handlinger og utstyr. Andre faste datatyper har familieikoner. Ingen UUID-er erstattes, og nye standardfelter skrives ikke ved lesing. SchemaVersion2 og DB3 beholdes; kopiering, hendelseslogg, undo og backup bevarer eksplisitte valg. Eldre data uten feltet er fortsatt gyldige. Ukjente ikon-ID-er avvises ved validering, og vilkårlig SVG/URL lagres ikke. Se [implementasjonsbeskrivelse](EVENTYRJOURNAL.md).


## Veiviser-/magifelt (2026-10-20)

Additiv Character/backup v2, DB3. Gamle poster uten feltene er gyldige. Nedgradering til eldre skrivende app støttes ikke.

- `Item.extraDamage?: [{id,expression,damageType,condition?}]`: egen UUID per komponent; `condition` er spillerens tekst, tilhører denne skaden og evalueres ikke av appen. `userNote?` holdes separat fra katalogens regelnotater. Grunnprofil/angrepsmodifier forblir uendret av ekstraskaden.
- `Feature.spellAccess?: {classes[],spellIds[],maxLevel,ability?}` beskriver en eksplisitt, manuelt registrert tilgang. Klasselister og konkrete katalog-ID-er er union; dette gir ingen automatiske slots. Klasselister/nivå/ability kan redigeres under Flere detaljer; konkrete kataloghenvisninger bevares i data uten et teknisk ID-felt i brukerflyten.
- `Spell.accessSource?`, `sourceLabel?`, `castingAbility?`, `alwaysPrepared?` supplerer `casterClassRef` og `resourceSystemRef`. Samme instans brukes av Magi, forberedelse og Combat. Always-prepared holdes utenfor vanlig telling; data bevares ved overstyring.
- `Resource.automatic?: {key,max,name?,recharge?}` lagrer regelidentitet og siste kjente standardmaks/navn/hvilevilkår; `classRef` er separat remappbar UUID. `manualMaximum?` beskytter eksplisitte maksverdier ved nivåendring. Nøkkel inneholder ikke instans-UUID. Pact-pool beholder ID når slotnivå endres; brukt antall trekkes fra ny standardmaks. Manuelle eldre pools bevares fremfor å dupliseres. Utgåtte automatiske nivåer fjernes når de ikke har en eksplisitt maks-overstyring.

Standardoppsett er en ren visningsprojeksjon. Ingen karakter skrives eller logger fylles ved bare å åpne en fane. En reell bekreftet operasjon lagrer hele oppsettet atomisk gjennom repository. Kopi remapper komponent-UUID-er, klasser og kildehenvisninger; backup/undo bevarer hele aggregatet. Varsler, filtre og hjulvalg er midlertidig UI-tilstand. Veiviserutkast er separat, vedvarende lokal tilstand, fortsatt utenfor karakteraggregatet; se nedenfor.

## Vedvarende veiviserutkast (2026-10-20)

`WizardDraft` versjon1 inneholder UUID, eget revisjonstall, type, valgfri karakter-/redigeringsreferanse, navn, tidspunkt, originalt grunnlag, dynamiske rad-ID-er, aktiv spørsmålsnøkkel og navngitte feltverdier. Nye karakterer kan være ufullstendige; de valideres som ferdig Character først ved bekreftelse. Validering av lagringsformatet, feltgrenser og en grense på 2 MB per utkast beskytter lokal lagring.

Utkast lagres i eksisterende IndexedDB `settings` med nøkkel `wizard-draft:<uuid>`. Ingen DB-oppgradering eller Character-felt trengs. Revisjonskontroll hindrer overskriving og gjenoppretting av fullført/forkastet utkast fra gammel fane. Et eid utkast krever en eksisterende karakter i samme lagringstransaksjon. En gammel karakter med positiv revisjon kan ikke gjenopprettes som ny hvis karakteren er slettet. Fullfør skriver Character, hendelse/asset og sletting av riktig utkastrevisjon i én transaksjon; feil ruller alt tilbake. Utkast påvirker ingen spillverdier, samlinger eller historikk. Sletting av karakter fjerner dens utkast; kopi kopierer bare bekreftede karakterdata.

Backup2 har et valgfritt `wizardDrafts`-felt, med inntil 200 utkast. Eldre backup uten dette er gyldig. Eksport inkluderer utkast for eksporterte karakterer og uferdige nye karakterer; import avviser kollisjoner og manglende karaktertilhørighet atomisk. Utstyrs- og karakterreferanser i utkast er originale ID-er, ikke nye registreringer. Gamle karakterredigeringsutkast kan avvises ved revisjonskonflikt etter import eller senere endring; originalen skal beholdes.

Penger lagres fortsatt som heltall CP. De to GP-hjulene er en visning (hele GP og 00–99), med eksakt omregning og validering innen `Number.MAX_SAFE_INTEGER`. Flyttallsavrunding skal ikke endre en lagret kobbermynt.


## Isolert utstyrsprototype v2 – separat prøveformat

Ingen endring i Character/backup2 eller IndexedDB3. Den lokale HTML-studien har eget prøveformat2 under den eksisterende nøkkelen `dnd-equipment-study-v1`. Individuelle våpen har `hand:none|left|right|both` fremfor quantity; kopiering remapper item-/effekt-ID-er og starter uten hånd/attunement. Andre utstyrsantall bevares. Ability-virkninger skiller `add` og `floor`; eldre ability-sett-til i prøven normaliseres til minsteverdi. Andre eldre absoluttverdier bevares uten ny generell beregning. En friteksteffekt har `description`, `placements[]`, valgfritt `limited/max/remaining/recharge`; Combat bruker samme data og ID, ingen duplikatpool. X bevarer separat utkast, Lagre bekrefter hele gjenstanden og lukker etter eventuell bruk. Dette er et prøveformat, ikke godkjent produksjonsmigrering; se [betjening og grenser](../prototypes/equipment-study/README.md).

## Utstyrsvirkninger fra den godkjente veiviseren

Tilleggene er valgfrie felter i karakteraggregatets eksisterende schemaVersion2; IndexedDB-strukturen er uendret. Gamle rader er gyldige uten migrering ved lesing.

- `items[].hand`: none/left/right/both. Eksplisitte valg går foran eldre equipped/grip. Eldre data tolkes deterministisk for visning, uten å skrive dem om. Våpen kopieres som selvstendige instanser, uten antallsregistrering i ny våpenflyt. Eldre quantity>1 deles først ved uttrykkelig lagring.
- `items[].modifiers[]`: egen id, target (ability/ac/speed/initiative/attack/damage/saves/save/skill/maxHp), eventuell subject, operation add/floor, amount og valgfri fritekst condition. Floor tilbys for ability scores og betyr «hev til minst». Grunnscore og manuelle totaler beholdes. Ubetingede bidrag brukes ved equipped, quantity>0 og nødvendig attunement; ukjente betingelser vises og fortolkes ikke automatisk. Våpenets attack/damage-bidrag gjelder det våpenet, mens slike bidrag fra annet brukt utstyr gjelder våpenoppslag generelt.
- `items[].protections[]`: egen id, resistance/immunity/vulnerability/conditionImmunity, subject og eventuell condition. Vises kildeknyttet; automatisk skaderesolusjon innføres ikke.
- `items[].specialEffect`: én id/description/activation (action/bonus/reaction/passive/unknown) og eventuell resourceId. Passiv/uavklart vises under Andre egenskaper. resourceId peker til en vanlig resource med sourceRef=item og samme ID i item.resourceRefs. Alle tellere og hvile bruker den samme poolen. Ny pool starter current=max; maks-endring bevarer brukt antall. Daggry lagres som special med ruleText og blir ikke automatisk behandlet som hvile.
- `userNote` er gjenstandens historie/utseende; regelbeskrivelsen ligger i specialEffect. Eldre notes, bonuses, profiler og manuelle totaler bevares. Nytt UI lager ingen automatisk spellkobling.

Kopi remapper gjenstandens interne IDs og egne children samlet, og starter kopien uten bruk/attunement. Catalog-referanser og eksterne delte referanser bevares. Fjerning sletter bare egne children som ingen annen eier refererer til. Hele karakterkopier, backup, historikk og angre omfatter disse feltene. Faktiske grunn-HP lagres fortsatt i hp.max; effectiveMaxHp beregnes for visning/healing/hvile uten å omskrive grunnverdien. Å legge bort HP-utstyr klipper ikke nåværende HP stille.

Ny equipment-draft payload har editorVersion2 med source/expected/expectedPool/work. Work lagrer det konkrete spørsmålet, svar, spørsmålshistorikk, gjenstand og valgfri pool. Utkastets CAS-revision brukes atomisk ved sluttlagring; eldre draftformat gjenopptas med kompatibilitetsveiviseren.

## Forbruk (#30/#31)

Character2 har `consumables[]`, som leses som tom liste når feltet mangler i eldre data. Ingen DB-oppgradering eller flytting av `items`. Hver post har stabil `id`, `name`, ikke-negativt sikkert heltall `quantity`, `category` (ammunition/healing/supplies/combat/other), `unit`, `description`, valgfritt `iconKey` og `catalogId`. Katalogen er et eget lokalt SRD-datasett; flere poster kan ha samme katalog-ID/navn. Beholdning har ikke maks eller hvilegjenoppretting. Hele aggregatets revisjonskontroll, hendelser, Angre, kopiering og backup omfatter feltet. Egenregistrering bruker utkasttypen `consumable` i eksisterende settings/backup; sluttlagring og sletting av utkast er atomisk.
