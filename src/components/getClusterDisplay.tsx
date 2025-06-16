// src/components/getClusterDisplay.tsx
import React from 'react'
import './App.css'
import { ClusterLabel, useClusterConfig } from '@/hooks/getClusterConfig.js'
import { PublicKey } from '@solana/web3.js' // si tu veux appliquer du style
export function ClusterDisplay({ clusterLabel, label }: { clusterLabel: ClusterLabel; label?: string }) {
  const config = useClusterConfig(clusterLabel)

  const addressString = '9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt'
  const publicKey = new PublicKey(addressString)
  const shortKey = publicKey.toBase58().slice(0, 8) + '…'

  return (
    <div className="cluster-display">
      <h2>🌐 Cluster Info</h2>
      <p>
        <strong>Label:</strong> {label ?? config.label}
      </p>
      <p>
        <strong>RPC:</strong> {config.urlOrMoniker}
      </p>
      <p>
        <strong>Clé Publique:</strong> {shortKey}
      </p>
    </div>
  )
}

export default ClusterDisplay
