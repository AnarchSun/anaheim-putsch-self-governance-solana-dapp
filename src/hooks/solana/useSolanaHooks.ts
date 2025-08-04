import {
    createTransaction,
    getBase58Decoder,
    signAndSendTransactionMessageWithSigners,
    TransactionSigner,
    signature,
} from 'gill';
import { getTransferSolInstruction } from 'gill/programs';
import { Connection } from '@solana/web3.js';
import { useWalletUi } from '@wallet-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { toastTx } from '@/components/use-transaction-toast';
import { Address } from '@solana/addresses'; // assure-toi que cette importation est correcte pour ton Address branding

export function useTransferSolMutationGill({ address }: { address: Address }) {
    const { client, account } = useWalletUi();
    const queryClient = useQueryClient();

    return useMutation({
        // ⚠️ FIX 1: Mutation function must have only ONE input argument
        async mutationFn(input: { destination: Address; amount: number }) {
            if (!account || !client) {
                throw new Error("Le portefeuille n'est pas disponible.");
            }

            const signer: TransactionSigner = {
                address: account.address as Address,
                async signAndSendTransactions(transactions) {
                    throw new Error("La logique de signature du portefeuille doit être implémentée !");
                },
            };

            const connection = new Connection(client.toString(), "confirmed");
            const latestBlockhash = await connection.getLatestBlockhash("confirmed");

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
                latestBlockhash: {
                    blockhash: latestBlockhash.blockhash,
                    lastValidBlockHeight: BigInt(latestBlockhash.lastValidBlockHeight),
                },
            }as any);

            // ⚠️ FIX 2: Compile transaction and sign properly
            const signatureBytes = await signAndSendTransactionMessageWithSigners({
                transactionMessage: transaction,
                signers: [signer],
            }as any);

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
