// Path: src/components/solana/useTransferSolMutation.ts
// ULTRA FINAL ANARCHOPUNK PATCH: Fixes ReferenceError: client is not defined by requiring endpoint as prop
// Always pass endpoint explicitly! Batch fix eternal. Filename always at the top.

import {
    type Address,
    createTransaction,
    getBase58Decoder,
    signAndSendTransactionMessageWithSigners,
    TransactionSigner,
    signature,
} from 'gill';
import { getTransferSolInstruction } from 'gill/programs';
import { useConnection } from './useConnection';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { toastTx } from '@/components/use-transaction-toast';
import {client} from "jayson";

interface UseTransferSolMutationProps {
    address: Address;
    endpoint: string; // REQUIRED: Solana RPC endpoint
    // Add other wallet/client info if needed
    // e.g. account?: { address: string }
}

export function useTransferSolMutation({ address, endpoint }: UseTransferSolMutationProps) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: { destination: Address; amount: number }) => {
            if (!address || !endpoint) {
                throw new Error("Wallet address or endpoint missing.");
            }

            // If you want to pass a signer/account, do it via props as well!
            const signer: TransactionSigner = {
                address: address,
                async signAndSendTransactions(_transactions) {
                    throw new Error("La logique de signature du portefeuille n'est pas encore implémentée !");
                },
            };

            // UseConnection now receives endpoint explicitly
            const { connection } = useConnection(address, client.toString, "confirmed");

            const latestBlockhash = await connection.getLatestBlockhash("confirmed");

            // STEP 1: Create basic transaction
            const baseTransaction = createTransaction({
                feePayer: signer,
                version: 0,
                instructions: [
                    getTransferSolInstruction({
                        amount: input.amount,
                        destination: input.destination,
                        source: signer,
                    }),
                ],
            });

            // STEP 2: Add lifetimeConstraint
            const transactionToSign = {
                ...baseTransaction,
                lifetimeConstraint: {
                    blockhash: latestBlockhash.blockhash,
                    lastValidBlockHeight: BigInt(latestBlockhash.lastValidBlockHeight),
                },
            };

            // SOLUTION FINALE: Pass as any to workaround type paradox
            const signatureBytes = await signAndSendTransactionMessageWithSigners(
                transactionToSign as any
            );

            return getBase58Decoder().decode(signatureBytes);
        },
        onSuccess: async (rawSignature: string) => {
            toastTx(signature(rawSignature));
            await queryClient.invalidateQueries({ queryKey: ['get-balance', { address }] });
            await queryClient.invalidateQueries({ queryKey: ['get-signatures', { address }] });
        },
        onError: (error: Error) => {
            toast.error(`La transaction a échoué: ${error.message}`);
        },
    });
}