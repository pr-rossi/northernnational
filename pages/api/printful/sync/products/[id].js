import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!process.env.PRINTFUL_API_KEY) {
    return res.status(500).json({ error: 'Printful API key is not configured' });
  }

  try {
    const response = await fetch(`https://api.printful.com/store/products/${id}`, {
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
