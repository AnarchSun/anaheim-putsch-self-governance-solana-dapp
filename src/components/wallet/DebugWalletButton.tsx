'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React, { useCallback } from 'react';

export const DebugWalletButton = () => {
    const { connected, wallets } = useWallet();
    const { visible, setVisible } = useWalletModal();

    const handleClick = useCallback(() => {
        console.log('Debug button clicked!');
        console.log('Modal is currently visible?', visible);
        console.log('Number of wallets detected:', wallets.length);

        // This is the function the real button calls internally
        setVisible(true);
    }, [visible, wallets, setVisible]);

    if (connected) {
        return <p>Wallet is connected!</p>;
    }

    return (
        <button onClick={handleClick} style={{ background: 'cyan', color: 'black', padding: '10px' }}>
            DEBUG: Open Wallet Modal
        </button>
    );
};