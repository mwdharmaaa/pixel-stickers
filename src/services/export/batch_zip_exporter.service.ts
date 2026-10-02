import JSZip from 'jszip'
import type { Sticker } from '../../types/sticker.types'
import { upscalePixelDataUrl } from './sticker_exporter.service'

export interface BatchZipProgress {
  current: number
  total: number
}

export async function exportStickersToZip(
  stickers: Sticker[],
  zipName: string = 'pixely-stickers-pack',
  scale: number = 4,
  onProgress?: (progress: BatchZipProgress) => void
): Promise<void> {
  if (stickers.length === 0) return

  const zip = new JSZip()
  const folder = zip.folder(zipName) || zip
  const nameCountMap = new Map<string, number>()

  for (let i = 0; i < stickers.length; i++) {
    const sticker = stickers[i]
    if (onProgress) {
      onProgress({ current: i + 1, total: stickers.length })
    }

    try {
      const scaledDataUrl = await upscalePixelDataUrl(sticker.pixelDataUrl, scale)
      const base64Data = scaledDataUrl.replace(/^data:image\/png;base64,/, '')

      const cleanName =
        sticker.title
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') || 'sticker'

      const count = nameCountMap.get(cleanName) || 0
      nameCountMap.set(cleanName, count + 1)
      const fileName = count > 0 ? `${cleanName}-${count}-${scale}x.png` : `${cleanName}-${scale}x.png`

      folder.file(fileName, base64Data, { base64: true })
    } catch (err) {
      console.warn(`Failed to package sticker "${sticker.title}":`, err)
    }
  }

  folder.file(
    'MANIFEST.json',
    JSON.stringify(
      {
        pack: zipName,
        exportedAt: new Date().toISOString(),
        totalStickers: stickers.length,
        scale: `${scale}x`,
        generator: 'Pixely by @mwdhrmaaa',
      },
      null,
      2
    )
  )

  const contentBlob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(contentBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${zipName}.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
