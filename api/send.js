export default async function handler(req, res) {
  const TOKEN = process.env.TG_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  // Если Telegram прислал callback_query (кнопка)
  if (req.body.callback_query) {
    const callback = req.body.callback_query;
    const message_id = callback.message.message_id;

    // Обновляем сообщение — отмечаем как обработано
    await fetch(`https://api.telegram.org/bot${TOKEN}/editMessageReplyMarkup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        message_id,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "✔ Обработано",
                callback_data: "done",
              }
            ]
          ]
        }
      })
    });
await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
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
});

    // Можно отправить уведомление обработчику
    await fetch(`https://api.telegram.org/bot${TOKEN}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callback.id,
        text: "Заявка обработана!",
        show_alert: false
      })
    });

    return res.status(200).json({ ok: true });
  }

  // Обработка заявок от сайта (POST /api/send)
  if (req.method === "POST") {
    const { name, contact, subject } = req.body;

    const message =
      `📝 Новая заявка!\n\n` +
      `👤 Имя: ${name}\n` +
      `☎ Контакт: ${contact}\n` +
      `📚 Предмет: ${subject}`;

    // Сообщение с кнопкой
    const response = await fetch(
      `https://api.telegram.org/bot${TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

    const data = await response.json();
    return res.status(200).json({ ok: true, data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
