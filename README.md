# Pixely - Cute Pixel Stickers & Studio (@mwdhrmaaa)

A lightweight, serverless web application showcasing curated retro pixel art stickers, an in-browser real-time pixelizer studio to convert reference images into pixel stickers, and local persistence. 100% private, offline-ready, and zero server costs.

---

## 1. Key Capabilities

* **Curated 8-Bit Sticker Vault:** Hand-crafted, crisp pixel stickers across 6 categories (Animals, Food & Sweets, Retro Gaming, Nature, Fantasy, Custom) plus Favorites bookmarking with multi-format downloads (PNG, WebP, SVG).
* **In-Browser Pixelizer Studio & Canvas Editor:**
  * Real-time canvas engine converting any reference photo or illustration into pixel stickers.
  * Interactive Pixel Canvas Editor with pencil, eraser, pipette color picker, bucket fill, undo/redo, and grid overlay.
  * Direct retouch workflow: seamlessly load auto-generated pixel stickers into the canvas to clean up stray pixels before saving.
  * Configurable pixel density (12px to 128px HD) and aspect ratio controls (Auto, 1:1, 4:3, 3:4, 16:9).
  * 6 Retro Palette Presets: Original True Colors (default), Sweet Pastel, PICO-8 16, Game Boy 4-shade, Cyberpunk Neon, and Warm Sunset.
  * Automatic background removal keying and die-cut white sticker outline generation.
* **Client-Side Storage & Favorites:**
  * User-created stickers persist locally via browser storage (`localStorage`).
  * 1-click JSON backup export and local favorites bookmarking.
* **Multi-Format Export Toolbar:**
  * Infinite-scale Scalable Vector Graphics (`.svg`) rendering crisp `<rect>` elements for Figma/Illustrator.
  * Nearest-neighbor crisp upscaling PNG (1x to 8x) and lightweight WebP export.
  * Direct clipboard copy support (`ClipboardItem` API).
  * Color palette inspector with 1-click hex code copy.

---

## 2. Architecture & File Hierarchy

```text
pixely/
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
