import { ReactLenis } from '@studio-freight/react-lenis'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

function LenisProvider({ children }) {
  const location = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

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