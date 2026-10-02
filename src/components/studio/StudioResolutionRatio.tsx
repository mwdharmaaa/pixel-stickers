import React from 'react'
import type { AspectRatioOption, PixelizerOptions } from '../../services/pixelizer/pixelizer.types'

interface StudioResolutionRatioProps {
  pixelSize: number
  aspectRatio?: AspectRatioOption
  onChange: (updated: Partial<PixelizerOptions>) => void
}

const PRESET_RESOLUTIONS = [16, 24, 32, 48, 64, 96, 128]

const ASPECT_RATIO_OPTIONS: { id: AspectRatioOption; label: string; title: string }[] = [
  { id: 'original', label: 'Auto', title: 'Preserve Original Image Ratio' },
  { id: '1:1', label: '1:1', title: 'Square Ratio' },
  { id: '4:3', label: '4:3', title: 'Standard 4:3 Ratio' },
  { id: '3:4', label: '3:4', title: 'Portrait 3:4 Ratio' },
  { id: '16:9', label: '16:9', title: 'Widescreen 16:9 Ratio' },
]

export const StudioResolutionRatio: React.FC<StudioResolutionRatioProps> = ({
  pixelSize,
  aspectRatio = 'original',
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-3.5">
      {/* Aspect Ratio Options */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[#9aa1b8] font-medium text-[11px]">Aspect Ratio</label>
          <span className="font-mono text-[#ff6b9d] text-[10px]">
            {aspectRatio === 'original' ? 'Auto (Original)' : aspectRatio}
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {ASPECT_RATIO_OPTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              title={item.title}
              onClick={() => onChange({ aspectRatio: item.id })}
              className={`py-1 px-1.5 rounded-lg border text-[11px] font-mono transition-all text-center cursor-pointer ${
                aspectRatio === item.id
                  ? 'bg-[#ff6b9d]/20 border-[#ff6b9d] text-[#ff6b9d] font-semibold'
                  : 'bg-[#181b26] border-[#252838] text-[#8e95ad] hover:text-[#f3f4f8] hover:border-[#383d54]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pixel Resolution Slider */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[#9aa1b8] font-medium text-[11px]">Pixel Grid Resolution</label>
          <span className="font-mono text-[#ff6b9d] text-[11px]">
            {pixelSize}px {pixelSize >= 128 ? '(Max HD)' : ''}
          </span>
        </div>
        <input
          type="range"
          min="12"
          max="128"
          step="4"
          value={pixelSize}
          onChange={(e) => onChange({ pixelSize: Number(e.target.value) })}
          className="w-full accent-[#ff6b9d] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#656b82] font-mono mt-0.5">
          <span>Retro (12px)</span>
          <span>Balanced (32px)</span>
          <span>Detail (64px)</span>
          <span>Ultra HD (128px)</span>
        </div>

        {/* Quick Resolution Preset Chips */}
        <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-[#232737]/60 overflow-x-auto">
          <span className="text-[10px] text-[#656b82] font-mono shrink-0 mr-0.5">Presets:</span>
          {PRESET_RESOLUTIONS.map((res) => (
            <button
              key={res}
              type="button"
              onClick={() => onChange({ pixelSize: res })}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors shrink-0 cursor-pointer ${
                pixelSize === res
                  ? 'bg-[#ff6b9d] text-[#0c0d12] font-semibold'
                  : 'bg-[#181b26] text-[#8e95ad] hover:text-[#f3f4f8] border border-[#252838]'
              }`}
            >
              {res}px
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
