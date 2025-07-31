export default async function handler(req, res) {
  const { title, author, comment } = req.body;

  console.log("📨 Пришёл запрос:", title, author, comment);

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Название обязательно" });
  }

  await fetch(process.env.SUGGEST_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author, comment })
  });

  res.status(200).json({ success: true });
}
