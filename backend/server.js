import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { onboard } from './routes/onboard.js';
import { createBot, stopBotRoute, startBotRoute, deleteBotRoute } from './routes/bot.js';
import { getDashboard } from './routes/dashboard.js';
import { supabaseAdmin } from './services/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.decode(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/onboard', onboard);
app.post('/api/bot/create', createBot);
app.post('/api/bot/stop', stopBotRoute);
app.post('/api/bot/start', startBotRoute);
app.post('/api/bot/delete', deleteBotRoute);
app.get('/api/dashboard/:user_id', getDashboard);

app.get('/api/license/check', async (req, res) => {
  try {
    const { userId, licenseKey } = req.query;

    if (!userId || !licenseKey) {
      return res.status(400).json({ valid: false, reason: 'Missing userId or licenseKey' });
    }

    const { data: user, error } = await supabaseAdmin
      .from('profiles')
      .select('subscription_status, subscription_end_date')
      .eq('id', userId)
      .eq('license_key', licenseKey)
      .single();

    if (error || !user) {
      return res.json({ valid: false, reason: 'Invalid license' });
    }

    if (user.subscription_status === 'cancelled') {
      return res.json({ valid: false, reason: 'Subscription cancelled. Renew at seculo.app' });
    }

    const now = new Date();
    const endDate = new Date(user.subscription_end_date);
    if (endDate < now) {
      return res.json({ valid: false, reason: 'Subscription expired. Renew at seculo.app' });
    }

    res.json({ valid: true, expiresAt: user.subscription_end_date });
  } catch (err) {
    console.error('[/license/check] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/bot/download-installer', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    let userId = 'anonymous';
    let geminiKey = '';
    let licenseKey = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.decode(token);
      userId = decoded?.sub || decoded?.id || 'anonymous';
    }

    if (userId !== 'anonymous') {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('ai_api_key, license_key')
        .eq('id', userId)
        .single();

      if (!profile) {
        return res.status(400).json({ 
          error: 'Please complete onboarding first and add your Gemini API key' 
        });
      }

      geminiKey = profile.ai_api_key || '';
      licenseKey = profile.license_key || '';

      console.log('Profile data:', { 
        hasApiKey: !!geminiKey, 
        hasLicense: !!licenseKey,
        userId 
      });
    }

    const installerPath = path.join(__dirname, '..', 'installer', 'seculo-install.ps1');
    console.log('Looking for installer at:', installerPath);
    if (!fs.existsSync(installerPath)) {
      return res.status(404).json({ error: 'Installer not found' });
    }

    let content = fs.readFileSync(installerPath, 'utf8');
    console.log('geminiKey length:', geminiKey.length);
    console.log('has placeholder:', content.includes('%%GEMINI_KEY%%'));
    content = content.replace(/%%USER_ID%%/g, userId);
    content = content.replace(/%%LICENSE_KEY%%/g, licenseKey);
    content = content.replace(/%%GEMINI_KEY%%/g, geminiKey);
    content = content.replace(/%%BACKEND_URL%%/g, process.env.BACKEND_URL || 'https://your-backend.onrender.com');

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=SeculoSetup.ps1');
    res.send(content);
  } catch (err) {
    console.error('[/bot/download-installer] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/install/:userId/:licenseKey/:geminiKey', async (req, res) => {
  try {
    const { userId, licenseKey, geminiKey } = req.params;
    const installerPath = path.join(__dirname, '..', 'installer', 'setup.bat');
    if (!fs.existsSync(installerPath)) {
      return res.status(404).json({ error: 'Installer not found' });
    }
    let content = fs.readFileSync(installerPath, 'utf8');
    content = content.replace(/%%USER_ID%%/g, userId);
    content = content.replace(/%%LICENSE_KEY%%/g, licenseKey);
    content = content.replace(/%%GEMINI_KEY%%/g, geminiKey);
    content = content.replace(/%%BACKEND_URL%%/g, process.env.BACKEND_URL);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=seculo-setup.bat');
    res.send(content);
  } catch (err) {
    console.error('[/api/install] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/install-page/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('license_key, ai_api_key')
      .eq('id', userId)
      .single();
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    const command = `curl -s "${process.env.BACKEND_URL}/api/install/${userId}/${profile.license_key}/${profile.ai_api_key}" -o "%TEMP%\\seculo-setup.bat" && "%TEMP%\\seculo-setup.bat"`;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Install Seculo AI</title>
  <link href="https://fonts.googleapis.com/css2?family=Geist&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a0a; font-family: 'Geist', sans-serif; color: #fff; min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 60px 20px; }
    .logo { color: #22c55e; font-size: 32px; font-weight: bold; text-align: center; margin-bottom: 10px; }
    .subtitle { color: #fff; font-size: 18px; text-align: center; margin-bottom: 40px; }
    .box { background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 30px; max-width: 700px; width: 100%; }
    .step { margin-bottom: 20px; display: flex; align-items: flex-start; gap: 15px; }
    .step-num { background: #22c55e; color: #000; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
    .step-text { color: #ccc; line-height: 1.6; }
    .cmd-box { background: #111; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 30px 0; display: flex; align-items: center; justify-content: space-between; gap: 15px; }
    .cmd-text { color: #22c55e; font-family: monospace; font-size: 14px; word-break: break-all; flex: 1; }
    .copy-btn { background: #22c55e; color: #000; border: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px; transition: all 0.2s; }
    .copy-btn:hover { background: #16a34a; }
    .warning { color: #f59e0b; text-align: center; margin-top: 20px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="logo">Seculo AI</div>
  <div class="subtitle">Deploy Your AI Assistant</div>
  <div class="box">
    <div class="step"><div class="step-num">1</div><div class="step-text">Press Windows + R on your keyboard</div></div>
    <div class="step"><div class="step-num">2</div><div class="step-text">Type 'cmd' and press Enter</div></div>
    <div class="step"><div class="step-num">3</div><div class="step-text">Copy the command below and paste it in the black window</div></div>
    <div class="step"><div class="step-num">4</div><div class="step-text">Press Enter and wait 5 minutes</div></div>
    <div class="step"><div class="step-num">5</div><div class="step-text">Scan the QR code that appears with WhatsApp</div></div>
  </div>
  <div class="box">
    <div class="cmd-box">
      <div class="cmd-text" id="cmd">${command}</div>
      <button class="copy-btn" id="copybtn" onclick="copyCmd()">Copy</button>
    </div>
    <div class="warning">Keep the black window open while using your assistant</div>
  </div>
  <script>
    function copyCmd() {
      navigator.clipboard.writeText(document.getElementById('cmd').innerText);
      document.getElementById('copybtn').innerText = 'Copied!';
      setTimeout(() => document.getElementById('copybtn').innerText = 'Copy', 2000);
    }
  </script>
</body>
</html>`;
    res.send(html);
  } catch (err) {
    console.error('[/api/install-page] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bot/local-started', async (req, res) => {
  try {
    const { userId, status } = req.body;
    if (!userId || !status) {
      return res.status(400).json({ success: false, error: 'Missing userId or status' });
    }
    await supabaseAdmin
      .from('bots')
      .upsert({ user_id: userId, status, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    res.json({ success: true });
  } catch (err) {
    console.error('[/bot/local-started] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bot/status', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.json({ status: 'not_started' });
    }
    const { data: bot } = await supabaseAdmin
      .from('bots')
      .select('status')
      .eq('user_id', userId)
      .single();
    res.json({ status: bot?.status || 'not_started' });
  } catch (err) {
    console.error('[/bot/status] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
