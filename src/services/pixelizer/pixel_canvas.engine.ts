import type { PixelGrid } from './pixel_canvas.types'

export function createEmptyGrid(width: number, height: number): PixelGrid {
  const grid: PixelGrid = []
  for (let y = 0; y < height; y++) {
    const row: string[] = []
    for (let x = 0; x < width; x++) {
      row.push('')
    }
    grid.push(row)
  }
  return grid
}

export function cloneGrid(grid: PixelGrid): PixelGrid {
  return grid.map((row) => [...row])
}

export function setPixelInGrid(
  grid: PixelGrid,
  x: number,
  y: number,
  color: string
): PixelGrid {
  const height = grid.length
  if (height === 0) return grid
  const width = grid[0].length
  if (x < 0 || x >= width || y < 0 || y >= height) return grid

  if (grid[y][x] === color) return grid

  const next = cloneGrid(grid)
  next[y][x] = color
  return next
}

export function floodFillInGrid(
  grid: PixelGrid,
  startX: number,
  startY: number,
  fillColor: string
): PixelGrid {
  const height = grid.length
  if (height === 0) return grid
  const width = grid[0].length
  if (startX < 0 || startX >= width || startY < 0 || startY >= height) return grid

  const targetColor = grid[startY][startX]
  if (targetColor === fillColor) return grid

  const next = cloneGrid(grid)
  const queue: [number, number][] = [[startX, startY]]
  const visited = new Set<string>()

  while (queue.length > 0) {
    const [cx, cy] = queue.pop()!
    const key = `${cx},${cy}`
    if (visited.has(key)) continue
    visited.add(key)

    if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue
    if (next[cy][cx] !== targetColor) continue

    next[cy][cx] = fillColor

    queue.push([cx + 1, cy])
    queue.push([cx - 1, cy])
    queue.push([cx, cy + 1])
    queue.push([cx, cy - 1])
  }

  return next
}

export function extractColorsFromGrid(grid: PixelGrid): string[] {
  const colorCounts = new Map<string, number>()
  for (const row of grid) {
    for (const cell of row) {
      if (cell && cell !== 'transparent') {
        const normalized = cell.toUpperCase()
        colorCounts.set(normalized, (colorCounts.get(normalized) || 0) + 1)
      }
    }
  }

  return Array.from(colorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([hex]) => hex)
}

export function pixelGridToCanvas(grid: PixelGrid): HTMLCanvasElement {
  const height = grid.length
  const width = height > 0 ? grid[0].length : 0
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, width)
  canvas.height = Math.max(1, height)
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const color = grid[y][x]
      if (color && color !== 'transparent') {
        ctx.fillStyle = color
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }
  return canvas
}

export function pixelGridToDataUrl(grid: PixelGrid): string {
  const canvas = pixelGridToCanvas(grid)
  return canvas.toDataURL('image/png')
}
