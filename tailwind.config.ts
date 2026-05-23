import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void:        '#0D0719',
        surface:     '#130D26',
        card:        '#1A1032',
        primary:     '#7B3FE4',
        'pri-light': '#9D68F0',
        lavender:    '#C4B5FD',
        mist:        '#EDE9FE',
        ice:         '#E0E7FF',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
