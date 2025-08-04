// Simple in-memory storage (persists between requests in serverless environment)
let storedMessage = 'No messages yet';
let lastUpdate = 0;

export default async (req, res) => {
  // Set headers first for immediate response
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');
  
  // Handle POST requests (from Telegram bot)
  if (req.method === 'POST') {
    try {
      const body = JSON.parse(req.body);
      storedMessage = body.message || storedMessage;
      lastUpdate = Date.now();
      return res.status(200).send('OK');
    } catch (err) {
      return res.status(400).send('Bad Request');
    }
  }
  
  // Handle GET requests
  return res.status(200).send(storedMessage);
};
