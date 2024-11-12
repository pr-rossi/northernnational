import { printfulApi } from '../../utils/printful';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const response = await printfulApi.get(`/store/products/${id}`);
    const product = response.data.result;
    
    res.status(200).json({
      code: response.data.code,
      result: product
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
} 