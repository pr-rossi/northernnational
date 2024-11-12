const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_API_URL = 'https://api.printful.com';

export async function printfulRequest(endpoint, options = {}) {
  if (!PRINTFUL_API_KEY) {
    throw new Error('PRINTFUL_API_KEY is not defined in environment variables');
  }

  const response = await fetch(`${PRINTFUL_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Basic ${Buffer.from(PRINTFUL_API_KEY).toString('base64')}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Printful API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

export async function getProductDetails(variantId) {
  return printfulRequest(`/store/variants/${variantId}`);
}

export async function syncProduct(productId) {
  return printfulRequest(`/store/products/${productId}`);
}

export default {
  printfulRequest,
  getProductDetails,
  syncProduct,
}; 