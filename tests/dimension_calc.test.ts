import { describe, it, expect } from 'vitest'
import {
  computePixelDimensions,
  MAX_PIXEL_SIZE,
  MIN_PIXEL_SIZE,
} from '../src/services/pixelizer/dimension_calc'

describe('dimension_calc', () => {
  it('enforces maximum resolution bound of 128px', () => {
    const res = computePixelDimensions({
      srcWidth: 800,
      srcHeight: 800,
      pixelSize: 200, // Exceeds 128
      aspectRatio: '1:1',
    })

    expect(res.targetCols).toBe(128)
    expect(res.targetRows).toBe(128)
    expect(MAX_PIXEL_SIZE).toBe(128)
  })

  it('enforces minimum resolution bound of 8px', () => {
    const res = computePixelDimensions({
      srcWidth: 800,
      srcHeight: 800,
      pixelSize: 4, // Below 8
      aspectRatio: '1:1',
    })

    expect(res.targetCols).toBe(8)
    expect(res.targetRows).toBe(8)
    expect(MIN_PIXEL_SIZE).toBe(8)
  })

  it('scales exactly to 128px for 128px input in 1:1 ratio', () => {
    const res = computePixelDimensions({
      srcWidth: 512,
      srcHeight: 512,
      pixelSize: 128,
      aspectRatio: '1:1',
    })

    expect(res.targetCols).toBe(128)
    expect(res.targetRows).toBe(128)
    expect(res.crop).toEqual({
      sx: 0,
      sy: 0,
      sw: 512,
      sh: 512,
    })
  })

  it('preserves natural aspect ratio when aspectRatio is original for landscape image', () => {
    // 2:1 image ratio (400x200)
    const res = computePixelDimensions({
      srcWidth: 400,
      srcHeight: 200,
      pixelSize: 128,
      aspectRatio: 'original',
    })

    expect(res.targetCols).toBe(128)
    expect(res.targetRows).toBe(64)
    expect(res.crop).toEqual({
      sx: 0,
      sy: 0,
      sw: 400,
      sh: 200,
    })
  })

  it('caps max dimension at 128px for portrait image in original mode', () => {
    // 1:2 image ratio (200x400)
    const res = computePixelDimensions({
      srcWidth: 200,
      srcHeight: 400,
      pixelSize: 128,
      aspectRatio: 'original',
    })

    expect(res.targetRows).toBe(128)
    expect(res.targetCols).toBe(64)
  })

  it('computes center crop for 1:1 on landscape source', () => {
    // Source: 300 x 200 (wider than 1:1)
    const res = computePixelDimensions({
      srcWidth: 300,
      srcHeight: 200,
      pixelSize: 64,
      aspectRatio: '1:1',
    })

    expect(res.targetCols).toBe(64)
    expect(res.targetRows).toBe(64)
    // Desired square crop width should match height 200, centered horizontally
    expect(res.crop.sw).toBe(200)
    expect(res.crop.sh).toBe(200)
    expect(res.crop.sx).toBe(50) // (300 - 200) / 2
    expect(res.crop.sy).toBe(0)
  })

  it('computes dimensions correctly for 4:3, 3:4, and 16:9 aspect ratios', () => {
    const res43 = computePixelDimensions({
      srcWidth: 1000,
      srcHeight: 1000,
      pixelSize: 128,
      aspectRatio: '4:3',
    })
    expect(res43.targetCols).toBe(128)
    expect(res43.targetRows).toBe(96) // 128 * (3 / 4)

    const res34 = computePixelDimensions({
      srcWidth: 1000,
      srcHeight: 1000,
      pixelSize: 128,
      aspectRatio: '3:4',
    })
    expect(res34.targetRows).toBe(128)
    expect(res34.targetCols).toBe(96)

    const res169 = computePixelDimensions({
      srcWidth: 1920,
      srcHeight: 1080,
      pixelSize: 128,
      aspectRatio: '16:9',
    })
    expect(res169.targetCols).toBe(128)
    expect(res169.targetRows).toBe(72) // 128 * (9 / 16)
  })
})
