import { useSolanaClient } from '@/hooks/solana/useSolanaClient'

export function useSolanaConnectionAndCluster(cluster: 'devnet' | 'testnet' | 'mainnet-beta' = 'devnet') {
  const connection = useSolanaClient(cluster)
  const url = connection.rpcEndpoint

  const clusterName =
    url.includes('devnet') ? 'devnet' :
      url.includes('mainnet') ? 'mainnet-beta' :
        url.includes('testnet') ? 'testnet' :
          'custom'

  return { connection, cluster: clusterName }
}
