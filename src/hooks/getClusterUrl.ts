import { clusterApiUrl, Cluster } from '@solana/web3.js';
import type { ClusterLabel } from './getClusterConfig.ts';

interface ClusterConfig {
  urlOrMoniker: Cluster;
  label: ClusterLabel;
}
const rpcUrl = getClusterUrl('devnet') // "https://api.devnet.solana.com"
console.log('RPC URL:', rpcUrl);

export function getClusterConfig(clusterLabel: ClusterLabel): ClusterConfig {
  switch (clusterLabel) {
    case 'mainnet':
      return { urlOrMoniker: 'mainnet-beta', label: 'mainnet' };
    case 'devnet':
      return { urlOrMoniker: 'devnet', label: 'devnet' };
    case 'testnet':
      return { urlOrMoniker: 'testnet', label: 'testnet' };
    default:
      return { urlOrMoniker: 'devnet', label: 'devnet' };
  }
}

export function getClusterUrl(clusterLabel: ClusterLabel): string {
  const config = getClusterConfig(clusterLabel);
  return clusterApiUrl(config.urlOrMoniker);
}
