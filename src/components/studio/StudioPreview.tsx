import React from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import type { ProcessedPixelResult } from '../../services/pixelizer/pixelizer.types'

interface StudioPreviewProps {
  referenceUrl: string | null
  result: ProcessedPixelResult | null
  isProcessing: boolean
}

export const StudioPreview: React.FC<StudioPreviewProps> = ({
  referenceUrl,
  result,
  isProcessing,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {/* Original Reference Image */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#656b82]">
            <span>Reference Input</span>
          </div>
          <div className="w-full aspect-square rounded-xl bg-[#10121a] border border-[#232737] p-2 flex items-center justify-center overflow-hidden">
            {referenceUrl ? (
              <img
                src={referenceUrl}
                alt="Reference"
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-[11px] text-[#4d536b]">No image</span>
            )}
          </div>
        </div>

        {/* Pixel Sticker Result */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#656b82]">
            <span className="text-[#ff6b9d] font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Pixel Sticker</span>
            </span>
            {result && (
              <span className="font-mono text-[10px] text-[#9aa1b8]">
                {result.width}x{result.height}
              </span>
            )}
          </div>
          <div className="relative w-full aspect-square rounded-xl checker-pattern border border-[#ff6b9d]/30 p-2 flex items-center justify-center overflow-hidden shadow-inner">
            {isProcessing ? (
              <Loader2 className="w-6 h-6 text-[#ff6b9d] animate-spin" />
            ) : result ? (
              <img
                src={result.dataUrl}
                alt="Pixelated Sticker Result"
                className="w-full h-full object-contain pixelated drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
              />
            ) : (
              <span className="text-[11px] text-[#4d536b]">Awaiting input</span>
            )}
          </div>
        </div>
      </div>

      {/* Palette strip */}
      {result && result.dominantColors.length > 0 && (
        <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-[#141620] border border-[#232737]">
          <span className="text-[10px] text-[#656b82] uppercase font-mono mr-1">
            Colors:
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {result.dominantColors.map((hex) => (
              <span
                key={hex}
                title={hex}
                className="w-3 h-3 rounded-full border border-black/40"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
