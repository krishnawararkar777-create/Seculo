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

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/onboard', onboard);
app.post('/bot/create', createBot);
app.post('/bot/stop', stopBotRoute);
app.post('/bot/start', startBotRoute);
app.post('/bot/delete', deleteBotRoute);
app.get('/dashboard/:user_id', getDashboard);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
