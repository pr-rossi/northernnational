import React from 'react';
import { Link } from 'react-router-dom';

// variant = emphasis (primary | secondary | tertiary), size = md (40) | lg (48)
const base =
  'inline-flex items-center justify-center gap-2 rounded-nn font-medium whitespace-nowrap select-none ' +
  'transition-[background-color,border-color,color,transform] duration-200 ease-out ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-action focus-visible:ring-offset-2 focus-visible:ring-offset-nn-bg ' +
  'active:scale-[0.98] aria-disabled:pointer-events-none aria-disabled:opacity-40 aria-disabled:cursor-not-allowed';

const variants = {
  primary: 'bg-nn-action text-nn-on-action hover:bg-nn-action-hover active:bg-nn-action-pressed',
  secondary: 'border border-nn-line text-nn-text hover:border-nn-text/60 hover:bg-white/5 active:bg-white/10',
  tertiary: 'text-nn-text underline decoration-nn-line underline-offset-4 hover:decoration-nn-text px-0',
};

const sizes = {
  md: 'h-10 px-5 text-meta',
  lg: 'h-12 px-6 text-body',
};

function Dots() {
  return (
    <span className="inline-flex gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-current animate-bounce"
          style={{ animationDelay: `${i * 120}ms`, animationDuration: '900ms' }}
        />
      ))}
    </span>
  );
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  to,
  loading = false,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  const cls = `${base} ${variants[variant]} ${variant === 'tertiary' ? 'h-auto text-body' : sizes[size]} ${className}`;
  const content = loading ? (
    <>
      <span className="sr-only">Loading</span>
      <Dots />
    </>
  ) : (
    children
  );
  const state = { 'aria-disabled': disabled || loading || undefined, 'aria-busy': loading || undefined };

  if (to) {
    return (
      <Link to={to} className={cls} {...state} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...state}
        {...rest}
      >
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={cls} disabled={disabled || loading} {...state} {...rest}>
      {content}
    </button>
  );
}

// Small arrow used for outbound / onward links (custom 1.5 stroke, not a stock icon set)
export function Arrow({ external = false, className = '' }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {external ? (
        <path d="M5 11L11 5M6 5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      ) : (
        <path d="M3 8h9M8.5 4.5L12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      )}
    </svg>
  );
}

// 8-point sun lifted from the IDGAF artwork; used as the brand separator
export function Sun({ className = '' }) {
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? 10 : 4.2;
    const a = (Math.PI / 8) * i - Math.PI / 2;
    pts.push(`${(12 + r * Math.cos(a)).toFixed(2)},${(12 + r * Math.sin(a)).toFixed(2)}`);
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <polygon points={pts.join(' ')} fill="currentColor" />
    </svg>
  );
}
