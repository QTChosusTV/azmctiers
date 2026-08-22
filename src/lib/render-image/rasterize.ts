import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { loadFonts } from './fonts';
import type { CARD_HEIGHT, CARD_WIDTH } from './buildLayout';

/**
 * Renders a satori element tree to a PNG buffer.
 * Uses resvg (Rust-backed) for fast, dependency-light rasterization
 * instead of a headless browser.
 */
export async function rasterize(
  tree: unknown,
  width: number,
  height: number
): Promise<Buffer> {
  const fonts = await loadFonts();

  const svg = await satori(tree as any, {
    width,
    height,
    fonts,
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
  });

  const pngData = resvg.render();
  return pngData.asPng();
}
