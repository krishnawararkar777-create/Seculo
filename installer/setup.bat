@echo off
title Seculo AI Assistant Setup
color 0A
cls

echo.
echo  ╔═══════════════════════════════════════╗
echo  ║     SECULO AI ASSISTANT SETUP         ║
echo  ║     Setting up your personal AI...    ║
echo  ╚═══════════════════════════════════════╝
echo.

:: Check subscription
echo  Checking your subscription...
curl -s "%%BACKEND_URL%%/api/license/check?userId=%%USER_ID%%&licenseKey=%%LICENSE_KEY%%" -o "%TEMP%\lic.txt"
findstr "true" "%TEMP%\lic.txt" >nul
if errorlevel 1 (
    echo.
    echo  ╔═══════════════════════════════════════╗
    echo  ║  Subscription expired or invalid.     ║
    echo  ║  Please renew at seculo.app           ║
    echo  ╚═══════════════════════════════════════╝
    start "" "%%BACKEND_URL%%/pricing"
    pause
    exit
)
echo  Subscription: ACTIVE ✅
echo.

:: Check Node.js
echo  Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo  Installing Node.js... (this takes 1 minute)
    curl -L -o "%TEMP%\node.msi" "https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi"
    msiexec /i "%TEMP%\node.msi" /quiet /norestart
    set "PATH=%PATH%;C:\Program Files\nodejs"
    echo  Node.js installed ✅
) else (
    echo  Node.js found ✅
)

:: Check Git
echo  Checking Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo  Installing Git... (this takes 1 minute)
    curl -L -o "%TEMP%\git.exe" "https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe"
    "%TEMP%\git.exe" /VERYSILENT /NORESTART
    set "PATH=%PATH%;C:\Program Files\Git\bin"
    echo  Git installed ✅
) else (
    echo  Git found ✅
)

:: Setup OpenClaw
echo.
echo  Setting up AI Assistant...
if exist "%USERPROFILE%\seculo-ai" (
    echo  Updating existing installation...
    cd /d "%USERPROFILE%\seculo-ai"
    git pull >nul 2>&1
) else (
    echo  Downloading AI Assistant...
    cd /d "%USERPROFILE%"
    git clone https://github.com/openclaw/openclaw.git seculo-ai
    cd seculo-ai
)

echo  Installing packages... (2 minutes)
cd /d "%USERPROFILE%\seculo-ai"
call npm install >nul 2>&1
echo  Packages installed ✅

:: Save config
echo GOOGLE_API_KEY=%%GEMINI_KEY%% > .env
echo OPENCLAW_HOME=%USERPROFILE%\seculo-ai >> .env

:: Tell dashboard we are starting
curl -s -X POST "%%BACKEND_URL%%/api/bot/local-started" ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"%%USER_ID%%\",\"status\":\"starting\"}" >nul

echo.
echo  ╔═══════════════════════════════════════╗
echo  ║  Starting your AI Assistant...        ║
echo  ╚═══════════════════════════════════════╝
echo.
echo  A window will open with a QR code.
echo  Scan it with WhatsApp to go LIVE!
echo.

start "Seculo AI" cmd /k "cd /d %USERPROFILE%\seculo-ai && npm start"

timeout /t 8 /nobreak >nul

curl -s -X POST "%%BACKEND_URL%%/api/bot/local-started" ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"%%USER_ID%%\",\"status\":\"running\"}" >nul

echo  ╔═══════════════════════════════════════╗
echo  ║  SETUP COMPLETE! ✅                   ║
echo  ║                                       ║
echo  ║  Check the other window for QR code   ║
echo  ║  Scan it with WhatsApp                ║
echo  ║                                       ║
echo  ║  Keep both windows open!              ║
echo  ╚═══════════════════════════════════════╝
echo.
pause
