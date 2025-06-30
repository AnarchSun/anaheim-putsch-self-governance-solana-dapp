// src/hooks/wallet/wallet-hooks.ts


import { useQuery } from '@tanstack/react-query'
import { createSolanaClient, SolanaClient } from 'gill'
import { useSolanaWalletAddress } from '@wallet-ui/react'

const solanaClientInstance: SolanaClient = createSolanaClient({ urlOrMoniker: 'devnet' })

export function useSolanaClient(): SolanaClient | undefined {
  return useQuery<SolanaClient>({
    queryKey: ['solana-client'],
    queryFn: async () => {
      return solanaClientInstance
    },
    staleTime: Infinity,
  }).data
}

/**
 * 🧠 Retourne l'adresse du wallet connecté sous forme de string lisible.
 * Si aucune adresse, retourne "Adresse inconnue".
 */
export function useWalletUiAddress(): string {
  const walletAddress = useSolanaWalletAddress()
  return walletAddress?.toString?.() ?? 'Adresse inconnue'
}

/**
 * 🧭 Détecte dynamiquement le cluster courant à partir de l'endpoint RPC utilisé par le client.
 */
export function useSolanaCluster(): string {
  const client = useSolanaClient()
  // Safely check if rpcEndpoint exists on client
  const url = client && typeof client === 'object' && 'rpcEndpoint' in client ? (client as any).rpcEndpoint : ''

  if (url.includes('devnet')) return 'devnet'
  if (url.includes('testnet')) return 'testnet'
  if (url.includes('mainnet')) return 'mainnet-beta'
  return 'unknown'
}


/**
 * 🔁 Alias explicite pour accéder au cluster via un hook.
 */
export function useWalletUiCluster(): string {
  return useSolanaCluster()
}

/**
 * 🧬 Hook combiné : expose client + cluster + adresse publique du wallet.
 */
export function useWalletUi() {
  const client = useSolanaClient()
  const cluster = useSolanaCluster()
  const address = useWalletUiAddress()

  return { client, cluster, address }
}
