import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutModal from './CheckoutModal';
import { useCart } from '../context/CartContext';
import Cart from './Cart';
import './MerchSection.css';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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

const MerchSection = ({ 
  showTitle = true,
  showPadding = true,
  showBackground = true
}) => {
  console.log('Stripe Key exists:', !!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToCart, cartItems } = useCart();

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 50 // Start 50px below final position
    },
    show: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/product-details?id=${product.id}`);
      const productDetails = await response.json();
      
      if (!response.ok) {
        throw new Error(productDetails.details || 'Failed to fetch product details');
      }

      const variant = productDetails.result.sync_variants[0];
      console.log('Variant details:', variant);

      const checkoutResponse = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            name: product.name,
            image: product.thumbnail_url,
            unit_amount: Math.round(parseFloat(variant.retail_price) * 100),
            variantId: variant.id.toString(),
          }],
        }),
      });

      const { url } = await checkoutResponse.json();
      window.location = url;
    } catch (error) {
      console.error('Error processing buy now:', error);
      alert('Failed to process purchase. Please try again.');
    }
  };

  const handleAddToCart = async (product) => {
    console.log('Initial product:', product);
    
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/product-details?id=${product.id}`;
      console.log('Fetching product details from:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('Response status:', response.status);

      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.details || 'Failed to fetch product details');
      }

      if (!responseData.result?.sync_variants?.[0]) {
        console.error('Invalid product details structure:', responseData);
        throw new Error('Invalid product details structure');
      }

      const variant = responseData.result.sync_variants[0];
      console.log('Variant data:', variant);
      
      if (!variant.retail_price) {
        console.error('Missing retail price in variant:', variant);
        throw new Error('Product price not available');
      }

      const enrichedProduct = {
        ...product,
        sync_variants: [{
          retail_price: variant.retail_price,
          name: variant.name,
          files: variant.files,
          id: variant.id
        }]
      };

      console.log('Adding to cart:', enrichedProduct);
      addToCart(enrichedProduct);
      setIsCartOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.message || 'Failed to add product to cart. Please try again.');
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
    <section ref={sectionRef} className={`
      ${showPadding ? 'py-20 px-6' : ''} 
      ${showBackground ? 'bg-zinc-950' : ''}
    `}>
      <div className="max-w-7xl mx-auto">
        {showTitle && (
          <h2 className="text-4xl md:text-6xl font-bold text-[#D4FF99] mb-12">MERCH</h2>
        )}
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="bg-black p-6 rounded-lg border border-zinc-900"
            >
              <div className="relative group">
                {product.thumbnail_url && (
                  <img 
                    src={product.thumbnail_url} 
                    alt={product.name} 
                    className="w-full h-80 object-cover transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">{product.name}</h3>
                {product.sync_variants && product.sync_variants[0] && (
                  <p className="text-[#D4FF99] text-2xl font-bold mb-6">
                    ${parseFloat(product.sync_variants[0].retail_price).toFixed(2)}
                  </p>
                )}
                <Link
                  to={`/product/${product.id}`}
                  className="block w-full px-6 py-3 bg-[#D4FF99] hover:bg-[#bfe589] text-black font-bold rounded-lg transition-colors text-center"
                >
                  View Product
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </section>
  );
};

export default MerchSection;