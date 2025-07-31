// FILE: src/app/mining/page.tsx
'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import MiningClient from '@/components/mining/MiningClient'; // Use the new, correct component
import { ClientWalletMultiButton } from '@/components/wallet/ClientWalletMultiButton';

export default function MiningPage() {
    const { connected } = useWallet();

    return (
        <div className="space-y-8 text-center">
            <div>
                <h1 className="text-4xl font-bold">Anaheim Community Console</h1>
                <p className="text-muted-foreground mt-2">
                    Contribute to the community counter by interacting with the panel below.
                </p>
            </div>

            {/* If the wallet is not connected, show the connecting button. */}
            {!connected && (
                <div className="flex justify-center">
                    <ClientWalletMultiButton />
                </div>
            )}

            {/* If the wallet IS connected, show the main mining client. */}
            {connected && (
                <div className="flex justify-center">
                    <MiningClient />

                </div>
            )}
        </div>
    );
}