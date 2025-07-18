// FILE: src/components/account/account-list-feature.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { redirect } from 'next/navigation';

// FIX: Import the correct, client-side-only wallet button that the rest of the app uses.
import ClientWalletMultiButton from '@/components/wallet/ClientWalletMultiButton';

/**
 * This component checks if a wallet is connected.
 * - If YES, it redirects the user to their specific account page.
 * - If NO, it displays a "Connect Wallet" button to prompt them to connect.
 */
export default function AccountListFeature() {
  // FIX: Use the standard `useWallet` hook to check the connection status.
  const { connected, publicKey } = useWallet();

  // If the wallet is connected and we have the public key, redirect.
  if (connected && publicKey) {
    redirect(`/account/${publicKey.toBase58()}`);
    // A redirect doesn't happen instantly, so we return null to render nothing while it occurs.
    return null;
  }

  // If not connected, show a hero section with the connect button.
  return (
      <div className="hero py-16 text-center">
        <div className="hero-content">
          <div className="max-w-md space-y-4">
            <h1 className="text-4xl font-bold">Welcome to Anaheim</h1>
            <p className="text-muted-foreground">
              Please connect your wallet to view your account details and start participating.
            </p>
            {/* FIX: Render the correct, working button component. */}
            <ClientWalletMultiButton />
          </div>
        </div>
      </div>
  );
}