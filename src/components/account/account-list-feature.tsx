// FILE: src/components/account/account-list-feature.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

// ===================================================================
// FIX #1: THE IMPORT IS CORRECTED.
// We are now using a NAMED import (with curly braces { }) to match
// the named export in the component's file. This prevents the crash.
// ===================================================================
import { ClientWalletMultiButton } from '@/components/wallet/ClientWalletMultiButton';

/**
 * This component checks if a wallet is connected.
 * - If YES, it redirects the user to their specific account page.
 * - If NO, it displays a "Connect Wallet" button to prompt them to connect.
 */
export default function AccountListFeature() {
    const router = useRouter();
    const { connected, publicKey } = useWallet();

    // ===================================================================
    // FIX #2: THE REDIRECT LOGIC IS CORRECTED.
    // We use the `useEffect` hook to perform the redirect. This is the
    // standard and safe way to handle client-side navigation after a
    // component has loaded and a condition (like a wallet connecting) has changed.
    // We use `router.push()` instead of the server-side `redirect()`.
    // ===================================================================
    useEffect(() => {
        if (connected && publicKey) {
            router.push(`/account/${publicKey.toBase58()}`);
        }
    }, [connected, publicKey, router]);

    // If the wallet is connected, we are in the process of redirecting.
    // We can show a loading message or nothing at all.
    if (connected && publicKey) {
        return (
            <div className="text-center">
                <p>Wallet connected. Redirecting to your account...</p>
            </div>
        );
    }

    // If not connected, show the "call to action" to connect the wallet.
    return (
        <div className="hero py-16 text-center">
            <div className="hero-content">
                <div className="max-w-md space-y-4">
                    <h1 className="text-4xl font-bold">Welcome to Anaheim</h1>
                    <p className="text-muted-foreground">
                        Please connect your wallet to view your account details and start participating.
                    </p>
                    <ClientWalletMultiButton />
                </div>
            </div>
        </div>
    );
}