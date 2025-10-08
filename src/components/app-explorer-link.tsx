// src/components/app-explorer-link.tsx
import { getExplorerLink, GetExplorerLinkArgs } from 'gill'
import useSolana from '@/components/solana/use-solana'
import { ArrowUpRightFromSquare } from 'lucide-react'

const allowedClusters = ["mainnet-beta", "devnet", "testnet", "localhost"] as const;
type SolanaClusterMoniker = typeof allowedClusters[number];

function toClusterMoniker(cluster: string): SolanaClusterMoniker | undefined {
  return allowedClusters.includes(cluster as any) ? (cluster as SolanaClusterMoniker) : undefined;
}

export function AppExplorerLink({ className, label = '', ...link }: GetExplorerLinkArgs & { className?: string; label: string }) {
  const { cluster } = useSolana();
  const clusterValue = toClusterMoniker(cluster);
  return (
      <a
          href={getExplorerLink({ ...link, cluster: clusterValue })}
          target="_blank"
          rel="noopener noreferrer"
          className={className ? className : `link font-mono inline-flex gap-1`}
      >
        {label}
        <ArrowUpRightFromSquare size={12} />
      </a>
  );
}