import React from 'react';
import Button, { Arrow } from '../components/ui/Button';
import { Container, Label } from '../components/ui/Layout';

export default function NotFound() {
  return (
      <div className="min-h-[100svh] bg-nn-bg flex items-end pt-36 pb-24 md:pb-32">
        <Container>
          <Label className="intro-rise mb-6">Error 404</Label>
          <h1 className="display text-nn-text text-[clamp(56px,14vw,224px)]">
            <span className="intro-title block" style={{ '--d': '120ms' }}>
              Wrong
            </span>{' '}
            <span className="intro-title block text-nn-brand" style={{ '--d': '280ms' }}>
              venue.
            </span>
          </h1>
          <p className="intro-rise mt-8 max-w-[520px] text-lead text-nn-muted" style={{ '--d': '460ms' }}>
            There's nothing playing at this address. The show's this way.
          </p>
          <div className="intro-rise mt-10 flex flex-wrap gap-3" style={{ '--d': '580ms' }}>
            <Button size="lg" to="/">
              Back to the homepage <Arrow />
            </Button>
            <Button size="lg" variant="secondary" to="/tour">
              See tour dates
            </Button>
          </div>
        </Container>
      </div>
  );
}
