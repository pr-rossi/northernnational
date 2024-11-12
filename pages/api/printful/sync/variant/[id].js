import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!process.env.PRINTFUL_API_KEY) {
    return res.status(500).json({ error: 'Printful API key not configured' });
  }

  try {
    console.log('Attempting to fetch Printful product:', id);

    const response = await fetch(`https://api.printful.com/sync/products`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Printful API error:', await response.text());
      throw new Error(`Printful API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    const product = data.result.find(p => p.id.toString() === id.toString());
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ result: product });
  } catch (error) {
    console.error('Error fetching from Printful:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
}
