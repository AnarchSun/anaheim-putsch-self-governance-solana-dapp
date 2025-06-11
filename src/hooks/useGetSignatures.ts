// hooks/useGetSignatures.ts
import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { useConnection } from './useConnection'
import { Address } from './useGetBalance'

export function useGetSignatures({ address }: { address: Address }) {
  const connection = useConnection()

  return useQuery({
    queryKey: ['get-signatures', address],
    queryFn: async () => {
      const pubkey = new PublicKey(address)
      return await connection.getSignaturesForAddress(pubkey)
    },
  })
}
