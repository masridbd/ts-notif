const BOT_TOKEN = "8043142819:AAEwVX8K3hnVchnfsNCj9lOaUz0vKZYh7ZM";
const API_URL = "https://ts-notif.vercel.app/api/message";

export default async (req, res) => {
  try {
    const update = JSON.parse(req.body);
    
    if (update.message?.text) {
      // Store message directly
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: update.message.text })
      });
      
      // Send confirmation to user
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: update.message.chat.id,
          text: "✅ Message saved successfully!"
        })
      });
    }
    
    return res.status(200).send('OK');
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).send('Server Error');
  }
};
