// src/components/account/account-ui.tsx
'use client'

import { PublicKey } from '@solana/web3.js'
import AccountListFeature from '@/components/account/account-list-feature'
import { CreateTransaction } from '@/components/account/createTransaction'
import { AccountUI } from '@/components/account/account-ui'

export default function Page() {
  const address = 'GvHe41dnJNzMZH3EcXHsdGLBWR7LPUr9Pb9v2pTxCRQj' // ✅ remplace avec une adresse valide
  const account = new PublicKey(address)

  return (
    <main className="space-y-6 p-6">
      <AccountListFeature />
      <CreateTransaction recipientAddress={address} />
      <AccountUI pubkey={address} account={account} />
    </main>
  )
}
