// src/components/wallet/wallet-button.tsx
'use client'

import { WalletButton } from '@/components/solana/solana-provider'
import { redirect } from 'next/navigation'
import { useWalletUi } from '@wallet-ui/react'

export default function AccountListFeature() {
  const walletUi = useWalletUi()  // 👈 pas de `new`, c’est un hook
  const account = walletUi.account

  if (account) {
    return redirect(`/account/${account.address.toString()}`)
  }

  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <WalletButton />
      </div>
    </div>
  )
}
