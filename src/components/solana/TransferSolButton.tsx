// FILE: src/components/solana/TransferSolButton.tsx

'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Address } from '@solana/addresses';
import { useTransferSolMutation } from './useTransferSolMutation'; // Assure-toi que ce hook est correctement exporté

type CreateTransactionProps = {
    recipientAddress: Address;
};

export default function TransferSolButton({ recipientAddress }: CreateTransactionProps) {
    const { publicKey } = useWallet();
    const [status, setStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const transferSol = useTransferSolMutation();

    const handleTransfer = async () => {
        if (!publicKey) {
            setStatus('⚠️ Connecte ton wallet d’abord.');
            return;
        }

        try {
            setIsLoading(true);
            setStatus('⏳ Transaction en cours...');

            const signature = await transferSol.mutateAsync({
                destination: recipientAddress,
                amount: 10000000, // 0.01 SOL in lamports
            });

            setStatus(`✅ Transaction confirmée : ${signature}`);
        } catch (err: any) {
            setStatus(`❌ Erreur : ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
}
