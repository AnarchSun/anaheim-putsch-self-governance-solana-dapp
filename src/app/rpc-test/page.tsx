// src/app/rpc-test/page.tsx
'use client'

import React, { useMemo } from 'react'
import { clusterApiUrl } from '@solana/web3.js'

export default function RpcTestPage() {
  const endpoint = useMemo(() => clusterApiUrl('devnet'), [])

  return (
      <div className="p-4 text-white">
        <h1>RPC Test</h1>
        <p>Endpoint utilisé : {endpoint}</p>
      </div>
  )
}
