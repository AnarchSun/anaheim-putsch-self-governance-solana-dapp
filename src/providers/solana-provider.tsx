// src/providers/solana-provider.tsx
'use client'

import dynamic from 'next/dynamic'
import React, { ReactNode } from 'react'
import type { WalletUiDropdownProps } from '@wallet-ui/react'


export function SolanaProvider({ children }: { children: ReactNode }) {
    return <>{children}</>
}

// ✅ Use dynamic import for WalletUiDropdown
export const WalletUiDropdown = dynamic<WalletUiDropdownProps>(
    () =>
        import('@wallet-ui/react').then((mod) =>
            mod.WalletUiDropdown
                ? mod.WalletUiDropdown
                : () => <div className="text-red-500">WalletUiDropdown not found</div>
        ),
    { ssr: false }
)


// Supprimer la tentative de dynamic import pour WalletButton puisque nous avons notre propre composant
export { WalletButton }