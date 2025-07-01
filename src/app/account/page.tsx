// File: src/components/account/page.tsx
'use client'

import { PublicKey } from '@solana/web3.js'
import AccountListFeature from '@/components/account/account-list-feature'
import { CreateTransaction } from '@/components/account/createTransaction'
import { AccountUI } from '@/components/account/account-ui'
import { WalletInfo } from '@/components/WalletInfo'
import { StakeStatus } from '@/components/stake/StakeStatus'  // <-- Import de StakeStatus
import { Rapper } from '@/components/rapper'

export default function Page() {
  const address = 'GvHe41dnJNzMZH3EcXHsdGLBWR7LPUr9Pb9v2pTxCRQj' // ✅ remplace avec une adresse valide
  const account = new PublicKey(address)

  return (
    <main className="space-y-6 p-6">
      <AccountListFeature />
      <Rapper address="9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt" />
      <CreateTransaction recipientAddress={address} />
      <AccountUI pubkey={address} account={account} />
      <WalletInfo />
      <StakeStatus /> {/* <-- Ajout de StakeStatus ici */}
    </main>
  )
}
