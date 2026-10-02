import React from 'react'
import { Sparkles, Plus } from 'lucide-react'
import type { Sticker } from '../../types/sticker.types'
import { StickerCard } from './StickerCard'

interface StickerGridProps {
  stickers: Sticker[]
  onSelectSticker: (sticker: Sticker) => void
  onQuickDownload: (e: React.MouseEvent, sticker: Sticker) => void
  onQuickCopy: (e: React.MouseEvent, sticker: Sticker) => void
  onOpenStudio: () => void
}

export const StickerGrid: React.FC<StickerGridProps> = ({
  stickers,
  onSelectSticker,
  onQuickDownload,
  onQuickCopy,
  onOpenStudio,
}) => {
  if (stickers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed border-[#272a3a] bg-[#12141c]/50 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#1e2230] border border-[#2d3246] flex items-center justify-center text-[#ff6b9d] mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-[#f3f4f8]">No stickers found</h3>
        <p className="text-xs text-[#656b82] max-w-sm mt-1 mb-5">
          No pixel stickers match your active search or category. Try clearing filters or create a new custom sticker.
        </p>
        <button
          type="button"
          onClick={onOpenStudio}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff6b9d] hover:bg-[#ff528c] text-[#0c0d12] font-semibold text-xs transition-all shadow-md active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Launch Pixelizer Studio</span>
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {stickers.map((sticker) => (
        <StickerCard
          key={sticker.id}
          sticker={sticker}
          onSelect={onSelectSticker}
          onQuickDownload={onQuickDownload}
          onQuickCopy={onQuickCopy}
        />
      ))}
    </div>
  )
}
