export type PixelTool = 'pencil' | 'eraser' | 'picker' | 'bucket'

export type PixelGrid = string[][]

export interface PixelCanvasDimensions {
  width: number
  height: number
}

export interface PixelHistoryEntry {
  grid: PixelGrid
}
