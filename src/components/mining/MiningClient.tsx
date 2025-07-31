// FILE: src/components/mining/MiningClient.tsx
'use client';

import React from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    ANAHEIM_ACCOUNT_PUBKEY,
    createAnaheimProgram,
    getAnaheimAccount
} from '@/lib/anaheim-program';
import { Button } from '@/components/ui/button';
import { AppAlert } from '../app-alert';

// --- HOOKS ---

function useAnaheimAccountQuery() {
    const { connection } = useConnection();
    return useQuery({
        queryKey: ['anaheim-account'],
        queryFn: () => getAnaheimAccount(connection),
    });
}

function useIncrementMutation() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (!wallet.connected || !wallet.publicKey) { throw new Error('Wallet not connected'); }
            const program = createAnaheimProgram(connection, wallet);
            const signature = await program.methods
                .increment()
                .accounts({ anaheim: ANAHEIM_ACCOUNT_PUBKEY! })
                .rpc();
            const latestBlockhash = await connection.getLatestBlockhash();
            await connection.confirmTransaction({ signature, ...latestBlockhash });
            return signature;
        },
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: ['anaheim-account'] });
        },
        onError: (error: Error) => console.error('Increment failed:', error),
    });
}

// ===================================================================
// THIS IS THE DEFINITIVE FIX.
// The broken `useInitializeMutation` hook has been completely REMOVED.
// The frontend UI should NEVER be responsible for initialization.
// ===================================================================

// --- MAIN COMPONENT ---
export default function MiningClient() {
    const { data: anaheimAccount, isLoading } = useAnaheimAccountQuery();
    const incrementMutation = useIncrementMutation();

    if (isLoading) {
        return <p className="text-center">Loading on-chain data...</p>;
    }

    // If the account is not found, we now show a simple, informative error message
    // for the DEVELOPER (you), telling them what command to run.
    if (!anaheimAccount) {
        return (
            <AppAlert action={null}>
                <div className="text-center font-semibold text-red-500">
                    <h3 className="text-lg font-bold">Program Not Initialized</h3>
                    <p className="text-sm font-normal text-muted-foreground mt-2">
                        The main program account was not found. Please run the following command from your project root and restart the server:
                    </p>
                    <pre className="mt-2 p-2 bg-gray-800 text-white rounded font-mono text-xs">
                        pnpm tsx anchor/scripts/initialize.ts
                    </pre>
                </div>
            </AppAlert>
        );
    }

    const currentCount = anaheimAccount.count.toNumber();

    return (
        <div className="p-6 border rounded-xl bg-card text-card-foreground max-w-sm mx-auto">
            <h2 className="text-xl font-bold text-center">Community Counter</h2>
            <div className="text-center">
                <p className="text-muted-foreground">Current Count:</p>
                <p className="text-5xl font-bold font-mono animate-pulse">{currentCount}</p>
            </div>
            <Button
                className="w-full text-lg py-6"
                onClick={() => incrementMutation.mutate()}
                disabled={incrementMutation.isPending}
            >
                {incrementMutation.isPending ? 'Incrementing...' : 'Increment Count'}
            </Button>
        </div>
    );
}