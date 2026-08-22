// TierIcon.tsx

import type { Tier } from '../lib/tiers';

import ht1Icon from '../assets/tier/HT1.png';
import ht2Icon from '../assets/tier/HT2.png';
import ht3Icon from '../assets/tier/HT3.png';
import ht4Icon from '../assets/tier/HT4.png';
import ht5Icon from '../assets/tier/HT5.png';

import lt1Icon from '../assets/tier/LT1.png';
import lt2Icon from '../assets/tier/LT2.png';
import lt3Icon from '../assets/tier/LT3.png';
import lt4Icon from '../assets/tier/LT4.png';
import lt5Icon from '../assets/tier/LT5.png';

const TIER_ICONS: Record<Tier, string> = {
  HT1: ht1Icon,
  HT2: ht2Icon,
  HT3: ht3Icon,
  HT4: ht4Icon,
  HT5: ht5Icon,
  LT1: lt1Icon,
  LT2: lt2Icon,
  LT3: lt3Icon,
  LT4: lt4Icon,
  LT5: lt5Icon,
};

export function TierIcon({
  tier,
  size = 18,
}: {
  tier: Tier | null;
  size?: number;
}) {
  if (!tier) return null;

  return (
    <img
      src={TIER_ICONS[tier]}
      width={size}
      height={size}
      alt={tier}
      draggable={false}
      style={{
        display: 'block',
        objectFit: 'contain',
      }}
    />
  );
}