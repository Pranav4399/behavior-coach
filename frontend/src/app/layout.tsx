import { Metadata } from 'next'
import '@styles/globals.css'
import { Providers } from '@/providers'

export const metadata: Metadata = {
  title: 'Behavior Coach',
  description: 'Behavioral coaching application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
} 