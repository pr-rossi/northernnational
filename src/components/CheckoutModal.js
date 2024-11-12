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

  useEffect(() => {
    if (isOpen && product && product.sync_variants?.[0]?.retail_price) {
      // Create payment intent when modal opens
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: product.name,
                images: [product.thumbnail_url],
              },
              unit_amount: Math.round(parseFloat(product.sync_variants[0].retail_price) * 100),
            },
            quantity: 1,
          }],
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error('Payment Intent Error:', data.error);
          } else {
            setClientSecret(data.clientSecret);
          }
        })
        .catch((error) => console.error('Fetch Error:', error));
    }
  }, [isOpen, product]);

  const handleSuccess = (paymentIntent) => {
    onClose();
    // Navigate to success page or show success message
    window.location.href = '/success';
  };

  if (!isOpen || !product || !clientSecret) return null;

  // Safely access product price
  const price = product.sync_variants?.[0]?.retail_price 
    ? parseFloat(product.sync_variants[0].retail_price).toFixed(2)
    : 'Price unavailable';

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-6 rounded-xl max-w-md w-full mx-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Complete Purchase</h2>
          <div className="flex items-center justify-between text-zinc-400">
            <span>{product.name}</span>
            <span>${price}</span>
          </div>
        </div>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm 
            clientSecret={clientSecret}
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        </Elements>
      </div>
    </div>
  );
} 