// FILE: src/app/mining/page.tsx
'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

// ===================================================================
// THIS IS THE DEFINITIVE FIX.
// 1. `MiningPanel` is imported WITHOUT curly braces because it has a default export.
// 2. `ClientWalletMultiButton` is imported WITH curly braces because it has a named export.
// This resolves the "Element type is invalid... got: undefined" error.
// ===================================================================
import MiningPanel from '@/components/mining/mining-panel';
import { ClientWalletMultiButton } from '@/components/wallet/ClientWalletMultiButton';


export default function MiningPage() {
    const { connected } = useWallet();

    return (
        // This is a simple container. The main layout is handled by app-layout.tsx.
        <div className="space-y-8 text-center">
            <div>
                <h1 className="text-4xl font-bold">Anaheim Community Console</h1>
                <p className="text-muted-foreground mt-2">
                    Contribute to the community counter by interacting with the panel below.
                </p>
            </div>

            {/* If the user is not connected, we show the connected button. */}
            {!connected && (
                <div className="flex justify-center">
                    <ClientWalletMultiButton />
                </div>
            )}

            {/* The MiningPanel contains all the on-chain logic and UI. */}
            <div className="flex justify-center">
                <MiningPanel />
            </div>
        </div>
    );
}