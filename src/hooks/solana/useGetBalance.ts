//
import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { useSolanaClient } from 'gill-react'
import { Address } from '@solana/kit'

export function useGetBalance(address?: string) {
  const client = useSolanaClient()

  return useQuery({
    queryKey: ['solana', 'balance', address],
    enabled: !!address,
    queryFn: async () => {
      // Always validate the address!
      if (!address || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) throw new Error('Adresse manquante ou invalide')
      const pubkey = new PublicKey(address)
      const brandedAddress = pubkey.toBase58() as unknown as Address
      const account = await client.rpc.getAccountInfo(brandedAddress).send()
      if (!account?.value) throw new Error('Compte introuvable')
      return Number(account.value.lamports) / 1e9
    },
  })
}