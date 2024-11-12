import { printfulRequest } from '../../utils/printful';

export default async function handler(req, res) {
  try {
    const products = await printfulRequest('/store/products');
    
    res.status(200).json({
      code: products.code,
      result: products.result
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
} 