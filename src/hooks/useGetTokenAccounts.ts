// hooks/useGetTokenAccounts.ts
import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { useConnection } from './useConnection'
import { Address } from './useGetBalance'

export function useGetTokenAccounts({ address }: { address: Address }) {
  const connection = useConnection()

  return useQuery({
    queryKey: ['get-token-accounts', address],
    queryFn: async () => {
      const pubkey = new PublicKey(address)
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      })
      return tokenAccounts.value
    },
  })
}
