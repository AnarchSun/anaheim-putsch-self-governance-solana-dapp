// PATH: src/components/wallet/wallet-status.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Remove unused WalletMultiButton import, batch fix grunge, filename/path éternel!

'use client';

import { useWallet } from '@solana/wallet-adapter-react';
// PATCH: Removed unused import
// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function WalletStatus() {
    const { publicKey, connected } = useWallet();

    return (
        <div className="p-4 border rounded-lg">
            {connected && publicKey ? (
                <p>Wallet: {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}</p>
            ) : (
                <p>Connect your wallet</p>
            )}
        </div>
    );
}

// PATCH NOTES:
// - Removed unused WalletMultiButton import (@typescript-eslint/no-unused-vars)
// - No more warning!
// - Filename/path éternel, matrix override, batch fix grunge!