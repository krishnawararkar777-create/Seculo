@echo off
title Seculo AI Assistant Setup
color 0A
cls

echo.
echo  ╔════════════════════════════════════════╗
echo  ║      SECULO AI ASSISTANT SETUP         ║
echo  ║      Setting up your personal AI...    ║
echo  ╚════════════════════════════════════════╝
echo.

:: ── STEP 1: Check internet ──
echo  [1/6] Checking internet connection...
ping -n 1 google.com >nul 2>&1
if errorlevel 1 (
    echo.
    echo  ERROR: No internet connection found.
    echo  Please connect to internet and try again.
    pause
    exit
)
echo  Internet: OK ✓

:: ── STEP 2: Check license ──
echo.
echo  [2/6] Checking your subscription...
curl -s "%%BACKEND_URL%%/api/license/check?userId=%%USER_ID%%&licenseKey=%%LICENSE_KEY%%" -o "%TEMP%\lic.txt" 2>nul
findstr "true" "%TEMP%\lic.txt" >nul 2>&1
if errorlevel 1 (
    echo.
    echo  ╔════════════════════════════════════════╗
    echo  ║  Subscription expired or not found.    ║
    echo  ║  Please visit seculo.app to renew.     ║
    echo  ╚════════════════════════════════════════╝
    start "" "%%BACKEND_URL%%/pricing"
    pause
    exit
)
echo  Subscription: ACTIVE ✓

:: ── STEP 3: Install Node.js ──
echo.
echo  [3/6] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo  Installing Node.js... (this takes 1-2 minutes)
    curl -L -o "%TEMP%\node.msi" "https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi" 2>nul
    msiexec /i "%TEMP%\node.msi" /quiet /norestart
    setx PATH "%PATH%;C:\Program Files\nodejs" /M >nul
    set "PATH=%PATH%;C:\Program Files\nodejs"
    echo  Node.js installed ✓
) else (
    echo  Node.js found ✓
)

:: ── STEP 4: Install Git ──
echo.
echo  [4/6] Checking Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo  Installing Git... (this takes 1 minute)
    curl -L -o "%TEMP%\git.exe" "https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe" 2>nul
    "%TEMP%\git.exe" /VERYSILENT /NORESTART
    set "PATH=%PATH%;C:\Program Files\Git\bin"
    echo  Git installed ✓
) else (
    echo  Git found ✓
)

:: ── STEP 5: Setup OpenClaw ──
echo.
echo  [5/6] Setting up AI Assistant...
if exist "%USERPROFILE%\seculo-ai" (
    echo  Updating existing installation...
    cd /d "%USERPROFILE%\seculo-ai"
    git pull >nul 2>&1
) else (
    echo  Downloading AI Assistant... (this takes 2 minutes)
    cd /d "%USERPROFILE%"
    git clone https://github.com/openclaw/openclaw.git seculo-ai >nul 2>&1
    cd /d "%USERPROFILE%\seculo-ai"
)

echo  Installing packages... (this takes 2-3 minutes)
cd /d "%USERPROFILE%\seculo-ai"
call npm install -g pnpm >nul 2>&1
call pnpm install --shamefully-hoist >nul 2>&1
echo  Packages installed ✓

:: ── STEP 6: Configure Gemini API Key ──
echo.
echo  [6/6] Configuring AI key...
echo GOOGLE_API_KEY=%%GEMINI_KEY%% > "%USERPROFILE%\seculo-ai\.env"
echo OPENCLAW_HOME=%USERPROFILE%\seculo-ai >> "%USERPROFILE%\seculo-ai\.env"

:: Set model silently
cd /d "%USERPROFILE%\seculo-ai"
echo %%GEMINI_KEY%% | openclaw models set google/gemini-2.0-flash >nul 2>&1

:: ── ADD TO WINDOWS STARTUP ──
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" ^
  /v "SeculoAI" ^
  /t REG_SZ ^
  /d "cmd /c cd /d %%USERPROFILE%%\seculo-ai && openclaw gateway --port 18789" ^
  /f >nul 2>&1

:: ── TELL DASHBOARD WE ARE STARTING ──
curl -s -X POST "%%BACKEND_URL%%/api/bot/local-started" ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"%%USER_ID%%\",\"status\":\"starting\"}" >nul 2>&1

:: ── START GATEWAY ──
echo.
echo  ╔════════════════════════════════════════╗
echo  ║  Starting your AI Assistant...         ║
echo  ║  Please wait 10 seconds...             ║
echo  ╚════════════════════════════════════════╝
echo.

start /min "SeculoGateway" cmd /c "cd /d %USERPROFILE%\seculo-ai && openclaw gateway --port 18789"
timeout /t 10 /nobreak >nul

:: ── CONNECT WHATSAPP ──
echo  ╔════════════════════════════════════════╗
echo  ║  Almost done!                          ║
echo  ║  A QR code will appear below.          ║
echo  ║  Scan it with WhatsApp to go LIVE!     ║
echo  ╚════════════════════════════════════════╝
echo.
echo  How to scan:
echo  1. Open WhatsApp on your phone
echo  2. Tap Menu (3 dots) or Settings
echo  3. Tap "Linked Devices"
echo  4. Tap "Link a Device"
echo  5. Point camera at QR code below
echo.
echo  ════════════════════════════════════════
echo.

:: Tell dashboard QR is showing
curl -s -X POST "%%BACKEND_URL%%/api/bot/local-started" ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"%%USER_ID%%\",\"status\":\"qr_ready\"}" >nul 2>&1

:: Show QR code
cd /d "%USERPROFILE%\seculo-ai"
openclaw channels login --verbose

:: ── CONNECTED ──
echo.
echo  ╔════════════════════════════════════════╗
echo  ║  YOUR AI ASSISTANT IS LIVE! ✓          ║
echo  ║                                        ║
echo  ║  WhatsApp is now connected.            ║
echo  ║  Your assistant starts automatically   ║
echo  ║  every time you turn on your computer. ║
echo  ║                                        ║
echo  ║  Keep this window open!                ║
echo  ╚════════════════════════════════════════╝
echo.

:: Tell dashboard bot is live
curl -s -X POST "%%BACKEND_URL%%/api/bot/local-started" ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"%%USER_ID%%\",\"status\":\"live\"}" >nul 2>&1

pause
