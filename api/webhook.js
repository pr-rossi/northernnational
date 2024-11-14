import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function createPrintfulOrder(variantIds, customer) {
  try {
    const response = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: {
          name: customer.name,
          email: customer.email,
          address1: customer.address.line1,
          address2: customer.address.line2,
          city: customer.address.city,
          state_code: customer.address.state,
          country_code: customer.address.country,
          zip: customer.address.postal_code,
        },
        items: variantIds.map(id => ({
          sync_variant_id: parseInt(id, 10),
          quantity: 1
        })),
        store_id: process.env.PRINTFUL_STORE_ID,
        confirm: true
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Printful API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: JSON.stringify(data)
      });
      throw new Error(data.result || 'Failed to create Printful order');
    }

    console.log('Printful order created:', data);
    return data;
  } catch (error) {
    console.error('Error creating Printful order:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let event;
  try {
    const rawBody = await buffer(req);
    const sig = req.headers['stripe-signature'];

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      endpointSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      console.log('Checkout Session:', session);

      if (!session.metadata || !session.metadata.variant_ids) {
        throw new Error('Missing variant_ids in session metadata');
      }

      const variantIds = session.metadata.variant_ids.split(',');
      
      const customer = {
        email: session.customer_details?.email || '',
        name: session.customer_details?.name || '',
        address: session.customer_details?.address || {}
      };

      console.log('Processing order for customer:', customer);
      console.log('Variant IDs:', variantIds);

      // Create the Printful order
      const printfulOrder = await createPrintfulOrder(variantIds, customer);

      return res.status(200).json({ 
        received: true,
        printfulOrder: printfulOrder
      });
    } catch (error) {
      console.error('Error processing order:', error);
      return res.status(500).json({ 
        error: 'Error processing order',
        details: error.message 
      });
    }
  }

  res.status(200).json({ received: true });
} 