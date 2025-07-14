// 📄 src/components/app/ClientAppLayout.tsx
'use client'

import React from 'react'
import { AppHeader } from '@/components/header/AppHeader'
import { AppFooter } from '@/components/footer/AppFooter'
import { ClientWalletProvider } from '@/components/wallet/ClientWalletProvider'

export function ClientAppLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClientWalletProvider>
            <div className="flex flex-col min-h-screen">
                <AppHeader />
                <main className="flex-grow container mx-auto p-4">{children}</main>
                <AppFooter />
            </div>
        </ClientWalletProvider>
    )
}
