#!/usr/bin/env bash
set -euo pipefail

echo "══════════════════════════════════════════════════════════════"
echo "  Launching Pixel Stickers Dev Server (@mwdhrmaaa)            "
echo "══════════════════════════════════════════════════════════════"

if [ ! -d "node_modules" ]; then
    echo "[*] Installing dependencies..."
    npm install
fi

echo "[*] Starting Vite dev server..."
npm run dev -- --host
