import { describe, it, expect } from 'vitest'
import {
  createEmptyGrid,
  setPixelInGrid,
  floodFillInGrid,
  extractColorsFromGrid,
} from '../src/services/pixelizer/pixel_canvas.engine'

describe('pixel_canvas.engine', () => {
  it('creates an empty grid with given dimensions', () => {
    const grid = createEmptyGrid(4, 3)
    expect(grid.length).toBe(3)
    expect(grid[0].length).toBe(4)
    expect(grid[0][0]).toBe('')
  })

  it('updates pixel color safely at coordinates', () => {
    const grid = createEmptyGrid(3, 3)
    const updated = setPixelInGrid(grid, 1, 1, '#FF0000')
    expect(updated[1][1]).toBe('#FF0000')
    // Original unchanged (immutable)
    expect(grid[1][1]).toBe('')
  })

  it('performs flood fill correctly across contiguous matching cells', () => {
    // 3x3 empty grid
    const grid = createEmptyGrid(3, 3)
    // place a barrier at (1, 1)
    const withBarrier = setPixelInGrid(grid, 1, 1, '#000000')
    // flood fill starting at (0, 0) with pink
    const filled = floodFillInGrid(withBarrier, 0, 0, '#FF6B9D')

    expect(filled[0][0]).toBe('#FF6B9D')
    expect(filled[0][1]).toBe('#FF6B9D')
    expect(filled[1][0]).toBe('#FF6B9D')
    // Barrier remains untouched
    expect(filled[1][1]).toBe('#000000')
  })

  it('extracts and sorts dominant colors by frequency', () => {
    let grid = createEmptyGrid(2, 2)
    grid = setPixelInGrid(grid, 0, 0, '#FFFFFF')
    grid = setPixelInGrid(grid, 0, 1, '#FF6B9D')
    grid = setPixelInGrid(grid, 1, 0, '#FF6B9D')
    grid = setPixelInGrid(grid, 1, 1, '#FF6B9D')

    const colors = extractColorsFromGrid(grid)
    expect(colors).toEqual(['#FF6B9D', '#FFFFFF'])
  })
})
