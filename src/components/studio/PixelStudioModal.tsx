import React, { useState, useEffect } from 'react'
import { Paintbrush } from 'lucide-react'
import confetti from 'canvas-confetti'
import type { Sticker, StickerCategory } from '../../types/sticker.types'
import type { PixelizerOptions, ProcessedPixelResult } from '../../services/pixelizer/pixelizer.types'
import type { PixelGrid } from '../../services/pixelizer/pixel_canvas.types'
import { processPixelArt } from '../../services/pixelizer/pixelizer.engine'
import {
  createEmptyGrid,
  dataUrlToPixelGrid,
  pixelGridToDataUrl,
  extractColorsFromGrid,
} from '../../services/pixelizer/pixel_canvas.engine'
import { saveStoredSticker } from '../../services/storage/sticker_storage.service'
import { StudioHeader, type StudioMode } from './StudioHeader'
import { StudioDropzone } from './StudioDropzone'
import { StudioControls } from './StudioControls'
import { StudioPreview } from './StudioPreview'
import { StudioDrawSection } from './StudioDrawSection'
import { StudioFormMeta } from './StudioFormMeta'

interface PixelStudioModalProps {
  isOpen: boolean
  initialSticker?: Sticker | null
  onClose: () => void
  onStickerCreated: (newSticker: Sticker) => void
  onNotify: (text: string, type: 'success' | 'error') => void
}

const DEFAULT_OPTIONS: PixelizerOptions = {
  pixelSize: 28,
  aspectRatio: 'original',
  palette: 'full-color',
  brightness: 0,
  contrast: 0,
  removeBackground: true,
  bgThreshold: 35,
  addStickerBorder: true,
  borderColor: '#ffffff',
}

export const PixelStudioModal: React.FC<PixelStudioModalProps> = ({
  isOpen,
  initialSticker,
  onClose,
  onStickerCreated,
  onNotify,
}) => {
  const [mode, setMode] = useState<StudioMode>('auto')
  const [referenceUrl, setReferenceUrl] = useState<string | null>(null)
  const [options, setOptions] = useState<PixelizerOptions>(DEFAULT_OPTIONS)
  const [result, setResult] = useState<ProcessedPixelResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [drawGrid, setDrawGrid] = useState<PixelGrid>(() => createEmptyGrid(24, 24))

  // Form Fields
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Exclude<StickerCategory, 'all' | 'favorites'>>('animals')
  const [tagsInput, setTagsInput] = useState('')

  useEffect(() => {
    if (!isOpen) return
    if (initialSticker) {
      setMode('draw')
      setTitle(initialSticker.title)
      setCategory(initialSticker.category)
      setTagsInput(initialSticker.tags.join(', '))
      dataUrlToPixelGrid(initialSticker.pixelDataUrl)
        .then((grid) => {
          if (grid.length > 0) setDrawGrid(grid)
        })
        .catch(console.error)
    } else {
      setMode('auto')
      setTitle('')
      setTagsInput('')
      setReferenceUrl(null)
      setResult(null)
      setDrawGrid(createEmptyGrid(24, 24))
    }
  }, [isOpen, initialSticker])

  useEffect(() => {
    if (!referenceUrl) return
    let cancelled = false
    setIsProcessing(true)

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = async () => {
      try {
        const res = await processPixelArt(img, options)
        if (!cancelled) {
          setResult(res)
          setIsProcessing(false)
        }
      } catch (err) {
        if (!cancelled) {
          setIsProcessing(false)
          console.error(err)
        }
      }
    }
    img.src = referenceUrl
    return () => {
      cancelled = true
    }
  }, [referenceUrl, options])

  if (!isOpen) return null

  const handleClearReference = () => {
    setReferenceUrl(null)
    setResult(null)
  }

  const handleRetouchInEditor = async () => {
    if (!result) return
    try {
      const grid = await dataUrlToPixelGrid(result.dataUrl)
      if (grid.length > 0) {
        setDrawGrid(grid)
        setMode('draw')
        onNotify('Loaded quantized pixels into Pixel Editor for retouching!', 'success')
      }
    } catch {
      onNotify('Failed to convert pixels to editable grid', 'error')
    }
  }

  const handleSave = () => {
    const stickerName = title.trim() || 'My Cute Pixel Sticker'
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)

    let finalDataUrl = ''
    let finalWidth = 24
    let finalHeight = 24
    let finalColors: string[] = []

    if (mode === 'draw') {
      finalColors = extractColorsFromGrid(drawGrid)
      if (finalColors.length === 0) {
        onNotify('Canvas is blank. Please draw something first!', 'error')
        return
      }
      finalDataUrl = pixelGridToDataUrl(drawGrid)
      finalHeight = drawGrid.length
      finalWidth = drawGrid[0].length
    } else {
      if (!result) {
        onNotify('Please upload and generate a pixel sticker first', 'error')
        return
      }
      finalDataUrl = result.dataUrl
      finalWidth = result.width
      finalHeight = result.height
      finalColors = result.dominantColors
    }

    const stickerId = initialSticker ? initialSticker.id : `custom-${Date.now()}`
    const newSticker: Sticker = {
      id: stickerId,
      title: stickerName,
      category,
      tags: tags.length > 0 ? tags : ['pixel', 'custom', category],
      pixelDataUrl: finalDataUrl,
      width: finalWidth,
      height: finalHeight,
      colors: finalColors,
      isCustom: true,
      createdAt: initialSticker ? initialSticker.createdAt : Date.now(),
    }

    const saved = saveStoredSticker(newSticker)
    if (saved) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } })
      onStickerCreated(newSticker)
      onNotify(
        initialSticker
          ? `Updated "${stickerName}" in your collection!`
          : `Added "${stickerName}" to your collection!`,
        'success'
      )
      onClose()
    } else {
      onNotify('Failed to save sticker to local storage', 'error')
    }
  }

  const canSave =
    mode === 'draw'
      ? extractColorsFromGrid(drawGrid).length > 0
      : Boolean(result && !isProcessing)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0c0d12]/85 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto rounded-2xl border border-[#2b3044] bg-[#141620] shadow-2xl overflow-hidden text-[#f3f4f8]">
        <StudioHeader mode={mode} onSelectMode={setMode} onClose={onClose} />

        <div className="p-5 max-h-[78vh] overflow-y-auto flex flex-col gap-4">
          {mode === 'auto' ? (
            <>
              <StudioDropzone
                onImageSelected={setReferenceUrl}
                hasImage={Boolean(referenceUrl)}
                onClearImage={handleClearReference}
              />
              {referenceUrl && (
                <>
                  <StudioPreview
                    referenceUrl={referenceUrl}
                    result={result}
                    isProcessing={isProcessing}
                    onClearReference={handleClearReference}
                  />

                  {result && (
                    <button
                      type="button"
                      onClick={handleRetouchInEditor}
                      className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#1b1f2e] border border-[#ff6b9d]/30 hover:border-[#ff6b9d] text-[#ff6b9d] text-xs font-medium transition-all"
                    >
                      <Paintbrush className="w-3.5 h-3.5" />
                      <span>Retouch Stray Pixels in Interactive Canvas</span>
                    </button>
                  )}

                  <StudioControls
                    options={options}
                    onChange={(upd) => setOptions((prev) => ({ ...prev, ...upd }))}
                  />
                </>
              )}
            </>
          ) : (
            <StudioDrawSection grid={drawGrid} onChangeGrid={setDrawGrid} />
          )}

          <StudioFormMeta
            title={title}
            category={category}
            tagsInput={tagsInput}
            onTitleChange={setTitle}
            onCategoryChange={setCategory}
            onTagsInputChange={setTagsInput}
            onSave={handleSave}
            canSave={canSave}
          />
        </div>
      </div>
    </div>
  )
}
