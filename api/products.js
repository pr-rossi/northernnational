const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  try {
    const response = await fetch('https://api.printful.com/store/products', {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
      },
    });

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
};