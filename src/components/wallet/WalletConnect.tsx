// src/components/WalletConnect.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
export function WalletConnectButton() {
    const { connect, connected, connecting, disconnect, wallet, select } = useWallet();
    const [errorMsg, setErrorMsg] = useState('');

    const handleConnect = async () => {
        try {
            setErrorMsg('');
            if (!wallet) {
                // If you want to force Phantom, uncomment:
                // select('Phantom');
            }
            await connect();
        } catch (err: any) {
            console.error('❌ Wallet connection failed:', err);
            setErrorMsg(err.message || 'Failed to connect');
        }
    };

    if (connected) {
        return (
            <button onClick={() => disconnect()}>
                🔌 Disconnect {wallet?.adapter?.name}
            </button>
        );
    }

    return (
        <div>
            <button onClick={handleConnect} disabled={connecting}>
                {connecting ? '⏳ Connecting...' : '💳 Connect Wallet'}
            </button>
            {errorMsg && <div style={{ color: 'red' }}>{errorMsg}</div>}
        </div>
    );
}
