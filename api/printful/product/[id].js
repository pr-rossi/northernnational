// /api/printful/product/[id].js
import Cors from 'cors'

// Initialize the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
  origin: 'https://visual-room-188826.framer.app', // Your Framer app URL
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
  // Run the CORS middleware
  await runMiddleware(req, res, cors)

  const { id } = req.query;

  try {
    const response = await fetch(`https://api.printful.com/store/products/${id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.result || 'Failed to fetch product');
    }

    res.status(200).json(data.result);
  } catch (error) {
    console.error('Printful API Error:', error);
    res.status(500).json({ message: error.message });
  }
}