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
      fontFamily: {
        'open-sans': ['var(--font-open-sans)'],
        dosis: ['var(--font-dosis)'],
        inter: ['var(--font-inter)'],
      },
      backgroundImage: {
        // 'hero-image': "url('/img/Banner-image-cropped.png')",
        'hero-image':
          "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7)), url('/img/Banner-image-cropped.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('prettier-plugin-tailwindcss')],
  // plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
