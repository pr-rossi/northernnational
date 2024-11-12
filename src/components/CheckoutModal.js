import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe outside of component
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Checkout Form Component
function CheckoutForm({ clientSecret, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
        payment_method_data: {
          shipping: {
            name: 'shipping',
            address: {
              line1: '',
              line2: '',
              city: '',
              state: '',
              postal_code: '',
              country: 'US'
            }
          }
        }
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <div className="space-y-4">
        <div className="text-sm text-zinc-400">
          Shipping information will be collected during payment
        </div>
      </div>
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-zinc-300 hover:text-white"
          disabled={processing}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="px-6 py-2 bg-[#D4FF99] hover:bg-[#bfe589] text-black font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
}

// Modal Component
export default function CheckoutModal({ isOpen, onClose, product }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(validateEmail(newEmail));
  };

  const createPaymentIntent = async () => {
    if (!isEmailValid) return;

    console.log('Creating payment intent for:', product);
    
    const priceInCents = Math.round(parseFloat(product.sync_variants[0].retail_price) * 100);
    console.log('Price in cents:', priceInCents);

    const requestBody = {
      items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: [product.thumbnail_url],
          },
          unit_amount: priceInCents,
        },
        quantity: 1,
        product_id: product.id
      }],
      email: email,
      variantId: product.sync_variants[0].id
    };

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || 'Failed to create payment intent');
      }

      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Payment Intent Error:', error);
      setError(error.message);
    }
  };

  const handleSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
    onClose();
    // Navigate to success page or show success message
    window.location.href = '/success';
  };

  if (!isOpen || !product) return null;

  // Safely access product price
  const price = product.sync_variants?.[0]?.retail_price 
    ? parseFloat(product.sync_variants[0].retail_price).toFixed(2)
    : 'Price unavailable';

  return (
    <div className={`fixed inset-0 bg-black/75 flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-zinc-900 p-6 rounded-xl max-w-md w-full mx-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Complete Purchase</h2>
          <div className="flex items-center justify-between text-zinc-400 mb-4">
            <span>{product?.name}</span>
            <span>${product?.sync_variants?.[0]?.retail_price}</span>
          </div>

          {!clientSecret && (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#D4FF99]"
                  placeholder="your@email.com"
                />
              </div>
              <button
                onClick={createPaymentIntent}
                disabled={!isEmailValid}
                className="w-full px-6 py-2 bg-[#D4FF99] hover:bg-[#bfe589] text-black font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}

          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm 
                clientSecret={clientSecret}
                onSuccess={handleSuccess}
                onCancel={onClose}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
} 