// FILE: src/app/mining/page.tsx
'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ClientWalletMultiButton } from '@/components/wallet/ClientWalletMultiButton';
import { TransferSolFeature } from '@/components/account/account-data-access';
import { ClientOnly } from '@/components/ClientOnly';
import { useAnaheimAccount } from '@/hooks/useAnaheimAccount'; // ✅ The single data-fetching hookA
import MiningClient from "@/components/mining/MiningClient";
import { useAnaheimProgram } from '@/hooks/useAnaheimProgram';
import { useInitializeMutation } from '@/hooks/solana/useInitializeMutation';

export default function HomePage() {
    const { connected, publicKey } = useWallet();
    const { program, provider, isProgramReady } = useAnaheimProgram();
    const initializeMutation = useInitializeMutation();

    if (!isProgramReady) return <div>Connecting wallet & loading program...</div>;

    const handleInitialize = async () => {
        await initializeMutation.mutateAsync();
    };
    // ✅ This is now the single source of truth for the account data.
    const { data: accountInfo, isLoading, error } = useAnaheimAccount(publicKey);

    return (
        <div className="space-y-6 text-center max-w-4xl mx-auto py-8">
            <h1 className="text-4xl md:text-5xl font-bold">Anaheim Community Console</h1>
            <h2>Mining Page</h2>
            <button onClick={handleInitialize}>Initialize Anaheim Account</button>
            {connected ? (
                <p className="text-lg text-muted-foreground">
                    Welcome! Your program account is loaded below.
                </p>
            ) : (
                <p className="text-lg text-muted-foreground">
                    Connect your wallet to interact with the on-chain program.
                </p>
            )}

            {!connected && (
                <div className="flex justify-center py-4">
                    <ClientWalletMultiButton />
                </div>
            )}

            {connected && (
                <ClientOnly>
                    <div className="flex flex-col md:flex-row justify-center items-start gap-8 p-4 border-t mt-4">

                        {/* ✅ We pass the data down to MiningClient as props */}
                        <MiningClient account={accountInfo} isLoading={isLoading} />

                        <TransferSolFeature />

                        {/* ✅ This display block now works perfectly and doesn't cause a double-fetch */}
                        <div className="p-4 border rounded-lg shadow-sm text-left">
                            <h2 className="text-lg font-semibold">Anaheim Account</h2>
                            {isLoading && <p className="text-sm text-muted-foreground">Loading account...</p>}
                            {error && <p className="text-sm text-red-500">Error: {(error as Error).message}</p>}
                            {accountInfo ? (
                                <pre className="text-xs mt-2 bg-muted p-2 rounded-lg overflow-x-auto">
                                    {JSON.stringify(accountInfo, null, 2)}
                                </pre>
                            ) : (
                                !isLoading && <p className="text-sm text-muted-foreground">No account found</p>
                            )}
                        </div>
                    </div>
                </ClientOnly>
            )}
            {/* ... rest of your JSX ... */}
        </div>
    );
}