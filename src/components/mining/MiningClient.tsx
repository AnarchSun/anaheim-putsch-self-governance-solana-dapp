// FILE: src/components/mining/MiningClient.tsx
// VERSION FINALE ET CORRIGÉE
'use client';

import React from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAnaheimAccount } from '@/lib/anaheim-program';
import { Button } from '@/components/ui/button';
import { AppAlert } from '../app-alert';
import { PublicKey } from '@solana/web3.js';
import { useAnaheimProgram } from '@/hooks/useAnaheimProgram';

// --- HOOKS ---

function useAnaheimAccountQuery() {
    const { connection } = useConnection();
    const { publicKey } = useWallet(); // ✅ On déstructure 'publicKey' directement

    return useQuery({
        queryKey: ['anaheim-account', publicKey?.toBase58()],
        queryFn: () => {
            if (!publicKey) return null;
            return getAnaheimAccount(connection, publicKey);
        },
        enabled: !!publicKey,
    });
}

function useIncrementMutation() {
    const { program } = useAnaheimProgram();
    const { publicKey } = useWallet(); // ✅ On déstructure 'publicKey'
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (anaheimAccountPubkey: PublicKey) => {
            if (!program || !publicKey) { // ✅ On vérifie 'publicKey'
                throw new Error('Le programme ou le portefeuille n\'est pas prêt.');
            }

            await program.methods
                .increment() // ✅ Cette méthode existe maintenant
                .accounts({
                    anaheimAccount: anaheimAccountPubkey,
                    authority: publicKey, // ✅ On passe 'publicKey'
                }as any)
                .rpc();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['anaheim-account'] });
        },
        onError: (error: Error) => console.error('L\'incrémentation a échoué:', error),
    });
}

// --- MAIN COMPONENT ---
export default function MiningClient() {
    const { data: anaheimAccount, isLoading } = useAnaheimAccountQuery();
    const incrementMutation = useIncrementMutation();

    if (isLoading) {
        return <p className="text-center">Chargement des données...</p>;
    }

    if (!anaheimAccount) {
        return (
            <AppAlert action={null}>
                <div className="text-center font-semibold text-red-500">
                    <h3 className="text-lg font-bold">Programme Non Initialisé</h3>
                    <p>Le compte principal du programme n'a pas été trouvé.</p>
                </div>
            </AppAlert>
        );
    }

    const handleIncrement = () => {
        if (anaheimAccount) {
            incrementMutation.mutate(new PublicKey(anaheimAccount.publicKey));
        }
    };

    return (
        <div className="p-6 border rounded-xl bg-card text-card-foreground max-w-sm mx-auto">
            <h2 className="text-xl font-bold text-center">Compteur Communautaire</h2>
            <div className="text-center">
                <p className="text-muted-foreground">Compte actuel :</p>
                <p className="text-5xl font-bold font-mono">{anaheimAccount.count.toNumber()}</p>
            </div>
            <Button
                className="w-full text-lg py-6"
                onClick={handleIncrement}
                disabled={incrementMutation.isPending}
            >
                {incrementMutation.isPending ? 'Incrémentation...' : 'Incrémenter'}
            </Button>
        </div>
    );
}