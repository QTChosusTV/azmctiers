import type { SupabaseClient } from '@supabase/supabase-js';
import { fetchPlayerByDiscordId, fetchPlayerRank, PlayerNotFoundError } from './fetchPlayer';
import { fetchAvatarDataUri } from './avatar';
import { buildLayout, CARD_WIDTH, CARD_HEIGHT } from './buildLayout';
import { rasterize } from './rasterize';

export { PlayerNotFoundError } from './fetchPlayer';
export type { PlayerSummary, ModeTier, Mode, TierLabel } from './types';

/**
 * Renders a player's tier card (matching the web PlayerModal component) as
 * a PNG buffer, ready to attach to a Discord message.
 *
 * @param supabase  A Supabase client. Use the service_role client here
 *                   (same one the bot already uses) since this reads the
 *                   full `tiers` table to compute rank.
 * @param discordId The player's Discord ID.
 * @returns          PNG image buffer.
 *
 * @throws {PlayerNotFoundError} if no row exists for the given discordId.
 *
 * @example
 * import { AttachmentBuilder } from 'discord.js';
 * import { exportModalAsPng } from '../lib/render-image';
 *
 * const png = await exportModalAsPng(supabase, interaction.user.id);
 * const attachment = new AttachmentBuilder(png, { name: 'card.png' });
 * await interaction.reply({ files: [attachment] });
 */
export async function exportModalAsPng(
  supabase: SupabaseClient,
  discordId: string
): Promise<Buffer> {
  const player = await fetchPlayerByDiscordId(supabase, discordId);
  const rank = await fetchPlayerRank(supabase, discordId, player.points);
  const avatarDataUri = await fetchAvatarDataUri(player.username);

  const tree = buildLayout({ player, rank, avatarDataUri });

  return rasterize(tree, CARD_WIDTH, CARD_HEIGHT);
}
