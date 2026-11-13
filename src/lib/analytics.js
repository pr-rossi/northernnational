// Analytics events for Google Tag Manager. Pushed to the dataLayer; GTM forwards them to GA4
// (and any other tags set up there). Safe when GTM is blocked or still loading.
const ECOMMERCE = new Set(['view_item', 'select_item', 'begin_checkout', 'purchase']);

export function track(name, params = {}) {
  try {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    if (ECOMMERCE.has(name)) {
      // GA4 ecommerce via GTM expects the data under `ecommerce`; clear the previous one first.
      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({ event: name, ecommerce: params });
    } else {
      window.dataLayer.push({ event: name, ...params });
    }
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
