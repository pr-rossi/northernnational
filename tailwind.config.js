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
      }
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
