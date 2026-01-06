import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Memoire IA',
  description: 'Created with v0',
  generator: 'v0.dev',
}

import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
