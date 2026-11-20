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
        // Redesign V2 Foundation Palette
        foundation: {
          paper: '#F8F7F3',
          white: '#FFFFFF',
          ink: '#22231F',
          secondary: '#70736F',
          border: '#E7E5DF',
          // Backwards compatibility mappings
          ivory: '#F8F7F3',
          charcoal: '#22231F',
          muted: '#70736F',
        },
        // Brand & Accent Colors
        accent: {
          violet: '#7955D5',
          blue: '#4775C9',
          mint: '#368A70',
          terracotta: '#D9785D',
          ochre: '#C58B35',
          // Soft Surfaces
          lavender: '#EEE8FA',
          softblue: '#E8EFFB',
          softmint: '#E4F1E9',
          peach: '#F8EAE2',
          butter: '#F5EEDB',
          // Semantic aliases
          sage: '#E4F1E9',
          coral: '#D9785D',
        },
        // Semantic Category System
        category: {
          interpretability: {
            DEFAULT: '#7955D5',
            surface: '#EEE8FA',
          },
          agentic: {
            DEFAULT: '#4775C9',
            surface: '#E8EFFB',
          },
          perceptual: {
            DEFAULT: '#368A70',
            surface: '#E4F1E9',
          },
          governance: {
            DEFAULT: '#C58B35',
            surface: '#F5EEDB',
          },
          inference: {
            DEFAULT: '#D9785D',
            surface: '#F8EAE2',
          },
        },
        // Refined Dark Reading Theme
        dark: {
          bg: '#161714',
          surface: '#1F201C',
          elevated: '#282A24',
          border: 'rgba(255, 255, 255, 0.08)',
          ink: '#FAF9F6',
          text: '#FAF9F6',
          secondary: '#A1A39E',
          muted: '#A1A39E',
        }
      },
      fontFamily: {
        serif: ['"Fraunces"', '"Instrument Serif"', 'Newsreader', 'Georgia', 'serif'],
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '240': '240ms',
        '250': '250ms',
        '320': '320ms',
        '350': '350ms',
        '600': '600ms',
        '650': '650ms',
        '800': '800ms',
        '850': '850ms',
      },
      boxShadow: {
        editorial: '0 2px 12px -1px rgba(34, 35, 31, 0.04), 0 1px 3px 0 rgba(34, 35, 31, 0.02)',
        'editorial-hover': '0 10px 28px -3px rgba(34, 35, 31, 0.08), 0 3px 8px -2px rgba(34, 35, 31, 0.04)',
        'editorial-card': '0 1px 2px 0 rgba(34, 35, 31, 0.03)',
        'dark-editorial': '0 8px 30px 0 rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
