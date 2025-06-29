import { useQuery } from '@tanstack/react-query'
import { createSolanaClient } from 'gill'
import { useSolanaWalletAddress } from '@/components/wallet/WalletContextProvider'

const solanaClientInstance = createSolanaClient({ urlOrMoniker: 'devnet' })

export function useSolanaClient() {
  return useQuery({
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
 * 🧭 Détecte dynamiquement le cluster courant à partir d'endpoint RPC utilisé par le client.
 */
export function useSolanaCluster(): string {
  const client = useSolanaClient()
  const url = (client as any)?._connection?.rpcEndpoint ?? ''

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
