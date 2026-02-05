import type { Config } from 'tailwindcss'

/**
 * Miyara Brand Discovery - Design Tokens
 *
 * This configuration extends Tailwind CSS v4 with custom design tokens.
 * Colors are defined here as the single source of truth and referenced
 * in globals.css via @theme.
 *
 * Reference: galam.com visual style + Miyara brand colors
 */
const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ============================================
        // PRIMARY PALETTE (from galam.com)
        // ============================================
        'galam-blue': '#004C82',           // Primary blue - headings, CTAs
        'galam-blue-light': '#7DA6D7',     // Secondary blue - nav, links

        // ============================================
        // MIYARA BRAND COLORS (for continuity)
        // ============================================
        'miyara-navy': '#1B2A4E',          // Primary text, headings, dark accents
        'miyara-sky': '#7DD3FC',           // Background accent, section backgrounds
        'miyara-sky-light': '#BAE6FD',     // Lighter accent, hover states
        'miyara-white': '#FFFFFF',         // Card backgrounds, content areas

        // ============================================
        // SEMANTIC COLORS
        // ============================================
        'miyara-accent': '#3B82F6',        // Interactive elements, links, buttons
        'miyara-success': '#22C55E',       // Positive states, "yes" responses
        'miyara-warning': '#F59E0B',       // Uncertain states, "maybe" responses
        'miyara-error': '#EF4444',         // Negative states, "no" responses, errors

        // ============================================
        // NEUTRALS (from galam.com)
        // ============================================
        'galam-white': '#FFFFFF',
        'galam-gray-light': '#F2F5F8',     // Background
        'galam-gray': '#606060',           // Body text
        'galam-gray-dark': '#222222',      // Headings

        // Extended Miyara gray scale
        'miyara-gray': {
          50: '#F9FAFB',                   // Page backgrounds
          100: '#F3F4F6',                  // Subtle backgrounds
          200: '#E5E7EB',                  // Borders, dividers
          400: '#9CA3AF',                  // Placeholder text
          600: '#4B5563',                  // Secondary text
          900: '#111827',                  // Primary text alternative
        },
      },

      // ============================================
      // TYPOGRAPHY
      // ============================================
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        roboto: ['var(--font-roboto)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-roboto)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        // Display sizes (Playfair)
        'display-lg': ['3.75rem', { lineHeight: '1.1', fontWeight: '400' }],  // 60px
        'display-md': ['3rem', { lineHeight: '1.15', fontWeight: '400' }],    // 48px
        'display-sm': ['2.25rem', { lineHeight: '1.2', fontWeight: '400' }],  // 36px

        // Heading sizes
        'heading-lg': ['2rem', { lineHeight: '1.25', fontWeight: '400' }],    // 32px
        'heading-md': ['1.5rem', { lineHeight: '1.3', fontWeight: '400' }],   // 24px
        'heading-sm': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],  // 20px

        // Body sizes (Roboto)
        'body-lg': ['1.125rem', { lineHeight: '1.875', fontWeight: '300' }],  // 18px
        'body-md': ['1rem', { lineHeight: '1.875', fontWeight: '300' }],      // 16px, 30px line-height
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],    // 14px
      },

      // ============================================
      // SPACING (4px base scale - Tailwind defaults work)
      // ============================================
      // 1 = 4px, 2 = 8px, 3 = 12px, 4 = 16px
      // 6 = 24px, 8 = 32px, 12 = 48px, 16 = 64px
      // Adding generous spacing for galam.com style
      spacing: {
        '18': '4.5rem',    // 72px
        '22': '5.5rem',    // 88px
        '26': '6.5rem',    // 104px
        '30': '7.5rem',    // 120px - generous section spacing
      },

      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        // Default Tailwind: sm=2px, md=6px, lg=8px, xl=12px, 2xl=16px
        // These are fine for our needs
      },

      // ============================================
      // SHADOWS
      // ============================================
      boxShadow: {
        // Tailwind defaults: sm, md, lg, xl are good
        // Adding subtle shadow for galam.com style
        'galam': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'galam-lg': '0 4px 16px rgba(0, 0, 0, 0.1)',
      },

      // ============================================
      // TRANSITIONS (0.2s as per galam.com)
      // ============================================
      transitionDuration: {
        DEFAULT: '200ms',
      },

      // ============================================
      // LETTER SPACING
      // ============================================
      letterSpacing: {
        'galam-wide': '0.125em',  // 2px at 16px = 0.125em
      },
    },
  },
  plugins: [],
}

export default config
