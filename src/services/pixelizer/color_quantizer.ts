import { PALETTE_COLORS } from './palette_presets'
import type { PalettePreset } from './pixelizer.types'

export function findNearestColor(
  r: number,
  g: number,
  b: number,
  palette: PalettePreset
): [number, number, number] {
  if (palette === 'full-color') {
    return [r, g, b]
  }

  const colors = PALETTE_COLORS[palette]
  if (!colors || colors.length === 0) {
    return [r, g, b]
  }

  let minDist = Number.POSITIVE_INFINITY
  let bestColor: [number, number, number] = colors[0]

  for (const color of colors) {
    // Weighted Euclidean distance for human perception
    const dr = r - color[0]
    const dg = g - color[1]
    const db = b - color[2]
    const dist = 0.299 * dr * dr + 0.587 * dg * dg + 0.114 * db * db

    if (dist < minDist) {
      minDist = dist
      bestColor = color
    }
  }

  return bestColor
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}
