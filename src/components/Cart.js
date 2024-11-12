import { useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function Cart({ isOpen, onClose }) {
  const { cartItems, removeFromCart, getCartTotal } = useCart();
  const cartRef = useRef();
  const timerRef = useRef(null);

  useEffect(() => {
    // Clear any existing timer when component unmounts or isOpen changes
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Set new timer for 5 seconds
      timerRef.current = setTimeout(() => {
        onClose();
      }, 3000);

      // Add click outside handler
      function handleClickOutside(event) {
        if (cartRef.current && !cartRef.current.contains(event.target)) {
          onClose();
        }
      }
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        // Clean up
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  // Reset timer when user interacts with cart
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
      const lineItems = cartItems.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.thumbnail_url],
          },
          unit_amount: Math.round(parseFloat(item.sync_variants[0].retail_price) * 100),
        },
        quantity: 1,
      }));

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: lineItems,
        }),
      });

      const { url } = await response.json();
      window.location = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/75 flex justify-end z-50"
      onMouseMove={handleCartInteraction}
      onClick={handleCartInteraction}
    >
      <div 
        ref={cartRef} 
        className="bg-zinc-900 w-full max-w-md p-6 overflow-y-auto"
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
              {cartItems.map((item) => {
                const price = item.sync_variants?.[0]?.retail_price;
                return (
                  <div key={item.id} className="flex items-center gap-4 bg-zinc-800 p-4 rounded-lg">
                    <img 
                      src={item.thumbnail_url} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <p className="text-[#D4FF99]">
                        ${price ? parseFloat(price).toFixed(2) : '0.00'}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-400 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

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
      </div>
    </div>
  );
} 