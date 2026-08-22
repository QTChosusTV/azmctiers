// PlayerModal.tsx

import type { PlayerSummary } from '../lib/tiers';
import { PlayerAvatar } from './PlayerAvatar';
import { TierBadge } from './TierBadge';

export function PlayerModal({
  player,
  rank,
  onClose,
}: {
  player: PlayerSummary;
  rank: number;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="modal__avatar">
          <PlayerAvatar username={player.username} size={96} />
        </div>

        <h2 className="modal__name">{player.username}</h2>

        <div className="modal__rank">
          <div className="modal__rank-number">#{rank}</div>
          <div className="modal__rank-points">
            <TrophyIcon /> OVERALL <span className="modal__points-value">({player.points} points)</span>
          </div>
        </div>

        <div className="modal__tiers-label">Tiers</div>
        <div className="modal__tiers">
          {[...player.modeTiers]
            .sort((a, b) => {
              const aEmpty = !a.tier;
              const bEmpty = !b.tier;

              if (aEmpty && !bEmpty) return 1;
              if (!aEmpty && bEmpty) return -1;

              return (b.elo ?? 0) - (a.elo ?? 0);
            })
            .map(({ mode, tier, elo }) => (
              <TierBadge
                key={mode}
                mode={mode}
                tier={tier}
                elo={elo ?? -1}
                showTooltip
              />
            ))}
        </div>
        <div className="modal__footer">AZMCTiers &middot; {!player.isPremium && "Cracked"}{player.isPremium && "Premium"}</div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(5, 2, 12, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 20px;
          animation: modal-backdrop-fade-in 0.2s ease both;
        }
        .modal {
          position: relative;
          width: 100%;
          max-width: 600px;
          background: var(--bg-panel);
          border: 1px solid var(--border-strong);
          border-radius: 16px;
          padding: 40px 32px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          animation: modal-pop-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes modal-backdrop-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modal-pop-in {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .modal-backdrop, .modal {
            animation: none;
          }
        }
        .modal__close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-panel-raised);
          border: none;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .modal__close:hover {
          color: var(--text-primary);
        }
        .modal__avatar img {
          border-radius: 8px;
          box-shadow: 0 0 0 3px var(--border-strong);
        }
        .modal__name {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 600;
          margin: 16px 0 20px;
        }
        .modal__rank {
          width: 100%;
          background: var(--bg-panel-raised);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 18px;
          margin-bottom: 24px;
        }
        .modal__rank-number {
          font-family: var(--font-display);
          font-size: 40px;
          font-weight: 700;
        }
        .modal__rank-points {
          margin-top: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: var(--tier-1);
          font-weight: 700;
          letter-spacing: 0.04em;
          font-size: 15px;
        }
        .modal__points-value {
          color: var(--text-secondary);
          font-weight: 600;
        }
        .modal__tiers-label {
          font-family: var(--font-display);
          font-size: 15px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-secondary);
          margin-bottom: 14px;
        }
        .modal__tiers {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px 8px;
        }
        .modal__footer {
          margin-top: 24px;
          font-size: 13px;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }
      `}</style>
    </div>
  );
}

function TrophyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffff00" aria-hidden="true">
      <path d="M6 3h12v2h3v3a4 4 0 01-4 4h-.3A6 6 0 0113 15.9V19h3v2H8v-2h3v-3.1A6 6 0 017.3 12H7a4 4 0 01-4-4V5h3V3zm0 4H5v1a2 2 0 002 2V7zm12 0v3a2 2 0 002-2V7h-2z" />
    </svg>
  );
}