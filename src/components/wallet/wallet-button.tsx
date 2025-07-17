// src/components/wallet/wallet-button.tsx
'use client'; // <-- MUST BE THE FIRST LINE

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletModalButton } from '@solana/wallet-adapter-react-ui';
import React from 'react';

export const WalletButton = () => {
    const { connected } = useWallet();

    return (
        <div>
            {/* These buttons need client-side JS to function */}
            {connected ? <WalletDisconnectButton /> : <WalletModalButton />}
        </div>
    );
};