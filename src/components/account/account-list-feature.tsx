// Path: src/components/account/account-list-feature.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { ClientWalletMultiButton } from '@/components/wallet/ClientWalletMultiButton';

export default function AccountListFeature() {
    const router = useRouter();
    const { connected, publicKey } = useWallet();

    useEffect(() => {
        if (connected && publicKey) {
            router.push(`/account/${publicKey.toBase58()}`);
        }
    }, [connected, publicKey, router]);

    if (connected && publicKey) {
        return (
            <div className="text-center">
                <p>Wallet connected. Redirecting to your account...</p>
            </div>
        );
    }

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