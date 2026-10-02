export interface PixelArtDef {
  id: string
  title: string
  category: 'animals' | 'food' | 'gaming' | 'nature' | 'fantasy'
  tags: string[]
  palette: Record<string, string>
  rows: string[]
}
