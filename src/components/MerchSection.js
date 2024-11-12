import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutModal from './CheckoutModal';

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
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const handleBuyNow = (product) => {
    console.log('Selected product:', product);
    if (!product.sync_variants?.[0]?.retail_price) {
      console.error('Invalid product data:', product);
      return;
    }
    setSelectedProduct(product);
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
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-[#D4FF99] text-center">MERCH</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {products.map((product) => (
            <div 
              key={product.id}
              className="product-card bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 hover:border-[#D4FF99] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#D4FF99]/10"
            >
              <div className="relative group">
                {product.thumbnail_url && (
                  <img 
                    src={product.thumbnail_url} 
                    alt={product.name} 
                    className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">{product.name}</h3>
                {product.sync_variants && product.sync_variants[0] && (
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[#D4FF99] text-2xl font-bold">
                      ${parseFloat(product.sync_variants[0].retail_price).toFixed(2)}
                    </p>
                    <span className="text-zinc-400 text-sm">
                      Free shipping on orders over $50
                    </span>
                  </div>
                )}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleBuyNow(product);
                  }}
                  className="inline-block w-full text-center px-6 py-3 bg-[#D4FF99] hover:bg-[#bfe589] text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  BUY NOW
                </a>
                <div className="mt-4 flex items-center justify-center space-x-2 text-zinc-500 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CheckoutModal 
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </section>
  );
};

export default MerchSection;