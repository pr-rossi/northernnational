/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,js,jsx,ts,tsx,mjs,md}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // One family, two widths: Archivo Expanded for display, Archivo for text. Mono for labels.
        'sans': ['"Archivo Variable"', 'system-ui', 'sans-serif'],
        'display': ['"Archivo Variable"', 'system-ui', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        // Legacy aliases still used by interior pages
        'thunder': ['"Archivo Variable"', 'system-ui', 'sans-serif'],
        'aeonik': ['"Archivo Variable"', 'system-ui', 'sans-serif'],
      },
      // Semantic tokens. Primitives: ink-950 #0B0B0B, ink-900 #151515, ink-850 #1F1F1F,
      // bone-100 #EDEBE6, bone-400 #A8A49C, bone-500 #8C8881, signal-500 #FF3B21.
      colors: {
        nn: {
          bg: '#0B0B0B',
          surface: '#151515',
          raised: '#1F1F1F',
          line: 'rgba(237,235,230,0.14)',
          text: '#EDEBE6',            // 16.9:1 on bg
          muted: '#A8A49C',           // 7.9:1 on bg
          subtle: '#8C8881',          // 5.5:1 on bg
          brand: '#FF3B21',           // signal red: brand only, never the action color (5.6:1 on bg)
          'on-brand': '#0B0B0B',
          action: '#EDEBE6',          // primary action fill
          'action-hover': '#FFFFFF',
          'action-pressed': '#D6D3CC',
          'on-action': '#0B0B0B',
          danger: '#FF8A7A',
        },
      },
      fontSize: {
        'micro': ['12px', '16px'],
        'meta': ['14px', '20px'],
        'body': ['16px', '24px'],
        'lead': ['20px', '28px'],
        'h4': ['28px', '32px'],
        'h3': ['36px', '44px'],
        'h2': ['48px', '56px'],
      },
      letterSpacing: {
        tight: '-0.04em',
        wide: '0.04em',
        wider: '0.08em',
      },
      borderRadius: {
        'nn': '2px',
      },
      boxShadow: {
        'e5': '0 8px 24px rgba(0,0,0,0.32)',
        'e6': '0 16px 32px rgba(0,0,0,0.32)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '20%': { transform: 'translate(-3%, 2%)' },
          '40%': { transform: 'translate(2%, -3%)' },
          '60%': { transform: 'translate(-2%, -1%)' },
          '80%': { transform: 'translate(3%, 3%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        grain: 'grain 600ms steps(1) infinite',
      },
    },
  },
  plugins: [
    function({ addBase, addComponents }) {
      addBase({
        'body': { fontFamily: '"Archivo Variable", system-ui, sans-serif' },
        'p, h1, h2, h3, h4, h5, h6': { fontFamily: 'inherit' },
      });
      addComponents({
        // Display type: Archivo Expanded Black. Uppercase is the poster voice, display sizes only.
        '.display': {
          fontFamily: '"Archivo Variable", system-ui, sans-serif',
          fontWeight: '900',
          fontStretch: '125%',
          textTransform: 'uppercase',
          letterSpacing: '-0.03em',
          lineHeight: '0.86',
        },
        // Small mono label (eyebrow / meta). Uppercase allowed at this size.
        '.label': {
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: '12px',
          lineHeight: '16px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        },
        '.photo-bw': {
          filter: 'grayscale(1) contrast(1.3) brightness(0.8)',
        },
      });
    }
  ],
}
