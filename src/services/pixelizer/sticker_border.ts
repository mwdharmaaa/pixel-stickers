export function applyStickerBorder(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  borderColorHex: string
): void {
  const imgData = ctx.getImageData(0, 0, width, height)
  const data = imgData.data
  const borderData = ctx.createImageData(width, height)
  const bData = borderData.data

  // Parse border color
  const hex = borderColorHex.replace('#', '')
  const br = Number.parseInt(hex.substring(0, 2), 16) || 255
  const bg = Number.parseInt(hex.substring(2, 4), 16) || 255
  const bb = Number.parseInt(hex.substring(4, 6), 16) || 255

  // Helper to check if a pixel is opaque
  const isOpaque = (x: number, y: number) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return false
    const idx = (y * width + x) * 4
    return data[idx + 3] > 30
  }

  // Find 4-neighborhood outline around non-transparent pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const currentAlpha = data[idx + 3]

      if (currentAlpha <= 30) {
        // If current is transparent, check if any neighbor is opaque
        const hasOpaqueNeighbor =
          isOpaque(x - 1, y) ||
          isOpaque(x + 1, y) ||
          isOpaque(x, y - 1) ||
          isOpaque(x, y + 1) ||
          isOpaque(x - 1, y - 1) ||
          isOpaque(x + 1, y - 1) ||
          isOpaque(x - 1, y + 1) ||
          isOpaque(x + 1, y + 1)

        if (hasOpaqueNeighbor) {
          bData[idx] = br
          bData[idx + 1] = bg
          bData[idx + 2] = bb
          bData[idx + 3] = 255
        }
      } else {
        // Copy original pixel
        bData[idx] = data[idx]
        bData[idx + 1] = data[idx + 1]
        bData[idx + 2] = data[idx + 2]
        bData[idx + 3] = data[idx + 3]
      }
    }
  }

  ctx.putImageData(borderData, 0, 0)
}
