import React, { useState, useEffect } from 'react'
import { Pipette } from 'lucide-react'

interface PixelPaletteBarProps {
  currentColor: string
  onSelectColor: (color: string) => void
  paletteColors: string[]
  recentColors?: string[]
}

export const PixelPaletteBar: React.FC<PixelPaletteBarProps> = ({
  currentColor,
  onSelectColor,
  paletteColors,
  recentColors = [],
}) => {
  const [hexInput, setHexInput] = useState(currentColor)

  useEffect(() => {
    setHexInput(currentColor)
  }, [currentColor])

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setHexInput(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      onSelectColor(val.toUpperCase())
    }
  }

  return (
    <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-[#141622] border border-[#232737]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label
            title="Choose custom color"
            className="relative w-6 h-6 rounded-md border border-white/20 cursor-pointer overflow-hidden shadow-inner flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
            style={{ backgroundColor: currentColor }}
          >
            <input
              type="color"
              value={currentColor.startsWith('#') ? currentColor : '#FF6B9D'}
              onChange={(e) => onSelectColor(e.target.value.toUpperCase())}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            />
            <Pipette className="w-3 h-3 text-white mix-blend-difference pointer-events-none" />
          </label>
          <div className="flex items-center gap-1 bg-[#10121a] px-1.5 py-0.5 rounded border border-[#232737]">
            <input
              type="text"
              value={hexInput}
              onChange={handleHexChange}
              maxLength={7}
              placeholder="#FFFFFF"
              className="w-16 bg-transparent text-[10px] font-mono text-[#f3f4f8] focus:outline-none uppercase"
            />
          </div>
        </div>

        {recentColors.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-mono text-[#656b82] uppercase">Recent:</span>
            {recentColors.slice(0, 5).map((color) => (
              <button
                key={color}
                type="button"
                title={`Recent ${color}`}
                onClick={() => onSelectColor(color)}
                className="w-4 h-4 rounded-sm border border-black/40 hover:scale-110 transition-transform cursor-pointer"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Palette Colors Strip */}
      <div className="flex items-center gap-1 overflow-x-auto py-0.5 border-t border-[#232737]/60 pt-1.5">
        {paletteColors.map((color) => {
          const isSelected = currentColor.toUpperCase() === color.toUpperCase()
          return (
            <button
              key={color}
              type="button"
              title={color}
              onClick={() => onSelectColor(color)}
              className={`w-5 h-5 rounded-md shrink-0 border transition-all cursor-pointer ${
                isSelected
                  ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                  : 'border-black/30 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          )
        })}
      </div>
    </div>
  )
}

