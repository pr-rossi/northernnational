import { ReactLenis } from '@studio-freight/react-lenis';

function LenisProvider({ children }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        orientation: 'vertical',
      }}
    >
      {children}
    </ReactLenis>
  );
}

export default LenisProvider; 