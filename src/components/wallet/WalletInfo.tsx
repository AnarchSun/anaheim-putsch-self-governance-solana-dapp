// FILE: src/components/wallet/WalletInfo.tsx
'use client';

import React from 'react';

// FIX: Import the two correct hooks from the main adapter library.
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

// Import your utility for shortening addresses.
import { ellipsify } from '@/lib/utils';
import { AppAlert } from '../app-alert';

/**
 * This component displays key information about the currently connected wallet,
 * including its address and the network (cluster) it is connected to.
 */
export default function WalletInfo() {
  // FIX: Use the official `useWallet` hook to get the wallet's public key and status.
  const { publicKey, connected } = useWallet();

  // FIX: Use the official `useConnection` hook to get the network endpoint.
  const { connection } = useConnection();

  // Handle the case where the wallet is not connected.
  if (!connected || !publicKey) {
    return (
        <AppAlert action={null}>
          <p className="text-center font-semibold">Please connect a wallet to view its details.</p>
        </AppAlert>
    );
  }

  // Once connected, derive the necessary information.
  const address = publicKey.toBase58();
  const endpoint = connection.rpcEndpoint;

  // Render the wallet details in a structured way.
  return (
      <div className="space-y-2 rounded-lg border bg-card p-4 shadow-md">
        <h3 className="text-lg font-bold">Wallet Details</h3>
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-semibold">Status:</span>{' '}
            <span className="text-green-400">Connected</span>
          </p>
          <p>
            <span className="font-semibold">Address:</span>{' '}
            <span className="font-mono">{ellipsify(address)}</span>
          </p>
          <p>
            <span className="font-semibold">Network:</span>{' '}
            <span className="font-mono">{endpoint}</span>
          </p>
        </div>
      </div>
  );
}