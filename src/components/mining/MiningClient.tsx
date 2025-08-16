// FILE: src/components/mining/MiningClient.tsx
'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { PublicKey } from '@solana/web3.js';
import { useAnaheimProgram } from '@/hooks/useProgram';
import { useInitializeMutation } from '@/hooks/useInitialize';
import { Button } from '@/components/ui/button';

// Helper function to fetch account data. It returns null if the account is not found.
async function getAnaheimAccount(program: any, userPublicKey: PublicKey | null) {
    if (!program || !userPublicKey) return null;
    const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from("anaheim"), userPublicKey.toBuffer()],
        program.programId
    );
    try {
        return await program.account.anaheimAccount.fetch(pda);
    } catch (error) {
        return null;
    }
}

export default function MiningClient() {
    const { program } = useAnaheimProgram();
    const { publicKey } = useWallet();

    // useQuery fetches the account state.
    const { data: anaheimAccount, isLoading } = useQuery({
        queryKey: ['anaheim-account', publicKey?.toBase58()],
        queryFn: () => getAnaheimAccount(program, publicKey),
        enabled: !!program && !!publicKey,
    });

    const initializeMutation = useInitializeMutation();

    // While fetching for the first time, show a loading state.
    if (isLoading) {
        return <p className="text-center p-4">Chargement du compte du programme...</p>;
    }

    // ✅ MERGE FIX 1: If the account does NOT exist, this component now shows the "Initialize" button.
    if (!anaheimAccount) {
        return (
            <div className="p-4 border rounded-lg bg-card text-center">
                <h3 className="text-lg font-bold text-red-500">Programme Non Initialisé</h3>
                <p className="text-muted-foreground mb-4">Votre compte programme n'existe pas. Cliquez pour le créer.</p>
                <Button
                    onClick={() => initializeMutation.mutate()}
                    disabled={initializeMutation.isPending}
                >
                    {initializeMutation.isPending ? 'Création en cours...' : 'Créer le Compte Programme'}
                </Button>
            </div>
        );
    }

    // ✅ MERGE FIX 2: If the account EXISTS, this component shows the mining dashboard.
    return (
        <div className="p-6 border rounded-xl bg-card">
            <h2 className="text-2xl font-bold">Tableau de Bord Minier</h2>
            <div className="text-center my-4">
                <p>Compte Actuel:</p>
                <p className="text-6xl font-bold">{anaheimAccount.count.toString()}</p>
            </div>
            {/* You would add your increment/decrement buttons here */}
        </div>
    );
}