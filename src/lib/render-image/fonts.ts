import { readFile } from 'node:fs/promises';
import path from 'node:path';

export interface SatoriFont {
  name: string;
  data: Buffer;
  weight: 400 | 500 | 600 | 700;
  style: 'normal';
}

const ASSET_DIR = path.join(__dirname, '..', 'assets');

let cached: SatoriFont[] | null = null;

/**
 * Loads and caches the font buffers satori needs. Only reads from disk once
 * per process; subsequent calls reuse the cached buffers.
 */
export async function loadFonts(): Promise<SatoriFont[]> {
  if (cached) return cached;

  const [tekoRegular, tekoSemiBold, tekoBold, interRegular, interSemiBold, interBold] =
    await Promise.all([
      readFile(path.join(ASSET_DIR, 'Teko-Regular.ttf')),
      readFile(path.join(ASSET_DIR, 'Teko-SemiBold.ttf')),
      readFile(path.join(ASSET_DIR, 'Teko-Bold.ttf')),
      readFile(path.join(ASSET_DIR, 'Inter-Regular.ttf')),
      readFile(path.join(ASSET_DIR, 'Inter-SemiBold.ttf')),
      readFile(path.join(ASSET_DIR, 'Inter-Bold.ttf')),
    ]);

  cached = [
    { name: 'Teko', data: tekoRegular, weight: 400, style: 'normal' },
    { name: 'Teko', data: tekoSemiBold, weight: 600, style: 'normal' },
    { name: 'Teko', data: tekoBold, weight: 700, style: 'normal' },
    { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
    { name: 'Inter', data: interSemiBold, weight: 600, style: 'normal' },
    { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
  ];

  return cached;
}
