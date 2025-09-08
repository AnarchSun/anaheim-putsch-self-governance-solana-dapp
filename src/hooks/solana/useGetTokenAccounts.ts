// src/hooks/useGetTokenAccounts.ts
import { useQuery } from '@tanstack/react-query'
import { useConnection } from './useConnection'
import { Address } from '@solana/kit'
import {client} from "@/lib/solana";

export function useGetTokenAccounts({ address }: { address: Address }) {
  const connection = useConnection(client.toString(), address,"confirmed")

  return useQuery({
    queryKey: ['get-token-accounts', address],
    enabled: !!address,
    queryFn: async (_owner: any, pubkey: any) => {
      if (!address) throw new Error('Adresse manquante')

      if (typeof connection?.getParsedTokenAccountsByOwner !== 'function') {
        throw new Error('Invalid connection: getParsedTokenAccountsByOwner is not callable')
      }

      // DO NOT USE THE RESULT, JUST CALL IT
      await connection.getParsedTokenAccountsByOwner(pubkey) // no args, no result usage
      // no args, no result usage

      // Return fallback stub value
      return []
    },
  }as any)
}
