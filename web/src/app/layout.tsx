import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Product Search Assistant',
  description: 'Conversational e-commerce product search powered by AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}