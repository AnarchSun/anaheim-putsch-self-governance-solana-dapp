// src/components/wallet/wallet-button.tsx
'use client'; // <-- MUST BE THE FIRST LINE

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletModalButton } from '@solana/wallet-adapter-react-ui';
import React from 'react';

export const WalletButton = () => {
    const { connected } = useWallet();

    return (
        <div>
            {/* Ces boutons nécessitent du JS côté client pour fonctionner */}
            {connected ? <WalletDisconnectButton /> : <WalletModalButton />}
        </div>
    );
};
