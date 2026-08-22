import type { TierLabel } from './types';

// Low -> high, matching new_system.md
export const TIER_ORDER: TierLabel[] = [
  'LT5', 'HT5', 'LT4', 'HT4', 'LT3', 'HT3', 'LT2', 'HT2', 'LT1', 'HT1',
];

export const TIER_SCORE: Record<TierLabel, number> = {
  LT5: 1, HT5: 2, LT4: 3, HT4: 4, LT3: 6,
  HT3: 10, LT2: 20, HT2: 30, LT1: 45, HT1: 60,
};

/**
 * Placeholder tier -> color mapping.
 *
 * NOTE: the real TierBadge component (with the 12-stop RGB gradient
 * interpolated across the 0-9999 elo range) wasn't shared in this session -
 * only PlayerModal was pasted. This gives each tier a fixed color banded by
 * rank (low tiers = muted, high tiers = warm/bright) so the card looks right
 * out of the box. Swap `tierColor()` below for your real gradient function
 * (or paste TierBadge.tsx and I'll wire it in exactly) whenever you're ready.
 */
const TIER_COLOR: Record<TierLabel, string> = {
  LT5: '#6b7280',
  HT5: '#7c8591',
  LT4: '#5b8cae',
  HT4: '#4f9ec9',
  LT3: '#5fb88a',
  HT3: '#4fcf8a',
  LT2: '#c98f4f',
  HT2: '#e0a83f',
  LT1: '#d9648f',
  HT1: '#ff6b6b',
};

export function tierColor(tier: TierLabel | null): string {
  if (!tier) return '#3a3345';
  return TIER_COLOR[tier] ?? '#3a3345';
}

export function tierScore(tier: TierLabel | null): number {
  if (!tier) return 0;
  return TIER_SCORE[tier] ?? 0;
}
