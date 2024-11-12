import { printfulApi } from '../../../utils/printful';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    // Using the Sync Products API endpoint
    const response = await printfulApi.get(`/sync/products/${id}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching sync product:', error);
    res.status(500).json({ error: 'Failed to fetch sync product details' });
  }
}