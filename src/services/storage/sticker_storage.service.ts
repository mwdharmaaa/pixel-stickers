import type { Sticker } from '../../types/sticker.types'

const STORAGE_KEY = 'pixel_stickers_vault_v1'

export function loadStoredStickers(): Sticker[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('Failed to load stickers from storage:', err)
    return []
  }
}

export function saveStoredSticker(sticker: Sticker): boolean {
  try {
    const existing = loadStoredStickers()
    const updated = [sticker, ...existing.filter((s) => s.id !== sticker.id)]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return true
  } catch (err) {
    console.error('Failed to save sticker:', err)
    return false
  }
}

export function deleteStoredSticker(id: string): boolean {
  try {
    const existing = loadStoredStickers()
    const updated = existing.filter((s) => s.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return true
  } catch (err) {
    console.error('Failed to delete sticker:', err)
    return false
  }
}

export function exportStickersToJson(stickers: Sticker[]): void {
  const jsonStr = JSON.stringify(stickers, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pixel-stickers-backup-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
