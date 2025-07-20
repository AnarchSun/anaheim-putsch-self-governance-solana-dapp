// FILE: src/app/mining/page.tsx
'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import MiningPanel from '@/components/mining/mining-panel';
import ClientWalletMultiButton from '@/components/wallet/ClientWalletMultiButton';

export default function MiningPage() {
    const { connected } = useWallet();

    return (
        // The <main> tag has been replaced with a <div>.
        // All layout classes like 'container', 'mx-auto', 'p-6' have been removed.
        <div className="space-y-8 text-center">
            <div>
                <h1 className="text-4xl font-bold">Anaheim Community Console</h1>
                <p className="text-muted-foreground mt-2">
                    Contribute to the community counter by interacting with the panel below.
                </p>
            </div>

            {!connected && (
                <div className="flex justify-center">
                    <ClientWalletMultiButton />
                </div>
            )}

            <div className="flex justify-center">
                <MiningPanel />
            </div>
        </div>
    );
}