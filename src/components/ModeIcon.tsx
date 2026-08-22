import type { Mode } from '../lib/tiers';

import axeIcon from '../assets/modes/axe.png';
import swordIcon from '../assets/modes/sword.png';
import nethopIcon from '../assets/modes/nethop.png';
import smpIcon from '../assets/modes/smp.png';
import maceIcon from '../assets/modes/mace.png';
import vanillaIcon from '../assets/modes/vanilla.png';
import potIcon from '../assets/modes/pot.png';
import uhcIcon from '../assets/modes/uhc.png';

// NOTE: schema has two "pot" modes (diapot = Diamond Pot, nethop = Netherite
// Pot) but only one pot.png was provided. Mapping pot.png -> diapot for now;
// swap in a second icon file here if you have a distinct Diamond Pot asset.
const ICONS: Record<Mode, string> = {
  axe: axeIcon,
  sword: swordIcon,
  nethop: nethopIcon,
  smp: smpIcon,
  mace: maceIcon,
  vanilla: vanillaIcon,
  diapot: potIcon,
  uhc: uhcIcon,
};

export function ModeIcon({ mode, size = 18 }: { mode: Mode; size?: number }) {
  return (
    <img
      src={ICONS[mode]}
      width={size}
      height={size}
      alt=""
      style={{
        display: 'block',
        objectFit: 'contain',
        filter: 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.8))',
      }}
      draggable={false}
    />
  );
}