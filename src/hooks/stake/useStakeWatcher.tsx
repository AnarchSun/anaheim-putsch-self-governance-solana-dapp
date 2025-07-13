// src/hooks/stake/useStakeWatcher.ts
'use client'

import { useEffect, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useConnection } from '@solana/wallet-adapter-react'

export type UseStakeWatcherReturn = {
  state: string | null
  loading: boolean
  error: Error | null
}

export function useStakeWatcher(pubkey: PublicKey): UseStakeWatcherReturn {
  const { connection } = useConnection()
  const [state, setState] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!pubkey || !connection) return
    let active = true

    const run = async () => {
      setLoading(true)
      try {
        // mock de l’état du stake — remplacer par la vraie logique quand prêt
        const mockState = 'active'
        if (active) setState(mockState)
      } catch (e) {
        if (active) setError(e as Error)
      } finally {
        if (active) setLoading(false)
      }
    }

    run().catch(console.error)

    return () => {
      active = false
    }
  }, [pubkey, connection])

  return { state, loading, error }
}
