// FILE: src/hooks/solana/use-solana-actions.ts
// VERSION FINALE ET DÉFINITIVE
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    type Address,
    airdropFactory,
    createTransaction,
    getBase58Decoder,
    lamports,
    signAndSendTransactionMessageWithSigners,
    signature,

} from 'gill';
import { getTransferSolInstruction } from 'gill/programs';
import { useWalletUi } from '@wallet-ui/react';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { toast } from 'sonner';
import { toastTx } from '@/components/use-transaction-toast';
import { useWalletUiSigner } from '@/components/solana/use-wallet-ui-signer';

// ... (les hooks useGetBalanceQuery et useRequestAirdropMutation restent les mêmes)

export function useGetBalanceQuery({ address }: { address: Address }) {
    const { cluster } = useWalletUi();
    const connection = new Connection(clusterApiUrl(cluster));

    return useQuery({
        queryKey: ['get-balance', { cluster, address }],
        queryFn: () => {
            if (!address) return null;
            return connection.getBalance(new PublicKey(address));
        },
        enabled: !!address,
    });
}

export function useRequestAirdropMutation({ address }: { address: Address }) {
    const { cluster } = useWalletUi();
    const connection = new Connection(clusterApiUrl(cluster));
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (amount: number = 1) => {
            if (!address) throw new Error("L'adresse est requise pour l'airdrop.");
            const airdrop = airdropFactory({ rpc: connection } as any);
            return airdrop({
                commitment: 'confirmed',
                recipientAddress: address,
                lamports: lamports(BigInt(Math.round(amount * 1_000_000_000))),
            });
        },
        onSuccess: async (tx) => {
            toastTx(tx);
            await queryClient.invalidateQueries({ queryKey: ['get-balance', { address }] });
        },
        onError: (error: Error) => {
            toast.error(`Airdrop a échoué ! ${error.message}`);
        },
    });
}

// --- HOOK useTransferSolMutation CORRIGÉ ---

export function useTransferSolMutation({ address }: { address: Address }) {
    const signer = useWalletUiSigner(); // Ce hook peut retourner `undefined`
    const { cluster } = useWalletUi();
    const connection = new Connection(clusterApiUrl(cluster), 'confirmed');
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: { destination: Address; amount: number }) => {
            // ✅ SOLUTION : On vérifie si l'objet 'signer' existe AVANT de lire ses propriétés.
            if (!signer) {
                throw new Error("Signer non disponible. Le portefeuille n'est probablement pas connecté.");
            }

            const latestBlockhash = await connection.getLatestBlockhash('confirmed');

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

            const transaction = {
                ...baseTransaction,
                lifetimeConstraint: {
                    blockhash: latestBlockhash.blockhash,
                    lastValidBlockHeight: BigInt(latestBlockhash.lastValidBlockHeight),
                }
            };

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