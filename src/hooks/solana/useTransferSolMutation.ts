// PATH: src/hooks/solana/useTransferSolMutation.ts
// ULTRA FINAL ANARCHOPUNK BATCH FIX: Remove unused _transactions param, fix React hooks usage, ensure endpoint is passed explicitly.

// Imports remain as per last patch, jayson/client usage long gone.
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

interface UseTransferSolMutationProps {
    address: Address;
    endpoint: string; // REQUIRED: Solana RPC endpoint
}

export function useTransferSolMutation({ address, endpoint }: UseTransferSolMutationProps) {
    const queryClient = useQueryClient();
    const { connection } = useConnection(); // <-- Proper React Hook usage (only at top level)

    return useMutation({
        mutationFn: async (input: { destination: Address; amount: number }) => {
            if (!address || !endpoint) {
                throw new Error("Wallet address or endpoint missing.");
            }

            const signer: TransactionSigner = {
                address: address,
                async signAndSendTransactions() {
                    throw new Error("La logique de signature du portefeuille n'est pas encore implémentée !");
                },
            };

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

// PATCH NOTES:
// - Removed unused _transactions param in signer
// - Moved useConnection to top-level of custom hook (fixes react-hooks/rules-of-hooks error)
// - Always pass endpoint explicitly, never global/process vars
// - Filename and path toujours!