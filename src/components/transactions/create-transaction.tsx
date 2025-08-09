// FILE: src/components/transactions/create-transaction.tsx
'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTransferSolMutation } from '@/hooks/solana/useTransferSolMutation'; // Assurez-vous que le chemin est correct
import { type Address } from 'gill'; // On garde ce type pour la compatibilité avec le hook
import { toast } from 'sonner';

export function CreateTransaction() {
    const { publicKey } = useWallet();
    const [destination, setDestination] = useState('');
    const [amount, setAmount] = useState('0');

    // On utilise le hook ici, à l'intérieur du composant qui gère le transfert
    const { mutate, isPending } = useTransferSolMutation({
        // Le hook a besoin de l'adresse de l'expéditeur
        address: publicKey?.toBase58() as Address,
    });

    const handleTransfer = () => {
        if (!publicKey || !destination || parseFloat(amount) <= 0) {
            toast.error("Veuillez entrer une destination et un montant valides.");
            return;
        }

        mutate(
            {
                destination: destination as Address,
                amount: parseFloat(amount) * 1_000_000_000, // Convertir les SOL en lamports
            },
            {
                onSuccess: (signature) => {
                    toast.success(`Transaction réussie ! Signature : ${signature}`);
                },
                onError: (error) => {
                    toast.error(`Échec de la transaction : ${error.message}`);
                },
            }
        );
    };

    return (
        <div className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-bold">Envoyer des SOL</h3>
            <div className="flex flex-col space-y-2">
                <label htmlFor="destination">Adresse de destination :</label>
                <input
                    id="destination"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Entrez l'adresse du destinataire"
                    className="p-2 border rounded bg-background"
                />
            </div>
            <div className="flex flex-col space-y-2">
                <label htmlFor="amount">Montant (en SOL) :</label>
                <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="p-2 border rounded bg-background"
                />
            </div>
            <button
                onClick={handleTransfer}
                disabled={isPending || !publicKey}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
                {isPending ? 'Envoi en cours...' : 'Envoyer'}
            </button>
        </div>
    );
}