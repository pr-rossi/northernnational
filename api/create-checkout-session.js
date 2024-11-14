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
      line_items: items.map(item => {
        const productData = {
          name: `${item.name}`,
          images: [item.image],
        };

        if (item.product_data?.description) {
          productData.description = item.product_data.description;
        }

        return {
          price_data: {
            currency: 'usd',
            product_data: productData,
            unit_amount: item.unit_amount,
          },
          quantity: item.quantity || 1,
        };
      }),
      mode: 'payment',
      metadata: {
        variant_ids: items.map(item => item.variantId).join(',')
      },
      success_url: `${domain}?success=true`,
      cancel_url: `${domain}?canceled=true`,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 500,
              currency: 'usd',
            },
            display_name: 'Standard Shipping',
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
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500,
              currency: 'usd',
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 2,
              },
              maximum: {
                unit: 'business_day',
                value: 3,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
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