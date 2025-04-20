import { Metadata } from 'next'
import '@styles/globals.css'
import { Providers } from '@/providers'
import { Toaster } from '@/components/ui/toaster'

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
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
} 