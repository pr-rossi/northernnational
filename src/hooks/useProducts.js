import { useEffect, useState } from 'react';
import { mergeProducts } from '../data/merch';

// products: null while loading, [] when the store is empty
export default function useProducts() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch('/api/products')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => alive && setProducts(mergeProducts(Array.isArray(d?.result) ? d.result : [])))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, []);

  return { products, error };
}
