// Leaderboard.tsx

import { useMemo } from 'react';
import { type PlayerSummary } from '../lib/tiers';
import { PlayerAvatar } from './PlayerAvatar';
import { TierBadge } from './TierBadge';
import { RevealRow } from './RevealRow';

export function Leaderboard({
  players,
  onSelect,
}: {
  players: PlayerSummary[];
  onSelect?: (p: PlayerSummary) => void;
}) {
  const rows = useMemo(() => [...players].sort((a, b) => b.points - a.points), [players]);

  return (
    <div className="leaderboard">
      <div className="leaderboard__header">
        <span className="col-rank">#</span>
        <span className="col-player">Player</span>
        <span className="col-points">Points</span>
        <span className="col-tiers">Tiers</span>
      </div>

      <div className="leaderboard__rows">
        {rows.map((p, i) => {
          const sortedModeTiers = [...p.modeTiers].sort((a, b) => {
            const aEmpty = !a.tier;
            const bEmpty = !b.tier;

            if (aEmpty && !bEmpty) return -1;
            if (!aEmpty && bEmpty) return 1;

            if (aEmpty && bEmpty) return 0;
            return (b.elo ?? 0) - (a.elo ?? 0);
          });

          return (
            <RevealRow
              key={p.discordId}
              index={i}
              className="leaderboard__row"
              onClick={() => onSelect?.(p)}
              role={onSelect ? 'button' : undefined}
              tabIndex={onSelect ? 0 : undefined}
            >
              <span className="col-rank">{i + 1}</span>
              <span className="col-player">
                <PlayerAvatar username={p.username} size={44} />
                <span className="player-name">{p.username}</span>
              </span>
              <span className="col-points">{p.points}</span>
              <span className="col-tiers">
                {sortedModeTiers.map(({ mode, tier, elo }) => (
                  <TierBadge key={mode} mode={mode} tier={tier} elo={elo ?? -1} />
                ))}
              </span>
            </RevealRow>
          );
        })}

        {rows.length === 0 && <div className="leaderboard__empty">No players yet.</div>}
      </div>

      <style>{`
        .leaderboard {
          background: var(--bg-panel);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          overflow: hidden;
        }
        .leaderboard__header {
          display: grid;
          grid-template-columns: 72px 0.67fr 0.33fr 460px;
          align-items: center;
          padding: 14px 28px;
          background: var(--bg-panel-raised);
          border-bottom: 1px solid var(--border-subtle);
          font-family: var(--font-display);
          font-size: 16px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .leaderboard__row {
          display: grid;
          grid-template-columns: 72px 0.67fr 0.33fr 460px;
          align-items: center;
          padding: 10px 28px;
          border-bottom: 1px solid var(--border-subtle);
          cursor: ${onSelect ? 'pointer' : 'default'};
          transition: background 0.15s ease, opacity 0.35s ease, transform 0.35s ease;
        }
        .leaderboard__row:last-child {
          border-bottom: none;
        }
        .leaderboard__row:hover {
          background: var(--bg-panel-raised);
        }
        .col-rank {
          font-family: var(--font-display);
          font-size: 20px;
          color: var(--text-secondary);
        }
        .col-player {
          font-size: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .player-name {
          font-weight: 600;
          font-size: 20px;
        }
        .col-points {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 400;
          color: var(--text-primary);
        }
        .col-tiers {
          display: flex;
          font-size: 20px;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .leaderboard__empty {
          padding: 40px;
          text-align: center;
          color: var(--text-muted);
        }
        @media (max-width: 1100px) {
          .leaderboard__header, .leaderboard__row {
            grid-template-columns: 40px 1fr;
            row-gap: 10px;
          }
          .col-points { justify-self: start; }
          .col-tiers { grid-column: 1 / -1; justify-content: flex-start; }
        }
      `}</style>
    </div>
  );
}