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

    const { id } = req.query;
    if (!id) {
      throw new Error('Product ID is required');
    }

    if (!process.env.PRINTFUL_STORE_ID) {
      throw new Error('Printful Store ID is missing');
    }

    console.log('Processing request for product ID:', id);

    // Get the sync product details using the correct endpoint
    const productUrl = `https://api.printful.com/sync/products/${id}?store_id=${process.env.PRINTFUL_STORE_ID}`;
    console.log('Fetching product details from:', productUrl);

    const productResponse = await fetch(productUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const productResponseText = await productResponse.text();
    console.log('Product API Response:', productResponseText);

    if (!productResponse.ok) {
      console.error('Printful Product API Error:', {
        status: productResponse.status,
        text: productResponseText,
        url: productUrl
      });
      throw new Error(`Printful API error: ${productResponse.status} - ${productResponseText}`);
    }

    const productData = JSON.parse(productResponseText);
    console.log('Parsed product data:', productData);

    if (!productData.result) {
      throw new Error('Invalid product data received');
    }

    // The sync/products endpoint already includes variant information
    // No need for a separate variant call
    const combinedData = {
      result: {
        ...productData.result,
        sync_variants: productData.result.sync_variants || []
      }
    };

    console.log('Combined response data:', combinedData);

    res.status(200).json(combinedData);
  } catch (error) {
    console.error('Server Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      type: error.constructor.name
    });
    res.status(500).json({ 
      error: 'Failed to fetch product details',
      details: error.message,
      timestamp: new Date().toISOString(),
      type: error.constructor.name,
      code: error.code
    });
  }
} 