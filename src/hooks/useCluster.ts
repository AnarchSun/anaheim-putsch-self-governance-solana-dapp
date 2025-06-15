// hooks/useCluster.ts
import { useWalletUiCluster } from '@wallet-ui/react'

export function useCluster() {
  return new (useWalletUiCluster as any) ()
}
const { cluster } = useCluster()
console.log('[DEBUG] Cluster info:', cluster)
