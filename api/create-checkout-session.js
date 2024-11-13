import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { items } = req.body;

    console.log('Creating checkout session with items:', items);

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.northernnationalmusic.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: item.unit_amount,
        },
        quantity: 1,
      })),
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      metadata: {
        variant_ids: items.map(item => item.variantId).join(','),
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}`,
    });

    console.log('Session created with metadata:', session.metadata);
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
} 