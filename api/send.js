export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const TOKEN = process.env.TG_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  const { name, contact, subject } = req.body;

  const message = `📝 Новая заявка!\n\n👤 Имя: ${name}\n☎ Контакт: ${contact}\n📚 Предмет: ${subject}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message
        })
      }
    );

    const data = await response.json();
    return res.status(200).json({ ok: true, telegram_response: data });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
