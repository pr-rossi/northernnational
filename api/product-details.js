import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    console.log('Fetching Printful product:', id);
    console.log('Using API key:', process.env.PRINTFUL_API_KEY?.substring(0, 5) + '...');

    const printfulResponse = await fetch(
      `https://api.printful.com/store/products/${id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!printfulResponse.ok) {
      const errorText = await printfulResponse.text();
      console.error('Printful API Error:', {
        status: printfulResponse.status,
        statusText: printfulResponse.statusText,
        error: errorText
      });
      
      return res.status(printfulResponse.status).json({
        error: 'Printful API error',
        details: errorText
      });
    }

    const data = await printfulResponse.json();
    console.log('Printful response:', data);

    return res.status(200).json(data);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 