import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import ReduxProvider from '@/components/ReduxProvider'
import Script from 'next/script'
 
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Earn From Ads BD',
  description: 'Earn money by watching ads and completing tasks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
        <Script src="https://telegram.org/js/telegram-web-app.js" async />
        <Script src='//libtl.com/sdk.js' data-zone='9486612' data-sdk='show_9486612' /> 
      </head>
      <body className={nunito.className}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}





