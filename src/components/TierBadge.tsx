// TierBadge.tsx

import { useState } from 'react';
import type { Mode, Tier } from '../lib/tiers';
import { getEloColor, TIER_SCORE } from '../lib/tiers';
import { ModeIcon } from './ModeIcon';

export function TierBadge({
  mode,
  tier,
  elo,
  showTooltip = false,
}: {
  mode: Mode;
  tier: Tier | null;
  elo?: number;
  showTooltip?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const color = tier ? getEloColor(elo ?? 0) : 'var(--text-muted)';
  const tintedBg = tier
    ? `color-mix(in srgb, ${color} 22%, var(--bg-panel-raised))`
    : 'var(--bg-panel-raised)';
  const tintedLabelBg = tier
    ? `color-mix(in srgb, ${color} 18%, transparent)`
    : 'transparent';

  const points = tier ? TIER_SCORE[tier] : 0;

  return (
    <div
      className="tier-badge"
      onMouseEnter={showTooltip ? () => setHovered(true) : undefined}
      onMouseLeave={showTooltip ? () => setHovered(false) : undefined}
    >
      <div
        className="tier-badge__icon"
        style={{
          color,
          borderColor: tier ? getEloColor(elo ?? 0) : 'var(--border-subtle)',
          background: tintedBg,
          opacity: tier ? 1 : 0.35,
        }}
      >
        <ModeIcon mode={mode} size={26} />
      </div>
      <span
        className="tier-badge__label"
        style={{
          color: tier ? getEloColor(elo ?? 0) : 'var(--text-muted)',
          background: tintedLabelBg,
        }}
      >
        {elo === 0 ? '–' : Math.round(elo ?? 0)}
      </span>

      {tier && showTooltip && (
        <div className={`tier-badge__tooltip ${hovered ? 'tier-badge__tooltip--visible' : ''}`}>
          <span className="tier-badge__tooltip-elo" style={{ color }}>
            {Math.round(elo ?? 0)} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>azp</span>
          </span>
          <div className="tier-badge__tooltip-tier" style={{ color }}>
            &mdash; {tier} &mdash;
          </div>
          <div className="tier-badge__tooltip-points">{points} point{points === 1 ? '' : 's'}</div>
          <div className="tier-badge__tooltip-arrow" />
        </div>
      )}

      <style>{`
        .tier-badge {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          width: 50px;
        }
        .tier-badge__icon {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 1.5px solid;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tier-badge__label {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.03em;
          padding: 2px 10px;
          border-radius: 999px;
        }
        .tier-badge__tooltip {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%) translateY(4px) scale(0.96);
          background: var(--bg-panel-raised, #1a1428);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 14px 20px;
          white-space: nowrap;
          text-align: center;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s ease, transform 0.15s ease;
          z-index: 20;
        }
        .tier-badge__tooltip--visible {
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1);
        }
        .tier-badge__tooltip-arrow {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 5px;
          background: var(--bg-panel-raised, #1a1428);
          border-right: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }
        .tier-badge__tooltip-tier {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .tier-badge__tooltip-elo {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 600;
          margin-top: 4px;
        }
        .tier-badge__tooltip-points {
          font-size: 14px;
          color: var(--text-muted);
          margin-top: 1px;
        }
        @media (prefers-reduced-motion: reduce) {
          .tier-badge__tooltip {
            transition: opacity 0.1s ease;
            transform: translateX(-50%);
          }
          .tier-badge__tooltip--visible {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}