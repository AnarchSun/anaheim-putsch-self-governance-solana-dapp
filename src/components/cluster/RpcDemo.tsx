// src/components/cluster/RpcDemo.tsx
"use client"

import { useEffect } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useWrappedConnection } from '@/hooks/solana/useWrappedConnection'
import { any, unknown } from 'zod'
import { address } from '@trezor/utxo-lib'

export function RpcDemo() {
  const rpcUrl = 'https://api.devnet.solana.com'
  const wrapped = useWrappedConnection ( rpcUrl, address, unknown, any )

  useEffect(() => {
    const address = new PublicKey('9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt')
    wrapped.getSignaturesForAddress(address)
      .then((signatures: any) => {
        console.log('Signatures reçues :', signatures)
      })
      .catch(console.error)
  }, [wrapped])

  return <div>Check console for signatures</div>
}
