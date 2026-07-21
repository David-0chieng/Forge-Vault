/** @type {import('tailwindcss').Config} */
export default {
  content: ['./*.html', './admin/**/*.html', './src/**/*.{js,css}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Space Grotesk — the "Global Car Parts Marketplace" design concept's
        // exact display face: wordmark, headings, prices, step numbers.
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        // Public Sans — the concept's exact body face.
        sans: ['"Public Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        // The concept has no monospace anywhere — Space Grotesk covers technical
        // readouts too, so numeric labels stay visually consistent with the rest.
        mono: ['"Space Grotesk"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // `moto` is the site's one design-token namespace (kept as-is rather
        // than renamed, since it is invisible outside the source). Its values
        // are now the exact palette from the "Global Car Parts Marketplace"
        // design concept: oklch(14% 0.008 264) background, oklch(70% 0.17 48)
        // accent — a warm amber-orange on a near-black neutral.
        moto: {
          bg: '#0e0f12', // page background / surface
          lowest: '#0a0b0e', // inputs, deepest wells
          low: '#131519', // low surface
          panel: '#15171c', // cards / containers
          high: '#1c1f26', // hovers, raised
          line: 'rgba(255,255,255,0.08)', // hairline borders
          'line-2': 'rgba(255,255,255,0.16)', // stronger dividers
          bright: 'rgba(255,255,255,0.12)',
          accent: '#e2823f', // primary action accent — warm amber-orange
          'accent-dim': '#b9662b', // pressed / muted accent
          'accent-soft': '#f0ac78', // light accent text on dark
          'on-accent': '#1a1712', // text/icons drawn on top of the accent fill
          ink: '#f5f3ee', // primary text
          muted: '#a39c8d', // secondary text
          warm: '#c8c3b7', // soft secondary text
          outline: '#8f8879', // faint borders / icons
          error: '#ff6b6b',
        },
      },
      letterSpacing: {
        widest2: '0.14em',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        panel: '0 1px 0 rgba(226,130,63,0.06), 0 20px 45px -26px rgba(0,0,0,0.85)',
        glow: '0 0 0 1px rgba(226,130,63,0.35), 0 8px 24px -8px rgba(226,130,63,0.45)',
      },
      backgroundImage: {
        'moto-fade': 'linear-gradient(90deg, #0e0f12 0%, rgba(14,15,18,0.4) 55%, transparent 100%)',
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
};
