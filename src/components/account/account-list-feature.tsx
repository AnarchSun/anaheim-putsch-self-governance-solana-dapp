// src/components/account/account-list-feature.tsx
'use client'

import { WalletButton } from '../solana/solana-provider'
import { redirect } from 'next/navigation'
import { useWalletUi } from '@wallet-ui/react'

export default function AccountListFeature() {
  const { account } = useWalletUi()  // <-- sans new

  if (account) {
    redirect(`/account/${account.address.toString()}`)
    return null  // React attend un rendu ou rien
  }

  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <WalletButton />
      </div>
    </div>
  )
}
