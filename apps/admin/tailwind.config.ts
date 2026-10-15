import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        espresso: {
          DEFAULT: '#3D2314',
          dark: '#2A170B',
          light: '#53321D',
        },
        roasted: {
          DEFAULT: '#6F4E37',
          accent: '#8B5A2B',
          light: '#A06E3B',
        },
        caramel: {
          DEFAULT: '#D27D2D',
          light: '#E59B52',
          dark: '#B0631D',
        },
        mocha: {
          DEFAULT: '#C49A6C',
          light: '#DFC19E',
        },
        cream: {
          DEFAULT: '#FFF8F5',
          soft: '#FAF5EE',
          container: '#FFF1EA',
          border: '#F0E2D8',
          muted: '#F5ECE4',
        },
        coffee: {
          DEFAULT: '#2E1A0F',
          muted: '#7A5C4D',
          subtle: '#9E8274',
        },
        brand: {
          50: '#FFF8F5',
          100: '#FFF1EA',
          200: '#F5ECE4',
          300: '#DFC19E',
          400: '#C49A6C',
          500: '#D27D2D',
          600: '#8B5A2B',
          700: '#6F4E37',
          800: '#3D2314',
          900: '#2E1A0F',
        },
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        pill: '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
