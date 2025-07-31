// src/hooks/solana/useSolanaClient.ts
import { useQuery } from '@tanstack/react-query'
import { useWalletUi } from '@wallet-ui/react'
import { createSolanaClient, type Address } from 'gill'

export function useSolanaClient() {
  const { cluster } = useWalletUi()
  const client = createSolanaClient({ cluster })
  return { client }
}

export function useGetBalanceQuery({ address }: { address: Address }) {
  const { cluster } = useWalletUi()
  const { client } = useSolanaClient()

  return useQuery({
    queryKey: ['get-balance', { cluster, address }],
    queryFn: () => client.rpc.getBalance(address).send(),
  })
}