import { useEffect } from 'react';

export function useInitialTransition() {
  useEffect(() => {
    // Set initial scroll lock
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.backgroundColor = '#09090B';

    // Remove scroll lock after initial page load
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, []);
} 