import { printfulApi } from '../../utils/printful'; // Adjust this import based on your setup

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const response = await printfulApi.get(`/store/products/${id}`);
    const product = response.data.result;
    
    // Assuming the first variant's price is the retail price
    const retail_price = product.sync_variants[0].retail_price;

    res.status(200).json({ ...product, retail_price });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
} 