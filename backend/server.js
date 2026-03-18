import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { onboard } from './routes/onboard.js';
import { createBot, stopBotRoute, startBotRoute, deleteBotRoute } from './routes/bot.js';
import { getDashboard } from './routes/dashboard.js';

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/onboard', onboard);
app.post('/api/bot/create', createBot);
app.post('/api/bot/stop', stopBotRoute);
app.post('/api/bot/start', startBotRoute);
app.post('/api/bot/delete', deleteBotRoute);
app.get('/api/dashboard/:user_id', getDashboard);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
