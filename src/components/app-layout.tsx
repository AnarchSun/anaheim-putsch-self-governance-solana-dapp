// FILE: src/components/app-layout.tsx
'use client'

import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/sonner'
import { AppHeader } from '@/components/app-header'
import React from 'react'
import { AppFooter } from '@/components/app-footer'

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
                <AppHeader links={links} />

                {/*
          This main area now only has padding.
          The pages will handle the centering and max-width.
          This gives us page-by-page layout control.
        */}
                <main className="flex-grow p-4 sm:p-8">

                    {/* We now directly render the children. */}
                    {/* The pages themselves will decide if they need a box. */}
                    {children}

                </main>
                <AppFooter />
            </div>
            <Toaster />
        </ThemeProvider>
    )
}