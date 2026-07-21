/** @type {import('tailwindcss').Config} */
export default {
  content: ['./*.html', './admin/**/*.html', './src/**/*.{js,css}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Sora — rounded geometric display face: wordmark, headings, hero copy.
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        // Inter — body copy, UI labels.
        sans: ['"Inter"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        // Roboto Mono — technical readouts: prices, part numbers, step numbers, eyebrows.
        mono: ['"Roboto Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // MotoShop — dark, electric-blue accented storefront.
        moto: {
          bg: '#0c1118', // page background / surface
          lowest: '#070a10', // inputs, deepest wells
          low: '#121a24', // low surface
          panel: '#161f2b', // cards / containers
          high: '#212c3c', // hovers, raised
          line: '#1f2937', // hairline borders
          'line-2': '#2c3a4d', // stronger dividers
          bright: '#3a4a61',
          accent: '#2e7dfb', // primary action accent — electric blue
          'accent-dim': '#1a4fa0', // pressed / muted blue
          'accent-soft': '#8fc1ff', // light accent text on dark
          ink: '#eef2f8', // primary text
          muted: '#9fb0c3', // secondary text
          warm: '#c3d3e8', // soft secondary text
          outline: '#71829a', // faint borders / icons
          error: '#ff6b6b',
        },
      },
      letterSpacing: {
        widest2: '0.22em',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        panel: '0 1px 0 rgba(46,125,251,0.06), 0 20px 45px -26px rgba(0,0,0,0.85)',
        glow: '0 0 0 1px rgba(46,125,251,0.35), 0 8px 24px -8px rgba(46,125,251,0.45)',
      },
      backgroundImage: {
        'moto-fade': 'linear-gradient(90deg, #0c1118 0%, rgba(12,17,24,0.4) 55%, transparent 100%)',
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
};
