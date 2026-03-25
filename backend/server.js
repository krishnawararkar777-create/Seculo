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
