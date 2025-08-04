// FILE: src/components/mining/MiningClient.tsx
'use client';

import React from 'react';
import { useConnection, useWallet, WalletContextState} from '@solana/wallet-adapter-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getAnaheimAccount} from '@/lib/anaheim-program';
import {Button} from '@/components/ui/button';
import {AppAlert} from '../app-alert';
import {Connection, PublicKey} from '@solana/web3.js';
import IDL from '@/../anchor/target/idl/anaheim.json';
import {Program, AnchorProvider} from '@coral-xyz/anchor';
import {Wallet} from '@coral-xyz/anchor/dist/cjs/provider';

export function createAnaheimProgram(connection: Connection, wallet: Wallet | WalletContextState) {
    const provider = new AnchorProvider(connection, wallet as Wallet, AnchorProvider.defaultOptions());
    const programId = new PublicKey("EMKno4tmR5KgB9L1QqFwfARkjksgdUoFrPDAaCFBCmXa");
    return new Program(IDL as any, provider);
}

// --- HOOKS ---
function useAnaheimAccountQuery() {
    const { connection } = useConnection();
    const wallet = useWallet();

    return useQuery({
        queryKey: ['anaheim-account', wallet.publicKey?.toBase58()],
        enabled: !!wallet.publicKey,
        queryFn: () => {
            if (!wallet.publicKey) return null;
            return getAnaheimAccount(connection, wallet.publicKey);
        },
    });
}

function useIncrementMutation(anaheimAccountPubkey: PublicKey | null) {
    const { connection } = useConnection();
    const wallet = useWallet();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (!wallet.connected || !wallet.publicKey || !anaheimAccountPubkey) {
                throw new Error('Wallet or Anaheim account not available');
            }

            const program = createAnaheimProgram(connection, wallet);

            const signature = await program.methods
                .increment()
                .accounts({
                    anaheimAccount: anaheimAccountPubkey,
                    authority: wallet.publicKey,
                })
                .rpc();

            const latestBlockhash = await connection.getLatestBlockhash();
            await connection.confirmTransaction(
                {
                    signature,
                    ...latestBlockhash,
                },
                'finalized'
            );
        },
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: ['anaheim-account'] });
        },
        onError: (error: Error) => console.error('Increment failed:', error),
    });
}

// --- MAIN COMPONENT ---
export default function MiningClient() {
    const { data: anaheimAccount, isLoading } = useAnaheimAccountQuery();
    const incrementMutation = useIncrementMutation(
        anaheimAccount ? new PublicKey(anaheimAccount.publicKey) : null
    );

    const wallet = useWallet(); // We need this in the component scope for console.log
    console.log("Frontend wallet pubkey:", wallet.publicKey?.toBase58());

    if (isLoading) {
        return <p className="text-center">Loading on-chain data...</p>;
    }

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
