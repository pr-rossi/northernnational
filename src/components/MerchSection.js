import React, { useEffect, useState } from 'react';

const MerchSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your Printful API key and store ID
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://api.printful.com/store/products', {
          headers: {
            'Authorization': 'Bearer 9HwtyaRgwu3xYXSMSKGobi4v3BrHHPg1jVH11HFG'
          }
        });
        const data = await response.json();
        setProducts(data.result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="py-20 px-6 bg-black">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-[#D4FF99]">MERCH</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-zinc-950 rounded-lg overflow-hidden border border-zinc-900 hover:border-[#D4FF99] transition-all duration-300"
            >
              <img 
                src={product.thumbnail_url} 
                alt={product.name} 
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-white text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-400 mb-4">${product.retail_price}</p>
                <a 
                  href={product.direct_checkout_url}
                  target="_blank"
                  rel="noopener noreferrer"
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