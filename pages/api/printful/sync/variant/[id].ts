import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const response = await fetch(
      `https://api.printful.com/store/variants/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Printful API error status:', response.status);
      console.error('Printful API error body:', errorText);
      return res.status(response.status).json({
        error: `Printful API error: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch product variant',
      details: error.message
    });
  }
}
