// Path: src/app/providers.tsx
'use client';

import React, { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { SolflareWalletAdapter, UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import {GILL_HOOK_KEY_CONFIG, GillConfig} from "gill-monorepo/packages/react/src";
require('@solana/wallet-adapter-react-ui/styles.css');

/**
 * Wrapper provider to utilize gill hooks
 */
export function GillProvider({
                               config,
                               children,
                               queryClient = new QueryClient(),
                             }: {
  config: GillConfig;
  children: React.ReactNode;
  queryClient?: QueryClient;
}) {
  queryClient.setQueryData(GILL_HOOK_KEY_CONFIG, config);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
// 🔥 fallback queryClient pour sécuriser tous les hooks Gill
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        throw new Error(`No queryFn defined for ${JSON.stringify(queryKey)}`);
      },
      retry: false,
    },
  },
});

// 🔥 Gill config explicite pour tous les hooks
const gillConfig = {
  endpoint: clusterApiUrl(WalletAdapterNetwork.Devnet),
  commitment: 'confirmed' as const,
};

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
      () => [new SolflareWalletAdapter(), new UnsafeBurnerWalletAdapter()],
      [network]
  );

  return (
      <GillProvider config={gillConfig} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
              <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </QueryClientProvider>
      </GillProvider>
  );
}
