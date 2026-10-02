import { describe, it, expect } from 'vitest'
import { buildSvgFromPixels } from '../src/services/export/sticker_vector_exporter.service'

describe('sticker_vector_exporter service', () => {
  it('generates crisp SVG with accurate dimensions and rect elements', () => {
    const pixels = [
      { x: 0, y: 0, fill: 'rgb(255,107,157)' },
      { x: 1, y: 1, fill: 'rgb(255,255,255)' },
    ]
    const svg = buildSvgFromPixels(2, 2, pixels, 16)

    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"')
    expect(svg).toContain('viewBox="0 0 32 32"')
    expect(svg).toContain('width="32"')
    expect(svg).toContain('height="32"')
    expect(svg).toContain('shape-rendering="crispEdges"')
    expect(svg).toContain('<rect x="0" y="0" width="16" height="16" fill="rgb(255,107,157)" />')
    expect(svg).toContain('<rect x="16" y="16" width="16" height="16" fill="rgb(255,255,255)" />')
  })

  it('handles empty pixel list safely', () => {
    const svg = buildSvgFromPixels(10, 10, [], 8)
    expect(svg).toBe('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80" shape-rendering="crispEdges"></svg>')
  })
})
