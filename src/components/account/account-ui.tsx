'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from '@/components/ui/button'
import { AppAlert } from '@/components/app-alert'

interface AirdropMutation {
    mutateAsync: (amount: number) => Promise<void>
    isPending: boolean
}

interface BalanceQuery {
    data: number | null
    isLoading: boolean
    isError: boolean
}

export function AccountChecker() {
    const { publicKey } = useWallet()
    if (!publicKey) return null
    return <AccountBalanceCheck address={publicKey.toBase58()} />
}

function AccountBalanceCheck({ address }: { address: string }) {
    const mutation = useAirdropMutation()
    const query = useBalanceQuery()

    if (query.isLoading) return null
    if (query.isError || !query.data) {
        return (
            <AppAlert
                action={
                    <Button 
                        variant="outline" 
                        onClick={() => mutation.mutateAsync(1)}
                        disabled={mutation.isPending}
                    >
                        Request Airdrop
                    </Button>
                }
            >
                Your account is not found on this network.
            </AppAlert>
        )
    }
    return null
}

function useAirdropMutation(): AirdropMutation {
    return {
        mutateAsync: async () => {},
        isPending: false
    }
}

function useBalanceQuery(): BalanceQuery {
    return {
        data: null,
        isLoading: false,
        isError: false
    }
}