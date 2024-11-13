import { useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function Cart({ isOpen, onClose }) {
  const { cartItems, removeFromCart, getCartTotal } = useCart();
  const cartRef = useRef();
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      timerRef.current = setTimeout(() => {
        onClose();
      }, 2000);

      function handleClickOutside(event) {
        if (cartRef.current && !cartRef.current.contains(event.target)) {
          onClose();
        }
      }
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  const handleCartInteraction = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      onClose();
    }, 5000);
  };

  console.log('Cart Items:', cartItems);

  const handleCheckout = async () => {
    try {
      const items = cartItems.map(item => ({
        name: item.name,
        image: item.thumbnail_url,
        unit_amount: Math.round(parseFloat(item.sync_variants[0].retail_price) * 100),
        variantId: item.sync_variants[0].id.toString(),
      }));

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error initiating checkout:', error);
      alert('Failed to initiate checkout. Please try again.');
    }
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/75 flex justify-end z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onMouseMove={handleCartInteraction}
      onClick={handleCartInteraction}
    >
      <div 
        ref={cartRef} 
        className={`bg-zinc-900 w-full max-w-md p-6 overflow-y-auto transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Cart</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            ✕
          </button>
        </div>

        {(!cartItems || cartItems.length === 0) ? (
          <p className="text-zinc-400">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-zinc-800 p-4 rounded-lg">
                  <img 
                    src={item.thumbnail_url} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{item.name}</h3>
                    <p className="text-[#D4FF99]">
                      ${item.sync_variants?.[0]?.retail_price}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-zinc-400 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {cartItems.length > 0 && (
              <>
                <div className="border-t border-zinc-800 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>Total</span>
                    <span>${getCartTotal()}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full px-6 py-3 bg-[#D4FF99] hover:bg-[#bfe589] text-black font-bold rounded-lg transition-all duration-300"
                >
                  Checkout
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
} 