import { printfulApi } from '../../../utils/printful';

export default async function handler(req, res) {
  console.log('API Route Hit');
  console.log('Method:', req.method);
  console.log('Query:', req.query);
  console.log('API Key exists:', !!process.env.PRINTFUL_API_KEY);

  const { id } = req.query;

  try {
    const apiUrl = `https://api.printful.com/sync/variants/${id}`;
    console.log('Calling Printful URL:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Printful API error:', errorText);
      return res.status(response.status).json({ 
        error: errorText,
        requestedId: id,
        apiUrl: apiUrl
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: error.message,
      requestedId: id
    });
  }
} 