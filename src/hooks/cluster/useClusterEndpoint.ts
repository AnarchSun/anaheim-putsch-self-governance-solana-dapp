// hooks/useClusterEndpoint.ts
import { clusterApiUrl, Cluster } from '@solana/web3.js'

// TypeScript te proposera 'devnet' | 'testnet' | 'mainnet-beta'
export function useClusterEndpoint(cluster: Cluster = 'devnet'): string {
  return clusterApiUrl(cluster)
}
