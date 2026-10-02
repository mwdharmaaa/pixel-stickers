import React from 'react'
import { PlusCircle } from 'lucide-react'
import type { StickerCategory } from '../../types/sticker.types'

interface StudioFormMetaProps {
  title: string
  category: Exclude<StickerCategory, 'all' | 'favorites'>
  tagsInput: string
  onTitleChange: (v: string) => void
  onCategoryChange: (c: Exclude<StickerCategory, 'all' | 'favorites'>) => void
  onTagsInputChange: (v: string) => void
  onSave: () => void
  canSave: boolean
}

export const StudioFormMeta: React.FC<StudioFormMetaProps> = ({
  title,
  category,
  tagsInput,
  onTitleChange,
  onCategoryChange,
  onTagsInputChange,
  onSave,
  canSave,
}) => {
  return (
    <div className="flex flex-col gap-3 pt-3 border-t border-[#232737]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] text-[#9aa1b8] mb-1 font-medium">
            Sticker Name
          </label>
          <input
            type="text"
            placeholder="e.g. Sleepy Axolotl"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#141620] border border-[#272a3a] text-xs text-[#f3f4f8] placeholder-[#555b73] focus:outline-none focus:border-[#ff6b9d]"
          />
        </div>

        <div>
          <label className="block text-[11px] text-[#9aa1b8] mb-1 font-medium">
            Category
          </label>
          <select
            value={category}
            onChange={(e) =>
              onCategoryChange(
                e.target.value as Exclude<StickerCategory, 'all' | 'favorites'>
              )
            }
            className="w-full px-3 py-2 rounded-xl bg-[#141620] border border-[#272a3a] text-xs text-[#f3f4f8] focus:outline-none focus:border-[#ff6b9d]"
          >
            <option value="animals">Animals</option>
            <option value="food">Food & Sweets</option>
            <option value="gaming">Gaming</option>
            <option value="nature">Nature</option>
            <option value="fantasy">Fantasy</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[11px] text-[#9aa1b8] mb-1 font-medium">
          Tags (comma separated)
        </label>
        <input
          type="text"
          placeholder="pixel, cute, pastel, retro"
          value={tagsInput}
          onChange={(e) => onTagsInputChange(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-[#141620] border border-[#272a3a] text-xs text-[#f3f4f8] placeholder-[#555b73] focus:outline-none focus:border-[#ff6b9d]"
        />
      </div>

      <button
        type="button"
        disabled={!canSave}
        onClick={onSave}
        className="w-full mt-2 py-3 rounded-xl bg-[#ff6b9d] hover:bg-[#ff528c] text-[#0c0d12] font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,107,157,0.3)] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        <PlusCircle className="w-4 h-4 stroke-[2.5]" />
        <span>Save to Sticker Vault</span>
      </button>
    </div>
  )
}
