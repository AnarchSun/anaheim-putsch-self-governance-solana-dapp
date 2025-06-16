'use client'

import { useEffect } from 'react'
import { useWrappedConnection } from '../../hooks/solana/useWrappedConnection'
import { getClusterUrl, ClusterLabel } from '../../lib/cluster'
import { ClusterDisplay } from './ClusterDisplay'
import { Address } from '@solana/kit' // selon ta stack

export function RpcDemo() {
  const clusterLabel: ClusterLabel = 'devnet'
  const rpcUrl = getClusterUrl(clusterLabel)
  const wrapped = useWrappedConnection ( rpcUrl )

  useEffect(() => {
    const address = '9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt' as Address
    wrapped.rpc
      .getSignaturesForAddress(address)
      .send()
      .then((signatures) => {
        console.log('Signatures reçues :', signatures)
      })
      .catch((err) => {
        console.error('Erreur RPC :', err)
      })
  }, [wrapped])

  return (
    <div className="p-4 bg-gray-900 text-white rounded-xl space-y-2">
      <ClusterDisplay clusterLabel={clusterLabel} />
      <p>Les signatures seront affichées dans la console pour l'adresse donnée sur {rpcUrl}</p>
    </div>
  )
}
