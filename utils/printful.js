const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_API_URL = 'https://api.printful.com';

export async function printfulRequest(endpoint, options = {}) {
  const response = await fetch(`${PRINTFUL_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Printful API error: ${response.status}`);
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