# Verivent

> Curated · Verified · Trusted — The platform for meaningful events.

---

## Stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Framework  | Next.js 14 (App Router)        |
| PWA        | next-pwa                       |
| UI         | React + TypeScript             |
| Styling    | Tailwind CSS                   |
| Animation  | GSAP + ScrollTrigger           |
| Scroll     | @studio-freight/lenis          |
| Icons      | @iconify/react                 |
| Backend    | Supabase (coming Phase 2)      |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open
http://localhost:3000
```

---

## PWA

The site is PWA-ready. On mobile, users will get an "Add to Home Screen" prompt.

For full PWA support, add icons:
- `public/icons/icon-192.png` — 192×192px
- `public/icons/icon-512.png` — 512×512px

Use a purple (#7B3FE4) background with a white "V" logo.

---

## Design System

### Colors

| Token       | Hex       | Usage                     |
|-------------|-----------|---------------------------|
| `void`      | `#0D0719` | Deep background           |
| `surface`   | `#130D26` | Section backgrounds       |
| `card`      | `#1A1032` | Card backgrounds          |
| `primary`   | `#7B3FE4` | CTAs, accents, badges     |
| `pri-light` | `#9D68F0` | Hover states              |
| `lavender`  | `#C4B5FD` | Text accents, soft glow   |
| `mist`      | `#EDE9FE` | Light surfaces            |
| `ice`       | `#E0E7FF` | Secondary light           |

### Fonts

- **Display / Headings:** Syne (700, 800)
- **Body / UI:** Plus Jakarta Sans (400, 500, 600, 700)

---

## Image Placeholders — What to Download

Every `img-slot` in the UI has a comment describing exactly what image to use.
Search Pinterest or Unsplash with the search terms provided.

### Hero Section
- **Hero event card banner** — Lagos tech conference crowd, dark-toned
  - Pinterest: `"tech conference photography Lagos Africa dark"`
  - Size: 600×340px minimum, 16:9

### Featured Events (×3)
- **Lagos Dev Summit** — developer crowd, speaker on stage
  - Pinterest: `"developer conference photography Nigeria dark"`
- **Design Unplugged** — creative workshop, warm-lit, design tools
  - Pinterest: `"design conference workshop photography dark warm"`
- **Startup Grind** — pitch stage, entrepreneurs, energetic
  - Pinterest: `"startup pitch event Nigeria Africa photography"`

### Organizer Logos (×4)
Download directly from official websites:
- GDG Lagos → gdg.community/lagos
- Design Week NG → designweekng.com
- Startup Grind Lagos → startupgrind.com/lagos
- Ingressive for Good → ingressive4good.org

### Speaker Headshots (Event Detail page)
- Professional LinkedIn photos or speaker bio photos
- Format: Square, min 200×200px, clean background

---

## Project Structure

```
verivent/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── icons/                 # PWA icons (add icon-192.png, icon-512.png)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout, fonts, PWA meta
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Design system, animations
│   └── components/
│       ├── Navbar.tsx         # Sticky nav with mobile menu
│       ├── Footer.tsx         # Site footer
│       ├── EventCard.tsx      # Reusable event card
│       └── LenisProvider.tsx  # Smooth scroll init
```

---

## Pages Roadmap

| Phase | Page                  | Status      |
|-------|-----------------------|-------------|
| 1     | Landing (`/`)         | ✅ Done     |
| 1     | Events Feed           | Coming next |
| 1     | Event Detail          | Coming next |
| 1     | Organizer Profile     | Coming next |
| 2     | Sign Up / Login       | Phase 2     |
| 2     | User Dashboard        | Phase 2     |
| 3     | Organizer Dashboard   | Phase 3     |
| 4     | Admin Panel           | Phase 4     |

---

Built by **emekadivine.exe** ⚡
