import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { useLenis } from '@studio-freight/react-lenis';
import toast from 'react-hot-toast';
import Button, { Arrow } from '../components/ui/Button';
import { Container, Label } from '../components/ui/Layout';

// Printful returns { sync_product, sync_variants }
const productName = (p) => p?.sync_product?.name || p?.name || 'Merch';
const sizeOf = (v) => v?.size || String(v?.name || '').split('/').pop().trim();
const imageFor = (p, v) =>
  v?.files?.find((f) => f.type === 'preview')?.preview_url || p?.sync_product?.thumbnail_url || p?.thumbnail_url;

function BackLink() {
  return (
    <Link
      to="/merch"
      className="label inline-flex items-center gap-2 text-nn-muted hover:text-nn-text transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-text rounded-nn"
    >
      <Arrow className="rotate-180" /> All merch
    </Link>
  );
}

function SizePicker({ variants, selected, onSelect }) {
  return (
    <fieldset>
      <legend className="label text-nn-muted mb-3">Size</legend>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const active = selected?.id === v.id;
          return (
            <label
              key={v.id}
              className={`relative min-w-[56px] h-12 px-4 inline-flex items-center justify-center rounded-nn border cursor-pointer
                font-semibold [font-stretch:112%] transition-colors duration-200
                has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-nn-text has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-nn-bg
                ${active ? 'bg-nn-text text-nn-bg border-nn-text' : 'border-nn-line text-nn-text hover:border-nn-text/60'}`}
            >
              <input
                type="radio"
                name="size"
                value={v.id}
                checked={active}
                onChange={() => onSelect(v)}
                className="sr-only"
              />
              {sizeOf(v)}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buying, setBuying] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, [lenis]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/product-details?id=${id}`);
        const data = await response.json();
        if (!response.ok || !data.result) throw new Error('Failed to fetch product details');
        setProduct(data.result);
        if (data.result.sync_variants?.length > 0) setSelectedVariant(data.result.sync_variants[0]);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProductDetails();
  }, [id]);

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    setBuying(true);
    try {
      const name = `${productName(product)} - ${selectedVariant.name}`;
      const image = imageFor(product, selectedVariant);
      const productData = { name, images: [image] };
      if (product.description && product.description.trim()) productData.description = product.description;

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
      toast.error("Sorry, checkout didn't open. Please try again.");
      setBuying(false);
    }
  };

  const variants = product?.sync_variants || [];
  const price = selectedVariant?.retail_price;

  return (
    <PageTransition>
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
            <div className="mt-8 rounded-nn bg-nn-surface p-8 md:p-12 max-w-[720px]">
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
              <div className="md:col-span-7 aspect-square overflow-hidden rounded-nn bg-nn-surface">
                <img src={imageFor(product, selectedVariant)} alt={productName(product)} className="h-full w-full object-cover" />
              </div>

              <div className="md:col-span-5 md:sticky md:top-28">
                <Label className="mb-4">Merch</Label>
                <h1 className="display text-nn-text text-[40px] md:text-[56px]">{productName(product)}</h1>
                {price && (
                  <p className="mt-6 text-h4 font-bold [font-stretch:112%] text-nn-text">
                    <span className="text-lead text-nn-muted align-top mr-0.5">$</span>
                    {parseFloat(price).toFixed(2)}
                  </p>
                )}
                {product.description && <p className="mt-6 text-body text-nn-muted">{product.description}</p>}

                {variants.length > 1 && (
                  <div className="mt-8">
                    <SizePicker variants={variants} selected={selectedVariant} onSelect={setSelectedVariant} />
                  </div>
                )}

                <div className="mt-8">
                  <Button size="lg" className="w-full" onClick={handleBuyNow} loading={buying} disabled={!selectedVariant}>
                    {selectedVariant ? `Buy ${variants.length > 1 ? `size ${sizeOf(selectedVariant)}` : 'now'}` : 'Choose a size'}
                    {price && <span className="font-normal opacity-60">· ${parseFloat(price).toFixed(2)}</span>}
                  </Button>
                  <p className="mt-3 label text-nn-subtle">Secure checkout with Stripe. Printed to order.</p>
                </div>
              </div>
            </div>
          )}
        </Container>
      </div>
    </PageTransition>
  );
}

export default ProductDetails;
