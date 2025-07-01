// src/components/rapper.tsx
'use client'

import { useEffect } from 'react'
import { useWrappedConnection } from '@/hooks/solana/useWrappedConnection'
import { getClusterUrl } from '@/hooks/cluster/getClusterUrl'
import { ConfirmedSignatureInfo, Connection, PublicKey } from '@solana/web3.js'

interface RpcInterface {
  getSignaturesForAddress: (address: PublicKey, limit?: number) => {
    send: () => Promise<ConfirmedSignatureInfo[]>
  }
}

interface WrappedConnection {
  rpc: RpcInterface
  connection: Connection
  rpcUrl: string
}

const DEFAULT_ADDRESS = '9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt'
const CLUSTER = 'devnet'

import React from 'react'

interface RapperProps {
  address?: string
  param2?: any
  param3?: any
}

export function Rapper({ address, param2, param3 }: RapperProps) {
  // Utilise address, param2, param3 au besoin
  // Exemple simplifié :
  const rpcUrl = getClusterUrl(CLUSTER)

  return (
    <div className="bg-black text-white p-4 rounded-xl mt-6">
      <div>{CLUSTER}</div>
      <p className="mt-2 text-sm text-gray-400">
        Monitoring signatures on <code>{address ?? DEFAULT_ADDRESS}</code> via <code>{rpcUrl}</code>
      </p>
    </div>
  )
}

