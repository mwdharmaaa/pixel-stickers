import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadStoredStickers,
  saveStoredSticker,
  deleteStoredSticker,
  importStickersFromJsonString,
} from '../src/services/storage/sticker_storage.service'
import type { Sticker } from '../src/types/sticker.types'

// Mock browser localStorage for Node test runner
const storageMap = new Map<string, string>()
const mockLocalStorage = {
  getItem: (key: string) => storageMap.get(key) || null,
  setItem: (key: string, val: string) => storageMap.set(key, val),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
}

Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

describe('sticker_storage service', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
  })

  it('loads empty array when storage is uninitialized', () => {
    expect(loadStoredStickers()).toEqual([])
  })

  it('saves and loads custom sticker', () => {
    const mockSticker: Sticker = {
      id: 'test-1',
      title: 'Test Pixel Cat',
      category: 'animals',
      tags: ['cat', 'pixel'],
      pixelDataUrl: 'data:image/png;base64,mock',
      width: 16,
      height: 16,
      colors: ['#FFFFFF', '#000000'],
      isCustom: true,
      createdAt: 123456789,
    }

    const saved = saveStoredSticker(mockSticker)
    expect(saved).toBe(true)

    const list = loadStoredStickers()
    expect(list.length).toBe(1)
    expect(list[0].id).toBe('test-1')
    expect(list[0].title).toBe('Test Pixel Cat')
  })

  it('deletes custom sticker by id', () => {
    const mockSticker: Sticker = {
      id: 'test-del',
      title: 'To Delete',
      category: 'food',
      tags: ['food'],
      pixelDataUrl: 'data:image/png;base64,mock',
      width: 16,
      height: 16,
      colors: ['#FFFFFF'],
      isCustom: true,
      createdAt: 123456789,
    }

    saveStoredSticker(mockSticker)
    expect(loadStoredStickers().length).toBe(1)

    const deleted = deleteStoredSticker('test-del')
    expect(deleted).toBe(true)
    expect(loadStoredStickers().length).toBe(0)
  })

  it('validates sticker schema and imports valid stickers from JSON backup', () => {
    const backupJson = JSON.stringify([
      {
        id: 'backup-1',
        title: 'Restored Pixel Frog',
        category: 'animals',
        tags: ['frog'],
        pixelDataUrl: 'data:image/png;base64,frog',
        width: 24,
        height: 24,
        colors: ['#55EFC4'],
        isCustom: true,
        createdAt: 987654321,
      },
      {
        invalid: 'malformed item',
      },
    ])

    const result = importStickersFromJsonString(backupJson)
    expect(result.success).toBe(true)
    expect(result.importedCount).toBe(1)

    const stored = loadStoredStickers()
    expect(stored.length).toBe(1)
    expect(stored[0].title).toBe('Restored Pixel Frog')
  })

  it('rejects malformed or empty backup payloads gracefully', () => {
    const invalidJsonResult = importStickersFromJsonString('{ invalid json }')
    expect(invalidJsonResult.success).toBe(false)
    expect(invalidJsonResult.importedCount).toBe(0)

    const nonArrayResult = importStickersFromJsonString('{"foo": "bar"}')
    expect(nonArrayResult.success).toBe(false)
  })
})
