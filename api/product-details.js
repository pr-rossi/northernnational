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

    // First get the sync product details
    const productUrl = `https://api.printful.com/sync/products/${id}`;
    console.log('Fetching product details:', productUrl);

    const productResponse = await fetch(productUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!productResponse.ok) {
      const errorText = await productResponse.text();
      console.error('Printful Product API Error:', {
        status: productResponse.status,
        text: errorText,
        url: productUrl
      });
      throw new Error(`Printful API error: ${productResponse.status} - ${errorText}`);
    }

    const productData = await productResponse.json();
    
    // Then get the variant details
    const variantId = productData.result.sync_variants[0].id; // Get first variant ID
    const variantUrl = `https://api.printful.com/sync/variants/${variantId}`;
    console.log('Fetching variant details:', variantUrl);

    const variantResponse = await fetch(variantUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!variantResponse.ok) {
      const errorText = await variantResponse.text();
      console.error('Printful Variant API Error:', {
        status: variantResponse.status,
        text: errorText,
        url: variantUrl
      });
      throw new Error(`Printful API error: ${variantResponse.status} - ${errorText}`);
    }

    const variantData = await variantResponse.json();

    // Combine the data
    const combinedData = {
      result: {
        ...productData.result,
        variant_details: variantData.result
      }
    };

    console.log('Combined product and variant data:', combinedData);

    res.status(200).json(combinedData);
  } catch (error) {
    console.error('Server Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    res.status(500).json({ 
      error: 'Failed to fetch product details',
      details: error.message,
      timestamp: new Date().toISOString(),
      type: error.name,
      code: error.code
    });
  }
} 