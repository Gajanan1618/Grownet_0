/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1F4D3A',
          light: '#2E6B4F',
          dark: '#153A2B',
        },
        turmeric: {
          DEFAULT: '#E8A33D',
          light: '#F2C077',
          dark: '#C7822A',
        },
        clay: {
          DEFAULT: '#A8452E',
          light: '#C25F42',
          dark: '#823522',
        },
        parchment: {
          DEFAULT: '#F5EFE0',
          dark: '#EDE3CC',
        },
        ink: {
          DEFAULT: '#24281F',
          soft: '#5C6152',
          faint: '#8A8F7C',
        },
        line: '#DDD2B8',
      },
      fontFamily: {
        // Neither Fraunces, Inter, nor IBM Plex Mono cover Devanagari glyphs —
        // appending a Devanagari font at the end of each stack means Latin
        // text still renders in the brand font, while any Hindi/Marathi
        // characters automatically fall through to a font that actually
        // supports them, instead of an inconsistent OS fallback.
        display: ['Fraunces', '"Noto Serif Devanagari"', 'ui-serif', 'Georgia', 'serif'],
        body: ['Inter', '"Noto Sans Devanagari"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"Noto Sans Devanagari"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '18px',
      },
      boxShadow: {
        soft: '0 20px 44px -22px rgba(31,77,58,0.35)',
        stamp: '0 2px 0 rgba(36,40,31,0.06)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        shake: 'shake 0.4s ease',
        float: 'float 5s ease-in-out infinite',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.2,0.8,0.3,1) both',
      },
    },
  },
  plugins: [],
}
