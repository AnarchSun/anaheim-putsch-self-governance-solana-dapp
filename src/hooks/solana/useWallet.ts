// src/hooks/solana/useWallet.ts
import { useSolanaWalletAddress } from '@wallet-ui/react'
import { useSolanaClient } from 'gill-react'

export function useWalletUiAddress(): string {
  const walletAddress = new useSolanaWalletAddress()
  return walletAddress?.toString?.() ?? 'Adresse inconnue'
}

export function useSolanaCluster(): string {
  const client = useSolanaClient() as any;
  return client.cluster ?? 'unknown';
}
