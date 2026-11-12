import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import FeaturedBlogs from '../components/FeaturedBlogs';
import Button, { Arrow } from '../components/ui/Button';
import { Container, Label } from '../components/ui/Layout';
import home from '../content/home.json';

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------
// Copy and images come from src/content/home.json, edited in Keystatic (Homepage).
const LINKS = {
  playlist: 'https://open.spotify.com/playlist/37i9dQZF1DZ06evO4daEGQ?si=78a79f6bacdd4641',
  artist: 'https://open.spotify.com/artist/77uddrwADVuSI16ASFWF3c?si=bVUiHtZyS-u8cE4CuxYLFA',
};

const HERO = home.hero || {};
const LATEST = {
  ...home.latest,
  lyric: String(home.latest?.lyric || '').split('\n').map((l) => l.trim()).filter(Boolean),
  story: home.latest?.story ? `/blog/${home.latest.story}` : null,
};
const TICKER = (home.ticker || []).filter(Boolean);
const ABOUT = home.about || {};

const FOCUS = { left: 'object-left', right: 'object-right', center: 'object-center' };
const PHOTOS = [
  ...(ABOUT.livePhoto ? [{ src: ABOUT.livePhoto, alt: ABOUT.livePhotoAlt || '', name: 'Live', pos: 'object-center' }] : []),
  ...(home.members || []).map((m) => ({
    src: m.photo,
    alt: m.photoAlt || m.name,
    name: m.name,
    role: m.role,
    pos: FOCUS[m.focus] || 'object-center',
  })),
].filter((p) => p.src);

const ease = [0.22, 1, 0.36, 1];

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------
function PlayGlyph({ className = '' }) {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true" className={className}>
      <path d="M3 1.5v11L12.5 7z" fill="currentColor" />
    </svg>
  );
}

function Hero({ onAlerts = goToAlerts }) {
  const imgRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !imgRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.to(imgRef.current, {
      scale: 1.15,
      ease: 'none',
      scrollTrigger: { trigger: imgRef.current, start: 'top top', end: 'bottom top', scrub: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduce]);

  const layer = (i, y = 32) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease, delay: 0.25 + i * 0.16 },
        };

  return (
    <header className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden bg-nn-bg">
      <div ref={imgRef} className="absolute inset-0 origin-center">
        <img
          src={HERO.image}
          alt={HERO.imageAlt || ''}
          className="photo-bw h-full w-full object-cover object-[center_30%]"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(11,11,11,0.55) 0%, rgba(11,11,11,0) 28%, rgba(11,11,11,0.35) 55%, rgba(11,11,11,0.92) 85%, #0B0B0B 100%)',
        }}
      />

      <Container className="relative z-10 pt-40">
        <motion.div {...layer(0, 16)} className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <ul className="label text-nn-text/90 flex flex-wrap gap-x-4 gap-y-1">
            {(HERO.tags || []).map((t, i) => (
              <React.Fragment key={t + i}>
                {i > 0 && (
                  <li aria-hidden="true" className="text-nn-brand">
                    /
                  </li>
                )}
                <li>{t}</li>
              </React.Fragment>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" href={LATEST.spotifyUrl}>
              <PlayGlyph /> Play {LATEST.title}
            </Button>
            <Button size="lg" variant="secondary" href="#tour" onClick={onAlerts} className="backdrop-blur-sm">
              Get show alerts
            </Button>
          </div>
        </motion.div>
      </Container>

      <div className="relative z-10 mt-6 md:mt-8 px-4 md:px-5">
        <motion.h1
          {...layer(1, 60)}
          className="display text-nn-text text-[calc((100vw-32px)/7.5)] md:text-[calc((100vw-40px)/7.5)] leading-[0.84] mb-[-0.06em]"
        >
          <span className="block">Northern</span>
          <span className="block">National</span>
        </motion.h1>

        {/* Red tape sticker: the one brand-colour moment in the hero */}
        {HERO.sticker && (
          <motion.a
            href="#music"
            initial={reduce ? false : { opacity: 0, scale: 1.4, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: -4 }}
            transition={reduce ? undefined : { type: 'spring', damping: 14, mass: 0.8, delay: 1.0 }}
            className="absolute hidden md:block md:right-[6vw] md:top-[2vw] z-20 bg-nn-brand text-nn-on-brand
              px-4 py-2 md:px-5 md:py-3 shadow-e5
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-text focus-visible:ring-offset-2 focus-visible:ring-offset-nn-bg"
          >
            <span className="display text-[18px] md:text-[28px] leading-none tracking-[-0.02em]">{HERO.sticker}</span>
          </motion.a>
        )}
      </div>
    </header>
  );
}

function Ticker() {
  const [paused, setPaused] = useState(false);
  if (TICKER.length === 0) return null;
  const items = [...TICKER, ...TICKER, ...TICKER, ...TICKER];
  return (
    <div className="relative bg-nn-brand text-nn-on-brand overflow-hidden" aria-label="Announcements">
      <div
        className="flex w-max animate-marquee motion-reduce:[animation-play-state:paused] py-3 md:py-4"
        style={paused ? { animationPlayState: 'paused' } : undefined}
        aria-hidden="true"
      >
        {items.map((t, i) => (
          <span key={i} className="display flex items-center gap-6 pr-6 text-[28px] md:text-[44px] leading-none whitespace-nowrap">
            {t}
            <span className="inline-block h-[0.4em] w-[0.4em] rotate-45 bg-nn-on-brand" />
          </span>
        ))}
      </div>
      <p className="sr-only">{TICKER.join('. ')}.</p>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? 'Play announcements' : 'Pause announcements'}
        className="absolute right-0 top-0 bottom-0 w-14 flex items-center justify-center bg-nn-brand
          shadow-[-20px_0_20px_#FF3B21] transition-colors duration-100 hover:bg-[#FF5640]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-nn-on-brand"
      >
        {paused ? (
          <PlayGlyph />
        ) : (
          <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 2h3v10H3zM8 2h3v10H8z" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
}

function Vinyl() {
  return (
    <span
      aria-hidden="true"
      className="absolute top-[3%] left-[3%] h-[94%] w-[94%] rounded-full shadow-e6
        translate-x-[22%] group-hover:translate-x-[46%] group-focus-visible:translate-x-[46%]
        transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
      style={{
        background:
          'radial-gradient(circle, transparent 0 69%, rgba(237,235,230,0.10) 69.4%, transparent 70%), ' +
          'repeating-radial-gradient(circle, #0d0d0d 0 2px, #222 2.5px 3.5px), #151515',
        boxShadow: 'inset 0 0 0 2px rgba(237,235,230,0.08), 0 16px 32px rgba(0,0,0,0.5)',
      }}
    >
      <span
        className="absolute inset-[31%] rounded-full bg-cover bg-center"
        style={{ backgroundImage: `url('${LATEST.cover}')` }}
      />
      <span className="absolute inset-[48.8%] rounded-full bg-nn-bg" />
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'conic-gradient(from 30deg, transparent 0 10%, rgba(255,255,255,0.08) 14%, transparent 20% 60%, rgba(255,255,255,0.06) 64%, transparent 70%)',
        }}
      />
    </span>
  );
}

function LatestRelease() {
  const d = new Date(LATEST.released + 'T12:00:00');
  const date = `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}.${d.getFullYear()}`;
  return (
    <section id="music" aria-labelledby="latest-title" className="relative py-24 md:py-40 bg-nn-bg overflow-hidden scroll-mt-16">
      <Container className="grid gap-16 md:grid-cols-12 md:gap-10 items-center">
        <div className="md:col-span-6 pr-[18%] md:pr-[14%]">
          <a
            href={LATEST.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Play ${LATEST.title} on Spotify`}
            className="group relative block aspect-square focus-visible:outline-none"
            style={{ overflow: 'visible' }}
          >
            <Vinyl />
            <span className="relative block h-full w-full overflow-hidden shadow-e6 group-focus-visible:ring-2 group-focus-visible:ring-nn-text group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-nn-bg">
              <img
                src={LATEST.cover}
                alt={LATEST.coverAlt || `${LATEST.title} cover art`}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-4 left-4 flex items-center gap-2 bg-nn-bg/85 px-3 py-2 label text-nn-text backdrop-blur-sm">
                <PlayGlyph className="text-nn-brand" /> Play
              </span>
            </span>
          </a>
        </div>

        <div className="md:col-span-6">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-nn-brand" aria-hidden="true" />
            <Label>Latest single</Label>
            <Label className="text-nn-subtle">{date}</Label>
          </div>
          <h2 id="latest-title" className="display mt-4 text-nn-text text-[min(22vw,96px)] md:text-[min(10.5vw,150px)]">
            {LATEST.title}
          </h2>
          {LATEST.lyric.length > 0 && (
            <blockquote className="mt-8 mb-0 mx-0 p-0 border-0 bg-transparent rounded-none not-italic">
              <p className="text-[28px] leading-[34px] md:text-[36px] md:leading-[42px] font-semibold [font-stretch:110%] tracking-[-0.02em] text-nn-text">
                {LATEST.lyric.map((line, i) => (
                  <React.Fragment key={i}>
                    {i === 0 && '“'}
                    {line}
                    {i === LATEST.lyric.length - 1 ? '.”' : <br />}
                  </React.Fragment>
                ))}
              </p>
              {LATEST.lyricCredit && <footer className="mt-3 label text-nn-subtle">{LATEST.lyricCredit}</footer>}
            </blockquote>
          )}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button size="lg" href={LATEST.spotifyUrl}>
              <PlayGlyph /> Play on Spotify
            </Button>
            {LATEST.story && (
              <Button size="lg" variant="secondary" to={LATEST.story}>
                Read the story behind it
              </Button>
            )}
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
    <section aria-labelledby="about-title" className="py-24 md:py-40 bg-nn-bg border-t border-nn-line">
      <Container>
        <Label className="mb-6">About</Label>
        <h2 id="about-title" className="display text-nn-text text-[44px] md:text-[clamp(56px,7.2vw,112px)] max-w-[14ch]">
          {ABOUT.heading} {ABOUT.highlight && <span className="text-nn-brand">{ABOUT.highlight}</span>}
        </h2>
        <div className="mt-10 md:mt-14 grid gap-10 md:grid-cols-12">
          <p className="md:col-span-5 md:col-start-8 text-lead text-nn-muted">
            {ABOUT.body}
          </p>
        </div>

        <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-12 md:grid-rows-[repeat(2,minmax(0,1fr))] gap-3 md:gap-4 md:h-[760px]">
          {PHOTOS.map((p, i) => (
            <figure
              key={p.src}
              className={`group relative overflow-hidden bg-nn-surface m-0 ${
                i === 0
                  ? 'col-span-2 aspect-[4/5] md:aspect-auto md:col-span-6 md:row-span-2'
                  : i === 3
                  ? 'col-span-2 aspect-[16/9] md:aspect-auto md:col-span-6'
                  : 'aspect-[3/4] md:aspect-auto md:col-span-3'
              }`}
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className={`photo-bw h-full w-full object-cover ${p.pos} transition-[filter,transform] duration-500 ease-out
                  group-hover:[filter:none] group-hover:scale-[1.03]`}
              />
              <figcaption className="absolute left-3 bottom-3 flex items-center gap-2 bg-nn-bg/85 px-2 py-1">
                <span className="label text-nn-subtle">{String(i + 1).padStart(2, '0')}</span>
                <span className="label text-nn-text">{p.name}</span>
                {p.role && <span className="label text-nn-muted">/ {p.role}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10">
          <Button variant="tertiary" href={LINKS.artist}>
            Follow us on Spotify <Arrow external />
          </Button>
        </div>
      </Container>
    </section>
  );
}

function News({ posts = [] }) {
  return (
    <section aria-labelledby="news-title" className="py-24 md:py-40 bg-nn-bg border-t border-nn-line">
      <Container>
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <Label className="mb-6">News</Label>
            <h2 id="news-title" className="display text-nn-text text-[min(10.5vw,56px)] md:text-[112px]">
              Dispatches
            </h2>
          </div>
          <Button variant="secondary" to="/blog" className="shrink-0">
            Read all news <Arrow />
          </Button>
        </div>
        <FeaturedBlogs posts={posts} />
      </Container>
    </section>
  );
}

// Scroll to the tour signup and put the cursor in the email field.
function goToAlerts(e) {
  const el = document.getElementById('tour');
  if (!el) return;
  e.preventDefault();
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -40, duration: 1.2 });
  else el.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => el.querySelector('input[type="email"]')?.focus({ preventScroll: true }), 1250);
}

export { Hero, Ticker, LatestRelease, About, News };
