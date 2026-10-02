import React, { useState } from 'react'
import { X, Download, Copy, Trash2, Check, ZoomIn, Heart, FileCode2 } from 'lucide-react'
import type { Sticker } from '../../types/sticker.types'
import { downloadSticker, copyStickerToClipboard } from '../../services/export/sticker_exporter.service'
import { downloadStickerSvg, downloadStickerWebp } from '../../services/export/sticker_vector_exporter.service'
import { Badge } from '../common/Badge'

interface StickerDetailModalProps {
  sticker: Sticker | null
  onClose: () => void
  onDeleteCustom?: (id: string) => void
  onToggleFavorite?: (id: string) => void
  onNotify: (text: string, type: 'success' | 'error') => void
}

export const StickerDetailModal: React.FC<StickerDetailModalProps> = ({
  sticker,
  onClose,
  onDeleteCustom,
  onToggleFavorite,
  onNotify,
}) => {
  const [scale, setScale] = useState<number>(8)
  const [copiedHex, setCopiedHex] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  if (!sticker) return null

  const handleDownload = async () => {
    try {
      setIsExporting(true)
      await downloadSticker(sticker.pixelDataUrl, sticker.title, scale)
      onNotify(`Downloaded ${sticker.title} (${scale}x)`, 'success')
    } catch {
      onNotify('Failed to download sticker', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadSvg = async () => {
    try {
      setIsExporting(true)
      await downloadStickerSvg(sticker.pixelDataUrl, sticker.title, 16)
      onNotify(`Downloaded ${sticker.title} as Scalable Vector SVG`, 'success')
    } catch {
      onNotify('Failed to export vector SVG', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadWebp = async () => {
    try {
      setIsExporting(true)
      await downloadStickerWebp(sticker.pixelDataUrl, sticker.title, scale)
      onNotify(`Downloaded ${sticker.title} as WebP (${scale}x)`, 'success')
    } catch {
      onNotify('Failed to export WebP', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  const handleCopyClipboard = async () => {
    try {
      setIsExporting(true)
      const success = await copyStickerToClipboard(sticker.pixelDataUrl, scale)
      if (success) {
        onNotify('Copied crisp pixel sticker to clipboard', 'success')
      } else {
        onNotify('Clipboard API not permitted in this browser', 'error')
      }
    } finally {
      setIsExporting(false)
    }
  }

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopiedHex(hex)
    setTimeout(() => setCopiedHex(null), 1500)
    onNotify(`Copied ${hex} to clipboard`, 'success')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0d12]/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-2xl border border-[#2b3044] bg-[#141620] shadow-2xl overflow-hidden text-[#f3f4f8]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232737]">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-[#f3f4f8]">
              {sticker.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge label={sticker.category} variant="accent" size="sm" />
              <span className="text-[11px] font-mono text-[#656b82]">
                Base: {sticker.width}x{sticker.height}px
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {onToggleFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(sticker.id)}
                title={sticker.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                className={`p-1.5 rounded-lg border transition-colors ${
                  sticker.isFavorite
                    ? 'bg-[#ff6b9d]/15 border-[#ff6b9d]/40 text-[#ff6b9d]'
                    : 'border-[#272a3a] text-[#656b82] hover:text-[#ff6b9d]'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    sticker.isFavorite ? 'fill-[#ff6b9d]' : ''
                  }`}
                />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#656b82] hover:text-[#f3f4f8] hover:bg-[#1e2230] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col md:flex-row gap-6">
          {/* Zoomed Canvas Preview */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full aspect-square max-w-[280px] rounded-xl checker-pattern border border-[#252a3b] p-6 flex items-center justify-center shadow-inner">
              <img
                src={sticker.pixelDataUrl}
                alt={sticker.title}
                className="w-full h-full object-contain pixelated drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
              />
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-[11px] text-[#656b82] font-mono">
              <ZoomIn className="w-3 h-3 text-[#ff6b9d]" />
              <span>Crisp Nearest-Neighbor Render</span>
            </div>
          </div>

          {/* Controls & Details */}
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div>
              {/* Scale Picker */}
              <label className="block text-xs font-medium text-[#9aa1b8] mb-1.5">
                Export Scale Multiplier
              </label>
              <div className="grid grid-cols-4 gap-1.5 mb-4">
                {[1, 2, 4, 8].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setScale(s)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-medium border transition-all ${
                      scale === s
                        ? 'bg-[#ff6b9d]/20 border-[#ff6b9d] text-[#ff6b9d]'
                        : 'bg-[#181b26] border-[#252838] text-[#9aa1b8] hover:text-[#f3f4f8]'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* Color Palette Chips */}
              <label className="block text-xs font-medium text-[#9aa1b8] mb-1.5">
                Sticker Color Palette
              </label>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {sticker.colors.slice(0, 8).map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => handleCopyHex(hex)}
                    title={`Click to copy ${hex}`}
                    className="group relative flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#272a3a] bg-[#181b26] hover:border-[#ff6b9d]/50 transition-all text-[11px] font-mono"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/30 shrink-0"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="text-[#9aa1b8] group-hover:text-[#f3f4f8]">
                      {hex}
                    </span>
                    {copiedHex === hex && (
                      <Check className="w-2.5 h-2.5 text-[#2ed573]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tags */}
              {sticker.tags.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-[#656b82] mb-1">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {sticker.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#1b1e2b] text-[#9aa1b8] border border-[#25283a]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-4 border-t border-[#232737]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#ff6b9d] hover:bg-[#ff528c] text-[#0c0d12] font-semibold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Download PNG ({scale}x)</span>
                </button>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleCopyClipboard}
                  title="Copy image to clipboard"
                  className="px-3 py-2 rounded-lg border border-[#2d3246] bg-[#181b26] hover:border-[#ff6b9d]/60 text-[#9aa1b8] hover:text-[#f3f4f8] text-xs font-medium transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleDownloadSvg}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#2d3246] bg-[#181b26] hover:border-[#ff6b9d]/60 text-xs font-medium text-[#9aa1b8] hover:text-[#f3f4f8] transition-colors disabled:opacity-50"
                >
                  <FileCode2 className="w-3.5 h-3.5 text-[#ff6b9d]" />
                  <span>Vector SVG</span>
                </button>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleDownloadWebp}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#2d3246] bg-[#181b26] hover:border-[#ff6b9d]/60 text-xs font-medium text-[#9aa1b8] hover:text-[#f3f4f8] transition-colors disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>WebP ({scale}x)</span>
                </button>
              </div>

              {sticker.isCustom && onDeleteCustom && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteCustom(sticker.id)
                    onClose()
                  }}
                  className="flex items-center justify-center gap-1.5 text-xs text-[#ff4757]/80 hover:text-[#ff4757] py-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Custom Sticker</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
