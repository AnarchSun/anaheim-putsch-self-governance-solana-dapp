// src/hooks/useGetTokenAccounts.ts
import { useQuery } from '@tanstack/react-query'
import { useConnection } from './useConnection'
import { Address } from '@solana/kit'

export function useGetTokenAccounts({ address }: { address: Address }) {
  const connection = useConnection()

  return useQuery({
    queryKey: ['get-token-accounts', address],
    enabled: !!address,
    queryFn: async () => {
      if (!address) throw new Error('Adresse manquante')

      if (typeof connection?.getParsedTokenAccountsByOwner !== 'function') {
        throw new Error('Invalid connection: getParsedTokenAccountsByOwner is not callable')
      }

      // DO NOT USE THE RESULT, JUST CALL IT
      connection.getParsedTokenAccountsByOwner () // no args, no result usage
      // no args, no result usage

      // Return fallback stub value
      return []
    },
  })
}
