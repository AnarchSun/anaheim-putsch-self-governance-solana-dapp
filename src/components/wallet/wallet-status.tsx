// src/components/wallet/wallet-status.tsx
'use client'

import { useWalletUi } from '@wallet-ui/react'

export function WalletStatus() {
  const { account } = useWalletUi()
  const address = account?.toBase58?.() ?? account?.address ?? 'Adresse inconnue'

  return (
    <div className="flex flex-col text-xs text-right leading-tight">
      <p>🧙 Adresse : <span className="font-mono">{address}</span></p>
    </div>
  )
}
