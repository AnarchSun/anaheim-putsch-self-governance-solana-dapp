// src/app/providers.tsx
'use client'

import { AppProviders } from '@/components/app-providers'
import { AppLayout } from '@/components/app-layout'

const links = [
    { label: 'Home', path: '/' },
    { label: 'Account', path: '/account' },
]

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppProviders>
            <AppLayout links={links}>{children}</AppLayout>
        </AppProviders>
    )
}
