import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import LenisProvider from './components/LenisProvider';
import { useLenis } from '@studio-freight/react-lenis'
import { useInitialTransition } from './hooks/useInitialTransition';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Merch from './pages/Merch';
import Tour from './pages/Tour';
import Footer from './components/Footer';
import ProductDetails from './pages/ProductDetails';
import { Toaster, toast } from 'react-hot-toast';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/merch" element={<Merch />} />
        <Route path="/tour" element={<Tour />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useInitialTransition();
  const location = useLocation();
  const navigate = useNavigate();
  const lenis = useLenis();

  useEffect(() => {
    // Google Analytics initialization
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-47W02TXQRW';
    document.head.appendChild(script);

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', 'G-47W02TXQRW');
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    
    // Track page view
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search
      });
    }
  }, [location.pathname, location.search, lenis]);

  useEffect(() => {
    // Check URL parameters for success/cancel
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success')) {
      toast.success('Order placed successfully!', {
        icon: '🎉',
        style: {
          background: '#D4FF99',
          color: 'black',
        },
      });
      // Clean up URL and redirect to home
      navigate('/', { replace: true });
    } else if (urlParams.get('canceled')) {
      toast.error('Order was canceled', {
        icon: '❌',
        style: {
          background: '#ff4444',
          color: 'white',
        },
      });
      // Clean up URL and redirect to home
      navigate('/', { replace: true });
    }
  }, [location.search, navigate]);

  // Check if current path is a blog post
  const isBlogPost = location.pathname.startsWith('/blog/');

  return (
    <LenisProvider>
      <CartProvider>
        <div className="min-h-screen bg-zinc-950">
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 5000,
              style: {
                borderRadius: '10px',
                padding: '16px',
                fontWeight: '500',
              },
            }}
          />
          {!isBlogPost && <Navigation />}
          <AnimatedRoutes />
          {!isBlogPost && <Footer />}
        </div>
      </CartProvider>
    </LenisProvider>
  );
}

// Wrap App with Router since we need useLocation
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
