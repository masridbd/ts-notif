// api/message.js
const UPSTASH_REDIS_REST_URL = "https://romantic-oryx-9266.upstash.io";
const UPSTASH_REDIS_REST_TOKEN = "ASQyAAIjcDFkY2QwZjI4NWUwZTE0NmQ2Yjk2OWVjNjRiOGI5ZGRmZXAxMA";

// In-memory cache as fallback
let cachedMessage = {
  text: 'No messages yet',
  timestamp: 0
};

export default async (req, res) => {
  // Set response headers
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, max-age=30');
  
  try {
    // Try to fetch from Upstash
    const response = await fetch(`${UPSTASH_REDIS_REST_URL}/get/latest_message`, {
      headers: {
        'Authorization': `Bearer ${UPSTASH_REDIS_REST_TOKEN}`
      },
      timeout: 3000
    });
    
    if (!response.ok) throw new Error('Upstash request failed');
    
    const data = await response.json();
    const message = data.result || 'No messages yet';
    
    // Update cache
    cachedMessage = {
      text: message,
      timestamp: Date.now()
    };
    
    return message;
  } catch (error) {
    console.error('Error:', error.message);
    // Return cached message if available
    if (Date.now() - cachedMessage.timestamp < 60000) { // 1 minute cache
      return cachedMessage.text;
    }
    return 'Message service is currently unavailable';
  }
};
