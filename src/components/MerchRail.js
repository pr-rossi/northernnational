import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button, { Arrow } from './ui/Button';

function SkeletonCard() {
  return (
    <div className="w-[260px] md:w-[300px] shrink-0" aria-hidden="true">
      <div className="aspect-square rounded-nn bg-nn-raised animate-pulse" />
      <div className="mt-4 h-5 w-3/4 rounded-nn bg-nn-raised animate-pulse" />
      <div className="mt-2 h-4 w-1/3 rounded-nn bg-nn-raised animate-pulse" />
    </div>
  );
}

function RailButton({ dir, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Previous products' : 'Next products'}
      className="h-10 w-10 inline-flex items-center justify-center rounded-nn border border-nn-line text-nn-text
        transition-colors duration-200 hover:bg-white/5 hover:border-nn-text/60 active:bg-white/10
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-action focus-visible:ring-offset-2 focus-visible:ring-offset-nn-bg
        disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
    >
      <Arrow className={dir === 'prev' ? 'rotate-180' : ''} />
    </button>
  );
}

export default function MerchRail() {
  const [products, setProducts] = useState(null); // null = loading
  const [error, setError] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });
  const trackRef = useRef(null);

  useEffect(() => {
    let alive = true;
    fetch(`${process.env.REACT_APP_API_URL || ''}/api/products`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => alive && setProducts(Array.isArray(d?.result) ? d.result : []))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, []);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    updateEdges();
  }, [products, updateEdges]);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: (dir === 'next' ? 1 : -1) * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const empty = !error && products && products.length === 0;

  return (
    <section aria-labelledby="merch-title" className="py-24 md:py-32 bg-nn-bg overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <p className="text-meta text-nn-subtle mb-2">Merch</p>
            <h2 id="merch-title" className="font-thunder text-poster-sm md:text-poster text-nn-text">
              Wear it loud
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {products && products.length > 1 && (
              <div className="hidden md:flex gap-2 mr-2">
                <RailButton dir="prev" disabled={edges.start} onClick={() => scrollBy('prev')} />
                <RailButton dir="next" disabled={edges.end} onClick={() => scrollBy('next')} />
              </div>
            )}
            <Button variant="secondary" to="/merch">
              Shop all merch <Arrow />
            </Button>
          </div>
        </div>
      </div>

      {error || empty ? (
        <div className="mx-auto max-w-7xl px-5 md:px-6">
          <div className="rounded-nn bg-nn-surface p-8 md:p-10">
            <p className="text-lead text-nn-text">
              {error ? "The merch table didn't load." : 'The merch table is restocking.'}
            </p>
            <p className="mt-1 text-body text-nn-muted">
              {error ? 'Try the full shop, or refresh in a minute.' : 'New drops land here first. Check back soon.'}
            </p>
          </div>
        </div>
      ) : (
        <div
          ref={trackRef}
          onScroll={updateEdges}
          data-lenis-prevent-horizontal
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4
            px-5 md:px-[max(24px,calc((100vw-1280px)/2+24px))] scroll-px-5 md:scroll-px-[max(24px,calc((100vw-1280px)/2+24px))]
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products === null
            ? [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)
            : products.map((p) => {
                const price = p.sync_variants?.[0]?.retail_price;
                return (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="group w-[260px] md:w-[300px] shrink-0 snap-start rounded-nn
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-action focus-visible:ring-offset-4 focus-visible:ring-offset-nn-bg"
                  >
                    <div className="aspect-square overflow-hidden rounded-nn bg-nn-surface">
                      {p.thumbnail_url && (
                        <img
                          src={p.thumbnail_url}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                        />
                      )}
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-4">
                      <h3 className="text-body font-medium text-nn-text line-clamp-2">{p.name}</h3>
                      {price && (
                        <p className="text-body text-nn-muted shrink-0">
                          <span className="text-meta">$</span>
                          {parseFloat(price).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
        </div>
      )}
    </section>
  );
}
