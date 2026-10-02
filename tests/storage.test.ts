import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadStoredStickers,
  saveStoredSticker,
  deleteStoredSticker,
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
})
