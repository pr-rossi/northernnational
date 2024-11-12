import Stripe from 'stripe';
import { buffer } from 'micro';

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

  console.log('Webhook received');
  
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
    console.log('Webhook event type:', event.type);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log('Payment succeeded:', paymentIntent.id);
    
    try {
      // Log all available data
      console.log('Payment metadata:', paymentIntent.metadata);
      console.log('Shipping info:', paymentIntent.shipping);

      // Create Printful order
      const printfulOrderData = {
        external_id: paymentIntent.id,
        shipping: "STANDARD",
        recipient: {
          name: paymentIntent.shipping.name,
          address1: paymentIntent.shipping.address.line1,
          address2: paymentIntent.shipping.address.line2 || '',
          city: paymentIntent.shipping.address.city,
          state_code: paymentIntent.shipping.address.state,
          country_code: paymentIntent.shipping.address.country,
          zip: paymentIntent.shipping.address.postal_code,
          email: paymentIntent.metadata.customer_email
        },
        items: [
          {
            sync_variant_id: parseInt(paymentIntent.metadata.variant_id),
            quantity: 1
          }
        ]
      };

      console.log('Sending to Printful:', printfulOrderData);

      const printfulResponse = await fetch('https://api.printful.com/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(printfulOrderData)
      });

      const printfulResult = await printfulResponse.json();
      
      if (!printfulResponse.ok) {
        console.error('Printful API Error:', printfulResult);
        throw new Error(`Printful API error: ${JSON.stringify(printfulResult)}`);
      }

      console.log('Printful order created:', printfulResult);

    } catch (error) {
      console.error('Error creating Printful order:', error);
      // Still return 200 to Stripe
    }
  }

  res.json({ received: true });
} 