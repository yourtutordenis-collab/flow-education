export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, contact, subject } = req.body;

    const TOKEN = process.env.TG_TOKEN;   // ← токен из переменных окружения
    const CHAT_ID = process.env.CHAT_ID;  // ← chat_id тоже скрыт

    const message =
`📝 Новая заявка на занятие

👤 Имя: ${name}
☎ Контакт: ${contact}
📚 Предмет: ${subject}`;

    try {
        await fetch(
            `https://api.telegram.org/bot${TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message
                })
            }
        );

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Telegram error" });
    }
}
