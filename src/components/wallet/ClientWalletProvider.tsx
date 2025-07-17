// FILE: src/components/wallet/ClientWalletProvider.tsx
'use client';

import React, { ReactNode } from 'react';
import { SolanaProvider } from 'gill-react';
import { SolanaClient } from "gill";

function WalletUiProvider({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

const mockSolanaClient: SolanaClient = {
    rpc: null as any,
    rpcSubscriptions: null as any,
    sendAndConfirmTransaction: async () => {
        throw new Error('sendAndConfirmTransaction not implemented in mock client.');
    },
    simulateTransaction: async () => {
        throw new Error('simulateTransaction not implemented in mock client.');
    },
};

export function ClientWalletProvider({ children }: { children: React.ReactNode }) {
    return (
        <SolanaProvider client={mockSolanaClient}>
            <WalletUiProvider>
                {children}
            </WalletUiProvider>
        </SolanaProvider>
    );
}