// FILE: src/hooks/solana/use-solana-actions.ts
// VERSION FINALE ET DÉFINITIVE
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    type Address,
    // Import blockhash factory
    createTransaction,
    // Use encoder to get string for toast
    signAndSendTransactionMessageWithSigners,
    signature,
    Transaction as GillTransaction,
    TransactionMessageBytes,
    getBase58Decoder,
} from 'gill';
import { getTransferSolInstruction } from 'gill/programs';
import { useWalletUi } from '@wallet-ui/react';
import { clusterApiUrl, Connection, PublicKey, Transaction as Web3Transaction } from '@solana/web3.js';
import { toast } from 'sonner';
import { toastTx } from '@/components/use-transaction-toast';
import {useWalletUiSigner} from "@/components/solana/use-wallet-ui-signer";

// --- HELPER FUNCTIONS ---

function messageBytesToUint8Array(messageBytes: TransactionMessageBytes): Uint8Array {
    return Uint8Array.from(messageBytes as unknown as Iterable<number>);
}

function toWeb3Transaction(tx: GillTransaction): Web3Transaction {
    const rawMsg = messageBytesToUint8Array(tx.messageBytes);
    const web3Tx = Web3Transaction.from(rawMsg);

    for (const [pubkeyStr, sig] of Object.entries(tx.signatures)) {
        if (!sig) continue;  // ignore null signatures
        web3Tx.addSignature(new PublicKey(pubkeyStr), Buffer.from(sig));
    }
    return web3Tx;
}

export function useTransferSolMutation({ address }: { address: Address }) {
    const { cluster } = useWalletUi();
    const rpcUrl = clusterApiUrl(cluster);
    const signer = useWalletUiSigner(rpcUrl);

    const connection = new Connection(rpcUrl, 'confirmed');
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: { destination: Address; amount: number }) => {
            if (!signer) throw new Error('Signer non disponible. Portefeuille non connecté.');

            const latestBlockhash = await connection.getLatestBlockhash('confirmed');

            const baseTransaction = createTransaction({
                feePayer: signer.address,  // string brandée
                version: 0,
                instructions: [
                    getTransferSolInstruction({
                        amount: input.amount,
                        destination: input.destination,
                        source: signer.address,
                    } as any),
                ],
            });

            const transaction = {
                ...baseTransaction,
                lifetimeConstraint: {
                    blockhash: latestBlockhash.blockhash,
                    lastValidBlockHeight: BigInt(latestBlockhash.lastValidBlockHeight),
                },
            };

            // NE PAS REDÉCLARER signer ici, on utilise celui du scope externe

            const signatureBytes = await signAndSendTransactionMessageWithSigners(transaction as any);
            return getBase58Decoder().decode(signatureBytes);
        },

        onSuccess: async (rawSignature: string) => {
            toastTx(signature(rawSignature));
            await queryClient.invalidateQueries({ queryKey: ['get-balance', { address }] });
        },
        onError: (error: Error) => {
            toast.error(`La transaction a échoué: ${error.message}`);
        },
    });
}
