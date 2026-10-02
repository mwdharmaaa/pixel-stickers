import { THEMES, THEME_STORAGE_KEY, type AppTheme } from './theme.types'

export function getSavedTheme(): AppTheme {
  if (typeof localStorage === 'undefined') return THEMES.DARK
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    return saved === THEMES.ROSE_LIGHT ? THEMES.ROSE_LIGHT : THEMES.DARK
  } catch {
    return THEMES.DARK
  }
}

export function applyTheme(theme: AppTheme): AppTheme {
  const targetTheme = theme === THEMES.ROSE_LIGHT ? THEMES.ROSE_LIGHT : THEMES.DARK
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('data-theme', targetTheme)
  }
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, targetTheme)
    } catch {
      // Storage unavailable
    }
  }
  return targetTheme
}

export function getNextTheme(current: AppTheme): AppTheme {
  return current === THEMES.ROSE_LIGHT ? THEMES.DARK : THEMES.ROSE_LIGHT
}
