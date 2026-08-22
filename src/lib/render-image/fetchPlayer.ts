import type { SupabaseClient } from '@supabase/supabase-js';
import type { Mode, ModeTier, PlayerSummary, TierLabel } from './types';
import { tierScore } from './tierScale';

const MODES: Mode[] = [
  'axe', 'sword', 'nethop', 'smp', 'mace', 'vanilla', 'diapot', 'uhc',
];

interface TiersRow {
  discordId: string;
  username: string;
  isPremium: boolean;
  [key: `tiers_${Mode}`]: { tier?: TierLabel | null; elo?: number | null } | null;
}

export class PlayerNotFoundError extends Error {
  constructor(discordId: string) {
    super(`No verified player found for discordId "${discordId}"`);
    this.name = 'PlayerNotFoundError';
  }
}

/**
 * Fetches a player's row from `tiers` by discordId and shapes it into the
 * PlayerSummary structure PlayerModal (and this render library) expects.
 *
 * Column names are camelCase in Postgres, so they're double-quoted in the
 * select string - see new_system.md's note on Supabase silently lowercasing
 * unquoted camelCase identifiers.
 */
export async function fetchPlayerByDiscordId(
  supabase: SupabaseClient,
  discordId: string
): Promise<PlayerSummary> {
  const selectCols = [
    '"discordId"',
    'username',
    '"isPremium"',
    ...MODES.map((m) => `tiers_${m}`),
  ].join(', ');

  const { data, error } = await supabase
    .from('tiers')
    .select(selectCols)
    .eq('"discordId"', discordId)
    .maybeSingle<TiersRow>();

  if (error) {
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  if (!data) {
    throw new PlayerNotFoundError(discordId);
  }

  const modeTiers: ModeTier[] = MODES.map((mode) => {
    const cell = data[`tiers_${mode}`];
    const tier = (cell?.tier ?? null) as TierLabel | null;
    const elo = cell?.elo ?? null;
    return { mode, tier, elo };
  });

  const points = modeTiers.reduce((sum, mt) => sum + tierScore(mt.tier), 0);

  return {
    discordId: data.discordId,
    username: data.username,
    isPremium: Boolean(data.isPremium),
    points,
    modeTiers,
  };
}

/**
 * Ranks a player among all verified players by total points.
 * Rank is 1-indexed (1 = highest points). Ties share the same rank,
 * computed by counting how many players have strictly more points.
 */
export async function fetchPlayerRank(
  supabase: SupabaseClient,
  discordId: string,
  playerPoints: number
): Promise<number> {
  // We can't compute `points` in SQL without knowing the exact tier->score
  // mapping is mirrored server-side, so we pull just enough to rank client-side.
  // For large player bases this should become a materialized view / RPC;
  // fine for now given the modest player count implied by the schema.
  const selectCols = [
    '"discordId"',
    ...MODES.map((m) => `tiers_${m}`),
  ].join(', ');

  const { data, error } = await supabase.from('tiers').select(selectCols);

  if (error) {
    throw new Error(`Supabase rank query failed: ${error.message}`);
  }

  const allPoints = (data ?? []).map((row: TiersRow) => {
    return MODES.reduce((sum, mode) => {
      const tier = (row[`tiers_${mode}`]?.tier ?? null) as TierLabel | null;
      return sum + tierScore(tier);
    }, 0);
  });

  const higherCount = allPoints.filter((p) => p > playerPoints).length;
  return higherCount + 1;
}
