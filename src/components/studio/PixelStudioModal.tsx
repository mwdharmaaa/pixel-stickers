import React, { useState, useEffect } from 'react'
import { X, Sparkles, PlusCircle } from 'lucide-react'
import confetti from 'canvas-confetti'
import type { Sticker, StickerCategory } from '../../types/sticker.types'
import type { PixelizerOptions, ProcessedPixelResult } from '../../services/pixelizer/pixelizer.types'
import { processPixelArt } from '../../services/pixelizer/pixelizer.engine'
import { saveStoredSticker } from '../../services/storage/sticker_storage.service'
import { StudioDropzone } from './StudioDropzone'
import { StudioControls } from './StudioControls'
import { StudioPreview } from './StudioPreview'

interface PixelStudioModalProps {
  isOpen: boolean
  onClose: () => void
  onStickerCreated: (newSticker: Sticker) => void
  onNotify: (text: string, type: 'success' | 'error') => void
}

const DEFAULT_OPTIONS: PixelizerOptions = {
  pixelSize: 28,
  palette: 'sweet-pastel',
  brightness: 0,
  contrast: 15,
  removeBackground: true,
  bgThreshold: 35,
  addStickerBorder: true,
  borderColor: '#ffffff',
}

export const PixelStudioModal: React.FC<PixelStudioModalProps> = ({
  isOpen,
  onClose,
  onStickerCreated,
  onNotify,
}) => {
  const [referenceUrl, setReferenceUrl] = useState<string | null>(null)
  const [options, setOptions] = useState<PixelizerOptions>(DEFAULT_OPTIONS)
  const [result, setResult] = useState<ProcessedPixelResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Form Fields
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Exclude<StickerCategory, 'all'>>('animals')
  const [tagsInput, setTagsInput] = useState('')

  // Trigger processing on reference or option changes
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

  const handleSave = () => {
    if (!result) {
      onNotify('Please upload a reference image first', 'error')
      return
    }

    const stickerName = title.trim() || 'My Cute Pixel Sticker'
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)

    const newSticker: Sticker = {
      id: `custom-${Date.now()}`,
      title: stickerName,
      category,
      tags: tags.length > 0 ? tags : ['pixel', 'custom', category],
      pixelDataUrl: result.dataUrl,
      width: result.width,
      height: result.height,
      colors: result.dominantColors,
      isCustom: true,
      createdAt: Date.now(),
    }

    const saved = saveStoredSticker(newSticker)
    if (saved) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } })
      onStickerCreated(newSticker)
      onNotify(`Added "${stickerName}" to your collection!`, 'success')
      onClose()
    } else {
      onNotify('Failed to save sticker to local storage', 'error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0c0d12]/85 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto rounded-2xl border border-[#2b3044] bg-[#141620] shadow-2xl overflow-hidden text-[#f3f4f8]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232737]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ff6b9d]/15 border border-[#ff6b9d]/30 flex items-center justify-center text-[#ff6b9d]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#f3f4f8]">Pixelizer Studio</h2>
              <p className="text-[11px] text-[#656b82]">Convert references into cute pixel stickers</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#656b82] hover:text-[#f3f4f8] hover:bg-[#1e2230] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Studio Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto flex flex-col gap-5">
          <StudioDropzone onImageSelected={setReferenceUrl} />

          {referenceUrl && (
            <>
              <StudioPreview
                referenceUrl={referenceUrl}
                result={result}
                isProcessing={isProcessing}
              />

              <StudioControls
                options={options}
                onChange={(upd) => setOptions((prev) => ({ ...prev, ...upd }))}
              />

              {/* Metadata Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#232737]">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-medium text-[#9aa1b8] mb-1">Sticker Name</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Mochi Hamster"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#181b26] border border-[#252838] text-xs text-[#f3f4f8] placeholder-[#656b82] focus:outline-none focus:border-[#ff6b9d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9aa1b8] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Exclude<StickerCategory, 'all'>)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#181b26] border border-[#252838] text-xs text-[#f3f4f8] focus:outline-none focus:border-[#ff6b9d]"
                  >
                    <option value="animals">Animals</option>
                    <option value="food">Food & Sweets</option>
                    <option value="gaming">Retro Gaming</option>
                    <option value="nature">Nature</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9aa1b8] mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="cute, pastel, animal"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#181b26] border border-[#252838] text-xs text-[#f3f4f8] placeholder-[#656b82] focus:outline-none focus:border-[#ff6b9d]"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#232737] bg-[#10121a]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#252838] text-xs text-[#9aa1b8] hover:text-[#f3f4f8] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!result || isProcessing}
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#ff6b9d] hover:bg-[#ff528c] text-[#0c0d12] font-semibold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Save to My Collection</span>
          </button>
        </div>
      </div>
    </div>
  )
}
