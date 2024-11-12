import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { items } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/`,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      metadata: {
        variant_ids: items.map(item => item.price_data.product_data.metadata?.variant_id).join(',')
      }
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
} 