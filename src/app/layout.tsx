import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import SWRProvider from '@/components/providers/SWRProvider'

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
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
      </head>
      <body className={nunito.className}>
        <SWRProvider>
          {children}
        </SWRProvider>
      </body>
    </html>
  )
}
