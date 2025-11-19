export default async function handler(req, res) {
  const TOKEN = process.env.TG_TOKEN;

  if (req.method !== "POST") {
    return res.status(200).send("OK");
  }

  const update = req.body;

  // Если пользователь нажал кнопку
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const messageId = cb.message.message_id;

    // Меняем кнопку
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
                text: "✔ Обработано",
                callback_data: "done_ok"
              }
            ]
          ]
        }
      })
    });

    // Ответ Telegram (обязателен!)
    await fetch(`https://api.telegram.org/bot${TOKEN}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: cb.id,
        text: "Заявка обработана!"
      })
    });

    return res.status(200).send("callback ok");
  }

  return res.status(200).send("OK");
}
