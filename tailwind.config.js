/** @type {import('tailwindcss').Config} */
export default {
  content: ['./*.html', './admin/**/*.html', './src/**/*.{js,css}'],
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
        // than renamed, since it is invisible outside the source). Every value
        // resolves through a CSS variable defined in style.css, so the whole
        // site repaints when <html data-theme> flips between the concept's
        // exact dark and light palettes — see the THEME block in style.css.
        moto: {
          bg: 'rgb(var(--c-bg) / <alpha-value>)',
          lowest: 'rgb(var(--c-lowest) / <alpha-value>)',
          low: 'rgb(var(--c-low) / <alpha-value>)',
          panel: 'rgb(var(--c-panel) / <alpha-value>)',
          high: 'rgb(var(--c-high) / <alpha-value>)',
          line: 'var(--c-line)', // hairline borders — already translucent, no alpha slash
          'line-2': 'var(--c-line-2)', // stronger dividers
          bright: 'var(--c-bright)', // subtle overlay fill
          bright2: 'var(--c-bright-2)', // stronger overlay fill (hover states)
          accent: 'rgb(var(--c-accent) / <alpha-value>)', // primary action accent
          'accent-dim': 'rgb(var(--c-accent-dim) / <alpha-value>)', // pressed / muted accent
          'accent-soft': 'rgb(var(--c-accent-soft) / <alpha-value>)', // accent-tinted text / hover
          'on-accent': 'rgb(var(--c-on-accent) / <alpha-value>)', // text/icons on the accent fill
          ink: 'rgb(var(--c-ink) / <alpha-value>)', // primary text
          muted: 'rgb(var(--c-muted) / <alpha-value>)', // secondary text
          warm: 'rgb(var(--c-warm) / <alpha-value>)', // soft secondary text
          outline: 'rgb(var(--c-outline) / <alpha-value>)', // faint borders / icons
          error: 'rgb(var(--c-error) / <alpha-value>)',
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
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
};
