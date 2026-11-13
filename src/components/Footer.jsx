import ShowAlertsForm from './ShowAlertsForm';
import { Arrow } from './ui/Button';

const columns = [
  {
    title: 'Listen',
    links: [
      { label: 'Spotify', href: 'https://open.spotify.com/artist/77uddrwADVuSI16ASFWF3c?si=bVUiHtZyS-u8cE4CuxYLFA' },
      { label: 'This Is Northern National', href: 'https://open.spotify.com/playlist/37i9dQZF1DZ06evO4daEGQ?si=78a79f6bacdd4641' },
    ],
  },
  {
    title: 'Follow',
    links: [
      { label: 'Instagram', href: 'https://instagram.com/northernnational' },
      { label: 'X / Twitter', href: 'https://twitter.com/northernnational' },
    ],
  },
  {
    title: 'Site',
    links: [
      { label: 'Tour', to: '/tour' },
      { label: 'Merch', to: '/merch' },
      { label: 'News', to: '/blog' },
    ],
  },
  {
    title: 'Contact',
    links: [{ label: 'contact@northernnational.com', href: 'mailto:contact@northernnational.com' }],
  },
];

const linkCls =
  'inline-flex items-center gap-2 text-body text-nn-text/80 hover:text-nn-text transition-colors duration-200 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-text rounded-nn';

function Footer({ pathname = '/' }) {
  const showSignup = pathname !== '/' && pathname !== '/tour'; // these pages carry their own signup

  return (
    <footer className="relative bg-nn-bg border-t border-nn-line overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-6 pt-20 md:pt-28">
        {showSignup && (
          <div className="grid gap-8 md:grid-cols-12 md:items-end pb-16 md:pb-20 mb-16 md:mb-20 border-b border-nn-line">
            <div className="md:col-span-6">
              <p className="label text-nn-muted mb-4">Show alerts</p>
              <p className="display text-nn-text text-[40px] md:text-[64px]">Hear it first.</p>
            </div>
            <div className="md:col-span-6">
              <ShowAlertsForm id="footer-alerts" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="label text-nn-subtle mb-4">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <a href={l.to} className={linkCls}>
                        {l.label}
                      </a>
                    ) : (
                      <a
                        href={l.href}
                        className={`${linkCls} break-all`}
                        {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {l.label}
                        {l.href.startsWith('http') && <Arrow external className="shrink-0 text-nn-subtle" />}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-2 sm:flex-row sm:justify-between label text-nn-subtle">
          <p>© {new Date().getFullYear()} Northern National</p>
          <p className="flex gap-6">
            <a href="/privacy" className="hover:text-nn-text transition-colors duration-200">
              Privacy
            </a>
            <span>Made loud in Dallas, TX</span>
          </p>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="display text-nn-text/[0.06] select-none whitespace-nowrap px-4 md:px-5 mt-8
          text-[calc((100vw-32px)/14.4)] md:text-[calc((100vw-40px)/14.4)] leading-[0.8] mb-[-0.12em]"
      >
        Northern National
      </p>
    </footer>
  );
}

export default Footer;
