export async function upscalePixelDataUrl(
  dataUrl: string,
  scale: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas context unavailable'))
        return
      }
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error('Failed to load image for upscaling'))
    img.src = dataUrl
  })
}

export async function downloadSticker(
  dataUrl: string,
  filename: string,
  scale: number = 4
): Promise<void> {
  const scaledDataUrl = await upscalePixelDataUrl(dataUrl, scale)
  const anchor = document.createElement('a')
  anchor.href = scaledDataUrl
  const cleanName = filename.toLowerCase().replace(/[^a-z0-9]/g, '-')
  anchor.download = `${cleanName}-${scale}x.png`
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

export async function copyStickerToClipboard(
  dataUrl: string,
  scale: number = 4
): Promise<boolean> {
  try {
    const scaledDataUrl = await upscalePixelDataUrl(dataUrl, scale)
    const response = await fetch(scaledDataUrl)
    const blob = await response.blob()
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ])
    return true
  } catch {
    return false
  }
}
