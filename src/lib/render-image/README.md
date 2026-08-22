# render-image

Renders a player's tier card (visually matching the web `PlayerModal`
component) as a PNG buffer, for use in Discord bot commands.

## Install into `chosusqt-bot`

1. Copy this folder to `src/lib/render-image/`.
2. Copy `../assets/*.ttf` (six font files) to `src/lib/assets/`.
3. Install dependencies:
   ```bash
   npm install satori @resvg/resvg-js
   ```
   (`@supabase/supabase-js` is assumed already installed, since the bot
   already uses it.)

## Usage

```ts
import { AttachmentBuilder } from 'discord.js';
import { exportModalAsPng, PlayerNotFoundError } from '../lib/render-image';
import { supabase } from '../lib/supabase'; // your existing client

// inside a command handler
try {
  const png = await exportModalAsPng(supabase, targetUser.id);
  const attachment = new AttachmentBuilder(png, { name: 'card.png' });
  await interaction.reply({ files: [attachment] });
} catch (err) {
  if (err instanceof PlayerNotFoundError) {
    await interaction.reply({ content: 'That player isn\'t verified yet.', ephemeral: true });
  } else {
    throw err;
  }
}
```

The function signature is:

```ts
function exportModalAsPng(
  supabase: SupabaseClient,
  discordId: string
): Promise<Buffer>
```

## What's real vs. placeholder

- **Layout, fonts, colors, points calc, tier sorting** — implemented and
  tested (see `test-render.ts` in the scratch environment this was built in;
  not part of the library itself, delete or ignore it).
- **Tier badge colors** (`tierScale.ts` → `TIER_COLOR`) — placeholder fixed
  colors per tier. Your real `TierBadge.tsx` component has a 12-stop RGB
  gradient interpolated across the 0-9999 elo range (per your memory notes)
  that wasn't shared in this session. Paste `TierBadge.tsx` and I'll wire
  the exact gradient math into `tierColor()`.
- **Mode icons** — currently a 2-letter text fallback (`AX`, `SW`, etc.)
  since the real icon assets (referenced as base64/`window.ICONS` in your
  other tools) weren't in this session's context. Swap `modeIconLabel()` in
  `buildLayout.ts` for actual icon images once you want to wire those in —
  satori accepts `<img src="data:image/png;base64,...">` the same way the
  avatar is handled.
- **Avatar source** — `render.crafty.gg/3d/bust/<username>`, matching
  `PlayerAvatar.tsx` exactly. Falls back to a text placeholder (first letter
  of username) if the fetch fails, so a bad/missing skin never breaks the
  whole render.
- **Rank calculation** (`fetchPlayerRank`) — pulls the full `tiers` table
  and computes rank client-side in the bot process. Fine at your current
  scale; if the player base grows large, this should become a Postgres
  view/RPC that returns rank directly instead of transferring every row per
  render.

## Performance note

`loadFonts()` caches font buffers in memory after the first call, so only
the very first render per bot process pays the disk-read cost. Each
individual render (satori → SVG → PNG) should take roughly 10-50ms once
fonts are warm — no headless browser involved.
