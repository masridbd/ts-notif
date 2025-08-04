// Add this at the top after Redis initialization
redis.ping().catch(err => {
  console.error('Redis connection error:', err);
});

// Modify the bot handler
bot.on('text', async (ctx) => {
  try {
    await redis.set('latest_message', ctx.message.text, {
      ex: 3600 // expire after 1 hour
    });
    await ctx.reply('Message saved!');
  } catch (err) {
    console.error('Save error:', err);
    await ctx.reply('Failed to save message');
  }
});
