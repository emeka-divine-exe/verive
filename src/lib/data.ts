export type Category = 'tech' | 'design' | 'startup' | 'career' | 'community'
export type Format   = 'in-person' | 'online' | 'hybrid'

export interface Speaker {
  name:   string
  title:  string
  initials: string
  color:  string  // bg color for avatar placeholder
}

export interface Event {
  id:           string
  title:        string
  description:  string
  longDesc:     string

  organizerId:  string
  organizer:    string

  orgInitials:  string
  orgColor:     string

  date:         string
  dateRaw:      string
  time:         string

  location:     string

  format:       Format
  category:     Category

  price:        number | 'Free'

  badge?:       'featured' | 'free' | 'selling-fast'

  capacity:     number
  filled:       number

  speakers:     Speaker[]

  imageUrl?:    string

  // NOTE: Replace src below with real event photo.
  // Search Pinterest for the query in photoQuery.
  photoQuery:   string
}

export interface Organizer {
  id: string

  // Ownership
  userId?: string

  // Core identity
  name: string
  slug?: string
  initials?: string

  // Public info
  bio: string
  longBio?: string
  description?: string
  shortBio?: string

  type: string
  categories?: Category[]

  // Branding
  logo?: string
  avatarUrl?: string
  coverUrl?: string

  // Placeholder/fallback branding
  avatarColor?: string
  coverColor?: string
  coverQuery?: string

  // Verification & moderation
  verified?: boolean
  featured?: boolean
  suspended?: boolean

  // Metrics
  eventsCount: number
  totalEvents?: number

  attendees?: string
  followersCount?: number

  rating?: number
  since?: number

  // Contact
  email?: string
  phone?: string

  // Socials
  website?: string
  twitter?: string
  linkedin?: string
  instagram?: string
  github?: string
  discord?: string

  // Location
  country?: string
  city?: string

  // SEO / discovery
  tags?: string[]

  // Admin workflow
  applicationStatus?: 'pending' | 'approved' | 'rejected'

  // Dates
  createdAt?: string
  updatedAt?: string
}

/* ── Mock Organizers ───────────────────────────────────────────── */
export const ORGANIZERS: Organizer[] = [
  {
    id: 'gdg-lagos',
    name: 'GDG Lagos',
    initials: 'GDG',
    bio: "Google Developer Group Lagos — one of Africa's largest developer communities.",
    longBio: "Google Developer Group Lagos is one of Africa's largest and most active developer communities. Since 2019, we've run monthly tech talks, annual summits, hackathons, and workshops. Our events are free or highly affordable — because Nigerian developers deserve world-class learning opportunities.",
    type: 'Tech & Community',
    categories: ['tech','community','career'],
    eventsCount: 24,
    attendees: '8.4k',
    rating: 4.9,
    since: 2019,
    website: 'gdg.community/lagos',
    twitter: '@GDGLagos',
    instagram: '@gdglagos',
    avatarColor: 'bg-primary/25',
    coverColor: 'from-primary/30 via-void to-surface',
    coverQuery: '"GDG Lagos developer community event crowd Nigeria"',
  },
  {
    id: 'design-week-ng',
    name: 'Design Week NG',
    initials: 'DW',
    bio: "Nigeria's premier design community — connecting designers, thinkers, and makers.",
    longBio: "Design Week NG is Nigeria's most respected design community. We run events that push the boundaries of creativity across UI/UX, branding, product design, and motion. We believe African designers are world-class — and our events exist to prove it.",
    type: 'Design',
    categories: ['design'],
    eventsCount: 12,
    attendees: '3.1k',
    rating: 4.8,
    since: 2020,
    website: 'designweekng.com',
    twitter: '@DesignWeekNG',
    instagram: '@designweekng',
    avatarColor: 'bg-pink-900/40',
    coverColor: 'from-pink-900/30 via-void to-surface',
    coverQuery: '"design conference Nigeria creative workspace studio warm"',
  },
  {
    id: 'startup-grind-lagos',
    name: 'Startup Grind Lagos',
    initials: 'SG',
    bio: 'Monthly founder meetups featuring real conversations with people building real things.',
    longBio: "Startup Grind Lagos is the local chapter of the world's largest startup community. Every month, we bring together founders, investors, and operators for a raw, honest fireside chat. No fluff. No PR spin. Just real talk about building companies in Africa.",
    type: 'Startup',
    categories: ['startup','career'],
    eventsCount: 36,
    attendees: '12k',
    rating: 4.9,
    since: 2018,
    website: 'startupgrind.com/lagos',
    twitter: '@StartupGrindLOS',
    instagram: '@startupgrindlagos',
    avatarColor: 'bg-emerald-900/50',
    coverColor: 'from-emerald-900/30 via-void to-surface',
    coverQuery: '"startup pitch event Nigeria founder stage audience Yaba"',
  },
  {
    id: 'ingressive-for-good',
    name: 'Ingressive for Good',
    initials: 'i4G',
    bio: 'Empowering 1 million Africans with digital skills and tech career opportunities.',
    longBio: "Ingressive for Good (i4G) is on a mission to train 1 million Africans in digital skills. Through bootcamps, career fairs, scholarships, and community events, i4G connects emerging tech talent with opportunities. Our events are always free or heavily subsidised.",
    type: 'Community',
    categories: ['community','career','tech'],
    eventsCount: 18,
    attendees: '22k',
    rating: 4.7,
    since: 2017,
    website: 'ingressive4good.org',
    twitter: '@i4GOrg',
    instagram: '@ingressive4good',
    avatarColor: 'bg-blue-900/50',
    coverColor: 'from-blue-900/30 via-void to-surface',
    coverQuery: '"tech career fair Nigeria Africa young professionals networking"',
  },
]

/* ── Mock Events ───────────────────────────────────────────────── */
export const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Lagos Developer Summit 2025',
    description: "Two days of keynotes, workshops, and networking with Lagos' top developers and engineers.",
    longDesc: "Lagos Developer Summit is the premier annual gathering for software developers, engineers, and tech professionals across Lagos and Nigeria. Now in its 4th edition, this two-day conference brings together some of the brightest minds in Africa's tech ecosystem.\n\nExpect keynotes from senior engineers at top African and global tech companies, hands-on workshops, open-source collaborations, and unfiltered conversations about the realities of building in Africa's tech landscape.\n\nWhether you're a junior developer looking to level up or a senior engineer wanting to give back to the community — this is the event you don't want to miss.",
    organizerId: 'gdg-lagos',
    organizer: 'GDG Lagos',
    orgInitials: 'GDG',
    orgColor: 'bg-primary/25',
    date: 'Jun 28–29, 2025',
    dateRaw: '2025-06-28',
    time: '9:00 AM – 6:00 PM',
    location: 'Landmark Centre, Victoria Island',
    format: 'in-person',
    category: 'tech',
    price: 5000,
    badge: 'featured',
    capacity: 500,
    filled: 73,
    speakers: [
      { name: 'Ire Aderinokun', title: 'VP Engineering, Helicarrier', initials: 'IA', color: 'bg-primary/30' },
      { name: 'David Ojochide', title: 'Senior Engineer, Flutterwave', initials: 'DO', color: 'bg-lavender/20' },
      { name: 'Femi Longe',     title: 'Co-founder, CcHUB',           initials: 'FL', color: 'bg-pink-900/40' },
    ],
    photoQuery: '"tech developer conference stage Nigeria Lagos dark dramatic audience"',
  },
  {
    id: '2',
    title: 'Design Unplugged: Vol. 3',
    description: 'Live critiques, portfolio reviews, and raw conversations about making it as a designer in Africa.',
    longDesc: "Design Unplugged is our quarterly virtual gathering where designers get real. No rehearsed talks, no polished presentations — just live portfolio critiques, honest feedback, and unscripted conversations about what it actually takes to build a design career in Africa.\n\nVol. 3 focuses on Product Design for Emerging Markets — how do you design for users who have intermittent internet, feature phones, and completely different mental models than Silicon Valley assumes?\n\nJoin 300+ designers from across West Africa for an evening of learning, laughter, and real talk.",
    organizerId: 'design-week-ng',
    organizer: 'Design Week NG',
    orgInitials: 'DW',
    orgColor: 'bg-pink-900/50',
    date: 'Jul 5, 2025',
    dateRaw: '2025-07-05',
    time: '6:00 PM – 9:00 PM',
    location: 'Online · Zoom',
    format: 'online',
    category: 'design',
    price: 'Free',
    badge: 'free',
    capacity: 300,
    filled: 58,
    speakers: [
      { name: 'Tobi Ashiru',    title: 'Product Designer, Paystack',     initials: 'TA', color: 'bg-pink-900/50' },
      { name: 'Ada Nduka Oyom', title: 'Founder, She Code Africa',        initials: 'AO', color: 'bg-purple-900/50' },
    ],
    photoQuery: '"product design workshop Figma laptop Nigeria creative studio warm-lit"',
  },
  {
    id: '3',
    title: 'Startup Grind Lagos — July',
    description: "Monthly founder meetup with a fireside chat from a founder who's been deep in the trenches.",
    longDesc: "Every month, Startup Grind Lagos brings together Lagos' most ambitious founders, operators, and investors for one honest conversation.\n\nThis July, we sit down with a founder who raised a Series A in a market that said no for two years. We'll talk about the rejections, the pivots, the co-founder conflicts, and what finally unlocked the raise.\n\nAfter the fireside, stick around for open networking — some of the best deals, partnerships, and friendships in the Lagos tech scene have started at these events.",
    organizerId: 'startup-grind-lagos',
    organizer: 'Startup Grind Lagos',
    orgInitials: 'SG',
    orgColor: 'bg-emerald-900/50',
    date: 'Jul 12, 2025',
    dateRaw: '2025-07-12',
    time: '5:00 PM – 8:30 PM',
    location: 'Co-Creation Hub, Yaba',
    format: 'in-person',
    category: 'startup',
    price: 2500,
    badge: 'selling-fast',
    capacity: 150,
    filled: 87,
    speakers: [
      { name: 'Speaker TBA', title: 'Series A Founder', initials: '?', color: 'bg-emerald-900/50' },
    ],
    photoQuery: '"founder fireside chat startup Nigeria CcHUB Yaba intimate audience"',
  },
  {
    id: '4',
    title: 'Tech Career Fair 2025',
    description: 'Connect with 40+ tech companies hiring in Lagos. Free entry, bring your CV.',
    longDesc: "The Ingressive for Good Tech Career Fair is the biggest free career event in Lagos. Over 40 tech companies will be on the ground, actively recruiting for engineering, product, design, data, and sales roles.\n\nBring your CV, sharpen your pitch, and come ready to have real conversations. This isn't just a CV drop — companies send their actual hiring managers and team leads.",
    organizerId: 'ingressive-for-good',
    organizer: 'Ingressive for Good',
    orgInitials: 'i4G',
    orgColor: 'bg-blue-900/50',
    date: 'Jul 19, 2025',
    dateRaw: '2025-07-19',
    time: '10:00 AM – 5:00 PM',
    location: 'Eko Hotel & Suites, VI',
    format: 'in-person',
    category: 'career',
    price: 'Free',
    badge: 'free',
    capacity: 2000,
    filled: 41,
    speakers: [],
    photoQuery: '"tech career fair Nigeria Africa professional hall company booths young people"',
  },
  {
    id: '5',
    title: 'ALX Africa Monthly Meetup',
    description: 'Monthly gathering for ALX alumni and learners across West Africa.',
    longDesc: "The ALX Africa Monthly Meetup is where our community comes together to share progress, ask questions, celebrate wins, and keep each other accountable.\n\nThis month's theme: Life After ALX — featuring three graduates who've landed roles in the past 6 months sharing exactly what worked and what didn't.",
    organizerId: 'ingressive-for-good',
    organizer: 'Ingressive for Good',
    orgInitials: 'i4G',
    orgColor: 'bg-blue-900/50',
    date: 'Jul 26, 2025',
    dateRaw: '2025-07-26',
    time: '4:00 PM – 6:00 PM',
    location: 'Online · Google Meet',
    format: 'online',
    category: 'community',
    price: 'Free',
    badge: 'free',
    capacity: 500,
    filled: 29,
    speakers: [],
    photoQuery: '"young African tech professionals online community meetup diverse"',
  },
  {
    id: '6',
    title: 'Product Design Bootcamp — Intensive',
    description: 'Two-day intensive covering research, wireframing, prototyping, and portfolio building.',
    longDesc: "Design Week NG's flagship bootcamp is back — two full days of hands-on product design training.\n\nDay 1 covers user research, problem definition, and wireframing. Day 2 goes into high-fidelity prototyping in Figma, usability testing, and presenting your work.\n\nLimited to 30 participants. Laptops required.",
    organizerId: 'design-week-ng',
    organizer: 'Design Week NG',
    orgInitials: 'DW',
    orgColor: 'bg-pink-900/50',
    date: 'Aug 2–3, 2025',
    dateRaw: '2025-08-02',
    time: '9:00 AM – 5:00 PM',
    location: 'The Nest, Herbert Macaulay Way, Yaba',
    format: 'in-person',
    category: 'design',
    price: 8000,
    capacity: 30,
    filled: 63,
    speakers: [],
    photoQuery: '"product design bootcamp Figma workshop Nigeria small group laptops creative"',
  },
]

/* ── Helpers ───────────────────────────────────────────────────── */
export const getEventById        = (id: string) => EVENTS.find(e => e.id === id)
export const getOrganizerById    = (id: string) => ORGANIZERS.find(o => o.id === id)
export const getEventsByOrganizer = (orgId: string) => EVENTS.filter(e => e.organizerId === orgId)
export const getOrganizerForEvent = (ev: Event)  => ORGANIZERS.find(o => o.id === ev.organizerId)

export const CATEGORY_META: Record<Category, { label: string; emoji: string; tagClass: string }> = {
  tech:      { label: 'Tech',      emoji: '💻', tagClass: 'tag-tech' },
  design:    { label: 'Design',    emoji: '🎨', tagClass: 'tag-design' },
  startup:   { label: 'Startup',   emoji: '🚀', tagClass: 'tag-startup' },
  career:    { label: 'Career',    emoji: '💼', tagClass: 'tag-career' },
  community: { label: 'Community', emoji: '🌍', tagClass: 'tag-community' },
}

export const FORMAT_META: Record<Format, { label: string }> = {
  'in-person': { label: 'In-Person' },
  'online':    { label: 'Online' },
  'hybrid':    { label: 'Hybrid' },
}

/* ──────────────────────────────────────────────────────────────
   Shared Helpers & Constants
────────────────────────────────────────────────────────────── */

export const CATEGORY_ORDER: Category[] = [
  'tech',
  'design',
  'startup',
  'career',
  'community',
]

const COLOR_VARIANTS = [
  'bg-primary/25',
  'bg-pink-900/40',
  'bg-emerald-900/40',
  'bg-blue-900/40',
  'bg-purple-900/40',
  'bg-orange-900/40',
]

const GRADIENT_VARIANTS = [
  'linear-gradient(135deg, rgba(79,124,255,0.35) 0%, rgba(10,10,10,1) 100%)',
  'linear-gradient(135deg, rgba(236,72,153,0.35) 0%, rgba(10,10,10,1) 100%)',
  'linear-gradient(135deg, rgba(16,185,129,0.35) 0%, rgba(10,10,10,1) 100%)',
  'linear-gradient(135deg, rgba(59,130,246,0.35) 0%, rgba(10,10,10,1) 100%)',
  'linear-gradient(135deg, rgba(168,85,247,0.35) 0%, rgba(10,10,10,1) 100%)',
]

function hashString(value: string) {
  let hash = 0

  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash)
  }

  return Math.abs(hash)
}

export function makeInitials(value: string): string {
  if (!value) return 'NA'

  const parts = value
    .trim()
    .split(' ')
    .filter(Boolean)

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

export function colorFromSeed(seed: string): string {
  const index = hashString(seed) % COLOR_VARIANTS.length
  return COLOR_VARIANTS[index]
}

export function gradientFromSeed(seed: string): string {
  const index = hashString(seed) % GRADIENT_VARIANTS.length
  return GRADIENT_VARIANTS[index]
}
