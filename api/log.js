export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const payload = req.body;
  const url = process.env.LOG_ENDPOINT;

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    res.status(200).json({ message: 'OK' });
  } catch (err) {
    console.error('Log error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
