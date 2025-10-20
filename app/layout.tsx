import { metadata } from '@/lib/metadata'
import { aeonik, aeonikAir, aeonikMono } from '@/lib/font'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from 'uploadthing/server'
import { ourFileRouter } from '@/app/api/uploadthing/core'
import { Toaster } from '@/components/ui/sonner'
import { ReactLenis } from '@/components/providers/lenis-provider'
import { NextThemeProvider } from '@/components/providers/next-themes-provider'
import { NotificationProvider } from '@/components/providers/notification-provider'
import './globals.css'

export { metadata }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ReactLenis
      root
      options={{
        smoothWheel: true,
        lerp: 0.1,
        duration: 2,
        orientation: 'vertical',
        gestureOrientation: 'both',
        syncTouch: true,
        syncTouchLerp: 0.075,
        touchInertiaExponent: 1.7,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        infinite: false,
        autoResize: true,
        autoRaf: true,
        anchors: true,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${aeonikAir.variable} ${aeonikMono.variable} ${aeonik.variable} font-aeonik antialiased`}
        >
          <NextThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <NextSSRPlugin
              /**
               * The `extractRouterConfig` will extract **only** the route configs
               * from the router to prevent additional information from being
               * leaked to the client. The data passed to the client is the same
               * as if you were to fetch `/api/uploadthing` directly.
               */
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
            <Toaster theme="system" />

            <NotificationProvider>{children}</NotificationProvider>
          </NextThemeProvider>
        </body>
      </html>
    </ReactLenis>
  )
}
