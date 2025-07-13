// src/hooks/stake/useStakeActivationSafe.tsx
import { useEffect, useState } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { getStakeActivationSafe } from './getStakeActivationSafe'
import {StakeActivationState} from "@/components/wallet/wallet-connect-button";


export function useStakeActivationSafe(pubkey: PublicKey, connection: Connection) {
  const [state, setState] = useState<StakeActivationState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!pubkey || !connection) return
    let active = true

    const run = async () => {
      setLoading(true)
      try {
        const watcher = new getStakeActivationSafe(connection, pubkey)
        await watcher.fetch()

        if (active) {
          const { state, active: act, inactive: inact } = watcher.state

          // Validation stricte de `state`
          const validStates = ['active', 'inactive', 'activating', 'deactivating'] as const
          if (validStates.includes(state as typeof validStates[number])) {
            setState({
              state: state as "active" | "inactive" | "activating" | "deactivating",
              active: act,
              inactive: inact,
            })
          } else {
            console.warn("Invalid stake state:", state)
          }
        }
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
