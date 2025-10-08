// File: src/components/MonComposantMystique.tsx

import { useSolanaWalletAddress } from '@wallet-ui/react';



export function MonComposantMystique() {
  const walletAddress = useSolanaWalletAddress();

  return (
    <div>
      <p>Adresse mystique: {walletAddress ?? 'Chargement...'}</p>
    </div>
  );
}
