// FILE: src/app/page.tsx (ou votre page principale)
'use client';

import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic'; // ✅ ÉTAPE 1: Importez 'dynamic'

// --- Hooks et composants ---
import { useAnaheimProgram } from '@/hooks/useAnaheimProgram';
import { useInitialize } from '@/hooks/useInitialize';
import { ClientWalletMultiButton } from '@/components/wallet/ClientWalletMultiButton';

// ✅ ÉTAPE 2: Chargez vos composants clients de manière dynamique
const MiningClient = dynamic(
    () => import('@/components/mining/MiningClient'),
    { ssr: false } // 'ssr: false' signifie "ne pas rendre sur le serveur"
);

const TransferSolFeature = dynamic(
    () => import('@/components/features/TransferSolFeature').then(mod => mod.TransferSolFeature),
    { ssr: false }
);


export default function HomePage() {
    const { connected } = useWallet();
    const { program, provider } = useAnaheimProgram();
    const initializeMutation = useInitialize();

    useEffect(() => {
        if (program && provider && !initializeMutation.isPending && !initializeMutation.isSuccess) {
            initializeMutation.mutate();
        }
    }, [program, provider, initializeMutation]);

    return (
        <div className="space-y-8 text-center">
            {/* ... votre en-tête ... */}
            <div>
                <h1 className="text-4xl font-bold">Anaheim Community Console</h1>
                <p className="text-muted-foreground mt-2">
                    Connectez votre portefeuille pour interagir.
                </p>
                <p className="text-sm mt-2">
                    Statut de l'initialisation : {initializeMutation.status}
                </p>
            </div>

            {!connected && (
                <div className="flex justify-center">
                    <ClientWalletMultiButton />
                </div>
            )}

            {connected && (
                <div className="flex flex-col md:flex-row justify-center items-start gap-8 p-4">
                    {/* ✅ ÉTAPE 3: Les composants sont maintenant utilisés normalement, mais ils ne seront rendus que sur le client */}
                    <MiningClient />
                    <TransferSolFeature />
                </div>
            )}
        </div>
    );
}