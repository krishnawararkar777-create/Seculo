Set-ExecutionPolicy Bypass -Scope Process -Force

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$form = New-Object System.Windows.Forms.Form
$form.Text = "Seculo AI Assistant Setup"
$form.Size = New-Object System.Drawing.Size(500, 350)
$form.StartPosition = "CenterScreen"
$form.BackColor = [System.Drawing.Color]::FromArgb(15, 15, 15)

$logo = New-Object System.Windows.Forms.Label
$logo.Text = "SECULO AI ASSISTANT"
$logo.Font = New-Object System.Drawing.Font("Arial", 18, [System.Drawing.FontStyle]::Bold)
$logo.ForeColor = [System.Drawing.Color]::FromArgb(34, 197, 94)
$logo.Size = New-Object System.Drawing.Size(460, 40)
$logo.Location = New-Object System.Drawing.Point(20, 20)
$logo.TextAlign = "MiddleCenter"
$form.Controls.Add($logo)

$status = New-Object System.Windows.Forms.Label
$status.Text = "Preparing..."
$status.Font = New-Object System.Drawing.Font("Arial", 10)
$status.ForeColor = [System.Drawing.Color]::White
$status.Size = New-Object System.Drawing.Size(460, 25)
$status.Location = New-Object System.Drawing.Point(20, 80)
$status.TextAlign = "MiddleCenter"
$form.Controls.Add($status)

$progress = New-Object System.Windows.Forms.ProgressBar
$progress.Size = New-Object System.Drawing.Size(440, 20)
$progress.Location = New-Object System.Drawing.Point(20, 115)
$progress.Minimum = 0
$progress.Maximum = 100
$progress.Value = 0
$form.Controls.Add($progress)

$details = New-Object System.Windows.Forms.Label
$details.Text = ""
$details.Font = New-Object System.Drawing.Font("Arial", 9)
$details.ForeColor = [System.Drawing.Color]::FromArgb(150, 150, 150)
$details.Size = New-Object System.Drawing.Size(460, 150)
$details.Location = New-Object System.Drawing.Point(20, 150)
$form.Controls.Add($details)

$form.Show()
$form.Refresh()

function UpdateUI($msg, $pct, $det) {
    $status.Text = $msg
    $progress.Value = $pct
    $details.Text = $det
    $form.Refresh()
    Start-Sleep -Milliseconds 300
}

# STEP 1 - Check internet
UpdateUI "Checking internet..." 5 "Verifying your connection..."
$net = Test-Connection google.com -Count 1 -Quiet 2>$null
if (-not $net) {
    [System.Windows.Forms.MessageBox]::Show("No internet. Please connect and try again.", "Error")
    $form.Close(); exit
}

# STEP 2 - Check license
UpdateUI "Checking subscription..." 10 "Verifying your license..."
$backendUrl = "%%BACKEND_URL%%"
$userId = "%%USER_ID%%"
$licenseKey = "%%LICENSE_KEY%%"
$geminiKey = "%%GEMINI_KEY%%"

try {
    $url = "$backendUrl/api/license/check?userId=$userId&licenseKey=$licenseKey"
    $lic = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 10
    if (-not $lic.valid) {
        [System.Windows.Forms.MessageBox]::Show("Subscription expired. Visit seculo.app to renew.", "Expired")
        Start-Process "$backendUrl/pricing"
        $form.Close(); exit
    }
} catch {
    # Continue if check fails
}

# STEP 3 - Node.js
UpdateUI "Checking Node.js..." 20 "Looking for Node.js..."
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    UpdateUI "Installing Node.js..." 25 "Downloading Node.js (1-2 mins)..."
    $nodeMsi = "$env:TEMP\node.msi"
    Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi" -OutFile $nodeMsi
    Start-Process msiexec.exe -ArgumentList "/i "$nodeMsi" /quiet /norestart" -Wait
    $env:PATH = $env:PATH + ";C:\Program Files\nodejs"
}
UpdateUI "Node.js ready" 35 "Node.js installed successfully"

# STEP 4 - Git
UpdateUI "Checking Git..." 40 "Looking for Git..."
$git = Get-Command git -ErrorAction SilentlyContinue
if (-not $git) {
    UpdateUI "Installing Git..." 42 "Downloading Git (1 min)..."
    $gitExe = "$env:TEMP\git.exe"
    Invoke-WebRequest -Uri "https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe" -OutFile $gitExe
    Start-Process $gitExe -ArgumentList "/VERYSILENT /NORESTART" -Wait
    $env:PATH = $env:PATH + ";C:\Program Files\Git\bin"
}
UpdateUI "Git ready" 50 "Git installed successfully"

# STEP 5 - OpenClaw
$installDir = "$env:USERPROFILE\seculo-ai"
UpdateUI "Setting up AI..." 55 "Downloading OpenClaw from GitHub..."

if (Test-Path $installDir) {
    Set-Location $installDir
    & git pull 2>$null
} else {
    Set-Location $env:USERPROFILE
    & git clone "https://github.com/openclaw/openclaw.git" "seculo-ai" 2>$null
}

Set-Location $installDir
UpdateUI "Installing packages..." 65 "This takes 2-3 minutes. Please wait..."
& npm install -g pnpm 2>$null
& pnpm install --shamefully-hoist 2>$null
UpdateUI "Packages done" 75 "All packages installed"

# STEP 6 - Configure
UpdateUI "Configuring..." 80 "Setting up your Gemini AI key..."
$env1 = "GOOGLE_API_KEY=" + $geminiKey
$env2 = "OPENCLAW_HOME=" + $installDir
$envContent = $env1 + "`n" + $env2
Set-Content -Path "$installDir\.env" -Value $envContent

Set-Location $installDir
echo $geminiKey | & openclaw models set google/gemini-2.0-flash 2>$null

# Add to startup
$startCmd = "cmd /c "cd /d $installDir && openclaw gateway --port 18789""
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "SeculoAI" -Value $startCmd -ErrorAction SilentlyContinue

# Notify dashboard
try {
    $body = '{"userId":"' + $userId + '","status":"starting"}'
    Invoke-RestMethod -Uri "$backendUrl/api/bot/local-started" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 5 2>$null
} catch {}

# STEP 7 - Start gateway
UpdateUI "Starting gateway..." 85 "Starting OpenClaw gateway..."
Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d "$installDir" && openclaw gateway --port 18789" -WindowStyle Minimized
Start-Sleep -Seconds 10

# STEP 8 - Connect WhatsApp
UpdateUI "Scan QR Code!" 95 "A QR code window will open.`nOpen WhatsApp > Linked Devices > Scan QR"
$status.ForeColor = [System.Drawing.Color]::FromArgb(34, 197, 94)
$form.Refresh()

Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d "$installDir" && openclaw channels login --verbose" -WindowStyle Normal

Start-Sleep -Seconds 3

try {
    $body2 = '{"userId":"' + $userId + '","status":"qr_ready"}'
    Invoke-RestMethod -Uri "$backendUrl/api/bot/local-started" -Method Post -Body $body2 -ContentType "application/json" -TimeoutSec 5 2>$null
} catch {}

$progress.Value = 100
$status.Text = "Setup Complete!"
$details.Text = "Scan the QR code in the other window with WhatsApp!`n`nKeep both windows open."

[System.Windows.Forms.MessageBox]::Show("Setup complete!`nScan the QR code in the terminal window with WhatsApp.", "Done!")
$form.Close()
