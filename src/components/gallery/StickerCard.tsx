import React from 'react'
import { Download, Copy, Sparkles, Heart } from 'lucide-react'
import type { Sticker } from '../../types/sticker.types'
import { Badge } from '../common/Badge'

interface StickerCardProps {
  sticker: Sticker
  onSelect: (sticker: Sticker) => void
  onQuickDownload: (e: React.MouseEvent, sticker: Sticker) => void
  onQuickCopy: (e: React.MouseEvent, sticker: Sticker) => void
  onToggleFavorite: (id: string, e: React.MouseEvent) => void
}

export const StickerCard: React.FC<StickerCardProps> = ({
  sticker,
  onSelect,
  onQuickDownload,
  onQuickCopy,
  onToggleFavorite,
}) => {
  return (
    <div
      onClick={() => onSelect(sticker)}
      className="group relative flex flex-col rounded-xl border border-[#232737] bg-[#14161f] p-3 cursor-pointer hover:border-[#ff6b9d]/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-200"
    >
      {/* Checkerboard Preview Container */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden checker-pattern flex items-center justify-center p-4 border border-[#1e2230]">
        <img
          src={sticker.pixelDataUrl}
          alt={sticker.title}
          className="w-24 h-24 sm:w-28 sm:h-28 object-contain pixelated transition-transform duration-200 group-hover:scale-110 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
        />

        {sticker.isCustom && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#ff6b9d]/20 border border-[#ff6b9d]/40 text-[#ff6b9d] text-[10px] font-mono">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Custom</span>
          </div>
        )}

        {/* Quick Action Overlay */}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            type="button"
            onClick={(e) => onQuickCopy(e, sticker)}
            title="Copy to clipboard (4x)"
            className="p-1.5 rounded-md bg-[#0c0d12]/90 border border-[#2d3246] text-[#9aa1b8] hover:text-[#f3f4f8] hover:border-[#ff6b9d]/60 transition-colors shadow-sm"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => onQuickDownload(e, sticker)}
            title="Download PNG (4x)"
            className="p-1.5 rounded-md bg-[#ff6b9d] text-[#0c0d12] hover:bg-[#ff528c] transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => onToggleFavorite(sticker.id, e)}
          title={sticker.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute bottom-2 right-2 p-1.5 rounded-md transition-all shadow-sm ${
            sticker.isFavorite
              ? 'bg-[#ff6b9d]/20 text-[#ff6b9d] border border-[#ff6b9d]/50 opacity-100'
              : 'bg-[#0c0d12]/90 border border-[#2d3246] text-[#9aa1b8] hover:text-[#ff6b9d] opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              sticker.isFavorite ? 'fill-[#ff6b9d]' : ''
            }`}
          />
        </button>
      </div>

      {/* Info Footer */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="truncate">
          <h3 className="text-xs font-semibold text-[#f3f4f8] truncate group-hover:text-[#ff6b9d] transition-colors">
            {sticker.title}
          </h3>
          <p className="text-[10px] text-[#656b82] capitalize font-mono mt-0.5">
            {sticker.category}
          </p>
        </div>
        <Badge
          label={`${sticker.width}x${sticker.height}`}
          variant="outline"
          size="sm"
        />
      </div>
    </div>
  )
}
