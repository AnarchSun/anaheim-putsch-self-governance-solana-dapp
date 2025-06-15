// lib/cluster/index.ts

import { clusterApiUrl, Cluster } from '@solana/web3.js'

export type ClusterLabel = 'mainnet' | 'devnet' | 'testnet'

export function getClusterConfig(clusterLabel: ClusterLabel): { urlOrMoniker: Cluster; label: string } {
  switch (clusterLabel) {
    case 'mainnet':
      return { urlOrMoniker: 'mainnet-beta', label: 'mainnet' }
    case 'devnet':
      return { urlOrMoniker: 'devnet', label: 'devnet' }
    case 'testnet':
      return { urlOrMoniker: 'testnet', label: 'testnet' }
    default:
      return { urlOrMoniker: 'devnet', label: 'devnet' }
  }
}

export function getClusterUrl(clusterLabel: ClusterLabel): string {
  const config = getClusterConfig(clusterLabel)
  return clusterApiUrl(config.urlOrMoniker)
}
