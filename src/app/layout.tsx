import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import ReduxProvider from '@/components/ReduxProvider'
import AuthSessionProvider from '@/components/SessionProvider'
import AdsLoader from '@/components/AdsLoader'
import Script from 'next/script'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Earn From Ads BD',
  description: 'Earn money by watching ads and completing tasks',
  icons: {
    icon: "/favicon.ico", // path from public/
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn"  >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />

        <Script src="https://ad.gigapub.tech/script?id=3085" />

      </head>
      <body className={nunito.className}>
        <AuthSessionProvider>
          <ReduxProvider>
            <AdsLoader>
              {children}
            </AdsLoader>
          </ReduxProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}





