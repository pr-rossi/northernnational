import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { items, email, variantId } = req.body;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: items[0].price_data.unit_amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        product_id: items[0].product_id,
        variant_id: variantId,
        customer_email: email
      },
      shipping_address_collection: {
        allowed_countries: ['US'], // Add other countries as needed
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment Intent Error:', error);
    res.status(500).json({ 
      error: 'Error creating payment intent',
      details: error.message
    });
  }
} 