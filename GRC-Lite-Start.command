#!/bin/bash
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 20+ is not installed."
  read -r -p "Press Enter to close..." _
  exit 1
fi
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed."
  read -r -p "Press Enter to close..." _
  exit 1
fi

echo "Starting GRC Lite..."
npm run start:icon
