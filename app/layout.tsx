import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NavBar from './NavBar'
import { Analytics } from '@vercel/analytics/react';

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
        <NavBar />
        <main>
          {children}

        </main>
        <Analytics />
      </body>
    </html>
  )
}
