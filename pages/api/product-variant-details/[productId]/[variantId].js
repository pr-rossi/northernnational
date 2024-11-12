import { printfulApi } from '../../utils/printful';

export default async function handler(req, res) {
  const { productId, variantId } = req.query;

  if (!productId || !variantId) {
    return res.status(400).json({ error: 'Product ID and Variant ID are required' });
  }

  try {
    const response = await printfulApi.get(`/store/products/${productId}/variants/${variantId}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching product variant details:', error);
    res.status(500).json({ error: 'Failed to fetch product variant details' });
  }
} 