import express from 'express';
import { createClient } from '@supabase/supabase-js';
import qrcode from 'qrcode';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const activeSessions = new Map();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

app.use(express.json());

app.use((req, res, next) => {
  if (req.method === 'GET' && req.path === '/health') {
    return next();
  }
  const secret = req.headers['x-secret'];
  if (secret !== process.env.INTERNAL_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

app.get('/health', (req, res) => {
  res.json({ ok: true, activeUsers: activeSessions.size });
});

app.post('/deploy', async (req, res) => {
  try {
    const { userId, aiApiKey, aiProvider } = req.body;

    if (!userId || !aiApiKey || !aiProvider) {
      return res.status(400).json({ error: 'Missing required fields: userId, aiApiKey, aiProvider' });
    }

    if (activeSessions.has(userId)) {
      return res.status(400).json({ error: 'already running' });
    }

    console.log(`[${userId}] Deploy called for provider: ${aiProvider}`);

    await supabase
      .from('bots')
      .update({ status: 'connecting', updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    startOpenClaw(userId, aiApiKey, aiProvider);

    res.json({ success: true });
  } catch (err) {
    console.error('[/deploy] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/status/:userId', (req, res) => {
  const { userId } = req.params;
  const session = activeSessions.get(userId);

  if (!session) {
    return res.json({ status: 'stopped', qrCode: null });
  }

  res.json({ status: session.status, qrCode: session.qrCode });
});

app.post('/stop', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const session = activeSessions.get(userId);

    if (session?.process) {
      console.log(`[${userId}] Stopping bot...`);
      session.process.kill();
    }

    activeSessions.delete(userId);

    await supabase
      .from('bots')
      .update({ status: 'stopped', qr_code: null, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    console.log(`[${userId}] Bot stopped`);
    res.json({ success: true });
  } catch (err) {
    console.error('[/stop] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

async function startOpenClaw(userId, aiApiKey, aiProvider) {
  try {
    const configDir = `/tmp/openclaw_${userId}`;
    const configPath = path.join(configDir, 'openclaw.json');

    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    let configContent;
    if (aiProvider === 'gemini') {
      configContent = {
        agent: { model: 'google/gemini-pro' },
        channels: { whatsapp: { enabled: true } }
      };
    } else {
      configContent = {
        agent: { model: 'anthropic/claude-opus-4-6' },
        channels: { whatsapp: { enabled: true } }
      };
    }

    fs.writeFileSync(configPath, JSON.stringify(configContent, null, 2));
    console.log(`[${userId}] Config written to ${configPath}`);

    const envKey = aiProvider === 'gemini' ? 'GOOGLE_API_KEY' : 'ANTHROPIC_API_KEY';
    const childEnv = {
      ...process.env,
      HOME: configDir,
      OPENCLAW_HOME: configDir,
      [envKey]: aiApiKey,
    };

    const childProcess = spawn('npx', [
      'openclaw@latest',
      'gateway',
      '--headless',
      '--config',
      configPath,
    ], { env: childEnv, stdio: 'pipe' });

    activeSessions.set(userId, {
      process: childProcess,
      status: 'connecting',
      qrCode: null,
      phoneNumber: null,
    });

    console.log(`[${userId}] OpenClaw process started with ${aiProvider}`);

    childProcess.stdout.on('data', async (data) => {
      const output = data.toString();
      console.log(`[${userId}] ${output.trim()}`);

      const hasQR = output.includes('qr') || output.includes('QR') ||
        output.includes('data:image') || (output.length > 50 && /\/[0-9A-Za-z+=\n]+={0,2}/.test(output));

      if (hasQR) {
        const qrMatch = output.match(/data:image[^'"\s]+|([A-Za-z0-9+/=]{20,})/);
        if (qrMatch) {
          const qrData = qrMatch[0];
          try {
            const dataUrl = await qrcode.toDataURL(qrData);
            if (activeSessions.has(userId)) {
              activeSessions.get(userId).qrCode = dataUrl;
              activeSessions.get(userId).status = 'qr_ready';

              await supabase
                .from('bots')
                .update({
                  status: 'qr_ready',
                  qr_code: dataUrl,
                  updated_at: new Date().toISOString()
                })
                .eq('user_id', userId);

              console.log(`[${userId}] QR code ready`);
            }
          } catch (qrErr) {
            console.error(`[${userId}] QR generation error:`, qrErr.message);
          }
        }
      }

      const isLive = output.includes('connected') || output.includes('ready') ||
        output.includes('WhatsApp connected');
      if (isLive && activeSessions.has(userId)) {
        activeSessions.get(userId).status = 'live';
        activeSessions.get(userId).qrCode = null;

        await supabase
          .from('bots')
          .update({
            status: 'live',
            qr_code: null,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        console.log(`[${userId}] Bot is LIVE`);
      }
    });

    childProcess.stderr.on('data', (data) => {
      console.error(`[${userId}-err] ${data.toString().trim()}`);
    });

    childProcess.on('exit', async (code) => {
      console.log(`[${userId}] Process exited with code ${code}`);
      activeSessions.delete(userId);

      await supabase
        .from('bots')
        .update({ status: 'stopped', qr_code: null, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      console.log(`[${userId}] Bot stopped and removed from sessions`);
    });

    childProcess.on('error', async (err) => {
      console.error(`[${userId}] Process error:`, err.message);
      activeSessions.delete(userId);

      await supabase
        .from('bots')
        .update({ status: 'stopped', qr_code: null, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
    });
  } catch (err) {
    console.error(`[${userId}] startOpenClaw error:`, err.message);
    activeSessions.delete(userId);
  }
}

app.listen(PORT, () => {
  console.log(`Bot manager running on port ${PORT}`);
  console.log(`Active sessions: ${activeSessions.size}`);
});
