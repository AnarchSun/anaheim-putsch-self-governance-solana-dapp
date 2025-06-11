// hooks/useClusterEndpoint.ts
import { clusterApiUrl } from '@solana/web3.js'

export function useClusterEndpoint() {
  // TODO: Replace with Zustand/store logic if needed
  return clusterApiUrl('devnet')
}
