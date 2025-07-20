// FILE: src/app/layout.tsx

import type { Metadata } from 'next'
import './globals.css'
import { AppProviders } from '@/components/app-providers'
import { AppLayout } from '@/components/app-layout'
import React from 'react'

export const metadata: Metadata = {
    title: 'Anaheim dApp',
    description: 'A decentralized governance platform on Solana',
}

// These links are now correctly populated based on your file structure.
const links: { label:string; path: string }[] = [
    { label: 'Home', path: '/' },
    { label: 'Account', path: '/account' },
    { label: 'Mining', path: '/mining' },
    { label: 'Stake', path: '/stake' },
    { label: 'Posts', path: '/posts' },
    { label: 'Gemini-Helper', path: '/dev-helper' },
]

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`antialiased`}>
        <AppProviders>
            <AppLayout links={links}>{children}</AppLayout>
        </AppProviders>
        </body>
        </html>
    )
}