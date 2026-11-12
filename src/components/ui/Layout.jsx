import React from 'react';

export function Container({ className = '', children, ...rest }) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-5 md:px-6 ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function Label({ children, className = '', as: Tag = 'p', ...rest }) {
  return (
    <Tag className={`label text-nn-muted ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

// Top of every interior page: mono label, oversized display title, optional intro.
export function PageHeader({ label, title, intro, children }) {
  return (
    <header className="pt-36 md:pt-48 pb-12 md:pb-16">
      <Container>
        <Label className="mb-6 intro-rise">{label}</Label>
        <h1
          className="intro-title display text-nn-text text-[min(10.5vw,64px)] md:text-[clamp(72px,10vw,160px)]"
          style={{ '--d': '120ms' }}
        >
          {title}
        </h1>
        {intro && (
          <p className="intro-rise mt-8 max-w-[560px] text-lead text-nn-muted" style={{ '--d': '320ms' }}>
            {intro}
          </p>
        )}
        {children}
      </Container>
    </header>
  );
}

export function formatDate(iso) {
  const d = new Date(String(iso).slice(0, 10) + 'T12:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}.${d.getFullYear()}`;
}
