export default async function handler(req, res) {
  const { title, author, comment } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: "Название обязательно" });
  }

  // Прокидываем дальше в Google Script
  await fetch(process.env.SUGGEST_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author, comment })
  });

  res.status(200).json({ success: true });
}
