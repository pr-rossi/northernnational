import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import PageTransition from '../components/PageTransition';
import { useLenis } from '@studio-freight/react-lenis';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const lenis = useLenis();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    // Also reset Lenis scroll
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [lenis]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/product-details?id=${id}`);
        const data = await response.json();

        if (!response.ok) {
          console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            error: JSON.stringify(data)
          });
          throw new Error(data.error?.message || data.result || 'Failed to fetch product details');
        }

        if (!data.result) {
          throw new Error('No product data received');
        }

        console.log('Product data received:', data.result);
        setProduct(data.result);
        
        // Set first variant as default if available
        if (data.result.sync_variants?.length > 0) {
          setSelectedVariant(data.result.sync_variants[0]);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    const enrichedProduct = {
      ...product,
      sync_variants: [selectedVariant]
    };
    
    addToCart(enrichedProduct);
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;

    try {
      const productData = {
        name: `${product.name} - ${selectedVariant.name}`,
        images: [product.files?.[0]?.preview_url || product.thumbnail_url],
      };

      if (product.description && product.description.trim()) {
        productData.description = product.description;
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            name: productData.name,
            image: productData.images[0],
            unit_amount: Math.round(parseFloat(selectedVariant.retail_price) * 100),
            quantity: 1,
            variantId: selectedVariant.id.toString(),
            product_data: productData
          }],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Instead of directly redirecting, open in new tab
      const checkoutWindow = window.location.href = url;
      
      // Listen for messages from the checkout window
      window.addEventListener('message', function(event) {
        if (event.data === 'checkout-complete') {
          toast.success('Order placed successfully!');
          navigate('/');
        } else if (event.data === 'checkout-canceled') {
          toast.error('Order was canceled');
          navigate('/');
        }
      });

    } catch (error) {
      console.error('Error processing buy now:', error);
      toast.error('Failed to process purchase. Please try again.');
    }
  };

  // Helper function to get the correct image URL
  const getImageUrl = (product) => {
    return product?.sync_product?.thumbnail_url || product?.thumbnail_url;
  };

  // Helper function to simplify variant names
  const getSimpleSize = (variantName) => {
    // Split by '/' and get the last part, then trim whitespace
    return variantName.split('/').pop().trim();
  };

  // Custom size selector component
  const SizeSelector = ({ variants, selectedVariant, onSelect }) => {
    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Select Size
        </label>
        
        {/* Selected Size Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white flex items-center justify-between hover:bg-zinc-700 transition-colors"
        >
          <span>{selectedVariant ? selectedVariant.name : 'Select a size'}</span>
          <ChevronDown 
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg overflow-hidden"
            >
              {variants.map((variant) => (
                <motion.button
                  key={variant.id}
                  onClick={() => {
                    onSelect(variant);
                    setIsOpen(false);
                  }}
                  className={`w-full p-3 text-left hover:bg-[#D4FF99] hover:text-black transition-colors
                    ${selectedVariant?.id === variant.id 
                      ? 'bg-[#D4FF99] text-black' 
                      : 'text-white'}`}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  {variant.name}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay to close dropdown when clicking outside */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4FF99]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <PageTransition>
      <div className="pt-48 pb-32 min-h-screen bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              {product && (
                <img 
                  src={getImageUrl(product)} 
                  alt={product.name}
                  className="w-full rounded-lg"
                />
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              <h1 className="text-4xl font-bold text-white">{product?.name}</h1>
              <p className="text-gray-300">{product?.description}</p>
              
              {/* Price */}
              <div className="text-2xl font-bold text-white">
                ${selectedVariant?.retail_price || product?.retail_price}
              </div>

              {/* Custom Size Selector */}
              {product?.sync_variants && product.sync_variants.length > 1 && (
                <SizeSelector
                  variants={product.sync_variants}
                  selectedVariant={selectedVariant}
                  onSelect={setSelectedVariant}
                />
              )}

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                disabled={product?.sync_variants?.length > 1 && !selectedVariant}
                className={`w-full px-6 py-3 text-black font-bold rounded-lg transition-colors ${
                  product?.sync_variants?.length > 1 && !selectedVariant
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-[#D4FF99] hover:bg-[#bfe589]'
                }`}
              >
                {product?.sync_variants?.length > 1 && !selectedVariant ? 'Select a size' : 'Buy Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default ProductDetails; 