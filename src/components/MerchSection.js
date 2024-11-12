import React, { useEffect, useState, useRef } from 'react';

const MerchSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        const response = await fetch('/api/products');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Products data:', data);
        
        setProducts(data.result || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const initGSAP = async () => {
      if (typeof window !== 'undefined' && products.length > 0) {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);
        
        if (sectionRef.current) {
          gsap.from('.product-card', {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top center',
              end: 'bottom center',
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
          });
        }
      }
    };

    initGSAP();
  }, [products]);

  if (loading) {
    return (
      <section className="py-20 px-6 bg-black">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4FF99]"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-6 bg-black">
        <div className="text-red-500 text-center">
          Error loading products: {error}
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="py-20 px-6 bg-black">
        <div className="text-[#D4FF99] text-center">
          No products available
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
                <button
                  onClick={() => handleBuyNow(product)}
                  className="w-full px-6 py-2 bg-[#D4FF99] hover:bg-[#bfe589] text-black font-medium rounded transition duration-300"
                >
                  BUY NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MerchSection;