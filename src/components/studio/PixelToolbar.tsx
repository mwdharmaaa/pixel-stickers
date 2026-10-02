import React from 'react'
import {
  Pencil,
  Eraser,
  Pipette,
  PaintBucket,
  Undo2,
  Redo2,
  Grid3X3,
  Trash2,
} from 'lucide-react'
import type { PixelTool } from '../../services/pixelizer/pixel_canvas.types'

interface PixelToolbarProps {
  activeTool: PixelTool
  onSelectTool: (tool: PixelTool) => void
  showGrid: boolean
  onToggleGrid: () => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
}

export const PixelToolbar: React.FC<PixelToolbarProps> = ({
  activeTool,
  onSelectTool,
  showGrid,
  onToggleGrid,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
}) => {
  const tools: { id: PixelTool; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'pencil', label: 'Pencil', icon: Pencil },
    { id: 'eraser', label: 'Eraser', icon: Eraser },
    { id: 'picker', label: 'Color Picker', icon: Pipette },
    { id: 'bucket', label: 'Bucket Fill', icon: PaintBucket },
  ]

  return (
    <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#141622] border border-[#232737]">
      <div className="flex items-center gap-1">
        {tools.map((t) => {
          const Icon = t.icon
          const isActive = activeTool === t.id
          return (
            <button
              key={t.id}
              type="button"
              title={t.label}
              onClick={() => onSelectTool(t.id)}
              className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                isActive
                  ? 'bg-[#ff6b9d] text-[#0c0d12]'
                  : 'text-[#9aa1b8] hover:text-[#f3f4f8] hover:bg-[#1f2334]'
              }`}
            >
              <Icon className="w-4 h-4" />
            </button>
          )
        })}
      </div>

      <div className="h-4 w-px bg-[#232737]" />

      <div className="flex items-center gap-1">
        <button
          type="button"
          title="Toggle Grid Lines"
          onClick={onToggleGrid}
          className={`p-2 rounded-lg transition-colors ${
            showGrid
              ? 'text-[#ff6b9d] bg-[#ff6b9d]/10 border border-[#ff6b9d]/30'
              : 'text-[#9aa1b8] hover:text-[#f3f4f8] hover:bg-[#1f2334]'
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
        </button>

        <button
          type="button"
          title="Undo"
          disabled={!canUndo}
          onClick={onUndo}
          className="p-2 rounded-lg text-[#9aa1b8] hover:text-[#f3f4f8] hover:bg-[#1f2334] disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          title="Redo"
          disabled={!canRedo}
          onClick={onRedo}
          className="p-2 rounded-lg text-[#9aa1b8] hover:text-[#f3f4f8] hover:bg-[#1f2334] disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          title="Clear Canvas"
          onClick={onClear}
          className="p-2 rounded-lg text-[#ff5c5c] hover:bg-[#ff5c5c]/10 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
