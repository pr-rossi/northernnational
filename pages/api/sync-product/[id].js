import { syncProduct } from '../../../utils/printful';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const product = await syncProduct(id);
    
    res.status(200).json({
      code: product.code,
      result: product.result
    });
  } catch (error) {
    console.error('Error syncing product:', error);
    res.status(500).json({ error: 'Failed to sync product' });
  }
}