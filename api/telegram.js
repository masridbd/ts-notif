const TELEGRAM_BOT_TOKEN = "8043142819:AAEwVX8K3hnVchnfsNCj9lOaUz0vKZYh7ZM";
const MESSAGE_API_URL = "https://ts-notif.vercel.app/api/message";

export default async (req, res) => {
  try {
    const update = JSON.parse(req.body);
    
    if (update.message?.text) {
      // Store message directly via POST
      await fetch(MESSAGE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: update.message.text })
      });
    }
    
    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, body: 'Error' };
  }
};
