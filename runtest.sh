#!/usr/bin/env bash
set -euo pipefail

echo "══════════════════════════════════════════════════════════════"
echo "  Running Automated Tests: Pixely                             "
echo "══════════════════════════════════════════════════════════════"

npm run test
echo "[OK] All test suites passed."
