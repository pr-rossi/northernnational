import { printfulApi } from '../../../utils/printful';

export default async function handler(req, res) {
  console.log('API Route Hit - ID:', req.query.id);
  const { id } = req.query;

  try {
    const response = await fetch(
      `https://api.printful.com/sync/variants/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Printful API error:', errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: error.message });
  }
} 