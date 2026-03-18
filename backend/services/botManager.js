import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);
const botsDir = process.env.BOTS_DIRECTORY || './bots';
const templateDir = path.join(botsDir, '../bots-template');

export async function createBotFolder(userId, geminiApiKey) {
  const userBotDir = path.join(botsDir, userId);
  
  if (fs.existsSync(userBotDir)) {
    throw new Error(`Bot folder already exists for user ${userId}`);
  }

  fs.mkdirSync(userBotDir, { recursive: true });

  const templateFiles = ['config.json', 'bot.js', 'package.json'];
  
  for (const file of templateFiles) {
    const srcPath = path.join(templateDir, file);
    if (fs.existsSync(srcPath)) {
      let content = fs.readFileSync(srcPath, 'utf-8');
      
      if (file === 'config.json') {
        content = content.replace('{{GEMINI_API_KEY}}', geminiApiKey);
      }
      
      fs.writeFileSync(path.join(userBotDir, file), content);
    }
  }

  return userBotDir;
}

export async function installBotDependencies(userId) {
  const userBotDir = path.join(botsDir, userId);
  
  try {
    await execAsync('npm install', { cwd: userBotDir });
    return true;
  } catch (error) {
    console.error('Failed to install dependencies:', error);
    throw error;
  }
}

export async function startBot(userId) {
  const userBotDir = path.join(botsDir, userId);
  const pm2Name = `bot-${userId}`;
  
  try {
    await execAsync(`pm2 start bot.js --name "${pm2Name}"`, { cwd: userBotDir });
    return true;
  } catch (error) {
    console.error('Failed to start bot:', error);
    throw error;
  }
}

export async function stopBot(userId) {
  const pm2Name = `bot-${userId}`;
  
  try {
    await execAsync(`pm2 stop "${pm2Name}"`);
    return true;
  } catch (error) {
    console.error('Failed to stop bot:', error);
    throw error;
  }
}

export async function restartBot(userId) {
  const pm2Name = `bot-${userId}`;
  
  try {
    await execAsync(`pm2 restart "${pm2Name}"`);
    return true;
  } catch (error) {
    console.error('Failed to restart bot:', error);
    throw error;
  }
}

export async function deleteBotFolder(userId) {
  const userBotDir = path.join(botsDir, userId);
  
  try {
    await execAsync(`pm2 stop "bot-${userId}"`);
    await execAsync(`pm2 delete "bot-${userId}"`);
  } catch (error) {
    console.error('Error stopping PM2 process:', error);
  }
  
  if (fs.existsSync(userBotDir)) {
    fs.rmSync(userBotDir, { recursive: true, force: true });
  }
  
  return true;
}

export async function getBotStatus(userId) {
  const pm2Name = `bot-${userId}`;
  
  try {
    const { stdout } = await execAsync(`pm2 describe "${pm2Name}"`);
    
    if (stdout.includes('online') || stdout.includes('launching')) {
      return 'running';
    } else if (stdout.includes('stopped') || stdout.includes('errored')) {
      return 'stopped';
    }
    return 'unknown';
  } catch (error) {
    return 'not_created';
  }
}
