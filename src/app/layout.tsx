// PATH: src/app/layout.tsx

'use client';

import './globals.css'
import Providers from './providers';
import { AppLayout } from '@/components/app-layout';

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
