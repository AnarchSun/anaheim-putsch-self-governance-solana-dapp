// PATH: src/components/solana/TransferSolButton.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Batch fix: Import endpoint from config/solana, never hardcode, always batch fix, filename/path éternel!

'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
// On utilise le type 'Address' de 'gill' pour la compatibilité avec le hook
import { type Address } from 'gill';
import { useTransferSolMutation } from '@/hooks/solana/useTransferSolMutation';
// PATCH: Import endpoint from the punk config source of truth!
import { SOLANA_CLUSTER_URL as ENDPOINT } from '@/config/solana';

type CreateTransactionProps = {
    recipientAddress: Address;
};

export default function TransferSolButton({ recipientAddress }: CreateTransactionProps) {
    const { publicKey } = useWallet();
    const [status, setStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // PATCH: Always use imported endpoint, never hardcoded!
    const transferSol = useTransferSolMutation({
        endpoint: ENDPOINT,
        address: publicKey?.toBase58() as Address
    });

    const handleTransfer = async () => {
        if (!publicKey) {
            setStatus('⚠️ Connecte ton wallet d’abord.');
            return;
        }

        try {
            setIsLoading(true);
            setStatus('⏳ Transaction en cours...');

            // La mutation est maintenant disponible sur l'objet retourné par le hook
            const signature = await transferSol.mutateAsync({
                destination: recipientAddress,
                amount: 10_000_000, // 0.01 SOL in lamports
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
                disabled={isLoading || !publicKey} // On désactive aussi si le wallet n'est pas connecté
                onClick={handleTransfer}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded disabled:bg-gray-500"
            >
                {isLoading ? 'Envoi en cours...' : 'Envoyer 0.01 SOL'}
            </button>
            {status && <p className="mt-2 text-sm">{status}</p>}
        </div>
    );
}

// PATCH NOTES:
// - endpoint now imported from config/solana (source file!), never hardcoded
// - Always batch fix, always filename/path éternel, mirror forbidden!