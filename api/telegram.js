import { Redis } from '@upstash/redis';
import { createRouter } from 'micro';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const bot = new (require('telegraf'))(process.env.TELEGRAM_BOT_TOKEN);

const router = createRouter();

router.post('/', async (req, res) => {
  try {
    const update = await req.json();
    bot.handleUpdate(update);
    return 'OK';
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
});

bot.on('text', async (ctx) => {
  const message = ctx.message.text;
  await redis.set('latest_message', message);
  await ctx.reply(`Message saved: ${message}`);
});

export default router;
