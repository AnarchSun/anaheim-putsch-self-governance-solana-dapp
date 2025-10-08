'use client';

import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ClientWalletMultiButton } from '@/components/wallet/ClientWalletMultiButton';
import { useAnaheimProgram } from '@/../anchor/src/anaheim-exports';
import { useInitializeMutation } from '@/hooks/useInitialize';
import { useAnaheimAccount } from '@/hooks/useAnaheimAccount';
import MiningClient from '@/components/mining/MiningClient';
import { StakingComponent } from '@/components/stake/StakingComponent';


export default function StakeMiningPage() {
    const { connected, publicKey } = useWallet();
    const { isProgramReady } = useAnaheimProgram();
    const initializeMutation = useInitializeMutation();
    const { data: accountInfo, isLoading, error } = useAnaheimAccount(publicKey);

    useEffect(() => {
        // Auto-refresh account info after init
        if (initializeMutation.isSuccess) {
            // Optionally refetch account info here if needed
        }
    }, [initializeMutation.isSuccess]);

    if (!isProgramReady) return <div>Connexion au wallet & chargement du programme...</div>;

    const handleInitialize = async () => {
        await initializeMutation.mutateAsync();
    };

    return (
        <div className="space-y-6 text-center max-w-4xl mx-auto py-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">Staking & Mining</h1>

            {connected && !accountInfo && (
                <button
                    onClick={handleInitialize}
                    style={{
                        cursor: 'pointer',
                        padding: '16px 32px',
                        fontSize: '1.2rem',
                        borderRadius: '12px',
                        background: 'linear-gradient(90deg,#df2d4f,#fccb06 80%)',
                        color: '#222',
                        fontWeight: 900,
                        border: '3px solid #df2d4f',
                        boxShadow: '0 4px 16px #df2d4f66',
                        margin: '32px auto',
                        display: 'block',
                        transition: 'background 0.2s, box-shadow 0.2s',
                    }}
                    disabled={initializeMutation.isPending}
                >
                    {initializeMutation.isPending ? "Initialisation..." : "Initialiser mon compte Anaheim"}
                </button>
            )}

            {!connected && (
                <div className="flex justify-center py-4">
                    <ClientWalletMultiButton />
                </div>
            )}

            {connected && isLoading && (
                <div>Chargement des informations du compte...</div>
            )}

            {connected && !isLoading && !error && accountInfo && (
                <>
                    <StakingComponent accountInfo={accountInfo} />
                    <MiningClient accountInfo={accountInfo} account={undefined} isLoading={false} />
                </>
            )}

            {connected && error && (
                <div className="text-red-500">Erreur: {error.message}</div>
            )}
        </div>
    );
}
