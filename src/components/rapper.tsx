// src/components/rapper.tsx
'use client'

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


interface RapperProps {
  address?: string
  param2?: any
  param3?: any
}

export function Rapper({ address, param2, param3 }: RapperProps) {
  // Utilise address, param2, param3 au besoin
  // Exemple simplifié :

  return (
    <div className="bg-black text-white p-4 rounded-xl mt-6">
      <p className="mt-2 text-sm text-gray-400">
        Monitoring signatures on <code>{address ?? DEFAULT_ADDRESS}</code>
      </p>
    </div>
  )
}

