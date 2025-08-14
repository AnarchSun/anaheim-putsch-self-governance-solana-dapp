// FILE: src/components/mining/MiningClient.tsx
'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PublicKey } from '@solana/web3.js';
import { useAnaheimProgram } from '@/hooks/useProgram';
import { Button } from '@/components/ui/button';
import { AppAlert } from '../app-alert';
// =========================================================================
//                          HELPER & HOOK DEFINITIONS
// =========================================================================

// Async data fetching logic (this is correct)
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

// ✅ FIX 1: The custom hook is now defined at the top level of the module.
function useIncrementMutation() {
    const { program } = useAnaheimProgram(); // The hook now correctly uses the program from context
    const { publicKey } = useWallet();
    const queryClient = useQueryClient();

    return useMutation({
        // The mutation needs to know what to do when called
        mutationFn: async () => {
            if (!program || !publicKey) {
                throw new Error("Programme ou portefeuille non prêt.");
            }
            const [pda] = PublicKey.findProgramAddressSync(
                [Buffer.from("anaheim"), publicKey.toBuffer()],
                program.programId
            );

            // This will work after you rebuild and redeploy your Anchor program
            return program.methods
                .increment()
                .accounts({
                    anaheimAccount: pda,
                    authority: publicKey,
                })
                .rpc();
        },
        onSuccess: (signature) => {
            console.log("Increment successful!", signature);
            // Invalidate the query to refetch the account data
            queryClient.invalidateQueries({queryKey: ["anaheim-account", publicKey?.toBase58()]}).then(r =>{});
        },
        onError: (error: Error) => console.error("Increment failed", error),
    });
}

// =========================================================================
//                             MAIN COMPONENT
// =========================================================================

export default function MiningClient() {
    const { program } = useAnaheimProgram();
    const { publicKey } = useWallet();

    const { data: anaheimAccount, isLoading } = useQuery({
        queryKey: ['anaheim-account', publicKey?.toBase58()],
        queryFn: () => getAnaheimAccount(program, publicKey),
        enabled: !!program && !!publicKey,
    });

    // ✅ FIX 2: Call the hook ONCE at the top level of the component.
    const incrementMutation = useIncrementMutation();

    if (isLoading) {
        return <div className="text-center p-4">Chargement des données...</div>;
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

    if (!program || !publicKey) return <p>Connexion au portefeuille ou programme manquante...</p>;

    const [anaheimPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('anaheim'), publicKey.toBuffer()],
        program.programId
    );

    return (
        <div className="p-6 border rounded-xl bg-card text-card-foreground">
            <h2 className="text-2xl font-bold">Tableau de Bord Minier</h2>
            <div className="text-center my-4">
                <p className="text-muted-foreground">Compte Actuel:</p>
                <p className="text-6xl font-bold font-mono">{anaheimAccount.count.toString()}</p>
            </div>
            <Button
                className="w-full text-lg py-6"
                onClick={() => incrementMutation.mutate(anaheimAccount.count)}
                disabled={incrementMutation.isPending}
            >
                {incrementMutation.isPending ? 'Incrémentation...' : 'Incrémenter le Compte'}
            </Button>
        </div>
    );
}