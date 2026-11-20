import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

/**
 * FEMZYK ENTERPRISES design system.
 *
 * Palette is intentionally strict: deep black + charcoal surfaces, pure white
 * type, and gold used only for accents (CTAs, hairlines, icons, highlights).
 * "Quiet luxury" — never gold gradients or gold-filled surfaces.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx,svg}', './lib/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#080808', // primary background
          soft: '#0B0B0B',
          deep: '#050505',
        },
        charcoal: {
          DEFAULT: '#1C1C1C', // secondary surfaces
          light: '#242424',
          dark: '#151515',
        },
        graphite: '#111111', // card surfaces on black
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E7CE86',
          deep: '#B4922C',
          muted: '#8A6F22',
        },
        fog: {
          DEFAULT: '#A8A8A8', // muted body copy
          bright: '#D6D6D6',
        },
        line: 'rgba(255,255,255,0.08)',
        'line-gold': 'rgba(212,175,55,0.28)',
        success: '#31C46B',
        danger: '#F2555A',
        whatsapp: '#25D366',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
      },
      fontSize: {
        // Fluid, mobile-first type scale (no media-query gymnastics needed).
        eyebrow: ['0.7rem', { lineHeight: '1.2', letterSpacing: '0.26em' }],
        caption: ['0.8125rem', { lineHeight: '1.6' }],
        lede: ['clamp(1.0625rem, 0.98rem + 0.35vw, 1.25rem)', { lineHeight: '1.75' }],
        h3: ['clamp(1.125rem, 1.05rem + 0.3vw, 1.375rem)', { lineHeight: '1.4' }],
        display: [
          'clamp(1.9rem, 1.35rem + 2.3vw, 3rem)',
          { lineHeight: '1.15', letterSpacing: '-0.015em' },
        ],
        hero: [
          'clamp(2.4rem, 1.5rem + 4.3vw, 4.4rem)',
          { lineHeight: '1.06', letterSpacing: '-0.022em' },
        ],
      },
      letterSpacing: {
        brand: '0.34em',
      },
      maxWidth: {
        shell: '80rem',
        prose: '48rem',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 60px -40px rgba(0,0,0,0.9)',
        'gold-ring': '0 0 0 1px rgba(212,175,55,0.35), 0 18px 46px -24px rgba(212,175,55,0.28)',
        float: '0 16px 40px -12px rgba(0,0,0,0.75)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
        'grid-gold':
          'linear-gradient(to right, rgba(212,175,55,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,175,55,0.10) 1px, transparent 1px)',
        'hero-glow':
          'radial-gradient(60% 55% at 50% 0%, rgba(212,175,55,0.10) 0%, rgba(8,8,8,0) 70%)',
        'card-sheen':
          'radial-gradient(120% 100% at 0% 0%, rgba(212,175,55,0.10) 0%, rgba(8,8,8,0) 60%)',
        hairline:
          'linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(212,175,55,0.55) 20%, rgba(212,175,55,0.55) 80%, rgba(212,175,55,0) 100%)',
      },
      backgroundSize: {
        grid: '64px 64px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translate3d(0, 14px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -10px, 0)' },
        },
        'pulse-ring': {
          '0%': { opacity: '0.55', transform: 'scale(1)' },
          '70%': { opacity: '0', transform: 'scale(1.55)' },
          '100%': { opacity: '0', transform: 'scale(1.55)' },
        },
        marquee: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(-50%,0,0)' },
        },
        'caret-blink': {
          '0%, 60%': { opacity: '1' },
          '61%, 100%': { opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 7s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.6s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        marquee: 'marquee 45s linear infinite',
        'caret-blink': 'caret-blink 1.1s steps(1, end) infinite',
      },
    },
  },
  plugins: [
    plugin(({ addComponents, addUtilities }) => {
      addComponents({
        // Page shell used by every section.
        '.container-shell': {
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
          maxWidth: '80rem',
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          '@screen sm': { paddingLeft: '1.5rem', paddingRight: '1.5rem' },
          '@screen lg': { paddingLeft: '2rem', paddingRight: '2rem' },
        },
        '.section-shell': {
          paddingTop: '5rem',
          paddingBottom: '5rem',
          '@screen md': { paddingTop: '7.5rem', paddingBottom: '7.5rem' },
        },
        '.eyebrow': {
          fontFamily: 'var(--font-sans)',
          fontSize: '0.7rem',
          lineHeight: '1.2',
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: '#D4AF37',
          fontWeight: '500',
        },
        '.card-surface': {
          backgroundColor: '#111111',
          border: '1px solid rgba(255,255,255,0.07)',
          transitionDuration: '400ms',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        },
        '.gold-rule': {
          height: '1px',
          width: '100%',
          backgroundImage:
            'linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(212,175,55,0.5) 25%, rgba(212,175,55,0.5) 75%, rgba(212,175,55,0) 100%)',
        },
      });

      addUtilities({
        '.text-balance': { 'text-wrap': 'balance' },
        '.text-pretty': { 'text-wrap': 'pretty' },
        '.tap-highlight-none': { '-webkit-tap-highlight-color': 'transparent' },
        '.no-scrollbar': {
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      });
    }),
  ],
};

export default config;
