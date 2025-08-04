import { Redis } from '@upstash/redis';

// Initialize Redis with timeout
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
  timeout: 5000 // 5 second timeout
});

export default async (req, res) => {
  // Set headers first
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  
  try {
    // Fast fail if Redis isn't configured
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      throw new Error('Redis URL not configured');
    }

    // Get message with timeout fallback
    const message = await Promise.race([
      redis.get('latest_message'),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Redis timeout')), 4000)
    ]);
    
    return message || 'No messages yet';
  } catch (err) {
    console.error('Error:', err.message);
    return 'Message service unavailable. Try again later.';
  }
};
