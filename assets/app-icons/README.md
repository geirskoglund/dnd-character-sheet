# My D&D – godkjent ikon A

Brukeren valgte journallogo A og godkjente 22. oktober 2026 to tilpasninger: firkantet bronseramme på iPhone og sirkelramme som Android-motiv. `sources/` bevarer de fire godkjente ImageGen-originalene uten beskjæring. My D&D er vinrød på lys journalbakgrunn; test har et tydelig TEST-merke. Den runde rammen inngår i motivet og følger ikke dynamisk launcherens valgte maske.

`app/` og `test/` inneholder tekniske PNG-eksporter av disse originalene, uten ny utforming:

- `journal-180.png`: iPhone/apple-touch-icon.
- `journal-192.png`, `journal-512.png`: manifestikoner med purpose any, også favicon.
- `round-512.png`: Androids maskérbare ikon. Full kvadratisk, ugjennomsiktig bakgrunn; motivet har luft til rund beskjæring. Logo og TEST-merke er innen maskérbar sikkerhetssirkel (sentrum, radius 40 %); dekorativ ramme er ikke essensielt innhold.

Eksportene er rendret fra originalene i Chromium med CSS-bredde/-høyde 180/192/512 px, deviceScaleFactor 1, uten maske eller endret motiv. De sjekkes inn slik at vanlige appbygg ikke krever bildeverktøy eller nettverk. `vite.config.ts` velger kanalens filer, gir dem stabile offentlige navn og lar Workbox precache dem for offline. Ingen testikoner kopieres til appbygget eller omvendt. Ved nytt godkjent design oppdateres originaler og eksportfiler samlet; ikke bytt motiv med en tilfeldig systemfont.

Se [PWA-/publiseringskontrakten](../../docs/TESTING.md).
