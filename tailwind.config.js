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
        foundation: {
          ivory: '#FAF9F6',
          charcoal: '#22231F',
          white: '#FFFFFF',
          muted: '#777873',
        },
        accent: {
          violet: '#8055D9',
          lavender: '#EAE2FA',
          softblue: '#DCEBFA',
          mint: '#DDF1E7',
          sage: '#DCE9DF',
          peach: '#F6E1D5',
          coral: '#F1A58D',
          butter: '#F3EBCB',
        },
        dark: {
          bg: '#141512',
          surface: '#1D1E1B',
          elevated: '#262724',
          border: 'rgba(255, 255, 255, 0.08)',
          text: '#FAF9F6',
          muted: '#9B9C96',
        }
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Newsreader', 'Georgia', 'serif'],
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '350': '350ms',
        '650': '650ms',
        '850': '850ms',
      },
      boxShadow: {
        editorial: '0 4px 20px -2px rgba(34, 35, 31, 0.05), 0 2px 6px -1px rgba(34, 35, 31, 0.03)',
        'editorial-hover': '0 12px 30px -4px rgba(34, 35, 31, 0.08), 0 4px 12px -2px rgba(34, 35, 31, 0.04)',
        'dark-editorial': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
