// File: src/components/app-layout.tsx
'use client'

import React from 'react'
import { Toaster } from './ui/sonner'
import { AppHeader } from '@/components/app-header'
import { AppFooter } from '@/components/app-footer'
import { AccountChecker } from '@/components/account/account-ui'
import { WalletButton } from '@/components/wallet/wallet-button'
import WalletUiDropdown from '@/components/wallet/ui/wallet-ui-dropdown'
import {ThemeProvider} from "next-themes";

export function AppLayout({
                              children,
                              links,
                          }: {
    children: React.ReactNode
    links: { label: string; path: string }[]
}) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="flex flex-col min-h-screen">
                <AppHeader
                    links={links}
                    WalletButton={WalletButton}
                    WalletUiDropdown={WalletUiDropdown}
                />
                <main className="flex-grow container mx-auto p-4">
                        <AccountChecker />
                    {children}
                </main>
                <AppFooter />
            </div>
            <Toaster />
        </ThemeProvider>
    )
}
