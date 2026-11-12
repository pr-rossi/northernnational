// Merch entries edited in Keystatic (Merch). Each is a JSON file in src/content/merch/,
// linked to a Printful product by ID. Printful stays the source for prices, sizes and checkout;
// these entries control the name, order, visibility and mockup images on the site.
const files = import.meta.glob('../content/merch/*.json', { eager: true, import: 'default' });

const ENTRIES = Object.values(files);
const byId = new Map(ENTRIES.filter((e) => e && e.printfulId).map((e) => [String(e.printfulId).trim(), e]));

export const normalize = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

export function getMerchEntry(printfulId) {
  return byId.get(String(printfulId)) || null;
}

// The image to show for a chosen variant: one tagged with its colour or size, else the main image.
export function imageForVariant(entry, variant) {
  const images = entry?.images?.filter((i) => i.image) || [];
  if (!images.length) return null;
  if (variant) {
    const keys = [variant.color, variant.size].map(normalize).filter(Boolean);
    const hit = images.find((i) => {
      const v = normalize(i.variant);
      return v && keys.some((k) => k === v || k.startsWith(v) || v.startsWith(k));
    });
    if (hit) return hit;
  }
  return images[0];
}

// Printful's product list, shaped and ordered for the site.
export function mergeProducts(printfulProducts) {
  return printfulProducts
    .map((p, index) => {
      const entry = getMerchEntry(p.id);
      const images = entry?.images?.filter((i) => i.image) || [];
      return {
        ...p,
        name: entry?.name || p.name,
        thumbnail_url: images[0]?.image || p.thumbnail_url,
        thumbnail_alt: images[0]?.alt || '',
        hover_url: images[1]?.image || null,
        featured: Boolean(entry?.featured),
        hidden: Boolean(entry?.hidden),
        sortKey: entry ? Number(entry.order ?? 10) : 1000 + index,
      };
    })
    .filter((p) => !p.hidden)
    .sort((a, b) => a.sortKey - b.sortKey);
}
