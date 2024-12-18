// /api/printful/product/[id].js
export default async function handler(req, res) {
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