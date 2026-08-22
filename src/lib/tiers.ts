// tiers.ts

export const MODES = [
  'axe',
  'sword',
  'nethop',
  'smp',
  'mace',
  'vanilla',
  'diapot',
  'uhc',
] as const;

export type Mode = (typeof MODES)[number];

export const MODE_LABELS: Record<Mode, string> = {
  axe: 'Axe',
  sword: 'Sword',
  nethop: 'NethOP',
  smp: 'SMP',
  mace: 'Mace',
  vanilla: 'Vanilla',
  diapot: 'Pot',
  uhc: 'UHC',
};

// Column name on the `tiers` table for each mode
export const MODE_COLUMN: Record<Mode, string> = {
  axe: 'tiers_axe',
  sword: 'tiers_sword',
  nethop: 'tiers_nethop',
  smp: 'tiers_smp',
  mace: 'tiers_mace',
  vanilla: 'tiers_vanilla',
  diapot: 'tiers_diapot',
  uhc: 'tiers_uhc',
};

export const TIER_SCALE = [
  'LT5', 'HT5', 'LT4', 'HT4', 'LT3', 'HT3', 'LT2', 'HT2', 'LT1', 'HT1',
] as const;

export type Tier = (typeof TIER_SCALE)[number];

export const TIER_SCORE: Record<Tier, number> = {
  LT5: 1, HT5: 2, LT4: 3, HT4: 4, LT3: 6,
  HT3: 10, LT2: 20, HT2: 30, LT1: 45, HT1: 60,
};

export const TIER_COLORS: Record<Tier, string> = {
  HT1: '#e9e9e9',
  LT1: '#675353',
  HT2: '#D2001B',
  LT2: '#B674FF',
  HT3: '#25d1c0',
  LT3: '#04F348',
  HT4: '#eaaf24',
  LT4: '#b4b4b4',
  HT5: '#d14d25',
  LT5: '#6f6f6f',
};

export const TIER_THRESHOLDS: { tier: Tier; elo: number }[] = [
  { tier: 'LT5', elo: 600 },
  { tier: 'HT5', elo: 800 },
  { tier: 'LT4', elo: 1000 },
  { tier: 'HT4', elo: 1200 },
  { tier: 'LT3', elo: 1500 },
  { tier: 'HT3', elo: 1800 },
  { tier: 'LT2', elo: 2200 },
  { tier: 'HT2', elo: 2600 },
  { tier: 'LT1', elo: 3000 },
  { tier: 'HT1', elo: 3500 },
];

/**
 * Toggle to hide tier-group columns below this threshold in the Tier Grid
 * view (e.g. set to 4 to only ever show Tier 1-4, hiding Tier 5 entirely).
 * Set to `false` to show all 5 groups.
 */
export const MIN_VISIBLE_TIER_GROUP: 1 | 2 | 3 | 4 | 5 = 3;
export const MAX_VISIBLE_TIER_GROUP: 1 | 2 | 3 | 4 | 5 = 5;

export function isTier(value: string | null | undefined): value is Tier {
  return !!value && (TIER_SCALE as readonly string[]).includes(value);
}

/** Broad "Tier 1..5" grouping used by the tier-grid view, derived from LT/HT pairs. */
export function tierGroup(tier: Tier): 1 | 2 | 3 | 4 | 5 {
  if (tier === 'HT1' || tier === 'LT1') return 1;
  if (tier === 'HT2' || tier === 'LT2') return 2;
  if (tier === 'HT3' || tier === 'LT3') return 3;
  if (tier === 'HT4' || tier === 'LT4') return 4;
  return 5;
}

export interface ModeTierData {
  elo: number;
  tier: string;
  obtainedAt: string | null;
  lastLowTestAt: string | null;
  lastHighTestAt: string | null;
  lastCompetitiveAt: string | null;
}

export interface PlayerRow {
  discordId: string;
  username: string;
  region: string | null;
  isPremium: boolean;
  verifiedAt: string;
  preferred_server: string | null;
  tiers_axe: ModeTierData | null;
  tiers_sword: ModeTierData | null;
  tiers_nethop: ModeTierData | null;
  tiers_smp: ModeTierData | null;
  tiers_mace: ModeTierData | null;
  tiers_vanilla: ModeTierData | null;
  tiers_diapot: ModeTierData | null;
  tiers_uhc: ModeTierData | null;
}

export interface PlayerModeTier {
  mode: Mode;
  tier: Tier | null;
  elo: number | null;
}

export interface PlayerSummary {
  discordId: string;
  username: string;
  region: string | null;
  isPremium: boolean;
  modeTiers: PlayerModeTier[];
  points: number;
  bestTier: Tier | null;
}

/** Reads the tier out of each mode column and computes total points + best tier. */
export function summarizePlayer(row: PlayerRow): PlayerSummary {
  const modeTiers: PlayerModeTier[] = MODES.map((mode) => {
    const col = row[MODE_COLUMN[mode] as keyof PlayerRow] as ModeTierData | null;
    const tier = col?.tier;
    const elo = col?.elo ?? null;
    return { mode, tier: isTier(tier) ? tier : null, elo };
  });

  let points = 0;
  let bestTier: Tier | null = null;
  let bestIndex = -1;

  for (const { tier } of modeTiers) {
    if (!tier) continue;
    points += TIER_SCORE[tier];
    const idx = TIER_SCALE.indexOf(tier);
    if (idx > bestIndex) {
      bestIndex = idx;
      bestTier = tier;
    }
  }

  return {
    discordId: row.discordId,
    username: row.username,
    region: row.region,
    isPremium: row.isPremium,
    modeTiers,
    points,
    bestTier,
  };
}

function hexToRgb(hex: string) {
  const value = hex.replace('#', '');

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    '#' +
    [r, g, b]
      .map((x) => Math.round(x).toString(16).padStart(2, '0'))
      .join('')
  );
}

function interpolateColor(a: string, b: string, t: number) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);

  return rgbToHex(
    ca.r + (cb.r - ca.r) * t,
    ca.g + (cb.g - ca.g) * t,
    ca.b + (cb.b - ca.b) * t,
  );
}

export function getEloColor(elo: number): string {
  if (elo <= TIER_THRESHOLDS[0].elo) {
    return TIER_COLORS[TIER_THRESHOLDS[0].tier];
  }

  if (elo >= TIER_THRESHOLDS[TIER_THRESHOLDS.length - 1].elo) {
    return TIER_COLORS[TIER_THRESHOLDS[TIER_THRESHOLDS.length - 1].tier];
  }

  for (let i = 0; i < TIER_THRESHOLDS.length - 1; i++) {
    const a = TIER_THRESHOLDS[i];
    const b = TIER_THRESHOLDS[i + 1];

    if (elo >= a.elo && elo <= b.elo) {
      const t = (elo - a.elo) / (b.elo - a.elo);

      return interpolateColor(
        TIER_COLORS[a.tier],
        TIER_COLORS[b.tier],
        t,
      );
    }
  }

  return TIER_COLORS.HT1;
}