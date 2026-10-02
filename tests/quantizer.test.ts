import { describe, it, expect } from 'vitest'
import { findNearestColor, rgbToHex } from '../src/services/pixelizer/color_quantizer'

describe('color_quantizer', () => {
  it('converts rgb values to uppercase hex string', () => {
    expect(rgbToHex(255, 107, 157)).toBe('#FF6B9D')
    expect(rgbToHex(0, 0, 0)).toBe('#000000')
    expect(rgbToHex(255, 255, 255)).toBe('#FFFFFF')
  })

  it('preserves color when palette is full-color', () => {
    const input: [number, number, number] = [123, 45, 67]
    const result = findNearestColor(input[0], input[1], input[2], 'full-color')
    expect(result).toEqual(input)
  })

  it('quantizes to nearest Game Boy shade', () => {
    // Pure green-ish should map to one of Game Boy palette colors
    const result = findNearestColor(50, 100, 50, 'gameboy')
    expect(result).toEqual([48, 98, 48])
  })

  it('quantizes to nearest sweet pastel shade', () => {
    // Light pink
    const result = findNearestColor(250, 175, 185, 'sweet-pastel')
    expect(result).toEqual([255, 179, 186])
  })
})
