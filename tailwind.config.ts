import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        void:      '#0D0719',
        surface:   '#130D26',
        card:      '#1A1032',
        primary:   '#7B3FE4',
        'pri-light': '#9D68F0',
        lavender:  '#C4B5FD',
        mist:      '#EDE9FE',
        ice:       '#E0E7FF',
      },
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        body:    ['var(--font-jakarta)', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        float1:  'float1 7s ease-in-out infinite',
        float2:  'float2 9s ease-in-out infinite 1.5s',
        pulse2:  'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        marquee: { to: { transform: 'translateX(-50%)' } },
        float1:  {
          '0%,100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%':     { transform: 'translateY(-14px) rotate(-2deg)' },
        },
        float2: {
          '0%,100%': { transform: 'translateY(0) rotate(3deg)' },
          '50%':     { transform: 'translateY(-10px) rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
