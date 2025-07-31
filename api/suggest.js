export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Метод не разрешён" });
  }

  try {
    const { title, author, comment } = req.body;

    console.log("📨 Пришёл запрос:", title, author, comment);

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Название обязательно" });
    }

    const endpoint = "https://script.google.com/macros/s/AKfycbw2FEy4ytJ2ImqlKSUskMiPytVmnXggkJGDFKdHkygFuGy2ctCar5cBGXbGKQwfM_4/exec";

    const result = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author, comment })
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Ошибка в suggest.js", err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
