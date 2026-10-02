import { upscalePixelDataUrl } from './sticker_exporter.service'

export interface PixelDataInfo {
  width: number
  height: number
  data: Uint8ClampedArray
}

export function extractCanvasImageData(
  img: HTMLImageElement
): PixelDataInfo {
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth || img.width
  canvas.height = img.naturalHeight || img.height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable')
  }
  ctx.drawImage(img, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  return {
    width: canvas.width,
    height: canvas.height,
    data: imageData.data,
  }
}

export function buildSvgFromPixels(
  width: number,
  height: number,
  pixels: { x: number; y: number; fill: string }[],
  pixelSize: number = 16
): string {
  const svgWidth = width * pixelSize
  const svgHeight = height * pixelSize
  let rects = ''
  for (const p of pixels) {
    rects += `<rect x="${p.x * pixelSize}" y="${p.y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${p.fill}" />`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}" shape-rendering="crispEdges">${rects}</svg>`
}

export async function convertPixelDataUrlToSvg(
  dataUrl: string,
  pixelSize: number = 16
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const { width, height, data } = extractCanvasImageData(img)
        const pixels: { x: number; y: number; fill: string }[] = []

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4
            const r = data[idx]
            const g = data[idx + 1]
            const b = data[idx + 2]
            const a = data[idx + 3]

            if (a > 10) {
              const alpha = (a / 255).toFixed(2)
              const fill =
                a === 255
                  ? `rgb(${r},${g},${b})`
                  : `rgba(${r},${g},${b},${alpha})`
              pixels.push({ x, y, fill })
            }
          }
        }

        const svg = buildSvgFromPixels(width, height, pixels, pixelSize)
        resolve(svg)
      } catch (err) {
        reject(err)
      }
    }
    img.onerror = () => reject(new Error('Failed to load image for SVG conversion'))
    img.src = dataUrl
  })
}

export async function downloadStickerSvg(
  dataUrl: string,
  filename: string,
  pixelSize: number = 16
): Promise<void> {
  const svgContent = await convertPixelDataUrlToSvg(dataUrl, pixelSize)
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  const cleanName = filename.toLowerCase().replace(/[^a-z0-9]/g, '-')
  anchor.download = `${cleanName}-vector.svg`
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export async function downloadStickerWebp(
  dataUrl: string,
  filename: string,
  scale: number = 4
): Promise<void> {
  const scaledDataUrl = await upscalePixelDataUrl(dataUrl, scale)
  const img = new Image()
  img.crossOrigin = 'anonymous'
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('Failed to load scaled image'))
    img.src = scaledDataUrl
  })

  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context unavailable')
  ctx.drawImage(img, 0, 0)

  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    const cleanName = filename.toLowerCase().replace(/[^a-z0-9]/g, '-')
    anchor.download = `${cleanName}-${scale}x.webp`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }, 'image/webp')
}
