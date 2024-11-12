import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { loadStripe } from '@stripe/stripe-js';

gsap.registerPlugin(ScrollTrigger);

const stripePromise = loadStripe('pk_live_51LuoloFR20GYDi9Z1aSXUDloBFockA4PcRyzjN0mr23NKjlmyx95josOePSPRzKpgHjtxdAjosPlyLfOiy82jn8j00xvrpHri1');

const MerchSection = () => {
  console.log('Stripe Key exists:', !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        // Detailed debug logging
        console.log('Raw API Response:', data);
        if (data.result) {
          console.log('First product example:', data.result[0]);
          console.log('First product variants:', data.result[0]?.variants);
        }

        if (data && data.result && Array.isArray(data.result)) {
          setProducts(data.result);
        } else {
          console.error('Invalid data structure:', data);
          throw new Error('Invalid data structure');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
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
      // Test basic API connectivity first
      console.log('Testing API connection...');
      const testResponse = await fetch('/api/test');
      console.log('Test API response:', await testResponse.text());

      // Then try the sync variant endpoint
      console.log('Attempting sync variant fetch...');
      const variantId = product.id;
      const apiUrl = `/api/sync-variant/${variantId}`;
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

      if (!productDetails.result?.retail_price) {
        throw new Error('Product price not available');
      }

      const priceInCents = Math.round(parseFloat(productDetails.result.retail_price) * 100);
      const stripe = await stripePromise;

      const checkoutResponse = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: productDetails.result.name || product.name,
                images: [productDetails.result.files[0]?.preview_url || product.thumbnail_url],
              },
              unit_amount: priceInCents,
            },
            quantity: 1,
          }],
        }),
      });

      const { id } = await checkoutResponse.json();
      
      if (!id) throw new Error('Failed to create checkout session');

      const result = await stripe.redirectToCheckout({
        sessionId: id
      });

      if (result.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error in handleBuyNow:', error);
      // Handle the error appropriately (e.g., show an error message to the user)
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