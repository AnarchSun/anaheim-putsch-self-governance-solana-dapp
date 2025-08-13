// FILE: src/components/wallet/WalletProviders.tsx

'use client';

import React, { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

interface WalletProvidersProps {
  children: React.ReactNode;
}

export function WalletProviders({ children }: WalletProvidersProps) {
  // Le réseau des profondeurs où résident nos rêves solanaires
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => `https://api.${network}.solana.com`, [network]);

  // Les portails vers d'autres dimensions (wallets)
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}
