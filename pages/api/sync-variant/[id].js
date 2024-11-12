import { printfulApi } from '../../../utils/printful';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Variant ID is required' });
  }

  try {
    // Using the Sync Variant API endpoint
    const response = await printfulApi.get(`/sync/variants/${id}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching sync variant:', error);
    res.status(500).json({ error: 'Failed to fetch sync variant details' });
  }
} 