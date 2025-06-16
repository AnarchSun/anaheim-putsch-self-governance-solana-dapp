import { useMemo } from 'react'
import { Connection } from '@solana/web3.js'
import { getPublicSolanaRpcUrl } from '@/lib/solana/solanaKitShim'

const DEFAULT_CLUSTER = 'devnet'

export function useWrappedConnection(cluster = DEFAULT_CLUSTER) {
  const rpcUrl = new getPublicSolanaRpcUrl(cluster)

  const connection = useMemo(() => {
    // Ici on passe bien une chaîne URL valide
    return new Connection(rpcUrl.toString(), 'confirmed')
  }, [rpcUrl])

  return { rpcUrl, connection }
}
