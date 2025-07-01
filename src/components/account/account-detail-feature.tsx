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
import { Base64EncodedDataResponse, Slot } from 'gill'
import { PublicKey } from '@solana/web3.js'
import { Address } from '@solana/kit'
import { address } from '@trezor/utxo-lib'
import { client } from 'jayson' // le type

const pubkey = new PublicKey(address)
// soit ici
const nominalAddress = pubkey as unknown as Address
// ou mieux si fonction dispo:
// const nominalAddress = publicKeyToAddress(pubkey)

const accountInfo = await client['rpc'].getAccountInfo(nominalAddress).send()

class GetAccountInfoApiResponse<T> {
}
const response = await fetch(pubkey)
export const {value}: Readonly<{
  context: Readonly<{
    slot: Slot
  }>
  value: GetAccountInfoApiResponse<Readonly<{
    data: Base64EncodedDataResponse
  }>>
}>
export function useGetBalance(address: string) {
  const client = useSolanaClient()

  return useQuery({
    queryKey: ['balance', address],
    enabled: !!address,
    queryFn: async () => {
      assertIsAddress(address)
      const pubkey = new PublicKey(address)
      const accountInfo = await client.rpc.getAccountInfo(pubkey).send()
      if (!accountInfo.value) throw new Error('Account not found')
      return accountInfo.value.lamports / 1e9 // SOL
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
