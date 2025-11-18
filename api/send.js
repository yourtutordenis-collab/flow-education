export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const TOKEN = process.env.TG_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

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
          text: message,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "✔ Пометить как обработано",
                  callback_data: "done"
                }
              ]
            ]
          }
        })
      }
    );

    return res.status(200).json({ ok: true });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
