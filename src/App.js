import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Mail, Instagram, Twitter, ChevronDown, ExternalLink, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ReleaseCard from './components/ReleaseCard';
import ShowCard from './components/ShowCard';
import NoShows from './components/NoShows';
import MerchSection from './components/MerchSection';
import FeaturedBlogs from './components/FeaturedBlogs';
import { CartProvider } from './context/CartContext';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import PageTransition from './components/PageTransition';
import LenisProvider from './components/LenisProvider';
import { useLenis } from '@studio-freight/react-lenis'
import { motion } from 'framer-motion';
import { useInitialTransition } from './hooks/useInitialTransition';
import Navigation from './components/Navigation';
import Merch from './pages/Merch';
import Tour from './pages/Tour';
import Footer from './components/Footer';

function HomePage() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const heroImageRef = useRef(null);
  const releaseCardsRef = useRef([]);
  const lenis = useLenis()

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Hero image scale effect
    gsap.to(heroImageRef.current, {
      scale: 1.2,
      ease: "none",
      scrollTrigger: {
        trigger: heroImageRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Split text into spans for animation
    if (titleRef.current) {
      const text = titleRef.current.innerText;
      const characters = text.split('');
      
      titleRef.current.innerHTML = characters
        .map((char, index) => char === ' ' 
          ? '<span style="display: inline-block; margin: 0 0.1em;">&nbsp;</span>' 
          : `<span style="display: inline-block; transform: translateY(100px); opacity: 0;">${char}</span>`
        )
        .join('');

      // Animate each character
      const chars = titleRef.current.querySelectorAll('span');
      chars.forEach((char, index) => {
        gsap.fromTo(char, 
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: 0.5 + (index * 0.04),
            ease: "power4.out"
          }
        );
      });
    }

    // Subtitle animation
    if (subtitleRef.current) {
      gsap.fromTo(subtitleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 1.2,
          ease: "power4.out"
        }
      );
    }

    // Release cards stagger animation
    gsap.from(releaseCardsRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: releaseCardsRef.current[0],
        start: "top bottom-=100",
        toggleActions: "play none none reverse"
      }
    });
  }, []);

  // Data for releases with URLs
  const releases = [
    {
      title: "LATEST SINGLE",
      description: "Stream our latest single now on all major platforms",
      url: "https://open.spotify.com/track/1rM0BBBaWZ0OMQtPHVZatl?si=49e44d58176846ff"
    },
    {
      title: "THIS IS NORTHERN NATIONAL",
      description: "Listen to all our music on our official Spotify playlist!",
      url: "https://open.spotify.com/playlist/37i9dQZF1DZ06evO4daEGQ?si=78a79f6bacdd4641"
    }
  ];

  // Data for shows with venue and ticket URLs
  const shows = [
    // {
    //   date: "DEC 15",
    //   venue: "The Bomb Factory - Dallas, TX",
    //   venueUrl: "https://thebombfactory.com",
    //   ticketUrl: "https://tickets.thebombfactory.com/event/your-event"
    // }
  ];

  return (
    <PageTransition>
      <div className="App">
        {/* Hero Section */}
        <header className="min-h-dvh flex items-center justify-center relative overflow-hidden">
          <div className="ripple-background absolute inset-0">
            <div 
              ref={heroImageRef}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-75 origin-center"
              style={{
                backgroundImage: `url('/images/the-boys-show.jpeg')`
              }}
            />
          </div>

          {/* Gradient overlay */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.9))',
              zIndex: 1
            }}
          />

          <div className="z-10 text-center space-y-6 px-4">
            <h1 
                ref={titleRef}
                className="hero-title text-4xl md:text-8xl font-thunder text-white"
              >
                NORTHERN NATIONAL
              </h1>
            <p 
              ref={subtitleRef}
              className="text-xl md:text-2xl text-[#D4FF99]"
            >
              Alternative Rock Band from Dallas, TX
            </p>
          </div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <ChevronDown 
            className="w-8 h-8 text-[#D4FF99] animate-bounce cursor-pointer"
            onClick={() => {
              lenis?.scrollTo(window.innerHeight, {
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
              });
            }}
          />
        </div>
        </header>

        {/* About Section */}
        <section className="py-32 px-6 bg-zinc-950 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Text Content */}
              <div className="space-y-8">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-5xl md:text-6xl font-bold text-[#D4FF99]"
                >
                  ABOUT THE BOYS
                </motion.h2>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-6"
                >
                  <p className="text-xl text-gray-300 leading-relaxed">
                    Northern National brings raw energy and authentic storytelling to the alternative rock scene. 
                    With powerful vocals, driving guitars, and dynamic performances, we create an unforgettable 
                    experience that resonates with audiences everywhere.
                  </p>
                  
                  <p className="text-xl text-gray-300 leading-relaxed">
                    Based in Dallas, TX, we've been crafting our unique sound since 2016, blending modern rock 
                    with atmospheric elements and honest lyrics that speak to the human experience.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <a 
                    href="https://open.spotify.com/artist/77uddrwADVuSI16ASFWF3c?si=bVUiHtZyS-u8cE4CuxYLFA" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-[#D4FF99] text-black px-6 py-3 rounded-full 
                               font-medium hover:bg-white transition-colors duration-300"
                  >
                    <span>LISTEN ON SPOTIFY</span>
                    <ExternalLink size={20} />
                  </a>
                </motion.div>
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4"
                >
                  <div className="aspect-[3/4] rounded-lg overflow-hidden">
                    <img 
                      src="/images/nn-boys-show.jpg" 
                      alt="Northern National performance" 
                      className="w-full h-full object-cover object-left"
                    />
                  </div>
                  <div className="aspect-[3/4] rounded-lg overflow-hidden">
                    <img 
                      src="/images/rossi.jpg" 
                      alt="Northern National backstage" 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-4 pt-8"
                >
                  <div className="aspect-[3/4] rounded-lg overflow-hidden">
                    <img 
                      src="/images/anthony.jpg" 
                      alt="Northern National studio session" 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="aspect-[3/4] rounded-lg overflow-hidden">
                    <img 
                      src="/images/dylan.jpg" 
                      alt="Northern National candid" 
                      className="w-full h-full object-cover object-right"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Music Section */}
        <section className="py-20 px-6 bg-black">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-[#D4FF99]">LATEST RELEASES</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {releases.map((release, index) => (
                <div 
                  key={index}
                  ref={el => releaseCardsRef.current[index] = el}
                >
                  <ReleaseCard 
                    title={release.title}
                    description={release.description}
                    url={release.url}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <MerchSection 
          showTitle={true}
          showPadding={true}
          showBackground={true}
        />

        {/* Tour Section */}
        <section className="py-20 px-6 bg-zinc-950">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-[#D4FF99]">TOUR DATES</h2>
            <div className="space-y-4">
              {shows.length > 0 ? (
                shows.map((show, index) => (
                  <ShowCard
                    key={index}
                    date={show.date}
                    venue={show.venue}
                    venueUrl={show.venueUrl}
                    ticketUrl={show.ticketUrl}
                  />
                ))
              ) : (
                <NoShows />
              )}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-32 px-6 bg-zinc-950">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row justify-between items-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#D4FF99]">LATEST NEWS</h2>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link 
                  to="/blog"
                  className="inline-flex items-center space-x-2 text-white hover:text-[#D4FF99] transition-colors duration-300"
                >
                  <span>VIEW ALL</span>
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <FeaturedBlogs limit={3} />
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="mailing-list" className="py-20 px-6 bg-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-[#D4FF99]">CONNECT WITH US</h2>
            <div className="flex justify-center space-x-8 mb-12">
              <a 
                href="https://instagram.com/northernnational" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#D4FF99] transition duration-300"
              >
                <Instagram className="w-8 h-8" />
              </a>
              <a 
                href="https://twitter.com/northernnational" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#D4FF99] transition duration-300"
              >
                <Twitter className="w-8 h-8" />
              </a>
              <a 
                href="mailto:contact@northernnational.com"
                className="text-white hover:text-[#D4FF99] transition duration-300"
              >
                <Mail className="w-8 h-8" />
              </a>
            </div>
            <div className="bg-zinc-950 p-8 rounded-lg shadow-lg">
              <form
                action="https://northernnationalmusic.us17.list-manage.com/subscribe/post?u=22d3f967aaa29a31ccd2275a1&amp;id=7e228c82dc&amp;f_id=0048c2e1f0"
                method="post"
                id="mc-embedded-subscribe-form"
                name="mc-embedded-subscribe-form"
                className="validate"
                target="_blank"
              >
                <h3 className="text-xl font-bold mb-4 text-white">JOIN OUR MAILING LIST</h3>
                <div className="flex flex-col sm:flex-row max-w-md mx-auto space-y-2 sm:space-y-0">
                  <input
                    type="email"
                    name="EMAIL"
                    className="flex-1 p-2 bg-black border border-zinc-800 rounded sm:rounded-l focus:outline-none focus:border-[#D4FF99]"
                    id="mce-EMAIL"
                    placeholder="Enter your email"
                    required
                  />
                  <button 
                    type="submit"
                    name="subscribe"
                    id="mc-embedded-subscribe"
                    className="px-6 py-2 bg-[#D4FF99] hover:bg-[#bfe589] text-black font-medium rounded sm:rounded-r transition duration-300"
                  >
                    SUBSCRIBE
                  </button>
                </div>
                {/* Bot protection - don't remove */}
                <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                  <input type="text" name="b_22d3f967aaa29a31ccd2275a1_7e228c82dc" tabIndex="-1" value="" />
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/merch" element={<Merch />} />
          <Route path="/tour" element={<Tour />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  useInitialTransition();

  return (
    <Router>
      <LenisProvider>
        <CartProvider>
          <div className="min-h-screen bg-zinc-950">
            <Navigation />
            <AnimatedRoutes />
            <Footer />
          </div>
        </CartProvider>
      </LenisProvider>
    </Router>
  );
}

export default App;
