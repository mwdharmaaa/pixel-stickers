import React from 'react'
import type { PalettePreset, PixelizerOptions } from '../../services/pixelizer/pixelizer.types'

import { StudioResolutionRatio } from './StudioResolutionRatio'

interface StudioControlsProps {
  options: PixelizerOptions
  onChange: (updated: Partial<PixelizerOptions>) => void
}

const PALETTE_OPTIONS: { id: PalettePreset; label: string; preview: string }[] = [
  { id: 'full-color', label: 'Original (True)', preview: '#38bdf8' },
  { id: 'sweet-pastel', label: 'Sweet Pastel', preview: '#ffb3ba' },
  { id: 'pico-8', label: 'PICO-8 16', preview: '#ff004d' },
  { id: 'gameboy', label: 'Game Boy', preview: '#8bac0f' },
  { id: 'cyberpunk', label: 'Cyberpunk', preview: '#00f0ff' },
  { id: 'warm-sunset', label: 'Warm Sunset', preview: '#ca2e55' },
]

export const StudioControls: React.FC<StudioControlsProps> = ({ options, onChange }) => {
  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* Aspect Ratio & Pixel Resolution Controls */}
      <StudioResolutionRatio
        pixelSize={options.pixelSize}
        aspectRatio={options.aspectRatio}
        onChange={onChange}
      />

      {/* Palette Selection */}
      <div>
        <label className="block text-[#9aa1b8] font-medium mb-1.5">Color Palette Quantization</label>
        <div className="grid grid-cols-3 gap-1.5">
          {PALETTE_OPTIONS.map((pal) => (
            <button
              key={pal.id}
              type="button"
              onClick={() => onChange({ palette: pal.id })}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                options.palette === pal.id
                  ? 'bg-[#ff6b9d]/15 border-[#ff6b9d] text-[#ff6b9d]'
                  : 'bg-[#181b26] border-[#252838] text-[#9aa1b8] hover:text-[#f3f4f8]'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/30 shrink-0"
                style={{ backgroundColor: pal.preview }}
              />
              <span className="truncate">{pal.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#232737]">
        <label className="flex items-center gap-2 p-2 rounded-lg bg-[#181b26] border border-[#252838] cursor-pointer hover:border-[#33384c]">
          <input
            type="checkbox"
            checked={options.addStickerBorder}
            onChange={(e) => onChange({ addStickerBorder: e.target.checked })}
            className="rounded accent-[#ff6b9d]"
          />
          <span className="text-[#9aa1b8] text-[11px]">Die-cut Border</span>
        </label>

        <label className="flex items-center gap-2 p-2 rounded-lg bg-[#181b26] border border-[#252838] cursor-pointer hover:border-[#33384c]">
          <input
            type="checkbox"
            checked={options.removeBackground}
            onChange={(e) => onChange({ removeBackground: e.target.checked })}
            className="rounded accent-[#ff6b9d]"
          />
          <span className="text-[#9aa1b8] text-[11px]">Auto Transparent</span>
        </label>
      </div>

      {/* Sliders for Brightness & Contrast */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#232737]">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[#9aa1b8] text-[11px]">Brightness</span>
            <span className="font-mono text-[#656b82] text-[10px]">{options.brightness}</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={options.brightness}
            onChange={(e) => onChange({ brightness: Number(e.target.value) })}
            className="w-full accent-[#ff6b9d] cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[#9aa1b8] text-[11px]">Contrast</span>
            <span className="font-mono text-[#656b82] text-[10px]">{options.contrast}</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={options.contrast}
            onChange={(e) => onChange({ contrast: Number(e.target.value) })}
            className="w-full accent-[#ff6b9d] cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
