// hooks/useTransferSol.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { useConnection } from './useConnection.tsx'
import { Address } from './useGetBalance.tsx'
import { toast } from 'sonner'

export function useTransferSol({ fromAddress }: { fromAddress: Address }) {
  const wallet = useAnchorWallet()
  const connection = useConnection()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['transfer-sol', fromAddress],
    mutationFn: async ({ to, amount }: { to: Address; amount: number }) => {
      if (!wallet?.publicKey || !wallet.signTransaction) throw new Error('Wallet not connected')
      const toPubkey = new PublicKey(to)

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey,
          lamports: amount * LAMPORTS_PER_SOL,
        }),
      )

      const signed = await wallet.signTransaction(transaction)
      return await connection.sendRawTransaction(signed.serialize())
    },
    onSuccess: (signature) => {
      toast.success(`Transfer successful: ${signature}`)
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['get-balance', fromAddress] }),
        queryClient.invalidateQueries({ queryKey: ['get-signatures', fromAddress] }),
      ])
    },
    onError: (err) => {
      toast.error(`Transfer failed: ${err}`)
    },
  })
}
