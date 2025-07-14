// 📄 src/components/wallet/ClientWalletProvider.tsx
'use client'

import { WalletProvider } from '@wallet-ui/react'
import React from 'react'

export function ClientWalletProvider({ children }: { children: React.ReactNode }) {
    return <WalletProvider>{children}</WalletProvider>
}
