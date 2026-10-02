import { findNearestColor, rgbToHex } from './color_quantizer'
import type { PixelizerOptions, ProcessedPixelResult } from './pixelizer.types'
import { applyStickerBorder } from './sticker_border'

export async function processPixelArt(
  imageSource: HTMLImageElement | ImageBitmap,
  options: PixelizerOptions
): Promise<ProcessedPixelResult> {
  const { pixelSize, palette, brightness, contrast, removeBackground, bgThreshold, addStickerBorder, borderColor } = options

  // Target grid resolution
  const targetCols = Math.max(8, Math.min(128, pixelSize))
  const aspect = imageSource.height / imageSource.width
  const targetRows = Math.round(targetCols * aspect)

  const canvas = document.createElement('canvas')
  canvas.width = targetCols
  canvas.height = targetRows
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Failed to acquire canvas 2D context')

  // Disable smoothing for sharp pixel scaling
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(imageSource, 0, 0, targetCols, targetRows)

  const imgData = ctx.getImageData(0, 0, targetCols, targetRows)
  const data = imgData.data
  const colorCounts = new Map<string, number>()

  // Detect corner color if background removal requested
  const cornerR = data[0]
  const cornerG = data[1]
  const cornerB = data[2]

  const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast))

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i]
    let g = data[i + 1]
    let b = data[i + 2]
    const a = data[i + 3]

    // Skip transparent pixels
    if (a < 20) continue

    // Auto remove background matching corner or luminance if requested
    if (removeBackground) {
      const distFromCorner = Math.sqrt(
        (r - cornerR) ** 2 + (g - cornerG) ** 2 + (b - cornerB) ** 2
      )
      const isNearWhite = r > 240 && g > 240 && b > 240
      if (distFromCorner < bgThreshold || isNearWhite) {
        data[i + 3] = 0
        continue
      }
    }

    // Apply brightness
    r += brightness
    g += brightness
    b += brightness

    // Apply contrast
    r = contrastFactor * (r - 128) + 128
    g = contrastFactor * (g - 128) + 128
    b = contrastFactor * (b - 128) + 128

    // Clamp
    r = Math.max(0, Math.min(255, r))
    g = Math.max(0, Math.min(255, g))
    b = Math.max(0, Math.min(255, b))

    // Quantize palette
    const [qr, qg, qb] = findNearestColor(r, g, b, palette)
    data[i] = qr
    data[i + 1] = qg
    data[i + 2] = qb

    const hex = rgbToHex(qr, qg, qb)
    colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1)
  }

  ctx.putImageData(imgData, 0, 0)

  // Apply optional sticker border
  if (addStickerBorder) {
    applyStickerBorder(ctx, targetCols, targetRows, borderColor)
  }

  // Extract top 6 dominant colors sorted by frequency
  const dominantColors = Array.from(colorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([hex]) => hex)

  return {
    dataUrl: canvas.toDataURL('image/png'),
    width: targetCols,
    height: targetRows,
    dominantColors,
  }
}
