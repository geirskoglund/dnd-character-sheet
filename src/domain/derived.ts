import type { Character } from './model';
export const abilityModifier = (score: number) => Math.floor((score - 10) / 2);
export interface DerivedStats { ac: number; speed: number | null; acExplanation: string; speedExplanation: string; warnings: string[] }
/** Selected 2014 sheet calculations, not an action resolver or character builder. */
export function deriveStats(c: Character): DerivedStats {
  const warnings: string[] = [];
  const dex = abilityModifier(c.abilityScores.DEX);
  const items = c.items.filter(i => i.equipped && i.quantity > 0);
  const armors = items.filter(i => i.category === 'armor');
  const shields = items.filter(i => i.category === 'shield');
  const armorAc = (i: typeof items[number]) => i.armorProfile ? i.armorProfile.baseAc +
    (i.armorProfile.addDex ? Math.min(dex, i.armorProfile.dexCap ?? Infinity) : 0) : null;
  const armor = [...armors].sort((a, b) => (armorAc(b) ?? -Infinity) - (armorAc(a) ?? -Infinity))[0];
  const shieldBonus = Math.max(0, ...shields.map(i => i.acContribution ?? 2));
  if (armors.length > 1) warnings.push('Flere rustninger er utstyrt. Beregningen bruker høyeste AC fra én rustning; de stables ikke.');
  if (shields.length > 1) warnings.push('Flere skjold er utstyrt. Bare høyeste skjoldbonus brukes.');
  if (armors.some(i => !i.armorProfile)) warnings.push('Rustning mangler AC-profil. Registrer profilen eller sett en manuell AC.');
  if (shields.length && items.some(i => i.handUsage === 'two')) warnings.push('Tohåndsvåpen og skjold krever samme hånd. Kontroller oppsettet med DM.');
  const classLevel = (name: string) => c.classes.filter(cl => cl.definitionRef?.kind === 'catalog' && cl.definitionRef.id === `srd51:class:${name}`).reduce((n, cl) => n + cl.level, 0);
  const barbarian = classLevel('barbarian'), monk = classLevel('monk');
  let ac = armor && armorAc(armor) !== null ? armorAc(armor)! : 10 + dex;
  let acExplanation = armor?.armorProfile ? `${armor.name}: ${armor.armorProfile.baseAc}${armor.armorProfile.addDex ? ` + DEX ${Math.min(dex, armor.armorProfile.dexCap ?? Infinity)}${armor.armorProfile.dexCap !== null ? ` (maks ${armor.armorProfile.dexCap})` : ''}` : ' (uten DEX)'}` : `Uten rustning: 10 + DEX ${dex}`;
  let defense = c.unarmoredDefense;
  if (defense === 'auto') {
    if (barbarian && monk) { defense = 'none'; warnings.push('Barbarian/Monk: velg hvilken Unarmored Defense du har. Multiclass gir ikke en andre Unarmored Defense.'); }
    else defense = barbarian ? 'barbarian' : monk ? 'monk' : 'none';
  }
  if (!armor) {
    const extra = defense === 'barbarian' && barbarian ? abilityModifier(c.abilityScores.CON) : defense === 'monk' && monk && !shields.length ? abilityModifier(c.abilityScores.WIS) : null;
    if (extra !== null && 10 + dex + extra >= ac) {
      ac = 10 + dex + extra;
      acExplanation = `${defense === 'barbarian' ? 'Barbarian' : 'Monk'} Unarmored Defense: 10 + DEX ${dex} + ${defense === 'barbarian' ? 'CON' : 'WIS'} ${extra}`;
    }
  }
  if (defense === 'monk' && shields.length) warnings.push('Monk Unarmored Defense gjelder ikke med skjold.');
  ac += shieldBonus;
  if (shieldBonus) acExplanation += ` + skjold ${shieldBonus}`;
  let speed = c.species.walkingSpeed;
  const speedParts = speed === null ? ['Velg art eller angi grunnfart for egen art.'] : [`${c.species.name || 'Egen art'}: ${speed} ft`];
  const heavy = armors.some(i => i.armorProfile?.kind === 'heavy');
  if (speed !== null) {
    if (barbarian >= 5 && !heavy) { speed += 10; speedParts.push('Fast Movement +10'); }
    if (monk >= 2 && !armors.length && !shields.length) {
      const bonus = monk >= 18 ? 30 : monk >= 14 ? 25 : monk >= 10 ? 20 : monk >= 6 ? 15 : 10;
      speed += bonus; speedParts.push(`Unarmored Movement +${bonus}`);
    }
    if (armors.some(i => i.armorProfile?.kind === 'heavy' && c.abilityScores.STR < i.armorProfile.strength) && !c.species.ignoresHeavyArmorSpeedPenalty) {
      speed -= 10; speedParts.push('Heavy armor: STR-krav ikke oppfylt −10');
    }
    speed = Math.max(0, speed);
  }
  if (c.acOverride !== null || c.speedOverride !== null) warnings.push('Manuelle verdier er aktive. Fjern dem under Beregninger og overstyringer for å bruke karaktergrunnlaget.');
  if (c.acOverride !== null) { acExplanation += ` → manuell overstyring ${c.acOverride}`; ac = c.acOverride; }
  if (c.speedOverride !== null) { speedParts.push(`manuell overstyring ${c.speedOverride}`); speed = c.speedOverride; }
  if (items.some(i => i.armorProfile?.stealthDisadvantage)) warnings.push('Utstyrt rustning gir disadvantage på Stealth.');
  return { ac, speed, acExplanation, speedExplanation: speedParts.join(' · '), warnings };
}
export function hpAfterChange(hp: Character['hp'], delta: number): Character['hp'] {
  if (delta >= 0) return { ...hp, current: Math.max(hp.current, Math.min(hp.max, hp.current + delta)) };
  const absorbed = Math.min(hp.temp, -delta);
  return { ...hp, temp: hp.temp - absorbed, current: Math.max(0, hp.current + delta + absorbed) };
}
