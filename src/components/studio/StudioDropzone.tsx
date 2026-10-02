import React, { useRef } from 'react'
import { UploadCloud, Image as ImageIcon } from 'lucide-react'

interface StudioDropzoneProps {
  onImageSelected: (dataUrl: string) => void
}

export const StudioDropzone: React.FC<StudioDropzoneProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (result) onImageSelected(result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (result) onImageSelected(result)
    }
    reader.readAsDataURL(file)
  }

  // Pre-baked cute SVG vector shapes as reference images for quick 1-click test
  const loadPresetReference = (type: 'cat' | 'star' | 'coffee') => {
    const svgTemplates = {
      cat: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#ffffff"/><circle cx="100" cy="115" r="60" fill="#ffb8b8"/><polygon points="50,80 60,30 95,65" fill="#ff9999"/><polygon points="150,80 140,30 105,65" fill="#ff9999"/><circle cx="75" cy="105" r="8" fill="#2d132c"/><circle cx="125" cy="105" r="8" fill="#2d132c"/><circle cx="78" cy="102" r="3" fill="#ffffff"/><circle cx="128" cy="102" r="3" fill="#ffffff"/><circle cx="65" cy="120" r="10" fill="#ff7675" opacity="0.6"/><circle cx="135" cy="120" r="10" fill="#ff7675" opacity="0.6"/><ellipse cx="100" cy="118" rx="5" ry="4" fill="#d63031"/></svg>`,
      star: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#ffffff"/><polygon points="100,20 125,75 185,80 140,120 155,180 100,150 45,180 60,120 15,80 75,75" fill="#feca57"/><circle cx="85" cy="100" r="6" fill="#2d3436"/><circle cx="115" cy="100" r="6" fill="#2d3436"/><circle cx="75" cy="112" r="8" fill="#ff9ff3" opacity="0.6"/><circle cx="125" cy="112" r="8" fill="#ff9ff3" opacity="0.6"/></svg>`,
      coffee: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#ffffff"/><rect x="50" y="60" width="100" height="100" rx="16" fill="#55efc4"/><path d="M150 80 C175 80, 175 120, 150 120" stroke="#00b894" stroke-width="12" fill="none"/><circle cx="85" cy="105" r="6" fill="#2d3436"/><circle cx="115" cy="105" r="6" fill="#2d3436"/><circle cx="75" cy="118" r="8" fill="#fab1a0"/><circle cx="125" cy="118" r="8" fill="#fab1a0"/></svg>`,
    }

    const blob = new Blob([svgTemplates[type]], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    onImageSelected(url)
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-[#2d3348] hover:border-[#ff6b9d] bg-[#12141d]/70 hover:bg-[#161925] cursor-pointer transition-all text-center group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="w-10 h-10 rounded-lg bg-[#1e2230] border border-[#2d3246] flex items-center justify-center text-[#ff6b9d] mb-3 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-5 h-5" />
        </div>
        <p className="text-xs font-semibold text-[#f3f4f8]">
          Click to upload or drag & drop reference image
        </p>
        <p className="text-[11px] text-[#656b82] mt-0.5">
          PNG, JPG, WebP, or SVG. Any drawing or cute photo.
        </p>
      </div>

      {/* Preset Reference Buttons */}
      <div className="flex items-center gap-2 text-xs text-[#656b82]">
        <ImageIcon className="w-3.5 h-3.5 text-[#ff6b9d]" />
        <span>Or test with cute presets:</span>
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={() => loadPresetReference('cat')}
            className="px-2 py-0.5 rounded bg-[#1e2230] hover:bg-[#282d40] border border-[#2d3246] text-[#9aa1b8] text-[11px] transition-colors"
          >
            Kitty
          </button>
          <button
            type="button"
            onClick={() => loadPresetReference('star')}
            className="px-2 py-0.5 rounded bg-[#1e2230] hover:bg-[#282d40] border border-[#2d3246] text-[#9aa1b8] text-[11px] transition-colors"
          >
            Star
          </button>
          <button
            type="button"
            onClick={() => loadPresetReference('coffee')}
            className="px-2 py-0.5 rounded bg-[#1e2230] hover:bg-[#282d40] border border-[#2d3246] text-[#9aa1b8] text-[11px] transition-colors"
          >
            Mug
          </button>
        </div>
      </div>
    </div>
  )
}
