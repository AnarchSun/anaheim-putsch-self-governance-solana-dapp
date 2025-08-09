// src/hooks/solana/useInvalidateQueries.ts
'use client'

import { useQueryClient } from '@tanstack/react-query'
import { type Address } from 'gill'
import { useWalletUi } from '@wallet-ui/react'

export function useInvalidateGetBalanceQuery({ address }: { address: Address }) {
    const queryClient = useQueryClient()
    const { cluster } = useWalletUi()

    return async () => {
        await queryClient.invalidateQueries({
            queryKey: ['get-balance', { cluster, address }],
        })
    }
}

export function useInvalidateGetSignaturesQuery({ address }: { address: Address }) {
    const queryClient = useQueryClient()
    const { cluster } = useWalletUi()

    return async () => {
        await queryClient.invalidateQueries({
            queryKey: ['get-signatures', { cluster, address }],
        })
    }
}
