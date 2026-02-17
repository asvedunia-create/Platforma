#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "====================================="
echo "       GRC Lite One-Click Start      "
echo "====================================="
echo

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] Node.js 20+ is not installed."
  read -r -p "Press Enter to close..." _
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "[ERROR] Docker is not installed."
  read -r -p "Press Enter to close..." _
  exit 1
fi

echo "[INFO] Starting bootstrap script..."
if ! node scripts/start-icon.mjs; then
  echo
  echo "[ERROR] Startup failed. Check logs above."
  read -r -p "Press Enter to close..." _
  exit 1
fi

echo
echo "[INFO] GRC Lite is running at http://localhost:3000"
echo "Keep this terminal open while using the app."
read -r -p "Press Enter to close..." _
