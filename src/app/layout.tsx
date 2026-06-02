import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { ConditionalNav } from '@/components/ConditionalNav'
import { LenisProvider } from '@/components/LenisProvider'

export const metadata: Metadata = {
  title: {
    default: 'Verive — Verified Event Discovery',
    template: '%s | Verive',
  },
  description: 'Trust-first event discovery for the Lagos tech, design and startup ecosystem. Find verified events worth showing up for.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Verive',
  },
}

export const viewport: Viewport = {
  themeColor: '#C2820D',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Fontshare — Clash Display + General Sans */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <LenisProvider />
        <ConditionalNav />
        <main>{children}</main>
      </body>
    </html>
  )
}
