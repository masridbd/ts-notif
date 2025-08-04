import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async (req, res) => {
  try {
    const message = await redis.get('latest_message') || 'No messages yet';
    res.setHeader('Content-Type', 'text/plain');
    return message;
  } catch (err) {
    console.error(err);
    res.status(500);
    return 'Error fetching message';
  }
};
