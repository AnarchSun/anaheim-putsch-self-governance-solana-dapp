'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ClientWalletMultiButton } from '@/components/wallet/ClientWalletMultiButton';
import { useAnaheimProgram } from '@/hooks/useAnaheimProgram';
import { useInitializeMutation } from '@/hooks/solana/useInitializeMutation';
import { useAnaheimAccount } from '@/hooks/useAnaheimAccount';
import MiningClient from '@/components/mining/MiningClient';
import StakingComponent from '@/components/StakingComponent';
import { StakeStatus } from '@/app/stake-mining/stake/stakeStatus'
import { StakeViewer } from '@/app/stake-mining/stake/stake-viewer'
import { PublicKey } from '@solana/web3.js'

export default function StakeMiningPage() {
    const {connected, publicKey} = useWallet();
    const {isProgramReady} = useAnaheimProgram();
    const initializeMutation = useInitializeMutation();
    const {data: accountInfo, isLoading, error} = useAnaheimAccount(publicKey);

    if (!isProgramReady) return <div>Connexion au wallet & chargement du programme...</div>;

    const handleInitialize = async () => {
        await initializeMutation.mutateAsync();
    };

    return (
        <div className="space-y-6 text-center max-w-4xl mx-auto py-8">
            <StakeStatus address="8RmTVazK1G3ZJ7EqYZC9FYJejFge98Vyz7T4zVdY8okX" />
            <StakeViewer pubkey={new PublicKey('8RmTVazK1G3ZJ7EqYZC9FYJejFge98Vyz7T4zVdY8okX')} />
            <h1 className="text-4xl md:text-5xl font-bold">Staking & Mining</h1>
            <button onClick={handleInitialize}>Initialiser mon compte Anaheim</button>

            {!connected && (
                <div className="flex justify-center py-4">
                    <ClientWalletMultiButton/>
                </div>
            )}

            {connected && isLoading && (
                <div>Chargement des informations du compte...</div>
            )}

            {connected && !isLoading && !error && accountInfo && (
                <>
                    <StakingComponent accountInfo={accountInfo}/>
                    <MiningClient accountInfo={accountInfo} account={undefined} isLoading={false}/>
                </>
            )}

            {connected && error && (
                <div className="text-red-500">Erreur: {error.message}</div>
            )}
        </div>
    );
}