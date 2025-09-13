import type { Metadata } from 'next'
import './globals.css'

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
