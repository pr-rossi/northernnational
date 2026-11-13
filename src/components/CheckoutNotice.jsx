import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { showToast } from './ui/Toast';
import { track, takeCheckout } from '../lib/analytics';

// The site's single toast area. Stripe returns here with ?success or ?canceled after checkout.
export default function CheckoutNotice() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('success')) {
      const pending = takeCheckout();
      const sessionId = params.get('session_id');
      // GA4 purchase (transaction_id stops GA counting the same order twice).
      if (pending || sessionId) {
        track('purchase', {
          transaction_id: sessionId || `nn-${Date.now()}`,
          currency: 'USD',
          value: pending?.value ?? 0,
          items: pending?.items ?? [],
        });
      }
      showToast({
        tone: 'success',
        eyebrow: 'Order confirmed',
        title: 'Thanks for the support.',
        body: 'Stripe is emailing your receipt. We print your order and send tracking as soon as it ships.',
        duration: 9000,
      });
    } else if (params.has('canceled')) {
      showToast({
        tone: 'neutral',
        eyebrow: 'Checkout canceled',
        title: 'No charge made.',
        body: 'Your order wasn’t placed. The merch table is still open.',
        action: { label: 'Back to merch', href: '/merch' },
      });
    } else return;
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  return <Toaster position="bottom-center" gutter={12} containerStyle={{ bottom: 24 }} />;
}
