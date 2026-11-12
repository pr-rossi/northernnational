/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'thunder': ['Thunder', 'sans-serif'],
        'sans': ['Aeonik Pro', 'system-ui', 'sans-serif'],
        'aeonik': ['Aeonik Pro', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        bold: 700,
        black: 900,
      },
      // Semantic color tokens ("gig poster" system). The site is dark-only by brand.
      // Primitives: ink-950 #0A0A0A, ink-900 #141414, ink-800 #1E1E1E, chalk #F3F3F3, lime-300 #D4FF99.
      colors: {
        nn: {
          bg: '#0A0A0A',              // page
          surface: '#141414',         // cards, tiles
          raised: '#1E1E1E',          // hover surface, skeletons
          line: 'rgba(243,243,243,0.14)',
          text: '#F3F3F3',            // primary text, 18:1 on bg
          muted: '#B4B4B4',           // secondary text, 10:1 on bg
          subtle: '#8F8F8F',          // meta text, 6.3:1 on bg
          action: '#D4FF99',          // primary action fill (dark text on it)
          'action-hover': '#E4FFC2',
          'action-pressed': '#BFE589',
          'on-action': '#0A0A0A',
        },
      },
      // Marketing type scale (16px base, 1.25 ratio) plus display sizes for Thunder.
      fontSize: {
        'micro': ['12px', '16px'],
        'meta': ['14px', '20px'],
        'body': ['16px', '24px'],
        'lead': ['20px', '28px'],
        'h4': ['28px', '32px'],
        'h3': ['36px', '44px'],
        'h2': ['48px', '56px'],
        'poster-sm': ['64px', '56px'],
        'poster': ['96px', '84px'],
        'poster-lg': ['160px', '136px'],
      },
      letterSpacing: {
        tight: '-0.04em',
        wide: '0.04em',
        wider: '0.08em',
      },
      borderRadius: {
        'nn': '4px',   // one sharp shape language across the system
      },
      boxShadow: {
        // Dark mode: doubled alpha of E2 tokens
        'e3': '0 4px 16px rgba(0,0,0,0.16)',
        'e5': '0 8px 24px rgba(0,0,0,0.32)',
        'e6': '0 16px 32px rgba(0,0,0,0.32)',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.83, 0, 0.32, 1)',
        'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [
    function({ addBase }) {
      addBase({
        'p': {
          fontFamily: ['Aeonik Pro', 'system-ui', 'sans-serif'],
          fontWeight: '400'
        },
        'h1, h2, h3, h4, h5, h6': {
          fontFamily: ['Aeonik Pro', 'system-ui', 'sans-serif'],
          fontWeight: '700'
        },
      })
    }
  ],
}
