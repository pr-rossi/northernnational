// Google Analytics 4 events. Safe when GA is blocked (ad blockers) or not loaded yet.
export function track(name, params = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', name, params);
  } catch {
    // never let analytics break the page
  }
}

const money = (n) => Math.round(parseFloat(n || 0) * 100) / 100;

// GA4 ecommerce item from a Printful product (+ optional chosen variant).
export function gaItem({ id, name, variant, price, listName, index }) {
  return {
    item_id: String(id),
    item_name: name,
    ...(variant ? { item_variant: variant } : {}),
    ...(price != null ? { price: money(price) } : {}),
    ...(listName ? { item_list_name: listName } : {}),
    ...(index != null ? { index } : {}),
    item_brand: 'Northern National',
    quantity: 1,
  };
}

// Remember what's being bought so the purchase event can be sent when Stripe redirects back.
const PENDING = 'nn-pending-checkout';
export function rememberCheckout(data) {
  try {
    sessionStorage.setItem(PENDING, JSON.stringify(data));
  } catch {}
}
export function takeCheckout() {
  try {
    const raw = sessionStorage.getItem(PENDING);
    sessionStorage.removeItem(PENDING);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export { money };
