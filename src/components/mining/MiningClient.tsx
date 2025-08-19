// FILE: src/components/mining/MiningClient.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useInitializeMutation } from '@/hooks/useInitialize';
import { useMineMutation } from '@/hooks/useMine'; // Assuming you have this hook

// ✅ This component now receives its data as props. It does NOT fetch its own data.
export default function MiningClient({ account, isLoading }: { account: any, isLoading: boolean }) {
    const initializeMutation = useInitializeMutation();
    const mineMutation = useMineMutation();

    if (isLoading) {
        return <p className="text-center p-4">Chargement du compte du programme...</p>;
    }

    // If the account data (passed as a prop) does not exist, show the "Initialize" button.
    if (!account) {
        return (
            <div className="p-4 border rounded-lg bg-card text-center">
                <h3 className="text-lg font-bold text-red-500">Programme Non Initialisé</h3>
                <p className="text-muted-foreground mb-4">Votre compte n'existe pas. Cliquez pour le créer.</p>
                <Button
                    onClick={() => initializeMutation.mutate()}
                    disabled={initializeMutation.isPending}
                >
                    {initializeMutation.isPending ? 'Création en cours...' : 'Créer le Compte'}
                </Button>
            </div>
        );
    }

    // If the account data exists, show the dashboard.
    return (
        <div className="p-6 border rounded-xl bg-card">
            <h2 className="text-2xl font-bold">Tableau de Bord Minier</h2>
            <div className="text-center my-4">
                <p>Compte Actuel:</p>
                <p className="text-6xl font-bold">{account.count.toString()}</p>
            </div>
            <Button
                className="w-full"
                onClick={() => mineMutation.mutate()}
                disabled={mineMutation.isPending}
            >
                {mineMutation.isPending ? 'Minage en cours...' : '⛏️ Miner'}
            </Button>
        </div>
    );
}