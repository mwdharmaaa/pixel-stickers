import { describe, it, expect, beforeEach } from 'vitest'
import {
  getSavedTheme,
  applyTheme,
  getNextTheme,
} from '../src/services/theme/theme.service'
import { THEMES, THEME_STORAGE_KEY } from '../src/services/theme/theme.types'

const storageMock = new Map<string, string>()
const mockLocalStorage = {
  getItem: (key: string) => storageMock.get(key) || null,
  setItem: (key: string, val: string) => storageMock.set(key, val),
  removeItem: (key: string) => storageMock.delete(key),
  clear: () => storageMock.clear(),
}

Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

describe('theme.service', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
  })

  it('defaults to dark theme when no storage preference exists', () => {
    expect(getSavedTheme()).toBe(THEMES.DARK)
  })

  it('toggles theme accurately between dark and pink-light', () => {
    expect(getNextTheme(THEMES.DARK)).toBe(THEMES.ROSE_LIGHT)
    expect(getNextTheme(THEMES.ROSE_LIGHT)).toBe(THEMES.DARK)
  })

  it('saves and applies pink-light theme', () => {
    applyTheme(THEMES.ROSE_LIGHT)
    expect(mockLocalStorage.getItem(THEME_STORAGE_KEY)).toBe(THEMES.ROSE_LIGHT)
    expect(getSavedTheme()).toBe(THEMES.ROSE_LIGHT)
  })
})
