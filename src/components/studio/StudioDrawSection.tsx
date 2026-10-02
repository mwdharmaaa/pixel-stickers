import React, { useState } from 'react'
import type { PixelGrid, PixelTool } from '../../services/pixelizer/pixel_canvas.types'
import {
  createEmptyGrid,
  cloneGrid,
} from '../../services/pixelizer/pixel_canvas.engine'
import { SWEET_PASTEL_HEX } from '../../services/pixelizer/palette_presets'
import { PixelToolbar } from './PixelToolbar'
import { PixelPaletteBar } from './PixelPaletteBar'
import { PixelEditor } from './PixelEditor'

interface StudioDrawSectionProps {
  grid: PixelGrid
  onChangeGrid: (next: PixelGrid) => void
}

const GRID_SIZES = [16, 24, 32]

export const StudioDrawSection: React.FC<StudioDrawSectionProps> = ({
  grid,
  onChangeGrid,
}) => {
  const [activeTool, setActiveTool] = useState<PixelTool>('pencil')
  const [activeColor, setActiveColor] = useState<string>('#FF6B9D')
  const [showGrid, setShowGrid] = useState<boolean>(true)
  const [history, setHistory] = useState<PixelGrid[]>([])
  const [redoStack, setRedoStack] = useState<PixelGrid[]>([])

  const currentSize = grid.length > 0 ? grid.length : 24

  const handleGridChange = (next: PixelGrid) => {
    setHistory((prev) => [...prev.slice(-20), cloneGrid(grid)])
    setRedoStack([])
    onChangeGrid(next)
  }

  const handleUndo = () => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setRedoStack((r) => [cloneGrid(grid), ...r])
    setHistory((h) => h.slice(0, -1))
    onChangeGrid(prev)
  }

  const handleRedo = () => {
    if (redoStack.length === 0) return
    const next = redoStack[0]
    setHistory((h) => [...h, cloneGrid(grid)])
    setRedoStack((r) => r.slice(1))
    onChangeGrid(next)
  }

  const handleResetSize = (size: number) => {
    const blank = createEmptyGrid(size, size)
    handleGridChange(blank)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#9aa1b8] font-medium">Canvas Grid Size</span>
        <div className="flex items-center gap-1">
          {GRID_SIZES.map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => handleResetSize(sz)}
              className={`px-2 py-1 rounded-md text-[10px] font-mono transition-colors ${
                currentSize === sz
                  ? 'bg-[#ff6b9d]/20 text-[#ff6b9d] border border-[#ff6b9d]/40'
                  : 'bg-[#181b26] text-[#9aa1b8] hover:text-[#f3f4f8] border border-[#232737]'
              }`}
            >
              {sz}x{sz}
            </button>
          ))}
        </div>
      </div>

      <PixelToolbar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid((v) => !v)}
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={() => handleGridChange(createEmptyGrid(currentSize, currentSize))}
      />

      <PixelPaletteBar
        currentColor={activeColor}
        onSelectColor={setActiveColor}
        paletteColors={SWEET_PASTEL_HEX}
      />

      <PixelEditor
        grid={grid}
        onChangeGrid={handleGridChange}
        activeTool={activeTool}
        activeColor={activeColor}
        onPickColor={setActiveColor}
        showGrid={showGrid}
      />
    </div>
  )
}
