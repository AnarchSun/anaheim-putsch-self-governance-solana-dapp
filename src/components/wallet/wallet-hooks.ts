import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';

export function useWalletUi() {
  const wallet = useWallet();
  const connection = useConnection();
  return {
    wallet,
    client: connection.connection,
  };
}

export function useWalletUiCluster() {
  const endpoint = clusterApiUrl('devnet'); // ou mainnet-beta / testnet
  const label = 'Devnet'; // ou 'Mainnet' selon config
  return {
    cluster: {
      urlOrMoniker: endpoint,
      label,
    },
  };
}
