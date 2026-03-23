import { supabaseAdmin } from '../services/supabase.js';
import fs from 'fs';
import path from 'path';

export async function checkLicense(req, res) {
  try {
    const { userId, licenseKey } = req.query;

    if (!userId || !licenseKey) {
      return res.status(400).json({ valid: false, reason: 'Missing userId or licenseKey' });
    }

    const { data: user, error } = await supabaseAdmin
      .from('profiles')
      .select('subscription_status, subscription_end_date, license_key')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.json({ valid: false, reason: 'User not found' });
    }

    if (user.license_key !== licenseKey) {
      return res.json({ valid: false, reason: 'Invalid license' });
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
}

export async function localStarted(req, res) {
  try {
    const { userId, status } = req.body;

    if (!userId || !status) {
      return res.status(400).json({ success: false, error: 'Missing userId or status' });
    }

    await supabaseAdmin
      .from('bots')
      .upsert({
        user_id: userId,
        status: status,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    res.json({ success: true });
  } catch (err) {
    console.error('[/bot/local-started] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}

export async function downloadInstaller(req, res) {
  try {
    const userId = req.user?.id || req.user?.sub;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: user, error } = await supabaseAdmin
      .from('profiles')
      .select('ai_api_key, license_key')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const installerPath = path.join('installer', 'setup.bat');

    if (!fs.existsSync(installerPath)) {
      return res.status(404).json({ error: 'Installer not found' });
    }

    let content = fs.readFileSync(installerPath, 'utf8');

    content = content.replace(/%%USER_ID%%/g, userId);
    content = content.replace(/%%LICENSE_KEY%%/g, user.license_key || '');
    content = content.replace(/%%GEMINI_KEY%%/g, user.ai_api_key || '');
    content = content.replace(/%%BACKEND_URL%%/g, process.env.BACKEND_URL || '');

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=seculo-setup.bat');
    res.send(content);
  } catch (err) {
    console.error('[/bot/download-installer] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}

export async function getBotStatus(req, res) {
  try {
    const userId = req.user?.id || req.user?.sub;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: bot, error } = await supabaseAdmin
      .from('bots')
      .select('status, updated_at')
      .eq('user_id', userId)
      .single();

    if (error || !bot) {
      return res.json({ status: 'not_started' });
    }

    res.json({ status: bot.status, updatedAt: bot.updated_at });
  } catch (err) {
    console.error('[/bot/status] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
