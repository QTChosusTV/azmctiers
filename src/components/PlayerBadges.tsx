// PlayerBadges.tsx

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const BADGE_BUCKET = 'badges'; // adjust to match your Supabase storage bucket name

export interface BadgeRow {
  id: number;
  discordId: string;
  imagePath: string;
  label: string | null;
  awardedAt: string;
}

function badgeUrl(imagePath: string) {
  const { data } = supabase.storage.from(BADGE_BUCKET).getPublicUrl(imagePath);
  return data.publicUrl;
}

export function PlayerBadges({ discordId }: { discordId: string }) {
  const [badges, setBadges] = useState<BadgeRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setBadges(null); // reset when switching players so stale badges don't flash

    supabase
      .from('badges')
      .select('id, discordId, imagePath, label, awardedAt')
      .eq('discordId', discordId)
      .order('awardedAt', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error('Failed to load badges:', error.message);
          setBadges([]);
          return;
        }
        setBadges((data ?? []) as BadgeRow[]);
      });

    return () => {
      cancelled = true;
    };
  }, [discordId]);

  // Nothing to show yet (loading) or player has no badges — render nothing,
  // so the modal layout doesn't leave an awkward empty gap.
  if (!badges || badges.length === 0) return null;

  return (
    <div className="player-badges">
      <div className="player-badges__label">Badges</div>
      <div className="player-badges__row">
        {badges.map((b, i) => (
          <img
            key={b.id}
            src={badgeUrl(b.imagePath)}
            alt={b.label ?? 'Badge'}
            title={b.label ?? undefined}
            className="player-badges__badge"
            style={{ animationDelay: `${i * 40}ms` }}
            loading="lazy"
          />
        ))}
      </div>

      <style>{`
        .player-badges {
          width: 100%;
          margin-bottom: 20px;
        }
        .player-badges__label {
          font-family: var(--font-display);
          font-size: 15px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-secondary);
          margin-bottom: 10px;
          text-align: center;
        }
        .player-badges__row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
        }
        .player-badges__badge {
          height: 50px;
          width: auto;
          max-width: 100%;
          border-radius: 4px;
          display: block;
          opacity: 0;
          transform: translateY(6px) scale(0.95);
          animation: badge-pop-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @media (max-width: 480px) {
          .player-badges__badge {
            height: 32px;
          }
        }
        @keyframes badge-pop-in {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .player-badges__badge {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}