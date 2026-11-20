/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Redesigned AI Tathastu Brand Palette
        brand: {
          canvas: '#FAF9F5',       // Warm off-white main background
          surface: '#FFFFFF',      // Pure white card and panel surface
          stone: '#F3F1EC',        // Warm tactile stone for contrasting sections
          'stone-dark': '#E6E3DA', // Architectural borders & separators
          charcoal: '#171815',     // Primary ink for bold titles and crisp text
          muted: '#666861',        // Balanced neutral for descriptions and subtitles
          navy: '#0C1322',         // Deep midnight navy for rich contrasting sections
          'navy-surface': '#141D32', // Elevated navy card surface
          'navy-border': 'rgba(255, 255, 255, 0.1)',
          // Backward compatibility safeguards for legacy classes
          slate: {
            900: '#0C1322',
            950: '#070A12',
            800: '#141D32',
            100: '#F5F5F0',
            200: '#E6E3DA',
          },
          'editorial-violet': '#1E60D5',
        },
        // Backwards compatibility mappings for smooth migration
        foundation: {
          paper: '#FAF9F5',
          white: '#FFFFFF',
          ink: '#171815',
          secondary: '#666861',
          border: '#E6E3DA',
          stone: '#F3F1EC',
          ivory: '#FAF9F5',
          charcoal: '#171815',
          muted: '#666861',
        },
        // Purposeful Accent Palette (Restrained, not saturated neon)
        accent: {
          blue: '#1E60D5',         // Engineering & systems accent
          softblue: '#EBF2FC',     // Light surface blue
          terracotta: '#D46238',   // Products & hardware accent
          peach: '#FDF1EB',        // Light surface terracotta
          sage: '#2E6852',         // Research & science accent
          softmint: '#EBF4F0',     // Light surface sage
          amber: '#C07D1C',        // Milestones & attention accent
          butter: '#FCF7ED',       // Light surface amber
          violet: '#6366F1',       // Vision & creative accent
          lavender: '#F0F0FF',     // Light surface violet
          mint: '#2E6852',
          ochre: '#C07D1C',
          coral: '#D46238',
        },
        // Refined Dark Reading Theme
        dark: {
          bg: '#0F100E',
          surface: '#181916',
          elevated: '#21221E',
          border: 'rgba(255, 255, 255, 0.08)',
          ink: '#F5F5F0',
          text: '#F5F5F0',
          secondary: '#9CA096',
          muted: '#9CA096',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Fraunces"', '"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', '"Geist Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      boxShadow: {
        editorial: '0 1px 3px 0 rgba(23, 24, 21, 0.04), 0 1px 2px -1px rgba(23, 24, 21, 0.03)',
        'editorial-hover': '0 10px 25px -4px rgba(23, 24, 21, 0.07), 0 4px 10px -2px rgba(23, 24, 21, 0.04)',
        'editorial-card': '0 2px 8px 0 rgba(23, 24, 21, 0.04)',
        'navy-card': '0 10px 30px 0 rgba(0, 0, 0, 0.35)',
      }
    },
  },
  plugins: [],
}
