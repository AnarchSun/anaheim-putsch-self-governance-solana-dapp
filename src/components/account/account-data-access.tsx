// FILE: src/components/features/TransferSolFeature.tsx
'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTransferSolMutation } from '@/hooks/solana/useTransferSolMutation'; // ✅ On importe notre hook!
import { type Address } from 'gill';

export function TransferSolFeature() {
  const wallet = useWallet();
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('0');

  // ✅ On appelle notre hook pour obtenir la fonction de mutation
  const transferMutation = useTransferSolMutation({
    address: wallet.publicKey?.toBase58() as Address,
    wallet: wallet, // On passe l'objet wallet pour la signature
  }as any);

  const handleTransfer = () => {
    if (!destination || !amount || parseFloat(amount) <= 0) {
      alert("Veuillez entrer une destination et un montant valides.");
      return;
    }

    // ✅ On appelle la mutation avec les données du formulaire
    transferMutation.mutate({
      destination: destination as Address,
      amount: parseFloat(amount),
    });
  };

  if (!wallet.publicKey) {
    return <p>Veuillez connecter votre portefeuille pour envoyer des SOL.</p>;
  }

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
              className="p-2 border rounded"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="amount">Montant :</label>
          <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="p-2 border rounded"
          />
        </div>
        <button
            onClick={handleTransfer}
            disabled={transferMutation.isPending}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {transferMutation.isPending ? 'Envoi en cours...' : 'Envoyer'}
        </button>
        {transferMutation.isSuccess && (
            <p className="text-green-500">Transaction réussie !</p>
        )}
        {transferMutation.isError && (
            <p className="text-red-500">
              Erreur : {transferMutation.error.message}
            </p>
        )}
      </div>
  );
}