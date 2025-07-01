import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react'
import { useSolanaClient } from 'gill-react'

export const useSolanaWalletAddress = () => {
  const wallet = useSolanaWallet()
  return wallet.publicKey?.toBase58()
}

// On utilise le hook normalement, pas "new"
export function useWalletUiAddress(): string {
  const walletAddress = useSolanaWalletAddress()
  return walletAddress?.toString() ?? 'Adresse inconnue'
}

// Typage précis, en évitant le "any"
export function useSolanaCluster(): string {
  const client = useSolanaClient()
  return (client && 'cluster' in client) ? (client.cluster as string) : 'unknown'
}
