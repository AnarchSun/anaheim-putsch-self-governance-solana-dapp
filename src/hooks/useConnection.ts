// hooks/useConnection.ts
import { Connection } from '@solana/web3.js'
import { useClusterEndpoint } from './useClusterEndpoint'

export function useConnection() {
  const endpoint = useClusterEndpoint()
  return new Connection(endpoint, 'confirmed')
}
