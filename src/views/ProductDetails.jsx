import { useState, useEffect, useMemo } from 'react';
import { showToast } from '../components/ui/Toast';
import Button, { Arrow } from '../components/ui/Button';
import { Container, Label } from '../components/ui/Layout';
import { getMerchEntry, imageForVariant, normalize } from '../data/merch';

// Printful returns { sync_product, sync_variants }
const printfulName = (p) => p?.sync_product?.name || p?.name || 'Merch';
const sizeOf = (v) => v?.size || String(v?.name || '').split('/').pop().trim();
const printfulImage = (p, v) =>
  v?.files?.find((f) => f.type === 'preview')?.preview_url || p?.sync_product?.thumbnail_url || p?.thumbnail_url;
const unique = (list) => [...new Set(list.filter(Boolean))];
const money = (n) => `$${parseFloat(n).toFixed(2)}`;

function BackLink() {
  return (
    <a
      href="/merch"
      className="intro-rise label inline-flex items-center gap-2 text-nn-muted hover:text-nn-text transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-text rounded-nn"
    >
      <Arrow className="rotate-180" /> All merch
    </a>
  );
}

const chip =
  'relative inline-flex items-center justify-center gap-2 rounded-nn border cursor-pointer font-semibold [font-stretch:112%] ' +
  'transition-colors duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-nn-text has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-nn-bg';

function OptionPicker({ legend, name, options, value, onChange, isAvailable = () => true, swatchFor }) {
  return (
    <fieldset>
      <legend className="label text-nn-muted mb-3">
        {legend}
        {value && <span className="ml-2 text-nn-text normal-case tracking-normal">{value}</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt;
          const available = isAvailable(opt);
          const swatch = swatchFor?.(opt);
          return (
            <label
              key={opt}
              title={opt}
              className={`${chip} ${swatch ? 'h-14 w-14 p-1' : 'min-w-[56px] h-12 px-4'}
                ${active ? 'border-nn-text bg-nn-text text-nn-bg' : 'border-nn-line text-nn-text hover:border-nn-text/60'}
                ${available ? '' : 'opacity-30 line-through cursor-not-allowed'}`}
            >
              <input
                type="radio"
                name={name}
                value={opt}
                checked={active}
                disabled={!available}
                onChange={() => onChange(opt)}
                className="sr-only"
              />
              {swatch ? (
                <>
                  <img src={swatch} alt="" className={`h-full w-full object-contain rounded-[1px] ${active ? 'bg-nn-text' : 'bg-nn-surface'}`} />
                  <span className="sr-only">{opt}</span>
                </>
              ) : (
                opt
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function ProductDetails({ id: idProp }) {
  // Static pages exist for known products; any other ID is served the same page and read from the URL.
  const id =
    idProp && idProp !== 'fallback'
      ? idProp
      : typeof window !== 'undefined'
      ? window.location.pathname.split('/').filter(Boolean).pop()
      : null;
  const entry = getMerchEntry(id);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buying, setBuying] = useState(false);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [shown, setShown] = useState(0); // index into the gallery
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/product-details?id=${encodeURIComponent(id)}`);
        const data = await response.json();
        if (!response.ok || !data.result) throw new Error('Failed to fetch product details');
        const variants = data.result.sync_variants || [];
        // Start on the variant matching the main mockup (e.g. the black OG shirt), else the first one.
        const lead = entry?.images?.[0]?.variant;
        const first =
          (lead && variants.find((v) => [v.color, v.size].some((k) => normalize(k).startsWith(normalize(lead))))) ||
          variants[0];
        setProduct(data.result);
        setColor(first?.color || null);
        setSize(first ? sizeOf(first) : null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProductDetails();
  }, [id, entry]);

  const variants = useMemo(() => product?.sync_variants || [], [product]);
  const colors = useMemo(() => unique(variants.map((v) => v.color)), [variants]);
  const sizes = useMemo(() => unique(variants.map(sizeOf)), [variants]);
  const selectedVariant =
    variants.find((v) => (colors.length < 2 || v.color === color) && (sizes.length < 2 || sizeOf(v) === size)) || null;

  // Gallery: Keystatic mockups when there are any, otherwise Printful's preview.
  const gallery = useMemo(() => {
    const own = entry?.images?.filter((i) => i.image) || [];
    if (own.length) return own.map((i) => ({ src: i.image, alt: i.alt || '' }));
    const src = printfulImage(product, selectedVariant);
    return src ? [{ src, alt: '' }] : [];
  }, [entry, product, selectedVariant]);

  // Picking a color or size jumps to the matching mockup.
  useEffect(() => {
    if (!entry?.images?.length || !selectedVariant) return;
    const hit = imageForVariant(entry, selectedVariant);
    const idx = entry.images.filter((i) => i.image).indexOf(hit);
    if (idx >= 0) setShown(idx);
  }, [entry, selectedVariant]);

  const swatchFor = (opt) => {
    const key = normalize(opt);
    const img = entry?.images?.find((i) => i.variant && (key.startsWith(normalize(i.variant)) || normalize(i.variant).startsWith(key)));
    return img?.image;
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    setBuying(true);
    try {
      const name = `${printfulName(product)} - ${selectedVariant.name.split(' / ').slice(1).join(' / ') || selectedVariant.name}`;
      const image = printfulImage(product, selectedVariant);
      const productData = { name, images: [image] };

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              name,
              image,
              unit_amount: Math.round(parseFloat(selectedVariant.retail_price) * 100),
              quantity: 1,
              variantId: selectedVariant.id.toString(),
              product_data: productData,
            },
          ],
        }),
      });
      if (!response.ok) throw new Error('Failed to create checkout session');
      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error('Error processing buy now:', err);
      showToast({
        tone: 'error',
        eyebrow: 'Checkout',
        title: 'That didn’t go through.',
        body: 'Checkout couldn’t open, and you weren’t charged. Try again in a moment.',
      });
      setBuying(false);
    }
  };

  const title = entry?.name || printfulName(product);
  const price = selectedVariant?.retail_price;
  const current = gallery[Math.min(shown, gallery.length - 1)];
  const isMockup = current?.src?.startsWith('/images/merch/');

  return (
      <div className="min-h-screen bg-nn-bg pt-32 md:pt-40 pb-24 md:pb-40">
        <Container>
          <BackLink />

          {loading && (
            <div className="mt-8 grid gap-10 md:grid-cols-12" aria-busy="true">
              <div className="md:col-span-7 aspect-square rounded-nn bg-nn-raised animate-pulse" />
              <div className="md:col-span-5 space-y-4">
                <div className="h-16 w-4/5 rounded-nn bg-nn-raised animate-pulse" />
                <div className="h-6 w-24 rounded-nn bg-nn-raised animate-pulse" />
                <div className="h-12 w-full rounded-nn bg-nn-raised animate-pulse" />
              </div>
            </div>
          )}

          {!loading && (error || !product) && (
            <div className="intro-rise mt-8 rounded-nn bg-nn-surface p-8 md:p-12 max-w-[720px]" style={{ '--d': '120ms' }}>
              <p className="display text-nn-text text-[32px] md:text-[48px]">Lost in the crowd.</p>
              <p className="mt-4 text-lead text-nn-muted">
                We couldn't load this item. It may be sold out, or the store is having a moment.
              </p>
              <div className="mt-8">
                <Button size="lg" to="/merch">
                  Browse all merch <Arrow />
                </Button>
              </div>
            </div>
          )}

          {!loading && product && !error && (
            <div className="mt-8 grid gap-10 md:gap-16 md:grid-cols-12 md:items-start">
              <div className="md:col-span-7 min-w-0">
                <div className="intro-media relative aspect-square overflow-hidden rounded-nn bg-nn-surface">
                  {current && (
                    <img
                      key={current.src}
                      src={current.src}
                      alt={current.alt || title}
                      className={`absolute inset-0 h-full w-full animate-[fadein_300ms_ease-out] ${isMockup ? 'object-contain p-[5%]' : 'object-cover'}`}
                    />
                  )}
                </div>
                {gallery.length > 1 && (
                  <div className="intro-rise mt-3 flex gap-3 overflow-x-auto" role="tablist" aria-label="Product photos" style={{ '--d': '300ms' }}>
                    {gallery.map((g, i) => (
                      <button
                        key={g.src}
                        type="button"
                        role="tab"
                        aria-selected={i === shown}
                        aria-label={g.alt || `Photo ${i + 1}`}
                        onClick={() => setShown(i)}
                        className={`h-20 w-20 shrink-0 rounded-nn bg-nn-surface p-1 border transition-colors duration-200
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-text
                          ${i === shown ? 'border-nn-text' : 'border-transparent hover:border-nn-line'}`}
                      >
                        <img src={g.src} alt="" className="h-full w-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-5 min-w-0 md:sticky md:top-28">
                <Label className="intro-rise mb-4" style={{ '--d': '80ms' }}>Merch</Label>
                <h1 className="intro-title display text-nn-text text-[40px] md:text-[56px]" style={{ '--d': '160ms' }}>
                  {title}
                </h1>
                {price && (
                  <p className="intro-rise mt-6 text-h4 font-bold [font-stretch:112%] text-nn-text" style={{ '--d': '300ms' }}>
                    <span className="text-lead text-nn-muted align-top mr-0.5">$</span>
                    {parseFloat(price).toFixed(2)}
                  </p>
                )}
                {(entry?.description || product.description) && (
                  <p className="intro-rise mt-6 text-body text-nn-muted whitespace-pre-line" style={{ '--d': '360ms' }}>{entry?.description || product.description}</p>
                )}

                <div className="intro-rise mt-8 space-y-6" style={{ '--d': '420ms' }}>
                  {colors.length > 1 && (
                    <OptionPicker
                      legend="Color"
                      name="color"
                      options={colors}
                      value={color}
                      onChange={(c) => {
                        setColor(c);
                        // keep the size if this color has it, else jump to the first size it does have
                        if (!variants.some((v) => v.color === c && sizeOf(v) === size)) {
                          const v = variants.find((x) => x.color === c);
                          if (v) setSize(sizeOf(v));
                        }
                      }}
                      swatchFor={swatchFor}
                    />
                  )}
                  {sizes.length > 1 && (
                    <OptionPicker
                      legend="Size"
                      name="size"
                      options={sizes}
                      value={size}
                      onChange={setSize}
                      isAvailable={(s) => colors.length < 2 || variants.some((v) => v.color === color && sizeOf(v) === s)}
                    />
                  )}
                </div>

                <div className="intro-rise mt-8" style={{ '--d': '520ms' }}>
                  <Button size="lg" className="w-full" onClick={handleBuyNow} loading={buying} disabled={!selectedVariant}>
                    {selectedVariant ? 'Buy now' : 'That combo is sold out'}
                    {price && selectedVariant && <span className="font-normal opacity-60">· {money(price)}</span>}
                  </Button>
                  <p className="mt-3 label text-nn-subtle">Secure checkout with Stripe. Printed to order.</p>
                </div>
              </div>
            </div>
          )}
        </Container>
      </div>
  );
}

export default ProductDetails;
