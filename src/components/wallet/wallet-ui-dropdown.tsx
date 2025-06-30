// src/components/WalletUiDropdown.tsx
'use client'

import React from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { ClientOnly } from '@/components/ClientOnly'

export default function WalletUiDropdown() {
  return (
    <ClientOnly>
      <WalletMultiButton className="bg-black text-white" />
    </ClientOnly>
  )
}
