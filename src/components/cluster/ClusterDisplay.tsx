// src/components/cluster/ClusterDisplay.tsx
'use client'

import React from 'react'
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
      return { urlOrMoniker: 'devnet', label: 'devnet (default)' }
  }
}

export function getClusterUrl(clusterLabel: ClusterLabel): string {
  const config = getClusterConfig(clusterLabel)
  return clusterApiUrl(config.urlOrMoniker)
}

export function ClusterDisplay({ clusterLabel }: { clusterLabel: ClusterLabel }) {
  const config = getClusterConfig(clusterLabel)
  const url = getClusterUrl(clusterLabel)

  return (
    <div className="p-4 border rounded-xl bg-zinc-900 text-zinc-100 shadow-md space-y-2">
      <div><strong>Cluster:</strong> {config.label}</div>
      <div><strong>RPC URL:</strong> <code>{url}</code></div>
    </div>
  )
}
