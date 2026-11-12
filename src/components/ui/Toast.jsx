import React from 'react';
import toast from 'react-hot-toast';

const TONES = {
  success: {
    badge: 'bg-nn-brand text-nn-on-brand',
    icon: <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="square" fill="none" />,
  },
  neutral: {
    badge: 'border border-nn-line text-nn-text',
    icon: <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />,
  },
  error: {
    badge: 'bg-nn-danger text-nn-on-brand',
    icon: <path d="M8 3.5v6M8 11.75v.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />,
  },
};

function ToastCard({ t, tone = 'neutral', eyebrow, title, body, action, duration }) {
  const style = TONES[tone] || TONES.neutral;
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
      className={`toast-card group pointer-events-auto relative w-[min(92vw,440px)] overflow-hidden rounded-nn
        bg-nn-surface text-nn-text shadow-[0_16px_40px_rgba(0,0,0,0.55)] ring-1 ring-nn-line
        ${t.visible ? 'toast-in' : 'toast-out'}`}
    >
      <div className="flex gap-4 p-5 pr-12">
        <span className={`mt-0.5 h-8 w-8 shrink-0 inline-flex items-center justify-center rounded-nn ${style.badge}`} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16">
            {style.icon}
          </svg>
        </span>
        <div className="min-w-0">
          {eyebrow && <p className="label text-nn-subtle mb-1">{eyebrow}</p>}
          <p className="display text-[22px] leading-[24px] text-nn-text">{title}</p>
          {body && <p className="mt-2 text-meta text-nn-muted">{body}</p>}
          {action && (
            <a
              href={action.href}
              onClick={() => toast.dismiss(t.id)}
              className="mt-4 inline-flex items-center gap-2 label text-nn-text underline decoration-nn-brand decoration-2 underline-offset-4 hover:text-nn-brand transition-colors duration-200"
            >
              {action.label}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h9M8.5 4.5L12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
            </a>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => toast.dismiss(t.id)}
        aria-label="Dismiss"
        className="absolute right-3 top-3 h-8 w-8 inline-flex items-center justify-center rounded-nn text-nn-subtle
          hover:text-nn-text hover:bg-white/5 transition-colors duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-text"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
        </svg>
      </button>
      {/* Time left; pauses while hovered (react-hot-toast pauses the timer too). */}
      <span
        aria-hidden="true"
        className="toast-timer absolute bottom-0 left-0 h-[2px] w-full origin-left bg-nn-brand"
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
}

export function showToast({ tone = 'neutral', eyebrow, title, body, action, duration = 7000 }) {
  return toast.custom((t) => <ToastCard t={t} tone={tone} eyebrow={eyebrow} title={title} body={body} action={action} duration={duration} />, {
    duration,
  });
}
