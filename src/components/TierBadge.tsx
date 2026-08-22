// TierBadge.tsx

import type { Mode, Tier } from '../lib/tiers';
import { getEloColor } from '../lib/tiers';
import { ModeIcon } from './ModeIcon';

export function TierBadge({
  mode,
  tier,
  elo,
}: {
  mode: Mode;
  tier: Tier | null;
  elo?: number;
}) {
  const color = tier ? getEloColor(elo ?? 0) : 'var(--text-muted)';
  const tintedBg = tier
    ? `color-mix(in srgb, ${color} 22%, var(--bg-panel-raised))`
    : 'var(--bg-panel-raised)';
  const tintedLabelBg = tier
    ? `color-mix(in srgb, ${color} 18%, transparent)`
    : 'transparent';

  return (
    <div className="tier-badge">
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

      <style>{`
        .tier-badge {
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
      `}</style>
    </div>
  );
}