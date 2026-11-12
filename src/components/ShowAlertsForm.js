import React, { useId, useState } from 'react';
import Button from './ui/Button';

const MAILCHIMP_ACTION =
  'https://northernnationalmusic.us17.list-manage.com/subscribe/post?u=22d3f967aaa29a31ccd2275a1&id=7e228c82dc&f_id=0048c2e1f0';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ShowAlertsForm({ id = 'show-alerts' }) {
  const uid = useId();
  const inputId = `${id}-email-${uid}`;
  const msgId = `${id}-msg-${uid}`;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | error | sent

  const onSubmit = (e) => {
    if (!EMAIL_RE.test(email.trim())) {
      e.preventDefault();
      setStatus('error');
      return;
    }
    // Let the native POST open Mailchimp's confirmation in a new tab.
    setStatus('sent');
  };

  return (
    <form
      id={id}
      action={MAILCHIMP_ACTION}
      method="post"
      target="_blank"
      noValidate
      onSubmit={onSubmit}
      className="w-full max-w-[480px]"
    >
      <label htmlFor={inputId} className="block text-meta text-nn-muted mb-2">
        Email address
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id={inputId}
          type="email"
          name="EMAIL"
          inputMode="email"
          autoComplete="email"
          placeholder="you@yourmail.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== 'idle') setStatus('idle');
          }}
          aria-invalid={status === 'error' || undefined}
          aria-describedby={msgId}
          className={`h-12 w-full sm:flex-1 min-w-0 rounded-nn bg-nn-surface px-4 text-body text-nn-text placeholder:text-nn-subtle
            border transition-colors duration-200
            focus:outline-none focus:ring-2 focus:border-transparent
            ${status === 'error' ? 'border-[#FCA5A5] focus:ring-[#FCA5A5]' : `focus:ring-nn-action ${email ? 'border-nn-text/40' : 'border-nn-line'}`}`}
        />
        <Button type="submit" size="lg" disabled={!email}>
          Get show alerts
        </Button>
      </div>
      <p id={msgId} aria-live="polite" className="mt-2 min-h-[20px] text-meta">
        {status === 'error' && (
          <span className="text-[#FCA5A5]">Sorry, that email doesn't look right. Check it and try again.</span>
        )}
        {status === 'sent' && (
          <span className="text-nn-action">You're almost in. Confirm in the tab that just opened.</span>
        )}
        {status === 'idle' && <span className="text-nn-subtle">Only news about shows and releases. Unsubscribe anytime.</span>}
      </p>
      {/* Mailchimp bot protection */}
      <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
        <input type="text" name="b_22d3f967aaa29a31ccd2275a1_7e228c82dc" tabIndex="-1" defaultValue="" />
      </div>
    </form>
  );
}
