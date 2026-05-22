# Verivent — Discover Verified Events

> Curated · Verified · Trusted

---

## Quick Start

```bash
npm install
npm run dev
# http://localhost:3000
```

---

## Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Framework | Next.js 14 (App Router)       |
| PWA       | next-pwa                      |
| Language  | TypeScript                    |
| Styling   | **Tailwind CSS v4** (CSS-first config via `@theme {}`) |
| Animation | GSAP + ScrollTrigger          |
| Scroll    | @studio-freight/lenis         |
| Icons     | @iconify/react                |
| Backend   | Supabase (Phase 2)            |

---

## Tailwind v4 Notes

- No `tailwind.config.ts` — config lives in `globals.css` under `@theme {}`
- PostCSS uses `@tailwindcss/postcss` (not the old `tailwindcss` plugin)
- `@import "tailwindcss"` replaces the old `@tailwind base/components/utilities`
- Custom utilities defined with `@utility` instead of `@layer utilities`

---

## Pages

| Route               | Page                |
|---------------------|---------------------|
| `/`                 | Landing             |
| `/events`           | Events Feed         |
| `/events/[id]`      | Event Detail        |
| `/organizers`       | Organizers List     |
| `/organizers/[id]`  | Organizer Profile   |

---

## Design Tokens (in globals.css @theme)

| Token        | Hex       | Use                    |
|--------------|-----------|------------------------|
| void         | #0D0719   | Deep background        |
| surface      | #130D26   | Section bg             |
| card         | #1A1032   | Card fill              |
| primary      | #7B3FE4   | Purple — CTAs, badges  |
| pri-light    | #9D68F0   | Hover                  |
| lavender     | #C4B5FD   | Text accents           |
| mist         | #EDE9FE   | Light elements         |
| ice          | #E0E7FF   | Secondary light        |

**Fonts:**
- Headings: Syne 700 (not 800–900 — prevents compressed/stretched look)
- Body/UI: Plus Jakarta Sans 400–700

---

## Replacing Image Placeholders

Every image area in the code has a comment showing what photo to use.
Look for `{event.photoQuery}` and `{org.coverQuery}` in `src/lib/data.ts`.

### Event Images
Each event card shows a rich gradient until you add a real photo.
To add photos:
1. Find the `photoQuery` for each event in `src/lib/data.ts`
2. Search Pinterest or Unsplash with that query
3. Download the image
4. Add to `public/images/events/[id].jpg`
5. Replace the gradient `div` in EventCard with `<Image>` from `next/image`

### Organizer Logos
Download official logos from each organizer's website.
- GDG Lagos → gdg.community/lagos
- Design Week NG → designweekng.com
- Startup Grind Lagos → startupgrind.com/lagos
- Ingressive for Good → ingressive4good.org

### Organizer Covers
Wide event photography from each organizer's Instagram/Twitter.
Size: 1440×280px minimum.

### Speaker Headshots
LinkedIn profile photos or speaker bio pages.
Format: Square, minimum 200×200px.

---

## PWA Icons

Add to `public/icons/`:
- `icon-192.png` — 192×192px
- `icon-512.png` — 512×512px

Design: Purple (#7B3FE4) background + white "V"

---

## Project Structure

```
verivent/
├── public/
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              ← Landing
│   │   ├── globals.css           ← Tailwind v4 @theme config
│   │   ├── events/
│   │   │   ├── page.tsx          ← Feed
│   │   │   └── [id]/page.tsx     ← Detail
│   │   └── organizers/
│   │       ├── page.tsx          ← List
│   │       └── [id]/page.tsx     ← Profile
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── EventCard.tsx         ← Redesigned with real verified badge
│   │   ├── VerifiedBadge.tsx     ← Twitter/Instagram/TikTok-style badge
│   │   └── LenisProvider.tsx
│   └── lib/
│       └── data.ts               ← All mock data + types
```

---

Built by **emekadivine.exe** ⚡
