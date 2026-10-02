import React from 'react'
import { Sparkles, Plus, DownloadCloud, Layers } from 'lucide-react'

interface NavbarProps {
  totalStickers: number
  customCount: number
  onOpenStudio: () => void
  onExportBackup: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  totalStickers,
  customCount,
  onOpenStudio,
  onExportBackup,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#232737] bg-[#0c0d12]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#ff6b9d]/15 border border-[#ff6b9d]/30 flex items-center justify-center text-[#ff6b9d] shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-[#f3f4f8]">
                PIXEL VAULT
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#1e2230] text-[#9aa1b8] border border-[#2d3246]">
                v1.0
              </span>
            </div>
            <p className="text-xs text-[#656b82] hidden sm:block">
              Cute Pixel Sticker Collection & Studio
            </p>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#14161f] border border-[#232737] text-xs text-[#9aa1b8]">
            <Layers className="w-3.5 h-3.5 text-[#ff6b9d]" />
            <span>
              <strong className="text-[#f3f4f8] font-medium">{totalStickers}</strong> stickers ({customCount} custom)
            </span>
          </div>

          <button
            type="button"
            onClick={onExportBackup}
            title="Export stickers backup as JSON"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#272a3a] bg-[#161822] text-[#9aa1b8] hover:text-[#f3f4f8] hover:border-[#383e54] text-xs font-medium transition-all"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Backup</span>
          </button>

          <button
            type="button"
            onClick={onOpenStudio}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#ff6b9d] hover:bg-[#ff528c] text-[#0c0d12] font-semibold text-xs transition-all shadow-[0_0_16px_rgba(255,107,157,0.35)] hover:shadow-[0_0_20px_rgba(255,107,157,0.5)] active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Pixelizer Studio</span>
          </button>
        </div>
      </div>
    </header>
  )
}
