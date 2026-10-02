export type PalettePreset =
  | 'sweet-pastel'
  | 'pico-8'
  | 'gameboy'
  | 'cyberpunk'
  | 'warm-sunset'
  | 'full-color'
export type AspectRatioOption = 'original' | '1:1' | '4:3' | '3:4' | '16:9'

export interface PixelizerOptions {
  pixelSize: number
  aspectRatio?: AspectRatioOption
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
