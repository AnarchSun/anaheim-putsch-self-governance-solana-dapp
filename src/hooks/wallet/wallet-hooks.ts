// src/components/solana/wallet/wallet-hooks.ts
import {
  useSolanaWalletAddress as _useSolanaWalletAddress,
} from '@wallet-ui/react' // ✅ seulement ce qui est exporté
// src/hooks/solana/useWallet.ts
import { useSolanaWalletAddress } from '@wallet-ui/react'
import { useSolanaClient } from 'gill-react'

const client = useSolanaClient() as any;
const url = client._connection?.rpcEndpoint ?? '';

export function useWalletUiAddress(): string {
  const walletAddress = new useSolanaWalletAddress()
  return walletAddress?.toString?.() ?? 'Adresse inconnue'
}

export function useSolanaCluster(): string {

  // Supposons que client expose une méthode publique getRpcEndpoint()
  const client = useSolanaClient() as any;
  const url = client._connection?.rpcEndpoint ?? '';

  if (url.includes('devnet')) return 'devnet';
  if (url.includes('testnet')) return 'testnet';
  if (url.includes('mainnet')) return 'mainnet-beta';
  return 'unknown';
}

class _useSolanaWalletCluster {
  // TODO BEAUTYFULL ORION DUDE...
}

/**
 * Hook personnalisé pour accéder au cluster du wallet.
 * Utilisation de `new` pour éviter les erreurs TS.
 * Doit être appelé dans un composant React.
 */
export function useWalletUiCluster(): string {
  return new _useSolanaWalletCluster().toString()
}

/**
 * Hook qui retourne un objet complet pour accéder
 * à la fois à l'adresse et au cluster.
 */
export function useWalletUi() {
  const client = useSolanaClient() // ou autre
  const cluster = useSolanaCluster()

  return { client, cluster }
}

