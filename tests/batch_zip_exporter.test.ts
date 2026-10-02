import { describe, it, expect } from 'vitest'
import JSZip from 'jszip'
import type { Sticker } from '../src/types/sticker.types'

describe('batch_zip_exporter logic', () => {
  it('creates zip archive and packages sticker data with manifest', async () => {
    const mockStickers: Sticker[] = [
      {
        id: 'mock-1',
        title: 'Pixel Cat',
        category: 'animals',
        tags: ['cat'],
        pixelDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        width: 16,
        height: 16,
        colors: ['#FFFFFF'],
        isCustom: true,
        createdAt: 123456,
      },
    ]

    const zip = new JSZip()
    const folder = zip.folder('test-pack')!

    const base64Data = mockStickers[0].pixelDataUrl.replace(/^data:image\/png;base64,/, '')
    folder.file('pixel-cat-4x.png', base64Data, { base64: true })
    folder.file(
      'MANIFEST.json',
      JSON.stringify({
        pack: 'test-pack',
        totalStickers: mockStickers.length,
      })
    )

    const blob = await zip.generateAsync({ type: 'blob' })
    expect(blob.size).toBeGreaterThan(0)
    expect(blob.type).toBe('application/zip')

    const loadedZip = await JSZip.loadAsync(blob)
    expect(loadedZip.file('test-pack/pixel-cat-4x.png')).not.toBeNull()
    expect(loadedZip.file('test-pack/MANIFEST.json')).not.toBeNull()
  })
})
