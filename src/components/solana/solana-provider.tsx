// src/components/solana/solana-provider.tsx
'use client'

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {
    type Address,
    airdropFactory,
    createTransaction,
    lamports,
    signAndSendTransactionMessageWithSigners,
} from 'gill'

import {toastTx} from '@/components/use-transaction-toast'
import {TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS} from 'gill/programs/token'
import {getTransferSolInstruction} from 'gill/programs'
import {useWalletUiSigner} from '@/components/solana/use-wallet-ui-signer'
import {clusterApiUrl, Connection, PublicKey} from '@solana/web3.js'
import {toBlockhash} from "@/utils/toBlockhash";
import {toast} from "sonner";
import { useWalletUi } from '@wallet-ui/react'; // ou le bon chemin selon ton projet

function useGetBalanceQueryKey({ address }: { address: Address }) {
    const { cluster } = useWalletUi()
    return ['get-balance', { cluster, address }]
}

function useInvalidateGetBalanceQuery({ address }: { address: Address }) {
    const queryClient = useQueryClient()
    const queryKey = useGetBalanceQueryKey({ address })
    return async () => queryClient.invalidateQueries({ queryKey })
}

export function useGetBalanceQuery({ address }: { address: Address }) {
    const { cluster } = useWalletUi()
    const connection = new Connection(clusterApiUrl(cluster))

    return useQuery({
        queryKey: useGetBalanceQueryKey({ address }),
        queryFn: async () => connection.getBalance(new PublicKey(address)),
    })
}

function useGetSignaturesQueryKey({ address }: { address: Address }) {
    const { cluster } = useWalletUi()
    return ['get-signatures', { cluster, address }]
}

function useInvalidateGetSignaturesQuery({ address }: { address: Address }) {
    const queryClient = useQueryClient()
    const queryKey = useGetSignaturesQueryKey({ address })
    return async () => queryClient.invalidateQueries({ queryKey })
}

export function useGetSignaturesQuery({ address }: { address: Address }) {
    const { cluster } = useWalletUi()
    const connection = new Connection(clusterApiUrl(cluster))

    return useQuery({
        queryKey: useGetSignaturesQueryKey({ address }),
        queryFn: async () => connection.getSignaturesForAddress(new PublicKey(address)),
    })
}

async function getTokenAccountsByOwner(
    connection: Connection,
    { address, programId }: { address: Address; programId: Address }
) {
    const res = await connection.getTokenAccountsByOwner(new PublicKey(address), {
        programId: new PublicKey(programId),
    })
    return res.value ?? []
}

export function useGetTokenAccountsQuery({ address }: { address: Address }) {
    const { cluster } = useWalletUi()
    const connection = new Connection(clusterApiUrl(cluster))

    return useQuery({
        queryKey: ['get-token-accounts', { cluster, address }],
        queryFn: async () => {
            const [tokenAccounts, token2022Accounts] = await Promise.all([
                getTokenAccountsByOwner(connection, { address, programId: TOKEN_PROGRAM_ADDRESS }),
                getTokenAccountsByOwner(connection, { address, programId: TOKEN_2022_PROGRAM_ADDRESS }),
            ])
            return [...tokenAccounts, ...token2022Accounts]
        },
    })
}

export function useTransferSolMutation(param: { address: Address }) {
    if (!param?.address) throw new Error('Missing address in useTransferSolMutation')
    const { address } = param
    const signer = useWalletUiSigner()
    const { cluster } = useWalletUi()
    const connection = new Connection(clusterApiUrl(cluster), 'confirmed')
    const invalidateBalanceQuery = useInvalidateGetBalanceQuery({ address })
    const invalidateSignaturesQuery = useInvalidateGetSignaturesQuery({ address })

    return useMutation({
        mutationFn: async (input: { destination: Address; amount: number }) => {
            if (!signer || !signer.signTransaction) {
                throw new Error('Wallet not connected or does not support transaction signing')
            }

            const latestBlockhash = await connection.getLatestBlockhash('confirmed')

            const transaction = createTransaction({
                feePayer: signer,
                version: 0,
                instructions: [
                    getTransferSolInstruction({
                        amount: input.amount,
                        destination: input.destination,
                        source: signer,
                    }),
                ],
                lifetimeConstraint: {
                    blockhash: toBlockhash(latestBlockhash.blockhash),
                    lastValidBlockHeight: BigInt(latestBlockhash.lastValidBlockHeight),
                },
            })

            return await signAndSendTransactionMessageWithSigners({
                message: transaction,
                signers: [signer],
                connection,
            })
        },
        onSuccess: async (signature) => {
            toastTx(signature) // ✅ Fix TS2345 here
            await Promise.all([invalidateBalanceQuery(), invalidateSignaturesQuery()])
        },
        onError: (error) => {
            toast.error(`Transaction failed! ${String(error)}`)
        },
    })
}

export function useRequestAirdropMutation({ address }: { address: Address }) {
    const { cluster } = useWalletUi()
    const connection = new Connection(clusterApiUrl(cluster))
    const invalidateBalanceQuery = useInvalidateGetBalanceQuery({ address })
    const invalidateSignaturesQuery = useInvalidateGetSignaturesQuery({ address })

    const airdrop = airdropFactory({
        cluster,
        rpc: connection as any,
        rpcSubscriptions: {
            signatureNotifications: () => ({
                subscribe() {
                    // Optionally log or handle subscription here
                },
                unsubscribe() {
                    // Optionally handle cleanup
                },
            }),
        },
    })

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
            toast.error(`Airdrop failed! ${String(error)}`)
        },
    })
}
