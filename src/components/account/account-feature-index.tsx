<<<<<<< HEAD
import { ReactNode } from 'react'
import { useWalletUi } from '@wallet-ui/react'
import { WalletButton } from '@/components/solana/solana-provider'
=======
// src/components/account/account-feature-index.tsx
import { ReactNode } from 'react'
import { useWalletUi } from '@wallet-ui/react'
import {WalletButton} from "@/components/wallet/wallet-button";

>>>>>>> main

export default function AccountFeatureIndex({ redirect }: { redirect: (path: string) => ReactNode }) {
  const { account } = useWalletUi()

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
