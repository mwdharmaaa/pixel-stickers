export type PalettePreset =
  | 'sweet-pastel'
  | 'pico-8'
  | 'gameboy'
  | 'cyberpunk'
  | 'warm-sunset'
  | 'full-color'

export interface PixelizerOptions {
  pixelSize: number
  palette: PalettePreset
  brightness: number
  contrast: number
  removeBackground: boolean
  bgThreshold: number
  addStickerBorder: boolean
  borderColor: string
}

export interface ProcessedPixelResult {
  dataUrl: string
  width: number
  height: number
  dominantColors: string[]
}
