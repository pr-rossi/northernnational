import Stripe from 'stripe';
import axios from 'axios';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const printfulResponse = await axios.post('https://api.printful.com/orders', {
        recipient: {
          name: 'Customer Name',
          address1: 'Customer Address',
          city: 'City',
          state_code: 'State',
          country_code: 'US',
          zip: 'ZIP',
        },
        items: session.display_items.map(item => ({
          variant_id: item.custom_id, // Map your items to Printful's format
          quantity: item.quantity,
        })),
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        },
      });

      console.log('Printful order created:', printfulResponse.data);
    } catch (error) {
      console.error('Error creating Printful order:', error);
    }
  }

  res.status(200).json({ received: true });
}

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
} 