// src/hooks/stake/useStakeActivation.ts
'use client'

import { useEffect, useState } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { getStakeActivationSafe } from '@/hooks/solana/useSolanaClient'

export function useStakeActivation(pubkey: PublicKey, connection: Connection) {
  const [state, setState] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!pubkey || !connection) return
    let active = true

    setLoading(true)

    const run = async () => {
      try {
        const watcher = await getStakeActivationSafe(connection, pubkey) as any
        await watcher.fetch()
        if (!active) return
        setState(watcher.state)
      } catch (e) {
        if (!active) return
        setError(e as Error)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    run().catch((err) => {
      console.error('Unhandled error in useStakeActivation:', err)
    })

    return () => {
      active = false
    }
  }, [pubkey, connection])

  return { state, loading, error }
}
