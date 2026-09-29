// TierGrid.tsx

import {
  MIN_VISIBLE_TIER_GROUP,
  MAX_VISIBLE_TIER_GROUP,
  TIER_COLORS,
  TIER_SCALE,
  tierGroup,
  type Mode,
  type PlayerSummary,
  type Tier,
  getEloColor,
  getTierRange,
} from '../lib/tiers';
import { PlayerAvatar } from './PlayerAvatar';
import { TierIcon } from './TierIcon';
import { RevealRow } from './RevealRow';

const DEMOTE_COLOR = '#ff5c5c';

const ALL_GROUPS: { id: 1 | 2 | 3 | 4 | 5; label: string; htColor: string; ltColor: string }[] = [
  { id: 1, label: 'Luminite - Netherite', htColor: TIER_COLORS.HT1, ltColor: TIER_COLORS.LT1 },
  { id: 2, label: 'Ruby - Amethyst', htColor: TIER_COLORS.HT2, ltColor: TIER_COLORS.LT2 },
  { id: 3, label: 'Diamond - Emerald', htColor: TIER_COLORS.HT3, ltColor: TIER_COLORS.LT3 },
  { id: 4, label: 'Gold - Iron', htColor: TIER_COLORS.HT4, ltColor: TIER_COLORS.LT4 },
  { id: 5, label: 'Copper - Stone', htColor: TIER_COLORS.HT5, ltColor: TIER_COLORS.LT5 },
];

const GROUPS = ALL_GROUPS.filter(
  (g) => g.id >= MIN_VISIBLE_TIER_GROUP && g.id <= MAX_VISIBLE_TIER_GROUP
);

function gradient(htColor: string, ltColor: string) {
  return `linear-gradient(90deg, ${htColor}, ${ltColor})`;
}

export function TierGrid({
  mode,
  players,
  onSelect,
}: {
  mode: Mode;
  players: PlayerSummary[];
  onSelect?: (p: PlayerSummary) => void;
}) {
  const playersWithModeTier = players
    .map((p) => {
      const modeTier = p.modeTiers.find((mt) => mt.mode === mode);
      return {
        player: p,
        tier: modeTier?.tier ?? null,
        elo: modeTier?.elo ?? 0,
      };
    })
    .filter(
      (r): r is { player: PlayerSummary; tier: Tier; elo: number } => r.tier !== null
    );

  const byGroup = GROUPS.map((g) => ({
    ...g,
    rows: playersWithModeTier
      .filter((r) => tierGroup(r.tier) === g.id)
      .sort((a, b) => (b.elo ?? 0) - (a.elo ?? 0)),
  }));

  return (
    <div className="tier-grid">
      <div
        className="tier-grid__columns"
        style={{ gridTemplateColumns: `repeat(${GROUPS.length}, minmax(0, 1fr))` }}
      >
        {byGroup.map((g) => (
          <TierColumn key={g.id} group={g} onSelect={onSelect} />
        ))}
      </div>

      <style>{`
        .tier-grid {
          background: var(--bg-panel);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          overflow: hidden;
        }
        .tier-grid__columns {
          display: grid;
          align-items: start;
        }
        @media (max-width: 900px) {
          .tier-grid__columns {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function TierColumn({
  group,
  onSelect,
}: {
  group: {
    id: 1 | 2 | 3 | 4 | 5;
    label: string;
    htColor: string;
    ltColor: string;
    rows: { player: PlayerSummary; tier: Tier; elo: number }[];
  };
  onSelect?: (p: PlayerSummary) => void;
}) {
  const grad = gradient(group.htColor, group.ltColor);

  return (
    <div className="tier-column">
      <div className="tier-column__header">
        <TrophyIcon htColor={group.htColor} ltColor={group.ltColor} />
        <span className="tier-column__label" style={{ backgroundImage: grad }}>
          {group.label}
        </span>
      </div>

      <div className="tier-column__body">
        {group.rows.map(({ player: p, tier, elo }, i) => (
          <RevealRow
            key={p.discordId}
            index={i}
            as="button"
            className="player-card"
            style={
              {
                '--tier-color': TIER_COLORS[tier],
                background: `color-mix(in srgb, ${getEloColor(elo)} 6%, var(--bg-card))`,
              } as React.CSSProperties
            }
            onClick={() => onSelect?.(p)}
          >
            <PlayerAvatar username={p.username} size={34} />
            <div className="player-card__info">
              <div className="player-card__name">{p.username}</div>
              <EloBar elo={elo} tier={tier} />
            </div>
            <TierIcon tier={tier} size={30} />
            <div style={{ color: TIER_COLORS[tier] }}>{tier}</div>
          </RevealRow>
        ))}
        {group.rows.length === 0 && <div className="tier-column__empty">No players in this tier yet.</div>}
      </div>

      <style>{`
        .tier-column {
          display: flex;
          flex-direction: column;
          min-width: 0;
          border-right: 1px solid var(--border-subtle);
        }
        .tier-column:last-child {
          border-right: none;
        }
        .tier-column__header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 12px;
          background: var(--bg-panel-raised);
          border-bottom: 1px solid var(--border-subtle);
        }
        .tier-column__label {
          font-family: var(--font-display);
          font-size: 20px;
          letter-spacing: 0.03em;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        .tier-column__body {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 20px;
          min-height: 220px;
          min-width: 0;
        }
        .player-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          min-width: 0;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 18px;
          cursor: pointer;
          text-align: left;
          transition: border-color 0.15s ease, background 0.15s ease, opacity 0.35s ease, transform 0.35s ease;
        }
        .player-card:hover {
          border-color: var(--border-strong);
          background: color-mix(in srgb, var(--tier-color) 10%, var(--bg-panel-raised));
          transform: translateY(-1px) !important;
        }
        .player-card__name {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tier-column__empty {
          color: var(--text-muted);
          font-size: 14px;
          padding: 20px 4px;
        }
        .player-card__info {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
          gap: 4px;
        }

        /* ---------- Elo progress bar ---------- */
        .elo-row {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }
        .elo-bar {
          position: relative;
          flex: 1;
          min-width: 0;
          height: 18px;
          border-radius: 999px;
          overflow: hidden;
          background: color-mix(in srgb, var(--elo-color) 12%, #0d0b1a);
          border: 1.5px solid color-mix(in srgb, var(--elo-color) 55%, white);
        }
        .elo-bar__fill {
          position: absolute;
          inset: 0 auto 0 0;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            color-mix(in srgb, var(--elo-color) 65%, black),
            var(--elo-color)
          );
          transition: width 0.5s ease;
        }
        .elo-bar__value {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #fff;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        }
        .rank-arrows {
          flex-shrink: 0;
        }
        .rank-arrows--up {
          animation: rank-bob-up 1.4s ease-in-out infinite;
        }
        .rank-arrows--down {
          animation: rank-bob-down 1.4s ease-in-out infinite;
        }
        @keyframes rank-bob-up {
          0%, 100% { transform: translateY(1px); }
          50% { transform: translateY(-2px); }
        }
        @keyframes rank-bob-down {
          0%, 100% { transform: translateY(-1px); }
          50% { transform: translateY(2px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .rank-arrows--up,
          .rank-arrows--down {
            animation: none;
          }
          .elo-bar__fill {
            transition: none;
          }
        }

        @media (max-width: 900px) {
          .tier-column {
            border-right: none;
            border-bottom: 1px solid var(--border-subtle);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Progress bar showing where `elo` sits between the tier's min and max.
 *  - elo >= tier max  -> bar is full + "^^" (promotion pending)
 *  - elo <  tier min  -> bar is empty + "v" (demotion pending)
 * The top tier has no max (always full, never promotes); the lowest tier
 * has nowhere to demote to, so it never shows the down marker.
 */
function EloBar({ elo, tier }: { elo: number; tier: Tier }) {
  const { min, max } = getTierRange(tier);
  const color = getEloColor(elo);

  const span = max === null ? 0 : max - min;
  const progress =
    max === null || span <= 0 ? 1 : Math.min(1, Math.max(0, (elo - min) / span));

  const overRanked = max !== null && elo >= max;
  const underRanked = tier !== TIER_SCALE[0] && elo < min;

  return (
    <div className="elo-row">
      <div
        className="elo-bar"
        role="progressbar"
        aria-valuemin={min}
        aria-valuemax={max ?? undefined}
        aria-valuenow={Math.round(elo)}
        style={{ '--elo-color': color } as React.CSSProperties}
      >
        <div className="elo-bar__fill" style={{ width: `${progress * 100}%` }} />
        <span className="elo-bar__value">{Math.round(elo * 10) / 10}</span>
      </div>
      {overRanked && <RankArrows direction="up" color={color} />}
      {underRanked && <RankArrows direction="down" color={DEMOTE_COLOR} />}
    </div>
  );
}

function RankArrows({ direction, color }: { direction: 'up' | 'down'; color: string }) {
  const up = direction === 'up';
  return (
    <svg
      className={`rank-arrows rank-arrows--${direction}`}
      width="18"
      height="20"
      viewBox="0 0 24 26"
      fill="none"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={up ? "Elo is above this tier's range" : "Elo is below this tier's range"}
    >
      <title>
        {up
          ? 'Elo is above this tier. Promotion pending.'
          : 'Elo is below this tier. Demotion pending.'}
      </title>
      {up ? (
        <>
          <path d="M4 12l8-8 8 8" />
          <path d="M4 22l8-8 8 8" />
        </>
      ) : (
        <path d="M4 8l8 8 8-8" />
      )}
    </svg>
  );
}

function TrophyIcon({ htColor, ltColor }: { htColor: string; ltColor: string }) {
  const gradId = `trophy-grad-${htColor.replace('#', '')}-${ltColor.replace('#', '')}`;
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={htColor} />
          <stop offset="100%" stopColor={ltColor} />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradId})`}
        d="M6 3h12v2h3v3a4 4 0 01-4 4h-.3A6 6 0 0113 15.9V19h3v2H8v-2h3v-3.1A6 6 0 017.3 12H7a4 4 0 01-4-4V5h3V3zm0 4H5v1a2 2 0 002 2V7zm12 0v3a2 2 0 002-2V7h-2z"
      />
    </svg>
  );
}