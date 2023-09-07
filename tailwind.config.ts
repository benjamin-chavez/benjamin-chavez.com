const defaultTheme = require('tailwindcss/defaultTheme');
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'hero-image':
          "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7)), url('/img/Banner-image-cropped.png')",
        parallax:
          "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/img/parallax-img.jpg')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        basic: '0 0 10px rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        'open-sans': ['var(--font-open-sans)'],
        dosis: ['var(--font-dosis)'],
        inter: ['var(--font-inter)'],
      },
      screens: {
        xs: '475px',
        ...defaultTheme.screens,
      },
      transitionDuration: {
        '600': '600ms',
      },
    },
  },
  // future: {
  //   hoverOnlyWhenSupported: true,
  // },
  plugins: [
    // require('prettier-plugin-tailwindcss')
    require('@tailwindcss/typography'),
  ],
  // plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
