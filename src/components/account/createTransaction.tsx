// src/components/account/createTransaction.tsx
'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Address } from '@solana/addresses';

// TYPES
interface CreateTransactionProps {
    recipientAddress: Address;
    transferSol?: (params: {
        destination: Address;
        amount: number;
    }, callbacks: {
        onSuccess: (signature: string) => void;
        onError: (err: Error) => void;
    }) => void;
}

export function useTransferSolMutation({ recipientAddress, transferSol }: CreateTransactionProps) {
    const { publicKey } = useWallet();
    const [status, setStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleTransfer = () => {
        if (!publicKey) {
            setStatus('⚠️ Connecte ton wallet d’abord.');
            return;
        }

        setStatus('⏳ Transaction en cours...');
        setIsLoading(true);

        if (!transferSol) {
            setStatus('❌ Fonction transferSol non définie.');
            setIsLoading(false);
            return;
        }

        transferSol(
            {
                destination: recipientAddress,
                amount: 0.01,
            },
            {
                onSuccess: (signature) => {
                    setStatus(`✅ Transaction confirmée : ${signature}`);
                    setIsLoading(false);
                },
                onError: (err: Error) => {
                    setStatus(`❌ Erreur : ${err.message}`);
                    setIsLoading(false);
                },
            }
        );
    };

    const TransactionButton = () => (
        <div className="p-4 bg-gray-900 text-white rounded-md max-w-md mx-auto">
            <button
                disabled={isLoading}
                onClick={handleTransfer}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded"
            >
                {isLoading ? 'Envoi en cours...' : 'Créer et Envoyer Transaction'}
            </button>
            {status && <p className="mt-2 text-sm">{status}</p>}
        </div>
    );

    return {
        TransactionButton,
        handleTransfer,
        status,
        isLoading,
    };
}