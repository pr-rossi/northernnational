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
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let event;
  const sig = req.headers['stripe-signature'];

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      // Log the session data to debug
      console.log('Checkout Session:', session);

      // Make sure we have the metadata
      if (!session.metadata || !session.metadata.variant_ids) {
        throw new Error('Missing variant_ids in session metadata');
      }

      // Get the variant IDs from metadata
      const variantIds = session.metadata.variant_ids.split(',');
      
      // Get customer details
      const customer = {
        email: session.customer_details?.email,
        name: session.customer_details?.name,
        address: session.customer_details?.address
      };

      console.log('Processing order for customer:', customer);
      console.log('Variant IDs:', variantIds);

      // Process the order with Printful
      // Add your Printful order creation logic here

      return res.status(200).json({ received: true });
    } catch (error) {
      console.error('Error processing order:', error);
      return res.status(500).json({ 
        error: 'Error processing order',
        details: error.message 
      });
    }
  }

  // Return a response to acknowledge receipt of the event
  res.status(200).json({ received: true });
} 