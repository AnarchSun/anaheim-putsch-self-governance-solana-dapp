// FILE: src/components/wallet/ClientWalletProvider.tsx
'use client'

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import React, { useEffect, useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react';

export function WalletConnector() {
  const { connect, connected, connecting, disconnect, wallet, publicKey } = useWallet();

  useEffect(() => {
    if (!connected && wallet) {
      connect().catch((err) => {
        console.error('Wallet connection failed:', err);
      });
    }
  }, [wallet, connected, connect]);

  return null;
}

export function ClientWalletProvider({ children }: { children: React.ReactNode }) {
    const network = WalletAdapterNetwork.Devnet
    const endpoint = 'https://api.devnet.solana.com'

    const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

    return (
      <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
              {children}
          </WalletProvider>
      </ConnectionProvider>
    )
}
