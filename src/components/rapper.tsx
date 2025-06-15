'use client'

import { useEffect } from 'react'
import { PublicKey, ConfirmedSignatureInfo } from '@solana/web3.js'
import { useWrappedConnection } from '@/hooks/solana/useWrappedConnection.tsx'
import { getClusterUrl } from '@/hooks/getClusterUrl'
import { ClusterDisplay } from '@/components/cluster/cluster-ui'

const DEFAULT_ADDRESS = '9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt'
const CLUSTER = "devnet"

export function Rapper() {
  const rpcUrl = getClusterUrl(CLUSTER)
  const wrapped = useWrappedConnection(rpcUrl)

  useEffect(() => {
    const address = new PublicKey(DEFAULT_ADDRESS)
    wrapped.rpc
      .getSignaturesForAddress(address)
      .send()
      .then((sigs: ConfirmedSignatureInfo[]) => {
        console.log(`Signatures for ${DEFAULT_ADDRESS}:`, sigs)
      })
      .catch(console.error)
  }, [wrapped])

  return (
    <div className="bg-black text-white p-4 rounded-xl mt-6">
      <ClusterDisplay clusterLabel={CLUSTER} />
      <p className="mt-2 text-sm text-gray-400">
        Monitoring signatures on <code>{DEFAULT_ADDRESS}</code> via <code>{rpcUrl}</code>
      </p>
    </div>
  )
}
