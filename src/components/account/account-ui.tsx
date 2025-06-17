// src/components/account/account-ui.tsx
import { PublicKey } from '@solana/web3.js'

export interface AccountUIProps {
  pubkey: string
  account: PublicKey
}

export function AccountUI({ pubkey, account }: AccountUIProps) {
  return (
    <div className="space-y-2 p-4 bg-black text-white rounded-xl border border-gray-700 shadow-md">
      <p className="font-mono text-sm">Address: {pubkey}</p>
      <p className="font-mono text-sm">Base58: {account.toBase58()}</p>
    </div>
  )
}
