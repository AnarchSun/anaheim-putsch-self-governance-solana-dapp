'use client'

import { WalletButton } from '../solana/solana-provider'
import { redirect } from 'next/navigation'
import { useWalletUi } from '@wallet-ui/react'

export default function AccountListFeature() {
  const { account } = new useWalletUi ()

  if (account) {
    redirect(`/account/${account.address.toString()}`)
    return null // pour apaiser React, car redirect est une fonction qui ne rend rien
  }

  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <WalletButton />
      </div>
    </div>
  )
}
