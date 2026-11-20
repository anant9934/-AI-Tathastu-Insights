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
        // DESIGN.md Foundation Tokens
        canvas: '#F5F6F4',
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#ECEFEB',
        },
        ink: {
          DEFAULT: '#151A20',
          soft: '#27313B',
        },
        'text-secondary': '#626D77',
        border: '#DDE2DF',

        // DESIGN.md Brand Accents
        blue: {
          DEFAULT: '#315FE8',
          deep: '#173B77',
          soft: '#E7EEFF',
        },
        lime: {
          DEFAULT: '#D9EF68',
        },
        mint: {
          DEFAULT: '#DCEDE3',
        },
        coral: {
          DEFAULT: '#E98770',
        },
        sand: {
          DEFAULT: '#F0E8DA',
        },
        lavender: {
          DEFAULT: '#E9E3F5',
        },

        // Backward compatibility brand tokens
        brand: {
          canvas: '#F5F6F4',
          surface: '#FFFFFF',
          'surface-muted': '#ECEFEB',
          stone: '#ECEFEB',
          'stone-dark': '#DDE2DF',
          charcoal: '#151A20',
          ink: '#151A20',
          'ink-soft': '#27313B',
          muted: '#626D77',
          navy: '#101722',
          'navy-surface': '#172231',
          'navy-border': 'rgba(255, 255, 255, 0.1)',
          slate: {
            900: '#101722',
            950: '#0B0F17',
            800: '#172231',
            100: '#F4F6F7',
            200: '#DDE2DF',
          },
          'editorial-violet': '#315FE8',
        },
        foundation: {
          paper: '#F5F6F4',
          white: '#FFFFFF',
          ink: '#151A20',
          secondary: '#626D77',
          border: '#DDE2DF',
          stone: '#ECEFEB',
          ivory: '#F5F6F4',
          charcoal: '#151A20',
          muted: '#626D77',
        },
        accent: {
          blue: '#315FE8',
          softblue: '#E7EEFF',
          terracotta: '#E98770',
          peach: '#F0E8DA',
          sage: '#DCEDE3',
          softmint: '#DCEDE3',
          lime: '#D9EF68',
          amber: '#C07D1C',
          butter: '#F0E8DA',
          violet: '#315FE8',
          lavender: '#E9E3F5',
          mint: '#DCEDE3',
          coral: '#E98770',
          sand: '#F0E8DA',
        },
        // DESIGN.md Dark Theme Tokens
        dark: {
          canvas: '#101722',
          surface: '#172231',
          'surface-raised': '#202D3D',
          ink: '#F4F6F7',
          muted: '#AAB5BF',
          border: '#344252',
          bg: '#101722',
          elevated: '#202D3D',
          text: '#F4F6F7',
          secondary: '#AAB5BF',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Manrope', '"DM Sans"', 'system-ui', 'sans-serif'],
        editorial: ['Newsreader', 'Georgia', 'serif'],
        serif: ['Newsreader', '"Fraunces"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        editorial: '0 1px 3px 0 rgba(21, 26, 32, 0.04), 0 1px 2px -1px rgba(21, 26, 32, 0.03)',
        'editorial-hover': '0 10px 25px -4px rgba(21, 26, 32, 0.07), 0 4px 10px -2px rgba(21, 26, 32, 0.04)',
        'editorial-card': '0 2px 8px 0 rgba(21, 26, 32, 0.04)',
        'navy-card': '0 10px 30px 0 rgba(0, 0, 0, 0.35)',
      }
    },
  },
  plugins: [],
}
