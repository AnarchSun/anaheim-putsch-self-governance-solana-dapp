// PATH: src/app/layout.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Fix Providers JSX error, correct import from ./providers, matrix override, filename/path éternel!

'use client';

import Providers from './providers'; // PATCH: import default Providers from local providers file!
import { AppLayout } from '@/components/app-layout';

// PATCH: Navigation links for the app — anarcho-autogestion, matrix override!
const links = [
    { label: 'Home', path: '/' },
    { label: 'Account', path: '/account' },
    { label: 'Stake & Mining', path: '/stake-mining' },
    { label: 'Posts', path: '/posts' },
    { label: 'Gemini-Helper', path: '/dev-helper' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <Providers>
            <AppLayout links={links}>
                {children}
            </AppLayout>
        </Providers>
        </body>
        </html>
    );
}

// PATCH NOTES:
// - Fixes "Providers cannot be used as a JSX component" TS2786 error
// - Use default export Providers from ./providers, not named export from solana-provider!
// - All context providers (Solana, Theme, Query, etc) must be combined in ./providers
// - Filename/path éternel, grunge matrix override!