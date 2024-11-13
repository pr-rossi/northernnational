import { ReactLenis } from '@studio-freight/react-lenis'

function LenisProvider({ children }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2
      }}
    >
      {children}
    </ReactLenis>
  );
}

export default LenisProvider; 