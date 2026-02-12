@echo off
cd /d "%~dp0"
where node >nul 2>nul || (
  echo Node.js is not installed. Please install Node.js 20+ first.
  pause
  exit /b 1
)
where docker >nul 2>nul || (
  echo Docker is not installed. Please install Docker Desktop first.
  pause
  exit /b 1
)

echo Starting GRC Lite...
npm run start:icon
if errorlevel 1 (
  echo.
  echo Startup failed. Check logs above.
  pause
  exit /b 1
)
