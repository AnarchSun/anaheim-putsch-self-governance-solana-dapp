import { useMemo } from 'react';

export type ClusterLabel = 'mainnet' | 'devnet' | 'testnet';

interface ClusterConfig {
  urlOrMoniker: string;
  label: ClusterLabel;
}

function getClusterConfig(clusterLabel: ClusterLabel): ClusterConfig {
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

export function useClusterConfig(clusterLabel: ClusterLabel): ClusterConfig {
  return useMemo(() => getClusterConfig(clusterLabel), [clusterLabel]);
}
