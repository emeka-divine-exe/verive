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
        // ── VERIVE Core Palette ──────────────────────────────
        // Navy: Trust, depth, anticipation
        'v-canvas':      '#06091A',   // page background
        'v-surface':     '#0D1230',   // cards, panels
        'v-raised':      '#131A3A',   // sidebars, elevated panels
        'v-overlay':     '#1B2248',   // modals, drawers

        // Saffron Gold: Earned value, verification, worth
        'v-gold':        '#C2820D',   // primary brand, CTA, badge
        'v-gold-l':      '#D4970F',   // hover state
        'v-gold-d':      '#A06B0A',   // pressed state

        // Verdigris: Discovery, organic growth, community
        'v-teal':        '#1F7A68',   // discovery layer, links, tags
        'v-teal-l':      '#27967F',   // hover state
        'v-teal-d':      '#185F51',   // pressed state

        // Warm Ivory: Human presence, readable, warm
        'v-ivory':       '#F0E8D6',   // primary text
        'v-ivory-m':     '#9AA0B8',   // secondary text
        'v-ivory-s':     '#525B78',   // tertiary, placeholders

        // ── Legacy aliases (keeps older components from breaking) ──
        void:            '#06091A',
        surface:         '#0D1230',
        card:            '#131A3A',
        primary:         '#C2820D',
        'pri-light':     '#D4970F',
        lavender:        '#27967F',
        mist:            '#F0E8D6',
        ice:             '#E8EDF5',
      },

      fontFamily: {
        // Clash Display: Authority, architectural, distinctive
        display: ['Clash Display', 'sans-serif'],
        // General Sans: Warm, editorial, human
        body:    ['General Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
