// src/hooks/solana/useGetBalance.ts
import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { useSolanaClient } from 'gill-react'
import('/home/anarchsun/RustroverProjects/anarcrypt.sol/anaheim-putsch-self-governance-solana-dapp/node_modules/.pnpm/@solana+addresses@2.1.1_fastestsmallesttextencoderdecoder@1.0.22_typescript@5.8.3/node_modules/@solana/addresses/dist/types/address')
import { Address } from '@solana/kit'

export function useGetBalance(address?: string) {
  const client = useSolanaClient()

  return useQuery({
    queryKey: ['solana', 'balance', address],
    enabled: !!address,
    queryFn: async () => {
      if (!address) throw new Error('Adresse manquante')
      const pubkey = new PublicKey(address)

      // Cast string en Address (brandé)
      const brandedAddress = pubkey.toBase58() as unknown as Address

      const account = await client.rpc.getAccountInfo(brandedAddress).send()

      if (!account?.value) throw new Error('Compte introuvable')

      // Cast Lamports en number pour calcul
      return Number(account.value.lamports) / 1e9
    },
  })
}
