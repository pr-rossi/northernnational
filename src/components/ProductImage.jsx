import React from 'react';

// Product tile image. Mockups are transparent, so they sit whole on the tile; Printful photos fill it.
// A second image (e.g. the back of a shirt) crossfades in on hover.
export default function ProductImage({ product, className = '' }) {
  const isMockup = product.thumbnail_url?.startsWith('/images/merch/');
  const fit = isMockup ? 'object-contain p-[6%]' : 'object-cover';
  return (
    <div className={`relative overflow-hidden rounded-nn bg-nn-surface ${className}`}>
      {product.thumbnail_url && (
        <img
          src={product.thumbnail_url}
          alt={product.thumbnail_alt || ''}
          loading="lazy"
          className={`absolute inset-0 h-full w-full ${fit} transition-[opacity,transform] duration-500 ease-out
            group-hover:scale-[1.04] ${product.hover_url ? 'group-hover:opacity-0' : ''}`}
        />
      )}
      {product.hover_url && (
        <img
          src={product.hover_url}
          alt=""
          loading="lazy"
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full ${fit} opacity-0 scale-[1.02] transition-[opacity,transform] duration-500 ease-out
            group-hover:opacity-100 group-hover:scale-100`}
        />
      )}
    </div>
  );
}
