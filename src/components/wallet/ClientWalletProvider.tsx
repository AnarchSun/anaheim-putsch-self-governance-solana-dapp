// File: src/components/wallet/ClientWalletProvider.tsx
'use client'

import React, {ReactNode} from 'react'
import { SolanaProvider } from 'gill-react'

function WalletUiProvider(props: { children: ReactNode }) {
    return null;
}

export function ClientWalletProvider({ children }: { children: React.ReactNode }) {
    return (
        <SolanaProvider
            client={{
                sendAndConfirmTransaction: async () => {
                    throw new Error('sendAndConfirmTransaction not implemented.')
                },
                simulateTransaction: async () => {
                    throw new Error('simulateTransaction not implemented.')
                },
            }}
        >
            <WalletUiProvider>
                {children}
            </WalletUiProvider>
        </SolanaProvider>
    )
}
