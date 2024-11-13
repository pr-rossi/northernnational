import Stripe from 'stripe';
import fetch from 'node-fetch';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      console.log('Session metadata:', session.metadata);
      
      if (!session.metadata?.variant_ids) {
        console.error('No variant_ids in session metadata');
        return res.status(400).json({ error: 'Missing variant_ids in session metadata' });
      }

      const variantIds = session.metadata.variant_ids.split(',').filter(Boolean);
      console.log('Parsed variant IDs:', variantIds);

      if (variantIds.length === 0) {
        console.error('No valid variant IDs found after parsing');
        return res.status(400).json({ error: 'No valid variant IDs' });
      }

      // Debug the session ID
      console.log('Original session ID:', session.id);
      
      // Create a more strictly formatted external ID
      const externalId = `stripe_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('Generated external ID:', externalId);

      const printfulOrder = {
        external_id: externalId,
        recipient: {
          name: session.shipping_details.name,
          address1: session.shipping_details.address.line1,
          address2: session.shipping_details.address.line2 || '',
          city: session.shipping_details.address.city,
          state_code: session.shipping_details.address.state,
          country_code: session.shipping_details.address.country,
          zip: session.shipping_details.address.postal_code,
          email: session.customer_details.email,
        },
        items: variantIds.map(variantId => ({
          sync_variant_id: parseInt(variantId, 10),
          quantity: 1,
        })),
        retail_costs: {
          subtotal: (session.amount_subtotal / 100).toFixed(2),
          total: (session.amount_total / 100).toFixed(2)
        },
        store_id: parseInt(process.env.PRINTFUL_STORE_ID, 10),
        confirm: true
      };

      console.log('Printful order payload:', JSON.stringify(printfulOrder, null, 2));

      const printfulResponse = await fetch('https://api.printful.com/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(printfulOrder),
      });

      const responseText = await printfulResponse.text();
      console.log('Printful API response:', responseText);

      if (!printfulResponse.ok) {
        throw new Error(`Printful API error: ${responseText}`);
      }

      return res.status(200).json({ received: true });
    } catch (error) {
      console.error('Error processing order:', error);
      return res.status(500).json({ 
        error: 'Error processing order',
        details: error.message 
      });
    }
  }

  return res.status(200).json({ received: true });
} 