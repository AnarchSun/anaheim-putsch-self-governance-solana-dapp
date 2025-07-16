// File: src/components/solana/WalletButton.tsx
'use client'

import { useSolanaWallet } from '@wallet-ui/react'

export function WalletButton() {
    const { connected, publicKey, connect, disconnect } = useSolanaWallet()

    return (
        <button
            onClick={connected ? disconnect : connect}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
            {connected ? `Disconnect (${publicKey?.slice(0, 6)}…)` : 'Connect Wallet'}
        </button>
    )
}
