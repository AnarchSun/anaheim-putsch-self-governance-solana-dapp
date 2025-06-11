
// hooks/useRequestAirdrop.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useConnection } from './useConnection'
import { Address } from './useGetBalance'
import { toast } from 'sonner'

export function useRequestAirdrop({ address }: { address: Address }) {
  const connection = useConnection()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['airdrop', address],
    mutationFn: async (amount: number = 1) => {
      const pubkey = new PublicKey(address)
      return await connection.requestAirdrop(pubkey, amount * LAMPORTS_PER_SOL)
    },
    onSuccess: (signature) => {
      toast.success(`Airdrop success: ${signature}`)
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['get-balance', address] }),
        queryClient.invalidateQueries({ queryKey: ['get-signatures', address] }),
      ])
    },
    onError: (err) => {
      toast.error(`Airdrop failed: ${err}`)
    },
  })
}
