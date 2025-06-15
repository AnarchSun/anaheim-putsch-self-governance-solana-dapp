import { useMemo } from 'react'
import { Connection } from '@solana/web3.js'
import { wrapConnectionWithRpc } from '@/lib/solana/wrapConnectionWithRpc'
import { getPublicSolanaRpcUrl } from 'gill'
import type { SolanaClient } from 'gill'

// Par exemple, on hardcode le cluster ici
const CLUSTER = 'devnet' as const

export function useWrappedConnection(): SolanaClient {
  // On passe le cluster au getter d’URL RPC
  const rpcUrl = getPublicSolanaRpcUrl(CLUSTER)

  const connection = useMemo(() => new Connection(rpcUrl, 'confirmed'), [rpcUrl])

  const wrapped = useMemo(() => new wrapConnectionWithRpc ( connection ), [connection])

  return wrapped as SolanaClient
}
