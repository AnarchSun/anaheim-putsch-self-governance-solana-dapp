// src/features/account/data-access/use-get-token-accounts-query.ts
import { address as gillAddress, type Address } from 'gill'
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { getTokenAccountsByOwner } from "./get-token-accounts-by-owner"
import { useQuery } from "@tanstack/react-query"
import useSolana from '@/components/solana/use-solana'

export function useGetTokenAccountsQuery({ address }: { address: Address }) {
    const { client, cluster } = useSolana()

    return useQuery({
        queryKey: ['get-token-accounts', { cluster, address }],
        queryFn: async () =>
            Promise.all([
                getTokenAccountsByOwner(client, {
                    address,
                    programId: gillAddress(TOKEN_PROGRAM_ID.toBase58())
                }),
                getTokenAccountsByOwner(client, {
                    address,
                    programId: gillAddress(TOKEN_2022_PROGRAM_ID.toBase58())
                }),
            ]).then(([tokenAccounts, token2022Accounts]) => [
                ...tokenAccounts,
                ...token2022Accounts,
            ]),
    })
}
