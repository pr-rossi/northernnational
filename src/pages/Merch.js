import { useEffect } from 'react';
import { useLenis } from '@studio-freight/react-lenis';
import PageTransition from '../components/PageTransition';
import MerchSection from '../components/MerchSection';
import { PageHeader } from '../components/ui/Layout';

function Merch() {
  const lenis = useLenis();

  useEffect(() => {
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, [lenis]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-nn-bg">
        <PageHeader
          label="Merch"
          title="Wear it loud"
          intro="Shirts, hoodies and the rest of the merch table. Printed to order and shipped to you."
        />
        <MerchSection />
      </div>
    </PageTransition>
  );
}

export default Merch;
