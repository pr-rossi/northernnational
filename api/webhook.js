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
      console.log('Processing successful payment:', paymentIntent);

      // Get order details from payment intent metadata
      const { product_id, variant_id } = paymentIntent.metadata;
      const shipping = paymentIntent.shipping;

      if (!shipping) {
        throw new Error('No shipping information provided');
      }

      // Create order in Printful
      const printfulResponse = await fetch('https://api.printful.com/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          external_id: paymentIntent.id, // Use Stripe payment ID as external reference
          shipping: "STANDARD", // or "EXPRESS" if you want to offer express shipping
          recipient: {
            name: shipping.name,
            address1: shipping.address.line1,
            address2: shipping.address.line2 || '',
            city: shipping.address.city,
            state_code: shipping.address.state,
            country_code: shipping.address.country,
            zip: shipping.address.postal_code,
            email: paymentIntent.receipt_email || paymentIntent.metadata.customer_email,
            phone: shipping.phone || ''
          },
          items: [
            {
              sync_variant_id: parseInt(variant_id),
              quantity: 1,
              retail_price: (paymentIntent.amount / 100).toString(), // Convert cents to dollars
              name: "Custom T-Shirt", // You might want to store the product name in metadata
              files: [
                {
                  url: "https://www.northernnationalmusic.com/images/logo.png" // Replace with your actual design URL
                }
              ]
            }
          ]
        })
      });

      const printfulData = await printfulResponse.json();

      if (!printfulResponse.ok) {
        console.error('Printful API Error Response:', printfulData);
        throw new Error(`Printful API error: ${JSON.stringify(printfulData)}`);
      }

      console.log('Printful order created successfully:', printfulData);

    } catch (error) {
      console.error('Error creating Printful order:', {
        error: error.message,
        paymentIntent: paymentIntent.id,
        shipping: paymentIntent.shipping,
        metadata: paymentIntent.metadata
      });
      // You might want to set up error notifications here
      // The payment has already been processed at this point
    }
  }

  res.json({ received: true });
} 