# Datamodell – konseptuell kontrakt for Codex

**Status:** Foreslått domenemodell / invariants. Codex kan velge konkret TypeScript-/JS-struktur og IndexedDB-skjema, men må oppfylle funksjonene i [REQUIREMENTS.md](REQUIREMENTS.md). Manuelle overstyringer og SRD-/egendefinerte data er grunnleggende.

## Prinsipper
- **Per-character data** er separate fra immutable/importerte **SRD CatalogEntries**. Ingen avhengighet til en komplett proprietær katalog.
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
