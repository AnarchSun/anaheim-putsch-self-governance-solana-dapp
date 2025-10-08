// FILE: src/app/mining/page.tsx
'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
<<<<<<< HEAD

// ===================================================================
// THIS IS THE DEFINITIVE FIX.
// 1. `MiningPanel` is imported WITHOUT curly braces because it has a default export.
// 2. `ClientWalletMultiButton` is imported WITH curly braces because it has a named export.
// This resolves the "Element type is invalid... got: undefined" error.
// ===================================================================
import MiningPanel from '@/components/mining/mining-panel';
import { ClientWalletMultiButton } from '@/components/wallet/ClientWalletMultiButton';

=======
import MiningClient from '@/components/mining/MiningClient'; // Use the new, correct component
import { ClientWalletMultiButton } from '@/components/wallet/ClientWalletMultiButton';
>>>>>>> main

export default function MiningPage() {
    const { connected } = useWallet();

    return (
<<<<<<< HEAD
        // This is a simple container. The main layout is handled by app-layout.tsx.
=======
>>>>>>> main
        <div className="space-y-8 text-center">
            <div>
                <h1 className="text-4xl font-bold">Anaheim Community Console</h1>
                <p className="text-muted-foreground mt-2">
                    Contribute to the community counter by interacting with the panel below.
                </p>
            </div>

<<<<<<< HEAD
            {/* If the user is not connected, we show the connected button. */}
=======
            {/* If the wallet is not connected, show the connecting button. */}
>>>>>>> main
            {!connected && (
                <div className="flex justify-center">
                    <ClientWalletMultiButton />
                </div>
            )}

<<<<<<< HEAD
            {/* The MiningPanel contains all the on-chain logic and UI. */}
            <div className="flex justify-center">
                <MiningPanel />
            </div>
=======
            {/* If the wallet IS connected, show the main mining client. */}
            {connected && (
                <div className="flex justify-center">
                    <MiningClient />

                </div>
            )}
>>>>>>> main
        </div>
    );
}