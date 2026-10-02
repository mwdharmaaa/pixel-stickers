import type { AspectRatioOption } from './pixelizer.types'

export interface PixelDimensionInput {
  srcWidth: number
  srcHeight: number
  pixelSize: number
  aspectRatio?: AspectRatioOption
}

export interface PixelCropRect {
  sx: number
  sy: number
  sw: number
  sh: number
}

export interface PixelDimensionResult {
  targetCols: number
  targetRows: number
  crop: PixelCropRect
}

export const MIN_PIXEL_SIZE = 8
export const MAX_PIXEL_SIZE = 128

export function computePixelDimensions(input: PixelDimensionInput): PixelDimensionResult {
  const { srcWidth, srcHeight, pixelSize, aspectRatio = 'original' } = input

  // Clamp target resolution between 8px and 128px
  const maxDim = Math.max(MIN_PIXEL_SIZE, Math.min(MAX_PIXEL_SIZE, Math.round(pixelSize)))

  if (aspectRatio === 'original') {
    const srcAspect = srcWidth / srcHeight
    let targetCols: number
    let targetRows: number

    if (srcAspect >= 1) {
      targetCols = maxDim
      targetRows = Math.max(MIN_PIXEL_SIZE, Math.round(maxDim / srcAspect))
    } else {
      targetRows = maxDim
      targetCols = Math.max(MIN_PIXEL_SIZE, Math.round(maxDim * srcAspect))
    }

    return {
      targetCols,
      targetRows,
      crop: { sx: 0, sy: 0, sw: srcWidth, sh: srcHeight },
    }
  }

  // Determine target aspect ratio numerical value (width / height)
  let desiredAspect = 1
  switch (aspectRatio) {
    case '1:1':
      desiredAspect = 1
      break
    case '4:3':
      desiredAspect = 4 / 3
      break
    case '3:4':
      desiredAspect = 3 / 4
      break
    case '16:9':
      desiredAspect = 16 / 9
      break
  }

  let targetCols: number
  let targetRows: number

  if (desiredAspect >= 1) {
    targetCols = maxDim
    targetRows = Math.max(MIN_PIXEL_SIZE, Math.round(maxDim / desiredAspect))
  } else {
    targetRows = maxDim
    targetCols = Math.max(MIN_PIXEL_SIZE, Math.round(maxDim * desiredAspect))
  }

  // Calculate center-crop rectangle from source
  const srcAspect = srcWidth / srcHeight
  let sw = srcWidth
  let sh = srcHeight
  let sx = 0
  let sy = 0

  if (srcAspect > desiredAspect) {
    // Source is wider than desired: crop horizontally
    sw = srcHeight * desiredAspect
    sx = (srcWidth - sw) / 2
  } else {
    // Source is taller than desired: crop vertically
    sh = srcWidth / desiredAspect
    sy = (srcHeight - sh) / 2
  }

  return {
    targetCols,
    targetRows,
    crop: {
      sx: Math.round(sx),
      sy: Math.round(sy),
      sw: Math.round(sw),
      sh: Math.round(sh),
    },
  }
}
