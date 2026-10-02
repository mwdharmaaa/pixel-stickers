#!/usr/bin/env bash
set -euo pipefail

echo "══════════════════════════════════════════════════════════════"
echo "  Running Automated Tests: Pixel Stickers Vault               "
echo "══════════════════════════════════════════════════════════════"

npm run test
echo "[OK] All test suites passed."
