import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing Stripe secret key');
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { items, email, variantId } = req.body;

    console.log('Received request:', {
      items,
      email,
      variantId
    });

    if (!items?.[0]?.price_data?.unit_amount) {
      throw new Error('Invalid price data');
    }

    // Create payment intent with shipping
    const paymentIntent = await stripe.paymentIntents.create({
      amount: items[0].price_data.unit_amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        product_id: items[0].product_id,
        variant_id: variantId,
        customer_email: email,
        product_name: items[0].price_data.product_data.name,
        product_image: items[0].price_data.product_data.images[0]
      },
      receipt_email: email,
      shipping: {
        name: 'shipping',
        address: {
          line1: null,
          line2: null,
          city: null,
          state: null,
          postal_code: null,
          country: null
        }
      }
    });

    console.log('Payment intent created:', paymentIntent.id);

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment Intent Creation Error:', {
      message: error.message,
      stack: error.stack,
      type: error.constructor.name,
      requestBody: req.body
    });

    res.status(500).json({ 
      error: 'Error creating payment intent',
      details: error.message,
      type: error.constructor.name
    });
  }
} 