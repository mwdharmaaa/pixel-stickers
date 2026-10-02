import { applyStickerBorder } from '../services/pixelizer/sticker_border'
import type { Sticker } from '../types/sticker.types'
import { DEFAULT_PIXEL_ARTS } from './pixel_matrices'

export function renderPixelArtDefToDataUrl(
  rows: string[],
  palette: Record<string, string>,
  pixelScale = 4,
  addBorder = true
): { dataUrl: string; width: number; height: number; colors: string[] } {
  const height = rows.length
  const width = Math.max(...rows.map((r) => r.length))

  // Render on 1:1 pixel canvas first
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context unavailable')

  const uniqueColors = new Set<string>()

  for (let y = 0; y < height; y++) {
    const row = rows[y]
    for (let x = 0; x < row.length; x++) {
      const char = row[x]
      const color = palette[char]
      if (color && color !== 'transparent') {
        ctx.fillStyle = color
        ctx.fillRect(x, y, 1, 1)
        uniqueColors.add(color)
      }
    }
  }

  // Add 1px die-cut border if requested
  if (addBorder) {
    applyStickerBorder(ctx, width, height, '#ffffff')
  }

  // Scale up to crisp pixel scale
  const scaledCanvas = document.createElement('canvas')
  scaledCanvas.width = width * pixelScale
  scaledCanvas.height = height * pixelScale
  const scaledCtx = scaledCanvas.getContext('2d')
  if (scaledCtx) {
    scaledCtx.imageSmoothingEnabled = false
    scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height)
  }

  return {
    dataUrl: scaledCanvas.toDataURL('image/png'),
    width: scaledCanvas.width,
    height: scaledCanvas.height,
    colors: Array.from(uniqueColors),
  }
}

export function generateDefaultStickers(): Sticker[] {
  return DEFAULT_PIXEL_ARTS.map((art, idx) => {
    const rendered = renderPixelArtDefToDataUrl(art.rows, art.palette, 8, true)
    return {
      id: art.id,
      title: art.title,
      category: art.category,
      tags: art.tags,
      pixelDataUrl: rendered.dataUrl,
      width: rendered.width,
      height: rendered.height,
      colors: rendered.colors,
      createdAt: Date.now() - (DEFAULT_PIXEL_ARTS.length - idx) * 3600000,
    }
  })
}
