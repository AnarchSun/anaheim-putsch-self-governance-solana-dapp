// src/hooks/solana/useGetBalance.ts
import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { useSolanaClient } from 'gill-react'

export function useGetBalance(address?: string) {
  const client = useSolanaClient()

  return useQuery({
    queryKey: ['solana', 'balance', address],
    enabled: !!address,
    queryFn: async () => {
      if (!address) throw new Error('Adresse manquante')
      const pubkey = new PublicKey(address)
      const account = await client.rpc.getAccountInfo(pubkey).send()
      if (!account?.value) throw new Error('Compte introuvable')
      return account.value.lamports / 1e9
    },
  })
}
