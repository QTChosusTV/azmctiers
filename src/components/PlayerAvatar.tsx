// 3D bust render, keyed by username, via crafty.gg.
export function PlayerAvatar({ username, size = 40 }: { username: string; size?: number }) {
  const src = `https://render.crafty.gg/3d/bust/${encodeURIComponent(username)}`;
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={username}
      style={{ borderRadius: 6, display: 'block', flexShrink: 0, objectFit: 'cover' }}
      loading="lazy"
    />
  );
}
