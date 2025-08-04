// FILE: src/hooks/solana/useTransferSolMutation.ts

import {
    Address,
    createTransaction,
    signAndSendTransactionMessageWithSigners,
    TransactionSigner,
    signature,
    getBase58Decoder,
} from 'gill';
import { getTransferSolInstruction } from 'gill/programs';
import { Connection } from '@solana/web3.js';
import { useWalletUi } from '@wallet-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { toastTx } from '@/components/use-transaction-toast';

export function useTransferSolMutation({ address }: { address: Address }) {
    const { client, account } = useWalletUi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ destination, amount }: { destination: Address; amount: number }) => {
            if (!account || !client) throw new Error("Le portefeuille n'est pas connecté.");

            const signer: TransactionSigner = {
                address: account.address as Address,
                async signAndSendTransactions(_) {
                    throw new Error("La logique de signature n'est pas encore définie.");
                },
            };

            const connection = new Connection(client.toString(), "confirmed");
            const latestBlockhash = await connection.getLatestBlockhash("confirmed");

            const transaction = createTransaction({
                feePayer: signer,
                version: 0,
                instructions: [
                    getTransferSolInstruction({
                        amount,
                        destination,
                        source: signer,
                    }),
                ],
                latestBlockhash: {
                    blockhash: latestBlockhash.blockhash,
                    lastValidBlockHeight: BigInt(latestBlockhash.lastValidBlockHeight),
                },
            }as any);

            const signatureBytes = await signAndSendTransactionMessageWithSigners({
                message: transaction,
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
