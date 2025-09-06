// src/components/wallet/wallet-status.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
export default function WalletStatus() {
  const { publicKey, connected } = useWallet();

  return (
      <div className="p-4 border rounded-lg">
        {connected && publicKey ? (
            <p>Wallet: {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}</p>
        ) : (
            <p>Connect your wallet</p>
        )}
      </div>
  );
}
