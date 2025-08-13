// FILE: src/app/layout.tsx
'use client'; // This MUST be a client component to use providers.

import React, { ReactNode, useMemo } from 'react';
import './globals.css'; // This loads your stylesheet.

// ===================================================================
// THIS IS THE DEFINITIVE FIX.
// We are building the entire provider hierarchy here in the root layout
// to guarantee that every component is wrapped correctly.
// ===================================================================

// 1. Standard Solana Wallet Adapter Imports
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

// 2. Your Application's Components
import { AppLayout } from '@/components/app-layout'; // The visual shell
import { ThemeProvider } from '@/components/theme-provider'; // Your theme provider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// This is the standard wallet adapter CSS.
require('@solana/wallet-adapter-react-ui/styles.css');

// We create the QueryClient instance once.
const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  // This is the RPC endpoint for the Solana Devnet.
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || 'https://api.devnet.solana.com';

  // This is the list of wallets your dApp will support.
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  // This is the full list of navigation links for your header.
  const links: { label: string; path: string }[] = [
    { label: 'Home', path: '/' },
    { label: 'Account', path: '/account' },
    { label: 'Mining', path: '/mining' },
    { label: 'Stake', path: '/stake' },
    { label: 'Posts', path: '/posts' },
    { label: 'Gemini-Helper', path: '/dev-helper' },
  ];

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
    <body className={`antialiased`}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <QueryClientProvider client={queryClient}>

              {/*
                    This is the key: The AppLayout (which contains the header)
                    is now guaranteed to be inside all the necessary providers.
                  */}
              <AppLayout links={links}>{children}</AppLayout>

            </QueryClientProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
    </body>
    </html>
  );
}