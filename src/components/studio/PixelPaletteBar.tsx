import React from 'react'

interface PixelPaletteBarProps {
  currentColor: string
  onSelectColor: (color: string) => void
  paletteColors: string[]
}

export const PixelPaletteBar: React.FC<PixelPaletteBarProps> = ({
  currentColor,
  onSelectColor,
  paletteColors,
}) => {
  return (
    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#141622] border border-[#232737] overflow-x-auto">
      <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-[#232737]">
        <label
          title="Custom Color"
          className="relative w-6 h-6 rounded-md border border-white/20 cursor-pointer overflow-hidden shadow-inner flex items-center justify-center shrink-0"
          style={{ backgroundColor: currentColor }}
        >
          <input
            type="color"
            value={currentColor}
            onChange={(e) => onSelectColor(e.target.value)}
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
          />
        </label>
        <span className="font-mono text-[10px] text-[#9aa1b8]">{currentColor}</span>
      </div>

      <div className="flex items-center gap-1 flex-1 overflow-x-auto py-0.5">
        {paletteColors.map((color) => {
          const isSelected = currentColor.toUpperCase() === color.toUpperCase()
          return (
            <button
              key={color}
              type="button"
              title={color}
              onClick={() => onSelectColor(color)}
              className={`w-5 h-5 rounded-md shrink-0 border transition-all ${
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
