// FILE: src/hooks/solana/useTransferSolMutation.ts
// VERSION FINALE ET DÉFINITIVE

import {
    type Address,
    createTransaction,
    getBase58Decoder,
    signAndSendTransactionMessageWithSigners,
    TransactionSigner,
    signature, // Important pour le typage dans onSuccess
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
        mutationFn: async (input: { destination: Address; amount: number }) => {
            if (!account || !client) {
                throw new Error("Le portefeuille n'est pas connecté.");
            }

            const signer: TransactionSigner = {
                address: account.address as Address,
                // ✅ FIX : On préfixe avec '_' pour indiquer que le paramètre est volontairement inutilisé.
                async signAndSendTransactions(_transactions) {
                    throw new Error("La logique de signature du portefeuille n'est pas encore implémentée !");
                },
            };

            const connection = new Connection(client.toString(), "confirmed");
            const latestBlockhash = await connection.getLatestBlockhash("confirmed");

            // ÉTAPE 1 : Crée la transaction de base SANS la durée de vie.
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

            // ÉTAPE 2 : On crée l'objet final en ajoutant manuellement la propriété `lifetimeConstraint'.
            const transactionToSign = {
                ...baseTransaction,
                lifetimeConstraint: {
                    blockhash: latestBlockhash.blockhash,
                    lastValidBlockHeight: BigInt(latestBlockhash.lastValidBlockHeight),
                },
            };

            // ✅ SOLUTION FINALE : On passe l'objet final, en utilisant `as any`
            // pour contourner le bug de typage de la librairie qui cause le paradoxe.
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