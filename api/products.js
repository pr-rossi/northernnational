const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Log to check if we're getting the API key
    console.log('API Key present:', !!process.env.PRINTFUL_API_KEY);

    const response = await fetch('https://api.printful.com/store/products?store_id=14808970', {
      headers: {
        'Authorization': process.env.PRINTFUL_API_KEY.startsWith('Bearer ') 
          ? process.env.PRINTFUL_API_KEY 
          : `Bearer ${process.env.PRINTFUL_API_KEY}`,
      },
    });

    const data = await response.json();
    
    // Log the response status and data
    console.log('Printful Status:', response.status);
    console.log('Printful Response:', data);

    // Check for error in response
    if (data.error) {
      throw new Error(data.error.message || 'Printful API error');
    }

    // Ensure we're returning the correct structure
    if (data && data.result) {
      return res.json({ result: data.result });
    } else {
      throw new Error('Invalid response from Printful');
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch products',
      details: error.message,
      type: 'AUTH_ERROR'
    });
  }
};