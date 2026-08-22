/**
 * Fetches the 3D bust render for a username (same source as
 * PlayerAvatar.tsx: render.crafty.gg) and returns it as a base64 data URI
 * so satori can inline it directly instead of fetching mid-render.
 *
 * Falls back to null on any failure (missing/unknown username, network
 * error, etc.) so the caller can render a placeholder instead of throwing.
 */
export async function fetchAvatarDataUri(username: string): Promise<string | null> {
  const url = `https://render.crafty.gg/3d/bust/${encodeURIComponent(username)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const contentType = res.headers.get('content-type') ?? 'image/png';
    const buf = Buffer.from(await res.arrayBuffer());

    if (buf.length === 0) return null;

    return `data:${contentType};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}
