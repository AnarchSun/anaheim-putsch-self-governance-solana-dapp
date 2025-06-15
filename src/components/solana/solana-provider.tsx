// src/components/solana/solana-provider.tsx
'use client'

import dynamic from 'next/dynamic'
import React, { ReactNode } from 'react'
import '@wallet-ui/tailwind/index.css'
import * as WalletUI from '@wallet-ui/react'
import type { WalletUiDropdownProps } from '@wallet-ui/react';

// Typage précis du maybeInit, pour sortir de l'ombre "any"
const maybeInit = (WalletUI as { WalletUi?: { init?: () => void } }).WalletUi?.init

if (typeof maybeInit === 'function') {
  maybeInit()
}

export function SolanaProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

// Chargement dynamique des composants avec la clé .default et extraction des sous-composants
export const WalletButton = dynamic(
  () =>
    import('@wallet-ui/react').then(
      (mod) => mod.default.WalletUiDropdown as React.ComponentType<WalletUiDropdownProps>

    ),
  { ssr: false },
)

export const ClusterButton = dynamic(
  () =>
    import('@wallet-ui/react').then(
      (mod) => mod.default.WalletUiDropdown as React.ComponentType<WalletUiDropdownProps>

    ),
  { ssr: false },
)
