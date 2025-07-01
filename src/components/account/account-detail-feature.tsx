'use client'

import React, { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { AccountButtons } from './AccountButtons'
import { AccountTransactions } from './AccountTransactions'
import { AppHero } from '../app-hero'
import { ellipsify } from '@/lib/utils'
import { assertIsAddress } from '@solana/addresses'
import { useQuery } from '@tanstack/react-query'
import { useSolanaClient } from 'gill-react'

// --- on supprime ces imports inutiles et problématiques ---
// import { Base64EncodedDataResponse, Slot } from 'gill'
// import { PublicKey } from '@solana/web3.js'
// import { Address } from '@solana/kit'
// import { address } from '@trezor/utxo-lib'
// import { client } from 'jayson'

export function useGetBalance(address: string) {
  const client = useSolanaClient()

  return useQuery({
    queryKey: ['balance', address],
    enabled: !!address,
    queryFn: async () => {
      assertIsAddress(address)
      const accountInfo = await client.rpc.getAccountInfo(address).send()
      if (!accountInfo.value) throw new Error('Account not found')

      // Ici lamportsRaw est défini et accessible
      const lamportsRaw = accountInfo.value.lamports

      let lamportsNum: number

      if (typeof lamportsRaw === 'number') {
        lamportsNum = lamportsRaw
      } else if (typeof (lamportsRaw as any).toNumber === 'function') {
        lamportsNum = (lamportsRaw as any).toNumber()
      } else if (typeof lamportsRaw === 'bigint') {
        lamportsNum = Number(lamportsRaw)
      } else {
        lamportsNum = Number(lamportsRaw) // fallback brutal
      }

      return lamportsNum / 1e9
    },
  })
}




export const AccountBalance: React.FC<{ address: string }> = ({ address }) => {
  const { data, isLoading, error } = useGetBalance(address)

  if (isLoading) return <span className="text-muted">Chargement…</span>
  if (error) return <span className="text-red-600">Erreur chargement solde</span>
  return <span>{(data ?? 0).toFixed(4)} SOL</span>
}

type Props = {
  address: string
}

export const AccountTokens: React.FC<Props> = ({ address }) => {
  return <div>Tokens of {address}</div>
}

export function ExplorerLink({ address, label, transaction }: { address: string, label?: string, transaction?: string }) {
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
    return <div className="text-red-600">Error loading account</div>
  }

  return (
    <div>
      <AppHero
        title={<AccountBalance address={address} />}
        subtitle={
          <div className="my-4">
            <ExplorerLink address={address} label={ellipsify(address)} />
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
