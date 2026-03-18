import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, 'config.json'), 'utf-8'));

console.log('Bot started with config:', config);
console.log('Gemini API Key:', config.gemini_api_key ? 'Loaded' : 'Missing');

async function initializeBot() {
  console.log(`Initializing bot for WhatsApp: ${config.whatsapp_number || 'not set'}`);
  
  setInterval(() => {
    console.log(`Bot running... (using ${config.model})`);
  }, 60000);
}

initializeBot().catch(console.error);
