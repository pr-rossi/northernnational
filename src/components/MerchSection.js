import React from 'react';
import { Link } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import { Container } from './ui/Layout';

function ProductCard({ product }) {
  const price = product.sync_variants?.[0]?.retail_price;
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block rounded-nn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-text focus-visible:ring-offset-4 focus-visible:ring-offset-nn-bg"
    >
      <div className="aspect-[4/5] overflow-hidden rounded-nn bg-nn-surface">
        {product.thumbnail_url && (
          <img
            src={product.thumbnail_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        )}
      </div>
      <div className="mt-3 md:mt-4 flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
        <h2 className="text-body md:text-lead font-bold [font-stretch:112%] tracking-[-0.01em] text-nn-text line-clamp-2 transition-colors duration-200 group-hover:text-nn-brand">
          {product.name}
        </h2>
        {price && <p className="label text-nn-muted shrink-0">${parseFloat(price).toFixed(2)}</p>}
      </div>
    </Link>
  );
}

function Skeleton() {
  return (
    <div aria-hidden="true">
      <div className="aspect-[4/5] rounded-nn bg-nn-raised animate-pulse" />
      <div className="mt-4 h-6 w-2/3 rounded-nn bg-nn-raised animate-pulse" />
    </div>
  );
}

const grid = 'grid grid-cols-2 lg:grid-cols-3 gap-x-3 md:gap-x-5 gap-y-10 md:gap-y-12';

export default function MerchSection() {
  const { products, error } = useProducts();

  return (
    <Container className="pb-24 md:pb-40">
      {error || (products && products.length === 0) ? (
        <div className="rounded-nn bg-nn-surface p-8 md:p-12 max-w-[720px]">
          <p className="display text-nn-text text-[32px] md:text-[48px]">
            {error ? 'Store’s down.' : 'Sold out.'}
          </p>
          <p className="mt-4 text-lead text-nn-muted">
            {error
              ? 'The merch table didn’t load. Refresh in a minute, or come back later.'
              : 'Everything’s gone. New drops land here first, so check back soon.'}
          </p>
        </div>
      ) : (
        <div className={grid} aria-busy={products === null}>
          {products === null
            ? [0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} />)
            : products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </Container>
  );
}
