import { useEffect } from 'react';
import { useLenis } from '@studio-freight/react-lenis';
import PageTransition from '../components/PageTransition';
import TourBlock from '../components/TourBlock';

function Tour() {
  const lenis = useLenis();

  useEffect(() => {
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, [lenis]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-nn-bg">
        <TourBlock as="h1" page />
      </div>
    </PageTransition>
  );
}

export default Tour;
