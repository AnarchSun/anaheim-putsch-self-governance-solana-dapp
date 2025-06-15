// hooks/useGetBalance.ts
import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { useConnection } from './useConnection.tsx'

export type Address = string

export function useGetBalance({ address }: { address: Address }) {
  const connection = useConnection()

  return useQuery({
    queryKey: ['get-balance', address],
    queryFn: async () => {
      const pubkey = new PublicKey(address)
      return await connection.getBalance(pubkey)
    },
  })
}
