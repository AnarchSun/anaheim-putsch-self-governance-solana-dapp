'use client'

import { useEffect } from 'react'
import { useWrappedConnection } from '@/hooks/solana/useWrappedConnection'
import { getClusterUrl } from '@/hooks/cluster/getClusterUrl'
import { getPublicSolanaRpcUrl, toAddress } from '@/lib/solana/solanaKitShim'

// Un cast brutal mais contrôlé :
// Ici on dit au compilateur TS "Fais-moi confiance, c’est la même essence"
const castAddress = (addr: ReturnType<typeof toAddress>) =>
  addr as unknown as import('@solana/addresses/dist/types/address').Address

const DEFAULT_ADDRESS = '9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt'
const CLUSTER = 'devnet'

class Connection {
  // TODO ORION MY DEAR!
}

class PublicKey {
  // TODO ORION MY DEAR!
}

class ConfirmedSignatureInfo {
  // TODO ORION MY DEAR!
}

export function Rapper(_address: any, any: any, unknown: any) {
  const rpcUrl = getClusterUrl(CLUSTER)
  const wrapped = useWrappedConnection ( rpcUrl, _address, unknown, any )

  useEffect(() => {
    const addressShim = toAddress(DEFAULT_ADDRESS)
    const address = castAddress(addressShim)
    const wrapped: {
      rpcUrl: getPublicSolanaRpcUrl
      connection: Connection
      getSignaturesForAddress: (address: PublicKey, limit?: number) => Promise<ConfirmedSignatureInfo[]>
      rpc: undefined
    }
    wrapped.rpc
      .getSignaturesForAddress()
      .send()
      .then((sigs) => {
        console.log(`Signatures for ${DEFAULT_ADDRESS}:`, sigs)
      })
      .catch(console.error)
  }, [wrapped])

  return (
    <div className="bg-black text-white p-4 rounded-xl mt-6">
      <div>{CLUSTER}</div>
      <p className="mt-2 text-sm text-gray-400">
        Monitoring signatures on <code>{DEFAULT_ADDRESS}</code> via <code>{rpcUrl}</code>
      </p>
    </div>
  )
}
