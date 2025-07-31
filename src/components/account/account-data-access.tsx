// FILE: src/components/account/account-data-access.tsx

import {
  TOKEN_2022_PROGRAM_ADDRESS,
  TOKEN_PROGRAM_ADDRESS,
  getTransferSolInstruction,
} from 'gill/programs'
import {
  airdropFactory,
  createTransaction,
  getBase58Decoder,
  signAndSendTransactionMessageWithSigners,
  type SolanaClient,
  type Address,
} from 'gill'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useWalletUi } from '@wallet-ui/react'
import { toast } from 'sonner'
import { toastTx } from '@/components/use-transaction-toast'
import { useAirdropMutation } from '@/hooks/solana/useAirdropMutation'

export const useRequestAirdropMutation = useAirdropMutation

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
  const { client } = useWalletUi() as { client: SolanaClient }

  return useQuery({
    retry: false,
    queryKey: useGetBalanceQueryKey({ address }),
    queryFn: () => client.rpc.getBalance(address).send(),
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
  const { client } = useWalletUi() as { client: SolanaClient }

  return useQuery({
    retry: false,
    queryKey: useGetSignaturesQueryKey({ address }),
    queryFn: () => client.rpc.getSignaturesForAddress(address).send(),
  })
}

async function fetchTokenAccounts(
    rpc: SolanaClient['rpc'],
    { address, programId }: { address: Address; programId: Address }
) {
  return rpc
      .getTokenAccountsByOwner(address, { programId }, { commitment: 'confirmed', encoding: 'jsonParsed' })
      .send()
      .then((res) => res.value ?? [])
}

export function useGetTokenAccountsQuery({ address }: { address: Address }) {
  const { client, cluster } = useWalletUi() as { client: SolanaClient; cluster: string }

  return useQuery({
    queryKey: ['get-token-accounts', { cluster, address }],
    queryFn: async () =>
        Promise.all([
          fetchTokenAccounts(client.rpc, { address, programId: TOKEN_PROGRAM_ADDRESS }),
          fetchTokenAccounts(client.rpc, { address, programId: TOKEN_2022_PROGRAM_ADDRESS }),
        ]).then(([tokenAccounts, token2022Accounts]) => [...tokenAccounts, ...token2022Accounts]),
  })
}

export function useTransferSolMutation({ address }: { address: Address }) {
  const { client, account } = useWalletUi() as { client: SolanaClient; account?: { publicKey: Address } }

  const invalidateBalanceQuery = useInvalidateGetBalanceQuery({ address })
  const invalidateSignaturesQuery = useInvalidateGetSignaturesQuery({ address })

  return useMutation({
    mutationFn: async ({ destination, amount }: { destination: Address; amount: number }) => {
      if (!account?.publicKey) throw new Error('Wallet not connected')
      const feePayer = account.publicKey

      const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()

      const transaction = createTransaction({
        feePayer,
        version: 0,
        latestBlockhash,
        instructions: [
          getTransferSolInstruction({
            source: feePayer,
            destination,
            amount,
          }),
        ],
      })

      const signatureBytes = await signAndSendTransactionMessageWithSigners(transaction, [])
      return getBase58Decoder().decode(signatureBytes)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await Promise.all([invalidateBalanceQuery(), invalidateSignaturesQuery()])
    },
    onError: (error) => {
      toast.error(`Transaction failed! ${error}`)
    },
  })
}

export function useRequestAirdropMutation({ address }: { address: Address }) {
  const {client} = useWalletUi() as { client: SolanaClient }

  const invalidateBalanceQuery = useInvalidateGetBalanceQuery({address})
  const invalidateSignaturesQuery = useInvalidateGetSignaturesQuery({address})

  const airdrop = airdropFactory({
    rpc: client.rpc,
    rpcSubscriptions: client.rpcSubscriptions,
  })
}


