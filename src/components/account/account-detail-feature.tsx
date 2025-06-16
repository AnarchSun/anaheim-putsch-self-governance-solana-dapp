// src/components/account/account-detail-feature.tsx
'use client'

import { assertIsAddress } from 'gill'
import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import {
  AccountBalance,
  AccountButtons,
  AccountTokens,
  AccountTransactions,
} from './account-ui'

import { AppHero } from '../app-hero'
import { ellipsify } from '@/lib/utils'

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
      <AppHero
        title={<>{new AccountBalance ( { address } )}</>}
        subtitle={
          <div className="my-4">
            {new ExplorerLink ( { address, label: ellipsify ( address ) } )}
          </div>
        }
      >
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
