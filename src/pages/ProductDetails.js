import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import PageTransition from '../components/PageTransition';
import { useLenis } from '@studio-freight/react-lenis';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const lenis = useLenis();

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
          console.error('Printful API Error:', {
            status: response.status,
            statusText: response.statusText,
            error: JSON.stringify(data)
          });
          throw new Error(data.error?.message || data.result || 'Failed to fetch product details');
        }

        if (!data.result) {
          throw new Error('No product data received');
        }

        setProduct(data.result);
        // Set first variant as default
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
            variantId: selectedVariant.id,
            product_data: productData
          }],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location = url;
    } catch (error) {
      console.error('Error processing buy now:', error);
      alert('Failed to process purchase. Please try again.');
    }
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
            {/* Product Image - Updated to use files array */}
            <div>
              <img 
                src={product.files?.[0]?.preview_url || product.thumbnail_url} 
                alt={product.name}
                className="w-full rounded-lg"
              />
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              <h1 className="text-4xl font-bold text-white">{product.name}</h1>
              
              {selectedVariant && (
                <p className="text-3xl font-bold text-[#D4FF99]">
                  ${parseFloat(selectedVariant.retail_price).toFixed(2)}
                </p>
              )}

              {/* Variant Selection */}
              {product.sync_variants && product.sync_variants.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Select Size
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sync_variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 rounded-lg border ${
                          selectedVariant?.id === variant.id
                            ? 'border-[#D4FF99] text-[#D4FF99]'
                            : 'border-zinc-800 text-white hover:border-[#D4FF99]'
                        } transition-colors`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart & Buy Now Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant}
                  className="w-full px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!selectedVariant}
                  className="w-full px-6 py-3 bg-[#D4FF99] hover:bg-[#bfe589] text-black font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>

              {/* Product Description */}
              <div className="prose prose-invert max-w-none">
                <p>{product.description}</p>
              </div>

              {/* Shipping Info */}
              <p className="text-gray-400 text-sm">
                Free shipping on orders over $50
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default ProductDetails; 