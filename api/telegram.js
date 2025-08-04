// api/telegram.js
const UPSTASH_REDIS_REST_URL = "https://romantic-oryx-9266.upstash.io";
const UPSTASH_REDIS_REST_TOKEN = "ASQyAAIjcDFkY2QwZjI4NWUwZTE0NmQ2Yjk2OWVjNjRiOGI5ZGRmZXAxMA";
const TELEGRAM_BOT_TOKEN = "8043142819:AAEwVX8K3hnVchnfsNCj9lOaUz0vKZYh7ZM";

const { Telegraf } = require('telegraf');
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

export default async (req, res) => {
  try {
    const update = JSON.parse(req.body);
    await bot.handleUpdate(update);
    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error('Telegram error:', err);
    return { statusCode: 500, body: 'Error' };
  }
};

// Handle messages
bot.on('text', async (ctx) => {
  try {
    const response = await fetch(`${UPSTASH_REDIS_REST_URL}/set/latest_message`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        value: ctx.message.text,
        ex: 86400 // expire after 1 day
      })
    });
    
    if (!response.ok) throw new Error('Upstash set failed');
    
    await ctx.reply('Message saved successfully!');
  } catch (error) {
    console.error('Save error:', error);
    await ctx.reply('Failed to save message');
  }
});
