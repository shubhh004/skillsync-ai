/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Primary brand: Indigo ──────────────────────────────────────────────
        brand: {
          50:  '#1e1b4b',   // very dark indigo tint (active nav bg)
          100: '#312e81',
          200: '#3730a3',
          300: '#4338ca',
          400: '#818cf8',   // light indigo text on dark backgrounds
          500: '#6366f1',   // primary action
          600: '#6366f1',   // alias kept for backward compat
          700: '#4f46e5',   // hover / pressed
          800: '#4338ca',
          900: '#3730a3',
          950: '#312e81',
        },
        // ── Neutral: dark-first scale ──────────────────────────────────────────
        neutral: {
          0:   '#18181B',   // card / component background (replaces bg-white)
          50:  '#09090B',   // page background
          100: '#111827',   // surface: sidebar, navbar, panels
          200: '#27272A',   // border / divider
          300: '#3F3F46',   // strong border
          400: '#71717A',   // icons, timestamps, very muted
          500: '#A1A1AA',   // secondary muted text
          600: '#D4D4D8',   // tertiary text
          700: '#E4E4E7',   // body text
          800: '#F1F1F3',   // strong body text
          900: '#F4F4F5',   // headings
          950: '#FAFAFA',   // highest contrast text
        },
        // ── Semantic status (dark-friendly tints) ─────────────────────────────
        success: {
          100: '#14532d',   // dark green tint bg
          500: '#22c55e',   // green accent
          700: '#4ade80',   // lighter green text on dark
        },
        warning: {
          100: '#713f12',   // dark amber tint bg
          500: '#f59e0b',   // amber accent
          700: '#fbbf24',   // lighter amber text on dark
        },
        danger: {
          100: '#7f1d1d',   // dark red tint bg
          500: '#ef4444',   // red accent
          700: '#f87171',   // lighter red text on dark
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        xs:    ['0.75rem',  { lineHeight: '1rem' }],
        sm:    ['0.875rem', { lineHeight: '1.25rem' }],
        base:  ['1rem',     { lineHeight: '1.5rem' }],
        lg:    ['1.125rem', { lineHeight: '1.75rem' }],
        xl:    ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem',   { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem',  { lineHeight: '2.5rem' }],
      },
      borderRadius: {
        sm:      '0.25rem',
        DEFAULT: '0.375rem',
        md:      '0.5rem',
        lg:      '0.75rem',
        xl:      '1rem',
        '2xl':   '1.5rem',
        full:    '9999px',
      },
      boxShadow: {
        sm:      '0 1px 2px 0 rgb(0 0 0 / 0.5)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.6), 0 1px 2px -1px rgb(0 0 0 / 0.5)',
        md:      '0 4px 6px -1px rgb(0 0 0 / 0.6), 0 2px 4px -2px rgb(0 0 0 / 0.5)',
        lg:      '0 10px 15px -3px rgb(0 0 0 / 0.7), 0 4px 6px -4px rgb(0 0 0 / 0.5)',
        glow:    '0 0 24px rgb(99 102 241 / 0.3)',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
    },
  },
  plugins: [],
}
