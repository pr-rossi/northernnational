import Stripe from 'stripe';
import { buffer } from 'micro';

// Disable body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers['stripe-signature'];
  const buf = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    try {
      // Get order details from payment intent metadata
      const { product_id, variant_id, customer_email } = paymentIntent.metadata;

      // Create order in Printful
      const printfulResponse = await fetch('https://api.printful.com/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipient: {
            name: paymentIntent.shipping.name,
            address1: paymentIntent.shipping.address.line1,
            address2: paymentIntent.shipping.address.line2,
            city: paymentIntent.shipping.address.city,
            state_code: paymentIntent.shipping.address.state,
            country_code: paymentIntent.shipping.address.country,
            zip: paymentIntent.shipping.address.postal_code,
            email: customer_email
          },
          items: [
            {
              sync_variant_id: variant_id,
              quantity: 1
            }
          ]
        })
      });

      const printfulData = await printfulResponse.json();

      if (!printfulResponse.ok) {
        throw new Error(`Printful API error: ${JSON.stringify(printfulData)}`);
      }

      console.log('Printful order created:', printfulData);

      // Store order details in your database if needed
      // await db.orders.create({ ... });

    } catch (error) {
      console.error('Error creating Printful order:', error);
      // You might want to notify yourself of this error
      // The payment has already been processed at this point
    }
  }

  res.json({ received: true });
} 