import type { PlayerSummary, ModeTier } from './types';
import { tierColor } from './tierScale';

const COLORS = {
  bgPanel: '#150c22',
  bgPanelRaised: '#1d1229',
  borderStrong: '#3a2a52',
  borderSubtle: '#2a1d3d',
  textPrimary: '#f2eefa',
  textSecondary: '#b8a9cc',
  textMuted: '#8677a0',
  accentGold: '#ffd84f',
  emptySlot: '#251a33',
};

const CARD_W = 640;
const CARD_H = 760;

function sortModeTiers(modeTiers: ModeTier[]): ModeTier[] {
  return [...modeTiers].sort((a, b) => {
    const aEmpty = !a.tier;
    const bEmpty = !b.tier;
    if (aEmpty && !bEmpty) return 1;
    if (!aEmpty && bEmpty) return -1;
    return (b.elo ?? 0) - (a.elo ?? 0);
  });
}

function modeIconLabel(mode: string): string {
  // Short label fallback since real mode icon assets weren't provided.
  return mode.slice(0, 2).toUpperCase();
}

function TierBadge(mt: ModeTier) {
  const color = tierColor(mt.tier);
  const filled = Boolean(mt.tier);

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 92,
        height: 92,
        borderRadius: 12,
        background: filled ? `${color}22` : COLORS.emptySlot,
        border: `2px solid ${filled ? color : COLORS.borderSubtle}`,
        gap: 4,
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontSize: 13,
              fontFamily: 'Inter',
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: COLORS.textSecondary,
            },
            children: modeIconLabel(mt.mode),
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontSize: 26,
              fontFamily: 'Teko',
              fontWeight: 600,
              color: filled ? color : COLORS.textMuted,
              lineHeight: 1,
            },
            children: mt.tier ?? '—',
          },
        },
      ],
    },
  };
}

export interface LayoutInput {
  player: PlayerSummary;
  rank: number;
  avatarDataUri: string | null;
}

export function buildLayout({ player, rank, avatarDataUri }: LayoutInput) {
  const sortedTiers = sortModeTiers(player.modeTiers);

  return {
    type: 'div',
    props: {
      style: {
        width: CARD_W,
        height: CARD_H,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: COLORS.bgPanel,
        border: `1px solid ${COLORS.borderStrong}`,
        borderRadius: 16,
        padding: '40px 32px 32px',
        fontFamily: 'Inter',
      },
      children: [
        // Avatar
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              width: 96,
              height: 96,
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: `0 0 0 3px ${COLORS.borderStrong}`,
              background: COLORS.bgPanelRaised,
              alignItems: 'center',
              justifyContent: 'center',
            },
            children: avatarDataUri
              ? {
                  type: 'img',
                  props: {
                    src: avatarDataUri,
                    width: 96,
                    height: 96,
                    style: { objectFit: 'cover' },
                  },
                }
              : {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      fontSize: 40,
                      fontFamily: 'Teko',
                      color: COLORS.textMuted,
                    },
                    children: player.username.slice(0, 1).toUpperCase(),
                  },
                },
          },
        },
        // Name
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontFamily: 'Teko',
              fontSize: 44,
              fontWeight: 600,
              color: COLORS.textPrimary,
              margin: '16px 0 20px',
            },
            children: player.username,
          },
        },
        // Rank panel
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              background: COLORS.bgPanelRaised,
              border: `1px solid ${COLORS.borderSubtle}`,
              borderRadius: 12,
              padding: 18,
              marginBottom: 24,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontFamily: 'Teko',
                    fontSize: 48,
                    fontWeight: 700,
                    color: COLORS.textPrimary,
                    lineHeight: 1,
                  },
                  children: `#${rank}`,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 6,
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: COLORS.accentGold,
                  },
                  children: [
                    { type: 'div', props: { style: { display: 'flex' }, children: 'OVERALL' } },
                    {
                      type: 'div',
                      props: {
                        style: { display: 'flex', color: COLORS.textSecondary, fontWeight: 600 },
                        children: `(${player.points} points)`,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // Tiers label
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontFamily: 'Teko',
              fontSize: 15,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: COLORS.textSecondary,
              marginBottom: 14,
            },
            children: 'Tiers',
          },
        },
        // Tier badge grid
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 10,
              width: '100%',
            },
            children: sortedTiers.map((mt) => TierBadge(mt)),
          },
        },
        // Footer
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              marginTop: 'auto',
              paddingTop: 24,
              fontSize: 13,
              color: COLORS.textMuted,
              letterSpacing: '0.04em',
            },
            children: `AZMCTiers · ${player.isPremium ? 'Premium' : 'Cracked'}`,
          },
        },
      ],
    },
  };
}

export const CARD_WIDTH = CARD_W;
export const CARD_HEIGHT = CARD_H;
