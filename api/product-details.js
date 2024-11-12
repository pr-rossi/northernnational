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
  console.log('Received request for product ID:', id);

  if (!id) {
    console.log('Missing product ID in request');
    return res.status(400).json({ error: 'Product ID is required' });
  }

  if (!process.env.PRINTFUL_API_KEY || !process.env.PRINTFUL_STORE_ID) {
    console.error('Missing required environment variables:', {
      hasApiKey: !!process.env.PRINTFUL_API_KEY,
      hasStoreId: !!process.env.PRINTFUL_STORE_ID
    });
    return res.status(500).json({ error: 'Missing required configuration' });
  }

  try {
    const apiUrl = `https://api.printful.com/sync/products/${id}?store_id=${process.env.PRINTFUL_STORE_ID}`;
    console.log('Fetching from Printful:', apiUrl);

    const headers = {
      'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const printfulResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: headers,
    });

    console.log('Printful response status:', printfulResponse.status);

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
    console.log('Printful response data:', {
      result: data.result ? 'present' : 'missing',
      sync_variants: data.result?.sync_variants ? 'present' : 'missing'
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
} 