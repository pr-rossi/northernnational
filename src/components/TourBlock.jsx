import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import ShowAlertsForm from './ShowAlertsForm';
import Button, { Arrow } from './ui/Button';
import { Container, Label } from './ui/Layout';
import SHOWS from '../data/shows';

const ease = [0.22, 1, 0.36, 1];

export default function TourBlock({ as = 'h2', label = 'Tour', page = false }) {
  const Heading = as;
  const reduce = useReducedMotion();
  const reveal = (i) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 60 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-80px' },
          transition: { duration: 0.8, ease, delay: i * 0.15 },
        };

  return (
    <section
      id="tour"
      aria-labelledby="tour-title"
      className={`bg-nn-bg scroll-mt-16 overflow-hidden ${
        page ? 'pt-36 md:pt-48 pb-24 md:pb-40' : 'py-24 md:py-40 border-t border-nn-line'
      }`}
    >
      <Container>
        <Label className="mb-6">{label}</Label>
        {SHOWS.length === 0 ? (
          <>
            <Heading id="tour-title" className="display text-nn-text text-[clamp(64px,16vw,248px)]">
              <motion.span {...reveal(0)} className="block">
                No dates.
              </motion.span>
              <motion.span {...reveal(1)} className="block text-nn-brand">
                Yet.
              </motion.span>
            </Heading>
            <motion.div {...reveal(2)} className="mt-12 md:mt-16 grid gap-8 md:grid-cols-12 md:items-start">
              <p className="md:col-span-5 text-lead text-nn-text">
                Dallas always hears first. Get an email the day new shows are announced.
              </p>
              <div className="md:col-span-6 md:col-start-7">
                <ShowAlertsForm id="tour-alerts" />
              </div>
            </motion.div>
          </>
        ) : (
          <>
            <Heading id="tour-title" className="display text-nn-text text-[min(13vw,56px)] md:text-[112px] mb-10">
              On the road
            </Heading>
            <ul className="border-t border-nn-line">
              {SHOWS.map((s, i) => {
                const d = new Date(s.date + 'T12:00:00');
                return (
                  <motion.li
                    key={s.date + s.city}
                    {...reveal(i)}
                    className="group grid grid-cols-[80px_1fr] md:grid-cols-[140px_1fr_auto] items-center gap-x-6 gap-y-4 py-6 border-b border-nn-line"
                  >
                    <time dateTime={s.date} className="label text-nn-muted">
                      {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      <span className="block text-nn-subtle">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    </time>
                    <div>
                      <p className="display text-nn-text text-[40px] md:text-[72px] group-hover:text-nn-brand transition-colors duration-300">
                        {s.city}
                      </p>
                      <p className="mt-2 text-body text-nn-muted">
                        {s.venue} · {s.region}
                      </p>
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

