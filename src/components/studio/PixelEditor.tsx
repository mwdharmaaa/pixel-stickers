import React, { useState, useRef } from 'react'
import type { PixelGrid, PixelTool } from '../../services/pixelizer/pixel_canvas.types'
import {
  setPixelInGrid,
  floodFillInGrid,
} from '../../services/pixelizer/pixel_canvas.engine'

interface PixelEditorProps {
  grid: PixelGrid
  onChangeGrid: (next: PixelGrid) => void
  activeTool: PixelTool
  activeColor: string
  onPickColor: (color: string) => void
  showGrid: boolean
}

export const PixelEditor: React.FC<PixelEditorProps> = ({
  grid,
  onChangeGrid,
  activeTool,
  activeColor,
  onPickColor,
  showGrid,
}) => {
  const [isMouseDown, setIsMouseDown] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const height = grid.length
  const width = height > 0 ? grid[0].length : 0

  const applyToolAt = (x: number, y: number) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return

    if (activeTool === 'picker') {
      const picked = grid[y][x]
      if (picked) onPickColor(picked)
      return
    }

    if (activeTool === 'bucket') {
      const targetColor = activeColor
      const next = floodFillInGrid(grid, x, y, targetColor)
      onChangeGrid(next)
      return
    }

    const colorToApply = activeTool === 'eraser' ? '' : activeColor
    if (grid[y][x] !== colorToApply) {
      const next = setPixelInGrid(grid, x, y, colorToApply)
      onChangeGrid(next)
    }
  }

  const handleCellMouseDown = (x: number, y: number, e: React.MouseEvent) => {
    e.preventDefault()
    setIsMouseDown(true)
    applyToolAt(x, y)
  }

  const handleCellMouseEnter = (x: number, y: number) => {
    if (isMouseDown && (activeTool === 'pencil' || activeTool === 'eraser')) {
      applyToolAt(x, y)
    }
  }

  const handleMouseUp = () => {
    setIsMouseDown(false)
  }

  return (
    <div
      ref={containerRef}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full aspect-square max-w-[340px] mx-auto rounded-xl checker-pattern border border-[#2b3044] p-3 flex items-center justify-center select-none overflow-hidden shadow-2xl"
    >
      <div
        className="grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${height}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, y) =>
          row.map((cellColor, x) => (
            <div
              key={`${x}-${y}`}
              onMouseDown={(e) => handleCellMouseDown(x, y, e)}
              onMouseEnter={() => handleCellMouseEnter(x, y)}
              className={`relative cursor-crosshair transition-colors ${
                showGrid ? 'border-[0.5px] border-black/15' : ''
              }`}
              style={{
                backgroundColor: cellColor || 'transparent',
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}
