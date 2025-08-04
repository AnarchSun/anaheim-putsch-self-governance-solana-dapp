// FILE: src/hooks/solana/use-app-hooks.ts
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type Address, airdropFactory, lamports } from 'gill';
import { useWalletUi } from '@wallet-ui/react';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { toast } from 'sonner';
import { toastTx } from '@/components/use-transaction-toast';

// --- HOOK DE REQUÊTE (QUERY) ---
export function useGetBalanceQuery({ address }: { address: Address }) {
    const { cluster } = useWalletUi();
    const connection = new Connection(clusterApiUrl(cluster));

    return useQuery({
        queryKey: ['get-balance', { cluster, address }],
        queryFn: () => {
            if (!address) return null;
            return connection.getBalance(new PublicKey(address));
        },
        enabled: !!address, // La requête ne se lance que si l'adresse est fournie
    });
}


// --- HOOK DE MUTATION ---
export function useRequestAirdropMutation({ address }: { address: Address }) {
    const { cluster } = useWalletUi();
    const connection = new Connection(clusterApiUrl(cluster));
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (amount: number = 1) => {
            if (!address) throw new Error("L'adresse est requise pour l'airdrop.");

            // La fonction 'airdrop' est créée à l'intérieur pour utiliser la connexion.
            const airdrop = airdropFactory({ rpc: connection}as any);

            return airdrop({
                commitment: 'confirmed',
                recipientAddress: address,
                lamports: lamports(BigInt(Math.round(amount * 1_000_000_000))),
            });
        },
        onSuccess: async (tx) => {
            toastTx(tx);
            // Invalide la requête de balance pour mettre à jour l'UI
            await queryClient.invalidateQueries({ queryKey: ['get-balance', { address }] });
        },
        onError: (error: Error) => {
            toast.error(`Airdrop a échoué ! ${error.message}`);
        },
    });
}

// Vous pouvez ajouter ici les autres hooks (`useTransferSolMutation`, `useGetSignaturesQuery`, etc.)
// en suivant ce modèle propre et structuré.