import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useLenis } from '@studio-freight/react-lenis';
import PageTransition from '../components/PageTransition';
import FeaturedBlogs from '../components/FeaturedBlogs';
import MerchRail from '../components/MerchRail';
import ShowAlertsForm from '../components/ShowAlertsForm';
import Button, { Arrow, Sun } from '../components/ui/Button';

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------
const LINKS = {
  single: 'https://open.spotify.com/track/1rM0BBBaWZ0OMQtPHVZatl?si=49e44d58176846ff',
  playlist: 'https://open.spotify.com/playlist/37i9dQZF1DZ06evO4daEGQ?si=78a79f6bacdd4641',
  artist: 'https://open.spotify.com/artist/77uddrwADVuSI16ASFWF3c?si=bVUiHtZyS-u8cE4CuxYLFA',
};

const LATEST = {
  title: 'IDGAF',
  released: '2024-01-05',
  cover: '/images/idgaf-cover.jpg',
  lyric: ["You don't gotta say it", 'I already know it'],
  story: '/blog/post-2',
};

// Add shows here: { date: '2027-03-14', city: 'Dallas', region: 'TX', venue: 'The Bomb Factory', ticketUrl: 'https://…' }
const SHOWS = [];

const TICKER = ['IDGAF out now', 'Alternative rock from Dallas, TX', 'Writing loud since 2016', 'Shows announced here first'];

const ease = [0.22, 1, 0.36, 1];

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------
function Container({ className = '', children }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 md:px-6 ${className}`}>{children}</div>;
}

function Eyebrow({ children, className = '' }) {
  return <p className={`text-meta text-nn-subtle mb-3 ${className}`}>{children}</p>;
}

function Hero({ onAlerts }) {
  const imgRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !imgRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.to(imgRef.current, {
      scale: 1.12,
      yPercent: 6,
      ease: 'none',
      scrollTrigger: { trigger: imgRef.current, start: 'top top', end: 'bottom top', scrub: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduce]);

  // Attention layers: caption -> title -> actions (MO1)
  const layer = (i) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: [0.45, 0, 0.55, 1], delay: 0.3 + i * 0.18 },
        };

  return (
    <header className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden bg-nn-bg">
      <div
        ref={imgRef}
        className="absolute inset-0 bg-cover bg-[center_30%] origin-top"
        style={{ backgroundImage: "url('/images/the-boys-show.jpeg')" }}
        role="img"
        aria-label="Northern National on stage under white lights"
      />
      {/* Single-color scrim, clear at the top so the stage reads (E8) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.10) 30%, rgba(10,10,10,0.70) 62%, #0A0A0A 100%)',
        }}
      />

      <Container className="relative z-10 pt-40">
        <motion.p {...layer(0)} className="text-body md:text-lead text-nn-text/90 max-w-[600px]">
          Alternative rock from Dallas, TX. New single <span className="font-medium text-nn-text">IDGAF</span> is out now.
        </motion.p>
        <motion.div {...layer(2)} className="mt-6 flex flex-wrap gap-3">
          <Button size="lg" href={LINKS.single}>
            <PlayGlyph /> Play IDGAF
          </Button>
          <Button size="lg" variant="secondary" href="#tour" onClick={onAlerts}>
            Get show alerts
          </Button>
        </motion.div>
      </Container>

      {/* The wordmark is the poster: full width, cropped by the bottom edge */}
      <motion.h1
        {...layer(1)}
        className="relative z-10 mt-8 md:mt-10 px-3 md:px-6 font-thunder text-nn-text leading-[0.78] tracking-[-0.01em]
          text-[clamp(6rem,30vw,9.5rem)] md:text-[calc((100vw-40px)/5.25)] mb-[-0.1em] select-none"
      >
        <span className="block md:inline">Northern</span> <span className="block md:inline">National</span>
      </motion.h1>
    </header>
  );
}

function PlayGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M3 1.5v11L12.5 7z" fill="currentColor" />
    </svg>
  );
}

function Ticker() {
  const [paused, setPaused] = useState(false);
  const items = [...TICKER, ...TICKER];
  return (
    <div className="relative bg-nn-action text-nn-on-action overflow-hidden" aria-label="Announcements">
      <div
        className="flex w-max animate-marquee motion-reduce:[animation-play-state:paused] py-3"
        style={paused ? { animationPlayState: 'paused' } : undefined}
        aria-hidden="true"
      >
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-6 pr-6 font-thunder text-[32px] leading-[32px] whitespace-nowrap">
            {t}
            <Sun className="h-5 w-5 shrink-0" />
          </span>
        ))}
      </div>
      <p className="sr-only">{TICKER.join('. ')}.</p>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? 'Play announcements' : 'Pause announcements'}
        className="absolute right-0 top-0 bottom-0 w-14 flex items-center justify-center bg-nn-action
          shadow-[-16px_0_16px_#D4FF99] hover:bg-nn-action-hover transition-colors duration-100
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-nn-on-action"
      >
        {paused ? (
          <PlayGlyph />
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 2h3v10H3zM8 2h3v10H8z" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
}

function LatestRelease() {
  const date = new Date(LATEST.released + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  return (
    <section id="music" aria-labelledby="latest-title" className="py-24 md:py-32 bg-nn-bg">
      <Container className="grid gap-10 md:grid-cols-12 md:gap-10 items-center">
        <a
          href={LINKS.single}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Play IDGAF on Spotify"
          className="group md:col-span-6 relative block aspect-square overflow-hidden rounded-nn shadow-e6
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-action focus-visible:ring-offset-4 focus-visible:ring-offset-nn-bg"
        >
          <img
            src={LATEST.cover}
            alt="IDGAF cover art: a cyan figure with three silhouettes and three suns above her head"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
          <span
            className="absolute bottom-5 left-5 h-14 w-14 flex items-center justify-center rounded-full bg-nn-action text-nn-on-action shadow-e5
              scale-90 opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-visible:opacity-100"
            aria-hidden="true"
          >
            <PlayGlyph />
          </span>
        </a>

        <div className="md:col-span-6 md:pl-6">
          <Eyebrow>Latest single · {date}</Eyebrow>
          <h2 id="latest-title" className="font-thunder text-nn-text text-[120px] leading-[96px] md:text-poster-lg">
            {LATEST.title}
          </h2>
          <blockquote className="mt-6 mb-0 mx-0 py-0 pr-0 border-l-2 border-nn-action pl-5 not-italic bg-transparent rounded-none text-body">
            <p className="text-lead text-nn-text">
              {LATEST.lyric[0]}
              <br />
              {LATEST.lyric[1]}
            </p>
            <footer className="mt-2 text-meta text-nn-subtle">First lines of IDGAF</footer>
          </blockquote>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" href={LINKS.single}>
              <PlayGlyph /> Play on Spotify
            </Button>
            <Button size="lg" variant="secondary" to={LATEST.story}>
              Read the story behind it
            </Button>
          </div>
          <a
            href={LINKS.playlist}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-body text-nn-muted hover:text-nn-text transition-colors duration-200
              underline decoration-nn-line underline-offset-4 hover:decoration-nn-text"
          >
            Hear everything on This Is Northern National <Arrow external />
          </a>
        </div>
      </Container>
    </section>
  );
}

function About() {
  return (
    <section aria-labelledby="about-title" className="py-24 md:py-32 bg-nn-surface">
      <Container className="grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <Eyebrow>About</Eyebrow>
          <h2 id="about-title" className="font-thunder text-nn-text text-poster-sm md:text-poster">
            Built in Dallas. Played loud.
          </h2>
          <p className="mt-6 text-lead text-nn-muted max-w-[460px]">
            Northern National is an alternative rock band from Dallas, TX. Since 2016 we've been writing songs with driving
            guitars, atmospheric layers and honest lyrics about the stuff people don't always say out loud.
          </p>
          <div className="mt-8">
            <Button variant="tertiary" href={LINKS.artist}>
              Follow us on Spotify <Arrow external />
            </Button>
          </div>
        </div>

        <div className="md:col-span-7 grid grid-cols-6 gap-3 md:gap-4 self-start">
          <img
            src="/images/nn-boys-show.jpg"
            alt="The band mid-song on stage"
            loading="lazy"
            className="col-span-6 aspect-[16/10] w-full object-cover rounded-nn"
          />
          {[
            ['/images/rossi.jpg', 'Guitarist playing under blue light', 'object-center'],
            ['/images/anthony.jpg', 'Drummer behind the kit', 'object-center'],
            ['/images/dylan.jpg', 'Bassist playing under red light', 'object-right'],
          ].map(([src, alt, pos]) => (
            <img
              key={src}
              src={src}
              alt={alt}
              loading="lazy"
              className={`col-span-2 aspect-[3/4] w-full object-cover rounded-nn ${pos}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function Tour() {
  const reduce = useReducedMotion();
  const reveal = (i) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 40 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-80px' },
          transition: { duration: 0.8, ease, delay: i * 0.15 },
        };

  return (
    <section id="tour" aria-labelledby="tour-title" className="py-24 md:py-32 bg-nn-bg scroll-mt-20">
      <Container>
        <Eyebrow>Tour</Eyebrow>
        {SHOWS.length === 0 ? (
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <h2
              id="tour-title"
              className="md:col-span-7 font-thunder text-nn-text text-[112px] leading-[88px] md:text-[200px] md:leading-[160px]"
            >
              <motion.span {...reveal(0)} className="block">
                No dates
              </motion.span>
              <motion.span {...reveal(1)} className="block text-nn-text/45">
                yet.
              </motion.span>
            </h2>
            <motion.div {...reveal(2)} className="md:col-span-5 md:pb-4">
              <p className="text-lead text-nn-text mb-6 max-w-[420px]">
                Dallas always hears first. Get an email the day new shows are announced.
              </p>
              <ShowAlertsForm id="tour-alerts" />
            </motion.div>
          </div>
        ) : (
          <>
            <h2 id="tour-title" className="font-thunder text-nn-text text-poster-sm md:text-poster mb-10">
              Upcoming shows
            </h2>
            <ul className="divide-y divide-nn-line border-y border-nn-line">
              {SHOWS.map((s, i) => {
                const d = new Date(s.date + 'T12:00:00');
                return (
                  <motion.li
                    key={s.date + s.city}
                    {...reveal(i)}
                    className="grid grid-cols-[72px_1fr] md:grid-cols-[120px_1fr_auto] items-center gap-x-6 gap-y-3 py-6"
                  >
                    <time dateTime={s.date} className="font-thunder text-nn-text text-[40px] leading-[36px]">
                      {d.toLocaleDateString('en-US', { month: 'short' })}
                      <span className="block text-nn-muted">{d.getDate()}</span>
                    </time>
                    <div>
                      <p className="font-thunder text-nn-text text-[56px] leading-[48px] md:text-poster md:leading-[84px]">
                        {s.city}
                        <span className="text-nn-subtle text-[24px] align-top ml-2">{s.region}</span>
                      </p>
                      <p className="text-body text-nn-muted mt-1">{s.venue}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      {s.soldOut ? (
                        <Button size="lg" disabled>
                          Sold out
                        </Button>
                      ) : (
                        <Button size="lg" href={s.ticketUrl}>
                          Get tickets <Arrow external />
                        </Button>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </>
        )}
      </Container>
    </section>
  );
}

function News() {
  return (
    <section aria-labelledby="news-title" className="py-24 md:py-32 bg-nn-bg">
      <Container>
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <Eyebrow>News</Eyebrow>
            <h2 id="news-title" className="font-thunder text-nn-text text-poster-sm md:text-poster">
              From the band
            </h2>
          </div>
          <Button variant="secondary" to="/blog" className="shrink-0">
            Read all news <Arrow />
          </Button>
        </div>
        <FeaturedBlogs limit={3} />
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Home() {
  const lenis = useLenis();

  const goToAlerts = (e) => {
    const el = document.getElementById('tour');
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { offset: -40, duration: 1.2 });
    else el.scrollIntoView({ behavior: 'smooth' });
    // Move focus to the field for keyboard users once the scroll settles
    setTimeout(() => el.querySelector('input[type="email"]')?.focus({ preventScroll: true }), 1250);
  };

  return (
    <PageTransition>
      <div className="bg-nn-bg text-nn-text">
        <Hero onAlerts={goToAlerts} />
        <Ticker />
        <LatestRelease />
        <About />
        <Tour />
        <MerchRail />
        <News />
      </div>
    </PageTransition>
  );
}
