// FILE: src/components/app-layout.tsx
'use client';

import React, { ReactNode } from 'react';
import { AppHeader } from './app-header';
import { AppFooter } from './app-footer';

interface AppLayoutProps {
    children: ReactNode;
    links: { label: string; path: string }[];
}

export function AppLayout({ children, links }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <AppHeader links={links} />

            {/*
        FIX: Add styling to the <main> element.
        - 'flex-grow': Ensures the main content area expands to fill available space, pushing the footer down.
        - 'container': This is a common Tailwind pattern to center content and give it a max-width.
        - 'mx-auto': Horizontally centers the container.
        - 'p-6' or 'py-10': Adds padding so content isn't stuck to the edges of the screen.
      */}
            <main className="flex-grow container mx-auto p-6 lg:p-10">
                {children}
            </main>

            <AppFooter />
        </div>
    );
}