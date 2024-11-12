export default async function handler(req, res) {
  try {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    // Check for store ID
    if (!process.env.PRINTFUL_STORE_ID) {
      throw new Error('Printful Store ID is missing');
    }

    // Log the Printful API key (first few characters)
    console.log('Printful API Key prefix:', process.env.PRINTFUL_API_KEY?.substring(0, 4));
    
    if (!process.env.PRINTFUL_API_KEY) {
      throw new Error('Printful API key is missing');
    }

    // Update URL to include store_id
    const printfulUrl = `https://api.printful.com/sync/products?store_id=${process.env.PRINTFUL_STORE_ID}`;
    console.log('Calling Printful API:', printfulUrl);

    const response = await fetch(printfulUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Printful API Error:', {
        status: response.status,
        text: errorText,
        url: printfulUrl
      });
      throw new Error(`Printful API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Printful API success, product count:', data.result?.length);

    res.status(200).json(data);
  } catch (error) {
    console.error('Server Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    res.status(500).json({ 
      error: 'Failed to fetch products',
      details: error.message,
      timestamp: new Date().toISOString(),
      type: error.name,
      code: error.code
    });
  }
} 