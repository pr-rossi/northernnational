import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Stripe returns here with ?success or ?canceled after checkout.
export default function CheckoutNotice() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('success')) toast.success('Order placed. Thanks for supporting the band!');
    else if (params.has('canceled')) toast('Checkout canceled. Your order was not placed.');
    else return;
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  return (
    <Toaster
      position="top-center"
      toastOptions={{ duration: 5000, style: { background: '#EDEBE6', color: '#0B0B0B', borderRadius: '2px', fontWeight: 500 } }}
    />
  );
}
