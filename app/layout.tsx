import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NavBar from './NavBar'
import { Analytics } from '@vercel/analytics/react';
import Providers from './components/Providers';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Track remaining calories',
  description: 'Track your remaining calories through the week.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme='dracula'>
      <body className={inter.className}>
        <Providers>
          <NavBar />
          <main className='p-3'>

            {children}

          </main>
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
