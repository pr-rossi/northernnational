import React from 'react';
import Button, { Arrow } from './ui/Button';
import useProducts from '../hooks/useProducts';
import ProductImage from './ProductImage';

const MAX = 4;

function SkeletonCard() {
  return (
    <div aria-hidden="true">
      <div className="aspect-square rounded-nn bg-nn-raised animate-pulse" />
      <div className="mt-4 h-5 w-3/4 rounded-nn bg-nn-raised animate-pulse" />
    </div>
  );
}

// Homepage merch: the items marked "Show on the homepage" in Keystatic (first four), as a fixed grid.
export default function MerchRail() {
  const { products: all, error } = useProducts();
  const products = all && (all.some((p) => p.featured) ? all.filter((p) => p.featured) : all).slice(0, MAX);
  const empty = !error && products && products.length === 0;

  return (
    <section aria-labelledby="merch-title" className="py-24 md:py-40 bg-nn-bg border-t border-nn-line">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <p className="label text-nn-muted mb-6">Merch</p>
            <h2 id="merch-title" className="display text-nn-text text-[min(12vw,56px)] md:text-[112px]">
              Wear it loud
            </h2>
          </div>
          <Button variant="secondary" to="/merch" className="shrink-0">
            Shop all merch <Arrow />
          </Button>
        </div>

        {error || empty ? (
          <div className="rounded-nn bg-nn-surface p-8 md:p-10">
            <p className="text-lead font-semibold [font-stretch:110%] text-nn-text">
              {error ? "The merch table didn't load." : 'The merch table is restocking.'}
            </p>
            <p className="mt-1 text-body text-nn-muted">
              {error ? 'Try the full shop, or refresh in a minute.' : 'New drops land here first. Check back soon.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 md:gap-x-5 gap-y-10" aria-busy={products === null}>
            {products === null
              ? Array.from({ length: MAX }).map((_, i) => <SkeletonCard key={i} />)
              : products.map((p) => (
                  <a
                    key={p.id}
                    href={`/product/${p.id}`}
                    className="group block rounded-nn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-action focus-visible:ring-offset-4 focus-visible:ring-offset-nn-bg"
                  >
                    <ProductImage product={p} className="aspect-square" />
                    <h3 className="mt-4 text-body md:text-lead font-bold [font-stretch:112%] tracking-[-0.01em] text-nn-text line-clamp-2 transition-colors duration-200 group-hover:text-nn-brand">
                      {p.name}
                    </h3>
                  </a>
                ))}
          </div>
        )}
      </div>
    </section>
  );
}
