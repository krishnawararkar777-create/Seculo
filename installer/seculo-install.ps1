Set-ExecutionPolicy Bypass -Scope Process -Force
# Seculo AI Assistant Installer
# Run as Administrator

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# ── CREATE BEAUTIFUL WINDOW ──
$form = New-Object System.Windows.Forms.Form
$form.Text = "Seculo AI Assistant Setup"
$form.Size = New-Object System.Drawing.Size(500, 400)
$form.StartPosition = "CenterScreen"
$form.BackColor = [System.Drawing.Color]::FromArgb(15, 15, 15)
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false

# Logo text
$logo = New-Object System.Windows.Forms.Label
$logo.Text = "SECULO AI"
$logo.Font = New-Object System.Drawing.Font("Arial", 24, [System.Drawing.FontStyle]::Bold)
$logo.ForeColor = [System.Drawing.Color]::FromArgb(34, 197, 94)
$logo.Size = New-Object System.Drawing.Size(460, 50)
$logo.Location = New-Object System.Drawing.Point(20, 20)
$logo.TextAlign = "MiddleCenter"
$form.Controls.Add($logo)

# Subtitle
$subtitle = New-Object System.Windows.Forms.Label
$subtitle.Text = "Your Personal AI Assistant"
$subtitle.Font = New-Object System.Drawing.Font("Arial", 10)
$subtitle.ForeColor = [System.Drawing.Color]::FromArgb(150, 150, 150)
$subtitle.Size = New-Object System.Drawing.Size(460, 25)
$subtitle.Location = New-Object System.Drawing.Point(20, 70)
$subtitle.TextAlign = "MiddleCenter"
$form.Controls.Add($subtitle)

# Status label
$status = New-Object System.Windows.Forms.Label
$status.Text = "Preparing installation..."
$status.Font = New-Object System.Drawing.Font("Arial", 10)
$status.ForeColor = [System.Drawing.Color]::White
$status.Size = New-Object System.Drawing.Size(460, 30)
$status.Location = New-Object System.Drawing.Point(20, 120)
$status.TextAlign = "MiddleCenter"
$form.Controls.Add($status)

# Progress bar
$progress = New-Object System.Windows.Forms.ProgressBar
$progress.Size = New-Object System.Drawing.Size(440, 25)
$progress.Location = New-Object System.Drawing.Point(20, 160)
$progress.Minimum = 0
$progress.Maximum = 100
$progress.Value = 0
$progress.Style = "Continuous"
$form.Controls.Add($progress)

# Steps label
$steps = New-Object System.Windows.Forms.Label
$steps.Text = ""
$steps.Font = New-Object System.Drawing.Font("Arial", 9)
$steps.ForeColor = [System.Drawing.Color]::FromArgb(100, 100, 100)
$steps.Size = New-Object System.Drawing.Size(460, 120)
$steps.Location = New-Object System.Drawing.Point(20, 200)
$steps.TextAlign = "TopLeft"
$form.Controls.Add($steps)

# Show form without blocking
$form.Show()
$form.Refresh()

function Update-Status($message, $progressValue, $stepText) {
    $status.Text = $message
    $progress.Value = $progressValue
    $steps.Text = $stepText
    $form.Refresh()
    Start-Sleep -Milliseconds 500
}

# ── STEP 1: CHECK INTERNET ──
Update-Status "Checking internet connection..." 5 "Step 1 of 6: Verifying connection"
$internet = Test-Connection google.com -Count 1 -Quiet
if (-not $internet) {
    [System.Windows.Forms.MessageBox]::Show(
        "No internet connection found.`nPlease connect to internet and try again.",
        "Seculo Setup", "OK", "Error"
    )
    $form.Close()
    exit
}

# ── STEP 2: CHECK LICENSE ──
Update-Status "Checking your subscription..." 10 "Step 2 of 6: Verifying license"
try {
    $licenseUrl = "%%BACKEND_URL%%/api/license/check?userId=%%USER_ID%%&licenseKey=%%LICENSE_KEY%%"
    $licenseResponse = Invoke-RestMethod -Uri $licenseUrl -Method Get
    if (-not $licenseResponse.valid) {
        [System.Windows.Forms.MessageBox]::Show(
            "Subscription expired or not found.`nPlease visit seculo.app to renew.",
            "Seculo Setup", "OK", "Warning"
        )
        Start-Process "%%BACKEND_URL%%/pricing"
        $form.Close()
        exit
    }
} catch {
    # Continue if license check fails
}

# ── STEP 3: INSTALL NODE.JS ──
Update-Status "Checking Node.js..." 20 "Step 3 of 6: Installing dependencies"
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCheck) {
    Update-Status "Installing Node.js... (1-2 minutes)" 25 "Step 3 of 6: Downloading Node.js`nThis may take 1-2 minutes..."
    $nodeUrl = "https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi"
    $nodePath = "$env:TEMP\node.msi"
    Invoke-WebRequest -Uri $nodeUrl -OutFile $nodePath
    Start-Process msiexec.exe -ArgumentList "/i "$nodePath" /quiet /norestart" -Wait
    $env:PATH += ";C:\Program Files\nodejs"
    Update-Status "Node.js installed!" 35 "Step 3 of 6: Node.js installed ✓"
} else {
    Update-Status "Node.js found!" 35 "Step 3 of 6: Node.js already installed ✓"
}

# ── STEP 4: INSTALL GIT ──
Update-Status "Checking Git..." 40 "Step 4 of 6: Checking Git"
$gitCheck = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitCheck) {
    Update-Status "Installing Git... (1 minute)" 42 "Step 4 of 6: Downloading Git..."
    $gitUrl = "https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe"
    $gitPath = "$env:TEMP\git.exe"
    Invoke-WebRequest -Uri $gitUrl -OutFile $gitPath
    Start-Process $gitPath -ArgumentList "/VERYSILENT /NORESTART" -Wait
    $env:PATH += ";C:\Program Files\Git\bin"
    Update-Status "Git installed!" 50 "Step 4 of 6: Git installed ✓"
} else {
    Update-Status "Git found!" 50 "Step 4 of 6: Git already installed ✓"
}

# ── STEP 5: DOWNLOAD OPENCLAW ──
Update-Status "Downloading AI Assistant..." 55 "Step 5 of 6: Setting up OpenClaw`nThis takes 2-3 minutes..."
$installDir = "$env:USERPROFILE\seculo-ai"

if (Test-Path $installDir) {
    Update-Status "Updating AI Assistant..." 60 "Step 5 of 6: Updating existing installation..."
    Set-Location $installDir
    & git pull 2>$null
} else {
    Update-Status "Downloading AI Assistant..." 60 "Step 5 of 6: Downloading OpenClaw from GitHub..."
    Set-Location $env:USERPROFILE
    & git clone "https://github.com/openclaw/openclaw.git" "seculo-ai" 2>$null
    Set-Location $installDir
}

# ── INSTALL PACKAGES ──
Update-Status "Installing packages... (2-3 minutes)" 65 "Step 5 of 6: Installing dependencies`nPlease wait..."
Set-Location $installDir
& npm install -g pnpm 2>$null
& pnpm install --shamefully-hoist 2>$null
Update-Status "Packages installed!" 75 "Step 5 of 6: All packages installed ✓"

# ── STEP 6: CONFIGURE ──
Update-Status "Configuring your AI key..." 80 "Step 6 of 6: Setting up Gemini AI"
$envContent = "GOOGLE_API_KEY=%%GEMINI_KEY%%`nOPENCLAW_HOME=$installDir"
Set-Content -Path "$installDir\.env" -Value $envContent

# Set model
Set-Location $installDir
"%%GEMINI_KEY%%" | & openclaw models set google/gemini-2.0-flash 2>$null

# ── ADD TO WINDOWS STARTUP ──
$startupCommand = "cmd /c cd /d $installDir && openclaw gateway --port 18789"
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" `
    -Name "SeculoAI" -Value $startupCommand

# ── TELL DASHBOARD ──
try {
    $body = @{userId="%%USER_ID%%"; status="starting"} | ConvertTo-Json
    Invoke-RestMethod -Uri "%%BACKEND_URL%%/api/bot/local-started" `
        -Method Post -Body $body -ContentType "application/json"
} catch {}

Update-Status "Starting your AI Assistant..." 85 "Step 6 of 6: Starting gateway..."

# ── START GATEWAY ──
Start-Process -FilePath "cmd" `
    -ArgumentList "/c cd /d "$installDir" && openclaw gateway --port 18789" `
    -WindowStyle Minimized

Start-Sleep -Seconds 10

Update-Status "Almost done! Connecting WhatsApp..." 90 "Step 6 of 6: Connecting to WhatsApp..."

# ── SHOW QR CODE ──
$status.Text = "Scan the QR code to go LIVE!"
$status.ForeColor = [System.Drawing.Color]::FromArgb(34, 197, 94)
$progress.Value = 95
$steps.Text = "A QR code window will open.`n`nHow to scan:`n1. Open WhatsApp on your phone`n2. Tap Menu → Linked Devices`n3. Tap Link a Device`n4. Scan the QR code"
$form.Refresh()

# Open QR in new window
Start-Process -FilePath "cmd" `
    -ArgumentList "/c cd /d "$installDir" && openclaw channels login --verbose" `
    -WindowStyle Normal

Start-Sleep -Seconds 3

# ── DONE ──
$progress.Value = 100
$status.Text = "Setup Complete!"
$status.ForeColor = [System.Drawing.Color]::FromArgb(34, 197, 94)
$steps.Text = "✓ AI Assistant installed`n✓ Starts automatically on computer startup`n✓ Scan the QR code in the other window`n`nKeep both windows open!"

try {
    $body = @{userId="%%USER_ID%%"; status="qr_ready"} | ConvertTo-Json
    Invoke-RestMethod -Uri "%%BACKEND_URL%%/api/bot/local-started" `
        -Method Post -Body $body -ContentType "application/json"
} catch {}

[System.Windows.Forms.MessageBox]::Show(
    "Setup complete!`n`nPlease scan the QR code in the terminal window with WhatsApp to activate your AI Assistant.",
    "Seculo Setup Complete", "OK", "Information"
)

$form.Close()
