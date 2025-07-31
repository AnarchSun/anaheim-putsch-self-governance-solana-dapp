// FILE: src/hooks/solana/useSolanaHooks.ts

import {
    type Address,
    airdropFactory,
    Blockhash,
    createRpc,
    createTransaction,
    getBase58Decoder,
    GetSignatureStatusesApi,
    lamports,
    RequestAirdropApi,
    type Rpc,
    signAndSendTransactionMessageWithSigners,
    TransactionSigner,
} from 'gill';
import { getTransferSolInstruction } from 'gill/programs';

import { Connection, PublicKey } from '@solana/web3.js';
import { useWalletUi } from '@wallet-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toastTx } from '@/components/use-transaction-toast';
import { toast } from 'sonner';
import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from 'gill/programs/token';

const RPC_URL = 'https://api.devnet.solana.com';
const rpc = createRpc({ api: {} as any, transport: {} as any });

function useConnectionFromClient(): Connection {
    const { client } = useWalletUi();
    return new Connection(client.toString(), 'confirmed');
}

function useGetBalanceQueryKey({ address }: { address: Address }) {
    const { cluster } = useWalletUi();
    return ['get-balance', { cluster, address }];
}

function useInvalidateGetBalanceQuery({ address }: { address: Address }) {
    const queryClient = useQueryClient();
    const queryKey = useGetBalanceQueryKey({ address });
    return async () => {
        await queryClient.invalidateQueries({ queryKey });
    };
}

export function useGetBalanceQuery({ address }: { address: Address }) {
    const connection = useConnectionFromClient();

    return useQuery({
        retry: false,
        queryKey: useGetBalanceQueryKey({ address }),
        queryFn: async () => {
            return await connection.getBalance(new PublicKey(address), 'confirmed');
        },
    });
}

function useGetSignaturesQueryKey({ address }: { address: Address }) {
    const { cluster } = useWalletUi();
    return ['get-signatures', { cluster, address }];
}

function useInvalidateGetSignaturesQuery({ address }: { address: Address }) {
    const queryClient = useQueryClient();
    const queryKey = useGetSignaturesQueryKey({ address });
    return async () => {
        await queryClient.invalidateQueries({ queryKey });
    };
}

export function useGetSignaturesQuery({ address }: { address: Address }) {
    const connection = useConnectionFromClient();

    return useQuery({
        queryKey: useGetSignaturesQueryKey({ address }),
        queryFn: async () => {
            return await connection.getSignaturesForAddress(new PublicKey(address));
        },
    });
}

async function getTokenAccountsByOwner(
    connection: Connection,
    { address, programId }: { address: Address; programId: Address },
) {
    return connection
        .getTokenAccountsByOwner(
            new PublicKey(address),
            { programId: new PublicKey(programId) },
            { commitment: 'confirmed' }
        )
        .then((res) => res.value ?? []);
}

export function useGetTokenAccountsQuery({ address }: { address: Address }) {
    const connection = useConnectionFromClient();
    const { cluster } = useWalletUi();

    return useQuery({
        queryKey: ['get-token-accounts', { cluster, address }],
        queryFn: async () => {
            const [tokenAccounts, token2022Accounts] = await Promise.all([
                getTokenAccountsByOwner(connection, { address, programId: TOKEN_PROGRAM_ADDRESS }),
                getTokenAccountsByOwner(connection, { address, programId: TOKEN_2022_PROGRAM_ADDRESS }),
            ]);
            return [...tokenAccounts, ...token2022Accounts];
        },
    });
}

export function useTransferSolMutationGill({ address }: { address: Address }) {
    const { client, account } = useWalletUi();

    if (!account) {
        throw new Error('No account available from wallet.');
    }

    const signer: TransactionSigner = {
        address: account.address as Address,
        async signAndSendTransactions(transactions) {
            // 🛠️ PATCH this with your wallet's implementation
            throw new Error('signAndSendTransactions not implemented');
        },
    };

    const invalidateBalanceQuery = useInvalidateGetBalanceQuery({ address });
    const invalidateSignaturesQuery = useInvalidateGetSignaturesQuery({ address });

    return useMutation({
        mutationFn: async (input: { destination: Address; amount: number }) => {
            const connection = new Connection(client.toString(), 'confirmed');
            const latestBlockhashRaw = await connection.getLatestBlockhash('confirmed');

            const latestBlockhash = {
                blockhash: latestBlockhashRaw.blockhash as Blockhash,
                lastValidBlockHeight: BigInt(latestBlockhashRaw.lastValidBlockHeight),
            };

            const transaction = createTransaction({
                feePayer: signer,
                version: 0,
                latestBlockhash,
                instructions: [
                    getTransferSolInstruction({
                        amount: input.amount,
                        destination: input.destination,
                        source: signer,
                    }),
                ],
            });

            const signatureBytes = await signAndSendTransactionMessageWithSigners(transaction);
            return getBase58Decoder().decode(signatureBytes);
        },
        onSuccess: async (tx) => {
            toastTx(tx);
            await Promise.all([invalidateBalanceQuery(), invalidateSignaturesQuery()]);
        },
        onError: (error) => {
            toast.error(`Transaction failed! ${error}`);
        },
    });
}

export function useRequestAirdropMutation(
    { address }: { address: Address },
    rpc: Rpc<GetSignatureStatusesApi & RequestAirdropApi> & { '~cluster'?: 'devnet' }
) {
    const { client } = useWalletUi();
    const connection = new Connection(client.toString(), 'confirmed');

    const invalidateBalanceQuery = useInvalidateGetBalanceQuery({ address });
    const invalidateSignaturesQuery = useInvalidateGetSignaturesQuery({ address });

    const airdrop = airdropFactory({
        rpc,
        rpcSubscriptions: {} as any,
    });

    return useMutation({
        mutationFn: async (amount: number = 1) =>
            airdrop({
                commitment: 'confirmed',
                recipientAddress: address,
                lamports: lamports(BigInt(Math.round(amount * 1_000_000_000))),
            }),
        onSuccess: async (tx) => {
            toastTx(tx);
            await Promise.all([invalidateBalanceQuery(), invalidateSignaturesQuery()]);
        },
        onError: (error) => {
            toast.error(`Airdrop failed! ${error}`);
        },
    });
}