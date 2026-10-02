import React from 'react'
import { Sparkles, Paintbrush, X } from 'lucide-react'

export type StudioMode = 'auto' | 'draw'

interface StudioHeaderProps {
  mode: StudioMode
  onSelectMode: (mode: StudioMode) => void
  onClose: () => void
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  mode,
  onSelectMode,
  onClose,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-[#232737]">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#ff6b9d]/15 border border-[#ff6b9d]/30 flex items-center justify-center text-[#ff6b9d]">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#f3f4f8]">Pixel Sticker Studio</h2>
          <p className="text-[11px] text-[#656b82]">
            Convert references or draw pixel stickers directly
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center p-1 rounded-xl bg-[#0e1017] border border-[#232737]">
          <button
            type="button"
            onClick={() => onSelectMode('auto')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              mode === 'auto'
                ? 'bg-[#ff6b9d] text-[#0c0d12]'
                : 'text-[#9aa1b8] hover:text-[#f3f4f8]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto Pixelizer</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectMode('draw')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              mode === 'draw'
                ? 'bg-[#ff6b9d] text-[#0c0d12]'
                : 'text-[#9aa1b8] hover:text-[#f3f4f8]'
            }`}
          >
            <Paintbrush className="w-3.5 h-3.5" />
            <span>Pixel Canvas Draw</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#656b82] hover:text-[#f3f4f8] hover:bg-[#1e2230] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
