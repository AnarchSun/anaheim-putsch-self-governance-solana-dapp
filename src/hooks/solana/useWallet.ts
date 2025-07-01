// src/hooks/solana/useWallet.ts
import { useSolanaClient } from 'gill-react'
import { useWallet } from '@solana/wallet-adapter-react';

export const useSolanaWalletAddress = () => {
  const { publicKey } = useWallet();
  return publicKey?.toBase58();
};

// On utilise le hook normalement, pas "new"
export function useWalletUiAddress(): string {
  const walletAddress = useSolanaWalletAddress()
  return walletAddress?.toString() ?? 'Adresse inconnue'
}

// Typage précis, en évitant le "any"
export function useSolanaCluster(): string {
  const client = useSolanaClient()
  // Si client n’a pas le type précis, on le check avant d’accéder à cluster
  return (client && 'cluster' in client) ? (client.cluster as string) : 'unknown'
}
