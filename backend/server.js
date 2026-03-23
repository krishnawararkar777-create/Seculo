import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { onboard } from './routes/onboard.js';
import { createBot, stopBotRoute, startBotRoute, deleteBotRoute } from './routes/bot.js';
import { getDashboard } from './routes/dashboard.js';
import { checkLicense, localStarted, downloadInstaller, getBotStatus } from './routes/license.js';

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

app.get('/api/license/check', checkLicense);
app.post('/api/bot/local-started', localStarted);
app.get('/api/bot/download-installer', authMiddleware, downloadInstaller);
app.get('/api/bot/status', authMiddleware, getBotStatus);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
