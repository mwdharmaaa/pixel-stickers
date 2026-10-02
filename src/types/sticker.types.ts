export type StickerCategory =
  | 'all'
  | 'animals'
  | 'food'
  | 'gaming'
  | 'nature'
  | 'fantasy'
  | 'custom'

export interface StickerColor {
  hex: string
  count: number
}

export interface Sticker {
  id: string
  title: string
  category: Exclude<StickerCategory, 'all'>
  tags: string[]
  pixelDataUrl: string
  width: number
  height: number
  colors: string[]
  isCustom?: boolean
  createdAt: number
}

export interface StickerFilterOptions {
  category: StickerCategory
  searchQuery: string
  sortBy: 'newest' | 'oldest' | 'name'
}
