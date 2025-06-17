// src/components/account/account-detail-feature.tsx
'use client'

import { assertIsAddress } from 'gill'
import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { AccountBalance } from './AccountBalance'
import { AccountButtons } from './AccountButtons'
import { AccountTransactions } from './AccountTransactions'

import { AppHero } from '../app-hero'
import { ellipsify } from '@/lib/utils'
// ✅ Assure-toi que le fichier est en .tsx, PAS .ts
import React from "react"

type Props = {
  address: string
}

export const AccountTokens: React.FC<Props> = ({ address }) => {
  return <div>Tokens of {address}</div>
}

export function ExplorerLink({ address, label }: { address: string, label?: string }) {
  return (
    <a
      href={`https://explorer.solana.com/address/${address}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label ?? address}
    </a>
  )
}

export default function AccountDetailFeature() {
  const params = useParams()

  const address = useMemo(() => {
    const addr = params.address
    if (!addr || typeof addr !== 'string') return undefined
    assertIsAddress(addr)
    return addr
  }, [params.address])

  if (!address) {
    return <div>Error loading account</div>
  }

  return (
    <div>
      <AppHero title={<AccountBalance address={address} />} subtitle={
        <div className="my-4">
          <ExplorerLink address={address} label={ellipsify(address)} />
        </div>
      }>
        <div className="my-4">
          <AccountButtons address={address} />
        </div>
      </AppHero>

      <div className="space-y-8">
        <AccountTokens address={address} />
        <AccountTransactions address={address} />
      </div>
    </div>
  )
}
