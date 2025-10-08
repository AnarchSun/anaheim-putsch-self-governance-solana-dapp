// src/components/wallet/wallet-button.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function WalletButton() {
    const { connected, connecting, publicKey } = useWallet();

    if (connecting) return <span>🔄 Connecting...</span>;
    if (!connected) return <WalletMultiButton />;
    return <span>✅ Connected: {publicKey?.toBase58().slice(0, 6)}...</span>;
}
