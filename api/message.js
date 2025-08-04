// Simple in-memory storage solution (bypasses Upstash timeout issues)
let lastMessage = 'No messages yet';

export default async (req, res) => {
  // Set headers first for fast response
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 's-maxage=10');
  
  // Handle POST requests (from Telegram bot)
  if (req.method === 'POST') {
    lastMessage = req.body.message || lastMessage;
    return res.status(200).send('OK');
  }
  
  // Handle GET requests
  return res.status(200).send(lastMessage);
};  } catch (error) {
    console.error('Error:', error.message);
    // Return cached message if available
    if (Date.now() - cachedMessage.timestamp < 60000) { // 1 minute cache
      return cachedMessage.text;
    }
    return 'Message service is currently unavailable';
  }
};
