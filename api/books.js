export default async function handler(req, res) {
  const url = process.env.CSV_URL;

  try {
    const response = await fetch(url);
    const text = await response.text();
    res.status(200).send(text);
  } catch (err) {
    console.error('Books fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch CSV' });
  }
}
