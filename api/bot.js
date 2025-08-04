import { Telegraf } from 'telegraf';
import { Redis } from '@upstash/redis';

// Initialize Upstash Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Initialize Telegram bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Handle incoming text messages
bot.on('text', async (ctx) => {
  try {
    await redis.set('latestMessage', ctx.message.text);
    ctx.reply('Message received! It will appear at /message.txt');
  } catch (error) {
    console.error('Error saving to Redis:', error);
    ctx.reply('Error saving message.');
  }
});

// Vercel serverless function handler
export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      await bot.handleUpdate(req.body, res);
    } else if (req.url.endsWith('/message.txt')) {
      const message = await redis.get('latestMessage') || 'No message received yet';
      res.setHeader('Content-Type', 'text/plain');
      res.status(200).send(message);
    } else {
      res.status(200).json({ message: 'Listening to bot events...' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Set Telegram webhook
const VERCEL_URL = process.env.VERCEL_URL || 'https://your-vercel-app.vercel.app';
bot.telegram.setWebhook(`${VERCEL_URL}/api/bot`).then(() => {
  console.log(`Webhook set to ${VERCEL_URL}/api/bot`);
});
