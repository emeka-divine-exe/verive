import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { LenisProvider } from '@/components/LenisProvider'

export const metadata: Metadata = {
  title: 'Verivent — Discover Verified Events',
  description:
    'Verivent curates only verified, high-value tech, design, and startup events — so you find the right opportunity before everyone else does.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Verivent',
  },
  openGraph: {
    title: 'Verivent — Discover Verified Events',
    description: 'Curated. Verified. Trusted. The platform for meaningful opportunities.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#7B3FE4',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <LenisProvider />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
