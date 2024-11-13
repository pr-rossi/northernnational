import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

function LenisProvider({ children }) {
  const location = useLocation()

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    // Reset scroll position on page change
    lenis.scrollTo(0, { immediate: true })

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [location.pathname])

  return children
}

export default LenisProvider 