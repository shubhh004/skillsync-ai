/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {

      // ── 1. COLOR TOKENS ──────────────────────────────────────────────────────
      colors: {
        // Primary brand: Indigo
        // dark-first — smaller number = darker (inverted from Tailwind default)
        brand: {
          50:  '#1e1b4b',   // dark indigo tint (active nav bg)
          100: '#312e81',
          200: '#3730a3',
          300: '#4338ca',
          400: '#818cf8',   // light indigo text on dark surfaces
          500: '#6366f1',   // primary action color
          600: '#5254cc',   // midpoint (was duplicate of 500 — fixed)
          700: '#4f46e5',   // hover / pressed
          800: '#4338ca',
          900: '#3730a3',
          950: '#312e81',
        },

        // Neutral: dark-first scale
        // neutral-0 = darkest card surface; neutral-950 = near-white
        neutral: {
          0:   '#18181B',   // card / component background  (replaces white)
          50:  '#09090B',   // page background              (darkest)
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

        // Semantic: success / warning / danger (dark-friendly tints)
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

      // ── 2. TYPOGRAPHY ────────────────────────────────────────────────────────
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        xs:    ['0.75rem',   { lineHeight: '1rem' }],
        sm:    ['0.875rem',  { lineHeight: '1.25rem' }],
        base:  ['1rem',      { lineHeight: '1.5rem' }],
        lg:    ['1.125rem',  { lineHeight: '1.75rem' }],
        xl:    ['1.25rem',   { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem',    { lineHeight: '2rem' }],
        '3xl': ['1.875rem',  { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem',   { lineHeight: '2.5rem',  letterSpacing: '-0.02em' }],
        '5xl': ['3rem',      { lineHeight: '1',       letterSpacing: '-0.025em' }],
        '6xl': ['3.75rem',   { lineHeight: '1',       letterSpacing: '-0.03em' }],
      },

      letterSpacing: {
        tightest: '-0.05em',
        tighter:  '-0.025em',
        tight:    '-0.01em',
        normal:   '0',
        wide:     '0.025em',
        wider:    '0.05em',
        widest:   '0.1em',
      },

      // ── 3. SPACING ───────────────────────────────────────────────────────────
      spacing: {
        18:  '4.5rem',
        22:  '5.5rem',
        26:  '6.5rem',
        30:  '7.5rem',
        34:  '8.5rem',
        88:  '22rem',
        92:  '23rem',
        100: '25rem',
        112: '28rem',
        128: '32rem',
      },

      // ── 4. BORDER RADIUS ─────────────────────────────────────────────────────
      borderRadius: {
        sm:      '0.25rem',
        DEFAULT: '0.375rem',
        md:      '0.5rem',
        lg:      '0.75rem',
        xl:      '1rem',
        '2xl':   '1.5rem',
        '3xl':   '2rem',      // added — for large hero elements
        '4xl':   '2.5rem',    // added — for modals, sheets
        full:    '9999px',
      },

      // ── 5. SHADOWS ───────────────────────────────────────────────────────────
      boxShadow: {
        sm:        '0 1px 2px 0 rgb(0 0 0 / 0.5)',
        DEFAULT:   '0 1px 3px 0 rgb(0 0 0 / 0.6), 0 1px 2px -1px rgb(0 0 0 / 0.5)',
        md:        '0 4px 6px -1px rgb(0 0 0 / 0.6), 0 2px 4px -2px rgb(0 0 0 / 0.5)',
        lg:        '0 10px 15px -3px rgb(0 0 0 / 0.7), 0 4px 6px -4px rgb(0 0 0 / 0.5)',
        xl:        '0 20px 25px -5px rgb(0 0 0 / 0.7), 0 8px 10px -6px rgb(0 0 0 / 0.5)',
        '2xl':     '0 25px 50px -12px rgb(0 0 0 / 0.8)',
        inner:     'inset 0 2px 4px 0 rgb(0 0 0 / 0.4)',
        none:      'none',
        // Brand glow variants
        'glow-sm': '0 0 12px rgb(99 102 241 / 0.25)',
        glow:      '0 0 24px rgb(99 102 241 / 0.35)',
        'glow-lg': '0 0 48px rgb(99 102 241 / 0.45)',
        // Structural variants
        glass:     '0 8px 32px rgb(0 0 0 / 0.4), inset 0 1px 0 rgb(255 255 255 / 0.05)',
        elevated:  '0 0 0 1px rgb(255 255 255 / 0.05), 0 4px 24px rgb(0 0 0 / 0.5)',
        'card-hover': '0 0 0 1px rgb(99 102 241 / 0.25), 0 8px 24px rgb(99 102 241 / 0.1)',
        popover:   '0 0 0 1px rgb(0 0 0 / 0.4), 0 16px 48px rgb(0 0 0 / 0.6)',
      },

      // ── 6. BACKDROP BLUR ─────────────────────────────────────────────────────
      backdropBlur: {
        xs:    '4px',
        sm:    '8px',
        md:    '12px',
        lg:    '16px',
        xl:    '20px',
        '2xl': '24px',
        '3xl': '40px',
        '4xl': '64px',
      },

      // ── 7. TRANSITIONS ───────────────────────────────────────────────────────
      transitionDuration: {
        0:   '0ms',
        75:  '75ms',
        100: '100ms',
        150: '150ms',
        200: '200ms',
        300: '300ms',
        400: '400ms',
        500: '500ms',
        700: '700ms',
      },

      transitionTimingFunction: {
        'ease-smooth':     'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-spring':     'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'ease-out-quart':  'cubic-bezier(0.25, 1, 0.5, 1)',
        'ease-in-back':    'cubic-bezier(0.36, 0, 0.66, -0.56)',
        'ease-out-back':   'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      // ── 8. ANIMATIONS ────────────────────────────────────────────────────────
      keyframes: {
        // Entrance animations
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'fade-slide-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-slide-down': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-slide-right': {
          from: { opacity: '0', transform: 'translateX(-10px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-slide-left': {
          from: { opacity: '0', transform: 'translateX(10px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'pop-in': {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'scale-out': {
          from: { opacity: '1', transform: 'scale(1)' },
          to:   { opacity: '0', transform: 'scale(0.95)' },
        },

        // Looping / continuous
        'thinking-pulse': {
          '0%, 60%, 100%': { transform: 'translateY(0)',    opacity: '0.4' },
          '30%':           { transform: 'translateY(-5px)', opacity: '1'   },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to:   { backgroundPosition:  '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 12px rgb(99 102 241 / 0.2)' },
          '50%':      { boxShadow: '0 0 32px rgb(99 102 241 / 0.5)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
      },

      animation: {
        // Entrances (duration + easing fine-tuned per type)
        'fade-in':          'fade-in 0.2s ease-out both',
        'fade-slide-up':    'fade-slide-up 0.22s ease-out both',
        'fade-slide-down':  'fade-slide-down 0.2s ease-out both',
        'fade-slide-right': 'fade-slide-right 0.22s ease-out both',
        'fade-slide-left':  'fade-slide-left 0.22s ease-out both',
        'pop-in':           'pop-in 0.18s ease-out both',
        'scale-in':         'scale-in 0.15s ease-out both',
        'scale-out':        'scale-out 0.12s ease-in both',

        // Continuous
        'thinking':         'thinking-pulse 1.2s ease-in-out infinite',
        'shimmer':          'shimmer 2s linear infinite',
        'glow-pulse':       'glow-pulse 2.5s ease-in-out infinite',
        'float':            'float 3s ease-in-out infinite',
        'spin-slow':        'spin-slow 3s linear infinite',
      },

      // ── 9. Z-INDEX ───────────────────────────────────────────────────────────
      zIndex: {
        1:    '1',
        2:    '2',
        5:    '5',
        10:   '10',
        20:   '20',
        30:   '30',
        40:   '40',
        50:   '50',
        60:   '60',    // drawers
        70:   '70',    // modals
        80:   '80',    // toasts
        90:   '90',    // tooltips
        100:  '100',   // max layer
      },
    },
  },
  plugins: [],
}
