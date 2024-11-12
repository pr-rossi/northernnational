import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
  console.log('API Route hit:', req.query);
  const { id } = req.query;

  if (!process.env.PRINTFUL_API_KEY) {
    console.log('No API key found');
    return res.status(500).json({ error: 'Printful API key is not configured' });
  }

  try {
    console.log('Fetching from Printful:', id);
    const response = await fetch(`https://api.printful.com/sync/variant/${id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Printful API responded with status ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching product from Printful:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
}
