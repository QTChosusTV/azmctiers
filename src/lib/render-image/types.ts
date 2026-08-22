export type Mode =
  | 'axe'
  | 'sword'
  | 'nethop'
  | 'smp'
  | 'mace'
  | 'vanilla'
  | 'diapot'
  | 'uhc';

export type TierLabel =
  | 'LT5' | 'HT5'
  | 'LT4' | 'HT4'
  | 'LT3' | 'HT3'
  | 'LT2' | 'HT2'
  | 'LT1' | 'HT1';

export interface ModeTier {
  mode: Mode;
  tier: TierLabel | null;
  elo: number | null;
}

export interface PlayerSummary {
  discordId: string;
  username: string;
  isPremium: boolean;
  points: number;
  modeTiers: ModeTier[];
}
