import type { PixelArtDef } from './stamps.types'
import { ANIMAL_STAMPS } from './animals.stamps'
import { FOOD_STAMPS } from './food.stamps'
import { GAMING_STAMPS } from './gaming.stamps'
import { NATURE_STAMPS } from './nature.stamps'
import { FANTASY_STAMPS } from './fantasy.stamps'

export * from './stamps.types'
export { ANIMAL_STAMPS } from './animals.stamps'
export { FOOD_STAMPS } from './food.stamps'
export { GAMING_STAMPS } from './gaming.stamps'
export { NATURE_STAMPS } from './nature.stamps'
export { FANTASY_STAMPS } from './fantasy.stamps'

export const DEFAULT_PIXEL_ARTS: PixelArtDef[] = [
  ...ANIMAL_STAMPS,
  ...FOOD_STAMPS,
  ...GAMING_STAMPS,
  ...NATURE_STAMPS,
  ...FANTASY_STAMPS,
]
