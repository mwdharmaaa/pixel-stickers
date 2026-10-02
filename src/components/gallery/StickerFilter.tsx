import React from 'react'
import { Search, X, Archive } from 'lucide-react'
import type { StickerCategory } from '../../types/sticker.types'

interface CategoryItem {
  key: StickerCategory
  label: string
}

const CATEGORIES: CategoryItem[] = [
  { key: 'all', label: 'All Stickers' },
  { key: 'favorites', label: 'Favorites' },
  { key: 'animals', label: 'Animals' },
  { key: 'food', label: 'Food & Sweets' },
  { key: 'gaming', label: 'Retro Gaming' },
  { key: 'nature', label: 'Nature' },
  { key: 'fantasy', label: 'Fantasy' },
  { key: 'custom', label: 'My Creations' },
]

interface StickerFilterProps {
  currentCategory: StickerCategory
  searchQuery: string
  counts: Record<StickerCategory, number>
  onSelectCategory: (category: StickerCategory) => void
  onSearchChange: (query: string) => void
  onDownloadZip?: () => void
  isDownloadingZip?: boolean
}

export const StickerFilter: React.FC<StickerFilterProps> = ({
  currentCategory,
  searchQuery,
  counts,
  onSelectCategory,
  onSearchChange,
  onDownloadZip,
  isDownloadingZip,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat.key
          const count = counts[cat.key] || 0
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => onSelectCategory(cat.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-[#ff6b9d]/15 text-[#ff6b9d] border-[#ff6b9d]/40 shadow-sm'
                  : 'bg-[#14161f] text-[#9aa1b8] border-[#252838] hover:text-[#f3f4f8] hover:border-[#34394e]'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-[#ff6b9d]/25 text-[#ff6b9d]' : 'bg-[#1e2230] text-[#656b82]'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Search Bar & Batch Download */}
      <div className="flex items-center gap-2">
        <div className="relative min-w-[200px] sm:min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#656b82] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search stickers or tags..."
            className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-[#14161f] border border-[#252838] text-xs text-[#f3f4f8] placeholder-[#656b82] focus:outline-none focus:border-[#ff6b9d]/60 focus:ring-1 focus:ring-[#ff6b9d]/40 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#656b82] hover:text-[#f3f4f8]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {onDownloadZip && (
          <button
            type="button"
            onClick={onDownloadZip}
            disabled={isDownloadingZip}
            title="Download current stickers as ZIP pack"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#272a3a] bg-[#161822] hover:border-[#ff6b9d]/50 text-xs font-medium text-[#9aa1b8] hover:text-[#f3f4f8] transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            <Archive className="w-3.5 h-3.5 text-[#ff6b9d]" />
            <span className="hidden sm:inline">
              {isDownloadingZip ? 'Zipping...' : 'Pack ZIP'}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
