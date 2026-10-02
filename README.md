# Pixel Vault - Cute Pixel Stickers & Studio (@mwdhrmaaa)

A lightweight, serverless web application showcasing curated retro pixel art stickers, an in-browser real-time pixelizer studio to convert reference images into pixel stickers, and local persistence. 100% private, offline-ready, and zero server costs.

---

## 1. Key Capabilities

* **Curated 8-Bit Sticker Vault:** Hand-crafted, crisp pixel stickers across 5 categories (Animals, Food & Sweets, Retro Gaming, Nature, Fantasy) with instant multi-scale downloads (1x to 8x).
* **In-Browser Pixelizer Studio:**
  * Real-time canvas engine converting any reference photo or illustration into pixel stickers.
  * Configurable pixel density (12px to 64px) and color quantization.
  * 6 Retro Palette Presets: Sweet Pastel, PICO-8 16, Game Boy 4-shade, Cyberpunk Neon, Warm Sunset, and Original Full Color.
  * Automatic background removal keying and die-cut white sticker outline generation.
* **Client-Side Storage & Backup:**
  * User-created stickers persist locally via browser storage (`localStorage`).
  * 1-click JSON backup export.
* **Instant Export Toolbar:**
  * Nearest-neighbor crisp upscaling (no blur or anti-aliasing artifacts).
  * Direct clipboard copy support (`ClipboardItem` API).
  * Color palette inspector with 1-click hex code copy.

---

## 2. Architecture & File Hierarchy

```text
pixel-stickers/
├── Dockerfile                   # Multi-stage build with Nginx Alpine runtime
├── docker-compose.yml           # Container orchestration with health check (port 3000)
├── deploy.sh                    # Single-enter test-and-deploy bundle
├── redeploy.sh                  # Zero-friction git pull and redeploy bundle
├── runapp.sh                    # Linux/macOS dev server launcher
├── runapp.bat                   # Native Windows dev server launcher
├── package.json                 # Project manifest (Vite, React 19, Tailwind v4, Lucide)
├── vite.config.ts               # Vite configuration with Tailwind plugin
├── src/
│   ├── main.tsx                 # Application entry point
│   ├── App.tsx                  # Root state coordinator and layout
│   ├── index.css                # Tailwind v4 directives and pixel utilities
│   ├── types/
│   │   └── sticker.types.ts     # Sticker, category, and filter contracts
│   ├── services/
│   │   ├── pixelizer/
│   │   │   ├── pixelizer.types.ts    # Options and result contracts
│   │   │   ├── palette_presets.ts   # Palette color mapping tables
│   │   │   ├── color_quantizer.ts   # Euclidean distance color quantizer
│   │   │   ├── sticker_border.ts    # Die-cut white border outline generator
│   │   │   └── pixelizer.engine.ts  # Canvas pixelation and quantization pipeline
│   │   ├── storage/
│   │   │   └── sticker_storage.service.ts # Local storage persistence & JSON export
│   │   └── export/
│   │       └── sticker_exporter.service.ts # Nearest-neighbor upscaler and clipboard copy
│   ├── data/
│   │   ├── pixel_matrices.ts    # Matrix stamp definitions for default stickers
│   │   └── matrix_renderer.ts   # Canvas renderer for stamp matrices
│   └── components/
│       ├── common/
│       │   ├── Badge.tsx        # Tag and category chip
│       │   └── Toast.tsx        # Action notification toast
│       ├── layout/
│       │   ├── Navbar.tsx       # Header with stats and studio trigger
│       │   └── Footer.tsx       # Footer with offline status indicators
│       ├── gallery/
│       │   ├── StickerCard.tsx  # Individual sticker card with quick actions
│       │   ├── StickerGrid.tsx  # Responsive responsive grid and empty state
│       │   ├── StickerFilter.tsx # Category pills and instant search
│       │   └── StickerDetailModal.tsx # Zoomed inspector, palette chips, and multi-scale export
│       └── studio/
│           ├── StudioDropzone.tsx # Drag & drop uploader with preset samples
│           ├── StudioControls.tsx # Density, palette, and border sliders
│           ├── StudioPreview.tsx  # Live reference vs pixel sticker dual preview
│           └── PixelStudioModal.tsx # Studio coordinator modal
```

---

## 3. Quick Start & Execution

### Development (Local)

```bash
# Windows
runapp.bat

# Linux / macOS
chmod +x runapp.sh && ./runapp.sh
```
Dev server starts at `http://localhost:5173`.

### Production Deployment via Docker

```bash
chmod +x deploy.sh && ./deploy.sh
```
Container runs behind Nginx at `http://localhost:3000`.

---

## License

MIT - Authored by Mahendra Wira Dharma (@mwdhrmaaa)
