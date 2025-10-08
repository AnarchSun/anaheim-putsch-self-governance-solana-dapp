// src/features/account/data-access/use-get-signatures-query.ts
import type { Address } from 'gill'
import { useQuery } from '@tanstack/react-query'
import useSolana from '@/components/solana/use-solana'
import { useGetSignaturesQueryKey } from './use-get-signatures-query-key'
import { Connection, PublicKey } from '@solana/web3.js'

export function useGetSignaturesQuery({ address }: { address: Address }) {
  const { client } = useSolana()           // ← probablement une URL string
  const connection = new Connection(client) // ✅ créer une connexion

  return useQuery({
    queryKey: useGetSignaturesQueryKey({ address }),
    queryFn: () =>
        connection.getSignaturesForAddress(new PublicKey(address)), // ✅ pas de .rpc ni .send()
  })
}
