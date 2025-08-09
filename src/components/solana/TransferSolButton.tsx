// FILE: src/components/solana/TransferSolButton.tsx
'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
// On utilise le type 'Address' de 'gill' pour la compatibilité avec le hook
import { type Address } from 'gill';
import { useTransferSolMutation } from './useTransferSolMutation';

type CreateTransactionProps = {
    recipientAddress: Address;
};

export default function TransferSolButton({ recipientAddress }: CreateTransactionProps) {
    const { publicKey } = useWallet();
    const [status, setStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // ✅ FIX : On passe l'adresse de l'expéditeur (publicKey) au hook.
    // Le hook est appelé conditionnellement pour s'assurer que publicKey n'est pas null.
    const transferSol = useTransferSolMutation({
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