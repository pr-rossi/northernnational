import { getProductDetails } from '../../utils/printful';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const product = await getProductDetails(id);
    
    res.status(200).json({
      code: product.code,
      result: product.result
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
} 