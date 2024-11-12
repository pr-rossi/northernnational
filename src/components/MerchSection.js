import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { loadStripe } from '@stripe/stripe-js';

gsap.registerPlugin(ScrollTrigger);

// Debug environment variables
if (typeof window !== 'undefined') {  // Client-side check
  console.log('Running on client side');
  console.log('Environment:', {
    nodeEnv: process.env.NODE_ENV,
    hasStripeKey: !!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
    stripeKeyPrefix: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY?.substring(0, 6)
  });
}

// Ensure we're using the correct variable name and it's loaded
const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey) {
  console.error('⚠️ Stripe key missing. Please check:');
  console.error('1. Key name is exactly REACT_APP_STRIPE_PUBLISHABLE_KEY');
  console.error('2. Key is set in Vercel environment variables');
  console.error('3. Key is enabled for the current environment');
}

// Initialize Stripe with additional error handling
let stripePromise;
try {
  stripePromise = stripeKey ? loadStripe(stripeKey) : null;
  console.log('Stripe initialization:', stripePromise ? 'successful' : 'failed');
} catch (error) {
  console.error('Stripe initialization error:', error);
}

const MerchSection = () => {
  console.log('Stripe Key exists:', !!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/products`;
        console.log('Fetching products from:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        // Add response debugging
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            responseText: errorText
          });
          
          // Try to parse error response as JSON
          try {
            const errorJson = JSON.parse(errorText);
            console.error('Detailed error:', errorJson);
          } catch (e) {
            console.error('Raw error text:', errorText);
          }
          
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);

        if (data && data.result) {
          setProducts(data.result);
        } else {
          console.error('Invalid data structure:', data);
          throw new Error('Invalid data structure');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        console.error('Error details:', err.message);
        setError(`Failed to load products: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      gsap.from('.product-card', {
        y: 50,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        }
      });
    }
  }, [products]);

  const handleBuyNow = async (product) => {
    try {
      if (!stripePromise) {
        throw new Error('Stripe is not properly initialized');
      }

      console.log('Product data:', product);

      console.log('Attempting to fetch product details...');
      const productId = product.id;
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/product-details?id=${productId}`;
      console.log('Calling API URL:', apiUrl);

      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response Error:', {
          status: response.status,
          text: errorText,
          url: apiUrl
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const productDetails = await response.json();
      console.log('Success - Product Details:', productDetails);

      // Get the first variant's retail price
      const variant = productDetails.result.sync_variants[0];
      if (!variant?.retail_price) {
        throw new Error('Product price not available');
      }

      const priceInCents = Math.round(parseFloat(variant.retail_price) * 100);
      const stripe = await stripePromise;

      console.log('Creating checkout session with price:', priceInCents);

      const checkoutResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: variant.name || productDetails.result.name,
                images: [variant.files?.[0]?.preview_url || productDetails.result.thumbnail_url],
              },
              unit_amount: priceInCents,
            },
            quantity: 1,
          }],
        }),
      });

      if (!checkoutResponse.ok) {
        const errorText = await checkoutResponse.text();
        console.error('Checkout Error:', {
          status: checkoutResponse.status,
          text: errorText
        });
        throw new Error('Failed to create checkout session');
      }

      const { id } = await checkoutResponse.json();
      
      if (!id) throw new Error('Failed to create checkout session');

      console.log('Redirecting to checkout with session ID:', id);

      const result = await stripe.redirectToCheckout({
        sessionId: id
      });

      if (result.error) {
        console.error('Stripe redirect error:', result.error);
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Error in handleBuyNow:', error);
      setError('Payment system is currently unavailable');
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4FF99]"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  // Add a check for products array
  if (!Array.isArray(products)) {
    return (
      <section className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-500">No products available</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-black">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-[#D4FF99]">MERCH</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product.id}
              className="product-card bg-zinc-950 rounded-lg overflow-hidden border border-zinc-900 hover:border-[#D4FF99] transition-all duration-300"
            >
              {product.thumbnail_url && (
                <img 
                  src={product.thumbnail_url} 
                  alt={product.name} 
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-white text-xl font-bold mb-2">{product.name}</h3>
                {product.sync_variants && product.sync_variants[0] && (
                  <p className="text-[#D4FF99] text-lg font-medium mb-4">
                    ${parseFloat(product.sync_variants[0].retail_price).toFixed(2)}
                  </p>
                )}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleBuyNow(product);
                  }}
                  className="inline-block w-full text-center px-6 py-2 bg-[#D4FF99] hover:bg-[#bfe589] text-black font-medium rounded transition duration-300"
                >
                  BUY NOW
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MerchSection;