import React from 'react'
import ClientClusterUI from '@/components/cluster/ClientClusterUI'
import { AppProviders } from '@/components/app-providers'
import { AppLayout } from '@/components/app-layout'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Account', path: '/account' },
  { label: 'Mining', path: '/mining' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className="antialiased">
    <AppProviders>
      <AppLayout links={links}>
        {children}
        <ClientClusterUI /> {/* Le feu sacré, ici invoqué côté client */}
      </AppLayout>
    </AppProviders>
    </body>
    </html>
  )
}
