// src/hooks/solana/useAirdropMutation.ts
import { useMutation } from '@tanstack/react-query'
import { airdropFactory, lamports, type Address } from 'gill'
import { toast } from 'sonner'
import { toastTx } from '@/components/use-transaction-toast'
import { useInvalidateGetBalanceQuery, useInvalidateGetSignaturesQuery } from '@/components/account/account-data-access'
import { useWalletUi } from '@wallet-ui/react'

export function useAirdropMutation({ address }: { address: Address }) {
    const { client } = useWalletUi()
    const airdrop = airdropFactory({
        rpc: client.rpc,
        rpcSubscriptions: client.rpcSubscriptions,
    })

    const invalidateBalanceQuery = useInvalidateGetBalanceQuery({ address })
    const invalidateSignaturesQuery = useInvalidateGetSignaturesQuery({ address })

    return useMutation({
        mutationFn: async (amount: number = 1) =>
            airdrop({
                commitment: 'confirmed',
                recipientAddress: address,
                lamports: lamports(BigInt(Math.round(amount * 1_000_000_000))),
            }),
        onSuccess: async (tx) => {
            toastTx(tx)
            await Promise.all([invalidateBalanceQuery(), invalidateSignaturesQuery()])
        },
        onError: (error) => {
            toast.error(`Airdrop failed! ${error}`)
        },
    })
}
