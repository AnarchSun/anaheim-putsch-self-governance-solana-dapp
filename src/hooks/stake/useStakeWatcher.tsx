// src/hooks/stake/useStakeWatcher.ts
import { useState, useEffect } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { getStakeActivationSafe, StakeActivationState } from '@/../../eco-subsystem/complementary-modules/getStakeActivation/js/src/stake'

interface UseStakeWatcherReturn {
  state: StakeActivationState | null
  loading: boolean
  error: Error | null
}

export function useStakeWatcher(pubkey: PublicKey): UseStakeWatcherReturn {
  const [state, setState] = useState<StakeActivationState | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isActive = true

    async function fetchState() {
      setLoading(true)
      setError(null)

      const connection = new Connection('https://api.devnet.solana.com')
      const watcher = new getStakeActivationSafe(connection, 10000, pubkey)

      try {
        await watcher.fetch()
        if (!isActive) return
        setState(watcher.state)
      } catch (err) {
        if (!isActive) return
        setError(err as Error)
      } finally {
        if (isActive) setLoading(false)
      }
    }

    fetchState().catch(console.error)

    return () => {
      isActive = false
    }
  }, [pubkey])

  return { state, loading, error }
}
