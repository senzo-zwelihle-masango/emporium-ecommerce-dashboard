import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000/'),
  title: {
    default: 'Emporium Ecommerce Dashboard',
    template: '%s | Emporium',
  },
  description:
    'Discover high-quality, trendy, and sustainable products at Elysian Emporium. Your go-to online store for modern apparel, electronics, and home goods. Experience a seamless shopping experience with Next.js.',
  keywords: [
    'online store',
    'ecommerce',
    'modern apparel',
    'electronics',
    'home goods',
    'trendy fashion',
    'sustainable products',
    'South African',
    'Next.js',
    'React',
    'TypeScript',
  ],
  authors: [{ name: 'Emporium', url: 'http://localhost:3000/' }],
  creator: 'Senzo Masango',
  publisher: 'Senzo Masango',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'http://localhost:3000/',
    title: 'Elysian — Ecommerce ',
    description:
      'Discover high-quality, trendy, and sustainable products at Elysian Emporium. Your go-to online store for modern apparel, electronics, and home goods.',
    siteName: 'Emporium',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emporium — Ecommerce ',
    description:
      'Discover high-quality, trendy, and sustainable products at Elysian Emporium. Your go-to online store for modern apparel, electronics, and home goods.',
    creator: '@senzomasango',
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      {
        url: '/favicon/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/favicon/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/favicon/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [{ rel: 'manifest', url: '/favicon/site.webmanifest' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}
