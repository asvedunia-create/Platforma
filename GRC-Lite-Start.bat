@echo off
setlocal
cd /d "%~dp0"
title GRC Lite - One Click Start

echo =====================================
echo         GRC Lite One-Click Start
echo =====================================
echo.

where node >nul 2>nul || (
  echo [ERROR] Node.js is not installed.
  echo Install Node.js 20+ and run this file again.
  pause
  exit /b 1
)

where docker >nul 2>nul || (
  echo [ERROR] Docker is not installed.
  echo Install Docker Desktop and make sure it is running.
  pause
  exit /b 1
)

echo [INFO] Starting bootstrap script...
node scripts\start-icon.mjs
if errorlevel 1 (
  echo.
  echo [ERROR] Startup failed.
  echo Check logs above, then retry.
  pause
  exit /b 1
)

echo.
echo [INFO] GRC Lite is running at http://localhost:3000
echo Keep this window open while using the app.
pause
