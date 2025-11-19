export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("OK");
  }

  const TOKEN = process.env.TG_TOKEN;

  const body = req.body;

  // --- Это callback кнопки ---
  if (body.callback_query) {
    const chatId = body.callback_query.message.chat.id;
    const messageId = body.callback_query.message.message_id;

    // обновляем текст сообщения
    await fetch(`https://api.telegram.org/bot${TOKEN}/editMessageReplyMarkup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "✔️ Обработано",
                callback_data: "done"
              }
            ]
          ]
        }
      })
    });

    // отправляем Telegram уведомление, что нажали на кнопку
    await fetch(`https://api.telegram.org/bot${TOKEN}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: body.callback_query.id,
        text: "Заявка обработана!"
      })
    });

    return res.status(200).send("callback processed");
  }

  return res.status(200).send("OK");
}
