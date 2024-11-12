export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const response = await fetch(
      `https://api.printful.com/store/products/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
} 