// src/components/account/account-list-feature.tsx
'use client'

import { WalletButton } from '../solana/solana-provider'

import { redirect } from 'next/navigation'
import { useWalletUi } from '@wallet-ui/react'
const account: any
export default function AccountListFeature() {
  const { account } = new useWalletUi ()

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
