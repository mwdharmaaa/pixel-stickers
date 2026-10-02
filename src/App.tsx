import React, { useState, useEffect, useMemo } from 'react'
import { Sparkles, ImagePlus, HeartHandshake } from 'lucide-react'
import type { Sticker, StickerCategory } from './types/sticker.types'
import type { AppTheme } from './services/theme/theme.types'
import { getSavedTheme, applyTheme, getNextTheme } from './services/theme/theme.service'
import { generateDefaultStickers } from './data/matrix_renderer'
import {
  loadStoredStickers,
  deleteStoredSticker,
  exportStickersToJson,
  importStickersFromJsonString,
} from './services/storage/sticker_storage.service'
import { downloadSticker, copyStickerToClipboard } from './services/export/sticker_exporter.service'
import { exportStickersToZip } from './services/export/batch_zip_exporter.service'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { StickerFilter } from './components/gallery/StickerFilter'
import { StickerGrid } from './components/gallery/StickerGrid'
import { StickerDetailModal } from './components/gallery/StickerDetailModal'
import { PixelStudioModal } from './components/studio/PixelStudioModal'
import { Toast, type ToastMessage } from './components/common/Toast'

export const App: React.FC = () => {
  const [theme, setTheme] = useState<AppTheme>(() => getSavedTheme())
  const [defaultStickers, setDefaultStickers] = useState<Sticker[]>([])
  const [customStickers, setCustomStickers] = useState<Sticker[]>([])
  const [category, setCategory] = useState<StickerCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null)
  const [editingSticker, setEditingSticker] = useState<Sticker | null>(null)
  const [isStudioOpen, setIsStudioOpen] = useState(false)
  const [isDownloadingZip, setIsDownloadingZip] = useState(false)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('pixel_stickers_favs')
      return raw ? new Set(JSON.parse(raw)) : new Set()
    } catch {
      return new Set()
    }
  })

  // Initialize stickers and theme on mount
  useEffect(() => {
    applyTheme(theme)
    const defaults = generateDefaultStickers()
    setDefaultStickers(defaults)
    const stored = loadStoredStickers()
    setCustomStickers(stored)
  }, [])

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ id: String(Date.now()), type, text })
  }

  const handleToggleTheme = () => {
    setTheme((curr) => {
      const next = getNextTheme(curr)
      applyTheme(next)
      notify(
        next === 'pink-light'
          ? 'Switched to Rose Light Mode'
          : 'Switched to Dark Studio',
        'success'
      )
      return next
    })
  }

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        notify('Removed from favorites', 'success')
      } else {
        next.add(id)
        notify('Added to favorites', 'success')
      }
      try {
        localStorage.setItem(
          'pixel_stickers_favs',
          JSON.stringify(Array.from(next))
        )
      } catch (err) {
        console.error('Failed to save favorites', err)
      }
      return next
    })
  }

  // Combined sticker list
  const allStickers = useMemo(
    () =>
      [...customStickers, ...defaultStickers].map((s) => ({
        ...s,
        isFavorite: favoriteIds.has(s.id),
      })),
    [customStickers, defaultStickers, favoriteIds]
  )

  // Category counts
  const counts = useMemo(() => {
    const map: Record<StickerCategory, number> = {
      all: allStickers.length,
      favorites: allStickers.filter((s) => s.isFavorite).length,
      animals: 0,
      food: 0,
      gaming: 0,
      nature: 0,
      fantasy: 0,
      custom: customStickers.length,
    }
    for (const s of allStickers) {
      if (map[s.category] !== undefined) map[s.category]++
    }
    return map
  }, [allStickers, customStickers])

  // Filtered sticker list
  const filteredStickers = useMemo(() => {
    return allStickers.filter((sticker) => {
      const matchCat =
        category === 'all'
          ? true
          : category === 'favorites'
            ? Boolean(sticker.isFavorite)
            : category === 'custom'
              ? sticker.isCustom
              : sticker.category === category

      const query = searchQuery.toLowerCase().trim()
      const matchSearch =
        !query ||
        sticker.title.toLowerCase().includes(query) ||
        sticker.tags.some((t) => t.toLowerCase().includes(query))

      return matchCat && matchSearch
    })
  }, [allStickers, category, searchQuery])

  const handleQuickDownload = async (e: React.MouseEvent, sticker: Sticker) => {
    e.stopPropagation()
    try {
      await downloadSticker(sticker.pixelDataUrl, sticker.title, 4)
      notify(`Downloaded ${sticker.title} (4x)`, 'success')
    } catch {
      notify('Failed to download sticker', 'error')
    }
  }

  const handleQuickCopy = async (e: React.MouseEvent, sticker: Sticker) => {
    e.stopPropagation()
    const ok = await copyStickerToClipboard(sticker.pixelDataUrl, 4)
    if (ok) {
      notify('Sticker copied to clipboard', 'success')
    } else {
      notify('Clipboard access denied', 'error')
    }
  }

  const handleDeleteCustom = (id: string) => {
    deleteStoredSticker(id)
    setCustomStickers((prev) => prev.filter((s) => s.id !== id))
    notify('Custom sticker deleted', 'success')
  }

  const handleImportBackup = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (!content) {
        notify('Failed to read backup file', 'error')
        return
      }
      const res = importStickersFromJsonString(content)
      if (res.success) {
        const stored = loadStoredStickers()
        setCustomStickers(stored)
        notify(`Restored ${res.importedCount} stickers successfully`, 'success')
      } else {
        notify(res.error || 'Failed to import backup', 'error')
      }
    }
    reader.onerror = () => notify('Error reading backup file', 'error')
    reader.readAsText(file)
  }

  const handleDownloadPackZip = async () => {
    if (filteredStickers.length === 0) {
      notify('No stickers to export in current view', 'error')
      return
    }
    try {
      setIsDownloadingZip(true)
      notify(`Packaging ${filteredStickers.length} stickers into ZIP archive...`, 'success')
      const packName = `pixely-${category}-pack`
      await exportStickersToZip(filteredStickers, packName, 4)
      notify(`Exported ${filteredStickers.length} stickers as ZIP pack!`, 'success')
    } catch (err) {
      console.error(err)
      notify('Failed to generate ZIP archive', 'error')
    } finally {
      setIsDownloadingZip(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0d12] text-[#f3f4f8] flex flex-col selection:bg-[#ff6b9d] selection:text-[#0c0d12]">
      <Navbar
        totalStickers={allStickers.length}
        customCount={customStickers.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenStudio={() => setIsStudioOpen(true)}
        onExportBackup={() => {
          exportStickersToJson(allStickers)
          notify('Exported sticker vault backup JSON', 'success')
        }}
        onImportBackup={handleImportBackup}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#141622] via-[#161826] to-[#141622] border border-[#232737]">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ff6b9d]/10 border border-[#ff6b9d]/30 text-[#ff6b9d] text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free Pixel Art & Real-time Generator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f3f4f8]">
              Pixely - Cute Pixel Stickers Vault
            </h1>
            <p className="text-xs sm:text-sm text-[#9aa1b8] mt-2 leading-relaxed">
              Download crisp retro pixel art stickers, convert your reference images into pixel stickers in real-time, or add your own creations. 100% serverless, private, and offline-ready.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsStudioOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6b9d] hover:bg-[#ff528c] text-[#0c0d12] font-semibold text-xs transition-all shadow-[0_0_20px_rgba(255,107,157,0.35)] active:scale-95"
            >
              <ImagePlus className="w-4 h-4 stroke-[2.5]" />
              <span>Create from Reference</span>
            </button>
            <button
              type="button"
              onClick={() => setCategory('custom')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#272a3a] bg-[#161822] hover:border-[#383e54] text-xs font-medium text-[#9aa1b8] hover:text-[#f3f4f8] transition-colors"
            >
              <HeartHandshake className="w-4 h-4 text-[#ff6b9d]" />
              <span>My Creations ({customStickers.length})</span>
            </button>
          </div>
        </section>

        {/* Sticker Gallery Filter & Grid */}
        <StickerFilter
          currentCategory={category}
          searchQuery={searchQuery}
          counts={counts}
          onSelectCategory={setCategory}
          onSearchChange={setSearchQuery}
          onDownloadZip={handleDownloadPackZip}
          isDownloadingZip={isDownloadingZip}
        />

        <StickerGrid
          stickers={filteredStickers}
          onSelectSticker={setSelectedSticker}
          onQuickDownload={handleQuickDownload}
          onQuickCopy={handleQuickCopy}
          onToggleFavorite={toggleFavorite}
          onOpenStudio={() => setIsStudioOpen(true)}
        />
      </main>

      <Footer />

      {/* Modals & Overlays */}
      <StickerDetailModal
        sticker={selectedSticker}
        onClose={() => setSelectedSticker(null)}
        onDeleteCustom={handleDeleteCustom}
        onToggleFavorite={toggleFavorite}
        onEditInStudio={(sticker) => {
          setEditingSticker(sticker)
          setIsStudioOpen(true)
        }}
        onNotify={notify}
      />

      <PixelStudioModal
        isOpen={isStudioOpen}
        initialSticker={editingSticker}
        onClose={() => {
          setIsStudioOpen(false)
          setEditingSticker(null)
        }}
        onStickerCreated={(newSticker) => {
          setCustomStickers((prev) => [newSticker, ...prev.filter((s) => s.id !== newSticker.id)])
        }}
        onNotify={notify}
      />

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}

export default App
