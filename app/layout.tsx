import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sundram Yadav — The Living Plant',
  description: 'My life as a chemical plant — a journey through reactions, units, and transformations. From Ayodhya to IIT Dharwad.',
  keywords: ['Sundram Yadav', 'IIT Dharwad', 'Chemical Engineering', 'Portfolio', 'Ayodhya'],
}

import CustomCursor from './components/CustomCursor'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Special+Elite&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}
