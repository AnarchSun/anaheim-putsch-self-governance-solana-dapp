// src/components/wallet/wallet-connect-button.tsx
'use client'

import { useEffect, useState } from 'react'
import { getStakeActivation } from '@/lib/solana/stake-utils'
import { Connection, PublicKey } from '@solana/web3.js'

export type StakeActivationState = {
  state: 'active' | 'inactive' | 'activating' | 'deactivating'
  active: number
  inactive: number
}

const validStates = ['active', 'inactive', 'activating', 'deactivating'] as const
type ValidState = typeof validStates[number]

function isValidStakeState(value: string): value is ValidState {
  return validStates.includes(value as ValidState)
}

export function useStakeActivationStatus(pubkey: PublicKey, connection: Connection) {
  const [status, setStatus] = useState<StakeActivationState | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  const pubkeyStr = pubkey.toBase58()

  useEffect(() => {
    if (!pubkey || !connection) return

    setLoading(true)

    ;(async () => {
      try {
        const result = await getStakeActivation(pubkey, connection)

        if (!isValidStakeState(result.state)) {
          console.warn(`Invalid stake state: ${result.state}`)
          setError(new Error(`Invalid stake state: ${result.state}`))
          setStatus(null)
          return
        }


        setStatus({
          state: result.state,
          active: Number(result.active),
          inactive: Number(result.inactive),
        })

        setError(null)
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error('Erreur inconnue'))
      } finally {
        setLoading(false)
      }
    })()
  }, [pubkeyStr, connection])

  return { status, error, loading }
}
