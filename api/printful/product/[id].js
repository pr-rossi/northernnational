// /api/printful/product/[id].js
import Cors from 'cors'

// Initialize the cors middleware with more permissive options
const cors = Cors({
  methods: ['GET', 'HEAD', 'POST', 'OPTIONS'],
  origin: [
    'https://visual-room-188826.framer.app',
    'https://visual-room-188826.framer.app/',
    'http://localhost:3000' // For local development
  ],
  credentials: true,
  optionsSuccessStatus: 200
})

// Helper function to run middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler(req, res) {
  console.log('Incoming request:', {
    method: req.method,
    origin: req.headers.origin,
    url: req.url
  });

  try {
    // Run the CORS middleware
    await runMiddleware(req, res, cors)

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }

    const { id } = req.query;

    console.log('Fetching Printful product:', id);

    const response = await fetch(`https://api.printful.com/store/products/${id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Printful API error response:', data);
      throw new Error(data.result || 'Failed to fetch product');
    }

    console.log('Successfully fetched product data');

    // Set additional CORS headers explicitly
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    return res.status(200).json(data.result);
  } catch (error) {
    console.error('Handler error:', {
      message: error.message,
      stack: error.stack
    });
    
    // Ensure CORS headers are set even for error responses
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    return res.status(500).json({ 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}