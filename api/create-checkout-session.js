import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Get the items from the request body
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      throw new Error('Invalid items data');
    }

    // Get domain from request headers or environment variable
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const domain = process.env.REACT_APP_URL || `${protocol}://${req.headers.host}`;

    console.log('Using domain:', domain);

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      mode: 'payment',
      success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}`,
      shipping_address_collection: {
        allowed_countries: ['US'], // Add other countries if needed
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 500, // $5.00
              currency: 'usd',
            },
            display_name: 'Standard shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Stripe Error:', {
      message: error.message,
      stack: error.stack,
      type: error.constructor.name
    });
    res.status(500).json({ 
      error: 'Error creating checkout session',
      details: error.message
    });
  }
} 