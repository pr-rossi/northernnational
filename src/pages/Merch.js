import { useEffect } from 'react';
import { useLenis } from '@studio-freight/react-lenis';
import PageTransition from '../components/PageTransition';
import MerchSection from '../components/MerchSection';

function Merch() {
  const lenis = useLenis();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    // Also reset Lenis scroll
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [lenis]);

  return (
    <PageTransition>
      <div className="pt-48 pb-32 min-h-screen bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-[#D4FF99] mb-12">MERCH</h1>
          <MerchSection 
            showTitle={false}
            showPadding={false}
            showBackground={false}
          />
        </div>
      </div>
    </PageTransition>
  );
}

export default Merch; 