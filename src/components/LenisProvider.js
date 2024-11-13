import { ReactLenis } from '@studio-freight/react-lenis';
import { useEffect } from 'react';

function LenisProvider({ children }) {
  const lenisOptions = {
    duration: 1.2,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  };

  const onScroll = (e) => {
    // Optional: Add any scroll handling here
    console.log("Scrolling", e);
  };

  return (
    <ReactLenis
      root
      options={lenisOptions}
      onScroll={onScroll}
    >
      {children}
    </ReactLenis>
  );
}

export default LenisProvider; 