import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const domain = process.env.REACT_APP_API_URL;
  
  if (!domain) {
    return res.status(500).json({ 
      message: 'Server configuration error: REACT_APP_API_URL is not set' 
    });
  }

  try {
    const { items } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name.replace('undefined - ', ''),
            images: item.image ? [item.image] : [],
          },
          unit_amount: item.unit_amount,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      metadata: {
        variant_ids: items.map(item => item.variantId).join(',')
      },
      success_url: `${domain}?success=true`,
      cancel_url: `${domain}?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', {
      message: error.message,
      domain: domain,
      env: process.env.NODE_ENV
    });
    res.status(500).json({ 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined 
    });
  }
} 